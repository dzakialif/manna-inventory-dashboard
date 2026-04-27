<script>
export default {
    data() {
        return {
            data: [
                {
                    id: 1,
                    tanggal: "2026-04-03",
                    no_invoice: "IN-INV-202604-0001",
                    tipe: "IN",
                    total_item: 12,
                    total_transaksi: 18750000,
                    dokumen: "Faktur Penjualan",
                    user: "Rina - Admin Gudang",
                },
                {
                    id: 2,
                    tanggal: "2026-04-05",
                    no_invoice: "IN-INV-202604-0002",
                    tipe: "IN",
                    total_item: 7,
                    total_transaksi: 9550000,
                    dokumen: "Surat Jalan",
                    user: "Dimas - Kasir",
                },
                {
                    id: 3,
                    tanggal: "2026-04-07",
                    no_invoice: "IN-INV-202604-0003",
                    tipe: "IN",
                    total_item: 20,
                    total_transaksi: 14600000,
                    dokumen: "Mutasi Stok",
                    user: "Sari - Supervisor",
                },
                {
                    id: 4,
                    tanggal: "2026-04-09",
                    no_invoice: "IN-INV-202604-0004",
                    tipe: "IN",
                    total_item: 5,
                    total_transaksi: 11250000,
                    dokumen: "Faktur Penjualan",
                    user: "Bayu - Kasir",
                },
                {
                    id: 5,
                    tanggal: "2026-04-12",
                    no_invoice: "IN-INV-202604-0005",
                    tipe: "IN",
                    total_item: 2,
                    total_transaksi: 980000,
                    dokumen: "Nota Retur",
                    user: "Rina - Admin Gudang",
                },
                {
                    id: 6,
                    tanggal: "2026-04-15",
                    no_invoice: "IN-INV-202604-0006",
                    tipe: "IN",
                    total_item: 18,
                    total_transaksi: 22100000,
                    dokumen: "Surat Jalan",
                    user: "Dimas - Kasir",
                },
                {
                    id: 7,
                    tanggal: "2026-04-18",
                    no_invoice: "IN-INV-202604-0007",
                    tipe: "IN",
                    total_item: 9,
                    total_transaksi: 7340000,
                    dokumen: "Mutasi Stok",
                    user: "Sari - Supervisor",
                },
                {
                    id: 8,
                    tanggal: "2026-04-22",
                    no_invoice: "IN-INV-202604-0008",
                    tipe: "IN",
                    total_item: 4,
                    total_transaksi: 12800000,
                    dokumen: "Faktur Penjualan",
                    user: "Bayu - Kasir",
                }
            ],
            loading: false,
            filters: {
                tanggal: { value: null, matchMode: "contains" },
                no_invoice: { value: null, matchMode: "contains" },
                tipe: { value: null, matchMode: "contains" },
                total_item: { value: null, matchMode: "contains" },
                total_transaksi: { value: null, matchMode: "contains" },
                dokumen: { value: null, matchMode: "contains" },
                user: { value: null, matchMode: "contains" }
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
        editItem(item) {
            this.$toast?.add?.({
                severity: "info",
                summary: "Edit Mode",
                detail: `Edit ${item.no_invoice}`,
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
                detail: "Data transaksi dihapus",
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
        <div class="flex justify-end gap-4 mb-6">
            <button
                class="inline-flex items-center font-farro rounded-lg btn-primary text-sm text-white hover:bg-primary-dark transition duration-200 p-4"
            >
                <Icon icon="mdi:download-outline" class="text-xl mr-2"></Icon> Import File
            </button>
            <button
                class="inline-flex items-center font-farro rounded-lg btn-primary text-sm text-white hover:bg-primary-dark transition duration-200 p-4"
            >
                <Icon icon="mdi:plus" class="text-xl mr-2"></Icon> Tambah Transaksi
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
                field="tanggal"
                header="Tanggal"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari tanggal..."
                style="min-width: 12rem"
            >
                <template #body="{ data }">{{ data.tanggal }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari tanggal..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="no_invoice"
                header="No Invoice"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari no invoice..."
                style="min-width: 15rem"
            >
                <template #body="{ data }">{{ data.no_invoice }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari no invoice..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="tipe"
                header="Tipe"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari tipe..."
                style="min-width: 6rem"
            >
                <template #body="{ data }">{{ data.tipe }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="total_item"
                header="Total Item"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari total item..."
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ data.total_item }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari total item..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="total_transaksi"
                header="Total Transaksi"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari total transaksi..."
                style="min-width: 15rem"
            >
                <template #body="{ data }">{{ formatCurrency(data.total_transaksi) }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari total transaksi..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="dokumen"
                header="Dokumen"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari dokumen..."
                style="min-width: 15rem"
            >
                <template #body="{ data }">{{ data.dokumen }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari dokumen..."
                        @input="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="user"
                header="User"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari user..."
                style="min-width: 12rem"
            >
                <template #body="{ data }">{{ data.user }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cari user..."
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
            Apakah Anda yakin ingin menghapus transaksi <strong>{{ tempData?.no_invoice }}</strong>?
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
