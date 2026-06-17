<script>
import Select from "primevue/select";
import { api } from "@/utils/api";
import CustomDateRange from "@/components/CustomDateRange.vue";

export default {
    components: {
        Select,
        CustomDateRange,
    },
    data() {
        return {
            data: [],
            usersMap: {},
            loading: false,
            currentPage: 0,
            totalPages: 0,
            pageSize: 10,
            totalItems: 0,
            filters: {
                refNumber: { value: null, matchMode: "contains" },
                tanggal: { value: null, matchMode: "contains" },
                sumber: { value: null, matchMode: "contains" },
                jenis: { value: null, matchMode: "contains" },
                status: { value: null, matchMode: "contains" },
                user: { value: null, matchMode: "contains" }
            },
            sortField: null,
            sortOrder: null,
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
            showCancelDialog: false,
            showDeleteDialog: false,
            tempData: null,
            jenisOptions: [
                { label: 'Masuk', value: 'IN' },
                { label: 'Keluar', value: 'OUT' }
            ],
            sumberOptions: [
                { label: 'Manual', value: 'MANUAL' },
                { label: 'Import PDF', value: 'PDF_IMPORT' }
            ],
            showImportDialog: false,
            importFile: null,
            isDragOver: false,
            isImporting: false,
            showImportResultDialog: false,
            importResult: {
                total: 0,
                success: 0,
                failed: 0,
                errors: []
            }
        };
    },
    async mounted() {
        await this.fetchUsers();
        await this.fetchTransactions();
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await api.get('/users?size=100');
                const users = response.data?.data || [];
                const map = {};
                users.forEach(u => {
                    if (u.userId) {
                        map[u.userId] = u.name || u.username || u.email || u.userId;
                    }
                });
                this.usersMap = map;
            } catch (error) {
                console.error('Gagal mengambil data user untuk pemetaan:', error);
            }
        },
        async fetchTransactions(page = 0) {
          this.loading = true;
          try {
            let queryParams = `page=${page}&size=${this.pageSize}`;

            const f = this.filters;
            if (f.refNumber.value !== null && f.refNumber.value !== '') queryParams += `&referenceNumber=${encodeURIComponent(f.refNumber.value)}`;
            
            if (f.tanggal.value !== null && Array.isArray(f.tanggal.value)) {
              const [start, end] = f.tanggal.value;
              if (start) {
                const startStr = new Date(start.getTime() - (start.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                queryParams += `&dateFrom=${startStr}`;
              }
              if (end) {
                const endStr = new Date(end.getTime() - (end.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                queryParams += `&dateTo=${endStr}`;
              }
            }
            if (f.sumber.value !== null && f.sumber.value !== '') queryParams += `&source=${encodeURIComponent(f.sumber.value)}`;
            if (f.jenis.value !== null && f.jenis.value !== '') queryParams += `&transactionType=${encodeURIComponent(f.jenis.value)}`;
            if (f.status.value !== null && f.status.value !== '') queryParams += `&status=${encodeURIComponent(f.status.value)}`;
            if (f.user.value !== null && f.user.value !== '') queryParams += `&userName=${encodeURIComponent(f.user.value)}`;

            if (this.sortField && this.sortOrder !== null) {
                let mappedSortField = this.sortField;
                if (this.sortField === 'refNumber') mappedSortField = 'referenceNumber';
                if (this.sortField === 'tanggal') mappedSortField = 'date';
                if (this.sortField === 'sumber') mappedSortField = 'source';
                if (this.sortField === 'jenis') mappedSortField = 'transactionType';
                if (this.sortField === 'status') mappedSortField = 'status';

                queryParams += `&sortBy=${mappedSortField}&sortDirection=${this.sortOrder === 1 ? 'asc' : 'desc'}`;
            }

            const response = await api.get(`/transactions?${queryParams}`);
            const result = response.data;

            // map api response
            this.data = (result.data || []). map((item) => ({
                transactionId: item.transactionId,
                id: item.transactionId, // Fallback for action menu refs and delete filtering
                refNumber: item.referenceNumber || '-',
                no_invoice: item.referenceNumber || '-', // Fallback for delete dialog invoice display
                tanggal: item.date,
                sumber: item.source === 'MANUAL' ? 'Manual' : (item.source === 'PDF_IMPORT' ? 'Import PDF' : item.source || '-'),
                jenis: item.transactionType === 'IN' ? 'Masuk' : (item.transactionType === 'OUT' ? 'Keluar' : item.transactionType || '-'),
                status: item.status,
                dokumen: item.documentId || '-',
                user: this.usersMap[item.userId] || item.userId || '-',
                _raw: item,
            }));

            // handle pagination
            if (result.pagging) {
                this. currentPage = result.pagging.currentPage;
                this.totalPages = result.pagging.totalPage;
                this.pageSize = result.pagging.size;
                // fallback total items
                this.totalItems = (result.pagging.totalItems !== undefined && result.pagging.totalItems !== null) ? result.pagging.totalItems : (result.pagging.totalPage * result.pagging.size);
            }
            
          } catch (error) {
            console.error('Gagal memuat data transaksi:', error);
            this.$toast?.add?.({
                severity: 'error',
                summary: 'Gagal',
                detail: error.message || 'Gagal memuat data transaksi',
                life: 3000,
            });
          } finally {
            this.loading = false;
          }
        },
        onPage(event) {
            // event.page is the new page index (0-based)
            this.fetchTransactions(event.page);
        },
        onSort(event) {
            this.sortField = event.sortField;
            this.sortOrder = event.sortOrder;
            this.fetchTransactions(0); // Reset ke halaman pertama saat di-sort
        },
        onFilter(event) {
            this.fetchTransactions(0); // Reset ke halaman pertama saat filter berubah
        },
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
        setCancelled(item) {
            this.tempData = item;
            this.showCancelDialog = true;
        },
        async cancelItem() {
            if (!this.tempData) return;

            try {
                await api.post(`/transactions/${this.tempData.transactionId}/set-cancelled`);

                this.$toast?.add?.({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: `Transaksi ${this.tempData.refNumber} berhasil dibatalkan`,
                    life: 3000,
                });

                this.data = this.data.filter((t) => t.transactionId !== this.tempData.transactionId);
                this.showCancelDialog = false;
                this.tempData = null;
            } catch (error) {
                console.error('Gagal membatalkan transaksi:', error);
                this.$toast?.add?.({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: error.message || 'Gagal membatalkan transaksi',
                    life: 3000,
                });
            }
        },
        confirmDelete(item) {
            this.tempData = item;
            this.showDeleteDialog = true;
        },
        async deleteItem() {
            if (!this.tempData) return;

            try {
                await api.delete(`/transactions/${this.tempData.transactionId}`);

                this.$toast?.add?.({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: `Transaksi ${this.tempData.refNumber} berhasil dihapus`,
                    life: 3000,
                });

                this.data = this.data.filter((t) => t.transactionId !== this.tempData.transactionId);
                this.showDeleteDialog = false;
                this.tempData = null;
            } catch (error) {
                console.error('Gagal menghapus transaksi:', error);
                this.$toast?.add?.({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: error.message || 'Gagal menghapus transaksi',
                    life: 3000,
                });
            }
        },
        getActionMenuItems(data) {
            const items = [];

            if (data.status === 'CANCELLED') {
                items.push({
                    label: 'Hapus Transaksi',
                    icon: 'pi pi-trash',
                    command: () => this.confirmDelete(data),
                });
            } else {
                items.push({
                    label: 'Set Cancelled',
                    icon: 'pi pi-times',
                    command: () => this.setCancelled(data),
                });
            }

            items.push({
                label: 'Detail',
                icon: 'pi pi-eye',
                command: () => this.viewDetail(data),
            });

            return items;
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
        async doImport() {
            if (!this.importFile || this.isImporting) return;
            this.isImporting = true;
            try {
                const formData = new FormData();
                formData.append('file', this.importFile);
                formData.append('transactionType', 'OUT');

                const userStr = localStorage.getItem('user');
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        if (user && user.userId) {
                            formData.append('userId', user.userId);
                        }
                    } catch (e) {
                        console.error('Failed to parse user from localStorage', e);
                    }
                }

                const response = await api.post('/documents/upload', formData);

                const result = response.data?.data ?? response.data;
                this.importResult = {
                    total: result?.totalRows ?? 0,
                    success: result?.successRows ?? 0,
                    failed: result?.failedRows ?? 0,
                    errors: result?.errors ?? []
                };

                this.showImportDialog = false;
                this.showImportResultDialog = true;
                await this.fetchTransactions(0);
            } catch (error) {
                console.error('Gagal mengimport file:', error);
                const errData = error?.response?.data?.data ?? error?.response?.data;
                this.importResult = {
                    total: errData?.totalRows ?? 0,
                    success: errData?.successRows ?? 0,
                    failed: errData?.failedRows ?? 1,
                    errors: errData?.errors ?? [error.message || 'Terjadi kesalahan saat mengimport file']
                };
                this.showImportDialog = false;
                this.showImportResultDialog = true;
            } finally {
                this.isImporting = false;
                this.clearImportFile();
            }
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
            dataKey="transactionId"
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
                    <CustomDateRange
                        v-model="filterModel.value"
                        placeholder="Pilih rentang tanggal"
                        @change="filterCallback()"
                    />
                </template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="refNumber"
                header="Reference Number"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari reference number..."
                style="min-width: 15rem"
            >
                <template #body="{ data }">{{ data.refNumber }}</template>
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
                field="sumber"
                header="Sumber"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari sumber..."
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ data.sumber }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <Select
                        v-model="filterModel.value"
                        :options="sumberOptions"
                        optionLabel="label"
                        optionValue="value"
                        @change="filterCallback()"
                        placeholder="Pilih sumber"
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
                field="jenis"
                header="Jenis"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari jenis..."
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ data.jenis }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <Select
                        v-model="filterModel.value"
                        :options="jenisOptions"
                        optionLabel="label"
                        optionValue="value"
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
                field="status"
                header="Status"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari status..."
                style="min-width: 15rem"
            >
                <template #body="{ data }">{{ data.status }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <input
                        v-model="filterModel.value"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Cari status..."
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
                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                    :model="getActionMenuItems(data)"
                />
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- ── Import File Dialog ── -->
    <Dialog
        v-model:visible="showImportDialog"
        header="Import Transaksi Keluar"
        :style="{ width: '32rem' }"
        :modal="true"
        @hide="clearImportFile"
    >
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
                <p class="font-farro text-xs text-gray-400 mt-1">Format: .pdf (maks. 10 MB)</p>
            </div>
            <input
                ref="fileInput"
                type="file"
                accept=".pdf,application/pdf"
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
                :disabled="!importFile || isImporting"
                @click="doImport"
            >
                <i v-if="isImporting" class="pi pi-spin pi-spinner text-xs"></i>
                <i v-else class="pi pi-upload text-xs"></i>
                {{ isImporting ? 'Mengimport...' : 'Import' }}
            </button>
        </div>
    </Dialog>

    <!-- ── Import Result Dialog ── -->
    <Dialog
        v-model:visible="showImportResultDialog"
        header="Hasil Import File"
        :style="{ width: '30rem' }"
        :modal="true"
    >
        <div class="flex flex-col gap-4 py-2">
            <!-- Total rows info -->
            <div class="flex items-center justify-center gap-2 rounded-lg bg-gray-100 border border-gray-200 py-2 px-4">
                <i class="pi pi-file text-sm text-gray-500"></i>
                <span class="font-farro text-sm text-gray-600">Total data dibaca:</span>
                <span class="font-farro text-sm font-bold text-gray-800">{{ importResult.total }} baris</span>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-2 gap-3">
                <!-- Berhasil -->
                <div class="flex flex-col items-center justify-center gap-1 rounded-xl bg-green-50 border border-green-200 py-5">
                    <div class="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-1">
                        <i class="pi pi-check-circle text-2xl text-green-500"></i>
                    </div>
                    <span class="font-farro text-3xl font-bold text-green-600">{{ importResult.success }}</span>
                    <span class="font-farro text-xs text-green-700 font-medium">Data Berhasil</span>
                </div>
                <!-- Gagal -->
                <div class="flex flex-col items-center justify-center gap-1 rounded-xl bg-red-50 border border-red-200 py-5">
                    <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-1">
                        <i class="pi pi-times-circle text-2xl text-red-500"></i>
                    </div>
                    <span class="font-farro text-3xl font-bold text-red-600">{{ importResult.failed }}</span>
                    <span class="font-farro text-xs text-red-700 font-medium">Data Gagal</span>
                </div>
            </div>

            <!-- Error details -->
            <div v-if="importResult.errors && importResult.errors.length > 0" class="rounded-xl border border-red-200 bg-red-50 p-3">
                <p class="font-farro text-xs font-semibold text-red-700 mb-2">
                    <i class="pi pi-exclamation-triangle mr-1"></i> Detail Kesalahan:
                </p>
                <ul class="space-y-1 max-h-32 overflow-y-auto">
                    <li
                        v-for="(err, idx) in importResult.errors"
                        :key="idx"
                        class="font-farro text-xs text-red-600 flex items-start gap-1"
                    >
                        <span class="mt-0.5 flex-shrink-0">•</span>
                        <span>{{ err }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end">
                <button
                    type="button"
                    class="h-10 inline-flex items-center gap-2 rounded-lg bg-primary px-6 font-farro text-sm text-white hover:bg-primary-dark transition duration-200"
                    @click="showImportResultDialog = false"
                >
                    <i class="pi pi-check text-xs"></i> Tutup
                </button>
            </div>
        </template>
    </Dialog>

    <!-- set cancel -->
    <Dialog v-model:visible="showCancelDialog" header="Batalkan Transaksi" :style="{ width: '25rem' }">
        <span class="text-surface-500 block mb-8">
            Apakah Anda yakin ingin membatalkan transaksi <strong>{{ tempData?.refNumber }}</strong>?
        </span>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Tidak" severity="secondary" @click="showCancelDialog = false"></Button>
            <button type="button" @click="cancelItem" class="rounded-lg bg-danger px-6 text-white hover:bg-danger-dark disabled:border-gray-200 disabled:bg-gray-200" :disabled="loading">
                <i class="pi pi-trash mr-2"></i>Ya, Batalkan
            </button>
        </div>
    </Dialog>

    <!-- hapus transaksi -->
    <Dialog v-model:visible="showDeleteDialog" header="Hapus Transaksi" :style="{ width: '25rem' }">
        <span class="text-surface-500 block mb-8">
            Apakah Anda yakin ingin menghapus transaksi <strong>{{ tempData?.refNumber }}</strong>? Transaksi ini akan dihapus secara permanen.
        </span>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Tidak" severity="secondary" @click="showDeleteDialog = false"></Button>
            <button type="button" @click="deleteItem" class="rounded-lg bg-danger px-6 text-white hover:bg-danger-dark disabled:border-gray-200 disabled:bg-gray-200" :disabled="loading">
                <i class="pi pi-trash mr-2"></i>Ya, Hapus
            </button>
        </div>
    </Dialog>
</template>

<style lang="scss" scoped></style>
