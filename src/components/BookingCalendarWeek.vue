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
      view="day"
      max-days="5"
      animated
      bordered
      transition-next="slide-left"
      transition-prev="slide-right"
      no-active-date
      :interval-start="8"
      :interval-count="14"
      :interval-height="45"
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
            class="q-mx-xs q-mb-xs cursor-pointer"
          />
          <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="q-pa-sm">
            <div class="text-left">
              <div v-for="booking in getBookingsByDate(timestamp.date)" :key="booking.bookingId">
                {{ booking.time }} - {{ booking.customer.name }} ({{
                  booking.pet.map((p) => p.name).join(', ')
                }})
              </div>
            </div>
          </q-popup-proxy>
        </div>
      </template>

      <!-- 每日時間區塊內的預約 -->
      <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
        <template
          v-for="(booking, index) in getBookingsByDate(timestamp.date)"
          :key="booking.bookingId"
        >
          <q-badge
            v-if="booking.time !== undefined"
            :style="
              badgeStyles(
                booking,
                'body',
                index,
                getBookingsByDate(timestamp.date).length,
                timeStartPos,
                timeDurationHeight,
              )
            "
            class="q-mx-xs q-mb-xs cursor-pointer text-wrap"
            :key="booking.bookingId"
            :color="BookingStatusColorMap[booking.status.value]"
            @click="() => onClickBooking(booking)"
          >
            <div class="text-body2 text-wrap">
              {{ booking.time }} <br />
              {{ booking.customer.name }} - {{ booking.pet.map((p) => p.name).join(', ') }}
            </div>

            <q-tooltip>{{ booking }}</q-tooltip>
          </q-badge>
        </template>
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

function badgeStyles(
  event: IBooking,
  type: 'body' | 'header',
  index: number,
  total: number,
  timeStartPos?: (time: string) => number,
  timeDurationHeight?: (duration: number) => number,
): Record<string, string> {
  const style: Record<string, string> = {
    position: 'absolute',

    fontSize: '14px',
    zIndex: '1',
  };

  if (type === 'body' && timeStartPos && timeDurationHeight && event.time && event.duration) {
    style.top = `${timeStartPos(event.time)}px`;
    style.height = `${timeDurationHeight(event.duration)}px`;
  }

  const gap = 2; // px
  const widthPercent = 100 / total;
  style.width = `calc(${widthPercent}% - ${gap}px)`;
  style.left = `calc(${index * widthPercent}% + ${gap / 2}px)`;

  return style;
}
</script>
