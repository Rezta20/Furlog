<template>
  <q-page padding>
    <div class="flex justify-between">
      <p class="text-bold text-h5">顧客詳情</p>
      <div class="">
        <q-btn v-if="readonly" label="編輯" color="primary" @click="readonly = false" />
        <q-btn v-else label="儲存" color="primary" @click="onSave" />
      </div>
    </div>
    <q-card class="q-pa-lg q-mx-auto">
      <q-card-section>
        <div v-if="customer" class="row q-col-gutter-md">
          <div class="col-6">
            <q-input v-model="customer.name" label="姓名" :readonly="readonly" dense outlined />
          </div>
          <div class="col-6">
            <q-input v-model="customer.phone" label="電話" :readonly="readonly" dense outlined />
          </div>
          <div class="col-6">
            <q-input v-model="customer.email" label="Email" :readonly="readonly" dense outlined />
          </div>
          <div class="col-6">
            <q-input v-model="customer.created_at" label="建立時間" readonly dense outlined />
          </div>
          <div class="col-6">
            <q-input v-model="customer.updated_at" label="更新時間" readonly dense outlined />
          </div>
          <div class="col-12">
            <q-input
              v-model="customer.note"
              label="顧客備註"
              :readonly="readonly"
              type="textarea"
              autogrow
              outlined
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomerStore } from 'src/stores/useCustomerStore';
import type { ICustomer } from '../types/customer';

const route = useRoute();
const customerStore = useCustomerStore();

const customerId = route.params.id as string;
const readonly = ref(true);

const customer = ref<ICustomer | null>({
  id: '',
  name: '',
  phone: '',
  email: '',
  note: '',
  created_at: '',
  updated_at: '',
});

onMounted(() => {
  const detail = customerStore.fetchCustomerDetail(customerId);
  customer.value = detail ?? null;
});

function onSave() {
  // customerStore.updateCustomerDetail(customer.value.id, customer.value);
  // readonly.value = true;
}
</script>
