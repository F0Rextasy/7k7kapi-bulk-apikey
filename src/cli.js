#!/usr/bin/env node
'use strict';

/**
 * 7k7kapi-bulk-apikey CLI — mint 7k7kapi accounts, one API key per account, and
 * keep only the keys that survived a live chat call + a tool call.
 *
 * The panel is a New API fork (`/api/status`, `/api/user/register`, `/api/token/`)
 * with the register captcha OFF and e-mail verification ON. One thing differs from
 * a stock fork: a token left in the `default` group answers
 * `503 No available channel for model deepseek-v4.1-flash` — the key has to be
 * created inside the group whose channels actually serve the model
 * (`DeepSeek（oai接口）`, measured 2026-10-19), which is what `--group` defaults to.
 *
 * Flow, per account, every panel request through one pinned exit from your pool:
 *   1. mailbox    a private temp.tf hotmail/outlook plus-alias by default
 *                 (`--mail emailnator` switches to a fresh @gmail.com instead)
 *   2. status     `GET /api/status` → gates (register on, e-mail verification on)
 *   3. send code  `GET /api/verification?email=…` → panel mails the code
 *   4. code       poll Emailnator (`/api/message-list` → `/api/message/<id>`)
 *   5. register   `POST /api/user/register` {username,password,email,verification_code}
 *   6. login      `POST /api/user/login` → access_token
 *   7. key        `POST /api/token/` in the model's group (+ reveal `POST /api/token/<id>/key`)
 *   8. gate       two different prompts (both 200, non-empty, different) and a
 *                 `get_time` tool call → 200 with `tool_calls`
 *
 * A key is appended to `keys.txt` only after step 8 passes — a key that never
 * passes is recorded in `accounts.json` and retried on the next run.
 *
 * Options:
 *   --count N        accounts (= keys) to mint                        [5]
 *   --conc N         accounts in flight at once, max 8                [1]
 *   --gap MS         pause between accounts                           [1200]
 *   --model <id>     model used for the live gate       [deepseek-v4.1-flash]
 *   --group <name>   token group the key is created in   [DeepSeek（oai接口）]
 *   --alt-groups G   fallback groups, comma separated                   [default]
 *   --checkin        also run the daily check-in (locked here without a top-up)
 *   --pool <file>    proxy list, one exit per line (env 7K7KAPI_PROXIES) [optional]
 *   --tries N        exits tried per account before giving up           [2]
 *   --timeout MS     per-request timeout                             [60000]
 *   --verify-only    re-run every key in keys.txt through the gate
 *   --screen         only test the proxy list against 7k7kapi
 *   --help
 *
 * Zero dependencies. Node.js >= 18. Your proxy list is OPTIONAL: pass --pool
 * (or the 7K7KAPI_PROXIES env) and every request goes through an exit from it;
 * without a pool the tool connects directly.
 */

const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const http = require('http');
const crypto = require('crypto');

const ROOT = path.basename(__dirname) === 'src' ? path.resolve(__dirname, '..') : __dirname;
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.json');
const OUT_DIR = path.join(ROOT, 'out');
const DEAD_FILE = path.join(ROOT, 'keys-dead.txt');
/** Dead keys from the last verify run (one `key<TAB># reason` per line). */
const writeDead = (dead) => fs.writeFileSync(DEAD_FILE, dead.map((d) => `${d.key}\t# ${d.why}`).join('\n') + (dead.length ? '\n' : ''));

const BASE = process.env['7K7KAPI_BASE'] || 'https://www.7k7kapi.xyz';
const EMAILNATOR = 'https://www.emailnator.com';
const TEMPTF = 'https://temp.tf';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36';

// ------------------------------------------------------------------- options
const argv = process.argv.slice(2);
function arg(name, dflt) {
  const eq = argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
  return dflt;
}
const has = (name) => argv.includes(`--${name}`) || argv.includes(`-${name}`);

