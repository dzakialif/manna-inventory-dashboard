<script>
export default {
    data() {
        return {
            data: [
                {
                    id: 1,
                    kode: "BRG001",
                    nama: "Laptop Dell XPS 13",
                    kategori: "Elektronik",
                    harga: 15000000,
                    stok: 5,
                    satuan: "Unit",
                    supplier: "PT. Delta Electronic",
                    tanggal_masuk: "2024-01-15"
                },
                {
                    id: 2,
                    kode: "BRG002",
                    nama: "Mouse Logitech MX Master 3",
                    kategori: "Aksesori",
                    harga: 800000,
                    stok: 20,
                    satuan: "Unit",
                    supplier: "PT. Jaya Digital",
                    tanggal_masuk: "2024-01-10"
                },
                {
                    id: 3,
                    kode: "BRG003",
                    nama: "Keyboard Mechanical RGB",
                    kategori: "Aksesori",
                    harga: 1200000,
                    stok: 15,
                    satuan: "Unit",
                    supplier: "PT. Tech Store",
                    tanggal_masuk: "2024-01-20"
                },
                {
                    id: 4,
                    kode: "BRG004",
                    nama: "Monitor LG 27 Inch",
                    kategori: "Elektronik",
                    harga: 2500000,
                    stok: 8,
                    satuan: "Unit",
                    supplier: "PT. Vision Tech",
                    tanggal_masuk: "2024-02-01"
                },
                {
                    id: 5,
                    kode: "BRG005",
                    nama: "Headset Audio Profesional",
                    kategori: "Aksesori",
                    harga: 1500000,
                    stok: 12,
                    satuan: "Unit",
                    supplier: "PT. Sound Pro",
                    tanggal_masuk: "2024-02-05"
                },
                {
                    id: 6,
                    kode: "BRG006",
                    nama: "Webcam HD 1080P",
                    kategori: "Aksesori",
                    harga: 750000,
                    stok: 25,
                    satuan: "Unit",
                    supplier: "PT. Media Plus",
                    tanggal_masuk: "2024-02-10"
                },
                {
                    id: 7,
                    kode: "BRG007",
                    nama: "Docking Station USB-C",
                    kategori: "Aksesori",
                    harga: 1800000,
                    stok: 10,
                    satuan: "Unit",
                    supplier: "PT. Connect World",
                    tanggal_masuk: "2024-02-15"
                },
                {
                    id: 8,
                    kode: "BRG008",
                    nama: "Printer Laser Multifungsi",
                    kategori: "Perangkat",
                    harga: 4500000,
                    stok: 3,
                    satuan: "Unit",
                    supplier: "PT. Office Equipment",
                    tanggal_masuk: "2024-02-20"
                }
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

            <Column :pt="columnPt" class="font-farro text-md" field="kode" header="Kode Barang" sortable style="min-width: 12rem">
                <template #body="{ data }">{{ data.kode }}</template>
            </Column>

            <Column :pt="columnPt" class="font-farro text-md" field="nama" header="Nama Barang" sortable style="min-width: 20rem">
                <template #body="{ data }">{{ data.nama }}</template>
            </Column>

            <Column :pt="columnPt" class="font-farro text-md" field="kategori" header="Kategori" sortable style="min-width: 12rem">
                <template #body="{ data }">{{ data.kategori }}</template>
            </Column>

            <Column :pt="columnPt" class="font-farro text-md" field="harga" header="Harga" sortable style="min-width: 15rem">
                <template #body="{ data }">{{ formatCurrency(data.harga) }}</template>
            </Column>

            <Column :pt="columnPt" class="font-farro text-md" field="stok" header="Stok" sortable style="min-width: 10rem">
                <template #body="{ data }">
                    <span :class="data.stok <= 5 ? 'text-red-500 font-semibold' : ''">
                        {{ data.stok }} {{ data.satuan }}
                    </span>
                </template>
            </Column>

            <Column :pt="columnPt" class="font-farro text-md" field="supplier" header="Supplier" sortable style="min-width: 18rem">
                <template #body="{ data }">{{ data.supplier }}</template>
            </Column>

            <Column :pt="columnPt" class="font-farro text-md" field="tanggal_masuk" header="Tanggal Masuk" sortable style="min-width: 12rem">
                <template #body="{ data }">{{ data.tanggal_masuk }}</template>
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
