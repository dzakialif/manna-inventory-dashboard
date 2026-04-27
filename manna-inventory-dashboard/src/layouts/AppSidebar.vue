<template>
  <div class="layout-sidebar">
    <div class="flex justify-center mb-[44px]">
      <img :src="Logo" alt="Logo" class="w-32" />
    </div>
    <app-menu></app-menu>
  </div>
</template>

<script setup>
import AppMenu from './AppMenu.vue';
import Logo from '@/assets/images/logo-mannapanna2.png'
</script>

<style lang="scss" scoped></style>
