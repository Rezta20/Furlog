import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Dashboard', component: () => import('pages/DashboardPage.vue') },

      {
        path: '/booking/:id',
        name: 'BookingDetailPage',
        component: () => import('pages/BookingDetailPage.vue'),
      },
      {
        path: 'booking',
        name: 'BookingPage',
        component: () => import('pages/BookingPage.vue'),
      },
      {
        path: 'customer-list',
        name: 'CustomerListPage',
        component: () => import('pages/CustomerListPage.vue'),
      },
      {
        path: 'customer-list/:id',
        name: 'CustomerDetailPage',
        component: () => import('pages/CustomerDetailPage.vue'),
      },
      {
        path: 'pet-list',
        name: 'PetListPage',
        component: () => import('pages/PetListPage.vue'),
      },
      {
        path: 'pet-list/:id',
        name: 'PetDetailPage',
        component: () => import('pages/PetDetailPage.vue'),
      },
    ],
  },
  // 404 頁
  { path: '/:catchAll(.*)*', name: 'NotFound', component: () => import('pages/ErrorNotFound.vue') },
];

export default routes;
