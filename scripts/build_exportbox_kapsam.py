#!/usr/bin/env python3
"""ExportBox antetli kâğıt — yalnızca arayüz görselleri."""

from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Image, KeepTogether, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path("/workspace")
LOGO = ROOT / "docs/branding/exportbox-logo.jpg"
TASLAK = ROOT / "public/taslak"
OUT = ROOT / "docs/ExportBox_ElitOtomotiv_Kapsam.pdf"

pdfmetrics.registerFont(TTFont("Inter", "/usr/share/fonts/truetype/macos/Inter-Regular.ttf"))
pdfmetrics.registerFont(TTFont("InterBold", "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"))

GOLD = HexColor("#FBB034")
INK = HexColor("#111111")
MUTED = HexColor("#444444")
RULE = HexColor("#111111")
W, H = A4
ML = 51
MR = 51

CUSTOMER = [
    "musteri-ana.png",
    "musteri-hizmetler.png",
    "musteri-randevu.png",
    "musteri-yol-yardim.png",
    "musteri-is-takip.png",
    "musteri-aksesuar.png",
    "musteri-taleplerim.png",
    "musteri-kampanyalar.png",
    "musteri-kuponlar.png",
    "musteri-bildirimler.png",
    "musteri-sss.png",
    "musteri-profil.png",
]
ADMIN = [
    "isletme-gunun-panosu.png",
    "panel-isler.png",
    "panel-randevular.png",
    "panel-yol-yardim.png",
    "panel-musteriler.png",
    "panel-personel.png",
    "panel-stok.png",
    "panel-kampanyalar.png",
    "panel-kuponlar.png",
    "panel-gelir.png",
    "panel-bildirimler.png",
]


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


def fitted(path, max_w, max_h):
    with PILImage.open(path) as pi:
        iw, ih = pi.size
    scale = min(max_w / iw, max_h / ih)
    im = Image(str(path), width=iw * scale, height=ih * scale)
    im.hAlign = "CENTER"
    return im


def phone_row(names, usable):
    col = usable / 2 - 6
    cells = []
    for name in names:
        cells.append(fitted(TASLAK / name, col, 165 * mm))
    while len(cells) < 2:
        cells.append(Spacer(1, 1))
    t = Table([cells], colWidths=[usable / 2, usable / 2])
    t.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return KeepTogether([t])


def admin_stack(names, usable):
    h = 95 * mm if len(names) <= 2 else 62 * mm
    flows = [fitted(TASLAK / n, usable, h) for n in names]
    for i in range(len(flows) - 1):
        flows.insert(i * 2 + 1, Spacer(1, 8))
    return KeepTogether(flows)


def build():
    usable = W - ML - MR
    story = []
    for i in range(0, len(CUSTOMER), 2):
        story.append(phone_row(CUSTOMER[i : i + 2], usable))
    i = 0
    while i < len(ADMIN):
        take = 3 if (len(ADMIN) - i) == 3 else 2
        story.append(admin_stack(ADMIN[i : i + take], usable))
        i += take

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=ML,
        rightMargin=MR,
        topMargin=124,
        bottomMargin=52,
        title="Export Box — Elit Otomotiv arayüz görselleri",
        author="Export Box Bilişim ve Dış Ticaret A.Ş.",
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(OUT, OUT.stat().st_size)


if __name__ == "__main__":
    build()
