<template>
  <q-page padding>
    <div class="q-gutter-md">
      <p class="text-bold text-h5">顧客清單</p>

      <!-- search -->
      <q-card class="q-pa-md">
        <CustomerSearch @search="onSearch" />
      </q-card>

      <!-- table -->
      <q-card class="q-pa-md">
        <CustomerTable :rows="customerStore.list" :columns="columns" row-key="customerId" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useCustomerStore } from '../stores/useCustomerStore';
import CustomerSearch from '../components/CustomerSearch.vue';
import CustomerTable from '../components/CustomerTable.vue';
import type { ICustomerForm } from '../types/customer';
import type { ITableColumns } from '../types/tables';

const customerStore = useCustomerStore();

const columns: ITableColumns[] = [
  { name: 'name', label: '姓名', field: 'name', align: 'left', sortable: true },
  { name: 'phone', label: '電話', field: 'phone', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'note', label: '備註', field: 'note', align: 'left' },
  { name: 'action', label: '操作', field: 'action', align: 'center' },
];

function onSearch(form: ICustomerForm) {
  console.log('list', form);
  customerStore.filterList(form);
}
</script>
