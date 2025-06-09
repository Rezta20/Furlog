<template>
  <q-card>
    <q-card-section>
      <div class="text-subtitle1 q-mb-sm">
        <q-icon name="content_cut" class="q-mr-xs" />服務項目
      </div>

      <!-- 每隻寵物 -->
      <div v-for="group in localBooking?.services" :key="group.petId" class="q-mb-md">
        <div class="text-subtitle2 q-mb-xs">{{ findPetName(group.petId) }}</div>
        <q-list>
          <q-item v-for="s in group.items" :key="s.serviceId" class="q-pa-none">
            <q-item-section>
              <q-input
                v-model="s.serviceName"
                :readonly="readonly"
                label="服務名稱"
                dense
                outlined
              />
            </q-item-section>
            <q-item-section>
              <q-input
                v-model.number="s.price"
                :readonly="readonly"
                label="價格"
                dense
                outlined
                type="number"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <div class="text-right text-caption text-grey q-mt-sm">
          小計：NT$ {{ subtotal(group.items) }}
        </div>
      </div>

      <div class="row q-col-gutter-sm q-pt-xs">
        <q-input
          v-if="localBooking"
          class="col-6"
          label="折扣說明"
          v-model="discountType"
          :readonly="readonly"
          dense
          outlined
        />
        <q-input
          v-if="localBooking"
          class="col-6"
          label="折扣金額"
          v-model.number="discountAmount"
          :readonly="readonly"
          dense
          outlined
          type="number"
        />
      </div>

      <div class="q-mt-xs row q-col-gutter-sm">
        <div class="col-6">
          <q-input
            v-if="localBooking"
            label="總金額"
            v-model.number="totalPrice"
            :readonly="readonly"
            dense
            outlined
            type="number"
          />
        </div>
        <div class="col-6">
          <q-input
            v-if="localBooking"
            label="折扣後"
            v-model.number="finalPrice"
            :readonly="readonly"
            dense
            outlined
            type="number"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import type { IBooking, IService } from '../../types/booking';

const props = defineProps<{
  booking: IBooking;
  readonly: boolean;
}>();

const localBooking = reactive({ ...props.booking });

watch(
  () => props.booking,
  (newVal) => {
    Object.assign(localBooking, newVal);
  },
  { deep: true, immediate: true },
);

const discountType = ref(localBooking.discount?.type || '');
const discountAmount = ref(localBooking.discount?.amount || 0);

function findPetName(petId: string): string {
  return localBooking?.pet.find((p) => p.id === petId)?.name || '未知寵物';
}

// 總金額（所有寵物所有服務加總）
const totalPrice = computed(() => {
  if (!localBooking?.services) return 0;
  return localBooking.services.reduce((total, group) => {
    const subtotal = group.items.reduce((sum, item) => sum + (item.price || 0), 0);
    return total + subtotal;
  }, 0);
});

// 折扣金額（如果有填則取折扣金額）
const discountValue = computed(() => Number(discountAmount.value || 0));

// 折扣後金額
const finalPrice = computed(() => {
  return Math.max(totalPrice.value - discountValue.value, 0); // 保底 0
});

function subtotal(items: IService[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
</script>
