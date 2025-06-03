<template>
  <q-table :rows="rows" :columns="columns" row-key="bookingId" flat :pagination="pagination">
    <!-- 顧客姓名 -->
    <template #body-cell-customerName="props">
      <q-td :props="props">{{ props.row.customer.name }}</q-td>
    </template>

    <!-- 顧客電話 -->
    <template #body-cell-customerPhone="props">
      <q-td :props="props">{{ props.row.customer.phone }}</q-td>
    </template>

    <!-- 寵物名字 + 攻擊提示 -->
    <template #body-cell-petName="props">
      <q-td :props="props">
        {{ props.row.pet.petName }}
        <q-btn
          v-if="props.row.pet.isAttack"
          icon="warning"
          dense
          color="negative"
          size="sm"
          flat
          class="q-ml-xs"
          @click="onAlertAttackDialog(props.row.pet)"
        >
          <q-tooltip class="bg-negative">具有攻擊性</q-tooltip>
        </q-btn>
      </q-td>
    </template>

    <!-- 寵物品種 -->
    <template #body-cell-petBreed="props">
      <q-td :props="props">{{ props.row.pet.petBreed }}</q-td>
    </template>

    <!-- 寵物類型 -->
    <template #body-cell-petType="props">
      <q-td :props="props">
        <q-badge v-if="props.row.pet.petType === 'dog'" color="grey-6" label="狗狗" />
        <q-badge v-else-if="props.row.pet.petType === 'cat'" color="blue-grey-4" label="貓貓" />
        <q-badge v-else color="blue-grey-2" label="其他" />
      </q-td>
    </template>

    <!-- 美容服務 -->
    <template #body-cell-service="props">
      <q-td :props="props">{{ serviceNames(props.row.services) }}</q-td>
    </template>

    <!-- 狀態（顧客） -->
    <template #body-cell-status="props">
      <q-td :props="props">
        <BookingStatusBadge :status="props.row.status.value" outline rounded />
      </q-td>
    </template>
    <!-- 操作 -->
    <template #body-cell-action="props">
      <q-td :props="props">
        <q-btn
          flat
          icon="description"
          color="primary"
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
import type { IPet } from '../types/pet';

defineProps<{
  rows: IBooking[];
  columns: ITableColumns[];
  rowKey: string;
}>();

const $q = useQuasar();
const pagination = { rowsPerPage: 10 };

// 美容項目列印
const serviceNames = (services: IBookingService[]) => {
  return services.map((s) => s.serviceName).join(', ');
};

// 攻擊性提示對話框
const onAlertAttackDialog = (pet: IPet) => {
  $q.dialog({
    title: `${pet.name} 具有攻擊性`,
    message: pet.attackNote || '未填寫備註',
    persistent: true,
    ok: {
      label: '知道了',
      color: 'negative',
    },
  });
};
</script>
