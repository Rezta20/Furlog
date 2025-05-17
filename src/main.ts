import { createApp } from 'vue';
import App from './App.vue';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';
import { createPinia } from 'pinia';
import createRouter from './router';

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.use(Quasar, quasarUserOptions);

  // 這裡要 await，不能給 {}
  const router = await createRouter({ store: pinia }); // 若 defineRouter 真的有用到 store
  app.use(router);

  app.mount('#q-app');
}

void bootstrap();
