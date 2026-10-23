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

**API anahtarlarıyla toplu 7k7kapi hesabı oluşturun — OpenAI uyumlu çıkarım, hesap başına bir anahtar + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-1%20served-412991?style=for-the-badge)](https://www.7k7kapi.xyz/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-1-of-them) · [🧪 API'yi kullanın](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

7k7kapi (`www.7k7kapi.xyz`), e-posta + parola ile kayıt yapan bir **New API** çatalıdır: kayıt captcha'sı **kapalı** (`GET /api/status` içinde `ts: false`), e-posta doğrulaması **açık** (`em: true`) ve stok bir çataldan farklı olan bir şey var — `default` grubunda bırakılan bir token şu yanıtı alır

```
503 No available channel for model deepseek-v4.1-flash
```

Anahtarın, kanalları modeli gerçekten sunan grup içinde oluşturulması gerekir (`DeepSeek（oai接口）`, 2026-10-19'da ve yine 2026-10-23 çalışmasının on hesabının tamamında ölçüldü) ve `--group` varsayılan olarak buna ayarlıdır.

Bu nedenle kayıt tamamen HTTP'dir — tarayıcı yok, captcha çözücü yok: bir posta kutusu alın, `GET /api/verification?email=…`, gelen kutusundan 6 haneli kodu okuyun, kaydolun, giriş yapın, token'ı **doğru grupta** oluşturun (`unlimited_quota: true` — bakiye anahtarda değil hesapta durur, bu yüzden 0 ile sınırlanan bir token `Invalid token` yanıtı alır), ardından anahtarı iki farklı tamamlama ve bir `get_time` araç çağrısıyla kanıtlayın. Yalnızca 8. adımı geçen bir anahtar `keys.txt` dosyasına yazılır.

## 🎁 Ücretsiz katman — ne kadar alırsınız

| Ne | Değer |
| --- | --- |
| Kayıt kredisi | **250.000 kota birimi** — 2026-10-23 çalışmasının on hesabının tamamında `quota: 250000` olarak okundu (`accounts.json`); 2026-10-19'da oluşturulan hesap sohbet çağrısından sonra **249.494** tutuyordu (`accounts.jsonl`) |
| Birim fiyatı | `quota_per_unit: 500000`, yani kayıt ödeneği ≈ **$0.50** (`description.txt`) |
| Günlük giriş | **kilitli** — `GET /api/status` içinde `checkin: false`; panel 累计充值满 10 元即可解锁每日签到 diyor (günlük girişi açmak için ≥ ¥10 yükleme yapın) |
| Kart / telefon | hiçbiri — tek kapı e-posta kodu |
| Faturalama birimi | **hesap başına**: bakiye hesapta durur, bu yüzden tükenen bir anahtarın yerine yeni bir hesap oluşturulur — `--count N` gerçekten "N ücretsiz hesap" anlamına gelir |
| Kapının maliyeti | `deepseek-v4.1-flash`, `DeepSeek（oai接口）` grubunda **1** oranında sunulur (qt 0), bu yüzden bir anahtarı doğrulamak birkaç birime mal olur |

Giriş olmadığı için bakiye asla yenilenmez: anahtarları saklayın, yeniden oluşturmayı bekleyin.

> 💡 Ücretsiz katman 7k7kapi tarafından belirlenir ve değişebilir. Güncel sayıları [www.7k7kapi.xyz](https://www.7k7kapi.xyz) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # keys.txt içindeki her anahtar gerçek bir sohbet çağrısıyla yeniden test edilir
```

## 🤖 Modeller — hepsi 1 tane

Taze bir anahtarla `GET /v1/models` **1** model kimliği yanıtlar — `accounts.json` içinde kayıtlı her hesabın anahtarında `models_count: 1` ölçüldü; bu hattın oluşturduğu ve kapı olarak kullandığı kimlik `deepseek-v4.1-flash`'tır (`providers/7k7kapi/models.json` boştur, bu yüzden sayı kaydedilmiş bir listeden değil, bu ölçümden gelir).

Bir anahtarın neye erişebileceğine anahtarın kendisi değil, **grubu** karar verir:

| Model Kimliği | Sunan grup | Durum |
| --- | --- | --- |
| `deepseek-v4.1-flash` | `DeepSeek（oai接口）` | **chat-200** + `tool_calls` yanıtlandı, her iki çalışmanın her anahtarında |
| `deepseek-v4.1-flash` | `default` | **503** `No available channel for model deepseek-v4.1-flash` |

CLI, token'ı `DeepSeek（oai接口）` içinde oluşturur (`--group`) ve yalnızca oluşturma veya açığa çıkarma başarısız olursa `--alt-groups` (varsayılan `default`) değerine geri döner — yanlış gruba düşen bir token kapı tarafından yakalanır, gönderilmez.

## 🧪 API'yi nasıl kullanırım

Temel URL **`https://www.7k7kapi.xyz/v1`** — OpenAI uyumlu, yani OpenAI konuşan her istemci çalışır.

```bash
curl https://www.7k7kapi.xyz/v1/chat/completions \
  -H "Authorization: Bearer <48-char key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: pong"}],"max_tokens":32}'
```

Anahtar, **öneksiz** 48 karakterlik base62'dir (konsol onu çıplak gösterir). Kapının kendisi `tool_choice: "auto"` ile `tools: [{get_time}]` gönderir — aktarıcı gerçek `tool_calls` yanıtlar, bu da bir anahtarı yalnızca sohbet için değil, ajan istemcileri için de kullanılabilir kılan kontroldür.

## 🛠 Hızlı başlangıç

```bash
cd 7k7kapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # isteğe bağlı — bir havuzla her istek bu çıkışlardan birinden ayrılır
node src/launcher.js                          # etkileşimli: oluştur / doğrula / tara / ayarlar

# veya doğrudan CLI üzerinden:
node src/cli.js --count 10                    # hesap = anahtar, her biri saklanmadan önce kapıdan geçirilir
node src/cli.js --verify-only                 # keys.txt içindeki her anahtarı canlı bir sohbet çağrısıyla yeniden test et
```

Node 18+ dışında hiçbir şeye gerek yok: tarayıcı yok, captcha çözücü yok, sıfır bağımlılık. 2026-10-23 oluşturma işlemi, `--conc 1` ile `keys.txt` dosyasını ~7 dakikada doldurdu (`providers/7k7kapi/out/mint-laneB.log`).

### 🖱️ Başlatıcı

`src/launcher.js` (bu README ile aynı banner), proxy listesini, kaç hesap oluşturulacağını ve canlı kapı için kullanılan modeli sorar, yanıtları `launcher.config.json` içinde hatırlar ve ardından CLI'yi çalıştırır: **oluştur**, **doğrula**, **tara** (çıkışları panele karşı test et), **ayarlar**, **yardım** ve **9Router'a Bağlan**. `src/cli.js`, sağlayıcının kendi oluşturma CLI'sidir, birebir kopyalanmıştır; `src/connect-9router.js`, sağlayıcıyı `7k7kapi` öneki altında `deepseek-v4.1-flash` varsayılan modeliyle kaydeder.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| `GET /api/status` | **200** — site `7k7kapi`, `reg: true`, `em: true`, `ts: false`, `ci: false` (giriş yalnızca ücretli) |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}`; kod postası (`7k7kapi邮箱验证邮件`) saniyeler içinde gelir |
| `POST /api/user/register` | **200** `{"success":true}` — 6 haneli kod, hesap oluşmadan önce doğrulandı |
| `DeepSeek（oai接口）` içinde `POST /api/token/` | **200**, anahtar yanıtta döndürülür (bu çatal onu düz metin olarak döndürür) |
| `POST /v1/chat/completions` | **200**, iki farklı istem farklı içerikle yanıtlandı |
| araçlar | **çalışır** — bir `get_time` isteği `tool_calls` yanıtlar; kanalı anlık olarak uzakta olan bir anahtar sohbet sağlamlık kontrolünü geçti ve kanıtlanmamış göndermek yerine araç çağrısını atladı |
| `GET /v1/models` | **200**, **1** kimlik |
| 2026-10-23 oluşturma çalışması | her hesap kaydoldu ve her anahtar yazılmadan önce canlı kapıyı geçti — çalışma günlüğü `out/mint-laneB.log` |

Kanıtlar, hepsi diskte: `providers/7k7kapi/out/mint-laneB.log` (05:59:11 → 06:06:27, grup `DeepSeek（oai接口）`, araçlar `get_time`), `providers/7k7kapi/accounts.json` (anahtar başına bir kayıt, `gate: 200`, `quota: 250000`), `providers/7k7kapi/keys.txt`, `providers/7k7kapi/out/mint-laneA.log` (başarısızlık modu: kod reddedildi / `--conc 2`'de send-code 429), `providers/7k7kapi/out/mint-2026-10-22.log` (`default` içinde bir token → sohbet **503**, aynı anahtarda `models=200`), `providers/7k7kapi/accounts.jsonl` (ilk hesap + anahtar, 2026-10-19).

> **Kalite kapıları.** Buradaki her anahtar, `keys.txt` dosyasına yazılmadan önce canlı bir `chat-200` geçti
> (ölü anahtarlar asla gönderilmez). Yönlendirici kombinasyonları model düzeyinde aynı kuralı izler: bir giriş
> **yalnızca model `chat-200` yanıtlıyorsa ve araçları çağırabiliyorsa** eklenir — araç desteği olmayan bir model,
> ölü bir anahtar veya ölü bir sağlayıcı eklenmek yerine çıkarılır. Doğrulama adımını istediğiniz zaman yeniden çalıştırın;
> başarısızlıklar bildirilir, asla gizlenmez.

## 🧭 Nasıl çalışır

```
gelen kutusu (hesap başına bir adres)                            hesap başına taze bir adres
   │
   ├─▶ kayıt: 7k7kapi sayfası → e-posta adresi → gelen kutusundan kod / bağlantı
   ├─▶ oturum: hesabın çerezleri veya erişim token'ı elde
   ├─▶ anahtar oluşturma: hesabın anahtar uç noktası → düz metin anahtar bir kez döndürülür (hemen diske yazılır)
   └─▶ canlı kanıt: POST https://www.7k7kapi.xyz/v1/chat/completions → gerçek içerik = anahtar canlı
```

Hesap başına, her panel isteği tek bir sabitlenmiş çıkış üzerinden:

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| posta kutusu | varsayılan olarak `temp.tf GET /api/account?providers=outlook,hotmail&dot=0&plus=1` veya Emailnator `POST /api/generate-email` (`--mail emailnator`) | hesap başına bir **özel** hotmail/outlook plus-takma adı; kaydedilen noktasız biçimdir |
| durum | `GET /api/status` | posta kutusu harcanmadan önce kapı kontrolü |
| kod gönder | `GET /api/verification?email=…` | panel 6 haneli bir kod postalar, 10 dakika geçerli |
| kod | `POST /api/check` (temp.tf) / `POST /api/message-list` → `POST /api/message/<id>` (Emailnator) | her 5 saniyede yoklar; kod yalnızca panelin kendi postasından okunur (`验证码`-çapalı) |
| kayıt | `POST /api/user/register` `{username,password,email,verification_code}` | başarısız bir kod yeniden istenmelidir, yeniden kullanılmamalıdır |
| giriş | `POST /api/user/login` | `access_token`, ardından token rotası için `New-Api-User: <id>` |
| anahtar | `group: DeepSeek（oai接口）`, `unlimited_quota: true` ile `POST /api/token/` | yanıt zaten düz metin anahtarı taşır; `POST /api/token/<id>/key` ve token listesi yedeklerdir |
| kapı | `POST /v1/chat/completions` | iki farklı istem (her ikisi de 200, boş değil, **farklı**) ve yanıtta `tool_calls` içeren bir `get_time` araç çağrısı |

Bir anahtar kapıdan **sonra** `keys.txt` dosyasına eklenir; asla geçemeyen bir anahtar hatasıyla birlikte `accounts.json` dosyasına yazılır ve bir sonraki çalışmada yeniden denenir.

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count 10                        # oluşturulacak hesap (= anahtar) sayısı
node src/cli.js --count 10 --conc 2               # aynı anda işlenen hesap sayısı (maks 8)
node src/cli.js --count 5 --mail emailnator       # e-posta hattı: temptf (varsayılan) | emailnator
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --count 5 --group 'DeepSeek（oai接口）'   # token grubu (varsayılan)
node src/cli.js --count 5 --alt-groups default    # yedek gruplar, virgülle ayrılmış
node src/cli.js --verify-only                     # keys.txt içindeki her anahtarı kapıdan yeniden geçir
node src/cli.js --screen                          # proxy listesini 7k7kapi'ye karşı test et
node src/cli.js --help
```

| Bayrak | Varsayılan | Anlamı |
| --- | --- | --- |
| `--count N` | `5` | oluşturulacak hesap sayısı |
| `--conc N` | `1` | aynı anda işlenen hesap sayısı (maks 8) |
| `--gap MS` | `1200` | hesaplar arası duraklama |
| `--mail <rail>` | `temptf` | `temptf` (özel hotmail/outlook plus-takma adı) veya `emailnator` (taze `@gmail.com`) |
| `--model <id>` | `deepseek-v4.1-flash` | canlı kapı için kullanılan model |
| `--group <name>` | `DeepSeek（oai接口）` | anahtarın oluşturulduğu grup |
| `--alt-groups G` | `default` | yedek gruplar |
| `--pool <file>` | `proxies.txt` | proxy listesi, satır başına bir çıkış |
| `--tries N` | `2` | vazgeçmeden önce hesap başına denenen çıkış sayısı |
| `--timeout MS` | `60000` | istek başına zaman aşımı |
| `--checkin` | kapalı | günlük girişi de çalıştır (burada yükleme olmadan kilitli) |
| `--verify-only` | kapalı | `keys.txt` içindeki her anahtarı yeniden test et |
| `--screen` | kapalı | çıkışları yalnızca 7k7kapi'ye karşı test et |

| Ortam değişkeni | Varsayılan | Anlamı |
| --- | --- | --- |
| `7K7KAPI_PROXIES` | — | çıkış havuzu, satır başına bir tane (`--pool` ile aynı) |
| `7K7KAPI_BASE` | `https://www.7k7kapi.xyz` | panel temel URL'si |

## 🛰️ Proxy arkasında

**İsteğe bağlı — ama panel titizdir, bu yüzden bir havuz buna değer.** Bir hesabın her isteği **tek bir sabitlenmiş çıkış** üzerinden gider: kod gönderme, kayıt, giriş, anahtar oluşturma ve kapı hepsi aynı adresten ayrılır, çünkü panel bekleyen kodu istekte bulunan adrese bağlar ve bir çıkıştan istenen kod, başka bir çıkış kaydolmaya çalıştığında reddedilir (`Verification code is incorrect or has expired`).

- Bir havuzla: `--pool proxies.txt` (veya `7K7KAPI_PROXIES`); ölü bir çıkış hızlı başarısız olur ve sonraki deneme bir sonraki çıkışı alır (`--tries`, varsayılan 2).
- Havuz olmadan CLI `running WITHOUT a proxy (direct)` yazdırır ve aynı şekilde çalışır.
- **Hız sınırı adres başınadır:** aynı anda iki hesap zaten `sendCode HTTP 429 {"message":"发送过于频繁，请等待 23 秒后再试"}` ile karşılaşır (`out/mint-laneA.log`). Yerleşik `--gap 1200` ile `--conc 1` 10/10 tamamladı; `--conc 2` her kodu kaybetti.
- Havuzu taze tutun: genel aday çıkışlar dakikalar içinde ölür — `--screen` hangilerinin hâlâ panele ulaştığını söyler.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | canlı doğrulanmış on anahtar, satır başına bir tane — git tarafından yok sayılır |
| `accounts.json` | hesap başına bir JSON kaydı: kullanıcı adı, e-posta, uid, kota, grup, kapı sonucu, maskelenmiş anahtar — git tarafından yok sayılır |
| `accounts.jsonl` | anahtarıyla birlikte 2026-10-19 hesap kaydı — git tarafından yok sayılır |
| `models.json` | diskte boş (bu README'deki model sayısı kaydedilmiş bir listeden değil, oluşturma ölçümlerinden gelir) |
| `out/mint-laneB.log` | 10/10 çalışması, 2026-10-23 |
| `out/mint-laneA.log` | `--conc 2` çalışması: kod reddedildi, send-code 429 |
| `out/mint-2026-10-22.log` | daha önceki bir çalışmanın hesap başına HTTP izi |
| `public-cli.js` | bu deponun `src/cli.js` dosyası — oluştur / doğrula / tara (yalnızca node stdlib) |

## 🔌 9Router'a bağlan

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
node src/connect-9router.js --api-key <48-char key>
```

Varsayılanlar: `--9router-prefix 7k7kapi`, `--9router-name 7k7kapi`, temel URL `https://www.7k7kapi.xyz/v1`, varsayılan model `deepseek-v4.1-flash`; modeller `7k7kapi/deepseek-v4.1-flash` olarak sunulur. Başlatma zaten canlı bir yönlendiricide kanıtlandı (2026-10-19): `default` bağlantılı `7k7kapi` düğümü, etkin, katalog girişi `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔌 OmniRoute'a bağlan

[OmniRoute](https://omniroute.online) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
node src/connect-omniroute.js --api-key <48-char key>
```

Varsayılanlar: `--omniroute-prefix 7k7kapi`, `--omniroute-name 7k7kapi`, temel URL `https://www.7k7kapi.xyz/v1`, varsayılan model `deepseek-v4.1-flash`; modeller `7k7kapi/deepseek-v4.1-flash` olarak sunulur. Başlatma zaten canlı bir yönlendiricide kanıtlandı (2026-10-19): `default` bağlantılı `7k7kapi` düğümü, etkin, katalog girişi `7k7kapi/deepseek-v4.1-flash` (`description.txt`).

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **7k7kapi** (`www.7k7kapi.xyz`) — [www.7k7kapi.xyz](https://www.7k7kapi.xyz) |
| 🎁 Sağlayıcının verdikleri | taze, e-posta doğrulamalı bir hesapta 250.000 kota birimi (`quota_per_unit: 500000` ile ≈ $0.50), kart yok |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabında 48 karakterlik bir anahtar, `DeepSeek（oai接口）` grubunda oluşturulmuş, sohbet ve araç doğrulamalı |
| 🌐 API biçimi | OpenAI uyumlu: `POST https://www.7k7kapi.xyz/v1/chat/completions` — `/v1/models` üzerinde **1** model kimliği |
| 🔒 Verileriniz | yalnızca `www.7k7kapi.xyz`, seçtiğiniz posta kutusu hattı (temp.tf veya Emailnator) ve kendi proxy'nizle iletişim kurulur; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

* **Grup her şeydir.** `default` içinde oluşturulan bir token iyi görünür ve ardından `503 No available channel for model deepseek-v4.1-flash` yanıtlar — ve daha da önemlisi `/v1/models` o anahtarda hâlâ **200** yanıtlar, bu yüzden naif bir "modeller kontrolü" geçer ve yalnızca sohbet çağrısı gerçeği söyler. Buradaki kapının bir liste değil, bir tamamlama olmasının nedeni tam olarak budur (`out/mint-2026-10-22.log`).
* **Kod gönderme adres başına hız sınırlıdır:** `发送过于频繁，请等待 N 秒后再试` (429), N 15 ile 30 arasında. Aynı anda iki hesap birbirini aç bırakır; `--conc 1` ile oluşturma ölçülen çalışan yapılandırmadır.
* **Bir kod istekte bulunan adrese bağlıdır.** Kodu isteyenden farklı bir çıkıştan kaydolun ve panel `Verification code is incorrect or has expired` yanıtlar (HTTP 200, `success: false`) — `--tries`, kodu yeniden kullanmak yerine tüm hesabı yeni bir posta kutusundan yeniden çalıştırır.
* **Tek kullanımlık alan adları reddedilir.** Tek kullanımlık bir alan adında `POST /api/verification` → **403** `注册仅支持主流常用邮箱（QQ、网易、Gmail、Outlook 等）及高校教育邮箱`. CLI'nin sunduğu iki hat (temp.tf Microsoft plus-takma adları, Emailnator gmail) de kabul edilir; paylaşılan bir gelen kutusu başka bir kiracının postasını da geri verebilir, bu yüzden kod yalnızca panelin kendi mesajından okunur.
* **Giriş bir ödeme duvarının arkasında** (累计充值满 10 元即可解锁每日签到) — burada ücretsiz günlük yenileme yoktur.

7k7kapi kayıt biçimini, posta metnini veya grup tablosunu değiştirirse, araç o adımda durur ve reddi birebir yazdırır. Komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 7k7kapi-bulk-apikey katkıda bulunanlar

</div>