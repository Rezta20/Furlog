<template>
  <q-table :rows="rows" :columns="columns" row-key="id" flat :pagination="pagination">
    <template #body-cell-petType="props">
      <q-td :props="props">
        <q-badge v-if="props.row.petType === 'dog'" color="grey-6" label="狗狗" />
        <q-badge v-else-if="props.row.petType === 'cat'" color="blue-grey-4" label="貓貓" />
        <q-badge v-else color="blue-grey-2" label="其他" />
      </q-td>
    </template>
    <template #body-cell-customerStatus="props">
      <q-td :props="props">
        <BookingStatusBadge :status="props.row.customerStatus" mode="customer" outline rounded />
      </q-td>
    </template>
    <template #body-cell-storeStatus="props">
      <q-td :props="props">
        <BookingStatusBadge :status="props.row.storeStatus" mode="store" />
      </q-td>
    </template>
    <template #body-cell-action="props">
      <q-td :props="props">
        <q-btn color="primary" label="詳情" @click="console.log(props.row.petName)" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
import BookingStatusBadge from './BookingStatusBadge.vue';
import type { IBooking } from '../types/booking';
import type { ITableColumns } from '../types/tables';

defineProps<{
  rows: IBooking[];
  columns: ITableColumns[];
  rowKey: string;
}>();

const pagination = { rowsPerPage: 10 };
</script>
