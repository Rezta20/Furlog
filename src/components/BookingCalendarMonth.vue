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

    <q-calendar-month
      ref="calendar"
      v-model="selectedDate"
      :weekdays="[0, 1, 2, 3, 4, 5, 6]"
      locale="zh-TW"
      day-height="0"
      day-min-height="110"
      transition-prev="slide-right"
      transition-next="slide-left"
      short-weekday-label
      show-month-label
      month-label-size="1.2rem"
      animated
      bordered
      hoverable
      date-align="left"
      @click-date="onClickDate"
    >
      <!-- 渲染每日事件 -->
      <template #day="{ scope }">
        <div class="q-gutter-xs">
          <q-badge
            v-for="item in getBookingsByDate(scope.timestamp.date)"
            :key="item.bookingId"
            :color="BookingStatusColorMap[item.status.value as keyof typeof BookingStatusColorMap]"
            :label="getBookingLabel(item)"
            class="q-mb-xs cursor-pointer full-width text-wrap"
            @click="() => onClickBooking(item)"
          />
        </div>
      </template>
    </q-calendar-month>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar';
import { useBookingStore } from '../stores/useBookingStore';
import type { IBooking } from '../types/booking';
import { BookingStatusColorMap } from '../constants/statusMap';

const bookingStore = useBookingStore();

const calendarTitle = computed(() => {
  const date = new Date(selectedDate.value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year} 年 ${month} 月`;
});

const calendar = ref<QCalendarMonth>();
const selectedDate = ref(today());

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday();
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev();
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next();
  }
}

// 根據日期篩選出預約資料
const getBookingsByDate = (date: string): IBooking[] => {
  return bookingStore.list.filter((b) => b.date === date);
};

// 點擊某一天
const onClickDate = (data: { scope: { timestamp: { date: string } } }) => {
  console.log('Clicked date:', data.scope.timestamp.date);
  // router.push({ name: 'booking-create', query: { date } });
};

// 點擊預約
const onClickBooking = (booking: IBooking) => {
  console.log('Clicked booking:', booking);
};

function getBookingLabel(booking: IBooking): string {
  const time = booking.time;
  const owner = booking.customer.name;
  const pets = booking.pet;

  const petLabels = pets.map((p) => `${p.name}（${p.petBreed}）`);

  let petDisplay = '';
  if (petLabels.length === 1) {
    petDisplay = petLabels[0] || '';
  } else if (petLabels.length === 2) {
    petDisplay = `${petLabels[0]}、${petLabels[1]}`;
  } else {
    petDisplay = `${petLabels.slice(0, 2).join('、')}⋯共 ${petLabels.length} 隻`;
  }

  return `${time} ${owner} - ${petDisplay}`;
}
</script>
