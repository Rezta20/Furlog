import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Dashboard', component: () => import('pages/DashboardPage.vue') },
      {
        path: 'pet-cards',
        name: 'PetCardWall',
        component: () => import('pages/PetCardWallPage.vue'),
      },
      {
        path: 'booking-list',
        name: 'BookingList',
        component: () => import('pages/BookingListPage.vue'),
      },
      {
        path: 'booking',
        name: 'BookingPage',
        component: () => import('pages/BookingPage.vue'),
      },
    ],
  },
  // 404 頁
  { path: '/:catchAll(.*)*', name: 'NotFound', component: () => import('pages/ErrorNotFound.vue') },
];

export default routes;
