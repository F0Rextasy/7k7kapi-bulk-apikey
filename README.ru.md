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

**Массовое создание аккаунтов 7k7kapi с API-ключами — инференс, совместимый с OpenAI, один ключ на аккаунт + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-1%20served-412991?style=for-the-badge)](https://www.7k7kapi.xyz/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-1-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

7k7kapi (`www.7k7kapi.xyz`) — это форк **New API**, который регистрирует по e-mail + паролю: капча при регистрации **отключена** (`ts: false` в `GET /api/status`), проверка e-mail **включена** (`em: true`), и одно отличается от стокового форка — токен, оставленный в группе `default`, получает ответ

```
503 No available channel for model deepseek-v4.1-flash
```

Ключ должен быть создан внутри группы, каналы которой действительно обслуживают модель (`DeepSeek（oai接口）`, замерено 2026-10-19 и снова на всех десяти аккаунтах запуска 2026-10-23), — именно на неё по умолчанию указывает `--group`.

Таким образом, регистрация — это чистый HTTP, без браузера и без решателя капчи: берём почтовый ящик, `GET /api/verification?email=…`, читаем 6-значный код из входящих, регистрируемся, входим, создаём токен **в нужной группе** (`unlimited_quota: true` — баланс живёт на аккаунте, а не на ключе, поэтому токен с лимитом 0 получает ответ `Invalid token`), затем подтверждаем ключ двумя разными завершениями и вызовом инструмента `get_time`. Только ключ, прошедший шаг 8, записывается в `keys.txt`.

## 🎁 Бесплатный тариф — сколько вы получаете

| Что | Значение |
| --- | --- |
| Кредит при регистрации | **250 000 единиц квоты** — считано обратно как `quota: 250000` на всех десяти аккаунтах запуска 2026-10-23 (`accounts.json`); аккаунт, созданный 2026-10-19, держал **249 494** после своего чат-вызова (`accounts.jsonl`) |
| Цена единицы | `quota_per_unit: 500000`, поэтому стартовый лимит ≈ **$0.50** (`description.txt`) |
| Ежедневная отметка | **заблокирована** — `checkin: false` в `GET /api/status`; панель сообщает 累计充值满 10 元即可解锁每日签到 (пополните на ≥ ¥10, чтобы разблокировать) |
| Карта / телефон | ни то, ни другое — единственный барьер это код из e-mail |
| Единица биллинга | **на аккаунт**: баланс находится на аккаунте, поэтому ключ, у которого закончился лимит, заменяется созданием нового аккаунта — `--count N` действительно означает «N бесплатных аккаунтов» |
| Стоимость барьера | `deepseek-v4.1-flash` обслуживается по коэффициенту **1** в группе `DeepSeek（oai接口）` (qt 0), поэтому проверка ключа стоит несколько единиц |

Отсутствие отметки означает, что баланс никогда не пополняется: храните ключи, ожидайте повторного создания.

> 💡 Бесплатный тариф устанавливается 7k7kapi и может измениться. Проверяйте актуальные цифры на [www.7k7kapi.xyz](https://www.7k7kapi.xyz) — и пусть собственный барьер инструмента решает:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 1 из них

`GET /v1/models` со свежим ключом отвечает **1** идентификатором модели — замерено `models_count: 1` на ключе каждого аккаунта, записанного в `accounts.json`; идентификатор, который создаёт и проверяет этот инструмент, — `deepseek-v4.1-flash` (`providers/7k7kapi/models.json` пуст, поэтому количество берётся из этого замера, а не из сохранённого списка).

Что доступно ключу, определяется его **группой**, а не самим ключом:

| ID модели | Группа, которая её обслуживает | Статус |
| --- | --- | --- |
| `deepseek-v4.1-flash` | `DeepSeek（oai接口）` | **chat-200** + `tool_calls` отвечает, на каждом ключе обоих запусков |
| `deepseek-v4.1-flash` | `default` | **503** `No available channel for model deepseek-v4.1-flash` |

CLI создаёт токен в `DeepSeek（oai接口）` (`--group`) и переходит к `--alt-groups` (по умолчанию `default`) только если создание или раскрытие не удалось — токен, попавший не в ту группу, отлавливается барьером, а не отправляется.

## 🧪 Как использовать API

Базовый URL **`https://www.7k7kapi.xyz/v1`** — совместим с OpenAI, поэтому работает любой клиент, говорящий на OpenAI.

```bash
curl https://www.7k7kapi.xyz/v1/chat/completions \
  -H "Authorization: Bearer <48-char key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: pong"}],"max_tokens":32}'
```

Ключ — это 48 символов base62 **без префикса** (в консоли он отображается без него). Сам барьер отправляет `tools: [{get_time}]` с `tool_choice: "auto"` — релей отвечает настоящими `tool_calls`, и именно эта проверка делает ключ пригодным для агентских клиентов, а не только для чата.

## 🛠 Быстрый старт

```bash
cd 7k7kapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — with a pool every request leaves from one of these exits
node src/launcher.js                          # interactive: mint / verify / screen / settings

# or straight through the CLI:
node src/cli.js --count 10                    # accounts = keys, each gated before it is kept
node src/cli.js --verify-only                 # re-test every key in keys.txt with a live chat call
```

Ничего, кроме Node 18+, не требуется: ни браузера, ни решателя капчи, ноль зависимостей. Создание 2026-10-23 заполнило `keys.txt` примерно за 7 минут при `--conc 1` (`providers/7k7kapi/out/mint-laneB.log`).

### 🖱️ Лаунчер

`src/launcher.js` (тот же баннер, что и в этом README) запрашивает список прокси, сколько аккаунтов создать и модель, используемую для живой проверки, запоминает ответы в `launcher.config.json`, а затем запускает CLI: **mint**, **verify**, **screen** (проверить выходы против панели), **settings**, **help** и **Connect to 9Router**. `src/cli.js` — это собственный CLI создания провайдера, скопированный дословно; `src/connect-9router.js` регистрирует провайдера под префиксом `7k7kapi` с `deepseek-v4.1-flash` в качестве модели по умолчанию.

## ✅ Проверено в работе — каждый ключ протестирован

| Проверка | Результат |
| --- | --- |
| `GET /api/status` | **200** — сайт `7k7kapi`, `reg: true`, `em: true`, `ts: false`, `ci: false` (отметка только для платных) |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}`; письмо с кодом (`7k7kapi邮箱验证邮件`) приходит в течение секунд |
| `POST /api/user/register` | **200** `{"success":true}` — 6-значный код, проверяется до создания аккаунта |
| `POST /api/token/` в `DeepSeek（oai接口）` | **200**, ключ возвращается в ответе (этот форк возвращает его в открытом виде) |
| `POST /v1/chat/completions` | **200**, два разных запроса получают ответы с разным содержимым |
| инструменты | **работает** — запрос `get_time` отвечает `tool_calls`; ключ, чей канал на мгновение пропал, прошёл проверку чата и пропустил вызов инструмента вместо того, чтобы быть отправленным непроверенным |
| `GET /v1/models` | **200**, **1** идентификатор |
| Запуск создания 2026-10-23 | каждый аккаунт зарегистрирован, и каждый ключ прошёл живую проверку до записи — журнал запуска `out/mint-laneB.log` |

Доказательства, все на диске: `providers/7k7kapi/out/mint-laneB.log` (05:59:11 → 06:06:27, группа `DeepSeek（oai接口）`, инструменты `get_time`), `providers/7k7kapi/accounts.json` (одна запись на ключ, `gate: 200`, `quota: 250000`), `providers/7k7kapi/keys.txt`, `providers/7k7kapi/out/mint-laneA.log` (режим отказа: код отклонён / send-code 429 при `--conc 2`), `providers/7k7kapi/out/mint-2026-10-22.log` (токен в `default` → чат **503**, `models=200` на том же ключе), `providers/7k7kapi/accounts.jsonl` (первый аккаунт + ключ, 2026-10-19).

> **Контроль качества.** Каждый ключ здесь прошёл живой `chat-200` до того, как был записан в `keys.txt`
> (мёртвые ключи никогда не отправляются). Комбинации роутера следуют тому же правилу на уровне модели: запись
> добавляется **только если модель отвечает `chat-200` и умеет вызывать инструменты** — модель без поддержки инструментов,
> мёртвый ключ или мёртвый провайдер отбрасывается, а не добавляется. Перезапускайте шаг проверки в любое время;
> сбои сообщаются, никогда не скрываются.

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 7k7kapi page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.7k7kapi.xyz/v1/chat/completions → real content = the key is live
```

На каждый аккаунт, каждый запрос к панели через один закреплённый выход:

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| почтовый ящик | `temp.tf GET /api/account?providers=outlook,hotmail&dot=0&plus=1` по умолчанию, или Emailnator `POST /api/generate-email` (`--mail emailnator`) | один **приватный** plus-алиас hotmail/outlook на аккаунт; регистрируется форма без точек |
| статус | `GET /api/status` | проверка барьера до того, как потрачен почтовый ящик |
| отправка кода | `GET /api/verification?email=…` | панель отправляет 6-значный код, действителен 10 минут |
| код | `POST /api/check` (temp.tf) / `POST /api/message-list` → `POST /api/message/<id>` (Emailnator) | опрос каждые 5 с; код читается только из собственного письма панели (с привязкой к `验证码`) |
| регистрация | `POST /api/user/register` `{username,password,email,verification_code}` | при неудачном коде его нужно запросить заново, а не использовать повторно |
| вход | `POST /api/user/login` | `access_token`, затем `New-Api-User: <id>` для маршрута токена |
| ключ | `POST /api/token/` с `group: DeepSeek（oai接口）`, `unlimited_quota: true` | ответ уже содержит ключ в открытом виде; `POST /api/token/<id>/key` и список токенов — запасные варианты |
| барьер | `POST /v1/chat/completions` | два разных запроса (оба 200, непустые, **разные**) и вызов инструмента `get_time` с `tool_calls` в ответе |

Ключ добавляется в `keys.txt` **после** барьера; ключ, который так и не прошёл, записывается в `accounts.json` с его ошибкой и повторяется при следующем запуске.

## ⚙️ Опции CLI

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

| Флаг | По умолчанию | Значение |
| --- | --- | --- |
| `--count N` | `5` | сколько аккаунтов создать |
| `--conc N` | `1` | аккаунтов в обработке (макс. 8) |
| `--gap MS` | `1200` | пауза между аккаунтами |
| `--mail <rail>` | `temptf` | `temptf` (приватный plus-алиас hotmail/outlook) или `emailnator` (свежий `@gmail.com`) |
| `--model <id>` | `deepseek-v4.1-flash` | модель, используемая для живой проверки |
| `--group <name>` | `DeepSeek（oai接口）` | группа, в которой создаётся ключ |
| `--alt-groups G` | `default` | запасные группы |
| `--pool <file>` | `proxies.txt` | список прокси, один выход на строку |
| `--tries N` | `2` | выходов, испробованных на аккаунт, прежде чем сдаться |
| `--timeout MS` | `60000` | таймаут на запрос |
| `--checkin` | выкл. | также выполнить ежедневную отметку (здесь заблокирована без пополнения) |
| `--verify-only` | выкл. | перепроверить каждый ключ в `keys.txt` |
| `--screen` | выкл. | проверить выходы только против 7k7kapi |

| Переменная | По умолчанию | Значение |
| --- | --- | --- |
| `7K7KAPI_PROXIES` | — | пул выходов, по одному на строку (то же, что `--pool`) |
| `7K7KAPI_BASE` | `https://www.7k7kapi.xyz` | базовый URL панели |

## 🛰️ За прокси

**Необязательно — но панель привередлива, поэтому пул того стоит.** Каждый запрос одного аккаунта идёт через **один закреплённый выход**: отправка кода, регистрация, вход, создание ключа и барьер — всё исходит с одного адреса, потому что панель привязывает ожидающий код к адресу запроса, и код, запрошенный с одного выхода, отклоняется, когда регистрируется другой (`Verification code is incorrect or has expired`).

- С пулом: `--pool proxies.txt` (или `7K7KAPI_PROXIES`); мёртвый выход быстро даёт сбой, и следующая попытка берёт следующий выход (`--tries`, по умолчанию 2).
- Без пула CLI печатает `running WITHOUT a proxy (direct)` и работает так же.
- **Ограничение скорости — на адрес:** два аккаунта в обработке уже получают `sendCode HTTP 429 {"message":"发送过于频繁，请等待 23 秒后再试"}` (`out/mint-laneA.log`). `--conc 1` со встроенным `--gap 1200` завершил 10/10; `--conc 2` потерял каждый код.
- Держите пул свежим: публичные кандидаты-выходы умирают за минуты — `--screen` подскажет, какие из них всё ещё достигают панели.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | десять живых проверенных ключей, по одному на строку — игнорируется git |
| `accounts.json` | одна JSON-запись на аккаунт: имя пользователя, e-mail, uid, квота, группа, результат барьера, замаскированный ключ — игнорируется git |
| `accounts.jsonl` | запись аккаунта от 2026-10-19 с его ключом — игнорируется git |
| `models.json` | пуст на диске (количество моделей в этом README берётся из замеров создания, а не из сохранённого списка) |
| `out/mint-laneB.log` | запуск 10/10, 2026-10-23 |
| `out/mint-laneA.log` | запуск `--conc 2`: код отклонён, send-code 429 |
| `out/mint-2026-10-22.log` | пошаговая HTTP-трассировка по аккаунтам более раннего запуска |
| `public-cli.js` | `src/cli.js` этого репозитория — mint / verify / screen (только стандартная библиотека node) |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI:

```bash
node src/connect-9router.js --api-key <48-char key>
```

По умолчанию: `--9router-prefix 7k7kapi`, `--9router-name 7k7kapi`, базовый URL `https://www.7k7kapi.xyz/v1`, модель по умолчанию `deepseek-v4.1-flash`; модели обслуживаются как `7k7kapi/deepseek-v4.1-flash`. Запуск уже проверен на живом роутере (2026-10-19): узел `7k7kapi` с соединением `default`, активен, запись в каталоге `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — это самостоятельно размещаемый роутер, совместимый с OpenAI:

```bash
node src/connect-omniroute.js --api-key <48-char key>
```

По умолчанию: `--omniroute-prefix 7k7kapi`, `--omniroute-name 7k7kapi`, базовый URL `https://www.7k7kapi.xyz/v1`, модель по умолчанию `deepseek-v4.1-flash`; модели обслуживаются как `7k7kapi/deepseek-v4.1-flash`. Запуск уже проверен на живом роутере (2026-10-19): узел `7k7kapi` с соединением `default`, активен, запись в каталоге `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **7k7kapi** (`www.7k7kapi.xyz`) — [www.7k7kapi.xyz](https://www.7k7kapi.xyz) |
| 🎁 Что даёт провайдер | 250 000 единиц квоты (≈ $0.50 при `quota_per_unit: 500000`) на свежем аккаунте с подтверждённым e-mail, без карты |
| 🔑 Что даёт один ключ | один 48-символьный ключ на собственном аккаунте, созданный в группе `DeepSeek（oai接口）`, проверенный чатом и инструментами |
| 🌐 Форма API | совместим с OpenAI: `POST https://www.7k7kapi.xyz/v1/chat/completions` — **1** идентификатор модели на `/v1/models` |
| 🔒 Ваши данные | связываются только `www.7k7kapi.xyz`, выбранный вами почтовый релей (temp.tf или Emailnator) и ваш собственный прокси; ключи остаются на вашей машине |

## 🐞 Проблемы

* **Группа — это вся игра.** Токен, созданный в `default`, выглядит нормально, а затем отвечает `503 No available channel for model deepseek-v4.1-flash` — и, что критично, `/v1/models` всё ещё отвечает **200** на этом ключе, поэтому наивная «проверка моделей» проходит, и только чат-вызов говорит правду. Именно поэтому барьер здесь — это завершение, а не список (`out/mint-2026-10-22.log`).
* **Отправка кода ограничена по скорости на адрес:** `发送过于频繁，请等待 N 秒后再试` (429), где N от 15 до 30. Два аккаунта в обработке истощают друг друга; создания при `--conc 1` — это измеренная рабочая конфигурация.
* **Код привязан к адресу запроса.** Зарегистрируйтесь с другого выхода, чем тот, что запросил код, и панель ответит `Verification code is incorrect or has expired` (HTTP 200, `success: false`) — `--tries` перезапускает весь аккаунт с нового почтового ящика вместо повторного использования кода.
* **Одноразовые домены отклоняются.** `POST /api/verification` на одноразовом домене → **403** `注册仅支持主流常用邮箱（QQ、网易、Gmail、Outlook 等）及高校教育邮箱`. Оба релея, которые поставляет CLI (plus-алиасы Microsoft от temp.tf, gmail от Emailnator), принимаются; общий почтовый ящик также может вернуть письмо другого арендатора, поэтому код читается только из собственного сообщения панели.
* **Отметка находится за платным барьером** (累计充值满 10 元即可解锁每日签到) — здесь нет бесплатного ежедневного пополнения.

Если 7k7kapi изменит форму регистрации, текст письма или таблицу групп, инструмент остановится на этом шаге и напечатает отказ дословно. **[Откройте issue](../../issues)** с командой и точным выводом.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 7k7kapi-bulk-apikey contributors

</div>