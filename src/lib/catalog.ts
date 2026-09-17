import type { Accessory, Service } from "./types";

export const BRAND = {
  name: "Elit Otomotiv",
  tagline: "Aracınız Elit’te, değerinde ve güvende.",
  instagram: "https://www.instagram.com/elit_otomotiv/",
  instagramHandle: "@elit_otomotiv",
  hours: "Pazartesi–Cumartesi 08:30–20:00 · Pazar randevulu",
  city: "Ankara",
  note: "Bu uygulama @elit_otomotiv markası için hazırlanmış bir self-servis ve operasyon prototipidir; adres ve fiyatlar demo amaçlıdır.",
};

export const CATEGORY_LABEL: Record<Service["category"], string> = {
  yikama: "Oto yıkama",
  lastik: "Oto lastik",
  aksesuar: "Oto aksesuar",
  "yol-yardim": "Acil yol yardım",
  detailing: "Detailing",
  diger: "İlgili hizmetler",
};

export const SERVICES: Service[] = [
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
