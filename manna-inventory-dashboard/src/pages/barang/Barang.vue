<script>
import Select from 'primevue/select';

export default {
  components: {
    Select,
  },
  data() {
    return {
      data: [
        {
          id: 1,
          kode_barang: 'BRG001',
          nama: 'Moiaa Swiss Choco 1000grm',
          kategori: 'Moiaa',
          ukuran: '1000',
          harga: 15000000,
          stok: 5,
          satuan: 'PCS',
          rasa: 'Coklat',
          terakhir_update: '2024-01-15',
        },
        {
          id: 2,
          kode_barang: 'BRG002',
          nama: 'Moiaa Mango 1000grm',
          kategori: 'Moiaa',
          ukuran: '1000',
          harga: 800000,
          stok: 20,
          satuan: 'PCS',
          rasa: 'Mangga',
          terakhir_update: '2024-01-10',
        },
        {
          id: 3,
          kode_barang: 'BRG003',
          nama: 'SBC Cappucino Original 1000grm',
          kategori: 'SBC',
          ukuran: '1000',
          harga: 1200000,
          stok: 15,
          satuan: 'PCS',
          rasa: 'Cappucino',
          terakhir_update: '2024-01-20',
        },
        {
          id: 4,
          kode_barang: 'BRG004',
          nama: 'Moiaa Strawberry 1000grm',
          kategori: 'Moiaa',
          ukuran: '1000',
          harga: 2500000,
          stok: 8,
          satuan: 'PCS',
          rasa: 'Strawberry',
          terakhir_update: '2024-02-01',
        },
        {
          id: 5,
          kode_barang: 'BRG005',
          nama: 'SBC Swiss Choco 1000grm',
          kategori: 'SBC',
          ukuran: '1000',
          harga: 1500000,
          stok: 12,
          satuan: 'PCS',
          rasa: 'Coklat',
          terakhir_update: '2024-02-05',
        },
        {
          id: 6,
          kode_barang: 'BRG006',
          nama: 'Moiaa Mango 200grm',
          kategori: 'Moiaa',
          ukuran: '200',
          harga: 750000,
          stok: 25,
          satuan: 'PCS',
          rasa: 'Mangga',
          terakhir_update: '2024-02-10',
        },
        {
          id: 7,
          kode_barang: 'BRG007',
          nama: 'SBC Green Tea 500grm',
          kategori: 'SBC',
          ukuran: '500',
          harga: 1800000,
          stok: 10,
          satuan: 'PCS',
          rasa: 'Green Tea',
          terakhir_update: '2024-02-15',
        },
        {
          id: 8,
          kode_barang: 'BRG008',
          nama: 'Topping Cheese Cream 500grm',
          kategori: 'Topping',
          ukuran: '500',
          harga: 4500000,
          stok: 3,
          satuan: 'PCS',
          rasa: 'Keju',
          terakhir_update: '2024-02-20',
        },
      ],
      loading: false,
      filters: {
        kode_barang: { value: null, matchMode: 'contains' },
        nama: { value: null, matchMode: 'contains' },
        kategori: { value: null, matchMode: 'contains' },
        ukuran: { value: null, matchMode: 'contains' },
        harga: { value: null, matchMode: 'contains' },
        stok: { value: null, matchMode: 'contains' },
        satuan: { value: null, matchMode: 'contains' },
        rasa: { value: null, matchMode: 'contains' },
        terakhir_update: { value: null, matchMode: 'contains' },
      },
      columnPt: {
        headerCell: {
          class: 'font-farro',
          style: { fontFamily: 'Farro, sans-serif' },
        },
        columnHeaderContent: {
          class: 'font-farro',
          style: { fontFamily: 'Farro, sans-serif' },
        },
        bodyCell: {
          class: 'font-farro',
          style: { fontFamily: 'Farro, sans-serif' },
        },
      },
      kategoriOptions: ['Moiaa', 'SBC', 'Topping'],
      ukuranOptions: ['200', '500', '1000'],
      rasaOptions: ['Coklat', 'Vanila', 'Green Tea', 'Stroberi', 'Mangga', 'Keju'],
      showDeleteDialog: false,
      tempData: null,
    };
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(value);
    },
    editItem(item) {
      sessionStorage.setItem('barang_edit_draft', JSON.stringify(item));
      this.$router.push({
        name: 'edit_barang',
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
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Data barang dihapus',
        life: 2500,
      });
    },
    toggle(event, itemId) {
      this.$refs[`menu_${itemId}`]?.toggle?.(event);
    },
  },
};
</script>

