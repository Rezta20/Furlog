export interface IBooking {
  bookingId: string;
  petId: string;
  date: string; // 格式：YYYY-MM-DD
  time: string; // 格式：HH:mm
  petName: string;
  petType: string; // 例如：'狗'、'貓'
  petBreed: string; // 例如：'黃金獵犬'
  customerName: string; // 例如：'陳太太'
  customerPhone: string; // 例如：'0977-666-888'
  service: string; // 例如：'洗澡+剪毛'
  customerStatus: BookingStatus; // BookingStatus enum value
  storeStatus: BookingStatus; // BookingStatus enum value
  note: string;
  action: string; // 例如：'詳情'
}

type BookingStatus =
  | 'pending'
  | 'rejected'
  | 'confirmed'
  | 'in_service'
  | 'completed'
  | 'cancelled'
  | 'waiting'
  | 'cancelledByCustomer';

export interface IBookingForm {
  customerPhone: string;
  orderId: string;
  storeStatus: BookingStatus[];
  dateStart: string;
  dateEnd: string;
}
