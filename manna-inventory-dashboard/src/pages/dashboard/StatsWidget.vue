<script setup>
import { Icon } from '@iconify/vue';
import { ref, onMounted } from 'vue';
import { api } from '@/utils/api';

const summary = ref({
    totalProducts: 0,
    totalStock: 0,
    totalSales: 0,
    totalNeedReorder: 0,
});

const loading = ref(true);

const formatNumber = (num) => {
    return Number(num || 0).toLocaleString('id-ID');
};

const formatRupiah = (num) => {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const fetchSummary = async () => {
    loading.value = true;
    try {
        const response = await api.get('/products/summary');
        if (response.data && response.data.data) {
            summary.value = response.data.data;
        }
    } catch (error) {
        console.error('Gagal memuat summary:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchSummary();
});
</script>

<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card h-full bg-white mb-0 transition duration-200 hover:scale-105">
            <div class="flex justify-between mb-4">
                <div class="font-farro text-left">
                    <span class="block text-gray-500 font-medium text-sm mb-2">Total Barang</span>
                    <div class="text-black text-2xl font-bold">
                        <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                        <span v-else>{{ formatNumber(summary.totalProducts) }}</span>
                    </div>
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
                <div class="font-farro text-left">
                    <span class="block text-gray-500 font-medium text-sm mb-2">Total Stok</span>
                    <div class="text-black text-2xl font-bold">
                        <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                        <span v-else>{{ formatNumber(summary.totalStock) }}</span>
                    </div>
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
                <div class="font-farro text-left">
                    <span class="block text-gray-500 font-medium text-sm mb-2">Nilai Penjualan</span>
                    <div class="text-black text-2xl font-bold">
                        <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                        <span v-else>{{ formatRupiah(summary.totalSales) }}</span>
                    </div>
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
                <div class="font-farro text-left">
                    <span class="block text-gray-500 font-medium text-sm mb-2">Perlu Reorder</span>
                    <div class="text-black text-2xl font-bold">
                        <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                        <span v-else>{{ formatNumber(summary.totalNeedReorder) }}</span>
                    </div>
                </div>
                <div class="flex items-center justify-center bg-danger-50 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <Icon icon="mdi:refresh" class="text-danger !text-4xl"></Icon>
                </div>
            </div>
        </div>
    </div>
</template>
