<template>
  <q-form @submit.prevent="doSearch">
    <div class="row q-col-gutter-lg q-mb-sm">
      <div class="col-12 col-md-4 col-lg-4">
        <q-input v-model="form.name" label="顧客姓名" dense />
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <q-input v-model="form.phone" label="電話" dense />
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <q-input v-model="form.email" label="信箱" dense />
      </div>
    </div>
    <div class="row justify-end">
      <div class="col-12 col-md-4 flex flex-end items-end justify-end">
        <q-btn label="查詢" type="submit" color="primary" class="q-mr-md" />
        <q-btn icon="refresh" type="submit" color="primary" @click="resetForm" outline />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['search']);

const form = ref({
  name: '',
  phone: '',
  email: '',
});

function resetForm() {
  form.value = {
    name: '',
    phone: '',
    email: '',
  };
}

function doSearch() {
  console.log('Searching with form:', form.value);
  emit('search', { ...form.value });
}
</script>
