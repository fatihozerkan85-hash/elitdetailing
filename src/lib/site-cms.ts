import { BANNER_OFFERS, CAMPAIGNS, SERVICES } from "./catalog";
import type { Service, ServiceCategory } from "./types";
import { uid } from "./format";

export type CmsBanner = {
  id: string;
  tag: string;
  title: string;
  highlight: string;
  desc: string;
  cta: string;
  code: string;
  serviceId: string;
  listPrice: number;
  price: number;
  image: string;
  accent: string;
  active: boolean;
};

export type CmsTickerItem = {
  id: string;
  emoji: string;
  text: string;
  active: boolean;
};

export type CmsHomeService = {
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  duration: string;
  tag: string;
  icon: string;
  href: string;
  active: boolean;
};

export type CmsCampaign = {
  id: string;
  title: string;
  blurb: string;
  couponCode: string;
  ends: string;
  audience: string;
  active: boolean;
};

export type CmsTextBlock = {
  id: string;
  group: string;
  label: string;
  value: string;
};

export type CmsFormField = {
  key: string;
  label: string;
  enabled: boolean;
  required: boolean;
};

export type CmsForm = {
  id: string;
  name: string;
  path: string;
  enabled: boolean;
  fields: CmsFormField[];
};

export type CmsService = Service & {
  active: boolean;
  discovery: boolean;
};

export type SiteCms = {
  banners: CmsBanner[];
  ticker: CmsTickerItem[];
  homeServices: CmsHomeService[];
  campaigns: CmsCampaign[];
  services: CmsService[];
  texts: CmsTextBlock[];
  forms: CmsForm[];
};

