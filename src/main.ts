import { createApp } from 'vue';
import App from './App.vue';

import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';

import { createPinia } from 'pinia';

import createRouter from './router';

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(Quasar, quasarUserOptions);
  app.use(pinia);

  // 👉 傳一個空 createRouter
  const router = await createRouter({});
  app.use(router);

  app.mount('#q-app');
}

// 👉 用 void 標記，消除 ESLint “浮動 Promise” 報錯
void bootstrap();