if (has('help') || has('h')) {
  console.log(`7k7kapi-bulk-apikey — mint 7k7kapi accounts, one key each, verified by a live chat + tool call.

  node src/cli.js --count 5          mint (a key is kept only after the gate passes)
  node src/cli.js --verify-only      re-check every key in keys.txt
  node src/cli.js --screen           test your proxy list against 7k7kapi
  node src/cli.js --help

  --count N      accounts to mint                                        [5]
  --conc N       accounts in flight (max 8)                              [1]
  --mail <rail>  emailnator | temptf (private hotmail/outlook alias) [temptf]
  --model <id>   model used for the live gate         [deepseek-v4.1-flash]
  --group <name> token group the key is created in     [DeepSeek（oai接口）]
  --pool <file>  proxy list, one exit per line (env 7K7KAPI_PROXIES) [optional]

Requests go through your proxy list when one is provided (--pool / env).
Without a pool the tool connects directly.`);
  process.exit(0);
}

const COUNT = Math.max(1, parseInt(arg('count', '5'), 10) || 5);
const CONC = Math.min(8, Math.max(1, parseInt(arg('conc', '1'), 10) || 1));
const GAP_MS = Math.max(0, parseInt(arg('gap', '1200'), 10) || 0);
const TRIES = Math.max(1, parseInt(arg('tries', '2'), 10) || 2);
const TIMEOUT_MS = Math.max(5000, parseInt(arg('timeout', '60000'), 10) || 60000);
const MODEL = arg('model', 'deepseek-v4.1-flash');
const GROUP = arg('group', 'DeepSeek（oai接口）');
const ALT_GROUPS = arg('alt-groups', 'default').split(',').map((s) => s.trim()).filter(Boolean);
const CHECKIN = has('checkin');
const VERIFY_ONLY = has('verify-only');
const SCREEN = has('screen');
const MAIL = String(arg('mail', 'temptf')).toLowerCase();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT_DIR, { recursive: true });
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);
const randUser = () => `kk${crypto.randomBytes(5).toString('hex')}`;
const randPass = () => `Wt${crypto.randomBytes(6).toString('base64url')}9a`;

// ------------------------------------------------------------------- proxy
function parseProxy(line) {
  const s = String(line || '').trim();
  if (!s || s.startsWith('#')) return null;
  let m = s.match(/^(https?|socks5h?|socks4):\/\/(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)/i);
  if (!m) m = s.match(/^(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)$/);
  if (!m) return null;
  if (m.length === 6) {
    const raw = m[1].toLowerCase();
    if (raw === 'socks4') return null;
    const protocol = raw.startsWith('socks') ? 'socks5' : 'http';
    return { protocol, host: m[4], port: Number(m[5]), auth: m[2] ? `${m[2]}:${m[3]}` : null, line: s };
  }
  return { protocol: 'http', host: m[3], port: Number(m[4]), auth: m[1] ? `${m[1]}:${m[2]}` : null, line: s };
}

/** A raw socket straight to host:port (no proxy) — the direct-mode twin of connectThrough. */
function directConnect(host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host, port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`connect timeout (${host}:${port})`)); }, timeoutMs);
    sock.once('error', (e) => { clearTimeout(t); try { sock.destroy(); } catch {} reject(new Error(`connect failed: ${e.message}`)); });
    sock.once('connect', () => { clearTimeout(t); resolve(sock); });
  });
}

