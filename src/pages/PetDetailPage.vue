<template>
  <q-page padding>
    <div class="flex justify-between q-mb-md">
      <q-breadcrumbs class="q-mb-xs text-h6 text-bold">
        <q-breadcrumbs-el label="寵物清單" to="/pet-list" />
        <q-breadcrumbs-el label="寵物詳情" />
      </q-breadcrumbs>

      <div>
        <q-btn v-if="readonly && petId" label="編輯" color="primary" @click="onEdit" />
        <q-btn
          v-if="!readonly && petId !== 'create'"
          label="儲存"
          color="primary"
          @click="onSave"
        />
        <q-btn
          v-if="!readonly && petId === 'create'"
          label="建立"
          color="primary"
          :disable="!pet.name"
          @click="onCreate"
        />
      </div>
    </div>

    <q-card class="q-pa-lg q-mx-auto">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-input v-model="pet.name" label="寵物名稱" :readonly="readonly" dense />
          </div>
          <div class="col-6">
            <q-select
              v-model="pet.petType"
              :options="['狗', '貓', '其他']"
              label="寵物種類"
              :readonly="readonly"
              dense
              emit-value
              map-options
              clearable
            />
          </div>
          <div class="col-6">
            <q-input v-model="pet.petBreed" label="品種" :readonly="readonly" dense />
          </div>
          <div class="col-6">
            <q-select
              v-model="pet.petGender"
              :options="['公', '母']"
              label="性別"
              :readonly="readonly"
              dense
              emit-value
              map-options
              clearable
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="pet.petAge"
              label="年齡（歲）"
              :readonly="readonly"
              type="number"
              dense
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="pet.petWeight"
              label="體重（kg）"
              :readonly="readonly"
              type="number"
              dense
            />
          </div>
          <div class="col-12">
            <q-input
              v-model="pet.petNote"
              label="備註"
              :readonly="readonly"
              type="textarea"
              autogrow
              dense
            />
          </div>
          <div class="col-12">
            <q-input
              v-model="ownerName"
              label="飼主"
              :hint="ownerName ? '' : '點擊選擇飼主'"
              readonly
              dense
              @click="onOwner"
            >
              <template v-if="ownerName && petId !== 'create'" v-slot:append>
                <q-icon name="chevron_right" />
              </template>
            </q-input>
          </div>
          <div class="col-6">
            <q-input v-model="pet.created_at" label="建立時間" readonly dense />
          </div>
          <div class="col-6">
            <q-input v-model="pet.updated_at" label="更新時間" readonly dense />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
  <!-- 顧客選擇 Dialog -->
  <q-dialog v-model="showCustomerDialog">
    <q-card style="min-width: 700px; max-width: 90vw">
      <q-card-section class="text-h6 q-pb-sm">選擇飼主</q-card-section>
      <q-separator />

      <!-- 搜尋區塊 -->
      <q-card-section>
        <CustomerSearch @search="handleSearch" />
      </q-card-section>

      <!-- 顧客列表 table -->
      <q-card-section>
        <CustomerTable
          :rows="customerStore.list"
          :columns="columns"
          row-key="id"
          @row-click="selectCustomer"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="取消" color="primary" @click="showCustomerDialog = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { usePetStore } from 'src/stores/usePetStore';
import { useCustomerStore } from '../stores/useCustomerStore';
import type { IPet } from '../types/pet';
import type { ICustomer, ICustomerForm } from '../types/customer';
import type { ITableColumns } from '../types/tables';
import CustomerSearch from '../components/CustomerSearch.vue';
import CustomerTable from '../components/CustomerTable.vue';

const $q = useQuasar();
const route = useRoute();
const $router = useRouter();
const petStore = usePetStore();
const customerStore = useCustomerStore();

const owner = computed(() => customerStore.list.find((c) => c.id === pet.value.customer_id));
const ownerName = computed(() => owner.value?.name ?? '');

const petId = route.params.id as string;
const readonly = ref(true);
const pet = ref<IPet>({
  id: '',
  customer_id: '',
  name: '',
  petType: '狗',
  petBreed: '',
  petGender: '公',
  petAge: 0,
  petWeight: 0,
  petNote: '',
  isAttack: false,
  attackNote: '',
  healthReminder: '',
  created_at: '',
  updated_at: '',
});
const showCustomerDialog = ref(false);
const selectedCustomerId = ref('');
const selectCustomerName = ref('');

const columns: ITableColumns[] = [
  { name: 'name', label: '姓名', field: 'name', align: 'left', sortable: true },
  { name: 'phone', label: '電話', field: 'phone', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
];

onMounted(() => {
  const detail = petStore.fetchPetDetail(petId);

  if (!detail) readonly.value = false;

  pet.value = detail || {
    ...pet.value,
    id: '',
    created_at: '',
    updated_at: '',
  };

  if (!petId) {
    $q.notify({
      type: 'negative',
      message: '找不到該寵物資料',
    });
    return;
  }
});

function onEdit() {
  readonly.value = false;
  $q.notify({ type: 'info', message: '已開啟編輯模式' });
}

function onSave() {
  if (!pet.value) return;
  pet.value.updated_at = new Date().toISOString().slice(0, 16).replace('T', ' ');
  petStore.updatePet(pet.value);
  readonly.value = true;
  $q.notify({ type: 'positive', message: '寵物資料已儲存' });
}

async function onCreate() {
  if (!pet.value) return;

  const isDuplicate = petStore.list.some((p) => p.name.trim() === pet.value.name.trim());

  if (isDuplicate) {
    $q.notify({
      type: 'negative',
      message: '已有相同名稱的寵物，請確認是否重複建立',
    });
    return;
  }

  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  pet.value.created_at = now;
  pet.value.updated_at = now;
  pet.value.id = crypto.randomUUID();
  pet.value.customer_id = selectedCustomerId.value;

  if (!selectedCustomerId.value) {
    $q.notify({ type: 'negative', message: '請選擇一位飼主' });
    return;
  }

  petStore.createPet(pet.value);
  readonly.value = true;
  $q.notify({ type: 'positive', message: '新寵物已建立' });

  await $router.push('/pet-list');
}

async function onOwner() {
  if (owner.value && petId !== 'create') {
    await $router.push(`/customer-list/${owner.value?.id}`);
    return;
  }

  showCustomerDialog.value = true;
}

function handleSearch(form: ICustomerForm) {
  customerStore.filterList(form);
}

function selectCustomer(evt: Event, row: ICustomer) {
  pet.value.customer_id = row.id;
  selectCustomerName.value = row.name;
  showCustomerDialog.value = false;
  customerStore.filterList({}); // 更新顧客列表
}
</script>
