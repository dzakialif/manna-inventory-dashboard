<script>
import { useLayout } from "@/layouts/composables/layout";
import Chart from "primevue/chart";
import Select from "primevue/select";

export default {
    components: {
        Chart,
        Select,
    },
    data() {
        return {
            chartOptions: null,
            chartData: null,
            topSales: [],
            selectedMonth: { name: "Januari", code: "01" },
            months: [
                { name: "Januari", code: "01" },
                { name: "Februari", code: "02" },
                { name: "Maret", code: "03" },
                { name: "April", code: "04" },
                { name: "Mei", code: "05" },
                { name: "Juni", code: "06" },
                { name: "Juli", code: "07" },
                { name: "Agustus", code: "08" },
                { name: "September", code: "09" },
                { name: "Oktober", code: "10" },
                { name: "November", code: "11" },
                { name: "Desember", code: "12" },
            ],
        };
    },
    setup() {
        const { getPrimary, getSurface, isDarkTheme } = useLayout();

        function setChartData(data) {
            return {
                labels: data.map((item) => item.product_name),
                datasets: [
                    {
                        type: "bar",
                        label: "Penjualan (Unit)",
                        backgroundColor: "#037D5B",
                        data: data.map((item) => item.total_sales),
                        barThickness: 32,
                    },
                ],
            };
        }

        function setChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textMutedColor = documentStyle.getPropertyValue("--text-color-secondary");

            return {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: textMutedColor,
                        },
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            color: textMutedColor,
                        },
                        grid: {
                            display: false,
                        },
                    },
                },
            };
        }

        return {
            getPrimary,
            getSurface,
            isDarkTheme,
            setChartData,
            setChartOptions,
        };
    },
    methods: {
        loadDummyData() {
            this.topSales = [
                { product_name: "Moiaa Swiss Choco 1000 grm", total_sales: 500 },
                { product_name: "Moiaa Mango 200 grm", total_sales: 230 },
                { product_name: "Moiaa Mango 1000 grm", total_sales: 400 },
                { product_name: "SBC Cappucino Original 1000 grm", total_sales: 300 },
                { product_name: "Moiaa Swiss Choco 200 grm", total_sales: 310 }
            ];
            this.chartData = this.setChartData(this.topSales);
        },
    },
    mounted() {
        this.chartOptions = this.setChartOptions();
        this.loadDummyData();
},
    watch: {
        selectedMonth() {
            this.loadDummyData();
        },
        getPrimary() {
            this.chartData = this.setChartData(this.topSales);
            this.chartOptions = this.setChartOptions();
        },
        getSurface() {
            this.chartData = this.setChartData(this.topSales);
            this.chartOptions = this.setChartOptions();
        },
        isDarkTheme() {
            this.chartData = this.setChartData(this.topSales);
            this.chartOptions = this.setChartOptions();
        },
    },
};
</script>

<template>
    <div class="card">
        <div class="flex justify-between">
            <div class="font-bold font-farro text-xl mb-4">Top Penjualan Bulanan</div>
            <Select
                v-model="selectedMonth"
                :options="months"
                optionLabel="name"
                placeholder="Pilih Bulan"
                class="font-farro"
                :pt="{
                    root: { class: '!bg-white !text-black !border !border-gray-300 !rounded-md !h-10 !min-w-40' },
                    label: { class: '!text-black' },
                    dropdown: { class: '!text-black !bg-white' },
                    overlay: { class: 'summary-month-overlay !bg-white !text-black !border !border-gray-200 !shadow-md' },
                    listContainer: { class: 'summary-month-scroll !bg-white' },
                    list: { class: '!bg-white' },
                    option: { class: '!text-black !font-farro !bg-white hover:!bg-surface-hover' },
                    optionLabel: { class: '!text-black' },
                    emptyMessage: { class: '!text-black !bg-white' }
                }"
            />
        </div>

        <Chart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            class="h-80 font-farro"
        />
    </div>
</template>

<style lang="scss" scoped>
.card {
    background: white !important;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>

<style lang="scss">
.summary-month-overlay,
.summary-month-overlay .p-select-list,
.summary-month-overlay .p-select-list-container {
    background: #ffffff !important;
}

.summary-month-overlay .summary-month-scroll {
    scrollbar-color: #cbd5e1 #ffffff;
}

.summary-month-overlay .summary-month-scroll::-webkit-scrollbar {
    width: 10px;
}

.summary-month-overlay .summary-month-scroll::-webkit-scrollbar-track {
    background: #ffffff;
}

.summary-month-overlay .summary-month-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 9999px;
    border: 2px solid #ffffff;
}

.summary-month-overlay .summary-month-scroll::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>