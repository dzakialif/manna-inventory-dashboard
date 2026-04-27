<script setup lang="ts">
import { Icon } from '@iconify/vue';

</script>

<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card h-full bg-white mb-0 transition duration-200 hover:scale-105">
            <div class="flex justify-between mb-4">
                <div class="font-farro text-center">
                    <span class="block text-black text-2xl font-bold mb-4">Total Barang</span>
                    <div class="text-black text-2xl font-bold">152</div>
                </div>
                <div class="flex items-center justify-center bg-success-50 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <Icon icon="mdi:package" class="text-primary !text-4xl"></Icon>
                </div>
            </div>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card h-full bg-white mb-0 transition duration-200 hover:scale-105">
            <div class="flex justify-between mb-4">
                <div class="font-farro text-center">
                    <span class="block text-black text-2xl font-bold mb-4">Total Stok</span>
                    <div class="text-black text-2xl font-bold">28441</div>
                </div>
                <div class="flex items-center justify-center bg-info-50 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <Icon icon="mdi:box-variant-closed" class="text-info !text-4xl"></Icon>
                </div>
            </div>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card h-full bg-white mb-0 transition duration-200 hover:scale-105">
            <div class="flex justify-between mb-4">
                <div class="font-farro text-center">
                    <span class="block text-black text-2xl font-bold mb-4">Nilai Penjualan</span>
                    <div class="text-black text-2xl font-bold">$2.100</div>
                </div>
                <div class="flex items-center justify-center bg-warning-50 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <Icon icon="mdi:dollar" class="text-warning !text-4xl"></Icon>
                </div>
            </div>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card h-full bg-white mb-0 transition duration-200 hover:scale-105">
            <div class="flex justify-between mb-4">
                <div class="font-farro text-center">
                    <span class="block text-black text-2xl font-bold mb-4">Perlu Reorder</span>
                    <div class="text-black text-2xl font-bold">10</div>
                </div>
                <div class="flex items-center justify-center bg-danger-50 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <Icon icon="mdi:refresh" class="text-danger !text-4xl"></Icon>
                </div>
            </div>
        </div>
    </div>
</template>
