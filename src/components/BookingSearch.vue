<template>
  <q-form @submit.prevent="doSearch">
    <!-- 上排 3 欄 -->
    <div class="row q-col-gutter-lg q-mb-sm">
      <div class="col-12 col-md-4 col-lg-4">
        <q-input v-model="form.customerPhone" label="聯絡電話" dense />
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <q-input v-model="form.orderId" label="訂單編號" dense />
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <q-select
          v-model="form.storeStatus"
          :options="statusOptions"
          label="訂單狀態"
          multiple
          emit-value
          map-options
          dense
        />
      </div>
    </div>

    <!-- 下排 2 欄 + 查詢鈕靠右 -->
    <div class="row q-col-gutter-md q-gutter-y-lg">
      <div class="col-12 col-md-4 col-lg-4">
        <q-input
          :model-value="form.dateStart"
          label="開始日期"
          dense
          :rules="[(val: string) => !val || !isNaN(Date.parse(val)) || '請輸入有效日期']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date
                  :model-value="form.dateStart"
                  @update:model-value="form.dateStart = $event"
                  mask="YYYY-MM-DD"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <q-input
          v-model="form.dateEnd"
          label="結束日期"
          dense
          :rules="[(val: string) => !val || !isNaN(Date.parse(val)) || '請輸入有效日期']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date
                  :model-value="form.dateEnd"
                  @update:model-value="form.dateEnd = $event"
                  mask="YYYY-MM-DD"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-4 flex flex-end items-end justify-end">
        <q-btn label="查詢" type="submit" color="primary" class="q-mr-md" />
        <q-btn icon="refresh" type="submit" color="primary" @click="resetForm" outline />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { StoreBookingStatusText } from '../enums/bookingStatus';
import type { IBookingForm } from '../types/booking';

const emit = defineEmits(['search']);

const $q = useQuasar();

const form = ref<IBookingForm>({
  customerPhone: '',
  orderId: '',
  storeStatus: [],
  dateStart: '',
  dateEnd: '',
});

const statusOptions = computed(() =>
  Object.entries(StoreBookingStatusText).map(([value, label]) => ({
    label,
    value,
  })),
);

function resetForm() {
  form.value.customerPhone = '';
  form.value.orderId = '';
  form.value.storeStatus = [];
  form.value.dateStart = '';
  form.value.dateEnd = '';
}

function dateValidator() {
  if (
    form.value.dateStart &&
    form.value.dateEnd &&
    new Date(form.value.dateStart) > new Date(form.value.dateEnd)
  ) {
    $q.notify({
      type: 'negative',
      message: '結束日期不可早於開始日期',
    });
    return; // 不送查詢
  }
}

function doSearch() {
  dateValidator();

  emit('search', {
    customerPhone: form.value.customerPhone,
    orderId: form.value.orderId,
    storeStatus: form.value.storeStatus,
    dateStart: form.value.dateStart,
    dateEnd: form.value.dateEnd,
  });
}
</script>
