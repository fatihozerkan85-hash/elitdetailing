# Elit Otomotiv — self-servis & operasyon

Ankara odaklı premium oto merkezi için **müşteri self-servis sitesi** ve **işletme panosu**. WhatsApp/telefon karmaşasını randevu, yol yardım, iş takibi ve otomatik “Taleplerim” kutusu ile azaltır; sahip her işi, ödemeyi, aksesuar talebini ve personel yükünü görür.

Marka adı Instagram [elit_otomotiv](https://www.instagram.com/elit_otomotiv/) ile uyumludur. Adres/fiyatlar **demo**dır; yasal iddia yoktur.

## Çalıştırma / Run

```bash
npm install
npm run dev
```

Dev server: `http://0.0.0.0:43147` (host 0.0.0.0, port **43147**).

```bash
npm run build && npm start
```

## Demo hesaplar

| Rol | Nasıl |
|-----|--------|
| Müşteri | `/giris` → telefon `05551234567` (veya herhangi bir numara) |
| İşletme sahibi | `/giris` → PIN **`2580`** |

Veri `localStorage` anahtarı `elit-otomotiv-v1`. Panodan “Demo veriyi sıfırla”.

## Rotalar

**Müşteri**

- `/` landing
- `/hizmetler` tüm hizmetler (süre, fiyat, temsilcisiz adımlar)
- `/randevu` randevu
- `/yol-yardim` acil yol yardım
- `/takip` ve `/takip/[id]` iş / çağrı takibi
- `/aksesuar` katalog + talep
- `/taleplerim` otomatik durum kutusu
- `/sss` self-help
- `/taslak` tel kafes / tasarım destesi (`/tasarim` buraya yönlenir)
- `/giris`

**Panel** (PIN gerekir)

- `/panel` bugünün panosu
- `/panel/isler` ve `/panel/isler/[id]` (durum: kuyrukta → yıkamada → kurulama → teslim)
- `/panel/musteriler`
- `/panel/personel`
- `/panel/gelir`
- `/panel/bildirimler`

## Stack

Next.js (App Router) + TypeScript + Tailwind v4 + shadcn/ui. Auth/DB yok.

## English run notes

`npm install && npm run dev` → bind **0.0.0.0:43147**. Owner PIN `2580`. Customer demo phone `05551234567`. UI copy is Turkish.
