<template>
  <q-table :rows="rows" :columns="columns" row-key="id" flat :pagination="pagination">
    <template #body-cell-status="props">
      <q-td :props="props">
        <BookingStatusBadge :status="props.row.status" />
      </q-td>
    </template>
    <template #body-cell-action="props">
      <q-td :props="props">
        <q-btn dense flat color="primary" label="切換狀態" @click="onToggleStatus(props.row)" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BookingStatusBadge from './BookingStatusBadge.vue';
import { BookingStatus } from '../enums/bookingStatus';

interface Booking {
  id: number;
  customer: string;
  pet: string;
  time: string;
  status: BookingStatus;
}

interface statusColumns {
  name: string;
  label: string;
  field: string;
  align: 'left' | 'center' | 'right';
}

const rows = ref<Booking[]>([
  { id: 1, customer: '小明', pet: '毛球', time: '14:00', status: BookingStatus.WAITING },
  { id: 2, customer: '小美', pet: '球球', time: '15:00', status: BookingStatus.IN_SERVICE },
  { id: 3, customer: '小華', pet: '豆豆', time: '16:00', status: BookingStatus.DONE },
]);

const columns: statusColumns[] = [
  { name: 'customer', label: '顧客姓名', field: 'customer', align: 'left' },
  { name: 'pet', label: '寵物名稱', field: 'pet', align: 'left' },
  { name: 'time', label: '預約時間', field: 'time', align: 'left' },
  { name: 'status', label: '狀態', field: 'status', align: 'center' },
  { name: 'action', label: '操作', field: 'action', align: 'center' },
];

const pagination = { rowsPerPage: 10 };

// 狀態切換邏輯
// const statusOrder = [BookingStatus.WAITING, BookingStatus.IN_SERVICE, BookingStatus.DONE];

function onToggleStatus(row: Booking) {
  if (row.status === BookingStatus.WAITING) {
    row.status = BookingStatus.IN_SERVICE;
  } else if (row.status === BookingStatus.IN_SERVICE) {
    row.status = BookingStatus.DONE;
  } else {
    row.status = BookingStatus.WAITING;
  }
}
</script>
