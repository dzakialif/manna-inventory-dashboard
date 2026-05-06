<script>
export default {
    data() {
        return {
            data: [
                {
                    id: 1,
                    nama: "Moiaa Swiss Choco 1000grm",
                    current_stock: 50,
                    forecast: 40,
                    safety_stock: 55,
                    rop: 60,
                    status: "Aman"
                },
                {
                    id: 2,
                    nama: "Moiaa Mango 1000grm",
                    current_stock: 64,
                    forecast: 45,
                    safety_stock: 50,
                    rop: 65,
                    status: "Waspada"
                },
                {
                    id: 3,
                    nama: "SBC Cappucino Original 1000grm",
                    current_stock: 74,
                    forecast: 60,
                    safety_stock: 65,
                    rop: 78,
                    status: "Waspada"
                },
                {
                    id: 4,
                    nama: "Moiaa Strawberry 1000grm",
                    current_stock: 75,
                    forecast: 58,
                    safety_stock: 55,
                    rop: 63,
                    status: "Perlo Reorder"
                },
                {
                    id: 5,
                    nama: "SBC Swiss Choco 1000grm",
                    current_stock: 55,
                    forecast: 40,
                    safety_stock: 55,
                    rop: 60,
                    status: "Perlo Reorder"
                },
                {
                    id: 6,
                    nama: "Moiaa Mango 200grm",
                    current_stock: 68,
                    forecast: 48,
                    safety_stock: 50,
                    rop: 65,
                    status: "Aman"
                },
                {
                    id: 7,
                    nama: "SBC Green Tea 500grm",
                    current_stock: 40,
                    forecast: 37,
                    safety_stock: 40,
                    rop: 45,
                    status: "Waspada"
                },
                {
                    id: 8,
                    nama: "Topping Cheese Cream 500grm",
                    current_stock: 45,
                    forecast: 37,
                    safety_stock: 55,
                    rop: 60,
                    status: "Aman"
                }
            ],
            loading: false,
            filters: {
                nama: { value: null, matchMode: "contains" },
                current_stock: { value: null, matchMode: "contains" },
                forecast: { value: null, matchMode: "contains" },
                safety_stock: { value: null, matchMode: "contains" },
                rop: { value: null, matchMode: "contains" },
                status: { value: null, matchMode: "contains" },
            },
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
            showDeleteDialog: false,
            tempData: null
        };
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0
            }).format(value);
        },
        detailData(item) {
            this.$router.push({
                name: "stock_analysis_detail",
                params: { id: item.id },
            });
        },
        confirmDelete(item) {
            this.tempData = item;
            this.showDeleteDialog = true;
        },
        deleteItem() {
            if (!this.tempData) return;

            this.data = this.data.filter((item) => item.id !== this.tempData.id);
            this.showDeleteDialog = false;
            this.tempData = null;

            this.$toast?.add?.({
                severity: "success",
                summary: "Berhasil",
                detail: "Data barang dihapus",
                life: 2500,
            });
        },
        toggle(event, itemId) {
            this.$refs[`menu_${itemId}`]?.toggle?.(event);
        }
        ,
        statusBadgeClass(status) {
            const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold";
            if (!status) return `${base} bg-gray-100 text-gray-800`;
            const s = status.toLowerCase();
            if (s.includes("aman")) return `${base} bg-green-100 text-green-800`;
            if (s.includes("waspada")) return `${base} bg-yellow-100 text-yellow-800`;
            if (s.includes("reorder") || s.includes("perlo")) return `${base} bg-red-100 text-red-800`;
            return `${base} bg-gray-100 text-gray-800`;
        }
    }
};
</script>

<template>
    <div class="card">
        <DataTable
            class="barang-datatable font-farro text-sm"
            :value="data"
            v-model:filters="filters"
            filterDisplay="row"
            :paginator="true"
            :rows="10"
            dataKey="id"
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
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari nama barang..."
                style="min-width: 20rem"
            >
                <template #body="{ data }">{{ data.nama }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari nama barang..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="current_stock"
                header="Stok Saat Ini"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari stok..."
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ data.current_stock }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari stok..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>


            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="forecast"
                header="Forecast"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari forecast..."
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ data.forecast }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari forecast..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="safety_stock"
                header="Safety Stock"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari safety stock..."
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ data.safety_stock }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari safety stock..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="rop"
                header="ROP"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari ROP..."
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ data.rop }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari ROP..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>
            
            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="status"
                header="Status"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari status..."
                style="min-width: 12rem"
            >
                <template #body="{ data }">
                    <span :class="statusBadgeClass(data.status)">
                        {{ data.status }}
                    </span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari status..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column :pt="columnPt" class="font-farro text-md" header="Aksi" style="min-width: 10rem">
                <template #body="{ data }">
                    <button
                        type="button"
                        class="block rounded-lg py-1 px-2 bg-white border border-gray-300 text-gray-500 text-sm hover:bg-gray-300"
                        @click="toggle($event, data.id)"
                    >
                        <i class="pi pi-ellipsis-h"></i>
                    </button>

                    <Menu
                        :ref="`menu_${data.id}`"
                        :id="'overlay_menu_' + data.id"
                        class="font-farro"
                        :popup="true"
                        :pt="{
                            root: { class: 'font-farro' },
                            menu: { class: 'font-farro' },
                            item: { class: 'font-farro' },
                            itemContent: { class: 'font-farro text-gray-700 hover:text-gray-700' },
                            itemLink: { class: 'font-farro text-gray-700 hover:text-gray-700 focus:text-gray-700' },
                            itemLabel: { class: 'font-farro text-gray-700' },
                            itemIcon: { class: 'text-gray-700' }
                        }"
                        :model="[
                            {
                                label: 'Detail',
                                icon: 'pi pi-eye',
                                command: () => detailData(data),
                            }
                        ]"
                    />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog
        v-model:visible="showDeleteDialog"
        header="Hapus Barang"
        :style="{ width: '25rem' }"
    >
        <span class="text-surface-500 block mb-8">
            Apakah Anda yakin ingin menghapus barang <strong>{{ tempData?.nama }}</strong>?
        </span>
        <div class="flex justify-end gap-2">
            <Button
                type="button"
                label="Batal"
                severity="secondary"
                @click="showDeleteDialog = false"
            ></Button>
            <button
                type="button"
                @click="deleteItem"
                class="rounded-lg btn-primary px-6 text-white hover:bg-primary-emphasis disabled:border-gray-200 disabled:bg-gray-200"
                :disabled="loading"
            >
                <i class="pi pi-trash mr-2"></i>Hapus
            </button>
        </div>
    </Dialog>
</template>

<style lang="scss" scoped></style>
