<template>
  <q-form @submit.prevent="doSearch">
    <div class="row q-col-gutter-lg q-mb-sm">
      <div class="col-12 col-md-3">
        <q-input v-model="form.name" label="寵物名稱" dense />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="form.petType"
          :options="['狗', '貓', '其他']"
          label="種類"
          emit-value
          map-options
          dense
          clearable
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input v-model="form.petBreed" label="品種" dense />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="form.petGender"
          :options="['公', '母']"
          label="性別"
          emit-value
          map-options
          dense
          clearable
        />
      </div>
    </div>
    <div class="row justify-end">
      <div class="col-12 col-md-4 flex flex-end items-end justify-end">
        <q-btn label="查詢" type="submit" color="primary" class="q-mr-md" />
        <q-btn icon="refresh" type="submit" color="primary" outline @click="resetForm" />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['search']);

const form = ref({
  name: '',
  petType: '',
  petBreed: '',
  petGender: '',
});

function resetForm() {
  form.value = {
    name: '',
    petType: '',
    petBreed: '',
    petGender: '',
  };
}

function doSearch() {
  emit('search', { ...form.value });
}
</script>
