<template>
  <q-badge :color="color" align="middle">
    {{ text }}
  </q-badge>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BookingStatus } from '../enums/bookingStatus';
import { BookingStatusText, BookingStatusColor } from '../enums/bookingStatus';

const props = defineProps<{
  status: BookingStatus;
}>();

const color = computed(() => BookingStatusColor[props.status] || 'grey');
const text = computed(() => BookingStatusText[props.status] || '未知狀態');
</script>
