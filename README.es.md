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

**Crea cuentas de 7k7kapi en masa con claves API — inferencia compatible con OpenAI, una clave por cuenta + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-1%20served-412991?style=for-the-badge)](https://www.7k7kapi.xyz/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-1-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

7k7kapi (`www.7k7kapi.xyz`) es un fork de **New API** que se registra con correo electrónico + contraseña: el captcha de registro está **desactivado** (`ts: false` en `GET /api/status`), la verificación por correo electrónico está **activada** (`em: true`), y una cosa difiere de un fork estándar — un token que queda en el grupo `default` recibe como respuesta

```
503 No available channel for model deepseek-v4.1-flash
```

La clave tiene que crearse dentro del grupo cuyos canales realmente sirven el modelo (`DeepSeek（oai接口）`, medido el 2026-10-19 y de nuevo en las diez cuentas de la ejecución del 2026-10-23), que es a lo que `--group` apunta por defecto.

El registro es, por tanto, puro HTTP — sin navegador y sin solucionador de captchas: toma un buzón, `GET /api/verification?email=…`, lee el código de 6 dígitos de la bandeja de entrada, regístrate, inicia sesión, crea el token **en el grupo correcto** (`unlimited_quota: true` — el saldo vive en la cuenta, no en la clave, así que un token limitado a 0 recibe como respuesta `Invalid token`), y luego demuestra la clave con dos completados diferentes y una llamada a la herramienta `get_time`. Solo una clave que pasa el paso 8 se escribe en `keys.txt`.

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Crédito de registro | **250.000 unidades de cuota** — leído como `quota: 250000` en las diez cuentas de la ejecución del 2026-10-23 (`accounts.json`); la cuenta creada el 2026-10-19 tenía **249.494** después de su llamada de chat (`accounts.jsonl`) |
| Precio unitario | `quota_per_unit: 500000`, así que la asignación de registro es ≈ **$0.50** (`description.txt`) |
| Check-in diario | **bloqueado** — `checkin: false` en `GET /api/status`; el panel dice 累计充值满 10 元即可解锁每日签到 (recarga ≥ ¥10 para desbloquearlo) |
| Tarjeta / teléfono | ninguno — la única barrera es el código de correo electrónico |
| Unidad de facturación | **por cuenta**: el saldo está en la cuenta, así que una clave que se agota se reemplaza creando otra cuenta — `--count N` realmente significa "N cuentas gratuitas" |
| Coste de la barrera | `deepseek-v4.1-flash` se sirve a ratio **1** en el grupo `DeepSeek（oai接口）` (qt 0), así que verificar una clave cuesta unas pocas unidades |

Sin check-in, el saldo nunca se recarga: conserva las claves, espera tener que volver a crearlas.

> 💡 El nivel gratuito lo establece 7k7kapi y puede cambiar. Consulta los números en vivo en [www.7k7kapi.xyz](https://www.7k7kapi.xyz) — y deja que la propia barrera de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 1 que hay

`GET /v1/models` con una clave nueva responde **1** id de modelo — medido `models_count: 1` en la clave de cada cuenta registrada en `accounts.json`; el id que este carril crea y verifica es `deepseek-v4.1-flash` (`providers/7k7kapi/models.json` está vacío, así que el recuento proviene de esa medición, no de un listado guardado).

A qué puede acceder una clave lo decide su **grupo**, no la clave en sí:

| ID de modelo | Grupo que lo sirve | Estado |
| --- | --- | --- |
| `deepseek-v4.1-flash` | `DeepSeek（oai接口）` | **chat-200** + `tool_calls` respondidas, en cada clave de ambas ejecuciones |
| `deepseek-v4.1-flash` | `default` | **503** `No available channel for model deepseek-v4.1-flash` |

La CLI crea el token en `DeepSeek（oai接口）` (`--group`) y solo recurre a `--alt-groups` (por defecto `default`) si falla la creación o la revelación — un token que acaba en el grupo equivocado lo detecta la barrera, no se entrega.

## 🧪 Cómo usar la API

URL base **`https://www.7k7kapi.xyz/v1`** — compatible con OpenAI, así que funciona cualquier cliente que hable OpenAI.

```bash
curl https://www.7k7kapi.xyz/v1/chat/completions \
  -H "Authorization: Bearer <48-char key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: pong"}],"max_tokens":32}'
```

La clave son 48 caracteres de base62 **sin prefijo** (la consola la muestra tal cual). La propia barrera envía `tools: [{get_time}]` con `tool_choice: "auto"` — el relay responde `tool_calls` reales, que es la comprobación que hace que una clave sea utilizable para clientes de agentes y no solo para chat.

## 🛠 Inicio rápido

```bash
cd 7k7kapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — with a pool every request leaves from one of these exits
node src/launcher.js                          # interactive: mint / verify / screen / settings

# or straight through the CLI:
node src/cli.js --count 10                    # accounts = keys, each gated before it is kept
node src/cli.js --verify-only                 # re-test every key in keys.txt with a live chat call
```

No se necesita nada más que Node 18+: sin navegador, sin solucionador de captchas, cero dependencias. La creación del 2026-10-23 llenó `keys.txt` en ~7 minutos con `--conc 1` (`providers/7k7kapi/out/mint-laneB.log`).

### 🖱️ El lanzador

`src/launcher.js` (el mismo banner que este README) pregunta por la lista de proxies, cuántas cuentas crear y el modelo usado para la barrera en vivo, recuerda las respuestas en `launcher.config.json`, y luego ejecuta la CLI: **mint**, **verify**, **screen** (probar las salidas contra el panel), **settings**, **help** y **Connect to 9Router**. `src/cli.js` es la propia CLI de creación del proveedor, copiada tal cual; `src/connect-9router.js` registra el proveedor bajo el prefijo `7k7kapi` con `deepseek-v4.1-flash` como modelo por defecto.

## ✅ Verificado y funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| `GET /api/status` | **200** — sitio `7k7kapi`, `reg: true`, `em: true`, `ts: false`, `ci: false` (el check-in es solo de pago) |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}`; el correo con el código (`7k7kapi邮箱验证邮件`) llega en segundos |
| `POST /api/user/register` | **200** `{"success":true}` — código de 6 dígitos, verificado antes de que exista la cuenta |
| `POST /api/token/` en `DeepSeek（oai接口）` | **200**, la clave se devuelve en la respuesta (este fork la devuelve en texto plano) |
| `POST /v1/chat/completions` | **200**, dos prompts diferentes respondidos con contenido diferente |
| tools | **funciona** — una petición `get_time` responde `tool_calls`; una clave cuyo canal estaba momentáneamente ausente pasó la comprobación de chat y se saltó la llamada a la herramienta en lugar de entregarse sin probar |
| `GET /v1/models` | **200**, **1** id |
| Ejecución de creación 2026-10-23 | cada cuenta se registró y cada clave pasó la barrera en vivo antes de escribirse — el registro de la ejecución es `out/mint-laneB.log` |

Evidencia, toda en disco: `providers/7k7kapi/out/mint-laneB.log` (05:59:11 → 06:06:27, grupo `DeepSeek（oai接口）`, tools `get_time`), `providers/7k7kapi/accounts.json` (un registro por clave, `gate: 200`, `quota: 250000`), `providers/7k7kapi/keys.txt`, `providers/7k7kapi/out/mint-laneA.log` (el modo de fallo: código rechazado / send-code 429 con `--conc 2`), `providers/7k7kapi/out/mint-2026-10-22.log` (un token en `default` → chat **503**, `models=200` en la misma clave), `providers/7k7kapi/accounts.jsonl` (la primera cuenta + clave, 2026-10-19).

> **Barreras de calidad.** Cada clave aquí pasó un `chat-200` en vivo antes de escribirse en `keys.txt`
> (las claves muertas nunca se entregan). Las combinaciones del router siguen la misma regla a nivel de modelo: una entrada se
> añade **solo si el modelo responde `chat-200` y puede llamar a herramientas** — un modelo sin soporte de herramientas,
> una clave muerta o un proveedor muerto se descarta en lugar de añadirse. Vuelve a ejecutar el paso de verificación cuando quieras;
> los fallos se reportan, nunca se ocultan.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 7k7kapi page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.7k7kapi.xyz/v1/chat/completions → real content = the key is live
```

Por cuenta, cada petición al panel a través de una salida fijada:

| Paso | Llamada | Notas |
| --- | --- | --- |
| buzón | `temp.tf GET /api/account?providers=outlook,hotmail&dot=0&plus=1` por defecto, o Emailnator `POST /api/generate-email` (`--mail emailnator`) | un alias plus de hotmail/outlook **privado** por cuenta; la forma sin punto es la que se registra |
| estado | `GET /api/status` | comprobación de la barrera antes de gastar un buzón |
| enviar código | `GET /api/verification?email=…` | el panel envía un código de 6 dígitos, válido 10 minutos |
| código | `POST /api/check` (temp.tf) / `POST /api/message-list` → `POST /api/message/<id>` (Emailnator) | sondea cada 5 s; el código se lee solo del propio correo del panel (anclado en `验证码`) |
| registro | `POST /api/user/register` `{username,password,email,verification_code}` | un código fallido hay que volver a solicitarlo, no reutilizarlo |
| inicio de sesión | `POST /api/user/login` | `access_token`, luego `New-Api-User: <id>` para la ruta del token |
| clave | `POST /api/token/` con `group: DeepSeek（oai接口）`, `unlimited_quota: true` | la respuesta ya lleva la clave en texto plano; `POST /api/token/<id>/key` y la lista de tokens son los respaldos |
| barrera | `POST /v1/chat/completions` | dos prompts diferentes (ambos 200, no vacíos, **diferentes**) y una llamada a la herramienta `get_time` con `tool_calls` en la respuesta |

Una clave se añade a `keys.txt` **después** de la barrera; una clave que nunca pasa se escribe en `accounts.json` con su error y se reintenta en la siguiente ejecución.

## ⚙️ Opciones de la CLI

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

| Flag | Por defecto | Significado |
| --- | --- | --- |
| `--count N` | `5` | cuentas a crear |
| `--conc N` | `1` | cuentas en curso (máx 8) |
| `--gap MS` | `1200` | pausa entre cuentas |
| `--mail <rail>` | `temptf` | `temptf` (alias plus de hotmail/outlook privado) o `emailnator` (`@gmail.com` nuevo) |
| `--model <id>` | `deepseek-v4.1-flash` | modelo usado para la barrera en vivo |
| `--group <name>` | `DeepSeek（oai接口）` | grupo en el que se crea la clave |
| `--alt-groups G` | `default` | grupos de respaldo |
| `--pool <file>` | `proxies.txt` | lista de proxies, una salida por línea |
| `--tries N` | `2` | salidas probadas por cuenta antes de rendirse |
| `--timeout MS` | `60000` | tiempo de espera por petición |
| `--checkin` | desactivado | también ejecuta el check-in diario (bloqueado aquí sin recarga) |
| `--verify-only` | desactivado | vuelve a probar cada clave en `keys.txt` |
| `--screen` | desactivado | prueba las salidas solo contra 7k7kapi |

| Env | Por defecto | Significado |
| --- | --- | --- |
| `7K7KAPI_PROXIES` | — | pool de salidas, una por línea (igual que `--pool`) |
| `7K7KAPI_BASE` | `https://www.7k7kapi.xyz` | URL base del panel |

## 🛰️ Detrás de un proxy

**Opcional — pero el panel es quisquilloso, así que vale la pena un pool.** Cada petición de una cuenta pasa por **una salida fijada**: enviar código, registrar, iniciar sesión, crear clave y la barrera salen todos desde la misma dirección, porque el panel vincula el código pendiente a la dirección solicitante y un código pedido desde una salida se rechaza cuando otra registra (`Verification code is incorrect or has expired`).

- Con un pool: `--pool proxies.txt` (o `7K7KAPI_PROXIES`); una salida muerta falla rápido y el siguiente intento toma la siguiente salida (`--tries`, por defecto 2).
- Sin un pool, la CLI imprime `running WITHOUT a proxy (direct)` y funciona igual.
- **El límite de velocidad es por dirección:** dos cuentas en curso ya alcanzan `sendCode HTTP 429 {"message":"发送过于频繁，请等待 23 秒后再试"}` (`out/mint-laneA.log`). `--conc 1` con el `--gap 1200` integrado terminó 10/10; `--conc 2` perdió todos los códigos.
- Mantén el pool fresco: las salidas candidatas públicas mueren en minutos — `--screen` te dice cuáles siguen llegando al panel.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | diez claves verificadas en vivo, una por línea — ignorado por git |
| `accounts.json` | un registro JSON por cuenta: nombre de usuario, correo electrónico, uid, cuota, grupo, resultado de la barrera, clave enmascarada — ignorado por git |
| `accounts.jsonl` | el registro de la cuenta del 2026-10-19 con su clave — ignorado por git |
| `models.json` | vacío en disco (el recuento de modelos en este README proviene de las mediciones de creación, no de un listado guardado) |
| `out/mint-laneB.log` | la ejecución 10/10, 2026-10-23 |
| `out/mint-laneA.log` | la ejecución con `--conc 2`: código rechazado, send-code 429 |
| `out/mint-2026-10-22.log` | el rastro HTTP por cuenta de una ejecución anterior |
| `public-cli.js` | el `src/cli.js` de este repositorio — mint / verify / screen (solo stdlib de node) |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado y compatible con OpenAI:

```bash
node src/connect-9router.js --api-key <48-char key>
```

Por defecto: `--9router-prefix 7k7kapi`, `--9router-name 7k7kapi`, URL base `https://www.7k7kapi.xyz/v1`, modelo por defecto `deepseek-v4.1-flash`; los modelos se sirven como `7k7kapi/deepseek-v4.1-flash`. El lanzamiento ya está probado en un router en vivo (2026-10-19): nodo `7k7kapi` con conexión `default`, activo, entrada de catálogo `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔌 Conectar con OmniRoute

[OmniRoute](https://omniroute.online) es un router autoalojado y compatible con OpenAI:

```bash
node src/connect-omniroute.js --api-key <48-char key>
```

Por defecto: `--omniroute-prefix 7k7kapi`, `--omniroute-name 7k7kapi`, URL base `https://www.7k7kapi.xyz/v1`, modelo por defecto `deepseek-v4.1-flash`; los modelos se sirven como `7k7kapi/deepseek-v4.1-flash`. El lanzamiento ya está probado en un router en vivo (2026-10-19): nodo `7k7kapi` con conexión `default`, activo, entrada de catálogo `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **7k7kapi** (`www.7k7kapi.xyz`) — [www.7k7kapi.xyz](https://www.7k7kapi.xyz) |
| 🎁 Qué da el proveedor | 250.000 unidades de cuota (≈ $0.50 a `quota_per_unit: 500000`) en una cuenta nueva verificada por correo electrónico, sin tarjeta |
| 🔑 Qué te da una clave | una clave de 48 caracteres en su propia cuenta, creada en el grupo `DeepSeek（oai接口）`, verificada para chat y herramientas |
| 🌐 Forma de la API | compatible con OpenAI: `POST https://www.7k7kapi.xyz/v1/chat/completions` — **1** id de modelo en `/v1/models` |
| 🔒 Tus datos | solo se contacta con `www.7k7kapi.xyz`, el carril de buzón que elijas (temp.tf o Emailnator) y tu propio proxy; las claves se quedan en tu máquina |

## 🐞 Problemas

* **El grupo lo es todo.** Un token creado en `default` parece correcto y luego responde `503 No available channel for model deepseek-v4.1-flash` — y, crucialmente, `/v1/models` sigue respondiendo **200** en esa clave, así que una "comprobación de modelos" ingenua pasa y solo la llamada de chat dice la verdad. Es exactamente por eso que la barrera aquí es un completado, no un listado (`out/mint-2026-10-22.log`).
* **El envío de código tiene límite de velocidad por dirección:** `发送过于频繁，请等待 N 秒后再试` (429) con N entre 15 y 30. Dos cuentas en curso se bloquean mutuamente; las creaciones con `--conc 1` son la configuración medida que funciona.
* **Un código está vinculado a la dirección solicitante.** Registra desde una salida distinta a la que pidió el código y el panel responde `Verification code is incorrect or has expired` (HTTP 200, `success: false`) — `--tries` vuelve a ejecutar toda la cuenta desde un buzón nuevo en lugar de reutilizar el código.
* **Los dominios desechables se rechazan.** `POST /api/verification` en un dominio desechable → **403** `注册仅支持主流常用邮箱（QQ、网易、Gmail、Outlook 等）及高校教育邮箱`. Los dos carriles que incluye la CLI (alias plus de Microsoft de temp.tf, gmail de Emailnator) se aceptan ambos; un buzón compartido también puede devolver el correo de otro inquilino, por lo que el código se lee solo del propio mensaje del panel.
* **El check-in está detrás de un muro de pago** (累计充值满 10 元即可解锁每日签到) — aquí no hay recarga diaria gratuita.

Si 7k7kapi cambia la forma de su registro, el texto de sus correos o la tabla de grupos, la herramienta se detiene en ese paso e imprime el rechazo textualmente. **[Abre un issue](../../issues)** con el comando y la salida exacta.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 7k7kapi-bulk-apikey contributors

</div>