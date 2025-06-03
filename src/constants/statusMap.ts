import { BookingStatus } from '../enums/bookingStatus';

export const BookingStatusMap: Record<BookingStatus, string> = {
  [BookingStatus.CREATED]: '已建立',
  [BookingStatus.CONFIRMED]: '已確認',
  [BookingStatus.ARRIVED]: '已到店',
  [BookingStatus.IN_SERVICE]: '美容中',
  [BookingStatus.FINISHED]: '已完成',
  [BookingStatus.CANCELLED_BY_CUSTOMER]: '顧客取消',
  [BookingStatus.CANCELLED_BY_STORE]: '店家取消',
  [BookingStatus.NO_SHOW]: '未到店',
  [BookingStatus.REJECTED]: '已拒絕',
};

export const BookingStatusColorMap: Record<BookingStatus, string> = {
  [BookingStatus.CREATED]: 'cyan-6',
  [BookingStatus.CONFIRMED]: 'indigo-6',
  [BookingStatus.ARRIVED]: 'light-blue-6',
  [BookingStatus.IN_SERVICE]: 'indigo-6',
  [BookingStatus.FINISHED]: 'green-6',
  [BookingStatus.CANCELLED_BY_CUSTOMER]: 'red-5',
  [BookingStatus.CANCELLED_BY_STORE]: 'red-5',
  [BookingStatus.NO_SHOW]: 'red-5',
  [BookingStatus.REJECTED]: 'red-5',
};
