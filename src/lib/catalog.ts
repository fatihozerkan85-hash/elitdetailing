import type { Accessory, Service, ServiceSegment } from "./types";

export const BRAND = {
  name: "Elit Detailing",
  short: "ED",
  tagline: "Aracınız Elit’te: detailing, yıkama, lastik ve yol yardım.",
  instagram: "https://www.instagram.com/elit_otomotiv/",
  instagramHandle: "@elit_otomotiv",
  hours: "Pazartesi–Cumartesi 08:30–20:00 · Pazar randevulu",
  city: "Ankara",
  address: "Ostim, Ankara",
  phone: "0312 000 00 00",
  note: "Elit Detailing self-servis sitesi ve işletme paneli prototipidir. Adres ve fiyatlar demo amaçlıdır.",
};

export const CATEGORY_LABEL: Record<Service["category"], string> = {
  yikama: "Oto yıkama",
  lastik: "Oto lastik",
  aksesuar: "Oto aksesuar",
  "yol-yardim": "Acil yol yardım",
  detailing: "Detailing",
  diger: "İlgili hizmetler",
};

const SERVICE_BASE: Omit<Service, "segments" | "bufferMin">[] = [
  {
    id: "dis-yikama",
    category: "yikama",
    name: "Dış yıkama",
    short: "Köpük, jant, kurulama — 20 dakika.",
    description:
      "Ön yıkama, aktif köpük, jant temizliği ve mikrofiber kurulama. İş yerinde beklerken veya randevu ile.",
    durationMin: 20,
    fromPrice: 350,
    selfService: [
      "Uygun saati seçip plaka ile randevu alın",
      "Kuyruk durumunu ‘İş takibi’nden izleyin",
      "Teslim bildirimi Taleplerim kutusuna düşer",
    ],
  },
  {
    id: "ic-dis-yikama",
    category: "yikama",
    name: "İç + dış yıkama",
    short: "Torpido, halı, dış yüzey — 45 dakika.",
    description:
      "Dış yıkamaya ek vakum, torpido silme, camlar ve koku kontrolü. Aile ve filo araçları için günlük paket.",
    durationMin: 45,
    fromPrice: 650,
    selfService: [
      "İç temizlik notunu (hayvan tüyü, çocuk koltuğu) forma yazın",
      "Teknisyen atamasını panelden takip edin",
    ],
  },
  {
    id: "motor-yikama",
    category: "yikama",
    name: "Motor bölmesi temizliği",
    short: "Kontrollü buhar / kimyasal — 30 dakika.",
    description:
      "Hassas elektroniklere zarar vermeden motor üstü temizlik ve koruma. Randevu önerilir.",
    durationMin: 30,
    fromPrice: 550,
    selfService: ["Motor yıkama için uygun gün seçin", "Garanti notunu forma ekleyin"],
  },
  {
    id: "detayli-ic",
    category: "detailing",
    name: "İç detailing",
    short: "Derin temizlik, deri/kumaş bakım — 2–3 saat.",
    description:
      "Koltuk araları, tavan, kapı cepleri, klima menfezleri ve koku giderme. Hijyen odaklı paket.",
    durationMin: 150,
    fromPrice: 2200,
    selfService: [
      "Aracı bırakma saatini randevu ile kilitleyin",
      "İlerlemeyi kuyrukta → işlemde → teslim olarak izleyin",
    ],
  },
  {
    id: "dis-detailing",
    category: "detailing",
    name: "Dış detailing + pasta-cila",
    short: "Kil, pasta, cila — yarım gün.",
    description:
      "Kil uygulaması, hafif pasta ve koruyucu cila. İnce çizik görünümünü azaltır, boyayı derinleştirir.",
    durationMin: 240,
    fromPrice: 3800,
    selfService: ["Fotoğraf notu bırakın (çakıl izi, kuş pisliği)", "Teslim SMS/kutu mesajı alın"],
  },
  {
    id: "boya-koruma",
    category: "detailing",
    name: "Boya koruma / seramik talep",
    short: "Keşif + uygulama planı — 1 gün.",
    description:
      "Boya durumu keşfi sonrası koruma katmanı planı. Uygulama süresi araç ve ürüne göre değişir; fiyat keşif sonrası netleşir.",
    durationMin: 480,
    fromPrice: 8500,
    selfService: ["Keşif randevusu alın", "Teklif Taleplerim’de yazılı gelir — arama gerekmez"],
  },
  {
    id: "far-restorasyon",
    category: "detailing",
    name: "Far temizliği ve parlatma",
    short: "Mat far restorasyonu — 45 dakika.",
    description:
      "Oksitlenen farları zımpara + pasta + koruma ile netleştirir; gece görüşüne katkı sağlar.",
    durationMin: 45,
    fromPrice: 900,
    selfService: ["Aynı gün slot seçin", "Önce/sonra notunu takip ekranında görün"],
  },
  {
    id: "koltuk-yikama",
    category: "detailing",
    name: "Koltuk & döşeme yıkama",
    short: "Leke ve koku — 90 dakika.",
    description:
      "Kumaş/deri uygun kimyasalla leke ve koku giderme, kurutma. Aynı gün teslim mümkün.",
    durationMin: 90,
    fromPrice: 1600,
    selfService: ["Leke türünü (kahve, yağ, evcil hayvan) yazın"],
  },
  {
    id: "lastik-degisim",
    category: "lastik",
    name: "Lastik değişimi",
    short: "Sök-tak, tork, kontrol — 40 dakika.",
    description:
      "Mevsimsel veya yeni lastik montajı, sibop ve basıç kontrolü. Stoktaki ebatlar aksesuar/lastik listesinde.",
    durationMin: 40,
    fromPrice: 400,
    selfService: ["Ebatı (örn. 225/45 R17) nota yazın", "Sıra numarasını takip edin"],
  },
  {
    id: "rot-balans",
    category: "lastik",
    name: "Rot balans & rot ayarı talebi",
    short: "Titreşim ve lastik aşınması — 50 dakika.",
    description:
      "Balans ağırlıkları ve rot kontrolü. Direksiyon titremesi için ilk durak.",
    durationMin: 50,
    fromPrice: 750,
    selfService: ["Belirtiyi (titreşim km aralığı) yazın"],
  },
  {
    id: "lastik-tamir",
    category: "lastik",
    name: "Lastik tamir / yama",
    short: "Delinme onarımı — 25 dakika.",
    description:
      "Diş dibine uygun yama. Yanak hasarında güvenlik nedeniyle değişim önerilir — sistem sizi uyarır.",
    durationMin: 25,
    fromPrice: 250,
    selfService: ["Acilse yol yardım formunu kullanın", "Atölyedeyseniz walk-in kuyruğa girin"],
  },
  {
    id: "yol-aku",
    category: "yol-yardim",
    name: "Akü takviye",
    short: "Yerinde takviye — 30–45 dk varış hedefi.",
    description:
      "Kontak açılmayan araç için yerinde takviye. Konum notu ve kat/otopark bilgisi yeter.",
    durationMin: 40,
    fromPrice: 650,
    selfService: ["Konum + kat/ada yazın", "Ekip durumunu canlı izleyin"],
  },
  {
    id: "yol-lastik",
    category: "yol-yardim",
    name: "Yolda lastik değişimi",
    short: "Stepne veya tamir — 40 dk.",
    description:
      "Stepne montajı veya yerinde yama. Stepne yoksa çekici seçeneği sunulur.",
    durationMin: 40,
    fromPrice: 750,
    selfService: ["Stepne var/yok kutusunu işaretleyin", "Trafik güvenliği uyarısını okuyun"],
  },
  {
    id: "cekici",
    category: "yol-yardim",
    name: "Çekici / kurtarma",
    short: "Şehir içi çekici — süre konuma bağlı.",
    description:
      "Yürümeyen araç için çekici talebi. Varış ve tahmini ücret konum notuna göre güncellenir.",
    durationMin: 60,
    fromPrice: 1400,
    selfService: ["Başlangıç ve hedefi yazın", "Ön ödeme gerekmez — onay kutuya düşer"],
  },
  {
    id: "yakit",
    category: "yol-yardim",
    name: "Yakıt bitmesi",
    short: "Acil yakıt ikmali — 35 dk.",
    description: "Benzin/dizel acil ikmal. Miktar ve yakıt tipi formda seçilir.",
    durationMin: 35,
    fromPrice: 550,
    selfService: ["Yakıt tipini seçin"],
  },
  {
    id: "klima-ozon",
    category: "diger",
    name: "Klima koku / ozon",
    short: "İç hijyen — 40 dakika.",
    description: "Klima menfez kokusu ve iç hijyen uygulaması. Yıkama ile kombine edilebilir.",
    durationMin: 40,
    fromPrice: 700,
    selfService: ["Yıkama randevusuna ek hizmet olarak işaretleyin"],
  },
];

