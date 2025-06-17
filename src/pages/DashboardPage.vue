<template>
  <q-page padding>
    <div class="flex justify-between">
      <q-breadcrumbs class="q-mb-xs text-h6 text-bold">
        <q-breadcrumbs-el label="儀表板" />
      </q-breadcrumbs>
    </div>

    <q-card>
      <q-card-section> 今日預約：{{ todayCount }} </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBookingStore } from 'stores/useBookingStore';

const bookingStore = useBookingStore();
const today = new Date().toISOString().slice(0, 10);
const todayCount = computed(() => bookingStore.list.filter((b) => b.date === today).length);
</script>
