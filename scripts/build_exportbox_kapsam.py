#!/usr/bin/env python3
"""ExportBox antetli kâğıt — Elit Otomotiv kapsam belgesi (teklif / fiyat yok)."""

from pathlib import Path

from reportlab.lib.colors import Color, HexColor, black, white
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path("/workspace")
LOGO = ROOT / "docs/branding/exportbox-logo.jpg"
TASLAK = ROOT / "public/taslak"
OUT = ROOT / "docs/ExportBox_ElitOtomotiv_Kapsam.pdf"

pdfmetrics.registerFont(TTFont("Inter", "/usr/share/fonts/truetype/macos/Inter-Regular.ttf"))
pdfmetrics.registerFont(TTFont("InterMed", "/usr/share/fonts/truetype/macos/Inter-Medium.ttf"))
pdfmetrics.registerFont(TTFont("InterSemi", "/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf"))
pdfmetrics.registerFont(TTFont("InterBold", "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"))

GOLD = HexColor("#FBB034")
INK = HexColor("#111111")
MUTED = HexColor("#444444")
RULE = HexColor("#111111")
CREAM = HexColor("#FFF8EC")
HEADER_BG = HexColor("#1A1A1A")
GRID = HexColor("#D9D9D9")
W, H = A4
ML = 51
MR = 51

DOC_NO = "EB-EO-2026-001"
DOC_DATE = "17 Eylül 2026"


def header_footer(c, doc):
    c.saveState()
    c.setFillColor(white)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    if LOGO.exists():
        c.drawImage(str(LOGO), ML, H - 92, width=128, height=58, mask="auto", preserveAspectRatio=True, anchor="c")
    c.setFillColor(INK)
    c.setFont("InterBold", 9)
    c.drawRightString(W - MR, H - 42, "EXPORT BOX")
    c.setFont("Inter", 7.2)
    c.setFillColor(MUTED)
    c.drawRightString(W - MR, H - 54, "Bilişim ve Dış Ticaret Anonim Şirketi")
    c.drawRightString(W - MR, H - 65, "Aşağı Öveçler Mah. 1322. Cad. No: 75/4 Çankaya / Ankara")
    c.drawRightString(W - MR, H - 76, "Başkent V.D.  381 103 0529")
    c.setStrokeColor(GOLD)
    c.setLineWidth(2)
    c.line(ML, H - 109, W - MR, H - 109)
    c.setStrokeColor(RULE)
    c.setLineWidth(0.4)
    c.line(ML, H - 113, W - MR, H - 113)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.4)
    c.line(ML, 40, W - MR, 40)
    c.setFillColor(MUTED)
    c.setFont("Inter", 7)
    c.drawString(ML, 28, "Export Box Bilişim ve Dış Ticaret A.Ş.  ·  Çankaya / Ankara  ·  Başkent V.D. 381 103 0529")
    c.drawRightString(W - MR, 28, f"Sayfa {doc.page}")
    c.restoreState()


def styles():
    s = getSampleStyleSheet()
    s.add(ParagraphStyle("metaL", fontName="Inter", fontSize=9, leading=13, textColor=MUTED))
    s.add(ParagraphStyle("metaR", fontName="Inter", fontSize=9, leading=13, textColor=MUTED, alignment=TA_RIGHT))
    s.add(
        ParagraphStyle(
            "HDoc",
            fontName="InterBold",
            fontSize=16.5,
            leading=21,
            textColor=INK,
            spaceBefore=10,
            spaceAfter=4,
        )
    )
    s.add(ParagraphStyle("Sub", fontName="Inter", fontSize=11, leading=15, textColor=HexColor("#C47A12"), spaceAfter=10))
    s.add(ParagraphStyle("Body", fontName="Inter", fontSize=9.4, leading=13.4, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=8))
    s.add(ParagraphStyle("H1", fontName="InterBold", fontSize=13, leading=17, textColor=INK, spaceBefore=12, spaceAfter=6))
    s.add(ParagraphStyle("H2", fontName="InterSemi", fontSize=10.5, leading=14, textColor=INK, spaceBefore=8, spaceAfter=4))
    s.add(ParagraphStyle("Cell", fontName="Inter", fontSize=8, leading=11, textColor=INK))
    s.add(ParagraphStyle("CellB", fontName="InterSemi", fontSize=8, leading=11, textColor=white))
    s.add(ParagraphStyle("CellH", fontName="InterSemi", fontSize=8, leading=11, textColor=white))
    s.add(ParagraphStyle("CellGold", fontName="InterBold", fontSize=8, leading=11, textColor=INK))
    s.add(ParagraphStyle("Cap", fontName="InterMed", fontSize=8.5, leading=11.5, textColor=MUTED, spaceBefore=4, spaceAfter=10))
    s.add(ParagraphStyle("Sign", fontName="Inter", fontSize=9, leading=12, textColor=INK, spaceBefore=6))
    s.add(ParagraphStyle("BulletBody", fontName="Inter", fontSize=9.2, leading=12.6, textColor=INK))
    return s


