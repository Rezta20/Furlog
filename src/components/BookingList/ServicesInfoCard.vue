<template>
  <q-card>
    <q-card-section>
      <div class="text-subtitle1 q-mb-sm" v-if="booking">
        <q-icon name="content_cut" class="q-mr-xs" />服務項目
      </div>

      <!-- 每隻寵物 -->
      <div v-for="group in booking?.services" :key="group.petId" class="q-mb-md">
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
        <div class="col-6"></div>
        <q-input
          class="col-6"
          label="總金額"
          v-model.number="totalPrice"
          :readonly="readonly"
          dense
          outlined
          type="number"
        />
        <q-input
          class="col-6"
          label="折扣說明"
          v-model="discountType"
          :readonly="readonly"
          dense
          outlined
        />
        <q-input
          class="col-6"
          label="折扣金額"
          v-model.number="discountAmount"
          :readonly="readonly"
          dense
          outlined
          type="number"
        />
        <div class="col-6"></div>
        <q-input
          class="col-6 text-h6"
          bg-color="orange-1"
          label="折扣後"
          v-model.number="finalPrice"
          :readonly="readonly"
          dense
          outlined
          type="number"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { IBooking, IService } from '../../types/booking';

const booking = defineModel<IBooking | undefined>('booking');
const readonly = defineModel<boolean>('readonly');

const discountType = ref(booking.value?.discount?.type || '');
const discountAmount = ref(booking.value?.discount?.amount || 0);

function findPetName(petId: string): string {
  return booking.value?.pet.find((p) => p.id === petId)?.name || '未知寵物';
}

// 總金額（所有寵物所有服務加總）
const totalPrice = computed(() => {
  if (!booking.value || !booking.value.services) return 0;
  return booking.value.services.reduce((total, group) => {
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
