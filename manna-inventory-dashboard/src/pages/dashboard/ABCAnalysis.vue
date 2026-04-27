<script setup>
import { ref } from 'vue';

const menu = ref(null);

const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
]);
</script>

<template>
    <div class="card bg-white shadow-md">
        <div class="flex justify-between items-center mb-6 border-b border-gray-300 pb-4">
            <div class="font-bold font-farro text-xl text-black">Ringkasan ABC Analysis</div>
        </div>
        <ul class="list-none p-0 m-0">
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b border-gray-300 pb-4">
                <div>
                    <span class="text-black font-farro mr-2 mb-1 md:mb-0">Kategori A</span>
                    <div class="mt-1 text-info">
                        <a href="" class="font-farro text-sm hover:text-info-dark transition duration-200">Lihat Detail</a>
                    </div>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-primary-600 h-full" style="width: 80%"></div>
                    </div>
                    <span class="text-primary-600 ml-4 font-medium">%80</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b border-gray-300 pb-4">
                <div>
                    <span class="text-black font-farro mr-2 mb-1 md:mb-0">Kategori B</span>
                    <div class="mt-1 text-info">
                        <a href="" class="font-farro text-sm hover:text-info-dark transition duration-200">Lihat Detail</a>
                    </div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-warning h-full" style="width: 15%"></div>
                    </div>
                    <span class="text-warning ml-4 font-medium">%15</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b border-gray-300 pb-4">
                <div>
                    <span class="text-black font-farro mr-2 mb-1 md:mb-0">Kategori C</span>
                    <div class="mt-1 text-info">
                        <a href="" class="font-farro text-sm hover:text-info-dark transition duration-200">Lihat Detail</a>
                    </div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-danger h-full" style="width: 5%"></div>
                    </div>
                    <span class="text-danger ml-4 font-medium">%5</span>
                </div>
            </li>
        </ul>
    </div>
</template>
