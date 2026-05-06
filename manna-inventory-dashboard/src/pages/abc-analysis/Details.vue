<script>
export default {
    data() {
        return {
            data: [
                {
                    id: 1,
                    nama: "moiaa swiss choco 1000 grm",
                    total_penjualan: 589118926,
                    akumulasi_penjualan: 589118926,
                    persentase_akumulasi: "6.99%",
                },
                {
                    id: 2,
                    nama: "moiaa mango 1000 grm",
                    total_penjualan: 537665506,
                    akumulasi_penjualan: 1126784432,
                    persentase_akumulasi: "13.38%",
                },
                {
                    id: 3,
                    nama: "moiaa strawberry 1000 grm",
                    total_penjualan: 371179321,
                    akumulasi_penjualan: 1497963753,
                    persentase_akumulasi: "17.79%",
                },
                {
                    id: 4,
                    nama: "moiaa mango 200 grm",
                    total_penjualan: 313367568,
                    akumulasi_penjualan: 1811331321,
                    persentase_akumulasi: "21.51%",
                },
                {
                    id: 5,
                    nama: "moiaa swiss choco 200 grm",
                    total_penjualan: 298431944,
                    akumulasi_penjualan: 2109763265,
                    persentase_akumulasi: "25.05%",
                },
                {
                    id: 6,
                    nama: "moiaa strawberry 200 grm",
                    total_penjualan: 223642339,
                    akumulasi_penjualan: 2333405604,
                    persentase_akumulasi: "27.71%",
                },
                {
                    id: 7,
                    nama: "sbc capucino original 1000 grm",
                    total_penjualan: 219054405,
                    akumulasi_penjualan: 2552460009,
                    persentase_akumulasi: "30.31%",
                },
                {
                    id: 8,
                    nama: "moiaa taro 1000 grm",
                    total_penjualan: 204491088,
                    akumulasi_penjualan: 2756951097,
                    persentase_akumulasi: "32.73%",
                },
                {
                    id: 9,
                    nama: "moiaa choco almond 200 grm",
                    total_penjualan: 203786560,
                    akumulasi_penjualan: 2960737657,
                    persentase_akumulasi: "35.15%",
                },
                {
                    id: 10,
                    nama: "moiaa taro 200 grm",
                    total_penjualan: 195107054,
                    akumulasi_penjualan: 3155844711,
                    persentase_akumulasi: "37.47%",
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
        totalBarang() {
            return this.data.length;
        },
        totalNilai() {
            return this.data.reduce((total, item) => total + item.total_penjualan, 0);
        },
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
        <div class="flex items-center justify-between mb-6 gap-2">
            <router-link to="/abc-analysis"
                class="h-12 inline-flex items-center rounded-lg p-2 font-farro text-gray-600 hover:bg-gray-200 hover:text-gray-700 transition duration-200 flex-shrink-0"
            >
                <Icon icon="mdi:arrow-left" class="text-[2rem] text-center"></Icon>
            </router-link>
            <div class="w-[28rem]">
                <div class="flex justify-around rounded-2xl border-2 border-primary bg-primary-50 p-4 shadow-sm">
                    <div class="font-farro text-md text-gray-500">Total Barang: <span class="font-farro text-md font-bold text-black">{{ totalBarang }}</span></div>
                    <div class="font-farro text-md text-gray-500">Total Nilai: <span class="font-farro text-md font-bold text-black">{{ formatCurrency(totalNilai) }}</span></div>
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
