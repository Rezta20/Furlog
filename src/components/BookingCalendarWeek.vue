<template>
  <q-card>
    <div class="row justify-between items-center q-pa-sm">
      <div class="col-4 col-md-5 q-mr-lg">
        <q-btn color="primary" icon="chevron_left" @click="onPrev" flat />
        <q-btn color="primary" label="今天" @click="onToday" flat />
        <q-btn color="primary" icon="chevron_right" @click="onNext" flat />
        <q-btn color="primary" icon="event" flat>
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="selectedDate" minimal mask="YYYY-MM-DD" />
          </q-popup-proxy>
        </q-btn>
      </div>

      <div class="col text-h6">{{ calendarTitle }}</div>
    </div>
    <q-calendar-day
      ref="calendar"
      v-model="selectedDate"
      view="week"
      animated
      bordered
      transition-next="slide-left"
      transition-prev="slide-right"
      no-active-date
      :interval-start="8"
      :interval-count="10"
      :interval-height="28"
      short-weekday-label
      @click-date="onClickDate"
    >
      <!-- 每日上方小徽章 -->
      <template #head-day-event="{ scope: { timestamp } }">
        <div class="q-pa-xs flex justify-center wrap">
          <q-badge
            v-for="booking in getBookingsByDate(timestamp.date)"
            :key="booking.bookingId"
            :color="BookingStatusColorMap[booking.status.value]"
            :label="`${booking.time} ${booking.customer.name}`"
            class="q-mx-xs q-mb-xs cursor-pointer"
            @click="() => onClickBooking(booking)"
          />
        </div>
      </template>
    </q-calendar-day>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { today, QCalendarDay } from '@quasar/quasar-ui-qcalendar';
import { useBookingStore } from '../stores/useBookingStore';
import { BookingStatusColorMap } from '../constants/statusMap';
import type { IBooking } from '../types/booking';

const calendar = ref<QCalendarDay>();
const selectedDate = ref(today());
const bookingStore = useBookingStore();

const onToday = () => calendar.value?.moveToToday?.();
const onPrev = () => calendar.value?.prev?.();
const onNext = () => calendar.value?.next?.();

const calendarTitle = computed(() => {
  const date = new Date(selectedDate.value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year} 年 ${month} 月`;
});

const getBookingsByDate = (date: string): IBooking[] =>
  bookingStore.list.filter((b) => b.date === date);

const onClickBooking = (booking: IBooking) => {
  console.log('點擊預約：', booking);
};

const onClickDate = (data: string) => {
  console.log(data);
  // console.log('點擊日期：', data.scope.timestamp.date);
};
</script>
