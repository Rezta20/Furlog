export enum BookingStatus {
  WAITING = 'waiting',
  IN_SERVICE = 'in_service',
  DONE = 'done',
}

export const BookingStatusText: Record<BookingStatus, string> = {
  [BookingStatus.WAITING]: '等待中',
  [BookingStatus.IN_SERVICE]: '美容中',
  [BookingStatus.DONE]: '已完成',
};

export const BookingStatusColor: Record<BookingStatus, string> = {
  [BookingStatus.WAITING]: 'orange',
  [BookingStatus.IN_SERVICE]: 'blue',
  [BookingStatus.DONE]: 'green',
};
