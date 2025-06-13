<template>
  <q-card>
    <q-card-section>
      <div class="row q-col-gutter-x-lg">
        <div class="col-9">
          <q-card flat>
            <q-card-section class="q-pa-none">
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input
                    v-if="localBooking"
                    label="預約編號"
                    v-model="localBooking.bookingId"
                    readonly
                    dense
                    outlined
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-if="localBooking"
                    label="預約來源"
                    v-model="localBooking.source"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-if="localBooking"
                    label="預約日期"
                    v-model="localBooking.date"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-if="localBooking"
                    label="預約時間"
                    v-model="localBooking.time"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-if="localBooking"
                    label="建立時間"
                    v-model="localBooking.createdAt"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-if="localBooking"
                    label="更新時間"
                    v-model="localBooking.updatedAt"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
                <q-input
                  v-if="localBooking"
                  label="訂單備註"
                  v-model="localBooking.note"
                  :readonly="readonly"
                  type="textarea"
                  class="col-12"
                  autogrow
                  outlined
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-3">
          <q-card flat style="max-width: 220px">
            <q-card-section class="q-pa-none">
              <q-timeline>
                <q-timeline-entry
                  v-for="(h, idx) in localBooking?.status.history"
                  :key="idx"
                  :subtitle="h.timestamp"
                  :title="HistoryActionLabelMap[h.action]"
                  :color="BookingStatusColorMap[h.action]"
                >
                  <div v-if="h.by">操作者：{{ h.by }}</div>
                  <div v-if="h.note">備註：{{ h.note }}</div>
                </q-timeline-entry>
              </q-timeline>
              <div v-if="localBooking?.status.cancelReason" class="text-negative q-mt-md">
                <q-icon name="cancel" color="negative" class="q-mr-xs" />
                <b>取消說明：</b>{{ localBooking.status.cancelReason }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-card class="q-mt-md">
    <q-card-section>
      <div class="text-subtitle1 q-mb-sm">
        <q-icon name="credit_card" class="q-mr-xs" />付款與流程
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-select
            v-if="localBooking"
            label="付款方式"
            v-model="localBooking.payment.method"
            :options="paymentMethods"
            :readonly="readonly"
            dense
            outlined
          />
        </div>
        <div class="col-6">
          <q-select
            v-if="localBooking"
            label="付款狀態"
            v-model="localBooking.payment.status"
            :options="paymentStatus"
            :readonly="readonly"
            dense
            outlined
          />
        </div>

        <div class="col-6">
          <q-input
            v-if="localBooking"
            label="到店時間"
            v-model="localBooking.arriveTime"
            :readonly="readonly"
            dense
            outlined
          />
        </div>
        <div class="col-6">
          <q-input
            v-if="localBooking"
            label="完成時間"
            v-model="localBooking.finishTime"
            :readonly="readonly"
            dense
            outlined
          />
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-card class="q-mt-md">
    <q-card-section class="row">
      <q-input
        v-if="localBooking"
        label="下一次建議預約"
        v-model="localBooking.nextBookingSuggestion"
        :readonly="readonly"
        class="col-6"
        dense
        outlined
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { watch, reactive } from 'vue';
import type { IBooking } from '../../types/booking';
import { BookingStatusColorMap, HistoryActionLabelMap } from '../../constants/statusMap';

const props = defineProps<{
  booking: IBooking;
  readonly: boolean;
}>();

const localBooking = reactive({ ...props.booking });

watch(
  () => props.booking,
  (newVal) => {
    Object.assign(localBooking, newVal);
  },
  { deep: true, immediate: true },
);

const paymentMethods = [
  { label: '現金', value: '現金' },
  { label: '信用卡', value: '信用卡' },
];
const paymentStatus = [
  { label: '未付款', value: 'unpaid' },
  { label: '已付款', value: 'paid' },
];
</script>