const SERVICE_SEGMENTS: Record<string, ServiceSegment[]> = {
  "dis-yikama": [
    { title: "Hazırlık", minutes: 3 },
    { title: "Dış yıkama", minutes: 12 },
    { title: "Kurulama", minutes: 5 },
  ],
  "ic-dis-yikama": [
    { title: "Hazırlık", minutes: 5 },
    { title: "Dış yıkama", minutes: 15 },
    { title: "İç temizlik", minutes: 18 },
    { title: "Kurulama / teslim", minutes: 7 },
  ],
  "motor-yikama": [
    { title: "Maskeleme", minutes: 5 },
    { title: "Motor temizlik", minutes: 20 },
    { title: "Kontrol", minutes: 5 },
  ],
  "detayli-ic": [
    { title: "Hazırlık", minutes: 10 },
    { title: "Derin iç temizlik", minutes: 90 },
    { title: "Deri / kumaş bakım", minutes: 35 },
    { title: "Kontrol / teslim", minutes: 15 },
  ],
  "dis-detailing": [
    { title: "Kil ve yıkama", minutes: 40 },
    { title: "Pasta", minutes: 100 },
    { title: "Cila", minutes: 70 },
    { title: "Kontrol", minutes: 30 },
  ],
  "boya-koruma": [
    { title: "Keşif", minutes: 40 },
    { title: "Yüzey hazırlık", minutes: 80 },
    { title: "Kaplama uygulaması", minutes: 280 },
    { title: "Kür / teslim", minutes: 80 },
  ],
  "far-restorasyon": [
    { title: "Maskeleme", minutes: 8 },
    { title: "Zımpara ve pasta", minutes: 27 },
    { title: "Koruma / teslim", minutes: 10 },
  ],
  "koltuk-yikama": [
    { title: "Vakum", minutes: 15 },
    { title: "Yıkama", minutes: 50 },
    { title: "Kurutma", minutes: 25 },
  ],
  "lastik-degisim": [
    { title: "Söküm", minutes: 12 },
    { title: "Montaj", minutes: 18 },
    { title: "Tork / kontrol", minutes: 10 },
  ],
  "rot-balans": [
    { title: "Ölçüm", minutes: 10 },
    { title: "Balans", minutes: 25 },
    { title: "Yol testi", minutes: 15 },
  ],
  "lastik-tamir": [
    { title: "İnceleme", minutes: 5 },
    { title: "Yama", minutes: 15 },
    { title: "Kontrol", minutes: 5 },
  ],
  "yol-aku": [
    { title: "Yola çıkış", minutes: 10 },
    { title: "Varış", minutes: 20 },
    { title: "Takviye", minutes: 10 },
  ],
  "yol-lastik": [
    { title: "Yola çıkış", minutes: 10 },
    { title: "Varış", minutes: 20 },
    { title: "Lastik işlemi", minutes: 10 },
  ],
  cekici: [
    { title: "Yönlendirme", minutes: 15 },
    { title: "Yolda", minutes: 30 },
    { title: "Yükleme", minutes: 15 },
  ],
  yakit: [
    { title: "Yola çıkış", minutes: 10 },
    { title: "İkmal", minutes: 25 },
  ],
  "klima-ozon": [
    { title: "Hazırlık", minutes: 5 },
    { title: "Ozon", minutes: 25 },
    { title: "Havalandırma", minutes: 10 },
  ],
};

