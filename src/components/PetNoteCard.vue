<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">{{ pet?.name }}</div>
      <q-chip
        v-for="(tag, i) in pet?.tags || []"
        :key="i"
        color="orange"
        text-color="white"
        size="sm"
        class="q-mx-xs"
      >
        {{ tag }}
      </q-chip>
      <q-icon v-if="petNote" name="info" color="warning" size="sm" class="q-mx-xs">
        <q-tooltip>{{ petNote }}</q-tooltip>
      </q-icon>
      <span v-if="petNote">{{ briefNote }}</span>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
  pet: Object, // 來自 pets.json
  petNote: String, // 可選，若有額外備註
});
const briefNote = computed(() =>
  props.petNote && props.petNote.length > 10 ? props.petNote.slice(0, 10) + '...' : props.petNote,
);
</script>
