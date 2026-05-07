<script>
export default {
    data() {
        return {
            detail: null,
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
        totalBarang() {
            return this.detail?.data?.length ?? 0;
        },
        totalNilai() {
            return this.detail?.data?.reduce((sum, item) => sum + (item.total_penjualan), 0) ?? 0;
        },
    },
    methods: {
        loadData() {
            this.loading = true;
            
            setTimeout(() => {
                this.detail = {
                data: [
                    {
                        id: 1,
                        nama: "moiaa swiss choco 1000 grm",
                        total_penjualan: 589118926,
                        akumulasi_penjualan: 589118926,
                        persentase_akumulasi: "6.99%",
                        kategori: "A"
                    },
                    {
                        id: 2,
                        nama: "moiaa mango 1000 grm",
                        total_penjualan: 537665506,
                        akumulasi_penjualan: 1126784432,
                        persentase_akumulasi: "13.38%",
                        kategori: "A"
                    },
                    {
                        id: 3,
                        nama: "moiaa strawberry 1000 grm",
                        total_penjualan: 371179321,
                        akumulasi_penjualan: 1497963753,
                        persentase_akumulasi: "17.79%",
                        kategori: "A"
                    },
                    {
                        id: 4,
                        nama: "moiaa mango 200 grm",
                        total_penjualan: 313367568,
                        akumulasi_penjualan: 1811331321,
                        persentase_akumulasi: "21.51%",
                        kategori: "A"
                    },
                    {
                        id: 5,
                        nama: "moiaa swiss choco 200 grm",
                        total_penjualan: 298431944,
                        akumulasi_penjualan: 2109763265,
                        persentase_akumulasi: "25.05%",
                        kategori: "A"
                    },
                    {
                        id: 6,
                        nama: "moiaa strawberry 200 grm",
                        total_penjualan: 223642339,
                        akumulasi_penjualan: 2333405604,
                        persentase_akumulasi: "27.71%",
                        kategori: "A"
                    },
                    {
                        id: 7,
                        nama: "sbc capucino original 1000 grm",
                        total_penjualan: 219054405,
                        akumulasi_penjualan: 2552460009,
                        persentase_akumulasi: "30.31%",
                        kategori: "A"
                    },
                    {
                        id: 8,
                        nama: "moiaa taro 1000 grm",
                        total_penjualan: 204491088,
                        akumulasi_penjualan: 2756951097,
                        persentase_akumulasi: "32.73%",
                        kategori: "A"
                    },
                    {
                        id: 9,
                        nama: "moiaa choco almond 200 grm",
                        total_penjualan: 203786560,
                        akumulasi_penjualan: 2960737657,
                        persentase_akumulasi: "35.15%",
                        kategori: "A"
                    },
                    {
                        id: 10,
                        nama: "moiaa taro 200 grm",
                        total_penjualan: 195107054,
                        akumulasi_penjualan: 3155844711,
                        persentase_akumulasi: "37.47%",
                        kategori: "A"
                    },
                ],
            };
            this.loading = false;
            }, 500);
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
                to="/abc-analysis"
                class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 transition"
            >
                <i class="pi pi-arrow-left text-sm"></i>
            </router-link>
            <div>
                <h6 class="text-xl font-farro font-bold leading-tight">Detail Kategori A</h6>
                <span class="text-sm font-farro text-gray-400">Barang dengan nilai tertinggi</span>
            </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20 text-gray-400 font-farro">
            <i class="pi pi-spin pi-spinner mr-2"></i> Memuat data...
        </div>

        <template v-else-if="detail">   
            <!-- ── Section 1: Informasi & Ringkasan ── -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

                <!-- Informasi Transaksi -->
                <div class="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <h6 class="font-farro font-semibold text-gray-700 mb-4 text-base">
                        <i class="pi pi-file-edit mr-2 text-primary"></i>Informasi Transaksi
                    </h6>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="font-farro text-sm text-gray-500">No. Invoice</span>
                            <span class="font-farro text-sm font-bold text-gray-800">{{ transaksi.no_invoice }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="font-farro text-sm text-gray-500">Tanggal</span>
                            <span class="font-farro text-sm text-gray-800">{{ formatDate(transaksi.tanggal) }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="font-farro text-sm text-gray-500">Jenis Transaksi</span>
                            <span
                                class="font-farro text-xs font-semibold px-3 py-1 rounded-full"
                                :class="jenisBadgeClass"
                            >
                                {{ jenisLabel }}
                            </span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="font-farro text-sm text-gray-500">Dokumen</span>
                            <span class="font-farro text-sm text-gray-800">{{ transaksi.dokumen ?? "-" }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="font-farro text-sm text-gray-500">Dibuat oleh</span>
                            <span class="font-farro text-sm text-gray-800">{{ transaksi.user ?? "-" }}</span>
                        </div>
                    </div>
                </div>

                <!-- Ringkasan Transaksi -->
                <div class="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <h6 class="font-farro font-semibold text-gray-700 mb-4 text-base">
                        <i class="pi pi-calculator mr-2 text-primary"></i>Ringkasan Transaksi
                    </h6>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="font-farro text-sm text-gray-500">Total Jenis Barang</span>
                            <span class="font-farro text-sm font-semibold text-gray-800">{{ totalBarang }} item</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="font-farro text-sm text-gray-500">Total Jumlah Barang</span>
                            <span class="font-farro text-sm font-semibold text-gray-800">{{ totalJumlah }} unit</span>
                        </div>
                        <div class="flex justify-between items-center py-3 mt-2 rounded-lg bg-white border border-primary px-4">
                            <span class="font-farro text-sm font-semibold text-gray-700">Total Nilai Transaksi</span>
                            <span class="font-farro text-base font-bold text-primary">{{ formatCurrency(totalNilai) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

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
                field="nama"
                header="Nama Barang"
                sortable
                style="min-width: 18rem"
            >
                <template #body="{ data }">{{ data.nama }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="total_penjualan"
                header="Total Penjualan"
                sortable
                style="min-width: 14rem"
            >
                <template #body="{ data }">{{ formatNumber(data.total_penjualan) }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="akumulasi_penjualan"
                header="Akumulasi Penjualan"
                sortable
                style="min-width: 16rem"
            >
                <template #body="{ data }">{{ formatNumber(data.akumulasi_penjualan) }}</template>
            </Column>
            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="persentase_akumulasi"
                header="Persentase Akumulasi"
                sortable
                style="min-width: 14rem"
            >
                <template #body="{ data }">{{ data.persentase_akumulasi }}</template>
            </Column>
        </DataTable>
    </div>
</template>

<style lang="scss" scoped></style>
