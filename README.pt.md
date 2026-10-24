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

**Crie contas 7k7kapi em massa com chaves de API — inferência compatível com OpenAI, uma chave por conta + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-1%20served-412991?style=for-the-badge)](https://www.7k7kapi.xyz/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Camada gratuita](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-1-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

7k7kapi (`www.7k7kapi.xyz`) é um fork do **New API** que se cadastra com e-mail + senha: o captcha de registro está **desligado** (`ts: false` em `GET /api/status`), a verificação por e-mail está **ligada** (`em: true`), e uma coisa difere de um fork padrão — um token deixado no grupo `default` recebe como resposta

```
503 No available channel for model deepseek-v4.1-flash
```

A chave precisa ser criada dentro do grupo cujos canais realmente servem o modelo (`DeepSeek（oai接口）`, medido em 2026-10-19 e novamente em todas as dez contas da execução de 2026-10-23), que é o padrão de `--group`.

O cadastro é, portanto, puro HTTP — sem navegador e sem solucionador de captcha: pegue uma caixa de correio, `GET /api/verification?email=…`, leia o código de 6 dígitos na caixa de entrada, registre-se, faça login, crie o token **no grupo certo** (`unlimited_quota: true` — o saldo fica na conta, não na chave, então um token limitado a 0 recebe `Invalid token`), depois comprove a chave com duas completions diferentes e uma chamada de ferramenta `get_time`. Apenas uma chave que passa no passo 8 é gravada em `keys.txt`.

## 🎁 Camada gratuita — quanto você recebe

| O quê | Valor |
| --- | --- |
| Crédito de cadastro | **250.000 unidades de cota** — lido de volta como `quota: 250000` em todas as dez contas da execução de 2026-10-23 (`accounts.json`); a conta criada em 2026-10-19 mantinha **249.494** após sua chamada de chat (`accounts.jsonl`) |
| Preço unitário | `quota_per_unit: 500000`, então a cota de cadastro é ≈ **$0,50** (`description.txt`) |
| Check-in diário | **bloqueado** — `checkin: false` em `GET /api/status`; o painel diz 累计充值满 10 元即可解锁每日签到 (recarregue ≥ ¥10 para desbloquear) |
| Cartão / telefone | nenhum dos dois — a única barreira é o código de e-mail |
| Unidade de cobrança | **por conta**: o saldo fica na conta, então uma chave que esgota é substituída criando outra conta — `--count N` significa realmente "N contas gratuitas" |
| Custo da barreira | `deepseek-v4.1-flash` é servido com proporção **1** no grupo `DeepSeek（oai接口）` (qt 0), então verificar uma chave custa algumas unidades |

Sem check-in, o saldo nunca é reabastecido: guarde as chaves, espere ter que recriar.

> 💡 A camada gratuita é definida pela 7k7kapi e pode mudar. Confira os números ao vivo em [www.7k7kapi.xyz](https://www.7k7kapi.xyz) — e deixe a própria barreira da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 1 deles

`GET /v1/models` com uma chave nova responde **1** id de modelo — medido `models_count: 1` na chave de cada conta registrada em `accounts.json`; o id que esta via cria e usa como barreira é `deepseek-v4.1-flash` (`providers/7k7kapi/models.json` está vazio, então a contagem vem dessa medição, não de uma listagem salva).

O que uma chave pode alcançar é decidido pelo seu **grupo**, não pela chave em si:

| ID do modelo | Grupo que o serve | Status |
| --- | --- | --- |
| `deepseek-v4.1-flash` | `DeepSeek（oai接口）` | **chat-200** + `tool_calls` respondido, em todas as chaves de ambas as execuções |
| `deepseek-v4.1-flash` | `default` | **503** `No available channel for model deepseek-v4.1-flash` |

A CLI cria o token em `DeepSeek（oai接口）` (`--group`) e só recorre a `--alt-groups` (padrão `default`) se a criação ou a revelação falhar — um token que cai no grupo errado é pego pela barreira, não é entregue.

## 🧪 Como usar a API

URL base **`https://www.7k7kapi.xyz/v1`** — compatível com OpenAI, então qualquer cliente que fale OpenAI funciona.

```bash
curl https://www.7k7kapi.xyz/v1/chat/completions \
  -H "Authorization: Bearer <48-char key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: pong"}],"max_tokens":32}'
```

A chave tem 48 caracteres de base62 **sem prefixo** (o console a mostra nua). A própria barreira envia `tools: [{get_time}]` com `tool_choice: "auto"` — o relay responde `tool_calls` reais, que é a verificação que torna uma chave utilizável para clientes de agente e não apenas para chat.

## 🛠 Início rápido

```bash
cd 7k7kapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — with a pool every request leaves from one of these exits
node src/launcher.js                          # interactive: mint / verify / screen / settings

# or straight through the CLI:
node src/cli.js --count 10                    # accounts = keys, each gated before it is kept
node src/cli.js --verify-only                 # re-test every key in keys.txt with a live chat call
```

Nada além do Node 18+ é necessário: sem navegador, sem solucionador de captcha, zero dependências. A criação de 2026-10-23 preencheu `keys.txt` em ~7 minutos com `--conc 1` (`providers/7k7kapi/out/mint-laneB.log`).

### 🖱️ O launcher

`src/launcher.js` (mesmo banner deste README) pergunta pela lista de proxies, quantas contas criar e o modelo usado para a barreira ao vivo, memoriza as respostas em `launcher.config.json`, e então executa a CLI: **mint**, **verify**, **screen** (testa as saídas contra o painel), **settings**, **help** e **Connect to 9Router**. `src/cli.js` é a própria CLI de criação do provedor, copiada literalmente; `src/connect-9router.js` registra o provedor sob o prefixo `7k7kapi` com `deepseek-v4.1-flash` como modelo padrão.

## ✅ Verificado e funcionando — toda chave é testada

| Verificação | Resultado |
| --- | --- |
| `GET /api/status` | **200** — site `7k7kapi`, `reg: true`, `em: true`, `ts: false`, `ci: false` (check-in é só para pagantes) |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}`; o e-mail com o código (`7k7kapi邮箱验证邮件`) chega em segundos |
| `POST /api/user/register` | **200** `{"success":true}` — código de 6 dígitos, verificado antes de a conta existir |
| `POST /api/token/` em `DeepSeek（oai接口）` | **200**, chave retornada na resposta (este fork a retorna em texto simples) |
| `POST /v1/chat/completions` | **200**, dois prompts diferentes respondidos com conteúdos diferentes |
| tools | **funciona** — uma requisição `get_time` responde `tool_calls`; uma chave cujo canal estava momentaneamente fora passou na verificação de sanidade do chat e pulou a chamada de ferramenta em vez de ser entregue sem comprovação |
| `GET /v1/models` | **200**, **1** id |
| Execução de criação 2026-10-23 | toda conta registrada e toda chave passou na barreira ao vivo antes de ser gravada — o log da execução é `out/mint-laneB.log` |

Evidências, todas em disco: `providers/7k7kapi/out/mint-laneB.log` (05:59:11 → 06:06:27, grupo `DeepSeek（oai接口）`, tools `get_time`), `providers/7k7kapi/accounts.json` (um registro por chave, `gate: 200`, `quota: 250000`), `providers/7k7kapi/keys.txt`, `providers/7k7kapi/out/mint-laneA.log` (o modo de falha: código recusado / send-code 429 em `--conc 2`), `providers/7k7kapi/out/mint-2026-10-22.log` (um token em `default` → chat **503**, `models=200` na mesma chave), `providers/7k7kapi/accounts.jsonl` (a primeira conta + chave, 2026-10-19).

> **Barreiras de qualidade.** Toda chave aqui passou por um `chat-200` ao vivo antes de ser gravada em `keys.txt`
> (chaves mortas nunca são entregues). As combinações de roteador seguem a mesma regra no nível do modelo: uma entrada é
> adicionada **somente se o modelo responder `chat-200` e conseguir chamar ferramentas** — um modelo sem suporte a ferramentas,
> uma chave morta ou um provedor morto é descartado em vez de adicionado. Reexecute a etapa de verificação a qualquer momento;
> as falhas são relatadas, nunca escondidas.

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 7k7kapi page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.7k7kapi.xyz/v1/chat/completions → real content = the key is live
```

Por conta, toda requisição ao painel através de uma saída fixada:

| Passo | Chamada | Notas |
| --- | --- | --- |
| caixa de correio | `temp.tf GET /api/account?providers=outlook,hotmail&dot=0&plus=1` por padrão, ou Emailnator `POST /api/generate-email` (`--mail emailnator`) | um alias plus **privado** de hotmail/outlook por conta; a forma sem ponto é a que é registrada |
| status | `GET /api/status` | verificação da barreira antes de gastar uma caixa de correio |
| enviar código | `GET /api/verification?email=…` | o painel envia um código de 6 dígitos, válido por 10 minutos |
| código | `POST /api/check` (temp.tf) / `POST /api/message-list` → `POST /api/message/<id>` (Emailnator) | consulta a cada 5 s; o código é lido apenas do próprio e-mail do painel (ancorado em `验证码`) |
| registrar | `POST /api/user/register` `{username,password,email,verification_code}` | um código que falhou precisa ser solicitado de novo, não reutilizado |
| login | `POST /api/user/login` | `access_token`, depois `New-Api-User: <id>` para a rota do token |
| chave | `POST /api/token/` com `group: DeepSeek（oai接口）`, `unlimited_quota: true` | a resposta já traz a chave em texto simples; `POST /api/token/<id>/key` e a lista de tokens são os fallbacks |
| barreira | `POST /v1/chat/completions` | dois prompts diferentes (ambos 200, não vazios, **diferentes**) e uma chamada de ferramenta `get_time` com `tool_calls` na resposta |

Uma chave é anexada a `keys.txt` **depois** da barreira; uma chave que nunca passa é gravada em `accounts.json` com seu erro e tentada novamente na próxima execução.

## ⚙️ Opções da CLI

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

| Flag | Padrão | Significado |
| --- | --- | --- |
| `--count N` | `5` | contas a criar |
| `--conc N` | `1` | contas em andamento (máx 8) |
| `--gap MS` | `1200` | pausa entre contas |
| `--mail <rail>` | `temptf` | `temptf` (alias plus privado de hotmail/outlook) ou `emailnator` (`@gmail.com` novo) |
| `--model <id>` | `deepseek-v4.1-flash` | modelo usado para a barreira ao vivo |
| `--group <name>` | `DeepSeek（oai接口）` | grupo em que a chave é criada |
| `--alt-groups G` | `default` | grupos de fallback |
| `--pool <file>` | `proxies.txt` | lista de proxies, uma saída por linha |
| `--exits N` | `6` | saídas tentadas por conta antes de desistir |
| `--timeout MS` | `60000` | timeout por requisição |
| `--checkin` | desligado | também executa o check-in diário (bloqueado aqui sem recarga) |
| `--verify-only` | desligado | re-testa toda chave em `keys.txt` |
| `--screen` | desligado | testa as saídas apenas contra a 7k7kapi |

| Env | Padrão | Significado |
| --- | --- | --- |
| `7K7KAPI_PROXIES` | — | pool de saídas, uma por linha (igual a `--pool`) |
| `7K7KAPI_BASE` | `https://www.7k7kapi.xyz` | URL base do painel |

## 🛰️ Atrás de um proxy

**Opcional — mas o painel é exigente, então vale a pena ter um pool.** Toda requisição de uma conta passa por **uma saída fixada**: enviar código, registrar, login, criar chave e a barreira saem todos do mesmo endereço, porque o painel vincula o código pendente ao endereço solicitante e um código pedido de uma saída é recusado quando outra registra (`Verification code is incorrect or has expired`).

- Com um pool: `--pool proxies.txt` (ou `7K7KAPI_PROXIES`); uma saída morta falha rápido e a próxima tentativa pega a próxima saída (`--exits`, padrão 6).
- Sem um pool, a CLI imprime `running WITHOUT a proxy (direct)` e funciona da mesma forma.
- **O limite de taxa é por endereço:** duas contas em andamento já atingem `sendCode HTTP 429 {"message":"发送过于频繁，请等待 23 秒后再试"}` (`out/mint-laneA.log`). `--conc 1` com o `--gap 1200` embutido terminou 10/10; `--conc 2` perdeu todos os códigos.
- Mantenha o pool atualizado: saídas candidatas públicas morrem em minutos — `--screen` diz quais ainda alcançam o painel.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | dez chaves verificadas ao vivo, uma por linha — ignorado pelo git |
| `accounts.json` | um registro JSON por conta: nome de usuário, e-mail, uid, cota, grupo, resultado da barreira, chave mascarada — ignorado pelo git |
| `accounts.jsonl` | o registro da conta de 2026-10-19 com sua chave — ignorado pelo git |
| `models.json` | vazio em disco (a contagem de modelos neste README vem das medições de criação, não de uma listagem salva) |
| `out/mint-laneB.log` | a execução 10/10, 2026-10-23 |
| `out/mint-laneA.log` | a execução `--conc 2`: código recusado, send-code 429 |
| `out/mint-2026-10-22.log` | o rastreamento HTTP por conta de uma execução anterior |
| `public-cli.js` | o `src/cli.js` deste repositório — mint / verify / screen (apenas stdlib do node) |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI:

```bash
node src/connect-9router.js --api-key <48-char key>
```

Padrões: `--9router-prefix 7k7kapi`, `--9router-name 7k7kapi`, URL base `https://www.7k7kapi.xyz/v1`, modelo padrão `deepseek-v4.1-flash`; os modelos são servidos como `7k7kapi/deepseek-v4.1-flash`. A inicialização já está comprovada em um roteador ao vivo (2026-10-19): nó `7k7kapi` com conexão `default`, ativo, entrada de catálogo `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔌 Conectar ao OmniRoute

[OmniRoute](https://omniroute.online) é um roteador auto-hospedado e compatível com OpenAI:

```bash
node src/connect-omniroute.js --api-key <48-char key>
```

Padrões: `--omniroute-prefix 7k7kapi`, `--omniroute-name 7k7kapi`, URL base `https://www.7k7kapi.xyz/v1`, modelo padrão `deepseek-v4.1-flash`; os modelos são servidos como `7k7kapi/deepseek-v4.1-flash`. A inicialização já está comprovada em um roteador ao vivo (2026-10-19): nó `7k7kapi` com conexão `default`, ativo, entrada de catálogo `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔑 O que uma chave lhe dá

| | |
| --- | --- |
| 🏢 Provedor | **7k7kapi** (`www.7k7kapi.xyz`) — [www.7k7kapi.xyz](https://www.7k7kapi.xyz) |
| 🎁 O que o provedor dá | 250.000 unidades de cota (≈ $0,50 a `quota_per_unit: 500000`) em uma conta nova verificada por e-mail, sem cartão |
| 🔑 O que uma chave lhe dá | uma chave de 48 caracteres em sua própria conta, criada no grupo `DeepSeek（oai接口）`, verificada para chat e ferramentas |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://www.7k7kapi.xyz/v1/chat/completions` — **1** id de modelo em `/v1/models` |
| 🔒 Seus dados | apenas `www.7k7kapi.xyz`, a via de caixa de correio que você escolher (temp.tf ou Emailnator) e seu próprio proxy são contatados; as chaves ficam na sua máquina |

## 🐞 Problemas

* **O grupo é o jogo inteiro.** Um token criado em `default` parece bom e então responde `503 No available channel for model deepseek-v4.1-flash` — e, crucialmente, `/v1/models` ainda responde **200** nessa chave, então uma "verificação de modelos" ingênua passa e só a chamada de chat diz a verdade. É exatamente por isso que a barreira aqui é uma completion, não uma listagem (`out/mint-2026-10-22.log`).
* **O envio de código tem limite de taxa por endereço:** `发送过于频繁，请等待 N 秒后再试` (429) com N entre 15 e 30. Duas contas em andamento se esfomeiam mutuamente; criações com `--conc 1` são a configuração funcional medida.
* **Um código é vinculado ao endereço solicitante.** Registre-se de uma saída diferente da que pediu o código e o painel responde `Verification code is incorrect or has expired` (HTTP 200, `success: false`) — `--exits` reexecuta a conta inteira a partir de uma nova caixa de correio em vez de reutilizar o código.
* **Domínios descartáveis são recusados.** `POST /api/verification` em um domínio descartável → **403** `注册仅支持主流常用邮箱（QQ、网易、Gmail、Outlook 等）及高校教育邮箱`. As duas vias que a CLI oferece (aliases plus da Microsoft via temp.tf, gmail do Emailnator) são ambas aceitas; uma caixa de entrada compartilhada também pode devolver o e-mail de outro inquilino, e é por isso que o código é lido apenas da própria mensagem do painel.
* **O check-in está atrás de um paywall** (累计充值满 10 元即可解锁每日签到) — não há reabastecimento diário gratuito aqui.

Se a 7k7kapi mudar o formato do cadastro, o texto dos e-mails ou a tabela de grupos, a ferramenta para nesse passo e imprime a recusa literalmente. **[Abra uma issue](../../issues)** com o comando e a saída exata.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 7k7kapi-bulk-apikey contributors

</div>