<script>
import { api } from "@/utils/api";
import Select from "primevue/select";

export default {
    components: {
        Select
    },
    data() {
        return {
            data: [],
            loading: false,
            currentPage: 0,
            totalPages: 0,
            pageSize: 10,
            totalItems: 0,
            filters: {
                nama: { value: null, matchMode: "equals" },
                status: { value: null, matchMode: "equals" },
            },
            sortField: null,
            sortOrder: null,
            productOptions: [],
            statusOptions: [
                { label: "Aman", value: "Aman" },
                { label: "Waspada", value: "Waspada" },
                { label: "Perlu Reorder", value: "Perlu Reorder" }
            ],
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
    async mounted() {
        this.loading = true;
        try {
            await Promise.all([
                this.fetchProductDropdown(),
                this.fetchForecastData(0)
            ]);
        } catch (error) {
            console.error("Gagal inisialisasi halaman:", error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async fetchProductDropdown() {
            try {
                const response = await api.get('/products/dropdown');
                this.productOptions = response.data?.data || [];
            } catch (error) {
                console.error("Gagal memuat dropdown produk:", error);
            }
        },
        async fetchForecastData(page = 0) {
            this.loading = true;
            try {
                let queryParams = `page=${page}&size=${this.pageSize}`;

                const f = this.filters;
                if (f.nama.value !== null && f.nama.value !== '') {
                    const prod = this.productOptions.find(p => p.value === f.nama.value);
                    const productName = prod ? prod.label : f.nama.value;
                    queryParams += `&productName=${encodeURIComponent(productName)}`;
                }
                if (f.status.value !== null && f.status.value !== '') {
                    queryParams += `&status=${encodeURIComponent(f.status.value)}`;
                }

                if (this.sortField && this.sortOrder !== null) {
                    let mappedSortField = this.sortField;
                    if (this.sortField === 'nama') mappedSortField = 'productName';
                    else if (this.sortField === 'current_stock') mappedSortField = 'currentStock';
                    else if (this.sortField === 'forecast') mappedSortField = 'forecastResult';
                    else if (this.sortField === 'safety_stock') mappedSortField = 'safetyStock';
                    else if (this.sortField === 'rop') mappedSortField = 'reorderPoint';

                    queryParams += `&sortBy=${mappedSortField}&sortDirection=${this.sortOrder === 1 ? 'asc' : 'desc'}`;
                }

                const response = await api.get(`/analysis/forecast?${queryParams}`);
                const result = response.data;
                this.data = (result.data || []).map((item) => ({
                    id: item.productId,
                    nama: item.productName,
                    current_stock: item.currentStock,
                    forecast: item.forecastResult,
                    safety_stock: item.safetyStock,
                    rop: item.reorderPoint,
                    status: item.status === 'critical' ? 'Perlu Reorder' : item.status === 'warning' ? 'Waspada' : 'Aman',
                    _raw: item
                }));

                if (result.pagging) {
                    this.currentPage = result.pagging.currentPage;
                    this.totalPages = result.pagging.totalPage;
                    this.pageSize = result.pagging.size;
                    this.totalItems = (result.pagging.totalItems !== undefined && result.pagging.totalItems !== null)
                        ? result.pagging.totalItems
                        : (result.pagging.totalPage * result.pagging.size);
                }
            } catch (error) {
                console.error("Gagal memuat data analisis stok:", error);
                this.$toast?.add?.({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.message || "Gagal memuat data analisis stok",
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        onPage(event) {
            this.fetchForecastData(event.page);
        },
        onSort(event) {
            this.sortField = event.sortField;
            this.sortOrder = event.sortOrder;
            this.fetchForecastData(0);
        },
        onFilter(event) {
            this.fetchForecastData(0);
        },
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
        },
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
                    <Select
                        v-model="filterModel.value"
                        :options="productOptions"
                        optionLabel="label"
                        optionValue="value"
                        @change="filterCallback()"
                        placeholder="Pilih nama barang"
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
                field="current_stock"
                header="Stok Saat Ini"
                sortable
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ data.current_stock }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="forecast"
                header="Forecast"
                sortable
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ data.forecast }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="safety_stock"
                header="Safety Stock"
                sortable
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ data.safety_stock }}</template>
            </Column>

            <Column
                :pt="columnPt"
                class="font-farro text-md"
                field="rop"
                header="ROP"
                sortable
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ data.rop }}</template>
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
                    <Select
                        v-model="filterModel.value"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        @change="filterCallback()"
                        placeholder="Pilih status"
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
