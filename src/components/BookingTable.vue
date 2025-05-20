<template>
  <q-table :rows="rows" :columns="columns" row-key="id" flat :pagination="pagination">
    <template #body-cell-service="props">
      <q-td :props="props">{{ serviceNames(props.row.services) }} </q-td>
    </template>
    <template #body-cell-petType="props">
      <q-td :props="props">
        <q-badge v-if="props.row.pet.petType === 'dog'" color="grey-6" label="狗狗" />
        <q-badge v-else-if="props.row.pet.petType === 'cat'" color="blue-grey-4" label="貓貓" />
        <q-badge v-else color="blue-grey-2" label="其他" />
      </q-td>
    </template>
    <template #body-cell-petBreed="props">
      <q-td :props="props">{{ props.row.pet.petBreed }} </q-td>
    </template>
    <template #body-cell-note="props">
      <q-td :props="props">{{ props.row.pet.petNote }} </q-td>
    </template>
    <template #body-cell-petName="props">
      <q-td :props="props"
        >{{ props.row.pet.petName }}
        <q-btn
          v-if="props.row.pet.isAttack"
          icon="warning"
          dense
          color="negative"
          size="sm"
          flat
          class="q-mb-xs"
          @click="onAlertAttackDialog(props.row.pet)"
        >
          <q-tooltip class="bg-negative">具有攻擊性</q-tooltip>
        </q-btn>
      </q-td>
    </template>
    <template #body-cell-customerName="props">
      <q-td :props="props">{{ props.row.customer.customerName }} </q-td>
    </template>
    <template #body-cell-customerPhone="props">
      <q-td :props="props">{{ props.row.customer.customerPhone }} </q-td>
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
        <q-btn
          color="primary"
          label="詳情"
          @click="$router.push(`/booking-list/${props.row.bookingId}`)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import BookingStatusBadge from './BookingStatusBadge.vue';
import type { IBooking, IBookingService } from '../types/booking';
import type { ITableColumns } from '../types/tables';

defineProps<{
  rows: IBooking[];
  columns: ITableColumns[];
  rowKey: string;
}>();

const $q = useQuasar();
const pagination = { rowsPerPage: 10 };

const serviceNames = (services: IBookingService[]) => {
  return services.map((s) => s.serviceName).join(', ');
};

const onAlertAttackDialog = (pet: IBooking['pet']) => {
  $q.dialog({
    title: `${pet.petName} 具有攻擊性`,
    message: `  ${pet.attackNote}`,
    persistent: true,
    ok: {
      label: '知道了',
      color: 'negative',
    },
  });
};
</script>
