<script>
export default {
    data() {
        return {
            data: [
                {
                    id: 1,
                    tanggal_opname: "2024-01-15",
                    nama: "Moiaa Swiss Choco 1000grm",
                    stok_sistem: 60,
                    stok_fisik: 55,
                    selisih: -5,
                    note: "Barang rusak",
                },
                {
                    id: 2,
                    tanggal_opname: "2024-01-18",
                    nama: "Moiaa Mango 1000grm",
                    stok_sistem: 42,
                    stok_fisik: 50,
                    selisih: 8,
                    note: "Stock fisik lebih banyak",
                },
                {
                    id: 3,
                    tanggal_opname: "2024-01-20",
                    nama: "SBC Cappucino Original 1000grm",
                    stok_sistem: 30,
                    stok_fisik: 30,
                    selisih: 0,
                    note: "Sesuai",
                },
                {
                    id: 4,
                    tanggal_opname: "2024-01-22",
                    nama: "Moiaa Strawberry 1000grm",
                    stok_sistem: 24,
                    stok_fisik: 20,
                    selisih: -4,
                    note: "Ada selisih keluar",
                },
                {
                    id: 5,
                    tanggal_opname: "2024-01-24",
                    nama: "SBC Swiss Choco 1000grm",
                    stok_sistem: 18,
                    stok_fisik: 21,
                    selisih: 3,
                    note: "Penyesuaian penerimaan",
                },
                {
                    id: 6,
                    tanggal_opname: "2024-01-25",
                    nama: "Moiaa Mango 200grm",
                    stok_sistem: 55,
                    stok_fisik: 55,
                    selisih: 0,
                    note: "Sesuai",
                },
                {
                    id: 7,
                    tanggal_opname: "2024-01-27",
                    nama: "SBC Green Tea 500grm",
                    stok_sistem: 16,
                    stok_fisik: 14,
                    selisih: -2,
                    note: "Barang sample keluar",
                },
                {
                    id: 8,
                    tanggal_opname: "2024-01-29",
                    nama: "Topping Cheese Cream 500grm",
                    stok_sistem: 9,
                    stok_fisik: 12,
                    selisih: 3,
                    note: "Hasil stock opname",
                }
            ],
            loading: false,
            filters: {
                tanggal_opname: { value: null, matchMode: "contains" },
                nama: { value: null, matchMode: "contains" },
                stok_sistem: { value: null, matchMode: "contains" },
                stok_fisik: { value: null, matchMode: "contains" },
                selisih: { value: null, matchMode: "contains" },
                note: { value: null, matchMode: "contains" },
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
        formatSelisih(value) {
            if (value > 0) return `+${value}`;

            return `${value}`;
        },
        getSelisihClass(value) {
            if (value === 0) return "text-primary";

            return "text-danger";
        },
        editItem(item) {
            this.$toast?.add?.({
                severity: "info",
                summary: "Edit Mode",
                detail: `Edit ${item.nama}`,
                life: 2500,
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
    }
};
</script>

<template>
    <div class="card">
        <div class="text-right mb-6">
            <button
                class="inline-flex items-center font-farro rounded-lg btn-primary text-sm text-white hover:bg-primary-dark transition duration-200 p-4"
            >
                <Icon icon="mdi:plus" class="text-xl mr-2"></Icon> Tambah Barang
            </button>
        </div>

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
                field="tanggal_opname"
                header="Tanggal Opname"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari tanggal opname..."
                style="min-width: 12rem"
            >
                <template #body="{ data }">{{ data.tanggal_opname }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari tanggal opname..."
                        @input="filterCallback()"
                    />
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
                style="min-width: 12rem"
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
                field="stok_sistem"
                header="Stok Sistem"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari stok sistem..."
                style="min-width: 12rem"
            >
                <template #body="{ data }">{{ data.stok_sistem }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari stok sistem..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="stok_fisik"
                header="Stok Fisik"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari stok fisik..."
                style="min-width: 12rem"
            >
                <template #body="{ data }">{{ data.stok_fisik }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari stok fisik..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="selisih"
                header="Selisih"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari selisih..."
                style="min-width: 12rem"
            >
                <template #body="{ data }">
                    <span :class="getSelisihClass(data.selisih)">
                        {{ formatSelisih(data.selisih) }}
                    </span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari selisih..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="note"
                header="Note"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari note..."
                style="min-width: 12rem"
            >
                <template #body="{ data }">{{ data.note }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari note..."
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
                        :popup="true"
                        :model="[
                            {
                                label: 'Edit',
                                icon: 'pi pi-pencil',
                                command: () => editItem(data),
                            },
                            {
                                label: 'Delete',
                                icon: 'pi pi-trash',
                                command: () => confirmDelete(data),
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
