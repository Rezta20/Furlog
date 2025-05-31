<template>
  <q-page padding>
    <div class="flex justify-between">
      <q-breadcrumbs class="q-mb-xs text-h6 text-bold">
        <q-breadcrumbs-el label="寵物清單" />
      </q-breadcrumbs>
      <q-btn
        label="新增寵物"
        color="primary"
        icon="add"
        to="/pet-list/create"
        class="q-mb-sm"
        flat
      />
    </div>
    <div class="q-gutter-md">
      <!-- search -->
      <q-card class="q-pa-md">
        <PetSearch @search="onSearch" />
      </q-card>

      <!-- table -->
      <q-card class="q-pa-md">
        <PetTable :rows="petStore.list" :columns="columns" row-key="petId" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { usePetStore } from '../stores/usePetStore';
import PetSearch from '../components/PetSearch.vue';
import PetTable from '../components/PetTable.vue';
import type { IPetForm } from '../types/pet';
import type { ITableColumns } from '../types/tables';

const petStore = usePetStore();

const columns: ITableColumns[] = [
  { name: 'name', label: '寵物名稱', field: 'name', align: 'left' },
  { name: 'petType', label: '種類', field: 'petType', align: 'left', sortable: true },
  { name: 'petBreed', label: '品種', field: 'petBreed', align: 'left' },
  { name: 'petGender', label: '性別', field: 'petGender', align: 'left' },
  { name: 'petNote', label: '備註', field: 'petNote', align: 'left' },
  { name: 'action', label: '操作', field: 'action', align: 'center' },
];

function onSearch(form: IPetForm) {
  console.log('list', form);
  petStore.filterList(form);
}
</script>
