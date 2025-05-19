// src/boot/pinia.ts
import { defineBoot } from '#q-app/wrappers';
import { createPinia } from 'pinia';
import '@quasar/extras/mdi-v6';

export default defineBoot(({ app }) => {
  app.use(createPinia());
});
