<template>
  <div class="layout-sidebar">
    <div class="flex justify-center mb-10">
      <img :src="Logo" alt="Logo" class="w-36" />
    </div>
    <app-menu></app-menu>
  </div>
</template>

<script setup>
import AppMenu from './AppMenu.vue';
import Logo from '@/assets/images/manna-logo.png'
</script>

<style lang="scss" scoped></style>
