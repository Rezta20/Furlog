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

// 顧客看到的文字
export const CustomerBookingStatusText: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: '等待確認',
  [BookingStatus.WAITING]: '等待服務',
  [BookingStatus.CONFIRMED]: '已接單',
  [BookingStatus.IN_SERVICE]: '美容中',
  [BookingStatus.COMPLETED]: '已完成',
  [BookingStatus.CANCELLED]: '已取消',
  [BookingStatus.REJECTED]: '預約被拒絕',
  [BookingStatus.CANCELLED_BY_CUSTOMER]: '您已取消',
};

// 顧客看到的顏色（light-blue 提醒色 + 其它）
export const CustomerBookingStatusColor: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'cyan-6',
  [BookingStatus.WAITING]: 'light-blue-6',
  [BookingStatus.CONFIRMED]: 'indigo-6',
  [BookingStatus.IN_SERVICE]: 'indigo-6',
  [BookingStatus.COMPLETED]: 'green-6',
  [BookingStatus.CANCELLED]: 'red-5',
  [BookingStatus.REJECTED]: 'red-5',
  [BookingStatus.CANCELLED_BY_CUSTOMER]: 'red-5',
};
// 店家看到的文字
export const StoreBookingStatusText: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: '待接單',
  [BookingStatus.WAITING]: '已到店',
  [BookingStatus.CONFIRMED]: '已接單',
  [BookingStatus.IN_SERVICE]: '美容中',
  [BookingStatus.COMPLETED]: '已完成',
  [BookingStatus.CANCELLED]: '已取消',
  [BookingStatus.REJECTED]: '已拒絕',
  [BookingStatus.CANCELLED_BY_CUSTOMER]: '客取消',
};

// 店家看到的顏色
export const StoreBookingStatusColor: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'cyan-6',
  [BookingStatus.WAITING]: 'light-blue-6',
  [BookingStatus.CONFIRMED]: 'indigo-6',
  [BookingStatus.IN_SERVICE]: 'indigo-6',
  [BookingStatus.COMPLETED]: 'green-6',
  [BookingStatus.CANCELLED]: 'red-5',
  [BookingStatus.REJECTED]: 'red-5',
  [BookingStatus.CANCELLED_BY_CUSTOMER]: 'red-5',
};
