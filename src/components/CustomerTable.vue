<template>
  <q-table :rows="rows" :columns="columns" row-key="id" flat :pagination="pagination">
    <template #body-cell-name="props">
      <q-td :props="props">{{ props.row.name }}</q-td>
    </template>

    <template #body-cell-phone="props">
      <q-td :props="props">{{ props.row.phone }}</q-td>
    </template>

    <template #body-cell-email="props">
      <q-td :props="props">{{ props.row.email }}</q-td>
    </template>

    <template #body-cell-note="props">
      <q-td :props="props">{{ props.row.note }}</q-td>
    </template>

    <template #body-cell-created_at="props">
      <q-td :props="props">{{ props.row.created_at }}</q-td>
    </template>

    <template #body-cell-action="props">
      <q-td :props="props">
        <q-btn
          flat
          icon="description"
          color="primary"
          @click="$router.push(`/customer-list/${props.row.id}`)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { ICustomer } from '../types/customer';
import type { ITableColumns } from '../types/tables';

defineProps<{
  rows: ICustomer[];
  columns: ITableColumns[];
  rowKey: string;
}>();

const pagination = { rowsPerPage: 10 };
</script>
