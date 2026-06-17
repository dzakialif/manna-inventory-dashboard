<script>
import { api } from '@/utils/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
    components: {
        DataTable,
        Column,
    },
    data() {
        return {
            products: [],
            loading: false,
            totalRecords: 0,
            page: 0,
            rows: 7,
        };
    },
    methods: {
        async fetchData() {
            this.loading = true;
            try {
                const queryParams = `page=${this.page}&size=${this.rows}&status=critical&sortBy=product.name&sortDirection=asc`;
                const response = await api.get(`/analysis/forecast?${queryParams}`);
                if (response.data && response.data.data) {
                    this.products = response.data.data.map((item) => ({
                        name: item.productName,
                        currentStock: item.currentStock,
                        reorderPoint: item.reorderPoint,
                        safetyStock: item.safetyStock,
                        status: item.status === 'critical' ? 'Perlu Reorder' : item.status === 'warning' ? 'Waspada' : 'Aman',
                    }));
                    this.totalRecords = response.data.pagging?.totalItems
                        ?? (response.data.pagging?.totalPage * response.data.pagging?.size)
                        ?? this.products.length;
                }
            } catch (error) {
                console.error('Gagal memuat data ROP summary:', error);
                this.products = [];
            } finally {
                this.loading = false;
            }
        },
        onPage(event) {
            this.page = event.page;
            this.rows = event.rows;
            this.fetchData();
        },
    },
    mounted() {
        this.fetchData();
    },
};
</script>

<template>
    <div class="card bg-white shadow-md">
        <div class="font-bold font-farro text-xl mb-4 border-b border-gray-300 pb-4 flex items-center gap-2">
            Reorder Point Summary
            <i v-if="loading" class="pi pi-spin pi-spinner text-base text-gray-400"></i>
        </div>

        <div v-if="!loading && products.length === 0" class="flex items-center justify-center py-16 text-gray-400 font-farro text-sm">
            Tidak ada data forecast yang tersedia.
        </div>

        <DataTable
            v-else
            class="rop-datatable"
            :value="products"
            :rows="rows"
            :totalRecords="totalRecords"
            :loading="loading"
            lazy
            :paginator="true"
            @page="onPage"
            :pt="{
                root: { class: 'font-farro' },
                tableContainer: { class: '!bg-white !rounded-lg ' },
                table: { class: '!bg-white' },
                thead: { class: '!bg-white' },
                headerCell: { class: '!bg-white !text-gray-900 !font-farro' },
                bodyRow: { class: '!bg-white hover:!bg-surface-hover' },
                bodyCell: { class: '!bg-white !text-gray-900 !font-farro' },
                paginatorBottom: { class: '!bg-white !pt-3' }
            }"
        >
            <Column field="name" header="Nama Produk" style="width: 45%"></Column>
            <Column field="currentStock" header="Stok Saat Ini" style="width: 20%"></Column>
            <Column field="reorderPoint" header="ROP" style="width: 20%"></Column>
            <Column field="status" header="Status ROP" style="width: 15%">
                <template #body="slotProps">
                    <span
                        class="inline-block whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold"
                        :class="{
                            'bg-red-100 text-red-700': slotProps.data.status === 'Perlu Reorder',
                            'bg-yellow-100 text-yellow-700': slotProps.data.status === 'Waspada',
                            'bg-green-100 text-green-700': slotProps.data.status === 'Aman'
                        }"
                    >
                        {{ slotProps.data.status }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
:deep(.rop-datatable .p-datatable-table-container),
:deep(.rop-datatable .p-datatable-table),
:deep(.rop-datatable .p-datatable-thead > tr > th),
:deep(.rop-datatable .p-datatable-tbody > tr > td),
:deep(.rop-datatable .p-paginator) {
    background: #ffffff !important;
    color: #111827 !important;
}

:deep(.rop-datatable .p-datatable-thead > tr > th) {
    border-bottom: 1px solid #e5e7eb !important;
    font-family: 'Farro', system-ui, sans-serif !important;
}

:deep(.rop-datatable .p-datatable-tbody > tr) {
    background: #ffffff !important;
}

:deep(.rop-datatable .p-datatable-tbody > tr > td) {
    border-bottom: 1px solid #e5e7eb !important;
    font-family: 'Farro', system-ui, sans-serif !important;
}

:deep(.rop-datatable .p-datatable-tbody > tr:hover) {
    background: #f9fafb !important;
}

:deep(.rop-datatable .p-paginator) {
    border-top: none !important;
    gap: 0.25rem;
    padding-top: 0.75rem;
}

:deep(.rop-datatable .p-paginator .p-paginator-page),
:deep(.rop-datatable .p-paginator .p-paginator-next),
:deep(.rop-datatable .p-paginator .p-paginator-prev),
:deep(.rop-datatable .p-paginator .p-paginator-first),
:deep(.rop-datatable .p-paginator .p-paginator-last) {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    border: 1px solid #d1d5db !important;
    border-radius: 0.5rem !important;
    background: #ffffff !important;
    color: #111827 !important;
}

:deep(.rop-datatable .p-paginator .p-paginator-page:hover),
:deep(.rop-datatable .p-paginator .p-paginator-next:hover),
:deep(.rop-datatable .p-paginator .p-paginator-prev:hover),
:deep(.rop-datatable .p-paginator .p-paginator-first:hover),
:deep(.rop-datatable .p-paginator .p-paginator-last:hover) {
    background: #E9F2EC !important;
}

:deep(.rop-datatable .p-paginator .p-paginator-page.p-highlight) {
    background: #037d5b !important;
    border-color: #037d5b !important;
    color: #ffffff !important;
}

:deep(.rop-datatable .p-paginator .p-disabled) {
    opacity: 0.5;
}
</style>