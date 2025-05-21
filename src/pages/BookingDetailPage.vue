<template>
  <q-page padding>
    <q-card class="q-pa-lg q-mx-auto">
      <q-card-section class="row">
        <div class="col-8">
          <div class="text-h6">訂單詳情</div>
        </div>
        <div v-if="booking" class="col-4 row q-gutter-md justify-end">
          <q-btn
            v-if="booking?.status.storeStatus === 'pending'"
            label="接單"
            type="submit"
            color="info"
            @click="onConfirmBooking"
          />
          <q-btn
            v-if="booking?.status.storeStatus === 'pending'"
            label="拒絕"
            type="submit"
            color="negative"
            @click="onRejectedBooking"
          />
          <q-btn
            v-if="isToday(booking.date) && booking?.status.storeStatus === 'confirmed'"
            label="到店"
            type="submit"
            :color="getStatusColor('waiting')"
            @click="onWaitingForService"
          />
          <q-btn
            v-if="isToday(booking.date) && booking?.status.storeStatus === 'waiting'"
            label="美容去"
            type="submit"
            :color="getStatusColor('in_service')"
            @click="onServiceBooking"
          />
          <q-btn
            v-if="booking?.status.storeStatus === 'in_service'"
            label="完成"
            type="submit"
            :color="getStatusColor('completed')"
            @click="onCompletedBooking"
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
              booking?.status.storeStatus !== 'cancelled' &&
              booking?.status.storeStatus !== 'pending' &&
              booking?.status.storeStatus !== 'rejected' &&
              booking?.status.storeStatus !== 'completed'
            "
            label="取消"
            type="submit"
            color="secondary"
            outline
            @click="onCancelledBooking"
          />
        </div>
      </q-card-section>
      <q-separator />

      <!-- 基本資訊 -->
      <q-card-section>
        <div class="row q-col-gutter-x-lg">
          <div class="col-9">
            <q-card flat>
              <q-card-section class="q-pa-none">
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <q-input
                      v-if="booking"
                      label="預約編號"
                      v-model="booking.bookingId"
                      readonly
                      dense
                      outlined
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-if="booking"
                      label="預約來源"
                      v-model="booking.source"
                      :readonly="readonly"
                      dense
                      outlined
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-if="booking"
                      label="預約日期"
                      v-model="booking.date"
                      :readonly="readonly"
                      dense
                      outlined
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-if="booking"
                      label="預約時間"
                      v-model="booking.time"
                      :readonly="readonly"
                      dense
                      outlined
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-if="booking"
                      label="建立時間"
                      v-model="booking.createdAt"
                      :readonly="readonly"
                      dense
                      outlined
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-if="booking"
                      label="更新時間"
                      v-model="booking.updatedAt"
                      :readonly="readonly"
                      dense
                      outlined
                    />
                  </div>
                  <q-input
                    v-if="booking"
                    label="訂單備註"
                    v-model="booking.note"
                    :readonly="readonly"
                    type="textarea"
                    class="col-12"
                    autogrow
                    outlined
                  />
                </div>
              </q-card-section>
            </q-card>

            <div>
              <q-card flat>
                <q-card-section class="q-px-none">
                  <div class="text-subtitle1 q-mb-sm">
                    <q-icon name="person" class="q-mr-xs" />顧客資訊
                  </div>
                  <div class="row q-col-gutter-md">
                    <div class="col-4">
                      <q-input
                        v-if="booking"
                        label="姓名"
                        v-model="booking.customer.customerName"
                        :readonly="readonly"
                        dense
                        outlined
                      />
                    </div>
                    <div class="col-4">
                      <q-input
                        v-if="booking"
                        label="電話"
                        v-model="booking.customer.customerPhone"
                        :readonly="readonly"
                        dense
                        outlined
                      />
                    </div>
                    <div class="col-4">
                      <q-input
                        v-if="booking"
                        label="Email"
                        v-model="booking.customer.customerEmail"
                        :readonly="readonly"
                        dense
                        outlined
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-if="booking"
                        label="聯絡備註"
                        v-model="booking.customer.customerNote"
                        :readonly="readonly"
                        type="textarea"
                        autogrow
                        outlined
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
              <div class="col">
                <q-item-label>目前狀態</q-item-label>
                <q-badge
                  v-if="booking"
                  :color="getStatusColor(booking.status.customerStatus)"
                  class="q-mr-xs"
                >
                  顧客：{{ CustomerBookingStatusText[booking?.status.customerStatus] }}
                </q-badge>
                <q-badge v-if="booking" :color="getStatusColor(booking.status.storeStatus)">
                  店家：{{ StoreBookingStatusText[booking?.status.storeStatus] }}
                </q-badge>
              </div>
            </div>
          </div>
          <div class="col-3">
            <q-card flat style="max-width: 220px">
              <q-card-section class="q-pa-none">
                <q-timeline>
                  <q-timeline-entry
                    v-for="(h, idx) in booking?.status.history"
                    :key="idx"
                    :subtitle="h.timestamp"
                    :title="historyActionLabel(h.action)"
                    :color="getStatusColor(h.action)"
                  >
                    <div v-if="h.by">操作者：{{ h.by }}</div>
                    <div v-if="h.note">備註：{{ h.note }}</div>
                  </q-timeline-entry>
                </q-timeline>
                <div v-if="booking?.status.cancelReason" class="text-negative q-mt-md">
                  <q-icon name="cancel" color="negative" class="q-mr-xs" />
                  <b>取消說明：</b>{{ booking.status.cancelReason }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 寵物資訊 -->
    <q-card class="q-mt-md">
      <q-separator />
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm"><q-icon name="pets" class="q-mr-xs" />寵物資訊</div>
        <div class="row q-col-gutter-md">
          <div class="col-4">
            <q-input
              v-if="booking"
              label="姓名"
              v-model="booking.pet.petName"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
          <div class="col-4">
            <q-select
              v-if="booking"
              label="種類"
              v-model="booking.pet.petType"
              :options="petTypes"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
          <div class="col-4">
            <q-input
              v-if="booking"
              label="品種"
              v-model="booking.pet.petBreed"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
          <div class="col-4">
            <q-select
              v-if="booking"
              label="性別"
              v-model="booking.pet.petGender"
              :options="petGenders"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
          <div class="col-4">
            <q-input
              v-if="booking"
              label="年齡"
              type="number"
              v-model.number="booking.pet.petAge"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
          <div class="col-4">
            <q-input
              v-if="booking"
              label="體重(kg)"
              type="number"
              v-model.number="booking.pet.petWeight"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
          <div class="col-12">
            <q-input
              v-if="booking"
              label="寵物備註"
              v-model="booking.pet.petNote"
              :readonly="readonly"
              type="textarea"
              autogrow
              outlined
            />
          </div>
          <div class="col-12">
            <q-input
              v-if="booking"
              label="健康提醒"
              v-model="booking.pet.healthReminder"
              :readonly="readonly"
              type="textarea"
              autogrow
              outlined
            />
          </div>
          <div class="col-4">
            <q-select
              v-if="booking"
              label="是否攻擊"
              v-model="booking.pet.isAttack"
              :options="boolOptions"
              :readonly="readonly"
              dense
              outlined
              emit-value
              map-options
            />
          </div>
          <div class="col-8" v-if="booking?.pet.isAttack">
            <q-input
              v-if="booking"
              label="攻擊行為備註"
              v-model="booking.pet.attackNote"
              :readonly="readonly"
              outlined
              autogrow
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 服務項目 -->
    <q-card class="q-mt-md">
      <q-separator />
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">
          <q-icon name="content_cut" class="q-mr-xs" />服務項目
        </div>
        <q-list v-if="booking">
          <q-item v-for="s in booking.services" :key="s.serviceId" class="q-pa-none">
            <q-item-section>
              <q-input
                v-model="s.serviceName"
                :readonly="readonly"
                label="服務名稱"
                dense
                outlined
              />
            </q-item-section>
            <q-item-section>
              <q-input
                v-model.number="s.price"
                :readonly="readonly"
                label="價格"
                dense
                outlined
                type="number"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <div class="row q-col-gutter-sm q-pt-xs">
          <q-input
            v-if="booking"
            class="col-6"
            label="折扣說明"
            v-model="booking.discount.type"
            :readonly="readonly"
            dense
            outlined
          />
          <q-input
            v-if="booking"
            class="col-6"
            label="折扣金額"
            v-model.number="booking.discount.amount"
            :readonly="readonly"
            dense
            outlined
            type="number"
          />
        </div>
        <div class="q-mt-xs row q-col-gutter-sm">
          <div class="col-6">
            <q-input
              v-if="booking"
              label="總金額"
              v-model.number="booking.totalPrice"
              :readonly="readonly"
              dense
              outlined
              type="number"
            />
          </div>
          <div class="col-6">
            <q-input
              v-if="booking"
              label="折扣後"
              v-model.number="booking.finalPrice"
              :readonly="readonly"
              dense
              outlined
              type="number"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 付款與流程 -->
    <q-card class="q-mt-md">
      <q-separator />
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">
          <q-icon name="credit_card" class="q-mr-xs" />付款與流程
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-4">
            <q-select
              v-if="booking"
              label="付款方式"
              v-model="booking.payment.method"
              :options="paymentMethods"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
          <div class="col-4">
            <q-select
              v-if="booking"
              label="付款狀態"
              v-model="booking.payment.status"
              :options="paymentStatus"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
          <div class="col-4">
            <q-input
              v-if="booking"
              label="美容師"
              v-model="booking.groomer.groomerName"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              v-if="booking"
              label="到店時間"
              v-model="booking.arriveTime"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              v-if="booking"
              label="完成時間"
              v-model="booking.finishTime"
              :readonly="readonly"
              dense
              outlined
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 狀態與備註 -->
    <q-card class="q-mt-md">
      <q-separator />
      <q-card-section class="row">
        <q-input
          v-if="booking"
          label="下一次建議預約"
          v-model="booking.nextBookingSuggestion"
          :readonly="readonly"
          class="col-6"
          dense
          outlined
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { useBookingStore } from 'src/stores/useBookingStore';

import type { IBooking } from '../types/booking';
import { BookingStatus } from '../types/booking';
import {
  CustomerBookingStatusText,
  // CustomerBookingStatusColor,
  StoreBookingStatusText,
  // StoreBookingStatusColor,
} from '../enums/bookingStatus';

const $q = useQuasar();
const route = useRoute();
const bookingStore = useBookingStore();

const booking = ref<IBooking | null>(null);
const bookingId = route.params.id as string;

onMounted(() => {
  if (bookingStore.list.length === 0) {
    bookingStore.loadFromJson();
  }

  const detail = bookingStore.fetchBookingDetail(bookingId);
  booking.value = detail ?? null;
});

// readonly 控制編輯
const readonly = ref(true);

// 各選項
const petTypes = [
  { label: '狗', value: 'dog' },
  { label: '貓', value: 'cat' },
  { label: '其他', value: 'other' },
];
const petGenders = [
  { label: '公', value: 'male' },
  { label: '母', value: 'female' },
];
const boolOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
];
const paymentMethods = [
  { label: '現金', value: '現金' },
  { label: '信用卡', value: '信用卡' },
];
const paymentStatus = [
  { label: '未付款', value: 'unpaid' },
  { label: '已付款', value: 'paid' },
];

