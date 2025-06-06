<template>
  <q-card class="q-pa-lg q-mx-auto">
    <q-card-section v-if="localPet">
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-input v-model="localPet.name" label="寵物名稱" :readonly="readonly" dense />
        </div>
        <div class="col-6">
          <q-select
            v-model="localPet.petType"
            :options="[
              { label: '狗', value: 'dog' },
              { label: '貓', value: 'cat' },
              { label: '其他', value: 'other' },
            ]"
            label="寵物種類"
            :readonly="readonly"
            dense
            emit-value
            map-options
            clearable
          />
        </div>
        <div class="col-6">
          <q-input v-model="localPet.petBreed" label="品種" :readonly="readonly" dense />
        </div>
        <div class="col-6">
          <q-select
            v-model="localPet.petGender"
            :options="[
              { label: '公', value: 'male' },
              { label: '母', value: 'female' },
            ]"
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
            v-model.number="localPet.petAge"
            label="年齡（歲）"
            :readonly="readonly"
            type="number"
            dense
          />
        </div>
        <div class="col-6">
          <q-input
            v-model.number="localPet.petWeight"
            label="體重（kg）"
            :readonly="readonly"
            type="number"
            dense
          />
        </div>
        <div class="col-12">
          <q-input
            v-model="localPet.petNote"
            label="備註"
            :readonly="readonly"
            type="textarea"
            autogrow
            dense
          />
        </div>
        <div class="col-12">
          <q-input
            v-model="localOwnerName"
            label="飼主"
            :hint="localOwnerName ? '' : '點擊選擇飼主'"
            readonly
            dense
            @click="onOwner"
          >
            <template v-if="localOwnerName && localPet.id !== 'create'" v-slot:append>
              <q-icon name="chevron_right" />
            </template>
          </q-input>
        </div>
        <div class="col-6">
          <q-input v-model="localPet.created_at" label="建立時間" readonly dense />
        </div>
        <div class="col-6">
          <q-input v-model="localPet.updated_at" label="更新時間" readonly dense />
        </div>
      </div>
    </q-card-section>
    <q-card-section v-else> 目前尚未有該寵物資料</q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue';
import type { IPet } from '../types/pet';

const props = defineProps<{
  pet: IPet;
  readonly: boolean;
  ownerName: string;
}>();

const emit = defineEmits(['update:pet', 'onOwner']);
const localPet = reactive({ ...props.pet });

const localOwnerName = computed(() => props.ownerName);

watch(
  () => props.pet,
  (newVal) => {
    Object.assign(localPet, newVal);
  },
  { deep: true, immediate: true },
);

watch(
  localPet,
  (val) => {
    emit('update:pet', { ...val }); // 送一份淺拷貝
  },
  { deep: true },
);

function onOwner() {
  emit('onOwner');
}
</script>
