# Elit Detailing

Ankara detailing / yıkama / lastik / yol yardım için **responsive kurumsal site + self-servis + işletme paneli**.

## Çalıştırma

```bash
npm install
npm run dev
```

Adres: `http://127.0.0.1:43147`

Canlı: [https://elitdetailing.vercel.app](https://elitdetailing.vercel.app)

## Demo

| Rol | Giriş |
|-----|--------|
| Müşteri | `/giris` · telefon `05551234567` |
| Yönetici | `/yonetici` veya `/yönetici` · PIN **`2580`** |

Veri: `localStorage` anahtarı `elit-detailing-v1`.

## Sayfalar

Müşteri: `/` `/hizmetler` `/randevu` `/yol-yardim` `/takip` `/aksesuar` `/kampanyalar` `/kuponlar` `/bildirimler` `/taleplerim` `/sss` `/profil`

Yönetici: `/yonetici` işler, randevular, yol-yardım, müşteriler, personel, stok, kampanyalar, kuponlar, gelir, bildirimler. Kamu sitede link yok.

Mobilde alt menü: Ana, Hizmetler, Randevu, Takip, Profil.

Next.js + TypeScript + Tailwind v4 + shadcn/ui. Auth/DB yok.