function onConfirmBooking() {
  console.log(booking.value);
  booking.value?.status.history.push({
    timestamp: getNowDateTimeString(),
    action: 'confirmed',
    by: 'groomer',
  });

  bookingStore.updateBookingStatus(bookingId, BookingStatus.CONFIRMED);

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
    booking.value?.status.history.push({
      timestamp: getNowDateTimeString(),
      action: 'rejected',
      by: 'groomer',
    });

    bookingStore.updateBookingStatus(bookingId, BookingStatus.REJECTED);

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
    $q.loading.show({ message: '儲存中...' });
    if (booking.value) {
      bookingStore.updateBookingDetail(bookingId, booking.value);
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
    }
  });
}

function onCancelledBooking() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // '2025-05-20'
  const time = now.toTimeString().slice(0, 8); // '14:59:31'
  const rightNow = `${today} ${time}`;

  const cancelled = {
    timestamp: rightNow,
    action: 'cancelled',
    by: 'groomer',
  };

  $q.dialog({
    title: '取消預約',
    message: '確定要取消這個預約嗎？',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    booking.value?.status.history.push(cancelled);
    if (booking.value && booking.value.status) {
      booking.value.status.cancelReason = '寵物當下過度緊張不適合美容';

      bookingStore.updateBookingStatus(bookingId, BookingStatus.CANCELLED);

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

function onWaitingForService() {
  booking.value?.status.history.push({
    timestamp: getNowDateTimeString(),
    action: 'waiting',
    by: 'groomer',
  });

  bookingStore.updateBookingStatus(bookingId, BookingStatus.WAITING);

  $q.notify({
    type: 'info',
    message: '已確認到店',
    position: 'top',
  });
}

function onServiceBooking() {
  booking.value?.status.history.push({
    timestamp: new Date().toISOString(),
    action: 'in_service',
    by: 'groomer',
  });

  bookingStore.updateBookingStatus(bookingId, BookingStatus.IN_SERVICE);

  $q.notify({
    type: 'info',
    message: '已確認開始服務',
    position: 'top',
  });
}

function onCompletedBooking() {
  booking.value?.status.history.push({
    timestamp: getNowDateTimeString(),
    action: 'completed',
    by: 'groomer',
  });

  bookingStore.updateBookingStatus(bookingId, BookingStatus.COMPLETED);

  $q.notify({
    type: 'positive',
    message: '已完成服務',
    position: 'top',
  });
}

function formatDate(d: string | Date): string {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  return dateObj.toISOString().slice(0, 10);
}

function isToday(date: string): boolean {
  const today = formatDate(new Date());
  const rowDate = formatDate(date);
  return today === rowDate;
}

function getNowDateTimeString(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'green-6';
    case 'confirmed':
      return 'info';
    case 'cancelled':
    case 'cancelledByCustomer':
    case 'rejected':
      return 'negative';
    case 'waiting':
      return 'light-blue-4';
    case 'in_service':
      return 'primary';
    case 'pending':
      return 'grey-6';
    default:
      return 'secondary';
  }
}

function historyActionLabel(action: string) {
  switch (action) {
    case 'created':
      return '建立預約';
    case 'confirmed':
      return '確認預約';
    case 'in_service':
      return '開始服務';
    case 'waiting':
      return '等待服務';
    case 'pending':
      return '等待確認';
    case 'completed':
      return '服務完成';
    case 'cancelled':
      return '店家取消';
    case 'cancelledByCustomer':
      return '顧客取消';
    case 'rejected':
      return '預約遭拒';
    default:
      return action;
  }
}
</script>