export function buildDefaultCms(): SiteCms {
  return {
    banners: BANNER_OFFERS.map((o) => ({ ...o, id: String(o.id), active: true })),
    ticker: [
      { id: "t1", emoji: "🔥", text: "Eylül Kampanyası: Seramik Kaplamada %20 İndirim — Kod: ELIT20", active: true },
      { id: "t2", emoji: "⚡", text: "Yeni Hizmet: Filo Araç Bakım Paketleri — Toplu Randevu Avantajı", active: true },
      { id: "t3", emoji: "🎁", text: "İç+Dış Yıkama Al 1 Öde — Eylül Sonuna Kadar Geçerli", active: true },
      { id: "t4", emoji: "🏆", text: "Elit Detailing, 2024 Türkiyenin En İyi Detailing Merkezi Ödülünü Aldı", active: true },
      { id: "t5", emoji: "📱", text: "Mobil Uygulamamızı İndirin, İlk Randevunuzda %10 İndirim Kazanın", active: true },
    ],
    homeServices: [
      { id: "hs1", title: "Premium Oto Yıkama", subtitle: "PREMIUM · EXCLUSIVE", priceLabel: "1.250 ₺", duration: "45 dk", tag: "En Popüler", icon: "/services/premium-oto-yikama.png", href: "/randevu?hizmet=ic-dis-yikama", active: true },
      { id: "hs2", title: "Lastik Değişimi & Balans", subtitle: "", priceLabel: "1.850 ₺", duration: "60 dk", tag: "", icon: "/services/lastik-balans.png", href: "/randevu?hizmet=lastik-degisim", active: true },
      { id: "hs3", title: "Oto Kuaför & Detailing", subtitle: "", priceLabel: "950 ₺", duration: "30 dk", tag: "", icon: "/services/oto-kuafor-detailing.png", href: "/randevu?hizmet=detayli-ic", active: true },
      { id: "hs4", title: "Detaylı İç-Dış Yıkama", subtitle: "FULL DETAILING", priceLabel: "2.750 ₺", duration: "90 dk", tag: "Premium", icon: "/services/detayli-ic-dis-yikama.png", href: "/randevu?hizmet=ic-dis-yikama", active: true },
      { id: "hs6", title: "Seramik Kaplama", subtitle: "CERAMIC PRO", priceLabel: "8.500 ₺", duration: "240 dk", tag: "Lüks", icon: "/services/seramik-kaplama.png", href: "/randevu?hizmet=boya-koruma", active: true },
      { id: "hs7", title: "Acil Yol Yardımı", subtitle: "7/24", priceLabel: "2.200 ₺", duration: "Anında", tag: "7/24", icon: "/services/acil-yol-yardim.png", href: "/yol-yardim", active: true },
      { id: "hs8", title: "PPF Film Kaplama", subtitle: "PAINT PROTECTION", priceLabel: "12.000 ₺", duration: "360 dk", tag: "Elit", icon: "/services/ppf-film-kaplama.png", href: "/odeme/kampanya?id=3", active: true },
    ],
    campaigns: CAMPAIGNS.map((c) => ({ ...c, active: true })),
    services: SERVICES.map((s) => ({
      ...s,
      active: true,
      discovery: s.id === "boya-koruma",
    })),
    texts: [
      { id: "hero.kicker", group: "Hero", label: "Hero üst yazı", value: "✦   PREMİUM OTOMOTİV HİZMETLERİ   ✦" },
      { id: "hero.lead", group: "Hero", label: "Hero açıklama", value: "Aracınız bir sanat eserine dönüşmeyi hak ediyor. Profesyonel detailing, seramik kaplama ve premium bakım hizmetleriyle fark yaratıyoruz." },
      { id: "hero.ctaPrimary", group: "Hero", label: "Hero birincil buton", value: "Hizmetleri Keşfet" },
      { id: "hero.ctaSecondary", group: "Hero", label: "Hero ikincil buton", value: "Giriş Yap" },
      { id: "stats.customers", group: "İstatistik", label: "Mutlu müşteri", value: "2.500+" },
      { id: "stats.years", group: "İstatistik", label: "Deneyim", value: "8 Yıl" },
      { id: "stats.tech", group: "İstatistik", label: "Uzman teknisyen", value: "15+" },
      { id: "stats.satisfaction", group: "İstatistik", label: "Memnuniyet", value: "%100" },
      { id: "services.kicker", group: "Hizmetler", label: "Bölüm üst yazı", value: "✦   HİZMETLERİMİZ   ✦" },
      { id: "services.title", group: "Hizmetler", label: "Bölüm başlık", value: "Premium Bakım Paketleri" },
      { id: "about.kicker", group: "Hakkımızda", label: "Üst yazı", value: "✦   HAKKIMIZDA" },
      { id: "about.title1", group: "Hakkımızda", label: "Başlık satır 1", value: "Mükemmelliği" },
      { id: "about.title2", group: "Hakkımızda", label: "Başlık satır 2", value: "Tanımlıyoruz" },
      { id: "about.p1", group: "Hakkımızda", label: "Paragraf 1", value: "8 yılı aşkın deneyimimizle Ankara’nın prestijli araç bakım merkezi olarak hizmet veriyoruz." },
      { id: "about.p2", group: "Hakkımızda", label: "Paragraf 2", value: "Ceramic Pro sertifikalı ekibimiz, dünya standartlarında ürünler ve özel tekniklerle aracınıza değer katıyor." },
      { id: "about.points", group: "Hakkımızda", label: "Madde listesi (virgülle)", value: "Sertifikalı Ürünler,Uzman Teknisyen,Garanti Hizmeti,7/24 Destek" },
      { id: "about.badgeNum", group: "Hakkımızda", label: "Rozet sayı", value: "8+" },
      { id: "about.badgeLabel", group: "Hakkımızda", label: "Rozet yazı", value: "YIL DENEYİM" },
      { id: "about.image", group: "Hakkımızda", label: "Görsel URL", value: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&h=700&fit=crop&auto=format" },
      { id: "cta.kicker", group: "CTA", label: "Üst yazı", value: "✦   RANDEVU" },
      { id: "cta.title", group: "CTA", label: "Başlık", value: "Aracınız için En İyi Bakımı Seçin" },
      { id: "cta.lead", group: "CTA", label: "Açıklama", value: "Online randevu alın, premium detailing deneyimini yaşayın." },
      { id: "cta.button", group: "CTA", label: "Buton", value: "Hemen Randevu Al" },
      { id: "contact.phone", group: "İletişim", label: "Telefon", value: "+90 (312) 000 00 00" },
      { id: "contact.email", group: "İletişim", label: "E-posta", value: "info@elitdetailing.com" },
      { id: "contact.address", group: "İletişim", label: "Adres", value: "Ostim, Ankara" },
      { id: "footer.copy", group: "Footer", label: "Telif", value: "© 2026 Elit Detailing. Tüm hakları saklıdır." },
      { id: "randevu.lead", group: "Form metinleri", label: "Randevu sayfa açıklama", value: "Sabit fiyatlı hizmetler iyzico ile peşin. Seramik / boya koruma keşif sonrası ödenir." },
      { id: "yol.lead", group: "Form metinleri", label: "Yol yardım açıklama", value: "Trafikte güvenli alana çekin. Bu ekran 112 yerine geçmez." },
      { id: "aksesuar.lead", group: "Form metinleri", label: "Aksesuar açıklama", value: "Sepete ekleyin, iyzico ile tam ödeme. Nakit yok." },
    ],
    forms: [
      {
        id: "form-randevu",
        name: "Randevu formu",
        path: "/randevu",
        enabled: true,
        fields: [
          { key: "hizmet", label: "Hizmet", enabled: true, required: true },
          { key: "name", label: "Ad soyad", enabled: true, required: true },
          { key: "phone", label: "Telefon", enabled: true, required: true },
          { key: "email", label: "E-posta", enabled: true, required: true },
          { key: "plate", label: "Plaka", enabled: true, required: true },
          { key: "vehicle", label: "Araç", enabled: true, required: false },
          { key: "date", label: "Tarih", enabled: true, required: true },
          { key: "time", label: "Saat", enabled: true, required: true },
          { key: "notes", label: "Not", enabled: true, required: false },
        ],
      },
      {
        id: "form-yol",
        name: "Yol yardım formu",
        path: "/yol-yardim",
        enabled: true,
        fields: [
          { key: "name", label: "Ad soyad", enabled: true, required: true },
          { key: "phone", label: "Telefon", enabled: true, required: true },
          { key: "plate", label: "Plaka", enabled: true, required: true },
          { key: "vehicle", label: "Araç", enabled: true, required: false },
          { key: "location", label: "Konum notu", enabled: true, required: true },
          { key: "gps", label: "GPS paylaş", enabled: true, required: false },
          { key: "issue", label: "Sorun", enabled: true, required: true },
          { key: "urgency", label: "Aciliyet", enabled: true, required: true },
        ],
      },
      {
        id: "form-aksesuar",
        name: "Aksesuar ödeme formu",
        path: "/aksesuar",
        enabled: true,
        fields: [
          { key: "name", label: "Ad", enabled: true, required: true },
          { key: "phone", label: "Telefon", enabled: true, required: true },
          { key: "email", label: "E-posta", enabled: true, required: true },
          { key: "notes", label: "Not", enabled: true, required: false },
        ],
      },
    ],
  };
}

export function textMap(texts: CmsTextBlock[]) {
  return Object.fromEntries(texts.map((t) => [t.id, t.value])) as Record<string, string>;
}

export function newServiceDraft(): CmsService {
  return {
    id: uid("svc").toLowerCase(),
    category: "diger" as ServiceCategory,
    name: "Yeni hizmet",
    short: "Kısa açıklama",
    description: "Detaylı açıklama",
    durationMin: 60,
    bufferMin: 10,
    fromPrice: 1000,
    selfService: ["Online randevu alın"],
    segments: [{ title: "Uygulama", minutes: 60 }],
    active: true,
    discovery: false,
  };
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "yikama",
  "lastik",
  "aksesuar",
  "yol-yardim",
  "detailing",
  "diger",
];
