import type { IPet } from './pet';
import type { ICustomer } from './customer';
import type { BookingStatus } from '../enums/bookingStatus';

export interface IBookingSearch {
  customerPhone: string;
  orderId: string;
  status: BookingStatus[];
  dateStart: string; // yyyy-MM-dd
  dateEnd: string; // yyyy-MM-dd
}

export interface IBookingService {
  serviceId: string;
  serviceName: string;
  price: number;
}

export interface IBookingHistory {
  timestamp: string;
  action: BookingStatus;
  by: 'customer' | 'store';
  note?: string; // 可選的操作備註
}
export interface IBooking {
  bookingId: string;
  createdAt: string;
  updatedAt: string;
  source: '線上' | '電話' | '現場';

  customer: ICustomer;

  pet: IPet[];
  date: string; // yyyy-MM-dd
  time: string; // HH:mm

  services: IBookingService[];
  discount?: {
    type: string;
    amount: number;
  };

  totalPrice: number;
  finalPrice: number;

  payment: {
    method: '現金' | '刷卡' | 'Line Pay' | '其他';
    status: 'paid' | 'unpaid';
  };

  groomer: {
    groomerId: string;
    groomerName: string;
  };

  arriveTime?: string;
  finishTime?: string;

  status: {
    value: BookingStatus;
    cancelReason?: string;
    history: IBookingHistory[];
  };

  photoRecords: string[]; // 照片 URL 陣列
  nextBookingSuggestion?: string;
  note?: string;
}
