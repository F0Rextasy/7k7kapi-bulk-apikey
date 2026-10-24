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

**API 키와 함께 7k7kapi 계정을 대량 생성 — OpenAI 호환 추론, 계정당 키 하나 + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-1%20served-412991?style=for-the-badge)](https://www.7k7kapi.xyz/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-1-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 존재하는 이유

7k7kapi(`www.7k7kapi.xyz`)는 이메일 + 비밀번호로 가입하는 **New API** 포크입니다. 가입 캡차는 **꺼져 있고**(`GET /api/status`의 `ts: false`), 이메일 인증은 **켜져 있으며**(`em: true`), 일반 포크와 한 가지가 다릅니다 — `default` 그룹에 남겨둔 토큰은 다음과 같이 응답합니다.

```
503 No available channel for model deepseek-v4.1-flash
```

키는 실제로 해당 모델을 서비스하는 채널이 있는 그룹(`DeepSeek（oai接口）`, 2026-10-19 측정 및 2026-10-23 실행의 열 개 계정 전부에서 재측정) 안에서 생성되어야 하며, 이것이 `--group`의 기본값입니다.

따라서 가입은 순수 HTTP입니다 — 브라우저도, 캡차 솔버도 필요 없습니다: 메일함을 하나 잡아 `GET /api/verification?email=…`, 받은편지함에서 6자리 코드를 읽고, 등록하고, 로그인하고, **올바른 그룹**에 토큰을 생성한 뒤(`unlimited_quota: true` — 잔액은 키가 아니라 계정에 있으므로 0으로 제한된 토큰은 `Invalid token`으로 응답됩니다), 서로 다른 두 개의 완성 요청과 `get_time` 도구 호출로 키를 증명합니다. 8단계를 통과한 키만 `keys.txt`에 기록됩니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

| 항목 | 값 |
| --- | --- |
| 가입 크레딧 | **250,000 할당량 단위** — 2026-10-23 실행의 열 개 계정 전부에서 `quota: 250000`으로 확인됨(`accounts.json`); 2026-10-19에 생성된 계정은 채팅 호출 후 **249,494**를 보유(`accounts.jsonl`) |
| 단위 가격 | `quota_per_unit: 500000`, 따라서 가입 허용량은 ≈ **$0.50**(`description.txt`) |
| 일일 출석 체크 | **잠김** — `GET /api/status`의 `checkin: false`; 패널에는 累计充值满 10 元即可解锁每日签到 (10위안 이상 충전 시 잠금 해제)라고 표시됨 |
| 카드 / 전화 | 둘 다 아님 — 유일한 관문은 이메일 코드 |
| 과금 단위 | **계정당**: 잔액은 계정에 있으므로 소진된 키는 다른 계정을 생성해 대체 — `--count N`은 실제로 "N개의 무료 계정"을 의미 |
| 관문 비용 | `deepseek-v4.1-flash`는 `DeepSeek（oai接口）` 그룹에서 비율 **1**(qt 0)로 서비스되므로, 키 검증 비용은 몇 단위에 불과 |

출석 체크가 없으면 잔액은 절대 충전되지 않습니다: 키를 보관하되, 재생성을 예상하세요.

> 💡 무료 티어는 7k7kapi가 설정하며 변경될 수 있습니다. 실시간 수치는 [www.7k7kapi.xyz](https://www.7k7kapi.xyz)에서 확인하세요 — 그리고 도구 자체의 관문이 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 전부 1개

새 키로 `GET /v1/models`를 호출하면 **1**개의 모델 id를 응답합니다 — `accounts.json`에 기록된 모든 계정의 키에서 `models_count: 1`로 측정됨; 이 레인이 생성하고 관문을 통과시키는 id는 `deepseek-v4.1-flash`입니다(`providers/7k7kapi/models.json`이 비어 있으므로, 이 수치는 저장된 목록이 아니라 해당 측정에서 나옵니다).

키가 접근할 수 있는 범위는 키 자체가 아니라 **그룹**에 의해 결정됩니다:

| 모델 ID | 서비스하는 그룹 | 상태 |
| --- | --- | --- |
| `deepseek-v4.1-flash` | `DeepSeek（oai接口）` | **chat-200** + `tool_calls` 응답, 두 실행의 모든 키에서 |
| `deepseek-v4.1-flash` | `default` | **503** `No available channel for model deepseek-v4.1-flash` |

CLI는 `DeepSeek（oai接口）`(`--group`)에 토큰을 생성하고, 생성이나 공개가 실패할 경우에만 `--alt-groups`(기본값 `default`)로 폴백합니다 — 잘못된 그룹에 들어간 토큰은 출시되지 않고 관문에서 걸러집니다.

## 🧪 API 사용 방법

베이스 URL **`https://www.7k7kapi.xyz/v1`** — OpenAI 호환이므로 OpenAI를 지원하는 모든 클라이언트가 작동합니다.

```bash
curl https://www.7k7kapi.xyz/v1/chat/completions \
  -H "Authorization: Bearer <48-char key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: pong"}],"max_tokens":32}'
```

키는 **접두사 없는** base62 48자입니다(콘솔에는 그대로 표시됨). 관문 자체는 `tool_choice: "auto"`와 함께 `tools: [{get_time}]`을 전송합니다 — 릴레이는 실제 `tool_calls`로 응답하며, 이것이 키를 단순 채팅이 아니라 에이전트 클라이언트에서도 사용 가능하게 만드는 검사입니다.

## 🛠 빠른 시작

```bash
cd 7k7kapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — with a pool every request leaves from one of these exits
node src/launcher.js                          # interactive: mint / verify / screen / settings

# or straight through the CLI:
node src/cli.js --count 10                    # accounts = keys, each gated before it is kept
node src/cli.js --verify-only                 # re-test every key in keys.txt with a live chat call
```

Node 18+ 외에는 아무것도 필요하지 않습니다: 브라우저도, 캡차 솔버도, 의존성도 없습니다. 2026-10-23의 생성은 `--conc 1`에서 약 7분 만에 `keys.txt`를 채웠습니다(`providers/7k7kapi/out/mint-laneB.log`).

### 🖱️ 런처

`src/launcher.js`(이 README와 동일한 배너)는 프록시 목록, 생성할 계정 수, 라이브 관문에 사용할 모델을 묻고, 답변을 `launcher.config.json`에 기억한 뒤 CLI를 실행합니다: **mint**, **verify**, **screen**(패널에 대해 출구 테스트), **settings**, **help** 및 **Connect to 9Router**. `src/cli.js`는 프로바이더 자체의 생성 CLI를 그대로 복사한 것이며, `src/connect-9router.js`는 `deepseek-v4.1-flash`를 기본 모델로 하여 접두사 `7k7kapi` 아래에 프로바이더를 등록합니다.

## ✅ 검증됨 — 모든 키가 테스트됨

| 검사 | 결과 |
| --- | --- |
| `GET /api/status` | **200** — 사이트 `7k7kapi`, `reg: true`, `em: true`, `ts: false`, `ci: false`(출석 체크는 유료 전용) |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}`; 코드 메일(`7k7kapi邮箱验证邮件`)이 몇 초 안에 도착 |
| `POST /api/user/register` | **200** `{"success":true}` — 6자리 코드, 계정 생성 전에 검증됨 |
| `DeepSeek（oai接口）`의 `POST /api/token/` | **200**, 응답에 키 반환됨(이 포크는 평문으로 반환) |
| `POST /v1/chat/completions` | **200**, 서로 다른 두 프롬프트에 서로 다른 내용으로 응답 |
| 도구 | **작동** — `get_time` 요청이 `tool_calls`로 응답; 채널이 잠시 사라진 키는 채팅 정상성 검사를 통과하고 검증되지 않은 채 출시되는 대신 도구 호출을 건너뜀 |
| `GET /v1/models` | **200**, **1**개 id |
| 2026-10-23 생성 실행 | 모든 계정이 등록되고 모든 키가 기록되기 전에 라이브 관문을 통과 — 실행 로그는 `out/mint-laneB.log` |

증거, 모두 디스크에 있음: `providers/7k7kapi/out/mint-laneB.log` (05:59:11 → 06:06:27, 그룹 `DeepSeek（oai接口）`, 도구 `get_time`), `providers/7k7kapi/accounts.json` (키당 레코드 하나, `gate: 200`, `quota: 250000`), `providers/7k7kapi/keys.txt`, `providers/7k7kapi/out/mint-laneA.log` (실패 모드: 코드 거부 / `--conc 2`에서 send-code 429), `providers/7k7kapi/out/mint-2026-10-22.log` (`default`의 토큰 → 채팅 **503**, 동일 키에서 `models=200`), `providers/7k7kapi/accounts.jsonl` (첫 계정 + 키, 2026-10-19).

> **품질 관문.** 여기의 모든 키는 `keys.txt`에 기록되기 전에 라이브 `chat-200`을 통과했습니다
> (죽은 키는 절대 출시되지 않습니다). 라우터 조합도 모델 수준에서 동일한 규칙을 따릅니다: 항목은
> **모델이 `chat-200`으로 응답하고 도구를 호출할 수 있을 때만** 추가됩니다 — 도구 지원이 없는 모델,
> 죽은 키 또는 죽은 프로바이더는 추가되지 않고 제거됩니다. 언제든지 검증 단계를 다시 실행하세요;
> 실패는 보고되며, 절대 숨겨지지 않습니다.

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 7k7kapi page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.7k7kapi.xyz/v1/chat/completions → real content = the key is live
```

계정당, 모든 패널 요청은 하나의 고정된 출구를 통해:

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 메일함 | 기본적으로 `temp.tf GET /api/account?providers=outlook,hotmail&dot=0&plus=1`, 또는 Emailnator `POST /api/generate-email`(`--mail emailnator`) | 계정당 하나의 **비공개** hotmail/outlook 플러스 별칭; 점 없는 형식이 등록됨 |
| 상태 | `GET /api/status` | 메일함을 소비하기 전 관문 검사 |
| 코드 전송 | `GET /api/verification?email=…` | 패널이 6자리 코드를 메일로 보냄, 10분 유효 |
| 코드 | `POST /api/check` (temp.tf) / `POST /api/message-list` → `POST /api/message/<id>` (Emailnator) | 5초마다 폴링; 코드는 패널 자체의 메일에서만 읽음(`验证码` 앵커) |
| 등록 | `POST /api/user/register` `{username,password,email,verification_code}` | 실패한 코드는 재사용이 아니라 재요청해야 함 |
| 로그인 | `POST /api/user/login` | `access_token`, 그런 다음 토큰 라우트에 `New-Api-User: <id>` |
| 키 | `group: DeepSeek（oai接口）`, `unlimited_quota: true`로 `POST /api/token/` | 응답에 이미 평문 키가 포함됨; `POST /api/token/<id>/key`와 토큰 목록이 폴백 |
| 관문 | `POST /v1/chat/completions` | 서로 다른 두 프롬프트(둘 다 200, 비어 있지 않음, **서로 다름**)와 응답에 `tool_calls`가 있는 `get_time` 도구 호출 |

키는 관문 **이후**에 `keys.txt`에 추가됩니다; 통과하지 못한 키는 오류와 함께 `accounts.json`에 기록되고 다음 실행에서 재시도됩니다.

## ⚙️ CLI 옵션

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

| 플래그 | 기본값 | 의미 |
| --- | --- | --- |
| `--count N` | `5` | 생성할 계정 수 |
| `--conc N` | `1` | 동시 진행 계정 수(최대 8) |
| `--gap MS` | `1200` | 계정 간 일시 정지 |
| `--mail <rail>` | `temptf` | `temptf`(비공개 hotmail/outlook 플러스 별칭) 또는 `emailnator`(새 `@gmail.com`) |
| `--model <id>` | `deepseek-v4.1-flash` | 라이브 관문에 사용할 모델 |
| `--group <name>` | `DeepSeek（oai接口）` | 키가 생성되는 그룹 |
| `--alt-groups G` | `default` | 폴백 그룹 |
| `--pool <file>` | `proxies.txt` | 프록시 목록, 줄당 출구 하나 |
| `--exits N` | `6` | 포기하기 전 계정당 시도할 출구 수 |
| `--timeout MS` | `60000` | 요청당 타임아웃 |
| `--checkin` | 꺼짐 | 일일 출석 체크도 실행(여기서는 충전 없이는 잠김) |
| `--verify-only` | 꺼짐 | `keys.txt`의 모든 키 재테스트 |
| `--screen` | 꺼짐 | 7k7kapi에 대해서만 출구 테스트 |

| 환경 변수 | 기본값 | 의미 |
| --- | --- | --- |
| `7K7KAPI_PROXIES` | — | 출구 풀, 줄당 하나(`--pool`과 동일) |
| `7K7KAPI_BASE` | `https://www.7k7kapi.xyz` | 패널 베이스 URL |

## 🛰️ 프록시 뒤에서

**선택 사항 — 하지만 패널이 까다로우므로 풀을 사용할 가치가 있습니다.** 한 계정의 모든 요청은 **하나의 고정된 출구**를 통과합니다: 코드 전송, 등록, 로그인, 키 생성 및 관문이 모두 동일한 주소에서 나갑니다. 패널이 대기 중인 코드를 요청 주소에 묶기 때문에, 한 출구에서 요청한 코드는 다른 출구에서 등록할 때 거부됩니다(`Verification code is incorrect or has expired`).

- 풀이 있는 경우: `--pool proxies.txt`(또는 `7K7KAPI_PROXIES`); 죽은 출구는 빠르게 실패하고 다음 시도가 다음 출구를 사용합니다(`--exits`, 기본값 6).
- 풀이 없으면 CLI는 `running WITHOUT a proxy (direct)`를 출력하고 동일하게 작동합니다.
- **속도 제한은 주소당입니다:** 동시 진행 계정 두 개만으로도 이미 `sendCode HTTP 429 {"message":"发送过于频繁，请等待 23 秒后再试"}`에 도달합니다(`out/mint-laneA.log`). 내장 `--gap 1200`과 함께 `--conc 1`은 10/10을 완료했습니다; `--conc 2`는 모든 코드를 잃었습니다.
- 풀을 신선하게 유지하세요: 공개 후보 출구는 몇 분 만에 죽습니다 — `--screen`이 어떤 출구가 여전히 패널에 도달하는지 알려줍니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 라이브 검증된 키 열 개, 줄당 하나 — git 무시됨 |
| `accounts.json` | 계정당 JSON 레코드 하나: 사용자 이름, 이메일, uid, 할당량, 그룹, 관문 결과, 마스킹된 키 — git 무시됨 |
| `accounts.jsonl` | 키와 함께 2026-10-19 계정 레코드 — git 무시됨 |
| `models.json` | 디스크에서 비어 있음(이 README의 모델 수는 저장된 목록이 아니라 생성 측정에서 나옴) |
| `out/mint-laneB.log` | 10/10 실행, 2026-10-23 |
| `out/mint-laneA.log` | `--conc 2` 실행: 코드 거부, send-code 429 |
| `out/mint-2026-10-22.log` | 이전 실행의 계정별 HTTP 추적 |
| `public-cli.js` | 이 저장소의 `src/cli.js` — mint / verify / screen (node 표준 라이브러리만) |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다:

```bash
node src/connect-9router.js --api-key <48-char key>
```

기본값: `--9router-prefix 7k7kapi`, `--9router-name 7k7kapi`, 베이스 URL `https://www.7k7kapi.xyz/v1`, 기본 모델 `deepseek-v4.1-flash`; 모델은 `7k7kapi/deepseek-v4.1-flash`로 서비스됩니다. 실행은 이미 라이브 라우터에서 증명되었습니다(2026-10-19): 노드 `7k7kapi`, 연결 `default`, 활성, 카탈로그 항목 `7k7kapi/deepseek-v4.1-flash`(`description.txt`).

## 🔌 OmniRoute에 연결

[OmniRoute](https://omniroute.online)는 자체 호스팅, OpenAI 호환 라우터입니다:

```bash
node src/connect-omniroute.js --api-key <48-char key>
```

기본값: `--omniroute-prefix 7k7kapi`, `--omniroute-name 7k7kapi`, 베이스 URL `https://www.7k7kapi.xyz/v1`, 기본 모델 `deepseek-v4.1-flash`; 모델은 `7k7kapi/deepseek-v4.1-flash`로 서비스됩니다. 실행은 이미 라이브 라우터에서 증명되었습니다(2026-10-19): 노드 `7k7kapi`, 연결 `default`, 활성, 카탈로그 항목 `7k7kapi/deepseek-v4.1-flash`(`description.txt`).

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 프로바이더 | **7k7kapi** (`www.7k7kapi.xyz`) — [www.7k7kapi.xyz](https://www.7k7kapi.xyz) |
| 🎁 프로바이더가 제공하는 것 | 새 이메일 인증 계정에 250,000 할당량 단위(`quota_per_unit: 500000`에서 ≈ $0.50), 카드 불필요 |
| 🔑 키 하나로 얻는 것 | 자체 계정의 48자 키 하나, `DeepSeek（oai接口）` 그룹에 생성됨, 채팅 및 도구 검증됨 |
| 🌐 API 형태 | OpenAI 호환: `POST https://www.7k7kapi.xyz/v1/chat/completions` — `/v1/models`에 **1**개 모델 id |
| 🔒 데이터 | `www.7k7kapi.xyz`, 선택한 메일함 레일(temp.tf 또는 Emailnator) 및 자체 프록시만 접촉됨; 키는 사용자 컴퓨터에 남음 |

## 🐞 이슈

* **그룹이 전부입니다.** `default`에 생성된 토큰은 정상으로 보이다가 `503 No available channel for model deepseek-v4.1-flash`로 응답합니다 — 그리고 결정적으로 `/v1/models`는 해당 키에서 여전히 **200**으로 응답하므로, 순진한 "모델 검사"는 통과하고 채팅 호출만이 진실을 알려줍니다. 이것이 바로 여기서 관문이 목록이 아니라 완성 요청인 이유입니다(`out/mint-2026-10-22.log`).
* **코드 전송은 주소당 속도 제한이 있습니다:** `发送过于频繁，请等待 N 秒后再试` (429), N은 15에서 30 사이. 동시 진행 계정 두 개는 서로를 굶주리게 합니다; `--conc 1`에서의 생성이 측정된 작동 구성입니다.
* **코드는 요청 주소에 묶입니다.** 코드를 요청한 출구와 다른 출구에서 등록하면 패널이 `Verification code is incorrect or has expired`로 응답합니다(HTTP 200, `success: false`) — `--exits`는 코드를 재사용하는 대신 새 메일함에서 전체 계정을 다시 실행합니다.
* **일회용 도메인은 거부됩니다.** 일회용 도메인에서 `POST /api/verification` → **403** `注册仅支持主流常用邮箱（QQ、网易、Gmail、Outlook 等）及高校教育邮箱`. CLI가 제공하는 두 레일(temp.tf Microsoft 플러스 별칭, Emailnator gmail)은 모두 허용됩니다; 공유 받은편지함은 다른 테넌트의 메일을 반환할 수도 있으므로, 코드는 패널 자체의 메시지에서만 읽습니다.
* **출석 체크는 유료 장벽 뒤에 있습니다**(累计充值满 10 元即可解锁每日签到) — 여기에는 무료 일일 충전이 없습니다.

7k7kapi가 가입 형태, 메일 텍스트 또는 그룹 테이블을 변경하면, 도구는 해당 단계에서 멈추고 거부 메시지를 그대로 출력합니다. 명령과 정확한 출력을 포함하여 **[이슈를 열어주세요](../../issues)**.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 7k7kapi-bulk-apikey 기여자

</div>