function connectThrough(proxy, host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host: proxy.host, port: proxy.port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`proxy timeout (${proxy.host}:${proxy.port})`)); }, timeoutMs);
    const done = (err, s) => { clearTimeout(t); if (err) { try { sock.destroy(); } catch {} reject(err); } else resolve(s); };
    sock.once('error', (e) => done(new Error(`proxy connect failed: ${e.message}`)));
    sock.once('connect', () => {
      if (proxy.protocol === 'socks5') {
        sock.write(proxy.auth ? Buffer.from([5, 2, 0, 2]) : Buffer.from([5, 1, 0]));
        let stage = 0;
        let buf = Buffer.alloc(0);
        const sendConnect = () => {
          const hb = Buffer.from(host);
          sock.write(Buffer.concat([Buffer.from([5, 1, 0, 3, hb.length]), hb, Buffer.from([port >> 8, port & 0xff])]));
        };
        const onData = (d) => {
          try {
            buf = Buffer.concat([buf, d]);
            for (;;) {
              if (stage === 0) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[0] !== 5) return done(new Error('SOCKS5 bad version'));
                if (v[1] === 2) {
                  if (!proxy.auth) return done(new Error('SOCKS5 auth required'));
                  const [u, p] = proxy.auth.split(':');
                  sock.write(Buffer.concat([Buffer.from([1, u.length]), Buffer.from(u), Buffer.from([p.length]), Buffer.from(p)]));
                  stage = 1;
                  continue;
                }
                if (v[1] !== 0) return done(new Error('SOCKS5 no acceptable method'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 1) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[1] !== 0) return done(new Error('SOCKS5 auth failed'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 2) {
                if (buf.length < 5) return;
                const atyp = buf[3];
                const need = 4 + (atyp === 1 ? 4 : atyp === 3 ? 1 + buf[4] : 16) + 2;
                if (buf.length < need) return;
                const rep = buf[1]; buf = buf.slice(need);
                if (rep !== 0) return done(new Error(`SOCKS5 connect failed (code ${rep})`));
                sock.off('data', onData);
                return done(null, sock);
              }
            }
          } catch (e) { done(e); }
        };
        sock.on('data', onData);
        return;
      }
      const auth = proxy.auth ? `Proxy-Authorization: Basic ${Buffer.from(proxy.auth).toString('base64')}\r\n` : '';
      sock.write(`CONNECT ${host}:${port} HTTP/1.1\r\nHost: ${host}:${port}\r\n${auth}\r\n`);
      let buf = '';
      const onData = (d) => {
        buf += d;
        if (!buf.includes('\r\n\r\n')) return;
        sock.off('data', onData);
        if (!/^HTTP\/\d(\.\d)? 200/.test(buf)) return done(new Error(`proxy CONNECT refused: ${buf.split('\r\n')[0]}`));
        done(null, sock);
      };
      sock.on('data', onData);
    });
  });
}

/** One HTTPS request through one exit. Returns { status, headers, body }. */
async function exitFetch(proxy, url, { method = 'GET', headers = {}, body = null, timeoutMs = TIMEOUT_MS } = {}) {
  const u = new URL(url);
  const raw = proxy ? await connectThrough(proxy, u.hostname, u.port || 443, timeoutMs) : await directConnect(u.hostname, u.port || 443, timeoutMs);
  const sock = tls.connect({ socket: raw, servername: u.hostname });
  await new Promise((res, rej) => { sock.once('secureConnect', res); sock.once('error', rej); });
  const chunks = [];
  let resolve, reject;
  const p = new Promise((res, rej) => { resolve = res; reject = rej; });
  const req = http.request({
    method,
    path: u.pathname + u.search,
    createConnection: () => sock,
    headers: { host: u.host, 'user-agent': UA, accept: '*/*', ...headers },
  });
  const t = setTimeout(() => { try { req.destroy(); } catch {} reject(new Error('request timeout')); }, timeoutMs);
  req.on('response', (res) => {
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => {
      clearTimeout(t);
      resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') });
    });
  });
  req.on('error', (e) => { clearTimeout(t); reject(e); });
  if (body != null) req.write(Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)));
  req.end();
  return p;
}

