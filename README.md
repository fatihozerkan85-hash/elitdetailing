# Elit Detailing

Ankara detailing / yıkama / lastik / yol yardım için **responsive kurumsal site + self-servis + işletme paneli**. Ödemeler **yalnızca iyzico** (nakit yok).

## Çalıştırma

```bash
npm install
npm run dev
```

Adres: `http://127.0.0.1:43147`

Canlı: [https://www.elitdetailing.com](https://www.elitdetailing.com) · [https://elitdetailing.vercel.app](https://elitdetailing.vercel.app)

## iyzico

Anahtar yoksa sandbox **mock** ekranı açılır (`/odeme/mock`). Canlı / sandbox için:

```bash
IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com   # prod: https://api.iyzipay.com
```

Akışlar:

| Tür | Davranış |
|-----|----------|
| Sabit fiyatlı randevu | Form → iyzico tam tutar → kayıt |
| Boya koruma / seramik | Keşif randevusu ücretsiz → panelden ödeme linki |
| Kampanya banner | `/odeme/kampanya` → yalnızca iyzico |
| Aksesuar | Sepet → iyzico |
| Yol yardım | Talep anında ödeme yok → panel WhatsApp ödeme linki |

## Demo

| Rol | Giriş |
|-----|--------|
| Müşteri | `/giris` · telefon `05551234567` · şifre **`123456`** |
| Yönetici | `/yonetici` · PIN **`2580`** |

Veri: `localStorage` anahtarı `elit-detailing-v4`.

### Bildirim kanalları

| Kanal | Ne gider |
|-------|----------|
| **E-posta** | Hoş geldin, şifre sıfırlama/değişiklik, hesap güncelleme, randevu/ödeme makbuzu, aksesuar sipariş özeti, kupon/kampanya |
| **WhatsApp** | Check-in, süreç adımı, yol yardım durumu, ödeme linki, aksesuar hazır |
| **Uygulama** | Taleplerim + panel bildirimleri |

SMTP yoksa e-postalar mock’tur (`/api/email`). Canlı için `RESEND_API_KEY` + `EMAIL_FROM`.

Adım adım: [docs/RESEND.md](docs/RESEND.md) · panel: `/yonetici/ayarlar`

## Sizin yapmanız gerekenler (canlı)

Site özellikleri iyzico **hariç** mock/link ile çalışır. Gerçek gönderim ve tahsilat için Vercel → Project → Settings → Environment Variables:

| Ne | Değişkenler | Not |
|----|-------------|-----|
| Gerçek e-posta | `RESEND_API_KEY`, `EMAIL_FROM` | Resend hesabı; doğrulanmış gönderen domain |
| WhatsApp Cloud API (opsiyonel) | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Yoksa panel `wa.me` linki açar — bu da çalışır |
| Gerçek iyzico | `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL` | İstediğinizde; şimdilik mock yeterli |
| Yönetici PIN | Panel → **Sistem** | Demo `2580` yerine kendi PIN’iniz |

**Önemli:** Müşteri/iş verisi şu an tarayıcı `localStorage`’ında. Aynı bilgisayarda demo tam çalışır; farklı telefonlar/panel aynı veriyi paylaşmaz. Ortak canlı veritabanı isterseniz ayrıca söylenmeli.

Durum kontrolü: `/yonetici/ayarlar` veya `GET /api/status`.

## Sayfalar

Müşteri: `/` `/giris` `/profil` `/sifremi-unuttum` `/randevu` `/yol-yardim` `/takip` `/aksesuar` `/kampanyalar` `/odeme/*` …

Yönetici: `/yonetici` — CMS, kuyruklar, kampanya e-postası, Sistem ayarları.

Next.js + TypeScript + Tailwind v4 + shadcn/ui.
