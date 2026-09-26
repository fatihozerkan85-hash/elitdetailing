# Resend kurulumu (Elit Detailing)

Kod tarafı hazır: `POST /api/email` → Resend. Anahtar yoksa `mode: "mock"`.

## 1) Resend hesabı

1. https://resend.com/signup
2. https://resend.com/api-keys → **Create API Key** → kopyala (`re_…`)

## 2) Vercel değişkenleri

Proje: **elitdetailing** → Settings → Environment Variables

| Key | Value (örnek) | Ortam |
|-----|----------------|--------|
| `RESEND_API_KEY` | `re_…` | Production, Preview |
| `EMAIL_FROM` | `Elit Detailing <onboarding@resend.dev>` | Production, Preview |

Save → **Deployments → … → Redeploy** (env deploy sonrası işler).

## 3) Hızlı test

1. Canlı site açıldıktan sonra `/yonetici` → **Sistem**
2. E-posta kartı `resend` görünmeli
3. **Test e-postası gönder** → Resend hesabınızdaki adrese

Test döneminde Resend yalnızca hesabınıza kayıtlı adrese gönderir.

## 4) Kendi domain (elitdetailing.com)

1. https://resend.com/domains → Add `elitdetailing.com`
2. Verilen DNS (SPF / DKIM) kayıtlarını domain sağlayıcınıza ekleyin
3. Verify olunca Vercel’de:

```
EMAIL_FROM=Elit Detailing <noreply@elitdetailing.com>
```

Redeploy.

## Yerel geliştirme

```bash
cp .env.example .env.local
# RESEND_API_KEY ve EMAIL_FROM doldurun
npm run dev
```

`.env.local` commit edilmez.
