<script>
import { api } from '@/utils/api';
import Select from 'primevue/select';
import CustomSelect from '@/components/CustomSelect.vue';

export default {
    components: {
        Select,
        CustomSelect
    },
    data() {
        return {
            data: {
                summary: {
                    period: null,
                    totalProducts: 0,
                    totalValue: 0
                },
                categoryCount: {
                    categoryA: 0,
                    categoryB: 0,
                    categoryC: 0
                },
                detail: []
            },
            loading: false,
            currentPage: 0,
            totalPages: 0,
            pageSize: 10,
            totalItems: 0,
            filters: {
                productName: { value: null, matchMode: 'contains' },
                category: { value: null, matchMode: 'contains' },
            },
            sortField: null,
            sortOrder: null,
            productOptions: [],
            categoryOptions: [
                { label: 'Kategori A', value: 'A' },
                { label: 'Kategori B', value: 'B' },
                { label: 'Kategori C', value: 'C' }
            ],
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
            },
            runLoading: false,
        };
    },
    computed: {
        totalBarang() {
            return this.data?.summary?.totalProducts ?? 0;
        },
        totalNilai() {
            return this.data?.summary?.totalValue ?? 0;
        },
        totalKategoriA() {
            return this.data?.categoryCount?.categoryA ?? 0;
        },
        totalKategoriB() {
            return this.data?.categoryCount?.categoryB ?? 0;
        },
        totalKategoriC() {
            return this.data?.categoryCount?.categoryC ?? 0;
        }
    },
    async mounted() {
        this.loading = true;
        try {
            await Promise.all([
                this.fetchProductDropdown(),
                this.fetchABCResults(0)
            ]);
        } catch (error) {
            console.error("Gagal inisialisasi halaman:", error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async fetchProductDropdown() {
            try {
                const response = await api.get('/products/dropdown');
                this.productOptions = response.data?.data || [];
            } catch (error) {
                console.error("Gagal memuat dropdown produk:", error);
            }
        },
        async fetchABCResults(page = 0) {
            this.loading = true;
            try {
                let queryParams = `page=${page}&size=${this.pageSize}`;

                const f = this.filters;
                if (f.productName.value !== null && f.productName.value !== '') {
                    const prod = this.productOptions.find(p => p.value === f.productName.value);
                    const productName = prod ? prod.label : f.productName.value;
                    queryParams += `&productName=${encodeURIComponent(productName)}`;
                }
                if (f.category.value !== null && f.category.value !== '') {
                    queryParams += `&category=${encodeURIComponent(f.category.value)}`;
                }

                if (this.sortField && this.sortOrder !== null) {
                    let mappedSortField = this.sortField;
                    queryParams += `&sortBy=${mappedSortField}&sortDirection=${this.sortOrder === 1 ? 'asc' : 'desc'}`;
                }

                const response = await api.get(`/analysis/abc?${queryParams}`);
                const result = response.data;
                this.data = result.data || {
                    summary: { period: null, totalProducts: 0, totalValue: 0 },
                    categoryCount: { categoryA: 0, categoryB: 0, categoryC: 0 },
                    detail: []
                };

                if (result.pagging) {
                    this.currentPage = result.pagging.currentPage;
                    this.totalPages = result.pagging.totalPage;
                    this.pageSize = result.pagging.size;
                    this.totalItems = (result.pagging.totalItems !== undefined && result.pagging.totalItems !== null)
                        ? result.pagging.totalItems
                        : (result.pagging.totalPage * result.pagging.size);
                }
            } catch (error) {
                console.error("Gagal memuat data analisis ABC:", error);
                this.$toast?.add?.({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.message || "Gagal memuat data analisis ABC",
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        onPage(event) {
            this.fetchABCResults(event.page);
        },
        onSort(event) {
            this.sortField = event.sortField;
            this.sortOrder = event.sortOrder;
            this.fetchABCResults(0);
        },
        onFilter(event) {
            this.fetchABCResults(0);
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
        },
        async runABC() {
            this.runLoading = true;
            try {
                await api.post('/analysis/abc');
                this.$toast?.add?.({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Analisis ABC berhasil dijalankan. Data sedang diperbarui.',
                    life: 3000,
                });
                await this.fetchABCResults(0);
            } catch (error) {
                console.error('Gagal menjalankan analisis ABC:', error);
                this.$toast?.add?.({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: error.response?.data?.message || error.message || 'Gagal menjalankan analisis ABC',
                    life: 4000,
                });
            } finally {
                this.runLoading = false;
            }
        },
    }
};
</script>

<template>
    <div class="card">
        <!-- ── Action Bar ── -->
        <div class="flex justify-end mb-4">
            <button
                type="button"
                class="h-10 inline-flex items-center gap-2 font-farro rounded-lg bg-primary text-white px-5 text-sm hover:bg-primary-emphasis transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="runLoading"
                @click="runABC"
            >
                {{ runLoading ? 'Menjalankan...' : 'Run ABC' }}
            </button>
        </div>

        <!-- ── Section 1: Informasi & Ringkasan ── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <!-- Informasi Transaksi -->
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h6 class="font-farro font-semibold text-gray-700 mb-4 text-base">
                    <i class="pi pi-file-edit mr-2 text-primary"></i>Ringkasan
                </h6>
                <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="font-farro text-sm text-gray-500">Periode Analisis</span>
                        <span class="font-farro text-sm text-gray-800">Tahun {{ data.summary.period || '-' }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="font-farro text-sm text-gray-500">Total Barang</span>
                        <span class="font-farro text-sm font-semibold text-gray-800">{{ totalBarang }} item</span>
                    </div>
                    <div class="flex justify-between items-center py-3 mt-2 rounded-lg bg-white border border-primary px-4">
                        <span class="font-farro text-sm font-semibold text-gray-700">Total Nilai Penjualan</span>
                        <span class="font-farro text-base font-bold text-primary">{{ formatCurrency(totalNilai) }}</span>
                    </div>
                </div>
            </div>

            <!-- Total Barang Per Kategori -->
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h6 class="font-farro font-semibold text-gray-700 mb-4 text-base">
                    <i class="pi pi-chart-pie mr-2 text-primary"></i>Total Barang Per Kategori
                </h6>
                <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                            <span class="font-farro text-sm text-gray-500">Kategori A</span>
                        </div>
                        <span class="font-farro text-sm font-semibold text-gray-800">{{ totalKategoriA }} item</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                            <span class="font-farro text-sm text-gray-500">Kategori B</span>
                        </div>
                        <span class="font-farro text-sm font-semibold text-gray-800">{{ totalKategoriB }} item</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-red-500"></span>
                            <span class="font-farro text-sm text-gray-500">Kategori C</span>
                        </div>
                        <span class="font-farro text-sm font-semibold text-gray-800">{{ totalKategoriC }} item</span>
                    </div>
                </div>
            </div>
        </div>

        <DataTable
            class="barang-datatable font-farro text-sm"
            :value="data.detail"
            lazy
            removableSort
            :totalRecords="totalItems"
            @page="onPage"
            @sort="onSort"
            @filter="onFilter"
            v-model:filters="filters"
            filterDisplay="row"
            :paginator="true"
            :rows="pageSize"
            dataKey="productName"
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
                field="productName"
                header="Nama Barang"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari nama barang..."
                style="min-width: 18rem"
            >
                <template #body="{ data }">{{ data.productName }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <CustomSelect
                        v-model="filterModel.value"
                        :options="productOptions"
                        optionLabel="label"
                        optionValue="value"
                        @change="filterCallback()"
                        placeholder="Pilih nama barang"
                        showClear
                        filter
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="totalValue"
                header="Total Penjualan"
                sortable
                style="min-width: 14rem"
            >
                <template #body="{ data }">{{ formatCurrency(data.totalValue) }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="accumulate"
                header="Akumulasi Penjualan"
                sortable
                style="min-width: 16rem"
            >
                <template #body="{ data }">{{ formatCurrency(data.accumulate) }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="pctAccumulate"
                header="Persentase Akumulasi"
                sortable
                style="min-width: 14rem"
            >
                <template #body="{ data }">{{ data.pctAccumulate }}%</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="category"
                header="Kategori"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari kategori..."
                style="min-width: 12rem"
            >
                <template #body="{ data }">
                    <span v-if="data.category === 'A'" class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">Kategori A</span>
                    <span v-else-if="data.category === 'B'" class="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">Kategori B</span>
                    <span v-else-if="data.category === 'C'" class="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">Kategori C</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <CustomSelect
                        v-model="filterModel.value"
                        :options="categoryOptions"
                        optionLabel="label"
                        optionValue="value"
                        @change="filterCallback()"
                        placeholder="Pilih kategori"
                        showClear
                        filter
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style lang="scss" scoped></style>

