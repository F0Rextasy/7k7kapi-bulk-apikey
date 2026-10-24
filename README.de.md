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

**7k7kapi-Konten mit API-Schlüsseln im Bulk anlegen — OpenAI-kompatible Inferenz, ein Schlüssel pro Konto + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-1%20served-412991?style=for-the-badge)](https://www.7k7kapi.xyz/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-1-of-them) · [🧪 API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 Funktionsweise](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

7k7kapi (`www.7k7kapi.xyz`) ist ein **New-API**-Fork, bei dem man sich mit E-Mail + Passwort registriert: Das Registrierungs-Captcha ist **aus** (`ts: false` in `GET /api/status`), die E-Mail-Verifizierung ist **an** (`em: true`), und eines unterscheidet sich von einem Standard-Fork — ein Token, das in der Gruppe `default` verbleibt, wird beantwortet mit

```
503 No available channel for model deepseek-v4.1-flash
```

Der Schlüssel muss in der Gruppe angelegt werden, deren Kanäle das Modell tatsächlich bedienen (`DeepSeek（oai接口）`, gemessen am 2026-10-19 und erneut bei allen zehn Konten des Laufs vom 2026-10-23), und genau darauf ist `--group` voreingestellt.

Die Registrierung ist daher reines HTTP — kein Browser und kein Captcha-Solver: Man nimmt ein Postfach, `GET /api/verification?email=…`, liest den 6-stelligen Code aus dem Posteingang, registriert sich, meldet sich an, erstellt das Token **in der richtigen Gruppe** (`unlimited_quota: true` — das Guthaben liegt auf dem Konto, nicht auf dem Schlüssel, daher wird ein Token mit Obergrenze 0 mit `Invalid token` beantwortet) und beweist den Schlüssel dann mit zwei verschiedenen Completions und einem `get_time`-Tool-Aufruf. Nur ein Schlüssel, der Schritt 8 besteht, wird in `keys.txt` geschrieben.

## 🎁 Kostenlose Stufe — wie viel man bekommt

| Was | Wert |
| --- | --- |
| Registrierungsguthaben | **250.000 Quota-Einheiten** — bei allen zehn Konten des Laufs vom 2026-10-23 als `quota: 250000` zurückgelesen (`accounts.json`); das am 2026-10-19 erstellte Konto hielt nach seinem Chat-Aufruf **249.494** (`accounts.jsonl`) |
| Stückpreis | `quota_per_unit: 500000`, das Registrierungsguthaben beträgt also ≈ **$0.50** (`description.txt`) |
| Täglicher Check-in | **gesperrt** — `checkin: false` in `GET /api/status`; das Panel sagt 累计充值满 10 元即可解锁每日签到 (lade ≥ ¥10 auf, um es freizuschalten) |
| Karte / Telefon | keines von beiden — das einzige Hindernis ist der E-Mail-Code |
| Abrechnungseinheit | **pro Konto**: Das Guthaben liegt auf dem Konto, daher wird ein Schlüssel, der leerläuft, ersetzt, indem ein weiteres Konto erstellt wird — `--count N` bedeutet wirklich „N kostenlose Konten“ |
| Kosten des Gates | `deepseek-v4.1-flash` wird in der Gruppe `DeepSeek（oai接口）` mit Ratio **1** bedient (qt 0), die Verifizierung eines Schlüssels kostet also ein paar Einheiten |

Kein Check-in bedeutet, dass das Guthaben nie aufgefüllt wird: Behalte die Schlüssel, rechne damit, neu zu prägen.

> 💡 Die kostenlose Stufe wird von 7k7kapi festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [www.7k7kapi.xyz](https://www.7k7kapi.xyz) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 1 davon

`GET /v1/models` mit einem frischen Schlüssel antwortet mit **1** Modell-ID — gemessen `models_count: 1` beim Schlüssel jedes in `accounts.json` erfassten Kontos; die ID, die diese Spur prägt und auf die sie gated, ist `deepseek-v4.1-flash` (`providers/7k7kapi/models.json` ist leer, die Anzahl stammt also aus dieser Messung, nicht aus einem gespeicherten Listing).

Was ein Schlüssel erreichen kann, entscheidet seine **Gruppe**, nicht der Schlüssel selbst:

| Modell-ID | Gruppe, die es bedient | Status |
| --- | --- | --- |
| `deepseek-v4.1-flash` | `DeepSeek（oai接口）` | **chat-200** + `tool_calls` beantwortet, bei jedem Schlüssel beider Läufe |
| `deepseek-v4.1-flash` | `default` | **503** `No available channel for model deepseek-v4.1-flash` |

Die CLI erstellt das Token in `DeepSeek（oai接口）` (`--group`) und weicht nur dann auf `--alt-groups` (Standard `default`) aus, wenn das Erstellen oder das Aufdecken fehlschlägt — ein Token, das in der falschen Gruppe landet, wird vom Gate erfasst, nicht ausgeliefert.

## 🧪 So verwendet man die API

Basis-URL **`https://www.7k7kapi.xyz/v1`** — OpenAI-kompatibel, jeder OpenAI-sprechende Client funktioniert also.

```bash
curl https://www.7k7kapi.xyz/v1/chat/completions \
  -H "Authorization: Bearer <48-char key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: pong"}],"max_tokens":32}'
```

Der Schlüssel besteht aus 48 Zeichen Base62 **ohne Präfix** (die Konsole zeigt ihn blank). Das Gate selbst sendet `tools: [{get_time}]` mit `tool_choice: "auto"` — das Relay antwortet mit echten `tool_calls`, und genau diese Prüfung macht einen Schlüssel für Agent-Clients nutzbar und nicht nur für Chat.

## 🛠 Schnellstart

```bash
cd 7k7kapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — with a pool every request leaves from one of these exits
node src/launcher.js                          # interactive: mint / verify / screen / settings

# or straight through the CLI:
node src/cli.js --count 10                    # accounts = keys, each gated before it is kept
node src/cli.js --verify-only                 # re-test every key in keys.txt with a live chat call
```

Es wird nichts außer Node 18+ benötigt: kein Browser, kein Captcha-Solver, null Abhängigkeiten. Die Prägung vom 2026-10-23 füllte `keys.txt` in ~7 Minuten bei `--conc 1` (`providers/7k7kapi/out/mint-laneB.log`).

### 🖱️ Der Launcher

`src/launcher.js` (dasselbe Banner wie diese README) fragt nach der Proxy-Liste, wie vielen Konten geprägt werden sollen und dem für das Live-Gate verwendeten Modell, merkt sich die Antworten in `launcher.config.json` und führt dann die CLI aus: **mint**, **verify**, **screen** (die Exits gegen das Panel testen), **settings**, **help** und **Connect to 9Router**. `src/cli.js` ist die eigene Mint-CLI des Anbieters, wortwörtlich kopiert; `src/connect-9router.js` registriert den Anbieter unter dem Präfix `7k7kapi` mit `deepseek-v4.1-flash` als Standardmodell.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `GET /api/status` | **200** — Seite `7k7kapi`, `reg: true`, `em: true`, `ts: false`, `ci: false` (Check-in ist nur mit Aufladung möglich) |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}`; die Code-Mail (`7k7kapi邮箱验证邮件`) kommt innerhalb von Sekunden an |
| `POST /api/user/register` | **200** `{"success":true}` — 6-stelliger Code, verifiziert, bevor das Konto existiert |
| `POST /api/token/` in `DeepSeek（oai接口）` | **200**, Schlüssel in der Antwort zurückgegeben (dieser Fork gibt ihn im Klartext zurück) |
| `POST /v1/chat/completions` | **200**, zwei verschiedene Prompts mit unterschiedlichem Inhalt beantwortet |
| Tools | **funktioniert** — eine `get_time`-Anfrage beantwortet `tool_calls`; ein Schlüssel, dessen Kanal kurzzeitig weg war, bestand die Chat-Sanity-Prüfung und übersprang den Tool-Aufruf, statt ungeprüft ausgeliefert zu werden |
| `GET /v1/models` | **200**, **1** ID |
| Prägelauf 2026-10-23 | jedes Konto registriert und jeder Schlüssel bestand das Live-Gate, bevor er geschrieben wurde — das Lauf-Protokoll ist `out/mint-laneB.log` |

Belege, alle auf der Festplatte: `providers/7k7kapi/out/mint-laneB.log` (05:59:11 → 06:06:27, Gruppe `DeepSeek（oai接口）`, Tools `get_time`), `providers/7k7kapi/accounts.json` (ein Datensatz pro Schlüssel, `gate: 200`, `quota: 250000`), `providers/7k7kapi/keys.txt`, `providers/7k7kapi/out/mint-laneA.log` (der Fehlermodus: Code abgelehnt / send-code 429 bei `--conc 2`), `providers/7k7kapi/out/mint-2026-10-22.log` (ein Token in `default` → Chat **503**, `models=200` beim selben Schlüssel), `providers/7k7kapi/accounts.jsonl` (das erste Konto + Schlüssel, 2026-10-19).

> **Qualitätsgates.** Jeder Schlüssel hier bestand ein Live-`chat-200`, bevor er in `keys.txt` geschrieben wurde
> (tote Schlüssel werden nie ausgeliefert). Router-Kombinationen folgen derselben Regel auf Modellebene: Ein Eintrag wird
> **nur hinzugefügt, wenn das Modell `chat-200` antwortet und Tools aufrufen kann** — ein Modell ohne Tool-Unterstützung,
> ein toter Schlüssel oder ein toter Anbieter wird verworfen statt hinzugefügt. Führe den Verifizierungsschritt jederzeit erneut aus;
> Fehler werden gemeldet, nie versteckt.

## 🧭 Funktionsweise

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 7k7kapi page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.7k7kapi.xyz/v1/chat/completions → real content = the key is live
```

Pro Konto geht jede Panel-Anfrage über einen festgelegten Exit:

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Postfach | `temp.tf GET /api/account?providers=outlook,hotmail&dot=0&plus=1` standardmäßig, oder Emailnator `POST /api/generate-email` (`--mail emailnator`) | ein **privater** Hotmail/Outlook-Plus-Alias pro Konto; die punktfreie Form ist die, die registriert wird |
| Status | `GET /api/status` | Gate-Prüfung, bevor ein Postfach verbraucht wird |
| Code senden | `GET /api/verification?email=…` | das Panel mailt einen 6-stelligen Code, 10 Minuten gültig |
| Code | `POST /api/check` (temp.tf) / `POST /api/message-list` → `POST /api/message/<id>` (Emailnator) | fragt alle 5 s ab; der Code wird nur aus der eigenen Mail des Panels gelesen (`验证码`-verankert) |
| Registrieren | `POST /api/user/register` `{username,password,email,verification_code}` | ein fehlgeschlagener Code muss neu angefordert werden, nicht wiederverwendet |
| Anmelden | `POST /api/user/login` | `access_token`, dann `New-Api-User: <id>` für die Token-Route |
| Schlüssel | `POST /api/token/` mit `group: DeepSeek（oai接口）`, `unlimited_quota: true` | die Antwort enthält bereits den Klartext-Schlüssel; `POST /api/token/<id>/key` und die Token-Liste sind die Fallbacks |
| Gate | `POST /v1/chat/completions` | zwei verschiedene Prompts (beide 200, nicht leer, **unterschiedlich**) und ein `get_time`-Tool-Aufruf mit `tool_calls` in der Antwort |

Ein Schlüssel wird **nach** dem Gate an `keys.txt` angehängt; ein Schlüssel, der nie besteht, wird mit seinem Fehler in `accounts.json` geschrieben und beim nächsten Lauf erneut versucht.

## ⚙️ CLI-Optionen

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

| Flag | Standard | Bedeutung |
| --- | --- | --- |
| `--count N` | `5` | Anzahl der zu prägenden Konten |
| `--conc N` | `1` | Konten gleichzeitig in Bearbeitung (max 8) |
| `--gap MS` | `1200` | Pause zwischen Konten |
| `--mail <rail>` | `temptf` | `temptf` (privater Hotmail/Outlook-Plus-Alias) oder `emailnator` (frische `@gmail.com`) |
| `--model <id>` | `deepseek-v4.1-flash` | für das Live-Gate verwendetes Modell |
| `--group <name>` | `DeepSeek（oai接口）` | Gruppe, in der der Schlüssel erstellt wird |
| `--alt-groups G` | `default` | Fallback-Gruppen |
| `--pool <file>` | `proxies.txt` | Proxy-Liste, ein Exit pro Zeile |
| `--exits N` | `6` | pro Konto versuchte Exits, bevor aufgegeben wird |
| `--timeout MS` | `60000` | Timeout pro Anfrage |
| `--checkin` | aus | führt zusätzlich den täglichen Check-in aus (hier ohne Aufladung gesperrt) |
| `--verify-only` | aus | testet jeden Schlüssel in `keys.txt` erneut |
| `--screen` | aus | testet die Exits nur gegen 7k7kapi |

| Env | Standard | Bedeutung |
| --- | --- | --- |
| `7K7KAPI_PROXIES` | — | Exit-Pool, einer pro Zeile (wie `--pool`) |
| `7K7KAPI_BASE` | `https://www.7k7kapi.xyz` | Basis-URL des Panels |

## 🛰️ Hinter einem Proxy

**Optional — aber das Panel ist wählerisch, ein Pool lohnt sich also.** Jede Anfrage eines Kontos geht über **einen festgelegten Exit**: Code senden, Registrieren, Anmelden, Schlüssel erstellen und das Gate gehen alle von derselben Adresse aus, weil das Panel den ausstehenden Code an die anfragende Adresse bindet und ein Code, der von einem Exit angefordert wurde, abgelehnt wird, wenn ein anderer sich registriert (`Verification code is incorrect or has expired`).

- Mit einem Pool: `--pool proxies.txt` (oder `7K7KAPI_PROXIES`); ein toter Exit schlägt schnell fehl und der nächste Versuch nimmt den nächsten Exit (`--exits`, Standard 6).
- Ohne Pool gibt die CLI `running WITHOUT a proxy (direct)` aus und funktioniert genauso.
- **Das Rate-Limit gilt pro Adresse:** Zwei Konten gleichzeitig in Bearbeitung stoßen bereits auf `sendCode HTTP 429 {"message":"发送过于频繁，请等待 23 秒后再试"}` (`out/mint-laneA.log`). `--conc 1` mit dem eingebauten `--gap 1200` schloss 10/10 ab; `--conc 2` verlor jeden Code.
- Halte den Pool frisch: öffentliche Kandidaten-Exits sterben in Minuten — `--screen` sagt dir, welche das Panel noch erreichen.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | zehn live-verifizierte Schlüssel, einer pro Zeile — von Git ignoriert |
| `accounts.json` | ein JSON-Datensatz pro Konto: Benutzername, E-Mail, uid, Quota, Gruppe, Gate-Ergebnis, maskierter Schlüssel — von Git ignoriert |
| `accounts.jsonl` | der Kontodatensatz vom 2026-10-19 mit seinem Schlüssel — von Git ignoriert |
| `models.json` | auf der Festplatte leer (die Modellanzahl in dieser README stammt aus den Prägemessungen, nicht aus einem gespeicherten Listing) |
| `out/mint-laneB.log` | der 10/10-Lauf, 2026-10-23 |
| `out/mint-laneA.log` | der `--conc 2`-Lauf: Code abgelehnt, send-code 429 |
| `out/mint-2026-10-22.log` | der HTTP-Trace pro Konto eines früheren Laufs |
| `public-cli.js` | die `src/cli.js` dieses Repos — mint / verify / screen (nur Node-Stdlib) |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
node src/connect-9router.js --api-key <48-char key>
```

Standardwerte: `--9router-prefix 7k7kapi`, `--9router-name 7k7kapi`, Basis-URL `https://www.7k7kapi.xyz/v1`, Standardmodell `deepseek-v4.1-flash`; Modelle werden als `7k7kapi/deepseek-v4.1-flash` bereitgestellt. Der Start ist bereits auf einem Live-Router bewiesen (2026-10-19): Node `7k7kapi` mit Verbindung `default`, aktiv, Katalogeintrag `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔌 Mit OmniRoute verbinden

[OmniRoute](https://omniroute.online) ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
node src/connect-omniroute.js --api-key <48-char key>
```

Standardwerte: `--omniroute-prefix 7k7kapi`, `--omniroute-name 7k7kapi`, Basis-URL `https://www.7k7kapi.xyz/v1`, Standardmodell `deepseek-v4.1-flash`; Modelle werden als `7k7kapi/deepseek-v4.1-flash` bereitgestellt. Der Start ist bereits auf einem Live-Router bewiesen (2026-10-19): Node `7k7kapi` mit Verbindung `default`, aktiv, Katalogeintrag `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔑 Was ein Schlüssel einem bringt

| | |
| --- | --- |
| 🏢 Anbieter | **7k7kapi** (`www.7k7kapi.xyz`) — [www.7k7kapi.xyz](https://www.7k7kapi.xyz) |
| 🎁 Was der Anbieter gibt | 250.000 Quota-Einheiten (≈ $0.50 bei `quota_per_unit: 500000`) auf einem frischen, per E-Mail verifizierten Konto, ohne Karte |
| 🔑 Was ein Schlüssel einem bringt | ein 48-stelliger Schlüssel auf seinem eigenen Konto, erstellt in der Gruppe `DeepSeek（oai接口）`, chat- und tool-verifiziert |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://www.7k7kapi.xyz/v1/chat/completions` — **1** Modell-ID auf `/v1/models` |
| 🔒 Deine Daten | nur `www.7k7kapi.xyz`, die von dir gewählte Mailbox-Schiene (temp.tf oder Emailnator) und dein eigener Proxy werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

* **Die Gruppe ist das ganze Spiel.** Ein in `default` erstelltes Token sieht gut aus und antwortet dann mit `503 No available channel for model deepseek-v4.1-flash` — und entscheidend ist, dass `/v1/models` bei diesem Schlüssel weiterhin **200** antwortet, sodass eine naive „Models-Prüfung“ besteht und nur der Chat-Aufruf die Wahrheit sagt. Genau deshalb ist das Gate hier eine Completion, kein Listing (`out/mint-2026-10-22.log`).
* **Send-code ist pro Adresse rate-limitiert:** `发送过于频繁，请等待 N 秒后再试` (429) mit N zwischen 15 und 30. Zwei Konten gleichzeitig in Bearbeitung hungern sich gegenseitig aus; Prägungen mit `--conc 1` sind die gemessene funktionierende Konfiguration.
* **Ein Code ist an die anfragende Adresse gebunden.** Registriere dich von einem anderen Exit als dem, der den Code angefordert hat, und das Panel antwortet mit `Verification code is incorrect or has expired` (HTTP 200, `success: false`) — `--exits` führt das gesamte Konto von einer neuen Mailbox aus erneut aus, statt den Code wiederzuverwenden.
* **Wegwerf-Domains werden abgelehnt.** `POST /api/verification` bei einer Wegwerf-Domain → **403** `注册仅支持主流常用邮箱（QQ、网易、Gmail、Outlook 等）及高校教育邮箱`. Die beiden Schienen, die die CLI mitbringt (temp.tf Microsoft-Plus-Aliase, Emailnator-Gmail), werden beide akzeptiert; ein geteilter Posteingang kann auch die Mail eines anderen Mandanten zurückgeben, weshalb der Code nur aus der eigenen Nachricht des Panels gelesen wird.
* **Der Check-in liegt hinter einer Bezahlschranke** (累计充值满 10 元即可解锁每日签到) — hier gibt es keine kostenlose tägliche Auffüllung.

Wenn 7k7kapi seine Registrierungsform, seinen Mail-Text oder die Gruppentabelle ändert, stoppt das Tool an diesem Schritt und gibt die Ablehnung wortwörtlich aus. **[Öffne ein Issue](../../issues)** mit dem Befehl und der exakten Ausgabe.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 7k7kapi-bulk-apikey contributors

</div>