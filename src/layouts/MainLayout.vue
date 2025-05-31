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

      <!-- Drawer：可縮起，藍底白字 -->
      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="!drawer || miniState"
        @click.capture="drawerClick"
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
              <q-item-section v-if="!miniState">
                {{ item.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <!-- Mini 切換按鈕 -->
        <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
          <q-btn
            dense
            round
            unelevated
            color="accent"
            icon="chevron_left"
            @click="miniState = true"
          />
        </div>
      </q-drawer>

      <!-- 主要頁面 -->
      <q-page-container class="bg-grey-1 text-dark">
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Drawer 開關與 mini 狀態
const drawer = ref(false);
const miniState = ref(true);

function drawerClick(e: Event) {
  if (miniState.value) {
    miniState.value = false;
    e.stopPropagation();
  }
}

// 導覽選單
const menuList = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: '預約清單', to: '/booking-list', icon: 'list_alt' },
  { label: '預約系統', to: '/booking', icon: 'today' },
  { label: '顧客清單', to: '/customer-list', icon: 'people' },
  { label: '寵物清單', to: '/pet-list', icon: 'pets' },
  // { label: '設定', to: '/settings', icon: 'settings' },
];
</script>
