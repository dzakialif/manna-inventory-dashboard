<script>
export default {
    data() {
        return {
            barang: {
                kode_barang: "BRG001",
                nama: "Moiaa Swiss Choco 1000 grm",
                kategori: "Kategori A"
            },
            data: [
                {
                    id: 1,
                    bulan: "Januari",
                    tahun: "2024",
                    stok_aktual: 150,
                    forecast: 180,
                    safety_stock: 50,
                    reorder_point: 100,
                },
                {
                    id: 2,
                    bulan: "Februari",
                    tahun: "2024",
                    stok_aktual: 220,
                    forecast: 250,
                    safety_stock: 60,
                    reorder_point: 120,
                },
                {
                    id: 3,
                    bulan: "Maret",
                    tahun: "2024",
                    stok_aktual: 180,
                    forecast: 210,
                    safety_stock: 55,
                    reorder_point: 110,
                },
                {
                    id: 4,
                    bulan: "April",
                    tahun: "2024",
                    stok_aktual: 340,
                    forecast: 380,
                    safety_stock: 80,
                    reorder_point: 150,
                },
                {
                    id: 5,
                    bulan: "Mei",
                    tahun: "2024",
                    stok_aktual: 290,
                    forecast: 320,
                    safety_stock: 75,
                    reorder_point: 140,
                },
                {
                    id: 6,
                    bulan: "Juni",
                    tahun: "2024",
                    stok_aktual: 250,
                    forecast: 280,
                    safety_stock: 70,
                    reorder_point: 130,
                },
                {
                    id: 7,
                    bulan: "Juli",
                    tahun: "2024",
                    stok_aktual: 120,
                    forecast: 150,
                    safety_stock: 45,
                    reorder_point: 90,
                },
                {
                    id: 8,
                    bulan: "Agustus",
                    tahun: "2024",
                    stok_aktual: 160,
                    forecast: 190,
                    safety_stock: 52,
                    reorder_point: 105,
                },
                {
                    id: 9,
                    bulan: "September",
                    tahun: "2024",
                    stok_aktual: 310,
                    forecast: 350,
                    safety_stock: 78,
                    reorder_point: 145,
                },
                {
                    id: 10,
                    bulan: "Oktober",
                    tahun: "2024",
                    stok_aktual: 275,
                    forecast: 310,
                    safety_stock: 72,
                    reorder_point: 135,
                },
                {
                    id: 11,
                    bulan: "November",
                    tahun: "2024",
                    stok_aktual: 265,
                    forecast: 295,
                    safety_stock: 71,
                    reorder_point: 132,
                },
                {
                    id: 12,
                    bulan: "Desember",
                    tahun: "2024",
                    stok_aktual: 320,
                    forecast: 360,
                    safety_stock: 82,
                    reorder_point: 155,
                },
            ],
            loading: false,
            columnPt: {
                headerCell: {
                    class: "font-farro",
                    style: { fontFamily: "Farro, sans-serif" }
                },
                columnHeaderContent: {
                    class: "font-farro",
                    style: { fontFamily: "Farro, sans-serif" }
                },
                bodyCell: {
                    class: "font-farro",
                    style: { fontFamily: "Farro, sans-serif" }
                }
            }
        };
    },
    computed: {
        rataStok() {
            return Math.round(this.data.reduce((total, item) => total + item.stok_aktual, 0) / this.data.length);
        },
        rataForecast() {
            return Math.round(this.data.reduce((total, item) => total + item.forecast, 0) / this.data.length);
        },
        rataSafetyStock() {
            return Math.round(this.data.reduce((total, item) => total + item.safety_stock, 0) / this.data.length);
        },
        rataReorderPoint() {
            return Math.round(this.data.reduce((total, item) => total + item.reorder_point, 0) / this.data.length);
        }
    },
    methods: {
        formatNumber(value) {
            return new Intl.NumberFormat("id-ID").format(value);
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(value);
        }
    }
};
</script>

<template>
    <div class="card">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
            <router-link
                to="/stock-analysis"
                class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 transition"
            >
                <i class="pi pi-arrow-left text-sm"></i>
            </router-link>
            <div>
                <h6 class="text-xl font-farro font-bold leading-tight">Detail Analisis Stok</h6>
                <span class="text-sm font-farro text-gray-400">{{ barang.kode_barang }} - {{ barang.nama }}</span>
            </div>
        </div>

        <!-- ── Section 1: Informasi & Ringkasan ── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

            <!-- Informasi Barang -->
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h6 class="font-farro font-semibold text-gray-700 mb-4 text-base">
                    <i class="pi pi-box mr-2 text-primary"></i>Informasi Barang
                </h6>
                <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="font-farro text-sm text-gray-500">Kode Barang</span>
                        <span class="font-farro text-sm font-bold text-gray-800">{{ barang.kode_barang }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="font-farro text-sm text-gray-500">Nama Barang</span>
                        <span class="font-farro text-sm text-gray-800">{{ barang.nama }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                        <span class="font-farro text-sm text-gray-500">Kategori ABC</span>
                        <span class="font-farro text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                            {{ barang.kategori }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Ringkasan Analisis -->
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h6 class="font-farro font-semibold text-gray-700 mb-4 text-base">
                    <i class="pi pi-chart-line mr-2 text-primary"></i>Ringkasan Analisis (Rata-rata)
                </h6>
                <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="font-farro text-sm text-gray-500">Stok Aktual</span>
                        <span class="font-farro text-sm font-semibold text-gray-800">{{ formatNumber(rataStok) }} unit</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="font-farro text-sm text-gray-500">Forecast / Peramalan</span>
                        <span class="font-farro text-sm font-semibold text-gray-800">{{ formatNumber(rataForecast) }} unit</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="font-farro text-sm text-gray-500">Safety Stock</span>
                        <span class="font-farro text-sm font-semibold text-gray-800">{{ formatNumber(rataSafetyStock) }} unit</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                        <span class="font-farro text-sm text-gray-500">Reorder Point</span>
                        <span class="font-farro text-sm font-bold text-primary">{{ formatNumber(rataReorderPoint) }} unit</span>
                    </div>
                </div>
            </div>
        </div>
        <DataTable
            class="barang-datatable font-farro text-sm"
            :value="data"
            :paginator="true"
            :rows="10"
            :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Menampilkan {first} ke {last} dari {totalRecords} total data"
        >
            <template #empty> Data tidak ditemukan. </template>
            <template #loading> Loading data. Harap tunggu. </template>

            <Column :pt="columnPt" class="font-farro text-md" header="No" style="min-width: 5rem">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="bulan"
                header="Bulan"
                sortable
                style="min-width: 12rem"
            >
                <template #body="{ data }">{{ data.bulan }}</template>
            </Column>
           
            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="tahun"
                header="Tahun"
                sortable
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ data.tahun }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="stok_aktual"
                header="Stok Aktual"
                sortable
                style="min-width: 14rem"
            >
                <template #body="{ data }">{{ formatNumber(data.stok_aktual) }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="forecast"
                header="Forecast"
                sortable
                style="min-width: 16rem"
            >
                <template #body="{ data }">{{ formatNumber(data.forecast) }}</template>
            </Column>
            
            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="safety_stock"
                header="Safety Stock"
                sortable
                style="min-width: 16rem"
            >
                <template #body="{ data }">{{ data.safety_stock }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="reorder_point"
                header="Reorder Point"
                sortable
                style="min-width: 14rem"
            >
                <template #body="{ data }">{{ data.reorder_point }}</template>
            </Column>
        </DataTable>
    </div>
</template>

<style lang="scss" scoped></style>
