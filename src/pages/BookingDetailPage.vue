<template>
  <q-page padding>
    <q-card class="q-pa-lg q-mx-auto">
      <q-card-section class="row">
        <div class="col-8">
          <div class="text-h6">訂單詳情</div>
        </div>
        <div v-if="booking" class="col-4 row q-gutter-md justify-end">
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
            :color="getStatusColor('arrived')"
            @click="onArrivedForService"
          />
          <q-btn
            v-if="isToday(booking.date) && booking?.status.value === 'arrived'"
            label="美容去"
            type="submit"
            :color="getStatusColor('in_service')"
            @click="onServiceBooking"
          />
          <q-btn
            v-if="booking?.status.value === 'in_service'"
            label="完成"
            type="submit"
            :color="getStatusColor('finished')"
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
                        v-model="booking.customer.name"
                        :readonly="readonly"
                        dense
                        outlined
                      />
                    </div>
                    <div class="col-4">
                      <q-input
                        v-if="booking"
                        label="電話"
                        v-model="booking.customer.phone"
                        :readonly="readonly"
                        dense
                        outlined
                      />
                    </div>
                    <div class="col-4">
                      <q-input
                        v-if="booking"
                        label="Email"
                        v-model="booking.customer.email"
                        :readonly="readonly"
                        dense
                        outlined
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-if="booking"
                        label="聯絡備註"
                        v-model="booking.customer.note"
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
                  :color="getStatusColor(booking.status.value)"
                  class="q-mr-xs"
                >
                  {{ BookingStatusMap[booking.status.value] }}
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
        <div class="text-subtitle1 q-mb-sm">
          <q-icon name="pets" class="q-mr-xs" />
          寵物資訊
        </div>

        <template v-if="booking">
          <div
            v-for="(pet, index) in booking.pet"
            :key="pet.id"
            class="q-mb-md q-pa-sm q-rounded bordered row q-col-gutter-md"
          >
            <div class="col-12 text-subtitle2 text-weight-medium">寵物 {{ index + 1 }}</div>

            <div class="col-4">
              <q-input label="姓名" v-model="pet.name" :readonly="readonly" dense outlined />
            </div>

            <div class="col-4">
              <q-select
                label="種類"
                v-model="pet.petType"
                :options="petTypes"
                :readonly="readonly"
                dense
                outlined
              />
            </div>

            <div class="col-4">
              <q-input label="品種" v-model="pet.petBreed" :readonly="readonly" dense outlined />
            </div>

            <div class="col-4">
              <q-select
                label="性別"
                v-model="pet.petGender"
                :options="petGenders"
                :readonly="readonly"
                dense
                outlined
              />
            </div>

            <div class="col-4">
              <q-input
                label="年齡"
                type="number"
                v-model.number="pet.petAge"
                :readonly="readonly"
                dense
                outlined
              />
            </div>

            <div class="col-4">
              <q-input
                label="體重(kg)"
                type="number"
                v-model.number="pet.petWeight"
                :readonly="readonly"
                dense
                outlined
              />
            </div>

            <div class="col-12">
              <q-input
                label="寵物備註"
                v-model="pet.petNote"
                :readonly="readonly"
                type="textarea"
                autogrow
                outlined
              />
            </div>

            <div class="col-12">
              <q-input
                label="健康提醒"
                v-model="pet.healthReminder"
                :readonly="readonly"
                type="textarea"
                autogrow
                outlined
              />
            </div>

            <div class="col-4">
              <q-select
                label="是否攻擊"
                v-model="pet.isAttack"
                :options="boolOptions"
                :readonly="readonly"
                dense
                outlined
                emit-value
                map-options
              />
            </div>

            <div class="col-8" v-if="pet.isAttack">
              <q-input
                label="攻擊行為備註"
                v-model="pet.attackNote"
                :readonly="readonly"
                outlined
                autogrow
              />
            </div>
          </div>
        </template>
      </q-card-section>
    </q-card>

    <!-- 服務項目 -->
    <q-card class="q-mt-md">
      <q-separator />
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">
          <q-icon name="content_cut" class="q-mr-xs" />服務項目
        </div>

        <!-- 每隻寵物 -->
        <div v-for="group in booking?.services" :key="group.petId" class="q-mb-md">
          <div class="text-subtitle2 q-mb-xs">{{ findPetName(group.petId) }}</div>
          <q-list>
            <q-item v-for="s in group.items" :key="s.serviceId" class="q-pa-none">
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
          <div class="text-right text-caption text-grey q-mt-sm">
            小計：NT$ {{ subtotal(group.items) }}
          </div>
        </div>

        <div class="row q-col-gutter-sm q-pt-xs">
          <q-input
            v-if="booking"
            class="col-6"
            label="折扣說明"
            v-model="discountType"
            :readonly="readonly"
            dense
            outlined
          />
          <q-input
            v-if="booking"
            class="col-6"
            label="折扣金額"
            v-model.number="discountAmount"
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
              v-model.number="totalPrice"
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
              v-model.number="finalPrice"
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
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { useBookingStore } from 'src/stores/useBookingStore';
import type { IBooking, IService } from '../types/booking';
import { BookingStatus } from '../enums/bookingStatus';
import { BookingStatusMap } from '../constants/statusMap';

const $q = useQuasar();
const route = useRoute();
const bookingStore = useBookingStore();

const booking = ref<IBooking>();
const bookingId = route.params.id as string;

const discountType = ref(booking.value?.discount?.type || '');
const discountAmount = ref(booking.value?.discount?.amount || 0);

onMounted(() => {
  const detail = bookingStore.fetchBookingDetail(bookingId);
  booking.value = detail;
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

function findPetName(petId: string): string {
  return booking.value?.pet.find((p) => p.id === petId)?.name || '未知寵物';
}

function subtotal(items: IService[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// 總金額（所有寵物所有服務加總）
const totalPrice = computed(() => {
  if (!booking.value?.services) return 0;
  return booking.value.services.reduce((total, group) => {
    const subtotal = group.items.reduce((sum, item) => sum + (item.price || 0), 0);
    return total + subtotal;
  }, 0);
});

// 折扣金額（如果有填則取折扣金額）
const discountValue = computed(() => Number(discountAmount.value || 0));

// 折扣後金額
const finalPrice = computed(() => {
  return Math.max(totalPrice.value - discountValue.value, 0); // 保底 0
});

function onConfirmBooking() {
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
  $q.dialog({
    title: '取消預約',
    message: '確定要取消這個預約嗎？',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    if (booking.value && booking.value.status) {
      booking.value.status.cancelReason = '寵物當下過度緊張不適合美容';
      bookingStore.updateBookingStatus(bookingId, BookingStatus.CANCELLED_BY_STORE);
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
  bookingStore.updateBookingStatus(bookingId, BookingStatus.ARRIVED);

  $q.notify({
    type: 'info',
    message: '已確認到店',
    position: 'top',
  });
}

function onServiceBooking() {
  bookingStore.updateBookingStatus(bookingId, BookingStatus.IN_SERVICE);

  $q.notify({
    type: 'info',
    message: '已確認開始服務',
    position: 'top',
  });
}

function onFinishedBooking() {
  bookingStore.updateBookingStatus(bookingId, BookingStatus.FINISHED);

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
