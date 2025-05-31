<template>
  <q-page padding>
    <div class="flex justify-between q-mb-md">
      <q-breadcrumbs class="q-mb-xs text-h6 text-bold">
        <q-breadcrumbs-el label="顧客清單" to="/customer-list" />
        <q-breadcrumbs-el label="顧客詳情" />
      </q-breadcrumbs>

      <div>
        <q-btn v-if="readonly && customerId" label="編輯" color="primary" @click="onEdit" />
        <q-btn
          v-if="!readonly && customerId != 'create'"
          label="儲存"
          color="primary"
          @click="onSave"
        />
        <q-btn
          v-if="!readonly && customerId == 'create'"
          label="建立"
          color="primary"
          :disable="!customer.name"
          @click="onCreate"
        />
      </div>
    </div>
    <q-card class="q-pa-lg q-mx-auto">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-input v-model="customer.name" label="姓名" :readonly="readonly" dense />
          </div>
          <div class="col-6">
            <q-input v-model="customer.phone" label="電話" :readonly="readonly" dense />
          </div>
          <div class="col-6">
            <q-input v-model="customer.email" label="Email" :readonly="readonly" dense />
          </div>

          <div class="col-12">
            <q-input
              v-model="customer.note"
              label="顧客備註"
              :readonly="readonly"
              type="textarea"
              autogrow
              dense
            />
          </div>
          <div class="col-6">
            <q-input v-model="customer.created_at" label="建立時間" readonly dense />
          </div>
          <div class="col-6">
            <q-input v-model="customer.updated_at" label="更新時間" readonly dense />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCustomerStore } from 'src/stores/useCustomerStore';
import { useQuasar } from 'quasar';
import type { ICustomer } from '../types/customer';

const route = useRoute();
const $router = useRouter();
const customerStore = useCustomerStore();
const $q = useQuasar();

const customerId = route.params.id as string;
const readonly = ref(true);

const customer = ref<ICustomer>({
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

  if (!detail) readonly.value = false;

  customer.value = detail || {
    id: '',
    name: '',
    phone: '',
    email: '',
    note: '',
    created_at: '',
    updated_at: '',
  };

  if (!customerId) {
    $q.notify({
      type: 'negative',
      message: '找不到該顧客資料',
    });
    return;
  }
});

function onSave() {
  if (!customer.value) return;
  customer.value.updated_at = new Date().toISOString().slice(0, 16).replace('T', ' ');
  customerStore.updateCustomer(customer.value);
  readonly.value = true;
  $q.notify({
    type: 'positive',
    message: '顧客資料已儲存',
  });
}

function onEdit() {
  readonly.value = false;

  $q.notify({
    type: 'info',
    message: '已開啟編輯模式',
  });
}

async function onCreate() {
  if (!customer.value) return;

  const isDuplicate = customerStore.list.some((c) => c.name.trim() === customer.value.name.trim());

  if (isDuplicate) {
    $q.notify({
      type: 'negative',
      message: '已有相同姓名的顧客，請確認是否重複建立',
    });
    return;
  }

  customer.value.created_at = new Date().toISOString().slice(0, 16).replace('T', ' ');
  customer.value.updated_at = customer.value.created_at;
  customer.value.id = crypto.randomUUID(); // 使用 UUID 作為新顧客的 ID
  customerStore.createCustomer(customer.value);
  readonly.value = true;
  $q.notify({
    type: 'positive',
    message: '新顧客已建立',
  });

  await $router.push('/customer-list'); // 跳轉到顧客清單頁面
}
</script>
