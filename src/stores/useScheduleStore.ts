import { defineStore } from 'pinia';
import schedule from 'src/data/storeSchedule.json';

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    config: schedule as {
      workingDays: string[];
      openHour: string;
      closeHour: string;
      maxBookingsPerDay: number;
    },
  }),
  getters: {
    isOpen: (state) => (day: string) => state.config.workingDays.includes(day),
  },
});
