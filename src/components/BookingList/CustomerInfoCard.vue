<template>
  <q-card>
    <q-card-section>
      <div class="text-subtitle1 q-mb-sm"><q-icon name="person" class="q-mr-xs" />顧客資訊</div>
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
</template>
<script setup lang="ts">
import type { IBooking } from '../../types/booking';

const booking = defineModel<IBooking | undefined>('booking');
const readonly = defineModel<boolean>('readonly');
</script>
