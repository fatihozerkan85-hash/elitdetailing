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
| Müşteri | `/giris` · telefon `05551234567` |
| Yönetici | `/yonetici` · PIN **`2580`** |

Veri: `localStorage` anahtarı `elit-detailing-v3`.

## Sayfalar

Müşteri: `/` `/hizmetler` `/randevu` `/yol-yardim` `/takip` `/aksesuar` `/kampanyalar` `/odeme/*` …

Yönetici: `/yonetici` — işlerde iyzico ödeme linki, gelirde tahsilat listesi.

Next.js + TypeScript + Tailwind v4 + shadcn/ui.
