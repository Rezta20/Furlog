<template>
  <q-page padding>
    <h2>儀表板</h2>
    <q-card>
      <q-card-section> 今日預約：{{ todayCount }} </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useBookingStore } from 'stores/useBookingStore';

onMounted(() => {
  bookingStore.loadFromJson();
});

const bookingStore = useBookingStore();
const today = new Date().toISOString().slice(0, 10);
const todayCount = computed(() => bookingStore.list.filter((b) => b.date === today).length);
</script>
