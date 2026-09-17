#!/usr/bin/env python3
"""Elit Otomotiv — taslak + hizmetler + kampanya/kupon PDF."""

from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path("/workspace")
IMG = ROOT / "public" / "taslak"
OUT = ROOT / "docs" / "Elit-Otomotiv-Taslak-Hizmetler.pdf"

pdfmetrics.registerFont(TTFont("Inter", "/usr/share/fonts/truetype/macos/Inter-Regular.ttf"))
pdfmetrics.registerFont(TTFont("InterMed", "/usr/share/fonts/truetype/macos/Inter-Medium.ttf"))
pdfmetrics.registerFont(TTFont("InterSemi", "/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf"))
pdfmetrics.registerFont(TTFont("InterBold", "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"))

BG = HexColor("#0B0C0E")
BG2 = HexColor("#14161A")
GOLD = HexColor("#C9A227")
GOLD2 = HexColor("#E8D48B")
MUTED = HexColor("#9CA3AF")
LINE = HexColor("#2A2D33")
W, H = A4


def wrap(c, text, font, size, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


class Doc:
    def __init__(self):
        OUT.parent.mkdir(parents=True, exist_ok=True)
        self.c = canvas.Canvas(str(OUT), pagesize=A4)
        self.c.setTitle("Elit Otomotiv — Taslak, Hizmetler, Kampanya ve Yönetim")
        self.c.setAuthor("Elit Otomotiv")
        self.page = 0

    def new(self):
        if self.page:
            self.c.showPage()
        self.page += 1
        self.c.setFillColor(BG)
        self.c.rect(0, 0, W, H, fill=1, stroke=0)
        self.c.setFillColor(GOLD)
        self.c.rect(0, H - 8, W, 8, fill=1, stroke=0)
        self.c.setFillColor(MUTED)
        self.c.setFont("Inter", 8)
        self.c.drawString(36, 22, "Elit Otomotiv  ·  gizli taslak  ·  müşteri self-servis + sahip paneli")
        self.c.drawRightString(W - 36, 22, str(self.page))
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.4)
        self.c.line(36, 34, W - 36, 34)

    def h1(self, t, y):
        self.c.setFillColor(GOLD2)
        self.c.setFont("InterBold", 22)
        self.c.drawString(36, y, t)
        return y - 28

    def h2(self, t, y):
        self.c.setFillColor(GOLD)
        self.c.setFont("InterSemi", 12)
        self.c.drawString(36, y, t.upper())
        return y - 18

    def body(self, t, y, size=9.5, max_w=W - 72, leading=13, color=None):
        self.c.setFillColor(color or HexColor("#D4D4D8"))
        self.c.setFont("Inter", size)
        for line in wrap(self.c, t, "Inter", size, max_w):
            if y < 48:
                self.new()
                y = H - 48
                self.c.setFillColor(color or HexColor("#D4D4D8"))
                self.c.setFont("Inter", size)
            self.c.drawString(36, y, line)
            y -= leading
        return y

    def bullets(self, items, y):
        for it in items:
            lines = wrap(self.c, "•  " + it, "Inter", 9, W - 72)
            for i, line in enumerate(lines):
                if y < 48:
                    self.new()
                    y = H - 48
                self.c.setFillColor(GOLD if i == 0 else HexColor("#D4D4D8"))
                self.c.setFont("Inter", 9)
                self.c.drawString(36, y, line)
                y -= 13
            y -= 2
        return y

    def card_table(self, rows, y, col_w=None):
        if col_w is None:
            col_w = [118, 70, 70, W - 72 - 258]
        x0 = 36
        row_h = 16
        header = rows[0]
        self.c.setFillColor(HexColor("#1C1910"))
        self.c.roundRect(x0 - 4, y - 6, W - 64, row_h + 4, 3, fill=1, stroke=0)
        self.c.setFillColor(GOLD)
        self.c.setFont("InterSemi", 8)
        x = x0
        for i, h in enumerate(header):
            self.c.drawString(x, y, h)
            x += col_w[i]
        y -= 18
        self.c.setFont("Inter", 8)
        for row in rows[1:]:
            if y < 52:
                self.new()
                y = H - 48
            self.c.setFillColor(HexColor("#D4D4D8"))
            x = x0
            for i, cell in enumerate(row):
                self.c.drawString(x, y, str(cell)[:40])
                x += col_w[i]
            y -= row_h
        return y - 8

    def screen(self, title, role, path, note, phone=False):
        self.new()
        y = H - 40
        self.c.setFillColor(GOLD)
        self.c.setFont("InterSemi", 8)
        self.c.drawString(36, y, role.upper())
        y = self.h1(title, y - 18)
        y = self.body(note, y, size=9, leading=12)
        y -= 8
        img_path = IMG / path
        if not img_path.exists():
            self.c.setFillColor(Color(1, 0.3, 0.3))
            self.c.drawString(36, y, f"Görsel yok: {path}")
            return
        ir = ImageReader(str(img_path))
        iw, ih = ir.getSize()
        max_w = 280 if phone else W - 72
        max_h = y - 48
        scale = min(max_w / iw, max_h / ih)
        dw, dh = iw * scale, ih * scale
        x = (W - dw) / 2 if not phone else 36
        self.c.drawImage(ir, x, y - dh, width=dw, height=dh, mask="auto")


