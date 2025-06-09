<!-- eslint-disable @typescript-eslint/no-floating-promises -->
<template>
  <q-page padding>
    <div class="flex justify-between">
      <q-breadcrumbs class="q-mb-xs text-h6 text-bold">
        <q-breadcrumbs-el label="預約管理" />
      </q-breadcrumbs>

      <q-btn-toggle
        v-model="viewMode"
        toggle-color="primary"
        color="secondary"
        class="q-mb-sm"
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
      <BookingList />
    </div>

    <!-- 月檢視模式 -->
    <div v-if="viewMode === 'month'">
      <BookingCalendarMonth />
    </div>

    <!-- 週檢視模式 -->
    <div v-if="viewMode === 'week'">
      <BookingCalendarWeek />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
// import { useBookingStore } from '../stores/useBookingStore';
import BookingList from '../components/BookingList.vue';
import BookingCalendarMonth from '../components/BookingCalendarMonth.vue';
import BookingCalendarWeek from '../components/BookingCalendarWeek.vue';
import { useRoute, useRouter } from 'vue-router';

// const bookingStore = useBookingStore();
const viewMode = ref<'list' | 'month' | 'week'>('list');
const route = useRoute();
const router = useRouter();

onMounted(() => {
  if (!route.query.view) {
    // 如果沒有指定 view，預設為 'list'
    void router.replace({ query: { ...route.query, view: 'list' } });
    return;
  }

  const queryView = route.query.view as string;
  if (['list', 'month', 'week'].includes(queryView)) {
    viewMode.value = queryView as 'list' | 'month' | 'week';
  }
});

// 當 viewMode 改變時，更新網址
watch(viewMode, (newView) => {
  void router.replace({ query: { ...route.query, view: newView } });
});
</script>