const BUFFER_MIN: Record<string, number> = {
  "dis-detailing": 20,
  "detayli-ic": 15,
  "boya-koruma": 30,
};

export const SERVICES: Service[] = SERVICE_BASE.map((s) => {
  const segments = SERVICE_SEGMENTS[s.id] ?? [{ title: "İşlem", minutes: s.durationMin }];
  const durationMin = segments.reduce((n, x) => n + x.minutes, 0);
  return {
    ...s,
    durationMin,
    bufferMin: BUFFER_MIN[s.id] ?? 10,
    segments,
  };
});

export const ACCESSORIES: Accessory[] = [
  {
    id: "acc-paspas",
    name: "4D havuzlu paspas seti",
    category: "İç aksesuar",
    price: 1850,
    stock: 8,
    description: "Modele göre kesim. Randevu gününde montaj ücretsiz.",
  },
  {
    id: "acc-kamera",
    name: "Ön-arka kamera kiti",
    category: "Elektronik",
    price: 4200,
    stock: 3,
    description: "Montaj randevusu ile birlikte sipariş edilir.",
  },
  {
    id: "acc-kokpit",
    name: "Torpido koruma örtüsü",
    category: "İç aksesuar",
    price: 650,
    stock: 14,
    description: "UV çatlamasına karşı. Renk seçenekleri notta.",
  },
  {
    id: "acc-jant",
    name: "Jant kapağı seti 15–17”",
    category: "Dış",
    price: 890,
    stock: 11,
    description: "Stoktan aynı gün teslim.",
  },
  {
    id: "acc-silecek",
    name: "Premium silecek takımı",
    category: "Bakım",
    price: 480,
    stock: 22,
    description: "Ölçüye göre. Yıkama sırasında takılır.",
  },
  {
    id: "acc-lastik-parf",
    name: "Lastik parlatıcı + bakım kiti",
    category: "Bakım",
    price: 320,
    stock: 30,
    description: "Ev kullanımı. Kasa teslim veya yıkamayla birlikte.",
  },
  {
    id: "acc-organizer",
    name: "Bagaj organizer",
    category: "İç aksesuar",
    price: 540,
    stock: 9,
    description: "Kaymaz taban, katlanır.",
  },
  {
    id: "acc-led",
    name: "LED plaka & ayak altı aydınlatma",
    category: "Elektronik",
    price: 1100,
    stock: 6,
    description: "Montaj 30 dk. Elektrik işi randevulu.",
  },
];

