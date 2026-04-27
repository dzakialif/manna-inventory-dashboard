<script>
export default {
    data() {
        return {
            products: [
                {
                    name: "Beras Premium 5kg",
                    currentStock: 8,
                    status: "Perlu Reorder",
                },
                {
                    name: "Minyak Goreng 2L",
                    currentStock: 24,
                    status: "Aman",
                },
                {
                    name: "Gula Pasir 1kg",
                    currentStock: 12,
                    status: "Waspada",
                },
                {
                    name: "Telur Ayam 1 Rak",
                    currentStock: 5,
                    status: "Perlu Reorder",
                },
                {
                    name: "Mie Instan Kari",
                    currentStock: 38,
                    status: "Aman",
                },
                {
                    name: "Susu UHT Coklat 1L",
                    currentStock: 10,
                    status: "Waspada",
                },
            ],
        };
    },
};
</script>

<template>
    <div class="card bg-white">
        <div class="font-bold font-farro text-xl mb-4 border-b border-gray-300 pb-4">Reorder Point Summary</div>
        <DataTable
            class="rop-datatable"
            :value="products"
            :rows="5"
            :paginator="true"
            responsiveLayout="scroll"
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
            <Column field="name" header="Nama Produk" :sortable="true" style="width: 45%"></Column>
            <Column field="currentStock" header="Stok Saat Ini" :sortable="true" style="width: 25%"></Column>
            <Column field="status" header="Status ROP" :sortable="true" style="width: 30%">
                <template #body="slotProps">
                    <span
                        class="px-3 py-1 rounded-full text-xs font-semibold"
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