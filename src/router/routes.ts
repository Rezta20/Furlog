import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'booking', name: 'Booking', component: () => import('pages/BookingManagePage.vue') },
      {
        path: 'pet-cards',
        name: 'PetCardWall',
        component: () => import('pages/PetCardWallPage.vue'),
      },
    ],
  },
  // 404 頁
  { path: '/:catchAll(.*)*', name: 'NotFound', component: () => import('pages/ErrorNotFound.vue') },
];

export default routes;
