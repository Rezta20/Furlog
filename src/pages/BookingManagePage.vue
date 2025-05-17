<template>
  <q-page padding>
    <h2>預約管理</h2>
    <q-list bordered separator>
      <q-item v-for="b in bookingStore.list" :key="b.id">
        <q-item-section> {{ b.date }} {{ b.time }} — {{ b.service }} </q-item-section>
        <q-item-section side>
          <q-chip :color="b.status === 'confirmed' ? 'green' : 'grey'">
            {{ b.status }}
          </q-chip>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { useBookingStore } from 'stores/useBookingStore';
const bookingStore = useBookingStore();
</script>
