<template>
  <q-page padding>
    <q-table :rows="bookings" :columns="columns" row-key="id">
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.row.status === 'confirmed' ? 'primary' : 'grey'">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import bookingsRaw from '../data/bookings.json';
const bookings = ref(bookingsRaw);

interface columns {
  name: string;
  label: string;
  field: string;
  align: 'left' | 'center' | 'right';
}

const columns: columns[] = [
  { name: 'date', label: '日期', field: 'date', align: 'left' },
  { name: 'time', label: '時間', field: 'time', align: 'left' },
  { name: 'petId', label: '寵物ID', field: 'petId', align: 'left' },
  { name: 'service', label: '服務', field: 'service', align: 'left' },
  { name: 'status', label: '狀態', field: 'status', align: 'left' },
  { name: 'note', label: '備註', field: 'note', align: 'left' },
];
</script>
