<script setup>
import { ref } from "vue";

import AppMenuItem from "./AppMenuItem.vue";

const model = ref([
  {
    items: [
      { label: 'Dashboard', icon: 'mdi:home', to: '/dashboard' },
      { label: 'Master Data', icon: 'mdi:database', 
      items: [
        { label: 'Kategori Barang', icon:'mdi:category', to: '/kategori-barang' },
        { label: 'Barang', icon: 'mdi:package', to: '/barang' },
      ]
    },
    { label: 'Stok Opname', icon: 'mdi:clipboard-list', to:'/stock-opname' },
    { label: 'Transaksi', icon: 'mdi:receipt-text', to: '/transaksi'},
    { label: 'Analisis', icon: 'mdi:analytics', items: [
      { label: 'Analisis ABC', icon: 'mdi:chart-pie', to: '/abc-analysis' },
      { label: 'Analisis Persediaan', icon: 'mdi:chart-finance', to: '/stock-analysis' },
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
