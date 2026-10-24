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

**Créer en masse des comptes 7k7kapi avec des clés API — inférence compatible OpenAI, une clé par compte + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-1%20served-412991?style=for-the-badge)](https://www.7k7kapi.xyz/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-1-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi ça existe

7k7kapi (`www.7k7kapi.xyz`) est un fork de **New API** qui s'inscrit avec e-mail + mot de passe : le captcha d'inscription est **désactivé** (`ts: false` dans `GET /api/status`), la vérification par e-mail est **activée** (`em: true`), et une chose diffère d'un fork standard — un jeton laissé dans le groupe `default` reçoit comme réponse

```
503 No available channel for model deepseek-v4.1-flash
```

La clé doit être créée dans le groupe dont les canaux servent réellement le modèle (`DeepSeek（oai接口）`, mesuré le 2026-10-19 et de nouveau sur les dix comptes de l'exécution du 2026-10-23), ce qui correspond à la valeur par défaut de `--group`.

L'inscription est donc du pur HTTP — pas de navigateur ni de solveur de captcha : prenez une boîte mail, `GET /api/verification?email=…`, lisez le code à 6 chiffres dans la boîte de réception, inscrivez-vous, connectez-vous, créez le jeton **dans le bon groupe** (`unlimited_quota: true` — le solde vit sur le compte, pas sur la clé, donc un jeton plafonné à 0 reçoit `Invalid token`), puis prouvez la clé avec deux complétions différentes et un appel d'outil `get_time`. Seule une clé qui passe l'étape 8 est écrite dans `keys.txt`.

## 🎁 Offre gratuite — ce que vous obtenez

| Quoi | Valeur |
| --- | --- |
| Crédit d'inscription | **250 000 unités de quota** — relu comme `quota: 250000` sur les dix comptes de l'exécution du 2026-10-23 (`accounts.json`) ; le compte créé le 2026-10-19 détenait **249 494** après son appel de chat (`accounts.jsonl`) |
| Prix unitaire | `quota_per_unit: 500000`, donc l'allocation d'inscription est ≈ **0,50 $** (`description.txt`) |
| Check-in quotidien | **verrouillé** — `checkin: false` dans `GET /api/status` ; le panneau indique 累计充值满 10 元即可解锁每日签到 (rechargez ≥ 10 ¥ pour le débloquer) |
| Carte / téléphone | aucun — la seule barrière est le code e-mail |
| Unité de facturation | **par compte** : le solde vit sur le compte, donc une clé à sec est remplacée en créant un autre compte — `--count N` signifie réellement « N comptes gratuits » |
| Coût de la barrière | `deepseek-v4.1-flash` est servi au ratio **1** dans le groupe `DeepSeek（oai接口）` (qt 0), donc vérifier une clé coûte quelques unités |

Pas de check-in signifie que le solde ne se recharge jamais : gardez les clés, attendez-vous à en recréer.

> 💡 L'offre gratuite est fixée par 7k7kapi et peut changer. Consultez les chiffres en direct sur [www.7k7kapi.xyz](https://www.7k7kapi.xyz) — et laissez la barrière de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 1 au complet

`GET /v1/models` avec une clé fraîche renvoie **1** identifiant de modèle — mesuré `models_count: 1` sur la clé de chaque compte enregistré dans `accounts.json` ; l'identifiant que cette voie crée et contrôle est `deepseek-v4.1-flash` (`providers/7k7kapi/models.json` est vide, donc le compte provient de cette mesure, pas d'une liste enregistrée).

Ce qu'une clé peut atteindre est décidé par son **groupe**, pas par la clé elle-même :

| ID du modèle | Groupe qui le sert | Statut |
| --- | --- | --- |
| `deepseek-v4.1-flash` | `DeepSeek（oai接口）` | **chat-200** + `tool_calls` répondus, sur chaque clé des deux exécutions |
| `deepseek-v4.1-flash` | `default` | **503** `No available channel for model deepseek-v4.1-flash` |

Le CLI crée le jeton dans `DeepSeek（oai接口）` (`--group`) et ne se rabat sur `--alt-groups` (par défaut `default`) que si la création ou la révélation échoue — un jeton qui atterrit dans le mauvais groupe est intercepté par la barrière, pas livré.

## 🧪 Comment utiliser l'API

URL de base **`https://www.7k7kapi.xyz/v1`** — compatible OpenAI, donc n'importe quel client parlant OpenAI fonctionne.

```bash
curl https://www.7k7kapi.xyz/v1/chat/completions \
  -H "Authorization: Bearer <48-char key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: pong"}],"max_tokens":32}'
```

La clé fait 48 caractères en base62 **sans préfixe** (la console l'affiche nue). La barrière elle-même envoie `tools: [{get_time}]` avec `tool_choice: "auto"` — le relais répond de vrais `tool_calls`, ce qui est la vérification qui rend une clé utilisable pour les clients d'agents et pas seulement pour le chat.

## 🛠 Démarrage rapide

```bash
cd 7k7kapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — with a pool every request leaves from one of these exits
node src/launcher.js                          # interactive: mint / verify / screen / settings

# or straight through the CLI:
node src/cli.js --count 10                    # accounts = keys, each gated before it is kept
node src/cli.js --verify-only                 # re-test every key in keys.txt with a live chat call
```

Rien d'autre que Node 18+ n'est nécessaire : pas de navigateur, pas de solveur de captcha, zéro dépendance. La création du 2026-10-23 a rempli `keys.txt` en ~7 minutes à `--conc 1` (`providers/7k7kapi/out/mint-laneB.log`).

### 🖱️ Le lanceur

`src/launcher.js` (même bannière que ce README) demande la liste de proxys, combien de comptes créer et le modèle utilisé pour la barrière en direct, mémorise les réponses dans `launcher.config.json`, puis exécute le CLI : **mint**, **verify**, **screen** (tester les sorties contre le panneau), **settings**, **help** et **Connect to 9Router**. `src/cli.js` est le CLI de création propre au fournisseur, copié verbatim ; `src/connect-9router.js` enregistre le fournisseur sous le préfixe `7k7kapi` avec `deepseek-v4.1-flash` comme modèle par défaut.

## ✅ Vérifié fonctionnel — chaque clé est testée

| Vérification | Résultat |
| --- | --- |
| `GET /api/status` | **200** — site `7k7kapi`, `reg: true`, `em: true`, `ts: false`, `ci: false` (le check-in est réservé aux payants) |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}` ; l'e-mail avec le code (`7k7kapi邮箱验证邮件`) arrive en quelques secondes |
| `POST /api/user/register` | **200** `{"success":true}` — code à 6 chiffres, vérifié avant que le compte existe |
| `POST /api/token/` dans `DeepSeek（oai接口）` | **200**, clé renvoyée dans la réponse (ce fork la renvoie en clair) |
| `POST /v1/chat/completions` | **200**, deux invites différentes reçoivent des contenus différents |
| tools | **fonctionne** — une requête `get_time` répond `tool_calls` ; une clé dont le canal était momentanément absent a passé le contrôle de chat et a sauté l'appel d'outil au lieu d'être livrée sans preuve |
| `GET /v1/models` | **200**, **1** identifiant |
| Exécution de création du 2026-10-23 | chaque compte s'est inscrit et chaque clé a passé la barrière en direct avant d'être écrite — le journal d'exécution est `out/mint-laneB.log` |

Preuves, toutes sur disque : `providers/7k7kapi/out/mint-laneB.log` (05:59:11 → 06:06:27, groupe `DeepSeek（oai接口）`, outils `get_time`), `providers/7k7kapi/accounts.json` (un enregistrement par clé, `gate: 200`, `quota: 250000`), `providers/7k7kapi/keys.txt`, `providers/7k7kapi/out/mint-laneA.log` (le mode d'échec : code refusé / send-code 429 à `--conc 2`), `providers/7k7kapi/out/mint-2026-10-22.log` (un jeton dans `default` → chat **503**, `models=200` sur la même clé), `providers/7k7kapi/accounts.jsonl` (le premier compte + clé, 2026-10-19).

> **Barrières de qualité.** Chaque clé ici a passé un `chat-200` en direct avant d'être écrite dans `keys.txt`
> (les clés mortes ne sont jamais livrées). Les combinaisons de routeur suivent la même règle au niveau du modèle : une entrée n'est
> ajoutée **que si le modèle répond `chat-200` et peut appeler des outils** — un modèle sans support des outils,
> une clé morte ou un fournisseur mort est écarté au lieu d'être ajouté. Relancez l'étape de vérification à tout moment ;
> les échecs sont signalés, jamais cachés.

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 7k7kapi page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.7k7kapi.xyz/v1/chat/completions → real content = the key is live
```

Par compte, chaque requête au panneau passe par une sortie épinglée :

| Étape | Appel | Notes |
| --- | --- | --- |
| boîte mail | `temp.tf GET /api/account?providers=outlook,hotmail&dot=0&plus=1` par défaut, ou Emailnator `POST /api/generate-email` (`--mail emailnator`) | un alias plus **privé** hotmail/outlook par compte ; la forme sans point est celle enregistrée |
| statut | `GET /api/status` | contrôle de la barrière avant de dépenser une boîte mail |
| envoi du code | `GET /api/verification?email=…` | le panneau envoie un code à 6 chiffres, valable 10 minutes |
| code | `POST /api/check` (temp.tf) / `POST /api/message-list` → `POST /api/message/<id>` (Emailnator) | interroge toutes les 5 s ; le code est lu uniquement depuis le message du panneau lui-même (ancré sur `验证码`) |
| inscription | `POST /api/user/register` `{username,password,email,verification_code}` | un code échoué doit être redemandé, pas réutilisé |
| connexion | `POST /api/user/login` | `access_token`, puis `New-Api-User: <id>` pour la route du jeton |
| clé | `POST /api/token/` avec `group: DeepSeek（oai接口）`, `unlimited_quota: true` | la réponse porte déjà la clé en clair ; `POST /api/token/<id>/key` et la liste des jetons sont les solutions de repli |
| barrière | `POST /v1/chat/completions` | deux invites différentes (les deux 200, non vides, **différentes**) et un appel d'outil `get_time` avec `tool_calls` dans la réponse |

Une clé est ajoutée à `keys.txt` **après** la barrière ; une clé qui ne passe jamais est écrite dans `accounts.json` avec son erreur et retentée à l'exécution suivante.

## ⚙️ Options du CLI

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

| Option | Défaut | Signification |
| --- | --- | --- |
| `--count N` | `5` | comptes à créer |
| `--conc N` | `1` | comptes en cours (max 8) |
| `--gap MS` | `1200` | pause entre les comptes |
| `--mail <rail>` | `temptf` | `temptf` (alias plus hotmail/outlook privé) ou `emailnator` (`@gmail.com` frais) |
| `--model <id>` | `deepseek-v4.1-flash` | modèle utilisé pour la barrière en direct |
| `--group <name>` | `DeepSeek（oai接口）` | groupe dans lequel la clé est créée |
| `--alt-groups G` | `default` | groupes de repli |
| `--pool <file>` | `proxies.txt` | liste de proxys, une sortie par ligne |
| `--exits N` | `6` | sorties essayées par compte avant d'abandonner |
| `--timeout MS` | `60000` | délai par requête |
| `--checkin` | désactivé | exécute aussi le check-in quotidien (verrouillé ici sans recharge) |
| `--verify-only` | désactivé | reteste chaque clé dans `keys.txt` |
| `--screen` | désactivé | teste les sorties contre 7k7kapi uniquement |

| Env | Défaut | Signification |
| --- | --- | --- |
| `7K7KAPI_PROXIES` | — | pool de sorties, une par ligne (identique à `--pool`) |
| `7K7KAPI_BASE` | `https://www.7k7kapi.xyz` | URL de base du panneau |

## 🛰️ Derrière un proxy

**Facultatif — mais le panneau est pointilleux, donc un pool vaut la peine.** Chaque requête d'un compte passe par **une sortie épinglée** : envoi du code, inscription, connexion, création de clé et barrière partent tous de la même adresse, car le panneau lie le code en attente à l'adresse demandeuse et un code demandé depuis une sortie est refusé quand une autre s'inscrit (`Verification code is incorrect or has expired`).

- Avec un pool : `--pool proxies.txt` (ou `7K7KAPI_PROXIES`) ; une sortie morte échoue vite et l'essai suivant prend la sortie suivante (`--exits`, défaut 6).
- Sans pool, le CLI affiche `running WITHOUT a proxy (direct)` et fonctionne pareil.
- **La limite de débit est par adresse :** deux comptes en cours atteignent déjà `sendCode HTTP 429 {"message":"发送过于频繁，请等待 23 秒后再试"}` (`out/mint-laneA.log`). `--conc 1` avec le `--gap 1200` intégré a terminé 10/10 ; `--conc 2` a perdu chaque code.
- Gardez le pool frais : les sorties candidates publiques meurent en quelques minutes — `--screen` vous dit lesquelles atteignent encore le panneau.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | dix clés vérifiées en direct, une par ligne — ignoré par git |
| `accounts.json` | un enregistrement JSON par compte : nom d'utilisateur, e-mail, uid, quota, groupe, résultat de la barrière, clé masquée — ignoré par git |
| `accounts.jsonl` | l'enregistrement du compte du 2026-10-19 avec sa clé — ignoré par git |
| `models.json` | vide sur disque (le nombre de modèles dans ce README provient des mesures de création, pas d'une liste enregistrée) |
| `out/mint-laneB.log` | l'exécution 10/10, 2026-10-23 |
| `out/mint-laneA.log` | l'exécution `--conc 2` : code refusé, send-code 429 |
| `out/mint-2026-10-22.log` | la trace HTTP par compte d'une exécution antérieure |
| `public-cli.js` | le `src/cli.js` de ce dépôt — mint / verify / screen (stdlib node uniquement) |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé, compatible OpenAI :

```bash
node src/connect-9router.js --api-key <48-char key>
```

Défauts : `--9router-prefix 7k7kapi`, `--9router-name 7k7kapi`, URL de base `https://www.7k7kapi.xyz/v1`, modèle par défaut `deepseek-v4.1-flash` ; les modèles sont servis comme `7k7kapi/deepseek-v4.1-flash`. Le lancement est déjà prouvé sur un routeur en direct (2026-10-19) : nœud `7k7kapi` avec connexion `default`, actif, entrée de catalogue `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔌 Connexion à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé, compatible OpenAI :

```bash
node src/connect-omniroute.js --api-key <48-char key>
```

Défauts : `--omniroute-prefix 7k7kapi`, `--omniroute-name 7k7kapi`, URL de base `https://www.7k7kapi.xyz/v1`, modèle par défaut `deepseek-v4.1-flash` ; les modèles sont servis comme `7k7kapi/deepseek-v4.1-flash`. Le lancement est déjà prouvé sur un routeur en direct (2026-10-19) : nœud `7k7kapi` avec connexion `default`, actif, entrée de catalogue `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔑 Ce qu'une clé vous donne

| | |
| --- | --- |
| 🏢 Fournisseur | **7k7kapi** (`www.7k7kapi.xyz`) — [www.7k7kapi.xyz](https://www.7k7kapi.xyz) |
| 🎁 Ce que le fournisseur donne | 250 000 unités de quota (≈ 0,50 $ à `quota_per_unit: 500000`) sur un compte frais vérifié par e-mail, sans carte |
| 🔑 Ce qu'une clé vous donne | une clé de 48 caractères sur son propre compte, créée dans le groupe `DeepSeek（oai接口）`, vérifiée pour le chat et les outils |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://www.7k7kapi.xyz/v1/chat/completions` — **1** identifiant de modèle sur `/v1/models` |
| 🔒 Vos données | seuls `www.7k7kapi.xyz`, la voie de boîte mail que vous choisissez (temp.tf ou Emailnator) et votre propre proxy sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

* **Le groupe est tout l'enjeu.** Un jeton créé dans `default` semble correct puis répond `503 No available channel for model deepseek-v4.1-flash` — et surtout `/v1/models` répond encore **200** sur cette clé, donc une « vérification des modèles » naïve passe et seul l'appel de chat dit la vérité. C'est exactement pourquoi la barrière ici est une complétion, pas une liste (`out/mint-2026-10-22.log`).
* **L'envoi du code est limité en débit par adresse :** `发送过于频繁，请等待 N 秒后再试` (429) avec N entre 15 et 30. Deux comptes en cours s'affament mutuellement ; les créations à `--conc 1` sont la configuration de travail mesurée.
* **Un code est lié à l'adresse demandeuse.** Inscrivez-vous depuis une sortie différente de celle qui a demandé le code et le panneau répond `Verification code is incorrect or has expired` (HTTP 200, `success: false`) — `--exits` relance tout le compte depuis une nouvelle boîte mail au lieu de réutiliser le code.
* **Les domaines jetables sont refusés.** `POST /api/verification` sur un domaine jetable → **403** `注册仅支持主流常用邮箱（QQ、网易、Gmail、Outlook 等）及高校教育邮箱`. Les deux voies livrées par le CLI (alias plus Microsoft temp.tf, gmail Emailnator) sont toutes deux acceptées ; une boîte partagée peut aussi renvoyer le courrier d'un autre locataire, c'est pourquoi le code est lu uniquement depuis le message du panneau lui-même.
* **Le check-in est derrière un paywall** (累计充值满 10 元即可解锁每日签到) — il n'y a pas de recharge quotidienne gratuite ici.

Si 7k7kapi change la forme de son inscription, le texte de ses e-mails ou la table des groupes, l'outil s'arrête à cette étape et affiche le refus verbatim. **[Ouvrez un ticket](../../issues)** avec la commande et la sortie exacte.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 7k7kapi-bulk-apikey contributors

</div>