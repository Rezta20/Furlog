<template>
  <q-card>
    <q-card-section>
      <div class="text-subtitle1 q-mb-sm"><q-icon name="person" class="q-mr-xs" />顧客資訊</div>
      <div class="row q-col-gutter-md">
        <div class="col-4">
          <q-input
            v-if="localBooking"
            label="姓名"
            v-model="localBooking.customer.name"
            :readonly="readonly"
            dense
            outlined
          />
        </div>
        <div class="col-4">
          <q-input
            v-if="localBooking"
            label="電話"
            v-model="localBooking.customer.phone"
            :readonly="readonly"
            dense
            outlined
          />
        </div>
        <div class="col-4">
          <q-input
            v-if="localBooking"
            label="Email"
            v-model="localBooking.customer.email"
            :readonly="readonly"
            dense
            outlined
          />
        </div>
        <div class="col-12">
          <q-input
            v-if="localBooking"
            label="聯絡備註"
            v-model="localBooking.customer.note"
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
import { watch, reactive } from 'vue';
import type { IBooking } from '../../types/booking';

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
</script>
