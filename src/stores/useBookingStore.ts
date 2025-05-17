import { defineStore } from 'pinia';
import bookings from 'src/data/bookings.json';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    list: bookings as Array<{
      id: string;
      petId: string;
      date: string;
      time: string;
      service: string;
      status: string;
      note?: string;
    }>,
  }),
  getters: {
    upcoming: (state) => state.list.filter((b) => new Date(b.date) >= new Date()),
  },
  actions: {
    add(booking: {
      id: string;
      petId: string;
      date: string;
      time: string;
      service: string;
      status: string;
      note?: string;
    }) {
      this.list.push(booking);
    },
  },
});
