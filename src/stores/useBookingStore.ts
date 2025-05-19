import { defineStore } from 'pinia';
import type { IBooking } from '../types/booking';
import { BookingStatus } from '../enums/bookingStatus';
import bookingsRaw from 'src/data/bookings.json';

// 型別守門：驗證是 enum 之一
function isBookingStatus(val: string): val is BookingStatus {
  return Object.values(BookingStatus).includes(val as BookingStatus);
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    list: [] as IBooking[],
  }),
  getters: {
    // 篩選未來預約（這裡可視情境改篩 customerStatus 或 storeStatus）
    upcoming: (state) => state.list.filter((b) => new Date(b.date) >= new Date()),
  },
  actions: {
    // 初始化載入資料（雙欄位檢查）
    loadFromJson() {
      this.list = bookingsRaw.map((item) => ({
        ...item,
        customerStatus: isBookingStatus(item.customerStatus)
          ? item.customerStatus
          : BookingStatus.PENDING,
        storeStatus: isBookingStatus(item.storeStatus) ? item.storeStatus : BookingStatus.PENDING,
      })) as IBooking[];
    },
    // 新增預約
    add(booking: IBooking) {
      this.list.push(booking);
    },
    // 更新顧客狀態
    updateCustomerStatus(id: string, status: BookingStatus) {
      const idx = this.list.findIndex((b) => b.id === id);
      if (idx !== -1 && this.list[idx]) {
        this.list[idx].customerStatus = status;
      }
    },
    // 更新店家狀態
    updateStoreStatus(id: string, status: BookingStatus) {
      const idx = this.list.findIndex((b) => b.id === id);
      if (idx !== -1 && this.list[idx]) {
        this.list[idx].storeStatus = status;
      }
    },
    // 移除預約
    remove(id: string) {
      this.list = this.list.filter((b) => b.id !== id);
    },
  },
});