export const FAQ = [
  {
    q: "Randevu almadan gelebilir miyim?",
    a: "Evet, walk-in kuyruğa alınır. Yoğunlukta beklememek için uygulamadan slot seçmeniz daha hızlıdır — temsilci aramanıza gerek yok.",
  },
  {
    q: "Fiyatlar net mi?",
    a: "Listelenen tutarlar başlangıç fiyatıdır. Ağır kir, seramik, lastik ebatı veya çekici mesafesi iş detayında güncellenir; onay Taleplerim’e düşer.",
  },
  {
    q: "Ödeme nasıl?",
    a: "Teslimde nakit, kart veya filo cari. Online ödeme bu prototipte simüle edilmez; panelde tahsilat işareti vardır.",
  },
  {
    q: "Yol yardım ne kadar sürer?",
    a: "Ankara şehir içi hedef: kritik 30 dk, yüksek 45 dk, normal 60 dk. Gerçek varış ekip yüküne göre panelden güncellenir.",
  },
  {
    q: "Lastiğim yanaktan mı patladı?",
    a: "Yanak hasarı genellikle tamir edilmez. Fotoğraf notu bırakın; usta ‘değişim önerilir’ mesajını kutuya yazar, arama olmaz.",
  },
  {
    q: "Detailing aracı ne kadar tutarsınız?",
    a: "İç detailing ~3 saat, pasta-cila yarım gün, boya koruma keşif sonrası planlanır. Teslim saatini takip ekranı gösterir.",
  },
  {
    q: "Filo / kurumsal yıkama?",
    a: "Plaka listesini nota yapıştırın, tekrarlayan randevu isteyin. Operatör panelden toplu onaylar.",
  },
  {
    q: "Kişisel veriler?",
    a: "Bu demo tarayıcınızda localStorage kullanır; sunucuya gitmez. Canlıya alınca KVKK metni ve gerçek barındırma gerekir.",
  },
];

export const JOB_STATUS_LABEL: Record<string, string> = {
  "giris-bekleniyor": "Giriş bekleniyor",
  kuyrukta: "Kuyrukta",
  yikamada: "Yıkamada",
  kurulama: "Kurulama",
  teslim: "Teslim",
  iptal: "İptal",
};

export const ROADSIDE_STATUS_LABEL: Record<string, string> = {
  alindi: "Talep alındı",
  yonlendirildi: "Ekip yönlendirildi",
  yolda: "Ekip yolda",
  yerinde: "Yerinde",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
};

