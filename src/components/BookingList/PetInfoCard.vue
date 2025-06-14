<template>
  <q-card>
    <q-card-section>
      <div class="text-subtitle1 q-mb-sm">
        <q-icon name="pets" class="q-mr-xs" />
        寵物資訊
      </div>

      <template v-if="booking">
        <div
          v-for="(pet, index) in booking.pet"
          :key="pet.id"
          class="q-mb-md q-pa-sm q-rounded bordered row q-col-gutter-md"
        >
          <div class="col-12 text-subtitle2 text-weight-medium">寵物 {{ index + 1 }}</div>

          <div class="col-4">
            <q-input label="姓名" v-model="pet.name" :readonly="readonly" dense outlined />
          </div>

          <div class="col-4">
            <q-select
              label="種類"
              v-model="pet.petType"
              :options="petTypes"
              :readonly="readonly"
              dense
              outlined
            />
          </div>

          <div class="col-4">
            <q-input label="品種" v-model="pet.petBreed" :readonly="readonly" dense outlined />
          </div>

          <div class="col-4">
            <q-select
              label="性別"
              v-model="pet.petGender"
              :options="petGenders"
              :readonly="readonly"
              dense
              outlined
            />
          </div>

          <div class="col-4">
            <q-input
              label="年齡"
              type="number"
              v-model.number="pet.petAge"
              :readonly="readonly"
              dense
              outlined
            />
          </div>

          <div class="col-4">
            <q-input
              label="體重(kg)"
              type="number"
              v-model.number="pet.petWeight"
              :readonly="readonly"
              dense
              outlined
            />
          </div>

          <div class="col-12">
            <q-input
              label="寵物備註"
              v-model="pet.petNote"
              :readonly="readonly"
              type="textarea"
              autogrow
              outlined
            />
          </div>

          <div class="col-12">
            <q-input
              label="健康提醒"
              v-model="pet.healthReminder"
              :readonly="readonly"
              type="textarea"
              autogrow
              outlined
            />
          </div>

          <div class="col-4">
            <q-select
              label="是否攻擊"
              v-model="pet.isAttack"
              :options="boolOptions"
              :readonly="readonly"
              dense
              outlined
              emit-value
              map-options
            />
          </div>

          <div class="col-8">
            <q-input
              label="攻擊行為備註"
              v-model="pet.attackNote"
              :readonly="readonly"
              :disable="!pet.isAttack"
              outlined
              autogrow
              dense
            />
          </div>
        </div> </template></q-card-section
  ></q-card>
</template>
<script setup lang="ts">
import type { IBooking } from '../../types/booking';

const booking = defineModel<IBooking | undefined>('booking');
const readonly = defineModel<boolean>('readonly');

const petTypes = [
  { label: '狗', value: 'dog' },
  { label: '貓', value: 'cat' },
  { label: '其他', value: 'other' },
];
const petGenders = [
  { label: '公', value: 'male' },
  { label: '母', value: 'female' },
];
const boolOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
];
</script>
