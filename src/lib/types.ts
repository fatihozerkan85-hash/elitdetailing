export type Role = "guest" | "customer" | "owner";

export type JobStatus = "giris-bekleniyor" | "kuyrukta" | "yikamada" | "kurulama" | "teslim" | "iptal";

export type RoadsideStatus =
  | "alindi"
  | "yonlendirildi"
  | "yolda"
  | "yerinde"
  | "tamamlandi"
  | "iptal";

export type AppointmentStatus = "bekliyor" | "onaylandi" | "tamamlandi" | "iptal";

export type OrderStatus = "talep" | "hazirlaniyor" | "hazir" | "teslim" | "iptal";

export type PaymentStatus = "bekliyor" | "odendi" | "iade" | "kesif" | "basarisiz";

export type PaymentKind = "randevu" | "aksesuar" | "kampanya" | "teklif" | "yol-yardim";

export type PaymentRecord = {
  id: string;
  kind: PaymentKind;
  refId: string;
  amount: number;
  status: PaymentStatus;
  provider: "iyzico" | "mock";
  providerPaymentId?: string;
  conversationId: string;
  title: string;
  customerName: string;
  phone: string;
  createdAt: string;
  paidAt?: string;
};

export type CartLine = {
  accessoryId: string;
  qty: number;
};

export type ServiceCategory =
  | "yikama"
  | "lastik"
  | "aksesuar"
  | "yol-yardim"
  | "detailing"
  | "diger";

export type Urgency = "normal" | "yuksek" | "kritik";

export type RequestKind = "randevu" | "yol-yardim" | "is" | "aksesuar";

export type ServiceSegment = {
  title: string;
  minutes: number;
};

export type Service = {
  id: string;
  category: ServiceCategory;
  name: string;
  short: string;
  description: string;
  durationMin: number;
  bufferMin: number;
  segments: ServiceSegment[];
  fromPrice: number;
  selfService: string[];
};

export type Accessory = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
};

export type Vehicle = {
  id: string;
  plate: string;
  label: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  passwordHash?: string;
  emailVerified?: boolean;
  resetToken?: string;
  resetTokenExpires?: string;
  /** Primary plate — synced from active vehicle */
  plate: string;
  /** Primary vehicle label — synced from active vehicle */
  vehicle: string;
  vehicles: Vehicle[];
  activeVehicleId?: string;
};

export type EmailOutboxItem = {
  id: string;
  to: string;
  subject: string;
  kind: string;
  text: string;
  at: string;
  status: "queued" | "sent" | "mock" | "failed";
};

export type Technician = {
  id: string;
  name: string;
  role: string;
  load: number;
  shift: string;
};

export type TimelineEvent = {
  at: string;
  status: string;
  note: string;
};

export type Job = {
  id: string;
  kind: "yikama" | "detailing" | "lastik";
  customerId: string;
  customerName: string;
  phone: string;
  plate: string;
  vehicle: string;
  serviceId: string;
  serviceName: string;
  notes: string;
  estimate: number;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  status: JobStatus;
  technicianId: string;
  appointmentId?: string;
  startedAt?: string;
  currentSegmentIndex: number;
  notifiedSegmentIndex: number;
  segments: ServiceSegment[];
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
};

export type Appointment = {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  plate: string;
  vehicle: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  amount: number;
  createdAt: string;
};

export type RoadsideCall = {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  plate: string;
  vehicle: string;
  location: string;
  lat?: number;
  lng?: number;
  accuracyM?: number;
  issue: string;
  urgency: Urgency;
  status: RoadsideStatus;
  technicianId?: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
};

export type AccessoryOrder = {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  accessoryId: string;
  accessoryName: string;
  qty: number;
  total: number;
  notes: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string;
};

export type InboxItem = {
  id: string;
  customerId: string;
  kind: RequestKind;
  refId: string;
  title: string;
  messages: { at: string; from: "sistem" | "musteri"; text: string; channel?: "whatsapp"; waUrl?: string }[];
  unread: boolean;
  createdAt: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  href: string;
  at: string;
  read: boolean;
  /** owner = panel only; customer = public feed; all = both */
  audience?: "owner" | "customer" | "all";
};

export type Session = {
  role: Role;
  customerId?: string;
  name: string;
};

export type CouponStatus = "aktif" | "kullanildi" | "doldu";

export type Coupon = {
  id: string;
  customerId: string;
  code: string;
  title: string;
  rule: string;
  expires: string;
  status: CouponStatus;
  discountPercent?: number;
  discountAmount?: number;
};

export type WhatsAppOutboxItem = {
  id: string;
  phone: string;
  text: string;
  url: string;
  jobId?: string;
  at: string;
  status: "queued" | "api" | "link";
};

export type AppState = {
  session: Session;
  customers: Customer[];
  technicians: Technician[];
  accessories: Accessory[];
  jobs: Job[];
  appointments: Appointment[];
  roadside: RoadsideCall[];
  accessoryOrders: AccessoryOrder[];
  payments: PaymentRecord[];
  cart: CartLine[];
  inbox: InboxItem[];
  notifications: Notification[];
  whatsappOutbox: WhatsAppOutboxItem[];
  emailOutbox: EmailOutboxItem[];
  coupons: Coupon[];
  campaignNotif: boolean;
  couponNotif: boolean;
  cms: import("./site-cms").SiteCms;
};
