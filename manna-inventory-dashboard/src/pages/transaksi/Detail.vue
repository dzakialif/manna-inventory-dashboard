<script>
export default {
    data() {
        return {
            transaksi: null,
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
            },
        };
    },
    computed: {
        totalBarang() {
            return this.transaksi?.items?.length ?? 0;
        },
        totalJumlah() {
            return this.transaksi?.items?.reduce((sum, item) => sum + (Number(item.jumlah) || 0), 0) ?? 0;
        },
        totalNilai() {
            return this.transaksi?.items?.reduce((sum, item) => sum + (item.jumlah * item.harga), 0) ?? 0;
        },
        jenisLabel() {
            const map = { Masuk: "Barang Masuk", Keluar: "Barang Keluar", Opname: "Stock Opname" };
            return map[this.transaksi?.jenis] ?? this.transaksi?.jenis ?? "-";
        },
        jenisBadgeClass() {
            const map = {
                Masuk: "bg-primary-50 text-primary border border-primary-200",
                Keluar: "bg-danger-50 text-danger border border-danger-200",
                Opname: "bg-info-50 text-info border border-info-200",
            };
            return map[this.transaksi?.jenis] ?? "bg-gray-100 text-gray-600";
        },
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.loading = true;
            // Dummy data — replace with API call
            setTimeout(() => {
                this.transaksi = {
                    id: 1,
                    tanggal: "2026-04-03",
                    no_invoice: "IN-INV-202604-0001",
                    jenis: "Masuk",
                    dokumen: "Faktur Penjualan",
                    user: "Rina - Admin Gudang",
                    items: [
                        {
                            kode_barang: "BRG001",
                            nama: "Moiaa Swiss Choco 1000 grm",
                            kategori: "Moiaa",
                            jumlah: 10,
                            harga: 15000000,
                        },
                        {
                            kode_barang: "BRG002",
                            nama: "Moiaa Mango 1000 grm",
                            kategori: "Moiaa",
                            jumlah: 5,
                            harga: 800000,
                        },
                        {
                            kode_barang: "BRG003",
                            nama: "SBC Cappucino Original 1000 grm",
                            kategori: "SBC",
                            jumlah: 8,
                            harga: 1200000,
                        },
                        {
                            kode_barang: "BRG007",
                            nama: "SBC Green Tea 500 grm",
                            kategori: "SBC",
                            jumlah: 3,
                            harga: 1800000,
                        },
                    ],
                };
                this.loading = false;
            }, 300);
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(value || 0);
        },
        formatDate(dateStr) {
            if (!dateStr) return "-";
            const date = new Date(dateStr);
            return date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
        },
        getTotalHarga(item) {
            return (Number(item.jumlah) || 0) * (Number(item.harga) || 0);
        },
    },
};
</script>

<template>
    <div class="card">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
            <router-link
                to="/transaksi"
                class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 transition"
            >
                <i class="pi pi-arrow-left text-sm"></i>
            </router-link>
            <div>
                <h6 class="text-xl font-farro font-bold leading-tight">Detail Transaksi</h6>
                <span v-if="transaksi" class="text-sm font-farro text-gray-400">{{ transaksi.no_invoice }}</span>
            </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20 text-gray-400 font-farro">
            <i class="pi pi-spin pi-spinner mr-2"></i> Memuat data...
        </div>

        <template v-else-if="transaksi">

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

            <!-- ── Section 2: Detail Barang ── -->
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h6 class="font-farro font-semibold text-gray-700 mb-4 text-base">
                    <i class="pi pi-list mr-2 text-primary"></i>Detail Barang
                </h6>

                <DataTable
                    class="font-farro text-sm"
                    :value="transaksi.items"
                    :loading="loading"
                    :pt="{
                        root: { class: 'font-farro' },
                        tableContainer: { class: '!bg-white !rounded-lg' },
                        table: { class: 'font-farro' },
                    }"
                >
                    <template #empty>
                        <div class="text-center py-8 text-gray-400 font-farro">Tidak ada data barang.</div>
                    </template>

                    <Column :pt="columnPt" header="No" style="min-width: 4rem">
                        <template #body="slotProps">
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>

                    <Column :pt="columnPt" field="kode_barang" header="Kode Barang" style="min-width: 10rem">
                        <template #body="{ data }">
                            <span class="font-farro font-medium text-primary">{{ data.kode_barang }}</span>
                        </template>
                    </Column>

                    <Column :pt="columnPt" field="nama" header="Nama Barang" style="min-width: 16rem">
                        <template #body="{ data }">{{ data.nama }}</template>
                    </Column>

                    <Column :pt="columnPt" field="kategori" header="Kategori" style="min-width: 8rem">
                        <template #body="{ data }">
                            <span class="font-farro text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                {{ data.kategori }}
                            </span>
                        </template>
                    </Column>

                    <Column :pt="columnPt" field="jumlah" header="Jumlah" style="min-width: 7rem">
                        <template #body="{ data }">{{ data.jumlah }} unit</template>
                    </Column>

                    <Column :pt="columnPt" field="harga" header="Harga Satuan" style="min-width: 12rem">
                        <template #body="{ data }">{{ formatCurrency(data.harga) }}</template>
                    </Column>

                    <Column :pt="columnPt" header="Total Harga" style="min-width: 12rem">
                        <template #body="{ data }">
                            <span class="font-farro font-semibold text-gray-800">
                                {{ formatCurrency(getTotalHarga(data)) }}
                            </span>
                        </template>
                    </Column>
                </DataTable>

                <!-- Table Footer: Grand Total -->
                <div class="flex justify-end mt-4 pt-4 border-t border-gray-200">
                    <div class="flex items-center gap-4 font-farro text-sm">
                        <span class="text-gray-500">Grand Total</span>
                        <span class="text-lg font-bold text-primary">{{ formatCurrency(totalNilai) }}</span>
                    </div>
                </div>
            </div>

        </template>

        <div v-else class="text-center py-20 text-gray-400 font-farro">
            Data transaksi tidak ditemukan.
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>
