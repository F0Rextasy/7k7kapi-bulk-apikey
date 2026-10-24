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

**APIキー付きの7k7kapiアカウントを一括作成 — OpenAI互換の推論、アカウントごとに1キー + 9Routerコネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-1%20served-412991?style=for-the-badge)](https://www.7k7kapi.xyz/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-1-of-them) · [🧪 APIの使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

7k7kapi (`www.7k7kapi.xyz`) は、メールアドレス + パスワードでサインアップする **New API** のフォークです。登録キャプチャは **オフ** (`GET /api/status` の `ts: false`)、メール認証は **オン** (`em: true`)、そして素のフォークと1点だけ異なります — `default` グループに置かれたトークンは次のように返されます

```
503 No available channel for model deepseek-v4.1-flash
```

キーは、そのモデルを実際に提供しているチャネルを持つグループ (`DeepSeek（oai接口）`、2026-10-19 に計測、さらに 2026-10-23 の実行の10アカウントすべてでも再計測) の中で作成する必要があり、これが `--group` のデフォルトです。

したがってサインアップは純粋なHTTPです — ブラウザもキャプチャソルバーも不要です。メールボックスを取得し、`GET /api/verification?email=…` を呼び、受信トレイから6桁のコードを読み取り、登録し、ログインし、**正しいグループ**でトークンを作成し (`unlimited_quota: true` — 残高はキーではなくアカウントに紐づくため、0に制限されたトークンは `Invalid token` と返されます)、その後、2つの異なる補完と `get_time` ツール呼び出しでキーを証明します。ステップ8を通過したキーのみが `keys.txt` に書き込まれます。

## 🎁 無料枠 — どれだけ得られるか

| 項目 | 値 |
| --- | --- |
| サインアップクレジット | **250,000 クォータ単位** — 2026-10-23 の実行の10アカウントすべてで `quota: 250000` として読み戻し (`accounts.json`)。2026-10-19 に作成されたアカウントはチャット呼び出し後に **249,494** を保持 (`accounts.jsonl`) |
| 単価 | `quota_per_unit: 500000` なので、サインアップ枠は約 **$0.50** (`description.txt`) |
| 毎日のチェックイン | **ロック** — `GET /api/status` の `checkin: false`。パネルには 累计充值满 10 元即可解锁每日签到 (¥10以上チャージでロック解除) と表示 |
| カード / 電話 | どちらも不要 — 唯一のゲートはメールコード |
| 課金単位 | **アカウントごと**: 残高はアカウントに紐づくため、枯渇したキーは別のアカウントを作成して置き換えます — `--count N` は実際には「N個の無料アカウント」を意味します |
| ゲートのコスト | `deepseek-v4.1-flash` は `DeepSeek（oai接口）` グループで比率 **1** (qt 0) で提供されるため、キーの検証には数単位かかります |

チェックインがないということは残高が補充されないということです: キーを保持しつつ、再作成を想定してください。

> 💡 無料枠は7k7kapiによって設定され、変更される可能性があります。最新の数値は [www.7k7kapi.xyz](https://www.7k7kapi.xyz) で確認してください — そしてツール自身のゲートに判断させてください:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — そのうちの1つすべて

新しいキーで `GET /v1/models` を呼ぶと **1** つのモデルIDが返ります — `accounts.json` に記録されたすべてのアカウントのキーで `models_count: 1` を計測。このレーンが作成しゲートするIDは `deepseek-v4.1-flash` です (`providers/7k7kapi/models.json` は空なので、この数は保存されたリストではなく、その計測から来ています)。

キーが何に到達できるかは、キー自体ではなくその **グループ** によって決まります:

| モデルID | 提供するグループ | ステータス |
| --- | --- | --- |
| `deepseek-v4.1-flash` | `DeepSeek（oai接口）` | **chat-200** + `tool_calls` 応答あり、両方の実行のすべてのキーで |
| `deepseek-v4.1-flash` | `default` | **503** `No available channel for model deepseek-v4.1-flash` |

CLIはトークンを `DeepSeek（oai接口）` (`--group`) で作成し、作成または公開が失敗した場合にのみ `--alt-groups` (デフォルト `default`) にフォールバックします — 間違ったグループに落ちたトークンはゲートで捕捉され、出荷されることはありません。

## 🧪 APIの使い方

ベースURL **`https://www.7k7kapi.xyz/v1`** — OpenAI互換なので、OpenAIを話す任意のクライアントが動作します。

```bash
curl https://www.7k7kapi.xyz/v1/chat/completions \
  -H "Authorization: Bearer <48-char key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: pong"}],"max_tokens":32}'
```

キーはbase62の48文字で、**プレフィックスはありません** (コンソールではそのまま表示されます)。ゲート自体は `tool_choice: "auto"` と共に `tools: [{get_time}]` を送信します — リレーは実際の `tool_calls` を返し、これがキーをチャットだけでなくエージェントクライアントでも使用可能にするチェックです。

## 🛠 クイックスタート

```bash
cd 7k7kapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — with a pool every request leaves from one of these exits
node src/launcher.js                          # interactive: mint / verify / screen / settings

# or straight through the CLI:
node src/cli.js --count 10                    # accounts = keys, each gated before it is kept
node src/cli.js --verify-only                 # re-test every key in keys.txt with a live chat call
```

必要なのはNode 18+だけです: ブラウザもキャプチャソルバーも不要、依存関係ゼロ。2026-10-23 の作成は `--conc 1` で約7分で `keys.txt` を埋めました (`providers/7k7kapi/out/mint-laneB.log`)。

### 🖱️ ランチャー

`src/launcher.js` (このREADMEと同じバナー) は、プロキシリスト、作成するアカウント数、ライブゲートに使用するモデルを尋ね、回答を `launcher.config.json` に記憶し、その後CLIを実行します: **mint**、**verify**、**screen** (パネルに対して出口をテスト)、**settings**、**help**、**Connect to 9Router**。`src/cli.js` はプロバイダ自身のmint CLIをそのままコピーしたものです。`src/connect-9router.js` はプロバイダをプレフィックス `7k7kapi` で登録し、デフォルトモデルとして `deepseek-v4.1-flash` を使用します。

## ✅ 動作検証済み — すべてのキーがテストされています

| チェック | 結果 |
| --- | --- |
| `GET /api/status` | **200** — サイト `7k7kapi`、`reg: true`、`em: true`、`ts: false`、`ci: false` (チェックインは有料のみ) |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}`; コードメール (`7k7kapi邮箱验证邮件`) は数秒以内に到着 |
| `POST /api/user/register` | **200** `{"success":true}` — 6桁のコード、アカウントが存在する前に検証済み |
| `DeepSeek（oai接口）` 内の `POST /api/token/` | **200**、キーがレスポンスで返される (このフォークは平文で返します) |
| `POST /v1/chat/completions` | **200**、2つの異なるプロンプトに異なる内容で応答 |
| tools | **動作** — `get_time` リクエストが `tool_calls` を返す。チャネルが一時的に利用不可だったキーはチャットの健全性チェックを通過し、証明されないまま出荷される代わりにツール呼び出しをスキップしました |
| `GET /v1/models` | **200**、**1** つのID |
| 2026-10-23 の作成実行 | すべてのアカウントが登録され、すべてのキーが書き込まれる前にライブゲートを通過 — 実行ログは `out/mint-laneB.log` |

証拠はすべてディスク上にあります: `providers/7k7kapi/out/mint-laneB.log` (05:59:11 → 06:06:27、グループ `DeepSeek（oai接口）`、ツール `get_time`)、`providers/7k7kapi/accounts.json` (キーごとに1レコード、`gate: 200`、`quota: 250000`)、`providers/7k7kapi/keys.txt`、`providers/7k7kapi/out/mint-laneA.log` (失敗モード: `--conc 2` でのコード拒否 / send-code 429)、`providers/7k7kapi/out/mint-2026-10-22.log` (`default` のトークン → chat **503**、同じキーで `models=200`)、`providers/7k7kapi/accounts.jsonl` (最初のアカウント + キー、2026-10-19)。

> **品質ゲート。** ここにあるすべてのキーは、`keys.txt` に書き込まれる前にライブの `chat-200` を通過しています
> (死んだキーは決して出荷されません)。ルーターのコンボもモデルレベルで同じルールに従います: エントリは
> **モデルが `chat-200` を返し、ツールを呼び出せる場合にのみ** 追加されます — ツールサポートのないモデル、
> 死んだキー、死んだプロバイダは追加される代わりに削除されます。検証ステップはいつでも再実行できます;
> 失敗は報告され、決して隠されません。

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 7k7kapi page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.7k7kapi.xyz/v1/chat/completions → real content = the key is live
```

アカウントごとに、すべてのパネルリクエストは1つの固定された出口を経由します:

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| メールボックス | デフォルトで `temp.tf GET /api/account?providers=outlook,hotmail&dot=0&plus=1`、または Emailnator `POST /api/generate-email` (`--mail emailnator`) | アカウントごとに1つの **プライベート** な hotmail/outlook プラスエイリアス。登録されるのはドットなしの形式 |
| ステータス | `GET /api/status` | メールボックスを消費する前のゲートチェック |
| コード送信 | `GET /api/verification?email=…` | パネルが6桁のコードをメール送信、有効期限10分 |
| コード | `POST /api/check` (temp.tf) / `POST /api/message-list` → `POST /api/message/<id>` (Emailnator) | 5秒ごとにポーリング。コードはパネル自身のメールからのみ読み取られます (`验证码` をアンカー) |
| 登録 | `POST /api/user/register` `{username,password,email,verification_code}` | 失敗したコードは再利用せず、再リクエストする必要があります |
| ログイン | `POST /api/user/login` | `access_token`、その後トークンルート用に `New-Api-User: <id>` |
| キー | `group: DeepSeek（oai接口）`、`unlimited_quota: true` で `POST /api/token/` | レスポンスにすでに平文キーが含まれます。`POST /api/token/<id>/key` とトークンリストがフォールバック |
| ゲート | `POST /v1/chat/completions` | 2つの異なるプロンプト (両方200、非空、**異なる**) と、回答に `tool_calls` を含む `get_time` ツール呼び出し |

キーはゲートの **後** に `keys.txt` に追加されます。決して通過しないキーはエラーと共に `accounts.json` に書き込まれ、次の実行で再試行されます。

## ⚙️ CLIオプション

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

| フラグ | デフォルト | 意味 |
| --- | --- | --- |
| `--count N` | `5` | 作成するアカウント数 |
| `--conc N` | `1` | 同時進行のアカウント数 (最大8) |
| `--gap MS` | `1200` | アカウント間の一時停止 |
| `--mail <rail>` | `temptf` | `temptf` (プライベートな hotmail/outlook プラスエイリアス) または `emailnator` (新しい `@gmail.com`) |
| `--model <id>` | `deepseek-v4.1-flash` | ライブゲートに使用するモデル |
| `--group <name>` | `DeepSeek（oai接口）` | キーを作成するグループ |
| `--alt-groups G` | `default` | フォールバックグループ |
| `--pool <file>` | `proxies.txt` | プロキシリスト、1行に1つの出口 |
| `--exits N` | `6` | 諦める前にアカウントごとに試す出口数 |
| `--timeout MS` | `60000` | リクエストごとのタイムアウト |
| `--checkin` | オフ | 毎日のチェックインも実行 (ここではチャージなしではロック) |
| `--verify-only` | オフ | `keys.txt` のすべてのキーを再テスト |
| `--screen` | オフ | 出口を7k7kapiに対してのみテスト |

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `7K7KAPI_PROXIES` | — | 出口プール、1行に1つ (`--pool` と同じ) |
| `7K7KAPI_BASE` | `https://www.7k7kapi.xyz` | パネルのベースURL |

## 🛰️ プロキシの背後で

**オプション — ただしパネルは気難しいので、プールは価値があります。** 1つのアカウントのすべてのリクエストは **1つの固定された出口** を経由します: コード送信、登録、ログイン、キー作成、ゲートはすべて同じアドレスから出ます。なぜならパネルは保留中のコードをリクエスト元のアドレスに紐づけ、ある出口から要求されたコードは別の出口が登録しようとすると拒否されるからです (`Verification code is incorrect or has expired`)。

- プールあり: `--pool proxies.txt` (または `7K7KAPI_PROXIES`)。死んだ出口は即座に失敗し、次の試行が次の出口を使用します (`--exits`、デフォルト6)。
- プールなしの場合、CLIは `running WITHOUT a proxy (direct)` と表示し、同様に動作します。
- **レート制限はアドレスごとです:** 2つのアカウントを同時進行させるだけで `sendCode HTTP 429 {"message":"发送过于频繁，请等待 23 秒后再试"}` に達します (`out/mint-laneA.log`)。組み込みの `--gap 1200` を伴う `--conc 1` は10/10を完了しました; `--conc 2` はすべてのコードを失いました。
- プールを新鮮に保ってください: 公開候補の出口は数分で死にます — `--screen` はどれがまだパネルに到達するかを教えてくれます。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | ライブ検証済みの10個のキー、1行に1つ — git無視 |
| `accounts.json` | アカウントごとに1つのJSONレコード: ユーザー名、メール、uid、クォータ、グループ、ゲート結果、マスクされたキー — git無視 |
| `accounts.jsonl` | 2026-10-19 のアカウントレコードとそのキー — git無視 |
| `models.json` | ディスク上では空 (このREADMEのモデル数は保存されたリストではなく、作成時の計測から来ています) |
| `out/mint-laneB.log` | 10/10 の実行、2026-10-23 |
| `out/mint-laneA.log` | `--conc 2` の実行: コード拒否、send-code 429 |
| `out/mint-2026-10-22.log` | 以前の実行のアカウントごとのHTTPトレース |
| `public-cli.js` | このリポジトリの `src/cli.js` — mint / verify / screen (node標準ライブラリのみ) |

## 🔌 9Routerへの接続

[9Router](https://9router.com) はセルフホスト型のOpenAI互換ルーターです:

```bash
node src/connect-9router.js --api-key <48-char key>
```

デフォルト: `--9router-prefix 7k7kapi`、`--9router-name 7k7kapi`、ベースURL `https://www.7k7kapi.xyz/v1`、デフォルトモデル `deepseek-v4.1-flash`; モデルは `7k7kapi/deepseek-v4.1-flash` として提供されます。起動はすでにライブルーターで証明されています (2026-10-19): ノード `7k7kapi`、接続 `default`、アクティブ、カタログエントリ `7k7kapi/deepseek-v4.1-flash` (`description.txt`)。

## 🔌 OmniRouteへの接続

[OmniRoute](https://omniroute.online) はセルフホスト型のOpenAI互換ルーターです:

```bash
node src/connect-omniroute.js --api-key <48-char key>
```

デフォルト: `--omniroute-prefix 7k7kapi`、`--omniroute-name 7k7kapi`、ベースURL `https://www.7k7kapi.xyz/v1`、デフォルトモデル `deepseek-v4.1-flash`; モデルは `7k7kapi/deepseek-v4.1-flash` として提供されます。起動はすでにライブルーターで証明されています (2026-10-19): ノード `7k7kapi`、接続 `default`、アクティブ、カタログエントリ `7k7kapi/deepseek-v4.1-flash` (`description.txt`)。

## 🔑 1つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダ | **7k7kapi** (`www.7k7kapi.xyz`) — [www.7k7kapi.xyz](https://www.7k7kapi.xyz) |
| 🎁 プロバイダが提供するもの | 新規メール認証済みアカウントに250,000クォータ単位 (≈ $0.50、`quota_per_unit: 500000`)、カード不要 |
| 🔑 1つのキーで得られるもの | 独自のアカウント上の48文字のキー1つ、グループ `DeepSeek（oai接口）` で作成され、チャットとツールで検証済み |
| 🌐 APIの形 | OpenAI互換: `POST https://www.7k7kapi.xyz/v1/chat/completions` — `/v1/models` に **1** つのモデルID |
| 🔒 あなたのデータ | `www.7k7kapi.xyz`、選択したメールボックスレール (temp.tf または Emailnator)、および自身のプロキシのみが接触されます; キーはあなたのマシンに留まります |

## 🐞 問題

* **グループがすべての鍵です。** `default` で作成されたトークンは問題なく見えますが、その後 `503 No available channel for model deepseek-v4.1-flash` を返します — そして決定的なことに、そのキーでも `/v1/models` は **200** を返すため、素朴な「モデルチェック」は通過し、チャット呼び出しだけが真実を告げます。これがまさに、ここでのゲートがリストではなく補完である理由です (`out/mint-2026-10-22.log`)。
* **コード送信はアドレスごとにレート制限されています:** `发送过于频繁，请等待 N 秒后再试` (429)、Nは15から30の間。2つのアカウントを同時進行させると互いを枯渇させます; `--conc 1` での作成が計測された動作構成です。
* **コードはリクエスト元のアドレスに紐づけられます。** コードを要求した出口とは異なる出口から登録すると、パネルは `Verification code is incorrect or has expired` (HTTP 200、`success: false`) と返します — `--exits` はコードを再利用する代わりに、新しいメールボックスからアカウント全体を再実行します。
* **使い捨てドメインは拒否されます。** 使い捨てドメインでの `POST /api/verification` → **403** `注册仅支持主流常用邮箱（QQ、网易、Gmail、Outlook 等）及高校教育邮箱`。CLIが提供する2つのレール (temp.tf Microsoft プラスエイリアス、Emailnator gmail) はどちらも受け入れられます; 共有受信トレイは別のテナントのメールを返すこともあり、それがコードをパネル自身のメッセージからのみ読み取る理由です。
* **チェックインはペイウォールの背後にあります** (累计充值满 10 元即可解锁每日签到) — ここには無料の毎日の補充はありません。

7k7kapiがサインアップの形、メールの文面、またはグループテーブルを変更した場合、ツールはそのステップで停止し、拒否をそのまま出力します。コマンドと正確な出力を添えて **[issueを開いてください](../../issues)**。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 7k7kapi-bulk-apikey contributors

</div>