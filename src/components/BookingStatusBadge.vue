<template>
  <q-badge :color="color" align="middle" :label="text" class="q-mr-xs" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BookingStatus } from '../enums/bookingStatus';
import { BookingStatusMap, BookingStatusColorMap } from '../constants/statusMap';

// props
const props = defineProps<{
  status: BookingStatus;
  mode?: 'customer' | 'store'; // 預設 customer
}>();

const color = computed(() => {
  return BookingStatusColorMap[props.status] || 'grey';
});

const text = computed(() => {
  return BookingStatusMap[props.status] || '未顯示';
});
</script>
