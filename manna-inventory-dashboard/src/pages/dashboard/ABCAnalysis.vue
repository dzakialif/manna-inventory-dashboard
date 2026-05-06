<script setup>
import Chart from "primevue/chart";

const pieChartData = {
    labels: ["Kategori A", "Kategori B", "Kategori C"],
    datasets: [
        {
            data: [80, 15, 5],
            backgroundColor: ["#037D5B", "#F59E0B", "#DC2626"],
            borderColor: "#FFFFFF",
            borderWidth: 4,
            hoverOffset: 8,
        },
    ],
};

const pieChartOptions = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label(context) {
                    return `${context.label}: ${context.parsed}%`;
                },
            },
        },
    },
};

const classificationSummary = [
    {
        label: "Kategori A",
        value: "80%",
        description: "Prioritas utama dengan kontribusi terbesar.",
        dotClass: "bg-emerald-600",
        valueClass: "text-emerald-600",
    },
    {
        label: "Kategori B",
        value: "15%",
        description: "Kategori menengah yang perlu dipantau.",
        dotClass: "bg-amber-500",
        valueClass: "text-amber-500",
    },
    {
        label: "Kategori C",
        value: "5%",
        description: "Kontribusi kecil dengan prioritas rendah.",
        dotClass: "bg-red-600",
        valueClass: "text-red-600",
    },
];
</script>

<template>
    <div class="card h-full bg-white shadow-md">
        <div class="flex items-center justify-between mb-6 border-b border-gray-300 pb-4">
            <div>
                <div class="font-bold font-farro text-xl text-black">ABC Classification</div>
                <div class="mt-1 font-farro text-sm text-gray-500">Visualisasi pembagian barang menggunakan pie chart.</div>
            </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-[320px_1fr] items-center">
            <div class="mx-auto h-72 w-full max-w-[320px]">
                <Chart type="pie" :data="pieChartData" :options="pieChartOptions" class="h-full w-full" />
            </div>

            <div class="space-y-4">
                <div
                    v-for="item in classificationSummary"
                    :key="item.label"
                    class="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4"
                >
                    <div class="flex items-start gap-3">
                        <span :class="['mt-1 h-3 w-3 rounded-full', item.dotClass]"></span>
                        <div>
                            <div class="font-farro font-bold text-black">{{ item.label }}</div>
                            <div class="mt-1 font-farro text-sm text-gray-500">{{ item.description }}</div>
                        </div>
                    </div>
                    <div class="font-farro text-lg font-bold" :class="item.valueClass">{{ item.value }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