def p(st, key, text):
    return Paragraph(text.replace("\n", "<br/>"), st[key])


def bullets(st, items):
    lis = [ListItem(Paragraph(i, st["BulletBody"]), leftIndent=8, bulletColor=INK) for i in items]
    return ListFlowable(lis, bulletType="bullet", start="•", leftIndent=14, bulletFontName="Inter", bulletFontSize=9, spaceAfter=8)


def table(data, col_w, header=True, gold_last=False):
    cmd = [
        ("FONTNAME", (0, 0), (-1, -1), "Inter"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.3, GRID),
        ("BACKGROUND", (0, 1), (-1, -1), white),
    ]
    if header:
        cmd += [
            ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
            ("TEXTCOLOR", (0, 0), (-1, 0), white),
            ("FONTNAME", (0, 0), (-1, 0), "InterSemi"),
            ("BACKGROUND", (0, 1), (-1, 1), CREAM),
        ]
        if len(data) > 2:
            for i in range(2, len(data) - (1 if gold_last else 0)):
                if i % 2 == 0:
                    cmd.append(("BACKGROUND", (0, i), (-1, i), white))
                else:
                    cmd.append(("BACKGROUND", (0, i), (-1, i), CREAM))
    if gold_last:
        cmd += [
            ("BACKGROUND", (0, -1), (-1, -1), GOLD),
            ("FONTNAME", (0, -1), (-1, -1), "InterBold"),
        ]
    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle(cmd))
    return t


def screen_block(st, title, path, note, phone=False):
    img_path = TASLAK / path
    if not img_path.exists():
        return [p(st, "Body", f"<i>Görsel eksik: {path}</i>")]
    max_w = 72 * mm if phone else 170 * mm
    im = Image(str(img_path), width=max_w, height=max_w * 1.6 if phone else max_w * 0.56)
    im.hAlign = "CENTER"
    # keep aspect via PIL
    from PIL import Image as PILImage

    with PILImage.open(img_path) as pi:
        iw, ih = pi.size
    scale = max_w / iw
    dh = ih * scale
    max_h = 175 * mm if phone else 105 * mm
    if dh > max_h:
        scale = max_h / ih
        max_w = iw * scale
        dh = max_h
    im = Image(str(img_path), width=max_w, height=dh)
    im.hAlign = "CENTER"
    return KeepTogether([p(st, "H2", title), im, p(st, "Cap", note)])


