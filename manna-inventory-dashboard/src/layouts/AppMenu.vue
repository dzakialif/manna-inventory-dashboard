<script setup>
import { ref } from "vue";

import AppMenuItem from "./AppMenuItem.vue";

const model = ref([
  {
    items: [
      { label: 'Dashboard', icon: 'mdi:home', to: '/dashboard' },
      { label: 'Master Data', icon: 'mdi:database', 
      items: [
        { label: 'Kategori Barang', icon:'mdi:category', to: '/collect' },
        { label: 'Barang', icon: 'mdi:package', to: '/collection-point' },
      ]
    },
    { label: 'Stok Opname', icon: 'mdi:clipboard-list', to:'/stock-opname' },
    { label: 'Transaksi', icon: 'mdi:receipt-text', 
    items: [
      { label: 'Barang Masuk', icon: 'mdi:arrow-collapse-right', to: '/collect' },
      { label: 'Barang Keluar', icon: 'mdi:arrow-collapse-left', to: '/collection-point' },
      ]
    },
    { label: 'Analisis', icon: 'mdi:analytics', items: [
      { label: 'ABC Analysis', icon: 'mdi:chart-pie', to: '/abc-analysis' },
      { label: 'Reorder Point', icon: 'mdi:refresh', to: '/rop' },
      { label: 'Forecasting', icon: 'mdi:chart-bar', to: '/forecasting' },
    ]},
    ]
  },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item
                v-if="!item.separator"
                :item="item"
                :index="i"
            ></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
