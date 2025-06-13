<template>
  <q-card class="q-mt-md" v-if="localGroomingRecord.groomingRecord">
    <q-card-section>
      <div class="text-subtitle1 q-mb-md">
        <q-icon name="pets" class="q-mr-xs" />
        <span class="text-subtitle1 text-bold"> {{ localGroomingRecord.pet.name }} </span>
        的美容紀錄
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-4">
          <div class="text-subtitle2 q-mb-xs">美容師</div>
          <q-input
            v-model="localGroomingRecord.groomingRecord.groomerId"
            :readonly="readonly"
            dense
            outlined
          />
        </div>
        <!-- 情緒 -->
        <div class="col-4">
          <div class="text-subtitle2 q-mb-xs">寵物當日情緒</div>
          <q-select
            v-model="localGroomingRecord.groomingRecord.mood"
            :options="moodOptions"
            :readonly="readonly"
            outlined
            dense
            emit-value
            map-options
          >
            <template
              v-slot:prepend
              v-if="localGroomingRecord.groomingRecord.mood === 'aggressive'"
            >
              <q-icon name="warning" color="negative" />
            </template>
          </q-select>
        </div>
        <!-- 下次建議 -->
        <div class="col-4">
          <div class="text-subtitle2 q-mb-xs">建議下次美容日期：</div>

          <q-input
            v-model="localGroomingRecord.groomingRecord.nextBookingSuggestion"
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
            v-model="localGroomingRecord.groomingRecord.skinCondition"
            :readonly="readonly"
            type="textarea"
            autogrow
            outlined
          />
        </div>
        <!-- 備註 -->
        <div class="col-6">
          <div class="text-subtitle2 q-mb-xs">備註</div>
          <q-input
            v-model="localGroomingRecord.groomingRecord.note"
            :readonly="readonly"
            type="textarea"
            autogrow
            outlined
          />
        </div>
        <!-- 服務項目 -->
        <div class="col-4">
          <div class="text-subtitle2 q-mb-xs">服務項目</div>
          <q-chip
            v-for="(item, i) in localGroomingRecord.groomingRecord.services"
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
          <div v-if="localGroomingRecord.groomingRecord.photos?.length" class="q-mb-md">
            <div class="text-subtitle2 q-mb-xs">美容照片</div>

            <q-img
              v-for="(url, index) in localGroomingRecord.groomingRecord.photos"
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
import { reactive } from 'vue';
import { IPetGroomingRecord } from '../../types/groomingRecord';

const props = defineProps<{
  groomingRecord: IPetGroomingRecord;
  readonly: boolean;
}>();

// const emit = defineEmits(['update:pet', 'onOwner']);
const localGroomingRecord = reactive({ ...props.groomingRecord });

/**
 * 將英文情緒轉換為中文標籤
 */

const moodOptions = [
  { label: '冷靜', value: 'calm' },
  { label: '焦慮', value: 'anxious' },
  { label: '具攻擊性', value: 'aggressive' },
  { label: '興奮', value: 'excited' },
  { label: '疲憊', value: 'tired' },
  { label: '開心', value: 'happy' },
  { label: '無', value: 'none' },
];

// const localOwnerName = computed(() => props.ownerName);

// watch(
//   () => props.pet,
//   (newVal) => {
//     Object.assign(localPet, newVal);
//   },
//   { deep: true, immediate: true },
// );

// watch(
//   localPet,
//   (val) => {
//     emit('update:pet', { ...val }); // 送一份淺拷貝
//   },
//   { deep: true },
// );

// function onOwner() {
//   emit('onOwner');
// }
</script>
