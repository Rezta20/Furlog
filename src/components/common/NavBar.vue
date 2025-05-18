<template>
  <div>
    <q-layout view="hHh Lpr lff" container style="height: 100vh">
      <!-- Header：白底主色字 -->
      <q-header elevated class="bg-indigo-6 text-white">
        <q-toolbar>
          <q-btn
            flat
            @click="drawer = !drawer"
            round
            dense
            icon="menu"
            aria-label="Menu"
            class="q-mr-sm"
          />
          <q-toolbar-title>Furlog</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <!-- Drawer：藍底白字 -->
      <q-drawer
        v-model="drawer"
        show-if-above
        :width="220"
        :breakpoint="500"
        bordered
        class="bg-blue-grey-1 text-indigo-8"
      >
        <q-scroll-area class="fit">
          <q-list>
            <q-item
              v-for="item in menuList"
              :key="item.label"
              clickable
              v-ripple
              :to="item.to"
              exact
              active-class="q-item--active bg-indigo-2 text-indigo-8"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" color="indigo-6" />
              </q-item-section>
              <q-item-section>
                {{ item.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <!-- Main Page Container：背景白 -->
      <q-page-container class="bg-grey-1">
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(false);

const menuList = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: '預約管理', to: '/booking-manage', icon: 'event' },
  { label: '美容卡片牆', to: '/pet-cards', icon: 'pets' },
  { label: '預約清單', to: '/admin-bookings', icon: 'list_alt' },
  { label: '預約系統', to: '/booking', icon: 'today' },
];
</script>
