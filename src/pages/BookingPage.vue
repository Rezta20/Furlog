<template>
  <q-page padding>
    <div class="row items-center justify-between">
      <p class="text-bold text-h6">預約管理</p>
      <q-btn-toggle
        v-model="viewMode"
        toggle-color="primary"
        color="secondary"
        size="1rem"
        :options="[
          { label: '清單', value: 'list' },
          { label: '月份', value: 'month' },
          { label: '週期', value: 'week' },
        ]"
        unelevated
        dense
      />
    </div>

    <!-- 清單模式顯示 -->
    <div v-if="viewMode === 'list'">
      <BookingListPage />
    </div>

    <!-- 月檢視模式 -->
    <div v-if="viewMode === 'month'">
      <BookingCalendarMonth />
    </div>

    <!-- 週檢視模式 -->
    <q-card v-if="viewMode === 'week'">
      <BookingCalendarWeek />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { useBookingStore } from '../stores/useBookingStore';
import BookingListPage from './BookingListPage.vue';
import BookingCalendarMonth from '../components/BookingCalendarMonth.vue';
import BookingCalendarWeek from '../components/BookingCalendarWeek.vue';

// const bookingStore = useBookingStore();
const viewMode = ref<'list' | 'month' | 'week'>('list');
</script>