<template>
  <div class="card">
    <div class="text-right mb-6">
      <router-link
        to="/barang/create"
        class="h-12 inline-flex items-center font-farro rounded-lg btn-primary bg-primary text-white hover:bg-primary-dark transition duration-200 px-5 hover:text-white"
      >
        <Icon icon="mdi:plus" class="text-xl mr-2"></Icon> Tambah Barang
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
        field="kode_barang"
        header="Kode Barang"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari kode barang..."
        style="min-width: 12rem"
      >
        <template #body="{ data }">{{ data.kode_barang }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <input
            v-model="filterModel.value"
            type="text"
            class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Cari kode barang..."
            @input="filterCallback()"
          />
        </template>
      </Column>

      <Column
        :pt="columnPt"
        class="font-farro text-md"
        field="kategori"
        header="Kategori"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari kategori..."
        style="min-width: 12rem"
      >
        <template #body="{ data }">{{ data.kategori }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <Select
            v-model="filterModel.value"
            :options="kategoriOptions"
            @change="filterCallback()"
            placeholder="Pilih kategori"
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
        field="ukuran"
        header="Ukuran"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari ukuran..."
        style="min-width: 12rem"
      >
        <template #body="{ data }">{{ data.ukuran }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <Select
            v-model="filterModel.value"
            :options="ukuranOptions"
            @change="filterCallback()"
            placeholder="Pilih ukuran"
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
        field="harga"
        header="Harga"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari harga..."
        style="min-width: 12rem"
      >
        <template #body="{ data }">{{ formatCurrency(data.harga) }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <input
            v-model="filterModel.value"
            type="text"
            class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Cari harga..."
            @input="filterCallback()"
          />
        </template>
      </Column>

      <Column
        :pt="columnPt"
        class="font-farro text-md"
        field="stok"
        header="Stok"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari stok..."
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <span :class="data.stok <= 5 ? 'text-red-500 font-semibold' : ''"> {{ data.stok }} {{ data.satuan }} </span></template
        >
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
        field="satuan"
        header="Satuan"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari satuan..."
        style="min-width: 12rem"
      >
        <template #body="{ data }">{{ data.satuan }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <input
            v-model="filterModel.value"
            type="text"
            class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Cari satuan..."
            @input="filterCallback()"
          />
        </template>
      </Column>

      <Column
        :pt="columnPt"
        class="font-farro text-md"
        field="rasa"
        header="Rasa"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari rasa..."
        style="min-width: 12rem"
      >
        <template #body="{ data }">{{ data.rasa }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <Select
            v-model="filterModel.value"
            :options="rasaOptions"
            @change="filterCallback()"
            placeholder="Pilih rasa"
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
        field="terakhir_update"
        header="Terakhir Update"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari terakhir update..."
        style="min-width: 12rem"
      >
        <template #body="{ data }">{{ data.terakhir_update }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <input
            v-model="filterModel.value"
            type="text"
            class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Cari terakhir update..."
            @input="filterCallback()"
          />
        </template>
      </Column>

      <Column :pt="columnPt" class="font-farro text-md" header="Aksi" style="min-width: 10rem">
        <template #body="{ data }">
          <button type="button" class="block rounded-lg py-1 px-2 bg-white border border-gray-300 text-gray-500 text-sm hover:bg-gray-300" @click="toggle($event, data.id)">
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
                label: 'Delete',
                icon: 'pi pi-trash',
                command: () => confirmDelete(data),
              },
            ]"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <Dialog v-model:visible="showDeleteDialog" header="Hapus Barang" :style="{ width: '25rem' }">
    <span class="text-surface-500 block mb-8">
      Apakah Anda yakin ingin menghapus barang <strong>{{ tempData?.nama }}</strong
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

<style lang="scss" scoped>
:deep(.kategori-dropdown.p-focus) {
  border-color: #037d5b !important;
  box-shadow: 0 0 0 1px #037d5b !important;
  outline: none !important;
}
</style>
