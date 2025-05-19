<template>
  <q-page padding>
    <!-- table -->
    <q-card class="q-pa-md">
      <BookingTable :rows="bookingStore.list" :columns="columns" row-key="id" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBookingStore } from '../stores/useBookingStore';
import type { ITableColumns } from '../types/tables';
import BookingTable from '../components/BookingTable.vue';

const bookingStore = useBookingStore();

onMounted(() => {
  bookingStore.loadFromJson();
});

const columns: ITableColumns[] = [
  { name: 'date', label: '預約日期', field: 'date', align: 'left', sortable: true },
  { name: 'time', label: '時間', field: 'time', align: 'left', sortable: true },
  { name: 'storeStatus', label: '店家狀態', field: 'status', align: 'center' },
  { name: 'service', label: '服務項目', field: 'service', align: 'left' },
  { name: 'petType', label: '寵物類型', field: 'petType', align: 'left' },
  { name: 'petBreed', label: '品種', field: 'petBreed', align: 'left' },
  { name: 'note', label: '備註', field: 'note', align: 'left' },
  { name: 'petName', label: '寵物姓名', field: 'petName', align: 'left' },
  { name: 'customerName', label: '飼主姓名', field: 'customerName', align: 'left' },
  { name: 'customerPhone', label: '聯絡電話', field: 'customerPhone', align: 'left' },
  { name: 'customerStatus', label: '顧客狀態', field: 'status', align: 'center' },
  { name: 'action', label: '操作', field: 'action', align: 'center' },
];
</script>
