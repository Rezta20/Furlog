import { defineStore } from 'pinia';
import type { IBooking, IBookingForm } from '../types/booking';
import { BookingStatus } from '../enums/bookingStatus';
import bookingsRaw from 'src/data/bookings.json';

// 型別守門：驗證是 enum 之一
function isBookingStatus(val: string): val is BookingStatus {
  return Object.values(BookingStatus).includes(val as BookingStatus);
}

export const useBookingStore = defineStore('booking', {
  state: () => {
    let formatted: IBooking[] = [];

    // 1️⃣ Check localStorage first
    const saved = localStorage.getItem('bookings');
    if (saved) {
      try {
        formatted = JSON.parse(saved);
        console.log('Initialized bookings from localStorage');
      } catch (e) {
        console.error('Failed to parse localStorage data:', e);
        formatted = [];
      }
    }

    // 2️⃣ Fallback to default JSON if no local data
    if (!formatted || formatted.length === 0) {
      formatted = bookingsRaw.map((item) => ({
        ...item,
        customerStatus: isBookingStatus(item.status.customerStatus)
          ? item.status.customerStatus
          : BookingStatus.PENDING,
        storeStatus: isBookingStatus(item.status.storeStatus)
          ? item.status.storeStatus
          : BookingStatus.PENDING,
      })) as IBooking[];
      console.log('Initialized bookings from raw data');
    }

    return {
      list: formatted,
      originList: formatted,
    };
  },
  getters: {
    // 篩選未來預約（這裡可視情境改篩 customerStatus 或 storeStatus）
    upcoming: (state) => state.list.filter((b) => new Date(b.date) >= new Date()),
  },
  actions: {
    // 新增預約
    add(booking: IBooking) {
      this.list.push(booking);
    },
    // 更新預約狀態
    updateBookingStatus(id: string, status: BookingStatus, role?: 'store' | 'customer') {
      const idx = this.list.findIndex((b) => b.bookingId === id);
      if (idx === -1 || !this.list[idx]) return;

      if (!role || role === 'store') {
        this.list[idx].status.storeStatus = status;
      }
      if (!role || role === 'customer') {
        this.list[idx].status.customerStatus = status;
      }

      // 🔥 Save to localStorage
      localStorage.setItem('bookings', JSON.stringify(this.list));
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

    fetchBookingDetail(id: string) {
      // 假資料篩選邏輯，實際上你可以改成 fetch 或 axios 請求
      const result = this.list.find((item) => item.bookingId === id);
      return result;
    },

    updateBookingDetail(id: string, booking: IBooking) {
      const idx = this.list.findIndex((b) => b.bookingId === id);
      if (idx !== -1) {
        this.list.splice(idx, 1, JSON.parse(JSON.stringify(booking)));
        // 🔥 Save to localStorage
        localStorage.setItem('bookings', JSON.stringify(this.list));
      }
    },
  },
});
