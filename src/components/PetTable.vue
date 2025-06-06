<template>
  <q-table :rows="rows" :columns="columns" row-key="id" flat :pagination="pagination">
    <template #body-cell-name="props">
      <q-td :props="props">{{ props.row.name }}</q-td>
    </template>

    <template #body-cell-petType="props">
      <q-td :props="props">{{ petTypeMap[props.row.petType] }}</q-td>
    </template>

    <template #body-cell-petBreed="props">
      <q-td :props="props">{{ props.row.petBreed }}</q-td>
    </template>

    <template #body-cell-petGender="props">
      <q-td :props="props">{{ props.row.petGender }}</q-td>
    </template>

    <template #body-cell-petNote="props">
      <q-td :props="props">{{ props.row.petNote }}</q-td>
    </template>

    <template #body-cell-action="props">
      <q-td :props="props">
        <q-btn
          flat
          icon="description"
          color="primary"
          @click="$router.push(`/pet-list/${props.row.id}`)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { IPet } from '../types/pet';
import type { ITableColumns } from '../types/tables';
import { petTypeMap } from '../constants/pet';

defineProps<{
  rows: IPet[];
  columns: ITableColumns[];
  rowKey: string;
}>();

const pagination = { rowsPerPage: 10 };
</script>