// JSON or SSE (`text/event-stream`): some forks answer stream-shaped even with stream:false.
const J = (t) => {
  try { return JSON.parse(t); } catch {}
  const events = String(t).split(/\r?\n/).filter((l) => l.startsWith('data:'));
  if (!events.length) return null;
  let content = '', reasoning = '', finish = null, id = null, model = null;
  const toolCalls = [];
  for (const line of events) {
    const payload = line.slice(5).trim();
    if (!payload || payload === '[DONE]') continue;
    let j; try { j = JSON.parse(payload); } catch { continue; }
    id = id || j.id; model = model || j.model;
    const c = j.choices && j.choices[0];
    if (!c) continue;
    const d = c.delta || c.message || {};
    if (d.content) content += d.content;
    if (d.reasoning_content) reasoning += d.reasoning_content;
    else if (d.reasoning) reasoning += d.reasoning;
    for (const tc of d.tool_calls || []) {
      const i = tc.index || 0;
      toolCalls[i] = toolCalls[i] || { id: tc.id, function: { name: '', arguments: '' } };
      if (tc.function && tc.function.name) toolCalls[i].function.name = tc.function.name;
      if (tc.function && tc.function.arguments) toolCalls[i].function.arguments += tc.function.arguments;
    }
    if (c.finish_reason) finish = c.finish_reason;
  }
  const message = { content, reasoning_content: reasoning };
  if (toolCalls.length) message.tool_calls = toolCalls.filter(Boolean);
  return { id, model, choices: [{ message, finish_reason: finish }] };
};

async function exitJson(proxy, url, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  const body = opts.body;
  if (body != null && !Buffer.isBuffer(body)) headers['content-type'] = 'application/json';
  const r = await exitFetch(proxy, url, { ...opts, headers });
  return { status: r.status, json: J(r.body), text: r.body };
}

// ------------------------------------------------------------------- pool
function loadExits() {
  const poolArg = arg('pool', process.env['7K7KAPI_PROXIES'] || 'proxies.txt');
  const poolFile = fs.existsSync(path.resolve(poolArg)) ? path.resolve(poolArg) : path.resolve(ROOT, poolArg);
  if (!fs.existsSync(poolFile)) {
    console.log(`no proxy list at ${poolFile} — running WITHOUT a proxy (direct). Put exits there (or pass --pool) to route through them.`);
    return [null];
  }
  const exits = fs.readFileSync(poolFile, 'utf8').split(/\r?\n/).map(parseProxy).filter(Boolean);
  if (!exits.length) {
    console.log(`${poolFile} has no usable exits — running WITHOUT a proxy (direct).`);
    return [null];
  }
  return exits;
}

async function screen(exits) {
  let ok = 0;
  for (const e of exits.slice(0, 64)) {
    try {
      const t0 = Date.now();
      const r = await exitFetch(e, `${BASE}/api/status`, { timeoutMs: 20000 });
      const good = r.status === 200 && /"data"/.test(r.body);
      if (good) ok++;
      console.log(`  ${good ? '✔' : '✘'} ${e ? `${e.host}:${e.port}` : 'direct'} status=${r.status} ${Date.now() - t0}ms`);
    } catch (err) {
      console.log(`  ✘ ${e ? `${e.host}:${e.port}` : 'direct'} ${String(err.message).slice(0, 80)}`);
    }
  }
  console.log(`screened ${Math.min(exits.length, 64)} exit(s): ${ok} reach ${BASE}`);
  return ok;
}