export const APPT_STATUS_LABEL: Record<string, string> = {
  bekliyor: "Onay bekliyor",
  onaylandi: "Onaylandı",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  talep: "Talep alındı",
  hazirlaniyor: "Hazırlanıyor",
  hazir: "Teslime hazır",
  teslim: "Teslim edildi",
  iptal: "İptal",
};

export const JOB_FLOW: Array<"kuyrukta" | "yikamada" | "kurulama" | "teslim"> = [
  "kuyrukta",
  "yikamada",
  "kurulama",
  "teslim",
];

export const DEMO = {
  ownerPin: "2580",
  customerPhone: "05551234567",
  customerName: "Demo Müşteri",
};

/** Gizli işletme paneli. Kamu sitede link yok. */
export const ADMIN_PATH = "/yonetici";

/** Keşif sonrası teklif + iyzico linki (online tam fiyat çekilmez). */
export const DISCOVERY_SERVICE_IDS = new Set(["boya-koruma"]);

export function requiresDiscovery(serviceId: string) {
  return DISCOVERY_SERVICE_IDS.has(serviceId);
}

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  bekliyor: "Ödeme bekliyor",
  odendi: "Ödendi (iyzico)",
  iade: "İade",
  kesif: "Keşif — teklif bekleniyor",
  basarisiz: "Ödeme başarısız",
};

/** Ana sayfa kampanya bannerı — tıklanınca yalnızca iyzico. */
export const BANNER_OFFERS = [
  {
    id: "1",
    tag: "EYLÜL KAMPANYASI",
    title: "Seramik Kaplama",
    highlight: "%20 İndirim",
    desc: "9H sertliğinde seramik kaplama ile aracınıza 3–5 yıl tam koruma. Sınırlı kontenjan!",
    cta: "Hemen Öde & Randevu",
    code: "ELIT20",
    serviceId: "boya-koruma",
    listPrice: 8500,
    price: 6800,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=600&fit=crop&auto=format",
    accent: "#C9A84C",
  },
  {
    id: "2",
    tag: "ÖZEL TEKLİF",
    title: "Premium İç-Dış Yıkama",
    highlight: "2 Al 1 Öde",
    desc: "El yıkama, buharlı temizlik ve deri bakımı dahil komple detailing paketi.",
    cta: "Paketi Satın Al",
    code: "YIKA21",
    serviceId: "ic-dis-yikama",
    listPrice: 1300,
    price: 650,
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1400&h=600&fit=crop&auto=format",
    accent: "#E8C96A",
  },
  {
    id: "3",
    tag: "YENİ HİZMET",
    title: "PPF Film Kaplama",
    highlight: "Ücretsiz Kenar Koruma",
    desc: "Paint Protection Film ile boyayı çizik ve taş izlerine karşı tam kalkan.",
    cta: "Öde & Randevu Al",
    code: "PPF-ELIT",
    serviceId: "boya-koruma",
    listPrice: 12000,
    price: 12000,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&h=600&fit=crop&auto=format",
    accent: "#C9A84C",
  },
] as const;

export const CAMPAIGNS = [
  {
    id: "cmp-seramik",
    title: "Eylül seramik haftası",
    blurb: "Boya koruma keşfinde %20 kupon. Teklif Taleplerim’e yazılır — arama yok.",
    couponCode: "ELIT20",
    ends: "30 Eylül 2026",
    audience: "Tüm müşteriler",
  },
  {
    id: "cmp-yika",
    title: "2 al 1 öde yıkama",
    blurb: "Filo ve aile: ikinci araç dış yıkaması hediye. Aynı gün slot.",
    couponCode: "YIKA21",
    ends: "15 Ekim 2026",
    audience: "Filo + bireysel",
  },
  {
    id: "cmp-lastik",
    title: "Lastikte balans hediye",
    blurb: "Mevsimsel değişimde balans ücreti yok. Ebatı nota yazın.",
    couponCode: "LASTIK0",
    ends: "1 Kasım 2026",
    audience: "Lastik randevusu",
  },
  {
    id: "cmp-dogum",
    title: "Doğum günü detailing",
    blurb: "İç detailing’de %15. Profilde tarih varsa 7 gün kala otomatik düşer.",
    couponCode: "DOGUM15",
    ends: "31 Aralık 2026",
    audience: "Kayıtlı müşteri",
  },
];
