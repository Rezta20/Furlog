<template>
  <q-page padding>
    <q-input v-model="selectedDate" type="date" label="選擇日期" />

    <q-btn label="送出預約" @click="doBooking" color="primary" class="q-mt-md" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

// 假資料，bookings 5 筆都是 2025-05-20
const bookings = ref([
  { id: 'bk_001', petId: 'pet_001', date: '2025-05-20', status: 'confirmed' },
  { id: 'bk_002', petId: 'pet_002', date: '2025-05-20', status: 'confirmed' },
  { id: 'bk_003', petId: 'pet_003', date: '2025-05-20', status: 'confirmed' },
  { id: 'bk_004', petId: 'pet_004', date: '2025-05-20', status: 'confirmed' },
  { id: 'bk_005', petId: 'pet_005', date: '2025-05-20', status: 'confirmed' },
]);
const maxBookingsPerDay = 5;
const selectedDate = ref('2025-05-20'); // 預設選滿額日
const $q = useQuasar();

function doBooking() {
  // 判斷今日預約數是否已滿
  const count = bookings.value.filter(
    (b) => b.date === selectedDate.value && b.status === 'confirmed',
  ).length;

  if (count >= maxBookingsPerDay) {
    $q.dialog({
      title: '預約額滿',
      message: '此日預約已達上限，請選擇其他日期！',
      persistent: true,
    });
    return;
  }
  // 如果沒滿，這裡才做真的送出
  alert('預約成功！');
}
</script>
