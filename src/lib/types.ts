export type Role = "guest" | "customer" | "owner";

export type JobStatus = "kuyrukta" | "yikamada" | "kurulama" | "teslim" | "iptal";

export type RoadsideStatus =
  | "alindi"
  | "yonlendirildi"
  | "yolda"
  | "yerinde"
  | "tamamlandi"
  | "iptal";

export type AppointmentStatus = "bekliyor" | "onaylandi" | "tamamlandi" | "iptal";

export type OrderStatus = "talep" | "hazirlaniyor" | "hazir" | "teslim" | "iptal";

export type ServiceCategory =
  | "yikama"
  | "lastik"
  | "aksesuar"
  | "yol-yardim"
  | "detailing"
  | "diger";

export type Urgency = "normal" | "yuksek" | "kritik";

export type RequestKind = "randevu" | "yol-yardim" | "is" | "aksesuar";

export type Service = {
  id: string;
  category: ServiceCategory;
  name: string;
  short: string;
  description: string;
  durationMin: number;
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

export type Customer = {
  id: string;
  name: string;
  phone: string;
  plate: string;
  vehicle: string;
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
  status: JobStatus;
  technicianId: string;
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
  issue: string;
  urgency: Urgency;
  status: RoadsideStatus;
  technicianId?: string;
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
  createdAt: string;
};

export type InboxItem = {
  id: string;
  customerId: string;
  kind: RequestKind;
  refId: string;
  title: string;
  messages: { at: string; from: "sistem" | "musteri"; text: string }[];
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
};

export type AppState = {
  session: Session;
  customers: Customer[];
  technicians: Technician[];
  jobs: Job[];
  appointments: Appointment[];
  roadside: RoadsideCall[];
  accessoryOrders: AccessoryOrder[];
  inbox: InboxItem[];
  notifications: Notification[];
  coupons: Coupon[];
  campaignNotif: boolean;
  couponNotif: boolean;
};
