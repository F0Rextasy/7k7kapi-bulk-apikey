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

**批量创建带 API 密钥的 7k7kapi 账户 — OpenAI 兼容推理，每个账户一个密钥 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-1%20served-412991?style=for-the-badge)](https://www.7k7kapi.xyz/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-1-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

7k7kapi（`www.7k7kapi.xyz`）是一个 **New API** 分支，使用邮箱 + 密码注册：注册验证码是**关闭**的（`GET /api/status` 中 `ts: false`），邮箱验证是**开启**的（`em: true`），并且有一点与原生分支不同 —— 留在 `default` 分组中的令牌会收到

```
503 No available channel for model deepseek-v4.1-flash
```

密钥必须创建在其渠道真正提供该模型的分组中（`DeepSeek（oai接口）`，2026-10-19 实测，并在 2026-10-23 那次运行的全部十个账户上再次验证），这也是 `--group` 的默认值。

因此注册完全是纯 HTTP —— 无需浏览器，也无需验证码破解器：取一个邮箱，`GET /api/verification?email=…`，从收件箱中读出 6 位验证码，注册，登录，**在正确的分组中**创建令牌（`unlimited_quota: true` —— 余额在账户上，不在密钥上，所以配额上限为 0 的令牌会收到 `Invalid token`），然后用两次不同的补全请求和一次 `get_time` 工具调用来验证密钥。只有通过第 8 步的密钥才会被写入 `keys.txt`。

## 🎁 免费额度 —— 你能拿到多少

| 项目 | 值 |
| --- | --- |
| 注册赠送 | **250,000 配额单位** —— 在 2026-10-23 那次运行的全部十个账户上读回为 `quota: 250000`（`accounts.json`）；2026-10-19 创建的账户在完成聊天调用后持有 **249,494**（`accounts.jsonl`） |
| 单位价格 | `quota_per_unit: 500000`，因此注册赠送额度约为 **$0.50**（`description.txt`） |
| 每日签到 | **已锁定** —— `GET /api/status` 中 `checkin: false`；面板显示 累计充值满 10 元即可解锁每日签到（充值 ≥ ¥10 即可解锁） |
| 银行卡 / 手机 | 都不需要 —— 唯一的门槛是邮箱验证码 |
| 计费单位 | **按账户**：余额在账户上，所以密钥用尽后通过再创建一个账户来替换 —— `--count N` 实际意味着“N 个免费账户” |
| 门槛成本 | `deepseek-v4.1-flash` 在 `DeepSeek（oai接口）` 分组中按倍率 **1** 计费（qt 0），因此验证一个密钥只需消耗少量单位 |

没有签到意味着余额永远不会补充：保留好密钥，并预期需要重新创建。

> 💡 免费额度由 7k7kapi 设定，可能会变化。请在 [www.7k7kapi.xyz](https://www.7k7kapi.xyz) 查看实时数字 —— 并让工具自身的门槛来判定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 —— 全部 1 个

用新密钥请求 `GET /v1/models` 会返回 **1** 个模型 id —— 在 `accounts.json` 中记录的每个账户的密钥上都测得 `models_count: 1`；本通道创建并作为门槛的 id 是 `deepseek-v4.1-flash`（`providers/7k7kapi/models.json` 为空，因此该数量来自实测，而非保存的列表）。

密钥能访问什么由其**分组**决定，而不是密钥本身：

| 模型 ID | 提供它的分组 | 状态 |
| --- | --- | --- |
| `deepseek-v4.1-flash` | `DeepSeek（oai接口）` | **chat-200** + `tool_calls` 有响应，两次运行中的每个密钥均如此 |
| `deepseek-v4.1-flash` | `default` | **503** `No available channel for model deepseek-v4.1-flash` |

CLI 在 `DeepSeek（oai接口）`（`--group`）中创建令牌，只有在创建或获取失败时才回退到 `--alt-groups`（默认 `default`）—— 落入错误分组的令牌会被门槛拦截，而不会被交付。

## 🧪 如何使用 API

基础 URL **`https://www.7k7kapi.xyz/v1`** —— 兼容 OpenAI，因此任何支持 OpenAI 的客户端都可以使用。

```bash
curl https://www.7k7kapi.xyz/v1/chat/completions \
  -H "Authorization: Bearer <48-char key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: pong"}],"max_tokens":32}'
```

密钥是 48 个字符的 base62，**没有前缀**（控制台显示时也不带前缀）。门槛本身会发送 `tools: [{get_time}]` 和 `tool_choice: "auto"` —— 中继会返回真实的 `tool_calls`，正是这项检查让密钥可用于智能体客户端，而不仅仅是聊天。

## 🛠 快速开始

```bash
cd 7k7kapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — with a pool every request leaves from one of these exits
node src/launcher.js                          # interactive: mint / verify / screen / settings

# or straight through the CLI:
node src/cli.js --count 10                    # accounts = keys, each gated before it is kept
node src/cli.js --verify-only                 # re-test every key in keys.txt with a live chat call
```

只需要 Node 18+：无需浏览器，无需验证码破解器，零依赖。2026-10-23 的创建在 `--conc 1` 下约 7 分钟填满了 `keys.txt`（`providers/7k7kapi/out/mint-laneB.log`）。

### 🖱️ 启动器

`src/launcher.js`（与本 README 相同的横幅）会询问代理列表、要创建多少个账户以及用于实时门槛的模型，将答案记录在 `launcher.config.json` 中，然后运行 CLI：**mint**、**verify**、**screen**（针对面板测试出口）、**settings**、**help** 和 **Connect to 9Router**。`src/cli.js` 是提供方自带的创建 CLI，原样复制；`src/connect-9router.js` 以 `7k7kapi` 为前缀注册提供方，并将 `deepseek-v4.1-flash` 作为默认模型。

## ✅ 已验证可用 —— 每个密钥都经过测试

| 检查 | 结果 |
| --- | --- |
| `GET /api/status` | **200** —— 站点 `7k7kapi`，`reg: true`，`em: true`，`ts: false`，`ci: false`（签到仅限付费用户） |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}`；验证码邮件（`7k7kapi邮箱验证邮件`）在几秒内到达 |
| `POST /api/user/register` | **200** `{"success":true}` —— 6 位验证码，在账户存在之前完成验证 |
| 在 `DeepSeek（oai接口）` 中 `POST /api/token/` | **200**，密钥在响应中返回（此分支以明文返回） |
| `POST /v1/chat/completions` | **200**，两个不同的提示词返回了不同的内容 |
| 工具 | **可用** —— 一个 `get_time` 请求返回 `tool_calls`；某个渠道暂时不可用的密钥通过了聊天健全性检查，并跳过了工具调用，而不是在未经验证的情况下交付 |
| `GET /v1/models` | **200**，**1** 个 id |
| 2026-10-23 创建运行 | 每个账户都注册成功，每个密钥在写入之前都通过了实时门槛 —— 运行日志为 `out/mint-laneB.log` |

证据，全部在磁盘上：`providers/7k7kapi/out/mint-laneB.log`（05:59:11 → 06:06:27，分组 `DeepSeek（oai接口）`，工具 `get_time`）、`providers/7k7kapi/accounts.json`（每个密钥一条记录，`gate: 200`，`quota: 250000`）、`providers/7k7kapi/keys.txt`、`providers/7k7kapi/out/mint-laneA.log`（失败模式：验证码被拒绝 / 在 `--conc 2` 下发送验证码 429）、`providers/7k7kapi/out/mint-2026-10-22.log`（`default` 中的令牌 → 聊天 **503**，同一密钥上 `models=200`）、`providers/7k7kapi/accounts.jsonl`（第一个账户 + 密钥，2026-10-19）。

> **质量门槛。** 这里的每个密钥在写入 `keys.txt` 之前都通过了实时 `chat-200`
> （失效密钥绝不会被交付）。路由组合在模型层面遵循同样的规则：只有当模型返回 `chat-200`
> **且能调用工具**时，才会添加条目 —— 不支持工具的模型、失效的密钥或失效的提供方会被丢弃，
> 而不是被添加。可随时重新运行验证步骤；失败会被报告，绝不会被隐藏。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 7k7kapi page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.7k7kapi.xyz/v1/chat/completions → real content = the key is live
```

每个账户的所有面板请求都通过一个固定出口：

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| 邮箱 | 默认 `temp.tf GET /api/account?providers=outlook,hotmail&dot=0&plus=1`，或 Emailnator `POST /api/generate-email`（`--mail emailnator`） | 每个账户一个**私有** hotmail/outlook 加号别名；注册时使用无点形式 |
| 状态 | `GET /api/status` | 在消耗邮箱之前进行门槛检查 |
| 发送验证码 | `GET /api/verification?email=…` | 面板发送 6 位验证码，有效期 10 分钟 |
| 验证码 | `POST /api/check`（temp.tf）/ `POST /api/message-list` → `POST /api/message/<id>`（Emailnator） | 每 5 秒轮询一次；验证码仅从面板自己的邮件中读取（以 `验证码` 为锚点） |
| 注册 | `POST /api/user/register` `{username,password,email,verification_code}` | 验证码失败必须重新请求，不能重复使用 |
| 登录 | `POST /api/user/login` | 获取 `access_token`，然后为令牌路由设置 `New-Api-User: <id>` |
| 密钥 | `POST /api/token/`，带 `group: DeepSeek（oai接口）`、`unlimited_quota: true` | 响应中已包含明文密钥；`POST /api/token/<id>/key` 和令牌列表是回退方案 |
| 门槛 | `POST /v1/chat/completions` | 两个不同的提示词（均为 200、非空、**不同**）以及一次 `get_time` 工具调用，且回答中包含 `tool_calls` |

密钥在通过门槛**之后**才会被追加到 `keys.txt`；从未通过的密钥会连同其错误写入 `accounts.json`，并在下次运行时重试。

## ⚙️ CLI 选项

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

| 参数 | 默认值 | 含义 |
| --- | --- | --- |
| `--count N` | `5` | 要创建的账户数 |
| `--conc N` | `1` | 并发处理的账户数（最大 8） |
| `--gap MS` | `1200` | 账户之间的暂停时间 |
| `--mail <rail>` | `temptf` | `temptf`（私有 hotmail/outlook 加号别名）或 `emailnator`（全新的 `@gmail.com`） |
| `--model <id>` | `deepseek-v4.1-flash` | 用于实时门槛的模型 |
| `--group <name>` | `DeepSeek（oai接口）` | 创建密钥所在的分组 |
| `--alt-groups G` | `default` | 回退分组 |
| `--pool <file>` | `proxies.txt` | 代理列表，每行一个出口 |
| `--tries N` | `2` | 每个账户在放弃之前尝试的出口数 |
| `--timeout MS` | `60000` | 每个请求的超时时间 |
| `--checkin` | 关闭 | 同时运行每日签到（此处未充值则锁定） |
| `--verify-only` | 关闭 | 重新测试 `keys.txt` 中的每个密钥 |
| `--screen` | 关闭 | 仅针对 7k7kapi 测试出口 |

| 环境变量 | 默认值 | 含义 |
| --- | --- | --- |
| `7K7KAPI_PROXIES` | — | 出口池，每行一个（与 `--pool` 相同） |
| `7K7KAPI_BASE` | `https://www.7k7kapi.xyz` | 面板基础 URL |

## 🛰️ 使用代理

**可选 —— 但面板很挑剔，所以代理池值得使用。** 一个账户的每个请求都通过**一个固定出口**：发送验证码、注册、登录、创建密钥和门槛都从同一地址发出，因为面板会将待处理的验证码绑定到请求地址，从一个出口请求的验证码在另一个出口注册时会被拒绝（`Verification code is incorrect or has expired`）。

- 使用代理池：`--pool proxies.txt`（或 `7K7KAPI_PROXIES`）；失效的出口会快速失败，下一次尝试会使用下一个出口（`--tries`，默认 2）。
- 不使用代理池时，CLI 会打印 `running WITHOUT a proxy (direct)`，工作方式相同。
- **速率限制是按地址的：** 两个并发账户就已经触发 `sendCode HTTP 429 {"message":"发送过于频繁，请等待 23 秒后再试"}`（`out/mint-laneA.log`）。`--conc 1` 配合内置的 `--gap 1200` 完成了 10/10；`--conc 2` 丢失了每一个验证码。
- 保持代理池新鲜：公开候选出口几分钟内就会失效 —— `--screen` 会告诉你哪些仍能访问面板。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 十个经过实时验证的密钥，每行一个 —— 已被 git 忽略 |
| `accounts.json` | 每个账户一条 JSON 记录：用户名、邮箱、uid、配额、分组、门槛结果、脱敏密钥 —— 已被 git 忽略 |
| `accounts.jsonl` | 2026-10-19 的账户记录及其密钥 —— 已被 git 忽略 |
| `models.json` | 磁盘上为空（本 README 中的模型数量来自创建时的实测，而非保存的列表） |
| `out/mint-laneB.log` | 10/10 运行，2026-10-23 |
| `out/mint-laneA.log` | `--conc 2` 运行：验证码被拒绝，发送验证码 429 |
| `out/mint-2026-10-22.log` | 较早一次运行的逐账户 HTTP 跟踪 |
| `public-cli.js` | 本仓库的 `src/cli.js` —— mint / verify / screen（仅使用 node 标准库） |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器：

```bash
node src/connect-9router.js --api-key <48-char key>
```

默认值：`--9router-prefix 7k7kapi`、`--9router-name 7k7kapi`，基础 URL `https://www.7k7kapi.xyz/v1`，默认模型 `deepseek-v4.1-flash`；模型以 `7k7kapi/deepseek-v4.1-flash` 形式提供。该接入已在实时路由器上验证（2026-10-19）：节点 `7k7kapi`，连接 `default`，已激活，目录条目 `7k7kapi/deepseek-v4.1-flash`（`description.txt`）。

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管、兼容 OpenAI 的路由器：

```bash
node src/connect-omniroute.js --api-key <48-char key>
```

默认值：`--omniroute-prefix 7k7kapi`、`--omniroute-name 7k7kapi`，基础 URL `https://www.7k7kapi.xyz/v1`，默认模型 `deepseek-v4.1-flash`；模型以 `7k7kapi/deepseek-v4.1-flash` 形式提供。该接入已在实时路由器上验证（2026-10-19）：节点 `7k7kapi`，连接 `default`，已激活，目录条目 `7k7kapi/deepseek-v4.1-flash`（`description.txt`）。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供方 | **7k7kapi**（`www.7k7kapi.xyz`）—— [www.7k7kapi.xyz](https://www.7k7kapi.xyz) |
| 🎁 提供方赠送 | 全新邮箱验证账户获得 250,000 配额单位（按 `quota_per_unit: 500000` 约合 $0.50），无需银行卡 |
| 🔑 一个密钥能给你什么 | 一个 48 字符的密钥，位于其独立账户上，创建于 `DeepSeek（oai接口）` 分组，已通过聊天和工具验证 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://www.7k7kapi.xyz/v1/chat/completions` —— `/v1/models` 上有 **1** 个模型 id |
| 🔒 你的数据 | 仅会联系 `www.7k7kapi.xyz`、你选择的邮箱通道（temp.tf 或 Emailnator）以及你自己的代理；密钥保留在你的机器上 |

## 🐞 问题

* **分组就是全部关键。** 在 `default` 中创建的令牌看起来没问题，然后会返回 `503 No available channel for model deepseek-v4.1-flash` —— 而且关键在于 `/v1/models` 在该密钥上仍然返回 **200**，所以天真的“模型检查”会通过，只有聊天调用才能揭示真相。这正是这里的门槛是补全请求而非列表的原因（`out/mint-2026-10-22.log`）。
* **发送验证码按地址限速：** `发送过于频繁，请等待 N 秒后再试`（429），N 在 15 到 30 之间。两个并发账户会互相饿死；`--conc 1` 的创建是实测可用的配置。
* **验证码绑定到请求地址。** 从与请求验证码不同的出口注册，面板会返回 `Verification code is incorrect or has expired`（HTTP 200，`success: false`）—— `--tries` 会从新邮箱重新运行整个账户，而不是重复使用验证码。
* **一次性域名会被拒绝。** 在一次性域名上 `POST /api/verification` → **403** `注册仅支持主流常用邮箱（QQ、网易、Gmail、Outlook 等）及高校教育邮箱`。CLI 提供的两种通道（temp.tf Microsoft 加号别名、Emailnator gmail）都被接受；共享收件箱也可能返回其他租户的邮件，这就是验证码仅从面板自己的邮件中读取的原因。
* **签到在付费墙之后**（累计充值满 10 元即可解锁每日签到）—— 这里没有免费的每日补充。

如果 7k7kapi 更改其注册形态、邮件文本或分组表，工具会在该步骤停止并原样打印拒绝信息。请附上命令和确切输出**[提交 issue](../../issues)**。

## 📄 许可证

MIT © 2026 —— 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 7k7kapi-bulk-apikey contributors

</div>