<template>
  <q-form>
    <q-page padding>
      <div class="flex justify-between q-mb-md">
        <div class="flex items-center q-gutter-sm">
          <q-breadcrumbs class="q-mb-xs text-h6 text-bold">
            <q-breadcrumbs-el label="預約管理" @click="$router.back" class="cursor-pointer" />
            <q-breadcrumbs-el :label="`訂單${bookingId}`" />
          </q-breadcrumbs>
          <div>
            <q-badge v-if="booking" :color="BookingStatusColorMap[booking.status.value]" dense>
              {{ BookingStatusMap[booking.status.value] }}
            </q-badge>
          </div>
        </div>

        <div v-if="booking" class="q-gutter-md">
          <q-btn
            v-if="booking?.status.value === 'created'"
            label="接單"
            type="submit"
            color="info"
            @click="onConfirmBooking"
          />
          <q-btn
            v-if="booking?.status.value === 'created'"
            label="拒絕"
            type="submit"
            color="negative"
            @click="onRejectedBooking"
          />
          <q-btn
            v-if="isToday(booking.date) && booking?.status.value === 'confirmed'"
            label="到店"
            type="submit"
            :color="BookingStatusColorMap[BookingStatus.ARRIVED]"
            @click="onArrivedForService"
          />
          <q-btn
            v-if="isToday(booking.date) && booking?.status.value === 'arrived'"
            label="美容去"
            type="submit"
            :color="BookingStatusColorMap[BookingStatus.IN_SERVICE]"
            @click="onServiceBooking"
          />
          <q-btn
            v-if="booking?.status.value === 'in_service'"
            label="完成"
            type="submit"
            :color="BookingStatusColorMap[BookingStatus.FINISHED]"
            @click="onFinishedBooking"
          />
          <q-btn
            v-if="readonly"
            label="編輯"
            type="submit"
            color="primary"
            @click="onEditBooking"
          />
          <q-btn
            v-if="!readonly"
            label="儲存"
            type="submit"
            color="primary"
            @click="onSaveBooking"
          />
          <q-btn
            v-if="
              booking?.status.value !== 'cancelled_by_customer' &&
              booking?.status.value !== 'created' &&
              booking?.status.value !== 'rejected' &&
              booking?.status.value !== 'finished'
            "
            label="取消"
            type="submit"
            color="secondary"
            outline
            @click="onCancelledBooking"
          />
        </div>
      </div>

      <q-tabs v-model="tab" class="bg-white text-primary" active-bg-color="indigo-1" align="left">
        <q-tab v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label" />
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="tab" class="q-pa-none bg-transparent">
        <q-tab-panel name="info" class="q-pa-none q-mb-xs">
          <InfoCard v-model:booking="booking" v-model:readonly="readonly" />
        </q-tab-panel>

        <q-tab-panel name="customer" class="q-pa-none q-mb-xs">
          <CustomerInfoCard v-model:booking="booking" v-model:readonly="readonly" />
        </q-tab-panel>

        <q-tab-panel name="pets" class="q-pa-none q-mb-xs">
          <PetInfoCard v-model:booking="booking" v-model:readonly="readonly" />
        </q-tab-panel>

        <q-tab-panel name="services" class="q-pa-none q-mb-xs">
          <ServicesInfoCard v-model:booking="booking" v-model:readonly="readonly" />
        </q-tab-panel>

        <q-tab-panel name="grooming" class="q-pa-none q-mb-xs">
          <div v-if="booking && petGroomingRecords.length > 0">
            <GroomingRecordCard
              v-for="(record, index) in petGroomingRecords"
              v-model:readonly="readonly"
              v-model:groomingRecord="petGroomingRecords[index]"
              :key="record.pet.id"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </q-form>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { useBookingStore } from 'src/stores/useBookingStore';
import { useGroomingRecordStore } from 'src/stores/useGroomingRecordStore';
import type { IBooking } from '../types/booking';
import { BookingStatus } from '../enums/bookingStatus';
import { BookingStatusMap, BookingStatusColorMap } from '../constants/statusMap';
import InfoCard from '../components/BookingList/InfoCard.vue';
import CustomerInfoCard from '../components/BookingList/CustomerInfoCard.vue';
import PetInfoCard from '../components/BookingList/PetInfoCard.vue';
import ServicesInfoCard from '../components/BookingList/ServicesInfoCard.vue';
import GroomingRecordCard from '../components/BookingList/GroomingRecordCard.vue';
import { getNowDateTimeString, isToday } from '../utils/datetime';

const $q = useQuasar();
const $route = useRoute();
const $bookingStore = useBookingStore();
const $groomingRecordStore = useGroomingRecordStore();

const readonly = ref<boolean>(true);
const booking = ref<IBooking>();
const bookingId = $route.params.id as string;
const tab = ref('info');
const tabs: { name: string; label: string }[] = [
  { name: 'info', label: '基本資訊' },
  { name: 'customer', label: '顧客資訊' },
  { name: 'pets', label: '寵物資訊' },
  { name: 'services', label: '服務項目' },
  { name: 'grooming', label: '美容紀錄' },
];