// ------------------------------------------------------------------- mail
// temp.tf hands out real gmail/outlook addresses (one private address per
// account). The panel refuses **plus** aliases (`系统不支持使用别名邮箱注册`) and
// only accepts mainstream domains, so the rail asks for a **dotted** gmail
// (`<dotted local part> [at] gmail.com`) — same mailbox, a form the panel takes.
// The panel's own mail names the code as `<strong>952648</strong>` behind 验证码.
const CODE_RE = /(?:验证码|code|verification|kodu)[^\d]{0,24}(\d{4,8})/i;
function codeFrom(blob) {
  const text = String(blob).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const m = text.match(CODE_RE) || text.match(/\b(\d{6})\b/);
  return m ? m[1] : null;
}
async function newMailbox(exit) {
  if (MAIL === 'temptf') {
    const r = await exitJson(exit, `${TEMPTF}/api/account?providers=gmail&dot=1&plus=0`);
    const address = String((r.json && r.json.email) || '').trim();
    if (!/@/.test(address)) throw new Error(`temp.tf account ${r.status}: ${String(r.text).slice(0, 120)}`);
    return { rail: 'temptf', dotted: address, plain: address };
  }
  const r = await exitJson(exit, `${EMAILNATOR}/api/generate-email`, {
    method: 'POST',
    body: { ids: [3] },
    headers: { origin: EMAILNATOR, referer: `${EMAILNATOR}/` },
  });
  const dotted = r.json && r.json.email;
  if (!dotted || !/@gmail\.com$/i.test(dotted)) throw new Error(`emailnator generate ${r.status}: ${String(r.text).slice(0, 120)}`);
  const [local, domain] = dotted.split('@');
  return { rail: 'emailnator', dotted, plain: `${local.replace(/\./g, '')}@${domain}` };
}

async function pollCode(exit, box, { timeoutMs = 180000, pollMs = 5000 } = {}) {
  const seen = new Set();
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    let msgs = [];
    try {
      const r = box.rail === 'temptf'
        ? await exitJson(exit, `${TEMPTF}/api/check`, { method: 'POST', body: { email: box.plain, wait: false } })
        : await exitJson(exit, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: box.plain, limit: 20 } });
      msgs = (r.json && (r.json.messages || r.json.data)) || [];
    } catch (e) { /* retry */ }
    // Newest first: a shared inbox can still hand back older messages.
    for (const m of [...msgs].reverse()) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      const text = box.rail === 'temptf'
        ? String(m.text || m.html || m.body || '')
        : (await exitJson(exit, `${EMAILNATOR}/api/message/${encodeURIComponent(m.id)}`).catch(() => ({ text: '' }))).text;
      const code = codeFrom(text);
      if (code) return { code, subject: m.subject || '' };
    }
    await sleep(pollMs);
  }
  throw new Error('no verification code inside the window');
}

