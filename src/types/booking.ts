export interface IBookingForm {
  customerPhone: string;
  orderId: string;
  storeStatus: BookingStatus[];
  dateStart: string;
  dateEnd: string;
}

// 狀態 enum
export enum BookingStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  CONFIRMED = 'confirmed',
  IN_SERVICE = 'in_service',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  WAITING = 'waiting',
  CANCELLED_BY_CUSTOMER = 'cancelledByCustomer',
}

// 服務項目
export interface IBookingService {
  serviceId: string;
  serviceName: string;
  price: number;
}

// 寵物資訊
export interface IPet {
  petId: string;
  petName: string;
  petType: string;
  petBreed: string;
  petGender: string;
  petAge: number;
  petWeight: number;
  petNote: string;
  healthReminder: string;
  isAttack: boolean;
  attackNote: string;
}

// 客戶資訊
export interface ICustomer {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNote: string;
}

// 狀態歷程
export interface IBookingHistory {
  timestamp: string; // 格式：YYYY-MM-DD HH:mm:ss
  action: string;
  by: string;
  note?: string;
}

// 訂單主體
export interface IBooking {
  bookingId: string;
  createdAt: string; // 格式：YYYY-MM-DD HH:mm:ss
  updatedAt: string; // 格式：YYYY-MM-DD HH:mm:ss
  source: string;
  pet: IPet;
  customer: ICustomer;
  date: string; // 格式：YYYY-MM-DD
  time: string; // 格式：HH:mm
  services: IBookingService[];
  discount: {
    type: string;
    amount: number;
  };
  totalPrice: number;
  finalPrice: number;
  payment: {
    method: string;
    status: string;
  };
  groomer: {
    groomerId: string;
    groomerName: string;
  };
  arriveTime: string; // 格式：YYYY-MM-DD HH:mm:ss
  finishTime: string | null; // 格式：YYYY-MM-DD HH:mm:ss
  status: {
    customerStatus: BookingStatus;
    storeStatus: BookingStatus;
    cancelReason: string;
    history: IBookingHistory[];
  };
  photoRecords: string[];
  nextBookingSuggestion: string; // 格式：YYYY-MM-DD
}