def build():
    d = Doc()
    c = d.c

    # Cover
    d.new()
    c.setFillColor(GOLD)
    c.setFont("InterSemi", 11)
    c.drawString(36, H - 80, "ELİT OTOMOTİV")
    c.setFillColor(GOLD2)
    c.setFont("InterBold", 28)
    c.drawString(36, H - 118, "Uygulama taslağı")
    c.setFont("InterBold", 18)
    c.setFillColor(white)
    c.drawString(36, H - 144, "Hizmetler · Menüler · Yönetici paneli")
    y = d.body(
        "Oto yıkama, lastik, aksesuar, acil yol yardım ve detailing için müşteri self-servis uygulaması. "
        "Amaç: müşteriye daha düzenli ve hızlı hizmet, insan müşteri temsilcisinin yükünü azaltmak, "
        "işletme sahibinin her detayı tek panelden görmesi. Kampanyalar, indirim kuponları ve bunlara bağlı bildirimler ürünün parçasıdır.",
        H - 180,
        size=11,
        leading=16,
    )
    y = d.h2("Bu belgede", y - 16)
    y = d.bullets(
        [
            "Sunulan hizmetler, süre ve başlangıç fiyatları",
            "Müşteri menülerinin tüm ekran görselleri",
            "Yönetici panelinin tüm sekmeleri",
            "Kampanya / kupon / bildirim modeli",
            "Temsilci işini nasıl kestiği",
        ],
        y,
    )
    d.body("Instagram: @elit_otomotiv  ·  Demo fiyatlar taslak amaçlıdır.", y - 10, size=8, color=MUTED)

    # Amaç
    d.new()
    y = d.h1("Neden bu uygulama", H - 48)
    y = d.body(
        "WhatsApp ve telefon kuyruğu; randevu, fiyat, “aracım bitti mi”, kupon ve yol yardım için aynı temsilciye biner. "
        "Uygulama bu soruları forma, duruma ve otomatik mesaja çevirir. Sahip ise günün panosundan iş, ekip, stok, ciro, kampanya kullanımını görür.",
        y,
    )
    y = d.h2("Üç kullanıcı", y - 10)
    y = d.bullets(
        [
            "Müşteri: randevu, yol yardım, takip, aksesuar, kupon, kampanya — aramadan.",
            "Operasyon: iş kartını kuyrukta → yıkamada → kurulama → teslim ilerletir.",
            "Sahip: tüm sekmeler, gelir, stok, personel yükü, kampanya performansı, kupon tüketimi.",
        ],
        y,
    )
    y = d.h2("Kampanya, kupon, bildirim", y - 6)
    y = d.bullets(
        [
            "Sahip kampanya açar (tarih, hedef kitle, indirim). Sistem müşteriye push + Taleplerim kaydı yollar.",
            "Kupon kodu (yüzde, tutar, hizmete özel) cüzdana düşer; randevu/ödeme adımında uygulanır.",
            "Kupon bitmeden 72 / 24 saat kala otomatik hatırlatma. Kullanım veya iptal de bildirilir.",
            "Müşteri profilinden kampanya ve kupon bildirimlerini ayrı ayrı açıp kapatır (KVKK).",
            "Panel Bildirimler sekmesi: kitle seç, kampanyaya kupon bağla, gönder, otomatik kuralları yönet.",
        ],
        y,
    )

    # Hizmetler
    d.new()
    y = d.h1("Uygulamanın sunduğu hizmetler", H - 48)
    y = d.body("Listelenen tutarlar başlangıç fiyatıdır; ağır kir, ebat, mesafe iş kartında güncellenir.", y, size=8, color=MUTED)
    y -= 6
    rows = [
        ["Hizmet", "Süre", "Baş. fiyat", "Self-servis"],
        ["Dış yıkama", "20 dk", "350 TL", "Slot + plaka + takip"],
        ["İç + dış yıkama", "45 dk", "650 TL", "Not + teknisyen takibi"],
        ["Motor bölmesi", "30 dk", "550 TL", "Randevulu gün"],
        ["İç detailing", "2–3 sa", "2.200 TL", "Bırakış saati kilidi"],
        ["Dış detailing + pasta", "½ gün", "3.800 TL", "Hasar notu + teslim"],
        ["Boya koruma / seramik", "1 gün+", "8.500 TL", "Keşif teklifi kutuya"],
        ["Far restorasyon", "45 dk", "900 TL", "Aynı gün slot"],
        ["Koltuk & döşeme", "90 dk", "1.600 TL", "Leke türü formda"],
        ["Lastik değişimi", "40 dk", "400 TL", "Ebat notu"],
        ["Rot balans", "50 dk", "750 TL", "Belirti notu"],
        ["Lastik yama", "25 dk", "250 TL", "Walk-in veya yol yardım"],
        ["Akü takviye", "30–45 dk", "650 TL", "Konum + canlı ekip"],
        ["Yolda lastik", "40 dk", "750 TL", "Stepne kutusu"],
        ["Çekici / kurtarma", "konum", "1.400 TL", "Baş-bitiş + onay"],
        ["Yakıt bitmesi", "35 dk", "550 TL", "Yakıt tipi"],
        ["Klima / ozon", "40 dk", "700 TL", "Yıkamaya ek hizmet"],
    ]
    y = d.card_table(rows, y)

    d.new()
    y = d.h1("Aksesuar, kampanya, kupon", H - 48)
    y = d.h2("Aksesuar (örnek stok)", y)
    y = d.card_table(
        [
            ["Ürün", "Kategori", "Fiyat", "Not"],
            ["4D havuzlu paspas", "İç", "1.850 TL", "Randevu günü montaj"],
            ["Ön-arka kamera", "Elektronik", "4.200 TL", "Montaj randevulu"],
            ["Torpido örtüsü", "İç", "650 TL", "Renk notta"],
            ["Jant kapağı 15–17”", "Dış", "890 TL", "Aynı gün"],
            ["Premium silecek", "Bakım", "480 TL", "Yıkamada takılır"],
            ["Lastik bakım kiti", "Bakım", "320 TL", "Kasa teslim"],
            ["Bagaj organizer", "İç", "540 TL", "Kaymaz taban"],
            ["LED aydınlatma", "Elektronik", "1.100 TL", "Montaj 30 dk"],
        ],
        y,
        col_w=[150, 80, 80, W - 72 - 310],
    )
    y = d.h2("Örnek kampanyalar", y - 4)
    y = d.card_table(
        [
            ["Kampanya", "Kupon", "Kural", "Bildirim"],
            ["Eylül seramik haftası", "ELIT20", "%20 seramik", "Yayında push"],
            ["2 al 1 öde yıkama", "YIKA21", "2. araç ücretsiz", "Filo + bireysel"],
            ["Lastikte balans hediye", "LASTIK0", "Değişimde balans 0", "Lastik randevusuna"],
            ["Doğum günü detailing", "DOGUM15", "%15 iç detailing", "7 gün kala otomatik"],
            ["Kupon bitiş", "—", "72s / 24s kala", "Cüzdan hatırlatma"],
        ],
        y,
        col_w=[130, 70, 130, W - 72 - 330],
    )
    y = d.h2("Temsilci yerine otomatik cevap", y - 2)
    y = d.bullets(
        [
            "Fiyat / süre: hizmet kartı + SSS.",
            "Randevu: takvim; onay Taleplerim’e düşer.",
            "“Bitti mi?”: iş takibi yüzdesi ve durum.",
            "Kampanya var mı?: Kampanyalar + push.",
            "Kuponum geçti mi?: Kuponlarım + bitiş bildirimi.",
        ],
        y,
    )

    # Customer screens
    customer = [
        ("Ana sayfa", "Müşteri menü · Ana", "musteri-ana.png", "Araç kartı, hızlı hizmetler (yıkama, lastik, aksesuar, yol yardım, detailing, randevu) ve aktif iş yüzdesi. Alt menü: Ana, Hizmetler, Randevu, Takip, Profil.", True),
        ("Hizmetler", "Müşteri menü · Hizmetler", "musteri-hizmetler.png", "Kategori katalogu: yıkama, lastik, aksesuar, yol yardım, detailing. Süre ve başlangıç fiyatı kartta; temsilciye sormadan seçilir.", True),
        ("Randevu", "Müşteri menü · Randevu", "musteri-randevu.png", "Tarih/saat, plaka, hizmet, not. Kupon alanı randevu onayında kod uygular.", True),
        ("Acil yol yardım", "Müşteri menü · Yol yardım", "musteri-yol-yardim.png", "Konum, sorun tipi, aciliyet. Ekip durumu canlı; çağrı merkezi şart değil.", True),
        ("İş takibi", "Müşteri menü · Takip", "musteri-is-takip.png", "Kuyrukta → işlemde → teslim. “Aracım bitti mi?” sorusunu kapatır.", True),
        ("Aksesuar", "Müşteri menü · Aksesuar", "musteri-aksesuar.png", "Stoklu ürün ızgarası, talep/sipariş. Montaj randevuya bağlanır.", True),
        ("Taleplerim", "Müşteri menü · Taleplerim", "musteri-taleplerim.png", "Otomatik durum kutusu: randevu onayı, ekip yolda, kupon tanımlandı. İnsan sohbeti varsayılan değil.", True),
        ("Kampanyalar", "Müşteri menü · Kampanyalar", "musteri-kampanyalar.png", "Aktif kampanyalar, süre, Kuponu al. Push bildirimi bu ekrandaki tekliflerle aynı kaynaktan gelir.", True),
        ("Kuponlarım", "Müşteri menü · Kuponlar", "musteri-kuponlar.png", "Aktif / kullanıldı / süresi doldu. Kod kopyala, randevuda kullan. Bitiş bildirimi buradaki kayıttan üretilir.", True),
        ("Bildirimler", "Müşteri menü · Bildirimler", "musteri-bildirimler.png", "Kampanya push, kupon hatırlatma, iş ve yol yardım. Kampanya ve kupon kanalları ayrı anahtar.", True),
        ("SSS", "Müşteri menü · SSS", "musteri-sss.png", "Fiyat, walk-in, ödeme, yol yardım süresi, kupon kullanımı. Temsilci SSS’yi ezberlemek zorunda kalmaz.", True),
        ("Profil", "Müşteri menü · Profil", "musteri-profil.png", "Araç, iletişim, kupon cüzdanı, kampanya/kupon bildirim anahtarları.", True),
    ]
    for item in customer:
        d.screen(*item)

    # Admin screens
    admin = [
        ("Günün panosu", "Yönetici · Pano", "isletme-gunun-panosu.png", "Aktif iş, bekleyen randevu, açık yol yardım, gün ciro. Atölye bayları, yol yardım haritası, sıra. Sahibin sabah ilk ekranı.", False),
        ("İşler", "Yönetici · İşler", "panel-isler.png", "Kanban: kuyrukta, yıkamada, kurulama, teslim. Kartta plaka, hizmet, teknisyen, tutar, uygulanan kupon.", False),
        ("Randevular", "Yönetici · Randevular", "panel-randevular.png", "Takvim + tablo. Onay tek dokunuş; müşteri Taleplerim’de görür — telefon gerekmez.", False),
        ("Yol yardım", "Yönetici · Yol yardım", "panel-yol-yardim.png", "Canlı birimler, açık çağrılar, aciliyet, ETA. Kritik çağrı panoda rozetlenir.", False),
        ("Müşteriler", "Yönetici · Müşteriler", "panel-musteriler.png", "CRM: plaka, ziyaret, ciro, aktif kuponlar. Kampanya hedef kitlesi buradan seçilir.", False),
        ("Personel", "Yönetici · Personel", "panel-personel.png", "Vardiya ve yük. Atama iş kartından; temsilci “kime gideyim” diye dolaşmaz.", False),
        ("Stok", "Yönetici · Stok", "panel-stok.png", "Lastik ebatı, aksesuar, kimyasal. Minimum altı uyarı. Kampanya stok düşüşünü hesaba katar.", False),
        ("Kampanyalar", "Yönetici · Kampanyalar", "panel-kampanyalar.png", "Yeni kampanya: kitle, tarih, indirim, kupon bağla, yayında bildir. Kullanım / limit.", False),
        ("Kuponlar", "Yönetici · Kuponlar", "panel-kuponlar.png", "Kod, tür, min sepet, son tarih, kullanım 34/200, kitle gönder, durdur.", False),
        ("Gelir", "Yönetici · Gelir", "panel-gelir.png", "Gün/hafta ciro kırılımı. Kupon iskontosu ayrı satır — kampanyanın gerçek maliyeti görünür.", False),
        ("Bildirimler", "Yönetici · Bildirimler", "panel-bildirimler.png", "Kampanya push, kupon hatırlatma kuralları (72s/24s), teslim mesajı, kitle gönderimi. Gelen olaylar.", False),
    ]
    for item in admin:
        d.screen(*item)

    # Flows
    d.new()
    y = d.h1("Akışlar (kısa)", H - 48)
    y = d.h2("Randevu + kupon", y)
    y = d.body("Hizmet seç → slot → kupon uygula → onay kutusu + (varsa) kampanya bildirimi sessiz kalır çünkü işlem tamam.", y)
    y = d.h2("Yol yardım", y - 6)
    y = d.body("Form → alındı → ekip yönlendirildi → yolda → yerinde → tamamlandı. Her adım push + Taleplerim.", y)
    y = d.h2("Kampanya yayını", y - 6)
    y = d.body("Sahip kampanya kaydı → kupon üret → kitle (tüm / lastik müşterisi / filo) → Bildirimler’den gönder → müşteri Kampanyalar + Kuponlarım + Bildirimler.", y)
    y = d.h2("Sahip kontrol listesi", y - 6)
    y = d.bullets(
        [
            "Pano: iş, yol yardım, ciro.",
            "İşler / randevu / yol yardım: operasyon.",
            "Müşteri / personel / stok: kaynak.",
            "Kampanya / kupon / bildirim: pazarlama otomasyonu.",
            "Gelir: iskonto düşülmüş gerçek ciro.",
        ],
        y,
    )

    d.new()
    y = d.h1("Demo notu", H - 48)
    y = d.body(
        "Bu PDF ürün taslağıdır. Adres ve fiyatlar örnektir. Canlıya alınca KVKK aydınlatması, gerçek stok ve ödeme altyapısı gerekir. "
        "Müşteri uygulaması ve sahip paneli aynı marka dilini (siyah metal, gold) kullanır.",
        y,
    )
    y = d.bullets(
        [
            "Müşteri menü: Ana, Hizmetler, Randevu, Yol yardım, Takip, Aksesuar, Taleplerim, Kampanyalar, Kuponlarım, Bildirimler, SSS, Profil.",
            "Yönetici sekmeleri: Pano, İşler, Randevular, Yol yardım, Müşteriler, Personel, Stok, Kampanyalar, Kuponlar, Gelir, Bildirimler.",
            "Görseller taslak amaçlıdır; üretim arayüzü piksel birebir olmak zorunda değildir.",
        ],
        y,
    )

    c.save()
    print(OUT, OUT.stat().st_size)


if __name__ == "__main__":
    build()
