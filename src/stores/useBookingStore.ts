import { defineStore } from 'pinia';
import type { IBooking, IBookingForm } from '../types/booking';
import { BookingStatus } from '../enums/bookingStatus';
import bookingsRaw from 'src/data/bookings.json';

// 型別守門：驗證是 enum 之一
function isBookingStatus(val: string): val is BookingStatus {
  return Object.values(BookingStatus).includes(val as BookingStatus);
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    originList: [] as IBooking[], // 新增，原始完整資料
    list: [] as IBooking[], // 目前顯示資料
  }),
  getters: {
    // 篩選未來預約（這裡可視情境改篩 customerStatus 或 storeStatus）
    upcoming: (state) => state.list.filter((b) => new Date(b.date) >= new Date()),
  },
  actions: {
    // 初始化載入資料（雙欄位檢查）
    loadFromJson() {
      const formatted = bookingsRaw.map((item) => ({
        ...item,
        customerStatus: isBookingStatus(item.status.customerStatus)
          ? item.status.customerStatus
          : BookingStatus.PENDING,
        storeStatus: isBookingStatus(item.status.storeStatus)
          ? item.status.storeStatus
          : BookingStatus.PENDING,
      })) as IBooking[];
      this.originList = formatted;
      this.list = formatted;
    },
    // 新增預約
    add(booking: IBooking) {
      this.list.push(booking);
    },
    // 更新顧客狀態
    updateCustomerStatus(id: string, status: BookingStatus) {
      const idx = this.list.findIndex((b) => b.bookingId === id);
      if (idx !== -1 && this.list[idx]) {
        this.list[idx].status.customerStatus = status;
      }
    },
    // 更新店家狀態
    updateStoreStatus(id: string, status: BookingStatus) {
      const idx = this.list.findIndex((b) => b.bookingId === id);
      if (idx !== -1 && this.list[idx]) {
        this.list[idx].status.storeStatus = status;
      }
    },
    // 移除預約
    remove(id: string) {
      this.list = this.list.filter((b) => b.bookingId !== id);
    },
    //篩選預約資料
    filterList(query: IBookingForm) {
      const start = query.dateStart;
      const end = query.dateEnd;

      console.log(query.storeStatus);

      this.list = this.originList.filter((item) => {
        if (query.storeStatus.length) {
          console.log(
            '查詢條件:',
            query.storeStatus,
            'item.storeStatus:',
            item.status.storeStatus,
            '比對結果:',
            query.storeStatus.includes(item.status.storeStatus),
          );
          if (!query.storeStatus.includes(item.status.storeStatus)) return false;
        }

        // 電話（模糊查詢）
        if (query.customerPhone && !item.customer.customerPhone.includes(query.customerPhone))
          return false;

        // 訂單編號（模糊查詢）
        if (query.orderId && !item.bookingId.includes(query.orderId)) return false;

        // 狀態（多選 AND 查詢）
        if (query.storeStatus.length && !query.storeStatus.includes(item.status.storeStatus))
          return false;

        // 日期區間/單日查詢
        if (start && end) {
          if (new Date(item.date) < new Date(start) || new Date(item.date) > new Date(end))
            return false;
        } else if (start && !end) {
          if (item.date !== start) return false;
        } else if (!start && end) {
          if (item.date !== end) return false;
        }
        // 其餘欄位也可在這裡補

        return true;
      });
    },
  },
});
