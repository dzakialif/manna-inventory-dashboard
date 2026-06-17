<script>
import { api } from "@/utils/api";
import CustomDateRange from "@/components/CustomDateRange.vue";
import CustomSelect from "@/components/CustomSelect.vue";

export default {
    components: {
        CustomDateRange,
        CustomSelect,
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
                tanggal_opname: { value: null, matchMode: "contains" },
                nama: { value: null, matchMode: "contains" },
                stok_sistem: { value: null, matchMode: "contains" },
                stok_fisik: { value: null, matchMode: "contains" },
                selisih: { value: null, matchMode: "contains" },
                note: { value: null, matchMode: "contains" },
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
            showDeleteDialog: false,
            tempData: null,
            productOptions: []
        };
    },
    async mounted() {
        await this.fetchProductDropdown();
        this.fetchStockOpnames();
    },
    methods: {
        async fetchStockOpnames(page = 0) {
            this.loading = true;
            try {
                let queryParams = `page=${page}&size=${this.pageSize}`;

                const f = this.filters;
                if (f.tanggal_opname.value !== null && Array.isArray(f.tanggal_opname.value)) {
                  const [start, end] = f.tanggal_opname.value;
                  let startStr = null;
                  
                  if (start) {
                    startStr = new Date(start.getTime() - (start.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                    queryParams += `&dateFrom=${startStr}`;
                  }
                  if (end) {
                    const endStr = new Date(end.getTime() - (end.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                    queryParams += `&dateTo=${endStr}`;
                  } else if (startStr) {
                    // Jika user hanya memilih 1 tanggal (end = null), jadikan filter tepat untuk 1 hari tersebut
                    queryParams += `&dateTo=${startStr}`;
                  }
                }
                if (f.nama.value !== null && f.nama.value !== '') {
                    const prod = this.productOptions.find(p => p.value === f.nama.value);
                    const productName = prod ? prod.label : f.nama.value;
                    queryParams += `&productName=${encodeURIComponent(productName)}`;
                }
                if (f.stok_sistem.value !== null && f.stok_sistem.value !== '') queryParams += `&stockSystem=${encodeURIComponent(f.stok_sistem.value)}`;
                if (f.stok_fisik.value !== null && f.stok_fisik.value !== '') queryParams += `&stockActual=${encodeURIComponent(f.stok_fisik.value)}`;
                if (f.selisih.value !== null && f.selisih.value !== '') queryParams += `&diff=${encodeURIComponent(f.selisih.value)}`;
                if (f.note.value !== null && f.note.value !== '') queryParams += `&note=${encodeURIComponent(f.note.value)}`;

                if (this.sortField && this.sortOrder !== null) {
                    let mappedSortField = this.sortField;
                    if (this.sortField === 'nama') mappedSortField = 'productName';
                    else if (this.sortField === 'tanggal_opname') mappedSortField = 'date';
                    else if (this.sortField === 'stok_sistem') mappedSortField = 'stockSystem';
                    else if (this.sortField === 'stok_fisik') mappedSortField = 'stockActual';
                    else if (this.sortField === 'selisih') mappedSortField = 'diff';

                    queryParams += `&sortBy=${mappedSortField}&sortDirection=${this.sortOrder === 1 ? 'asc' : 'desc'}`;
                }

                const response = await api.get(`/stock-opnames?${queryParams}`);
                const result = response.data;

                this.data = (result.data || []).map((item) => ({
                    opnameId: item.opnameId,
                    productId: item.productId,
                    nama: item.productName || '-',
                    username: item.username || '-',
                    tanggal_opname: item.date || '-',
                    stok_sistem: item.stockSystem ?? 0,
                    stok_fisik: item.stockActual ?? 0,
                    selisih: item.diff ?? 0,
                    note: item.note || '-',
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
                console.error("Gagal memuat data stock opname:", error);
                this.$toast?.add?.({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.message || "Gagal memuat data stock opname",
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        onPage(event) {
            this.fetchStockOpnames(event.page);
        },
        onSort(event) {
            this.sortField = event.sortField;
            this.sortOrder = event.sortOrder;
            this.fetchStockOpnames(0);
        },
        onFilter(event) {
            this.fetchStockOpnames(0);
        },
        formatSelisih(value) {
            if (value > 0) return `+${value}`;

            return `${value}`;
        },
        getSelisihClass(value) {
            if (value >= 0) return "text-primary";

            return "text-danger";
        },
        editItem(item) {
            sessionStorage.setItem("opname_edit_draft", JSON.stringify(item._raw || item));
            this.$router.push({
                name: "edit_opname",
                params: { id: item.opnameId },
            });
        },
        confirmDelete(item) {
            this.tempData = item;
            this.showDeleteDialog = true;
        },
        async deleteItem() {
            if (!this.tempData) return;

            try {
                await api.delete(`/stock-opnames/${this.tempData.opnameId}`);

                this.data = this.data.filter((item) => item.opnameId !== this.tempData.opnameId);
                this.showDeleteDialog = false;
                this.tempData = null;

                this.$toast?.add?.({
                    severity: "success",
                    summary: "Berhasil",
                    detail: "Data stock opname berhasil dihapus",
                    life: 2500,
                });
            } catch (error) {
                console.error("Gagal menghapus stock opname:", error);
                this.$toast?.add?.({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.message || "Gagal menghapus data stock opname",
                    life: 3000,
                });
            }
        },
        toggle(event, itemId) {
            this.$refs[`menu_${itemId}`]?.toggle?.(event);
        },
        async fetchProductDropdown() {
            try {
                const response = await api.get('/products/dropdown');
                this.productOptions = response.data?.data || [];
            } catch (error) {
                console.error('Gagal memuat dropdown produk:', error);
            }
        }
    }
};
</script>

<template>
    <div class="card">
        <div class="text-right mb-6">
            <router-link to="/stock-opname/create"
                class="h-12 inline-flex items-center font-farro rounded-lg bg-primary text-white hover:bg-primary-dark transition duration-200 px-5 hover:text-white"
            >
                <Icon icon="mdi:plus" class="text-xl mr-2"></Icon> Tambah
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
            dataKey="opnameId"
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
                style="min-width: 16rem"
            >
                <template #body="{ data }">{{ data.tanggal_opname }}</template>
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
                field="nama"
                header="Nama Barang"
                sortable
                filter
                :showFilterMenu="false"
                filterPlaceholder="Cari nama barang..."
                style="min-width: 18rem"
            >
                <template #body="{ data }">{{ data.nama }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <CustomSelect
                        v-model="filterModel.value"
                        :options="productOptions"
                        optionLabel="label"
                        optionValue="value"
                        @change="filterCallback()"
                        placeholder="Pilih nama barang"
                        showClear
                        filter
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
                style="min-width: 10rem"
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
                style="min-width: 10rem"
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
                style="min-width: 10rem"
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
                style="min-width: 15rem"
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
                        @click="toggle($event, data.opnameId)"
                    >
                        <i class="pi pi-ellipsis-h"></i>
                    </button>

                    <Menu
                        :ref="`menu_${data.opnameId}`"
                        :id="'overlay_menu_' + data.opnameId"
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

    <Dialog v-model:visible="showDeleteDialog" header="Hapus Opname" :style="{ width: '25rem' }">
        <span class="text-surface-500 block mb-8">
        Apakah Anda yakin ingin menghapus opname <strong>{{ tempData?.nama }}</strong
        > pada tanggal <strong>{{ tempData?.tanggal_opname }}</strong
        >?
        </span>
        <div class="flex justify-end gap-2">
        <Button type="button" label="Batal" severity="secondary" @click="showDeleteDialog = false"></Button>
        <button type="button" @click="deleteItem" class="rounded-lg bg-danger px-6 text-white hover:bg-danger-dark disabled:border-gray-200 disabled:bg-gray-200" :disabled="loading">
            <i class="pi pi-trash mr-2"></i>Hapus
        </button>
        </div>
    </Dialog>
</template>

<style lang="scss" scoped></style>
