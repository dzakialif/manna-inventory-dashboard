<script>
import { api } from "@/utils/api";

export default {
    data() {
        return {
            barang: {
                kode_barang: "-",
                nama: "-",
                kategori: "-"
            },
            data: [],
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
        rataForecast() {
            if (!this.data.length) return 0;
            return Math.round(this.data.reduce((total, item) => total + item.forecast, 0) / this.data.length);
        },
        rataSafetyStock() {
            if (!this.data.length) return 0;
            return Math.round(this.data.reduce((total, item) => total + item.safety_stock, 0) / this.data.length);
        },
        rataReorderPoint() {
            if (!this.data.length) return 0;
            return Math.round(this.data.reduce((total, item) => total + item.reorder_point, 0) / this.data.length);
        }
    },
    async mounted() {
        await this.fetchForecastDetails();
    },
    methods: {
        async fetchForecastDetails() {
            this.loading = true;
            try {
                const productId = this.$route.params.id;
                const response = await api.get(`/analysis/forecast/${productId}`);
                const result = response.data;
                const detailData = result.data;
                
                this.barang = {
                    kode_barang: detailData.productCode || '-',
                    nama: detailData.productName || '-',
                    kategori: detailData.abcCategory || '-'
                };

                const monthNames = {
                    1: "Januari",
                    2: "Februari",
                    3: "Maret",
                    4: "April",
                    5: "Mei",
                    6: "Juni",
                    7: "Juli",
                    8: "Agustus",
                    9: "September",
                    10: "Oktober",
                    11: "November",
                    12: "Desember"
                };

                this.data = (detailData.details || []).map((detail, idx) => ({
                    id: idx + 1,
                    bulan: monthNames[detail.month] || String(detail.month),
                    tahun: String(detail.year),
                    forecast: detail.forecastResult || 0,
                    safety_stock: detail.safetyStock || 0,
                    reorder_point: detail.reorderPoint || 0
                }));
            } catch (error) {
                console.error("Gagal memuat detail analisis stok:", error);
                this.$toast?.add?.({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.message || "Gagal memuat detail analisis stok",
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
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
