<template>
  <q-badge :color="color" align="middle" :label="text" class="q-mr-xs" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BookingStatus } from '../enums/bookingStatus';
import {
  CustomerBookingStatusText,
  CustomerBookingStatusColor,
  StoreBookingStatusText,
  StoreBookingStatusColor,
} from '../enums/bookingStatus';

// props
const props = defineProps<{
  status: BookingStatus;
  mode?: 'customer' | 'store'; // 預設 customer
}>();

const color = computed(() => {
  if (props.mode === 'store') {
    return StoreBookingStatusColor[props.status] || 'grey';
  }
  return CustomerBookingStatusColor[props.status] || 'grey';
});

const text = computed(() => {
  if (props.mode === 'store') {
    return StoreBookingStatusText[props.status] || '';
  }
  return CustomerBookingStatusText[props.status] || '';
});
</script>
