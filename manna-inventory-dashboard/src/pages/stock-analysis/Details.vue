<script>
export default {
    data() {
        return {
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
        totalBarang() {
            return this.data.length;
        },
        totalNilai() {
            return this.data.reduce((total, item) => total + item.stok_aktual, 0);
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
            <router-link to="/stock-analysis"
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
