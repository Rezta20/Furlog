import { defineStore } from 'pinia';
import bookingsRaw from 'src/data/bookings.json';
import { BookingStatus } from '../enums/bookingStatus';
import type { IBooking, IBookingSearch } from '../types/booking';
import { getNowDateTimeString } from '../utils/datetime';

// 型別守門：驗證是否為 enum 之一
function isBookingStatus(val: string): val is BookingStatus {
  return Object.values(BookingStatus).includes(val as BookingStatus);
}

export const useBookingStore = defineStore('booking', {
  state: () => {
    let formatted: IBooking[] = [];

    // 1️⃣ 讀取 localStorage 儲存的資料
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

    // 2️⃣ 如果沒 localStorage，讀 JSON 資料並格式化 enum
    if (!formatted || formatted.length === 0) {
      // 這裡要確保 enum 來源一致，並且 status 結構完全符合 IBooking
      formatted = bookingsRaw.map((item) => ({
        ...item,
        status: {
          value: isBookingStatus(item.status.value) ? item.status.value : BookingStatus.CREATED,
          cancelReason: item.status.cancelReason,
          history: item.status.history,
        },
      })) as unknown as IBooking[];

      localStorage.setItem('bookings', JSON.stringify(formatted));
      console.log('Initialized bookings from raw data');
    }

    return {
      list: formatted,
      originList: formatted,
    };
  },

  getters: {
    upcoming: (state) => state.list.filter((b) => new Date(b.date) >= new Date()),
  },

  actions: {
    add(booking: IBooking) {
      this.list.push(booking);
      localStorage.setItem('bookings', JSON.stringify(this.list));
    },

    updateBookingStatus(id: string, status: BookingStatus) {
      const target = this.list.find((b) => b.bookingId === id);
      if (!target) return;
      target.status.value = status;
      target.status.history.push({
        timestamp: getNowDateTimeString(),
        action: status,
        by: 'store',
      });

      localStorage.setItem('bookings', JSON.stringify(this.list));
    },

    remove(id: string) {
      this.list = this.list.filter((b) => b.bookingId !== id);
      localStorage.setItem('bookings', JSON.stringify(this.list));
    },

    fetchBookingDetail(id: string) {
      return this.list.find((item) => item.bookingId === id);
    },

    updateBookingDetail(id: string, booking: IBooking) {
      const idx = this.list.findIndex((b) => b.bookingId === id);
      if (idx !== -1) {
        this.list.splice(idx, 1, JSON.parse(JSON.stringify(booking)));
        localStorage.setItem('bookings', JSON.stringify(this.list));
      }
    },

    filterList(query: IBookingSearch) {
      console.log(query);
      const phone = query.customerPhone?.trim() || '';
      const orderId = query.orderId?.trim() || '';
      const statusList = query.status;
      const start = query.dateStart;
      const end = query.dateEnd;

      this.list = this.originList.filter((item) => {
        console.log(this.originList);
        // 電話模糊查詢
        if (phone && !item.customer.phone.includes(phone)) return false;

        // 訂單編號模糊查詢
        if (orderId && !item.bookingId.includes(orderId)) return false;

        // 狀態（多選 OR 查詢）

        if (statusList.length && !statusList.includes(item.status.value)) return false;

        // 日期區間（含開始與結束當日）
        if (start && end) {
          const itemDate = new Date(item.date).getTime();
          const startDate = new Date(start).getTime();
          const endDate = new Date(end).getTime();
          if (itemDate < startDate || itemDate > endDate) return false;
        }

        return true;
      });

      // 若完全沒填寫查詢條件，就回復原始列表
      if (!phone && !orderId && !statusList.length && !start && !end) {
        this.list = this.originList;
      }
    },
  },
});