// ------------------------------------------------------------------- flows
function readKeys() {
  try { return fs.readFileSync(KEYS_FILE, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean); } catch { return []; }
}
function appendKey(key) { fs.appendFileSync(KEYS_FILE, (fs.existsSync(KEYS_FILE) && fs.statSync(KEYS_FILE).size ? '\n' : '') + key + '\n'); }
function loadAccounts() { try { return JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8')); } catch { return []; } }
function saveAccounts(list) { fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(list, null, 2) + '\n'); }

async function signUp(exit) {
  const username = randUser();
  const password = randPass();
  const st = await exitJson(exit, `${BASE}/api/status`);
  const gates = (st.json && st.json.data) || {};
  if (gates.register_enabled === false) throw new Error('register is disabled on the panel right now');
  const box = await newMailbox(exit);
  const sc = await exitJson(exit, `${BASE}/api/verification?email=${encodeURIComponent(box.plain)}`);
  if (!(sc.json && sc.json.success)) throw new Error(`sendCode HTTP ${sc.status}: ${String(sc.text).slice(0, 140)}`);
  const { code, subject } = await pollCode(exit, box);
  const reg = await exitJson(exit, `${BASE}/api/user/register`, {
    method: 'POST',
    body: { username, password, email: box.plain, verification_code: code },
  });
  if (!(reg.json && reg.json.success)) throw new Error(`register HTTP ${reg.status}: ${String(reg.text).slice(0, 140)}`);
  const lg = await exitJson(exit, `${BASE}/api/user/login`, { method: 'POST', body: { username, password } });
  const token = lg.json && lg.json.data && lg.json.data.access_token;
  if (!token) throw new Error(`login HTTP ${lg.status}: ${String(lg.text).slice(0, 140)}`);
  const me = await exitJson(exit, `${BASE}/api/user/self`, { headers: { authorization: `Bearer ${token}` } });
  const data = (me.json && me.json.data) || {};
  const auth = { authorization: `Bearer ${token}` };
  if (data.id) auth['New-Api-User'] = String(data.id);
  let checkin = null;
  if (CHECKIN) {
    checkin = await exitJson(exit, `${BASE}/api/user/checkin`, { method: 'POST', headers: auth }).catch(() => null);
  }
  let key = null;
  let usedGroup = null;
  for (const g of [GROUP, ...ALT_GROUPS]) {
    const created = await exitJson(exit, `${BASE}/api/token/`, {
      method: 'POST',
      headers: auth,
      body: {
        name: `k1${crypto.randomBytes(3).toString('hex')}`,
        remain_quota: 0,
        expired_time: -1,
        // The quota lives on the account: a token capped at 0 is answered
        // "Invalid token" by the relay even when the account holds quota.
        unlimited_quota: true,
        model_limits_enabled: false,
        model_limits: '',
        allow_ips: '',
        group: g,
      },
    });
    const dd = created.json && created.json.data;
    if (dd && dd.key && !String(dd.key).includes('*')) key = dd.key;
    if (!key && dd && dd.id) {
      const kr = await exitJson(exit, `${BASE}/api/token/${dd.id}/key`, { method: 'POST', headers: auth, body: {} });
      const kd = kr.json && kr.json.data;
      const kk = typeof kd === 'string' ? kd : kd && kd.key;
      if (kk && !String(kk).includes('*')) key = kk;
    }
    if (!key) {
      const tl = await exitJson(exit, `${BASE}/api/token/?p=0&size=10`, { headers: auth });
      const items = (tl.json && tl.json.data && tl.json.data.items) || [];
      for (const t2 of items) {
        if (t2.key && !String(t2.key).includes('*')) { key = t2.key; break; }
        if (t2.id) {
          const kr = await exitJson(exit, `${BASE}/api/token/${t2.id}/key`, { method: 'POST', headers: auth, body: {} });
          const kd = kr.json && kr.json.data;
          const kk = typeof kd === 'string' ? kd : kd && kd.key;
          if (kk && !String(kk).includes('*')) { key = kk; break; }
        }
      }
    }
    if (key) { usedGroup = g; break; }
  }
  return { username, password, box, uid: data.id, quota: data.quota, code, subject, key, usedGroup, checkin: checkin ? checkin.status : null };
}

const P1 = 'Reply with the single word: pong';
const P2 = 'Name three colours, comma separated.';
const TOOLS = [{ type: 'function', function: { name: 'get_time', description: 'Returns the current time', parameters: { type: 'object', properties: {} } } }];

async function chatGate(exit, key, model = MODEL) {
  const H = { authorization: `Bearer ${key}` };
  const call = (body) => exitJson(exit, `${BASE}/v1/chat/completions`, { method: 'POST', headers: H, body });
  const a = await call({ model, messages: [{ role: 'user', content: P1 }], max_tokens: 32 });
  const ta = textOf(a.json);
  const b = await call({ model, messages: [{ role: 'user', content: P2 }], max_tokens: 64 });
  const tb = textOf(b.json);
  const sanity = a.status === 200 && b.status === 200 && !!ta && !!tb && ta !== tb;
  let tools = null;
  if (sanity) {
    const c = await call({ model, messages: [{ role: 'user', content: 'What time is it right now? Use the get_time tool.' }], tools: TOOLS, tool_choice: 'auto', max_tokens: 256 });
    const mc = msgOf(c.json);
    const calls = mc.tool_calls || [];
    tools = { status: c.status, present: calls.length > 0, names: calls.map((x) => x && x.function && x.function.name).filter(Boolean) };
  }
  return { ok: sanity, status: a.status || b.status, sanity, tools, sample: String(ta || a.text).slice(0, 120) };
}

const msgOf = (j) => (j && j.choices && j.choices[0] && j.choices[0].message) || {};
function textOf(j) {
  const m = msgOf(j);
  return String(m.content || m.reasoning_content || m.reasoning || '').trim();
}

async function mint() {
  const exits = loadExits();
  if (SCREEN) return void (await screen(exits));
  const accounts = loadAccounts();
  log(`7k7kapi · ${COUNT} key(s) · conc ${CONC} · exits ${exits.filter(Boolean).length || 'direct'} · keys land in keys.txt`);
  let made = 0;
  for (let round = 0; round < COUNT; round += CONC) {
    const jobs = [];
    for (let k = 0; k < CONC && round + k < COUNT; k++) {
      const i = round + k;
      jobs.push((async () => {
        let lastErr = null;
        for (let t2 = 0; t2 < TRIES; t2++) {
          const exit = exits[(i + t2) % exits.length];
          try {
            const rec = await signUp(exit);
            if (!rec.key) { lastErr = new Error('no key material in the token response'); continue; }
            const g = await chatGate(exit, rec.key);
            if (!g.ok) {
              lastErr = new Error(`gate ${g.status}: ${g.sample}`);
              accounts.push({ at: new Date().toISOString(), username: rec.username, email: rec.box.plain, exit: exit ? `${exit.host}:${exit.port}` : 'direct', gate: g.status });
              saveAccounts(accounts);
              continue;
            }
            appendKey(rec.key);
            accounts.push({ at: new Date().toISOString(), username: rec.username, email: rec.box.plain, uid: rec.uid, quota: rec.quota, group: rec.usedGroup ?? null, checkin: rec.checkin ?? null, exit: exit ? `${exit.host}:${exit.port}` : 'direct', key_masked: `${rec.key.slice(0, 8)}…`, gate: 200, tools: g.tools ? g.tools.names.join('+') : null });
            saveAccounts(accounts);
            made++;
            log(`account ${i + 1} ✔ chat-200 ${MODEL} · ${rec.usedGroup || '?'} · tools=${g.tools ? (g.tools.present ? g.tools.names.join('+') : 'none') : '-'} · ${rec.key.slice(0, 8)}…`);
            return;
          } catch (e) { lastErr = e; }
        }
        log(`account ${i + 1}: ${lastErr ? String(lastErr.message).slice(0, 140) : 'failed'}`);
      })());
    }
    await Promise.all(jobs);
    if (GAP_MS) await sleep(GAP_MS);
  }
  log(`done — ${made}/${COUNT} key(s) written to ${KEYS_FILE}`);
}

async function verifyOnly() {
  const exits = loadExits();
  const keys = readKeys();
  if (!keys.length) { console.log(`no keys in ${KEYS_FILE}`); process.exit(0); }
  let live = 0;
  const dead = [];
  for (let i = 0; i < keys.length; i++) {
    const exit = exits[i % exits.length];
    try {
      const g = await chatGate(exit, keys[i]);
      if (g.ok) live++;
      else dead.push({ key: keys[i], why: `chat ${g.status}` });
      console.log(`  ${g.ok ? '✔' : '✘'} ${keys[i].slice(0, 8)}… chat=${g.status} tools=${g.tools ? (g.tools.present ? g.tools.names.join('+') : 'none') : '-'}`);
    } catch (e) {
      dead.push({ key: keys[i], why: String(e.message).slice(0, 90) });
      console.log(`  ✘ ${keys[i].slice(0, 8)}… ${String(e.message).slice(0, 90)}`);
    }
  }
  writeDead(dead);
  console.log(`verify: ${live}/${keys.length} keys live`);
  process.exit(live === keys.length ? 0 : 1);
}

(VERIFY_ONLY ? verifyOnly() : mint()).catch((e) => { console.error('[fatal]', e.message); process.exit(1); });
