<template>
  <q-page padding>
    <div class="q-gutter-md">
      <p class="text-bold text-h5">預約清單</p>
      <!-- search -->
      <q-card class="q-pa-md">
        <BookingSearch @search="onSearch" />
      </q-card>

      <!-- table -->
      <q-card class="q-pa-md">
        <BookingTable :rows="bookingStore.list" :columns="columns" row-key="id" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useBookingStore } from '../stores/useBookingStore';
import type { ITableColumns } from '../types/tables';
import type { IBookingForm } from '../types/booking';
import BookingTable from '../components/BookingTable.vue';
import BookingSearch from '../components/BookingSearch.vue';

const bookingStore = useBookingStore();

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
  { name: 'bookingId', label: '訂單編號', field: 'bookingId', align: 'left' },
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'customerStatus', label: '顧客狀態', field: 'status', align: 'center' },
];

function onSearch(form: IBookingForm) {
  bookingStore.filterList(form);
}
</script>