def build():
    st = styles()
    story = []
    usable = W - ML - MR

    meta = Table(
        [
            [
                p(
                    st,
                    "metaL",
                    f"Belge No: {DOC_NO}<br/>Tarih: {DOC_DATE}<br/>Nitelik: Teklif değildir — fiyat yok",
                ),
                p(st, "metaR", "Hazırlayan: Export Box A.Ş.<br/>Ankara, Türkiye<br/>Kapsam / arayüz taslağı"),
            ]
        ],
        colWidths=[usable / 2, usable / 2],
    )
    meta.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)]))
    story += [Spacer(1, 8), meta]
    story += [
        p(st, "HDoc", "YAZILIM VE DİJİTAL HİZMET KAPSAM BELGESİ"),
        p(st, "Sub", "Elit Otomotiv · Self-servis oto hizmet uygulaması"),
        p(st, "Body", "Sayın Elit Otomotiv yetkilisi,"),
        p(
            st,
            "Body",
            "Export Box Bilişim ve Dış Ticaret A.Ş. olarak, <b>@elit_otomotiv</b> işletmeniz için "
            "müşteri self-servis ve işletme yönetim uygulamasının <b>kapsamını ve arayüz taslağını</b> sunarız. "
            "Belge bir fiyat teklifi değildir; tutar, KDV, ödeme planı ve sözleşme kabulü içermez. "
            "Amaç; yıkama, lastik, aksesuar, acil yol yardım ve detailing süreçlerini düzene sokmak, "
            "insan müşteri temsilcisinin tekrarlayan işini azaltmak ve işletme sahibinin tüm operasyonu "
            "tek panelden görmesini sağlamaktır.",
        ),
        p(
            st,
            "Body",
            "Kapsam üç paketten oluşur: <b>(A)</b> müşteri uygulaması; <b>(B)</b> işletme / sahip paneli; "
            "<b>(C)</b> kampanya, indirim kuponu ve otomatik bildirimler. Karşılama botu, yerinde ödeme "
            "entegrasyonu ve mobil mağaza uygulamaları bu belgenin kapsamı dışındadır (Hariç maddesi).",
        ),
        p(st, "H1", "1. Kapsam özeti"),
    ]
    story.append(
        table(
            [
                [p(st, "CellH", "Kalem"), p(st, "CellH", "Kapsam özeti")],
                [
                    p(st, "Cell", "<b>A. Müşteri self-servis</b>"),
                    p(
                        st,
                        "Cell",
                        "Ana sayfa, hizmet kataloğu, randevu, yol yardım, iş takibi, aksesuar, talepler, SSS, profil",
                    ),
                ],
                [
                    p(st, "Cell", "<b>B. İşletme paneli</b>"),
                    p(
                        st,
                        "Cell",
                        "Günün panosu, işler, randevular, yol yardım, müşteriler, personel, stok, gelir",
                    ),
                ],
                [
                    p(st, "Cell", "<b>C. Kampanya ve kupon</b>"),
                    p(
                        st,
                        "Cell",
                        "Kampanya yayını, kupon cüzdanı, push / kutu bildirimi, bitiş hatırlatması, kitle gönderimi",
                    ),
                ],
                [
                    p(st, "CellGold", "BELGE NİTELİĞİ"),
                    p(st, "CellGold", "Teklif değildir. Fiyat, KDV ve ödeme planı yer almaz."),
                ],
            ],
            [42 * mm, usable - 42 * mm],
            gold_last=True,
        )
    )
    story += [
        Spacer(1, 6),
        p(st, "H1", "2. Amaç"),
        p(
            st,
            "Body",
            "WhatsApp ve telefon kuyruğu; randevu, “aracım bitti mi”, kupon ve yol yardım için aynı temsilciye biner. "
            "Uygulama bu soruları forma, durum satırına ve otomatik mesaja çevirir. Sahip, günün panosundan iş, ekip, "
            "stok, ciro ve kampanya kullanımını görür.",
        ),
        bullets(
            st,
            [
                "<b>Müşteri:</b> randevu, yol yardım, takip, aksesuar, kupon ve kampanya — aramadan.",
                "<b>Operasyon:</b> iş kartını kuyrukta → yıkamada → kurulama → teslim ilerletir.",
                "<b>Sahip:</b> tüm sekmeler, gelir, stok, personel yükü, kampanya ve kupon tüketimi.",
            ],
        ),
        p(st, "H1", "3. Paket A — Müşteri uygulaması"),
        p(
            st,
            "Body",
            "Kurumsal vitrin ile operasyonel self-servisin birleşimidir. Müşteri plaka ve araç bilgisiyle hizmet seçer, "
            "slot kilitler, yol yardım çağırır, işini izler, aksesuar talep eder, kuponunu cüzdanında tutar. "
            "İnsan sohbeti varsayılan kanal değildir; <i>Taleplerim</i> otomatik durum kutusudur.",
        ),
        p(st, "H2", "3.1 Menüler"),
    ]
    story.append(
        table(
            [
                [p(st, "CellH", "Menü"), p(st, "CellH", "İşlev")],
                [p(st, "Cell", "Ana"), p(st, "Cell", "Araç kartı, hızlı hizmetler, aktif iş yüzdesi")],
                [p(st, "Cell", "Hizmetler"), p(st, "Cell", "Yıkama, lastik, aksesuar, yol yardım, detailing kataloğu")],
                [p(st, "Cell", "Randevu"), p(st, "Cell", "Tarih/saat, plaka, not, kupon uygulama")],
                [p(st, "Cell", "Yol yardım"), p(st, "Cell", "Konum, sorun tipi, aciliyet, canlı ekip durumu")],
                [p(st, "Cell", "İş takibi"), p(st, "Cell", "Kuyrukta → işlemde → teslim; “bitti mi?” sorusunu kapatır")],
                [p(st, "Cell", "Aksesuar"), p(st, "Cell", "Stoklu ürün, talep / sipariş, montaj randevusu")],
                [p(st, "Cell", "Taleplerim"), p(st, "Cell", "Randevu onayı, ekip yolda, kupon tanımlandı — sistem mesajı")],
                [p(st, "Cell", "Kampanyalar"), p(st, "Cell", "Aktif teklifler, süre, kuponu al")],
                [p(st, "Cell", "Kuponlarım"), p(st, "Cell", "Aktif / kullanıldı / süresi doldu; kod kopyala")],
                [p(st, "Cell", "Bildirimler"), p(st, "Cell", "Kampanya, kupon bitiş, iş ve yol yardım; kanal anahtarları")],
                [p(st, "Cell", "SSS"), p(st, "Cell", "Walk-in, süre, ödeme, kupon kullanımı")],
                [p(st, "Cell", "Profil"), p(st, "Cell", "Araç, iletişim, bildirim tercihleri (KVKK)")],
            ],
            [38 * mm, usable - 38 * mm],
        )
    )
    story += [
        Spacer(1, 8),
        p(st, "H2", "3.2 Self-servis kuralları"),
        bullets(
            st,
            [
                "Walk-in mümkün; yoğunlukta slot seçmek daha hızlıdır — temsilci araması gerekmez.",
                "Başlangıç süreleri kartta görünür; ağır kir / ebat / mesafe iş detayında güncellenir (onay kutuya düşer).",
                "Ödeme bu kapsamda simüle edilir; canlı tahsilat ayrı iş emridir.",
            ],
        ),
        p(st, "H1", "4. Paket B — İşletme / sahip paneli"),
        p(
            st,
            "Body",
            "Sahip ve vardiya sorumlusu aynı antetli dilde, masaüstü panodan çalışır. Her sekme ayrı ekran taslağıyla belgelenmiştir.",
        ),
    ]
    story.append(
        table(
            [
                [p(st, "CellH", "Sekme"), p(st, "CellH", "Sahibin gördüğü")],
                [p(st, "Cell", "Günün panosu"), p(st, "Cell", "Aktif iş, bekleyen randevu, açık yol yardım, gün ciro, bay durumu, harita")],
                [p(st, "Cell", "İşler"), p(st, "Cell", "Kanban: kuyrukta, yıkamada, kurulama, teslim; plaka, teknisyen, kupon")],
                [p(st, "Cell", "Randevular"), p(st, "Cell", "Takvim + tablo; onay tek dokunuş, müşteri kutusuna düşer")],
                [p(st, "Cell", "Yol yardım"), p(st, "Cell", "Birimler, açık çağrı, aciliyet, ETA")],
                [p(st, "Cell", "Müşteriler"), p(st, "Cell", "CRM: plaka, ziyaret, ciro, aktif kupon; kampanya kitlesi")],
                [p(st, "Cell", "Personel"), p(st, "Cell", "Vardiya ve yük; atama iş kartından")],
                [p(st, "Cell", "Stok"), p(st, "Cell", "Lastik ebatı, aksesuar, kimyasal; minimum altı uyarı")],
                [p(st, "Cell", "Kampanyalar"), p(st, "Cell", "Kitle, tarih, kupon bağla, yayında bildir, kullanım/limit")],
                [p(st, "Cell", "Kuponlar"), p(st, "Cell", "Kod, tür, son tarih, kullanım adedi, durdur / kitle gönder")],
                [p(st, "Cell", "Gelir"), p(st, "Cell", "Kırılım; kupon iskontosu ayrı satır (tutar bu belgede yok)")],
                [p(st, "Cell", "Bildirimler"), p(st, "Cell", "Push kuralı, 72s/24s kupon hatırlatma, kitle gönderimi")],
            ],
            [42 * mm, usable - 42 * mm],
        )
    )
    story += [
        Spacer(1, 8),
        p(st, "H1", "5. Paket C — Kampanya, kupon, bildirim"),
        bullets(
            st,
            [
                "Sahip kampanya açar (tarih, hedef kitle, kural). Sistem müşteriye push ve Taleplerim kaydı yollar.",
                "Kupon (yüzde, tutar veya hizmete özel) cüzdana düşer; randevu adımında uygulanır.",
                "Kupon bitmeden 72 / 24 saat kala otomatik hatırlatma. Kullanım ve iptal de bildirilir.",
                "Müşteri, kampanya ve kupon kanallarını profilinden ayrı ayrı kapatır.",
                "Örnek kurgular (fiyatsız): seramik haftası, 2 al 1 öde yıkama, lastikte balans hediye, doğum günü detailing.",
            ],
        ),
        p(st, "H1", "6. Hizmet modülleri"),
        p(st, "Body", "Süreler operasyon planı içindir. Birim fiyat bu belgede yer almaz."),
    ]
    story.append(
        table(
            [
                [p(st, "CellH", "Hizmet"), p(st, "CellH", "Süre"), p(st, "CellH", "Self-servis")],
                [p(st, "Cell", "Dış yıkama"), p(st, "Cell", "20 dk"), p(st, "Cell", "Slot + plaka + takip")],
                [p(st, "Cell", "İç + dış yıkama"), p(st, "Cell", "45 dk"), p(st, "Cell", "Not + teknisyen takibi")],
                [p(st, "Cell", "Motor bölmesi"), p(st, "Cell", "30 dk"), p(st, "Cell", "Randevulu gün")],
                [p(st, "Cell", "İç detailing"), p(st, "Cell", "2–3 sa"), p(st, "Cell", "Bırakış saati kilidi")],
                [p(st, "Cell", "Dış detailing + pasta"), p(st, "Cell", "½ gün"), p(st, "Cell", "Hasar notu + teslim")],
                [p(st, "Cell", "Boya koruma / seramik"), p(st, "Cell", "Keşif + plan"), p(st, "Cell", "Teklif kutuya yazılır")],
                [p(st, "Cell", "Far restorasyon"), p(st, "Cell", "45 dk"), p(st, "Cell", "Aynı gün slot")],
                [p(st, "Cell", "Koltuk & döşeme"), p(st, "Cell", "90 dk"), p(st, "Cell", "Leke türü formda")],
                [p(st, "Cell", "Lastik değişimi"), p(st, "Cell", "40 dk"), p(st, "Cell", "Ebat notu")],
                [p(st, "Cell", "Rot balans"), p(st, "Cell", "50 dk"), p(st, "Cell", "Belirti notu")],
                [p(st, "Cell", "Lastik yama"), p(st, "Cell", "25 dk"), p(st, "Cell", "Walk-in veya yol yardım")],
                [p(st, "Cell", "Akü takviye"), p(st, "Cell", "30–45 dk varış"), p(st, "Cell", "Konum + canlı ekip")],
                [p(st, "Cell", "Yolda lastik"), p(st, "Cell", "40 dk"), p(st, "Cell", "Stepne kutusu")],
                [p(st, "Cell", "Çekici / kurtarma"), p(st, "Cell", "Konuma bağlı"), p(st, "Cell", "Baş–bitiş + onay")],
                [p(st, "Cell", "Yakıt bitmesi"), p(st, "Cell", "35 dk"), p(st, "Cell", "Yakıt tipi")],
                [p(st, "Cell", "Klima / ozon"), p(st, "Cell", "40 dk"), p(st, "Cell", "Yıkamaya ek hizmet")],
            ],
            [58 * mm, 32 * mm, usable - 90 * mm],
        )
    )
    story += [
        Spacer(1, 8),
        p(st, "H2", "6.1 Aksesuar (örnek stok kalemleri — fiyat yok)"),
        bullets(
            st,
            [
                "4D havuzlu paspas, torpido örtüsü, bagaj organizer (iç).",
                "Jant kapağı, silecek, lastik bakım kiti (dış / bakım).",
                "Ön-arka kamera, LED aydınlatma (elektronik, montaj randevulu).",
            ],
        ),
        p(st, "H1", "7. Dahil / hariç"),
    ]
    inc_exc = Table(
        [
            [
                p(st, "CellH", "Dahil (kapsam)"),
                p(st, "CellH", "Hariç (bu belge)"),
            ],
            [
                p(
                    st,
                    "Cell",
                    "• Analiz ve arayüz taslağı (Ek A)<br/>"
                    "• Müşteri + sahip bilgi mimarisi<br/>"
                    "• Kampanya / kupon / bildirim modeli<br/>"
                    "• Hizmet ve menü envanteri<br/>"
                    "• Temsilci yükünü kesen self-servis kuralları",
                ),
                p(
                    st,
                    "Cell",
                    "• Birim fiyat, KDV, ödeme planı, sözleşme<br/>"
                    "• Karşılama botu, App Store / Play uygulamaları<br/>"
                    "• Gerçek POS / sanal pos, SMS operatör sözleşmesi<br/>"
                    "• Hosting, alan adı, KVKK avukat metni<br/>"
                    "• 7/24 çağrı merkezi personeli",
                ),
            ],
        ],
        colWidths=[usable / 2, usable / 2],
    )
    inc_exc.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.3, GRID),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("BACKGROUND", (0, 1), (0, 1), CREAM),
            ]
        )
    )
    story += [
        inc_exc,
        p(st, "H1", "8. Not"),
        p(
            st,
            "Body",
            "İşbu belge <b>teklif ve kabul formu değildir</b>. Geçerlilik süresi, peşinat ve imza ile işe başlama "
            "hükmü uygulanmaz. Fiyatlandırma ayrıca, Export Box teklif formu ile düzenlenir. "
            "Ankara mahkemeleri kaydı yalnızca ileride düzenlenecek sözleşmeye aittir.",
        ),
        Spacer(1, 16),
        Table(
            [
                [
                    p(st, "Sign", "Elit Otomotiv<br/>________________________<br/>Ad / unvan / paraf<br/><font size='8' color='#666666'>Bilgi amaçlı — mali kabul yok</font>"),
                    p(st, "Sign", "Export Box Bilişim ve Dış Ticaret A.Ş.<br/>________________________<br/>Ad / unvan / paraf<br/><font size='8' color='#666666'>Kapsam taslağı — teklif değil</font>"),
                ]
            ],
            colWidths=[usable / 2, usable / 2],
        ),
        PageBreak(),
        p(st, "HDoc", "EK A — ARAYÜZ TASLAKLARI"),
        p(st, "Sub", "Müşteri menüleri ve yönetici sekmeleri · görsel ek"),
        p(
            st,
            "Body",
            "Aşağıdaki görseller ürün taslağıdır; üretim arayüzü piksel birebir olmak zorunda değildir. "
            "Her sayfa Export Box antetli kâğıdındadır.",
        ),
    ]

    customer = [
        ("Ana sayfa", "musteri-ana.png", "Araç kartı, hızlı hizmetler, aktif iş. Alt menü: Ana, Hizmetler, Randevu, Takip, Profil.", True),
        ("Hizmetler", "musteri-hizmetler.png", "Katalog; süre kartta, birim fiyat teklif belgesine bırakılır.", True),
        ("Randevu", "musteri-randevu.png", "Slot, plaka, not, kupon alanı.", True),
        ("Acil yol yardım", "musteri-yol-yardim.png", "Konum ve aciliyet; ekip durumu canlı.", True),
        ("İş takibi", "musteri-is-takip.png", "Durum yüzdesi; temsilciye “bitti mi?” sorulmaz.", True),
        ("Aksesuar", "musteri-aksesuar.png", "Stoklu ürün ızgarası ve talep.", True),
        ("Taleplerim", "musteri-taleplerim.png", "Otomatik durum kutusu.", True),
        ("Kampanyalar", "musteri-kampanyalar.png", "Aktif kampanya; kuponu al.", True),
        ("Kuponlarım", "musteri-kuponlar.png", "Cüzdan: aktif / kullanıldı / doldu.", True),
        ("Bildirimler", "musteri-bildirimler.png", "Kampanya, kupon hatırlatma, iş ve yol yardım.", True),
        ("SSS", "musteri-sss.png", "Temsilci yükünü kesen sık sorular.", True),
        ("Profil", "musteri-profil.png", "Araç ve bildirim anahtarları.", True),
    ]
    admin = [
        ("Günün panosu", "isletme-gunun-panosu.png", "Sahibin sabah ekranı: iş, yol yardım, ciro göstergesi (rakamlar tasviridir, teklif değildir).", False),
        ("İşler", "panel-isler.png", "Atölye kanbanı.", False),
        ("Randevular", "panel-randevular.png", "Onay kuyruğu ve takvim.", False),
        ("Yol yardım", "panel-yol-yardim.png", "Canlı birimler ve açık çağrılar.", False),
        ("Müşteriler", "panel-musteriler.png", "CRM ve kupon ilişkisi.", False),
        ("Personel", "panel-personel.png", "Vardiya ve yük.", False),
        ("Stok", "panel-stok.png", "Lastik / aksesuar / kimyasal.", False),
        ("Kampanyalar", "panel-kampanyalar.png", "Yayın, kitle, kupon bağlama.", False),
        ("Kuponlar", "panel-kuponlar.png", "Kod envanteri ve kullanım.", False),
        ("Gelir", "panel-gelir.png", "Kırılım görünümü; belgedeki rakamlar örnektir, fiyat teklifi değildir.", False),
        ("Bildirimler", "panel-bildirimler.png", "Kampanya push ve kupon kuralları.", False),
    ]

    for title, fn, note, phone in customer:
        story += [PageBreak(), screen_block(st, f"Müşteri · {title}", fn, note, phone=phone)]
    for title, fn, note, phone in admin:
        story += [PageBreak(), screen_block(st, f"Yönetici · {title}", fn, note, phone=phone)]

    story += [
        PageBreak(),
        p(st, "H1", "Ek A kapanış"),
        p(
            st,
            "Body",
            "Export Box Bilişim ve Dış Ticaret Anonim Şirketi · Aşağı Öveçler Mah. 1322. Cad. No: 75/4 "
            "Çankaya / Ankara · Başkent Vergi Dairesi 381 103 0529",
        ),
        p(st, "Body", f"Belge {DOC_NO} · {DOC_DATE} · Teklif değildir."),
    ]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=ML,
        rightMargin=MR,
        topMargin=128,
        bottomMargin=54,
        title="Export Box — Elit Otomotiv kapsam belgesi",
        author="Export Box Bilişim ve Dış Ticaret A.Ş.",
        subject="Teklif değildir; fiyat içermez",
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(OUT, OUT.stat().st_size)


if __name__ == "__main__":
    build()
