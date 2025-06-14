<template>
  <q-card class="q-mb-md">
    <q-card-section v-if="petGroomingRecord">
      <div class="text-subtitle1 q-mb-md">
        <q-icon name="pets" class="q-mr-xs" />
        <span class="text-subtitle1 text-bold">
          {{ petGroomingRecord.pet.name }}{{ petGroomingRecord.pet.id }}
        </span>
        的美容紀錄
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-4">
          <div class="text-subtitle2 q-mb-xs">美容師</div>
          <q-select
            v-model="petGroomingRecord.groomingRecord.groomerId"
            :options="groomerOptions"
            :readonly="readonly"
            outlined
            dense
            emit-value
            map-options
          />
        </div>
        <!-- 情緒 -->
        <div class="col-4">
          <div class="text-subtitle2 q-mb-xs">寵物當日情緒</div>
          <q-select
            v-model="petGroomingRecord.groomingRecord.mood"
            :options="moodOptions"
            :readonly="readonly"
            outlined
            dense
            emit-value
            map-options
          >
            <template v-slot:prepend v-if="petGroomingRecord.groomingRecord.mood === 'aggressive'">
              <q-icon name="warning" color="negative" />
            </template>
          </q-select>
        </div>
        <!-- 下次建議 -->
        <div class="col-4">
          <div class="text-subtitle2 q-mb-xs">建議下次美容日期：</div>
          <q-input
            v-model="petGroomingRecord.groomingRecord.nextBookingSuggestion"
            :readonly="readonly"
            type="date"
            dense
            outlined
          />
        </div>

        <!-- 皮膚狀況 -->
        <div class="col-6">
          <div class="text-subtitle2 q-mb-xs">皮膚狀況</div>
          <q-input
            v-model="petGroomingRecord.groomingRecord.skinCondition"
            :readonly="readonly"
            type="textarea"
            autogrow
            outlined
            dense
          />
        </div>
        <!-- 備註 -->
        <div class="col-6">
          <div class="text-subtitle2 q-mb-xs">備註</div>
          <q-input
            v-model="petGroomingRecord.groomingRecord.note"
            :readonly="readonly"
            type="textarea"
            autogrow
            outlined
            dense
          />
        </div>
        <!-- 服務項目 -->
        <div class="col-4">
          <div class="text-subtitle2 q-mb-xs">服務項目</div>
          <q-chip
            v-for="(item, i) in petGroomingRecord.groomingRecord.services"
            :key="i"
            color="primary"
            text-color="white"
            class="q-mr-sm q-mb-xs"
          >
            {{ item }}
          </q-chip>
        </div>
        <div class="col-8">
          <!-- 照片區 -->
          <div v-if="petGroomingRecord.groomingRecord.photos?.length" class="q-mb-md">
            <div class="text-subtitle2 q-mb-xs">美容照片</div>

            <q-img
              v-for="(url, index) in petGroomingRecord.groomingRecord.photos"
              :key="index"
              src="https://place-puppy.com/puppy/y:200/x:300"
              style="width: 300px; height: 200px"
              class="q-mr-sm q-mb-sm"
              spinner-color="primary"
              :ratio="1"
              :alt="'照片 ' + (index + 1)"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { IPetGroomingRecord } from '../../types/groomingRecord';

const readonly = defineModel<boolean>('readonly');
const petGroomingRecord = defineModel<IPetGroomingRecord | undefined>('groomingRecord');

const moodOptions = [
  { label: '冷靜', value: 'calm' },
  { label: '焦慮', value: 'anxious' },
  { label: '具攻擊性', value: 'aggressive' },
  { label: '興奮', value: 'excited' },
  { label: '疲憊', value: 'tired' },
  { label: '開心', value: 'happy' },
  { label: '無', value: 'none' },
];

const groomerOptions = [
  { label: '阿毛', value: 'gr_001' },
  { label: '小美', value: 'gr_002' },
  { label: '陳師父', value: 'gr_003' },
];
</script>
