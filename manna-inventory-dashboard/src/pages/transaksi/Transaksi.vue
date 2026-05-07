<script>
import Select from "primevue/select";

export default {
    components: {
        Select,
    },
    data() {
        return {
            data: [
                {
                    id: 1,
                    tanggal: "2026-04-03",
                    no_invoice: "IN-INV-202604-0001",
                    jenis: "Masuk",
                    total_transaksi: 18750000,
                    dokumen: "Faktur Penjualan",
                    user: "Rina - Admin Gudang",
                },
                {
                    id: 2,
                    tanggal: "2026-04-05",
                    no_invoice: "IN-INV-202604-0002",
                    jenis: "Masuk",
                    total_transaksi: 9550000,
                    dokumen: "Surat Jalan",
                    user: "Dimas - Kasir",
                },
                {
                    id: 3,
                    tanggal: "2026-04-07",
                    no_invoice: "IN-INV-202604-0003",
                    jenis: "Masuk",
                    total_transaksi: 14600000,
                    dokumen: "Mutasi Stok",
                    user: "Sari - Supervisor",
                },
                {
                    id: 4,
                    tanggal: "2026-04-09",
                    no_invoice: "IN-INV-202604-0004",
                    jenis: "Masuk",
                    total_transaksi: 11250000,
                    dokumen: "Faktur Penjualan",
                    user: "Bayu - Kasir",
                },
                {
                    id: 5,
                    tanggal: "2026-04-12",
                    no_invoice: "IN-INV-202604-0005",
                    jenis: "Masuk",
                    total_transaksi: 980000,
                    dokumen: "Nota Retur",
                    user: "Rina - Admin Gudang",
                },
                {
                    id: 6,
                    tanggal: "2026-04-15",
                    no_invoice: "IN-INV-202604-0006",
                    jenis: "Masuk",
                    total_transaksi: 22100000,
                    dokumen: "Surat Jalan",
                    user: "Dimas - Kasir",
                },
                {
                    id: 7,
                    tanggal: "2026-04-18",
                    no_invoice: "IN-INV-202604-0007",
                    jenis: "Masuk",
                    total_transaksi: 7340000,
                    dokumen: "Mutasi Stok",
                    user: "Sari - Supervisor",
                },
                {
                    id: 8,
                    tanggal: "2026-04-22",
                    no_invoice: "IN-INV-202604-0008",
                    jenis: "Masuk",
                    total_transaksi: 12800000,
                    dokumen: "Faktur Penjualan",
                    user: "Bayu - Kasir",
                }

            ],
            loading: false,
            filters: {
                tanggal: { value: null, matchMode: "contains" },
                no_invoice: { value: null, matchMode: "contains" },
                jenis: { value: null, matchMode: "contains" },
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
            tempData: null,
            jenisOptions: ['Masuk', 'Keluar', 'Opname'],
            showImportDialog: false,
            importFile: null,
            importJenis: null,
            isDragOver: false
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
            sessionStorage.setItem('transaksi_edit_draft', JSON.stringify(item));
            this.$router.push({
                name: 'edit_transaksi',
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
                detail: "Data transaksi dihapus",
                life: 2500,
            });
        },
        viewDetail(item) {
            this.$router.push({
                name: 'detail_transaksi',
                params: { id: item.id },
            });
        },
        handleFileSelect(event) {
            const file = event.target?.files?.[0] || event.dataTransfer?.files?.[0];
            if (file) this.importFile = file;
            this.isDragOver = false;
        },
        clearImportFile() {
            this.importFile = null;
            if (this.$refs.fileInput) this.$refs.fileInput.value = '';
        },
        formatFileSize(bytes) {
            if (!bytes) return '0 B';
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / 1048576).toFixed(1) + ' MB';
        },
        doImport() {
            if (!this.importFile) return;
            this.$toast?.add?.({
                severity: 'success',
                summary: 'Berhasil',
                detail: `File "${this.importFile.name}"${this.importJenis ? ' ('+this.importJenis+')' : ''} berhasil diimport`,
                life: 3000,
            });
            this.showImportDialog = false;
            this.importJenis = null;
            this.clearImportFile();
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
                class="inline-flex items-center font-farro rounded-lg bg-primary text-sm text-white hover:bg-primary-dark transition duration-200 p-4"
                @click="showImportDialog = true"
            >
                <Icon icon="mdi:download-outline" class="text-xl mr-2"></Icon> Import File
            </button>
            <router-link to="/transaksi/create"
                class="inline-flex items-center font-farro rounded-lg bg-primary text-sm text-white hover:bg-primary-dark transition duration-200 p-4"
            >
                <Icon icon="mdi:plus" class="text-xl mr-2"></Icon> Tambah Transaksi
            </router-link>
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
                field="jenis"
                header="Jenis Transaksi"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari jenis..."
                style="min-width: 10rem"
            >
                <template class #body="{ data }">{{ data.jenis }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <Select
                        v-model="filterModel.value"
                        :options="jenisOptions"
                        @change="filterCallback()"
                        placeholder="Pilih jenis"
                        class="font-farro"
                        showClear
                        :pt="{
                        root: {
                            class: '!h-[2rem] flex items-center !bg-white !text-black !border !border-gray-300 !rounded-md !h-10 !min-w-40 focus-within:!border-primary focus-within:!ring-1 focus-within:!ring-primary',
                        },
                        label: { class: filterModel.value ? '!text-black !text-sm' : '!text-gray-400 !text-sm' },
                        dropdown: { class: '!text-gray-400 !bg-white' },
                        overlay: { class: '!bg-white !text-black !border !border-gray-200 !shadow-md' },
                        listContainer: { class: 'bg-white' },
                        list: { class: '!bg-white' },
                        option: { class: '!text-black !font-farro !bg-white hover:!bg-surface-hover' },
                        optionLabel: { class: '!text-black' },
                        emptyMessage: { class: '!text-black !bg-white' },
                        }"
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
                    class="font-farro"
                    :popup="true"
                    :pt="{
                    root: { class: 'font-farro' },
                    menu: { class: 'font-farro' },
                    item: { class: 'font-farro' },
                    itemContent: { class: 'font-farro text-gray-700 hover:text-gray-700' },
                    itemLink: { class: 'font-farro text-gray-700 hover:text-gray-700 focus:text-gray-700' },
                    itemLabel: { class: 'font-farro text-gray-700' },
                    itemIcon: { class: 'text-gray-700' },
                    }"
                    :model="[
                    {
                        label: 'Edit',
                        icon: 'pi pi-pencil',
                        command: () => editItem(data),
                    },
                    {
                        label: 'Detail',
                        icon: 'pi pi-eye',
                        command: () => viewDetail(data),
                    },
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

    <!-- ── Import File Dialog ── -->
    <Dialog
        v-model:visible="showImportDialog"
        header="Import File Transaksi"
        :style="{ width: '32rem' }"
        :modal="true"
        @hide="clearImportFile"
    >
        <!-- Jenis Transaksi -->
        <div class="mb-4">
            <label class="mb-2 block font-farro text-sm font-medium text-gray-700">
                Jenis Transaksi <span class="text-red-500">*</span>
            </label>
            <Select
                v-model="importJenis"
                :options="jenisOptions"
                placeholder="Pilih jenis transaksi"
                class="font-farro w-full"
                showClear
                :pt="{
                root: {
                    class: 'flex items-center !bg-white !text-black !border !border-gray-300 !rounded-lg !h-12 !w-full focus-within:!border-primary focus-within:!ring-1 focus-within:!ring-primary',
                },
                label: { class: importJenis ? '!text-black !text-sm' : '!text-gray-400 !text-sm' },
                dropdown: { class: '!text-gray-500 !bg-white' },
                overlay: { class: '!bg-white !text-black !border !border-gray-200 !shadow-md' },
                listContainer: { class: 'bg-white' },
                list: { class: '!bg-white' },
                option: { class: '!text-black !font-farro !bg-white hover:!bg-surface-hover' },
                optionLabel: { class: '!text-black' },
                emptyMessage: { class: '!text-black !bg-white' },
                }"
            />
        </div>

        <!-- Drop Zone -->
        <div
            class="mb-5 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors duration-200 p-8 cursor-pointer"
            :class="isDragOver ? 'border-primary bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-green-50'"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="handleFileSelect"
            @click="$refs.fileInput.click()"
        >
            <Icon icon="mdi:cloud-upload-outline" class="text-5xl" :class="isDragOver ? 'text-primary' : 'text-gray-400'" />
            <div class="text-center">
                <p class="font-farro font-semibold text-sm text-gray-700">Klik atau seret file ke sini</p>
                <p class="font-farro text-xs text-gray-400 mt-1">Format: .xlsx, .xls, .csv, .pdf (maks. 10 MB)</p>
            </div>
            <input
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls,.csv,.pdf,application/pdf"
                class="hidden"
                @change="handleFileSelect"
            />
        </div>

        <!-- File Overview -->
        <div v-if="importFile" class="mb-5 rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-4">
            <div
                class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                :class="importFile.type === 'application/pdf' ? 'bg-red-100' : 'bg-green-100'"
            >
                <Icon
                    :icon="importFile.type === 'application/pdf' ? 'mdi:file-pdf-box' : 'mdi:file-excel-outline'"
                    class="text-xl"
                    :class="importFile.type === 'application/pdf' ? 'text-red-500' : 'text-primary'"
                />
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-farro text-sm font-semibold text-gray-800 truncate">{{ importFile.name }}</p>
                <p class="font-farro text-xs text-gray-400 mt-0.5">
                    {{ formatFileSize(importFile.size) }} &nbsp;·&nbsp;
                    {{ importFile.type === 'application/pdf' ? 'PDF Document' : 'Spreadsheet' }}
                </p>
            </div>
            <button
                type="button"
                class="flex-shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition"
                @click.stop="clearImportFile"
                title="Hapus file"
            >
                <i class="pi pi-times text-sm"></i>
            </button>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
            <Button
                type="button"
                label="Batal"
                severity="secondary"
                @click="showImportDialog = false; clearImportFile()"
            />
            <button
                type="button"
                class="h-10 inline-flex items-center gap-2 rounded-lg bg-primary px-5 font-farro text-sm text-white hover:bg-primary-dark transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="!importFile"
                @click="doImport"
            >
                <i class="pi pi-upload text-xs"></i> Import
            </button>
        </div>
    </Dialog>
</template>

<style lang="scss" scoped></style>
