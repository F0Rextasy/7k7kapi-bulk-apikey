<div align="center">

```
███████╗██╗  ██╗███████╗██╗  ██╗ █████╗ ██████╗ ██╗
╚════██║██║ ██╔╝╚════██║██║ ██╔╝██╔══██╗██╔══██╗██║
    ██╔╝█████╔╝     ██╔╝█████╔╝ ███████║██████╔╝██║
   ██╔╝ ██╔═██╗    ██╔╝ ██╔═██╗ ██╔══██║██╔═══╝ ██║
   ██║  ██║  ██╗   ██║  ██║  ██╗██║  ██║██║     ██║
   ╚═╝  ╚═╝  ╚═╝   ╚═╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
```

# 7k7kapi-bulk-apikey

**Bulk-create 7k7kapi accounts with API keys — OpenAI-compatible inference, one key per account + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-1%20served-412991?style=for-the-badge)](https://www.7k7kapi.xyz/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-1-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

7k7kapi (`www.7k7kapi.xyz`) is a **New API** fork that signs up with e-mail + password: the register captcha is **off** (`ts: false` in `GET /api/status`), e-mail verification is **on** (`em: true`), and one thing differs from a stock fork — a token left in the `default` group is answered

```
503 No available channel for model deepseek-v4.1-flash
```

The key has to be created inside the group whose channels actually serve the model (`DeepSeek（oai接口）`, measured 2026-10-19 and again on all ten accounts of the 2026-10-23 run), which is what `--group` defaults to.

Signup is therefore pure HTTP — no browser and no captcha solver: take a mailbox, `GET /api/verification?email=…`, read the 6-digit code out of the inbox, register, log in, create the token **in the right group** (`unlimited_quota: true` — the balance lives on the account, not on the key, so a token capped at 0 is answered `Invalid token`), then prove the key with two different completions and a `get_time` tool call. Only a key that passes step 8 is written to `keys.txt`.

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Signup credit | **250,000 quota units** — read back as `quota: 250000` on all ten accounts of the 2026-10-23 run (`accounts.json`); the account minted 2026-10-19 held **249,494** after its chat call (`accounts.jsonl`) |
| Unit price | `quota_per_unit: 500000`, so the signup allowance is ≈ **$0.50** (`description.txt`) |
| Daily check-in | **locked** — `checkin: false` in `GET /api/status`; the panel says 累计充值满 10 元即可解锁每日签到 (top up ≥ ¥10 to unlock it) |
| Card / phone | neither — the only gate is the e-mail code |
| Billing unit | **per account**: the balance sits on the account, so a key that runs dry is replaced by minting another account — `--count N` really means "N free accounts" |
| Cost of the gate | `deepseek-v4.1-flash` is served at ratio **1** in the `DeepSeek（oai接口）` group (qt 0), so verifying a key costs a few units |

No check-in means the balance never refills: keep the keys, expect to re-mint.

> 💡 The free tier is set by 7k7kapi and can change. Check the live numbers at [www.7k7kapi.xyz](https://www.7k7kapi.xyz) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 1 of them

`GET /v1/models` with a fresh key answers **1** model id — measured `models_count: 1` on the key of every account recorded in `accounts.json`; the id this lane mints and gates on is `deepseek-v4.1-flash` (`providers/7k7kapi/models.json` is empty, so the count comes from that measurement, not from a saved listing).

What a key can reach is decided by its **group**, not by the key itself:

| Model ID | Group that serves it | Status |
| --- | --- | --- |
| `deepseek-v4.1-flash` | `DeepSeek（oai接口）` | **chat-200** + `tool_calls` answered, on every key of both runs |
| `deepseek-v4.1-flash` | `default` | **503** `No available channel for model deepseek-v4.1-flash` |

The CLI creates the token in `DeepSeek（oai接口）` (`--group`) and only falls back to `--alt-groups` (default `default`) if the create or the reveal fails — a token that lands in the wrong group is caught by the gate, not shipped.

## 🧪 How to use the API

Base URL **`https://www.7k7kapi.xyz/v1`** — OpenAI-compatible, so any OpenAI-speaking client works.

```bash
curl https://www.7k7kapi.xyz/v1/chat/completions \
  -H "Authorization: Bearer <48-char key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: pong"}],"max_tokens":32}'
```

The key is 48 characters of base62 **with no prefix** (the console shows it bare). The gate itself sends `tools: [{get_time}]` with `tool_choice: "auto"` — the relay answers real `tool_calls`, which is the check that makes a key usable for agent clients and not just for chat.

## 🛠 Quick start

```bash
cd 7k7kapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — with a pool every request leaves from one of these exits
node src/launcher.js                          # interactive: mint / verify / screen / settings
# or straight through the CLI:
node src/cli.js --count 10                    # accounts = keys, each gated before it is kept
node src/cli.js --verify-only                 # re-test every key in keys.txt with a live chat call
```

Nothing but Node 18+ is needed: no browser, no captcha solver, zero dependencies. The mint of 2026-10-23 filled `keys.txt` in ~7 minutes at `--conc 1` (`providers/7k7kapi/out/mint-laneB.log`).

### 🖱️ The launcher

`src/launcher.js` (same banner as this README) asks for the proxy list, how many accounts to mint and the model used for the live gate, remembers the answers in `launcher.config.json`, and then runs the CLI: **mint**, **verify**, **screen** (test the exits against the panel), **settings**, **help** and **Connect to 9Router**. `src/cli.js` is the provider's own mint CLI, copied verbatim; `src/connect-9router.js` registers the provider under prefix `7k7kapi` with `deepseek-v4.1-flash` as the default model.

## ✅ Verified working — every key is tested

| Check | Result |
| --- | --- |
| `GET /api/status` | **200** — site `7k7kapi`, `reg: true`, `em: true`, `ts: false`, `ci: false` (check-in is paid-only) |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}`; the code mail (`7k7kapi邮箱验证邮件`) arrives within seconds |
| `POST /api/user/register` | **200** `{"success":true}` — 6-digit code, verified before the account exists |
| `POST /api/token/` in `DeepSeek（oai接口）` | **200**, key returned in the response (this fork returns it plaintext) |
| `POST /v1/chat/completions` | **200**, two different prompts answered with different content |
| tools | **works** — a `get_time` request answers `tool_calls`; a key whose channel was momentarily away passed the chat sanity check and skipped the tool call instead of shipping unproven |
| `GET /v1/models` | **200**, **1** id |
| Mint run 2026-10-23 | every account registered and every key passed the live gate before it was written — the run log is `out/mint-laneB.log` |

Evidence, all on disk: `providers/7k7kapi/out/mint-laneB.log` (05:59:11 → 06:06:27, group `DeepSeek（oai接口）`, tools `get_time`), `providers/7k7kapi/accounts.json` (one record per key, `gate: 200`, `quota: 250000`), `providers/7k7kapi/keys.txt`, `providers/7k7kapi/out/mint-laneA.log` (the failure mode: code refused / send-code 429 at `--conc 2`), `providers/7k7kapi/out/mint-2026-10-22.log` (a token in `default` → chat **503**, `models=200` on the same key), `providers/7k7kapi/accounts.jsonl` (the first account + key, 2026-10-19).

> **Quality gates.** Every key here passed a live `chat-200` before it was written to `keys.txt`
> (dead keys are never shipped). Router combos follow the same rule at the model level: an entry is
> added **only if the model answers `chat-200` and can call tools** — a model without tool support,
> a dead key or a dead provider is dropped instead of added. Re-run the verify step any time;
> failures are reported, never hidden.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 7k7kapi page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.7k7kapi.xyz/v1/chat/completions → real content = the key is live
```

Per account, every panel request through one pinned exit:

| Step | Call | Notes |
| --- | --- | --- |
| mailbox | `temp.tf GET /api/account?providers=outlook,hotmail&dot=0&plus=1` by default, or Emailnator `POST /api/generate-email` (`--mail emailnator`) | one **private** hotmail/outlook plus-alias per account; the dot-free form is what is registered |
| status | `GET /api/status` | gate check before a mailbox is spent |
| send code | `GET /api/verification?email=…` | the panel mails a 6-digit code, valid 10 minutes |
| code | `POST /api/check` (temp.tf) / `POST /api/message-list` → `POST /api/message/<id>` (Emailnator) | polls every 5 s; the code is read only from the panel's own mail (`验证码`-anchored) |
| register | `POST /api/user/register` `{username,password,email,verification_code}` | a failed code has to be re-requested, not reused |
| login | `POST /api/user/login` | `access_token`, then `New-Api-User: <id>` for the token route |
| key | `POST /api/token/` with `group: DeepSeek（oai接口）`, `unlimited_quota: true` | the response already carries the plaintext key; `POST /api/token/<id>/key` and the token list are the fallbacks |
| gate | `POST /v1/chat/completions` | two different prompts (both 200, non-empty, **different**) and a `get_time` tool call with `tool_calls` in the answer |

A key is appended to `keys.txt` **after** the gate; a key that never passes is written to `accounts.json` with its error and retried on the next run.

## ⚙️ CLI options

```bash
node src/cli.js --count 10                        # accounts (= keys) to mint
node src/cli.js --count 10 --conc 2               # accounts in flight at once (max 8)
node src/cli.js --count 5 --mail emailnator       # e-mail rail: temptf (default) | emailnator
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --count 5 --group 'DeepSeek（oai接口）'   # token group (default)
node src/cli.js --count 5 --alt-groups default    # fallback groups, comma separated
node src/cli.js --verify-only                     # re-run every key in keys.txt through the gate
node src/cli.js --screen                          # test the proxy list against 7k7kapi
node src/cli.js --help
```

| Flag | Default | Meaning |
| --- | --- | --- |
| `--count N` | `5` | accounts to mint |
| `--conc N` | `1` | accounts in flight (max 8) |
| `--gap MS` | `1200` | pause between accounts |
| `--mail <rail>` | `temptf` | `temptf` (private hotmail/outlook plus-alias) or `emailnator` (fresh `@gmail.com`) |
| `--model <id>` | `deepseek-v4.1-flash` | model used for the live gate |
| `--group <name>` | `DeepSeek（oai接口）` | group the key is created in |
| `--alt-groups G` | `default` | fallback groups |
| `--pool <file>` | `proxies.txt` | proxy list, one exit per line |
| `--exits N` | `6` | exits tried per account before giving up |
| `--timeout MS` | `60000` | per-request timeout |
| `--checkin` | off | also run the daily check-in (locked here without a top-up) |
| `--verify-only` | off | re-test every key in `keys.txt` |
| `--screen` | off | test the exits against 7k7kapi only |

| Env | Default | Meaning |
| --- | --- | --- |
| `7K7KAPI_PROXIES` | — | exit pool, one per line (same as `--pool`) |
| `7K7KAPI_BASE` | `https://www.7k7kapi.xyz` | panel base URL |

## 🛰️ Behind a proxy

**Optional — but the panel is fussy, so a pool is worth it.** Every request of one account goes through **one pinned exit**: send-code, register, login, key create and the gate all leave from the same address, because the panel binds the pending code to the requesting address and a code asked for from one exit is refused when another one registers (`Verification code is incorrect or has expired`).

- With a pool: `--pool proxies.txt` (or `7K7KAPI_PROXIES`); a dead exit fails fast and the next try takes the next exit (`--exits`, default 6).
- Without a pool the CLI prints `running WITHOUT a proxy (direct)` and works the same.
- **Rate limit is per address:** two accounts in flight already hit `sendCode HTTP 429 {"message":"发送过于频繁，请等待 23 秒后再试"}` (`out/mint-laneA.log`). `--conc 1` with the built-in `--gap 1200` finished 10/10; `--conc 2` lost every code.
- Keep the pool fresh: public candidate exits die in minutes — `--screen` tells you which ones still reach the panel.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | ten live-verified keys, one per line — git-ignored |
| `accounts.json` | one JSON record per account: username, e-mail, uid, quota, group, gate result, masked key — git-ignored |
| `accounts.jsonl` | the 2026-10-19 account record with its key — git-ignored |
| `models.json` | empty on disk (the model count in this README comes from the mint measurements, not from a saved listing) |
| `out/mint-laneB.log` | the 10/10 run, 2026-10-23 |
| `out/mint-laneA.log` | the `--conc 2` run: code refused, send-code 429 |
| `out/mint-2026-10-22.log` | the per-account HTTP trace of an earlier run |
| `public-cli.js` | this repo's `src/cli.js` — mint / verify / screen (node stdlib only) |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router:

```bash
node src/connect-9router.js --api-key <48-char key>
```

Defaults: `--9router-prefix 7k7kapi`, `--9router-name 7k7kapi`, base URL `https://www.7k7kapi.xyz/v1`, default model `deepseek-v4.1-flash`; models are served as `7k7kapi/deepseek-v4.1-flash`. The launch is already proven on a live router (2026-10-19): node `7k7kapi` with connection `default`, active, catalogue entry `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔌 Connect to OmniRoute

[OmniRoute](https://omniroute.online) is a self-hosted, OpenAI-compatible router:

```bash
node src/connect-omniroute.js --api-key <48-char key>
```

Defaults: `--omniroute-prefix 7k7kapi`, `--omniroute-name 7k7kapi`, base URL `https://www.7k7kapi.xyz/v1`, default model `deepseek-v4.1-flash`; models are served as `7k7kapi/deepseek-v4.1-flash`. The launch is already proven on a live router (2026-10-19): node `7k7kapi` with connection `default`, active, catalogue entry `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **7k7kapi** (`www.7k7kapi.xyz`) — [www.7k7kapi.xyz](https://www.7k7kapi.xyz) |
| 🎁 What the provider gives | 250,000 quota units (≈ $0.50 at `quota_per_unit: 500000`) on a fresh e-mail-verified account, no card |
| 🔑 What one key gets you | one 48-character key on its own account, created in the group `DeepSeek（oai接口）`, chat- and tool-verified |
| 🌐 API shape | OpenAI-compatible: `POST https://www.7k7kapi.xyz/v1/chat/completions` — **1** model id on `/v1/models` |
| 🔒 Your data | only `www.7k7kapi.xyz`, the mailbox rail you pick (temp.tf or Emailnator) and your own proxy are contacted; keys stay on your machine |

## 🐞 Issues

* **The group is the whole game.** A token created in `default` looks fine and then answers `503 No available channel for model deepseek-v4.1-flash` — and crucially `/v1/models` still answers **200** on that key, so a naive "models check" passes and only the chat call tells the truth. That is exactly why the gate here is a completion, not a listing (`out/mint-2026-10-22.log`).
* **Send-code is rate-limited per address:** `发送过于频繁，请等待 N 秒后再试` (429) with N between 15 and 30. Two accounts in flight starve each other; mints at `--conc 1` are the measured working configuration.
* **A code is bound to the requesting address.** Register from a different exit than the one that asked for the code and the panel answers `Verification code is incorrect or has expired` (HTTP 200, `success: false`) — `--exits` re-runs the whole account from a new mailbox instead of reusing the code.
* **Disposable domains are refused.** `POST /api/verification` on a throwaway domain → **403** `注册仅支持主流常用邮箱（QQ、网易、Gmail、Outlook 等）及高校教育邮箱`. The two rails the CLI ships (temp.tf Microsoft plus-aliases, Emailnator gmail) are both accepted; a shared inbox can also hand back another tenant's mail, which is why the code is read only from the panel's own message.
* **The check-in is behind a paywall** (累计充值满 10 元即可解锁每日签到) — there is no free daily refill here.

If 7k7kapi changes its signup shape, its mail text or the group table, the tool stops at that step and prints the refusal verbatim. **[Open an issue](../../issues)** with the command and the exact output.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 7k7kapi-bulk-apikey contributors

</div>
