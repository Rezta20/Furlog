export enum BookingStatus {
  CREATED = 'created', // 已建立（尚未確認）
  CONFIRMED = 'confirmed', // 店家已確認
  ARRIVED = 'arrived', // 顧客到店
  IN_SERVICE = 'in_service', // 美容進行中
  FINISHED = 'finished', // 完成
  CANCELLED_BY_CUSTOMER = 'cancelled_by_customer', // 顧客取消
  CANCELLED_BY_STORE = 'cancelled_by_store', // 店家取消
  NO_SHOW = 'no_show', // 顧客未出現
  REJECTED = 'rejected', // 預約被拒絕
}
