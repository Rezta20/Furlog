<template>
  <q-card>
    <q-card-section>
      <div class="row q-col-gutter-x-lg">
        <div class="col-9">
          <q-card flat>
            <q-card-section class="q-pa-none" v-if="booking">
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input
                    label="預約編號"
                    v-model="booking.bookingId"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
                <div class="col-6">
                  <q-input
                    label="預約來源"
                    v-model="booking.source"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
                <div class="col-6">
                  <q-input
                    label="預約日期"
                    v-model="booking.date"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
                <div class="col-6">
                  <q-input
                    label="預約時間"
                    v-model="booking.time"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
                <q-input
                  label="訂單備註"
                  v-model="booking.note"
                  :readonly="readonly"
                  type="textarea"
                  class="col-12"
                  autogrow
                  outlined
                />
                <div class="col-6">
                  <q-input
                    label="建立時間"
                    v-model="booking.createdAt"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
                <div class="col-6">
                  <q-input
                    label="更新時間"
                    v-model="booking.updatedAt"
                    :readonly="readonly"
                    dense
                    outlined
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-3">
          <q-card flat style="max-width: 220px">
            <q-card-section class="q-pa-none" v-if="booking">
              <q-timeline>
                <q-timeline-entry
                  v-for="(h, idx) in booking.status.history"
                  :key="idx"
                  :subtitle="h.timestamp"
                  :title="HistoryActionLabelMap[h.action]"
                  :color="BookingStatusColorMap[h.action]"
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

  <q-card class="q-mt-md">
    <q-card-section v-if="booking">
      <div class="text-subtitle1 q-mb-sm">
        <q-icon name="credit_card" class="q-mr-xs" />付款與流程
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-select
            label="付款方式"
            v-model="booking.payment.method"
            :options="paymentMethods"
            :readonly="readonly"
            dense
            outlined
          />
        </div>
        <div class="col-6">
          <q-select
            label="付款狀態"
            v-model="booking.payment.status"
            :options="paymentStatus"
            :readonly="readonly"
            dense
            outlined
          />
        </div>

        <div class="col-6">
          <q-input
            label="到店時間"
            v-model="booking.arriveTime"
            :readonly="readonly"
            dense
            outlined
          />
        </div>
        <div class="col-6">
          <q-input
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
</template>

<script setup lang="ts">
import type { IBooking } from '../../types/booking';
import { BookingStatusColorMap, HistoryActionLabelMap } from '../../constants/statusMap';

const booking = defineModel<IBooking | undefined>('booking');
const readonly = defineModel<boolean>('readonly');

const paymentMethods = [
  { label: '現金', value: '現金' },
  { label: '信用卡', value: '信用卡' },
];
const paymentStatus = [
  { label: '未付款', value: 'unpaid' },
  { label: '已付款', value: 'paid' },
];
</script>
