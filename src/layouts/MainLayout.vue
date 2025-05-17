<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <Navbar />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Navbar from 'components/common/NavBar.vue';
</script>