onMounted(() => {
  const detail = $bookingStore.fetchBookingDetail(bookingId);
  booking.value = detail;
});

const recordsOfBooking = computed(() =>
  $groomingRecordStore.list.filter((r) => r.bookingId === bookingId),
);

const petGroomingRecords = computed(() => {
  if (!booking.value) return [];
  return booking.value.pet.map((p) => ({
    pet: p,
    groomingRecord: recordsOfBooking.value.find((r) => r.petId === p.id) || {
      id: '',
      petId: p.id,
      bookingId: bookingId,
      groomerId: '',
      services: [],
      photos: [],
      mood: 'none',
      skinCondition: '',
      note: '',
      createdAt: getNowDateTimeString(),
      updatedAt: getNowDateTimeString(),
    },
  }));
});

function saveGroomingRecord() {
  const updatedPets: string[] = [];
  const createdPets: string[] = [];

  petGroomingRecords.value.forEach(({ pet, groomingRecord }) => {
    const isExisting =
      groomingRecord.id && recordsOfBooking.value.find((r) => r.id === groomingRecord.id);

    groomingRecord.updatedAt = getNowDateTimeString();

    if (isExisting) {
      $groomingRecordStore.updateRecord(groomingRecord);
      updatedPets.push(pet.name);
    } else {
      groomingRecord.createdAt = getNowDateTimeString();
      $groomingRecordStore.createRecord(groomingRecord);
      createdPets.push(pet.name);
    }
  });

  notifyGroomingRecords(updatedPets, createdPets);
}

function notifyGroomingRecords(updated: string[], created: string[]) {
  // 整理訊息
  const messages: string[] = [];
  if (updated.length) {
    messages.push(`已更新 ${updated.length} 筆：${updated.join('、')}`);
  }
  if (created.length) {
    messages.push(`已新增 ${created.length} 筆：${created.join('、')}`);
  }

  // 顯示合併通知
  const finalMessage = messages.length ? messages.join('；') : '沒有任何變更紀錄';

  $q.notify({
    type: messages.length ? 'positive' : 'info',
    message: finalMessage,
    timeout: 3000,
    position: 'top',
  });
}

function onConfirmBooking() {
  $bookingStore.updateBookingStatus(bookingId, BookingStatus.CONFIRMED);

  $q.notify({
    type: 'positive',
    message: '已確認預約',
    position: 'top',
    timeout: 2000,
  });
}

function onRejectedBooking() {
  $q.dialog({
    title: '拒絕預約',
    message: '確定要拒絕這個預約嗎？',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    $bookingStore.updateBookingStatus(bookingId, BookingStatus.REJECTED);

    $q.notify({
      type: 'negative',
      message: '已拒絕預約',
      position: 'top',
      timeout: 2000,
    });
  });
}

function onSaveBooking() {
  console.log(booking.value);

  $q.dialog({
    title: '確認儲存？',
    message: '你確定要儲存嗎？',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    try {
      $q.loading.show({ message: '儲存中...' });
      if (booking.value) {
        $bookingStore.updateBookingDetail(bookingId, booking.value);
        saveGroomingRecord();
        readonly.value = true;

        setTimeout(() => {
          $q.loading.hide();

          $q.notify({
            type: 'positive',
            message: '儲存成功',
            position: 'top',
            timeout: 2000,
          });
        }, 1500);
      } else {
        throw new Error('找不到 booking 資料');
      }
    } catch (error) {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: '儲存失敗：' + (error as Error).message,
      });
      console.error('儲存過程發生錯誤：', error);
    }
  });
}

function onCancelledBooking() {
  $q.dialog({
    title: '取消預約',
    message: '確定要取消這個預約嗎？',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    if (booking.value && booking.value.status) {
      booking.value.status.cancelReason = '寵物當下過度緊張不適合美容';
      $bookingStore.updateBookingStatus(bookingId, BookingStatus.CANCELLED_BY_STORE);
      readonly.value = true;
    }
  });
}

function onEditBooking() {
  readonly.value = false;
  $q.notify({
    type: 'info',
    message: '編輯模式已開啟',
    position: 'top',
    timeout: 2000,
  });
}

function onArrivedForService() {
  $bookingStore.updateBookingStatus(bookingId, BookingStatus.ARRIVED);

  $q.notify({
    type: 'info',
    message: '已確認到店',
    position: 'top',
  });
}

function onServiceBooking() {
  $bookingStore.updateBookingStatus(bookingId, BookingStatus.IN_SERVICE);

  $q.notify({
    type: 'info',
    message: '已確認開始服務',
    position: 'top',
  });
}

function onFinishedBooking() {
  $bookingStore.updateBookingStatus(bookingId, BookingStatus.FINISHED);

  $q.notify({
    type: 'positive',
    message: '已完成服務',
    position: 'top',
  });
}
</script>
