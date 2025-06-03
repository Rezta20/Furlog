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
        <span>
          {{ props.row.pet.map((p: IPet) => p.name).join('、') }}
        </span>

        <q-btn
          v-if="props.row.pet.some((p: IPet) => p.isAttack)"
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

    <!-- 品種 -->
    <template #body-cell-petBreed="props">
      <q-td :props="props">
        {{
          isAllSame(props.row.pet.map((p: IPet) => p.petBreed)) ? props.row.pet[0].petBreed : '多種'
        }}
      </q-td>
    </template>

    <!-- 種類 -->
    <template #body-cell-petType="props">
      <q-td :props="props">
        <q-badge
          v-if="
            isAllSame(props.row.pet.map((p: IPet) => p.petType)) &&
            props.row.pet[0].petType === 'dog'
          "
          color="grey-6"
          label="狗狗"
        />
        <q-badge
          v-else-if="
            isAllSame(props.row.pet.map((p: IPet) => p.petType)) &&
            props.row.pet[0].petType === 'cat'
          "
          color="blue-grey-4"
          label="貓貓"
        />
        <q-badge
          v-else-if="
            isAllSame(props.row.pet.map((p: IPet) => p.petType)) &&
            props.row.pet[0].petType === '其他'
          "
          color="blue-grey-2"
          label="其他"
        />
        <q-badge v-else color="orange" label="多種" />
      </q-td>
    </template>

    <!-- 美容服務 -->
    <template #body-cell-service="props">
      <q-td :props="props">
        <span>{{ previewService(props.row.services) }}</span>
        <q-btn
          flat
          round
          dense
          :icon="props.row.services.length > 2 ? 'expand_more' : ''"
          size="sm"
          @click="showServiceDetail(props.row)"
        />
      </q-td>
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
const previewService = (services: IBookingService[]) => {
  const all = services.reduce((acc: string[], s) => {
    s.items.forEach((item) => acc.push(item.serviceName));
    return acc;
  }, []);

  const unique = [...new Set(all)];
  if (unique.length <= 2) return unique.join(', ');
  return `${unique.slice(0, 2).join(', ')} ⋯ 共 ${unique.length} 項`;
};

const showServiceDetail = (booking: IBooking) => {
  const all = booking.services
    .flatMap((s) => s.items.map((i) => i.serviceName))
    .filter((v, i, arr) => arr.indexOf(v) === i);

  $q.dialog({
    title: '服務項目清單',
    message: all.join('<br>'),
    html: true,
    ok: '關閉',
  });
};

// 攻擊性提示對話框
const onAlertAttackDialog = (pets: IPet[]) => {
  const aggressivePets = pets.filter((p) => p.isAttack);

  if (!aggressivePets.length) return;

  const message = aggressivePets
    .map((p) => {
      const note = p.attackNote?.trim() || '尚未填寫攻擊行為備註。';
      return `<b>${p.name}</b>：${note}`;
    })
    .join('<br><br>');

  $q.dialog({
    title: '具有攻擊行為的寵物',
    message: message,
    html: true, // 支援 <br> 與 <b>
    persistent: true,
    ok: {
      label: '知道了',
      color: 'negative',
    },
  });
};

function isAllSame<T>(arr: T[]): boolean {
  if (arr.length === 0) return true;
  return arr.every((item) => item === arr[0]);
}
</script>
