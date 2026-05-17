<script>
import Select from 'primevue/select';
import { api } from '@/utils/api';

export default {
  components: {
    Select,
  },
  data() {
    return {
      data: [],
      loading: false,
      // Pagination
      currentPage: 0,
      totalPages: 0,
      pageSize: 10,
      totalItems: 0,
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
      sortField: null,
      sortOrder: null,
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
      kategoriOptions: [],
      categoriesList: [],
      ukuranOptions: [],
      rasaOptions: [],
      satuanOptions: [],
      productOptions: [],
      showDeleteDialog: false,
      tempData: null,
    };
  },
  async mounted() {
    await Promise.all([
      this.fetchCategoriesDropdown(),
      this.fetchCategories(),
      this.fetchRasaDropdown(),
      this.fetchUkuranDropdown(),
      this.fetchSatuanDropdown(),
      this.fetchProductDropdown(),
    ]);
    this.fetchProducts();
  },
  methods: {
    async fetchProducts(page = 0) {
      this.loading = true;
      try {
        let queryParams = `page=${page}&size=${this.pageSize}`;

        const f = this.filters;
        if (f.nama.value !== null && f.nama.value !== '') {
          const prod = this.productOptions.find(p => p.value === f.nama.value);
          const productName = prod ? prod.label : f.nama.value;
          queryParams += `&name=${encodeURIComponent(productName)}`;
        }
        if (f.kategori.value !== null && f.kategori.value !== '') {
          // Karena optionValue="categoryId", nilai f.kategori.value adalah categoryId (UUID)
          // Kita terjemahkan dulu categoryId ke nama kategori agar filter di backend sukses
          const cat = this.kategoriOptions.find(c => c.categoryId === f.kategori.value);
          const categoryName = cat ? cat.name : f.kategori.value;
          queryParams += `&categoryName=${encodeURIComponent(categoryName)}`;
        }
        if (f.ukuran.value !== null && f.ukuran.value !== '') queryParams += `&sizes=${encodeURIComponent(f.ukuran.value)}`;
        if (f.harga.value !== null && f.harga.value !== '') queryParams += `&price=${encodeURIComponent(f.harga.value)}`;
        if (f.stok.value !== null && f.stok.value !== '') queryParams += `&stock=${encodeURIComponent(f.stok.value)}`;
        if (f.satuan.value !== null && f.satuan.value !== '') queryParams += `&unit=${encodeURIComponent(f.satuan.value)}`;
        if (f.rasa.value !== null && f.rasa.value !== '') queryParams += `&flavors=${encodeURIComponent(f.rasa.value)}`;
        if (f.kode_barang.value !== null && f.kode_barang.value !== '') queryParams += `&productCode=${encodeURIComponent(f.kode_barang.value)}`;

        if (this.sortField && this.sortOrder !== null) {
          let mappedSortField = this.sortField;
          if (this.sortField === 'nama') mappedSortField = 'name';
          else if (this.sortField === 'kategori') mappedSortField = 'categoryName';
          else if (this.sortField === 'ukuran') mappedSortField = 'sizes';
          else if (this.sortField === 'harga') mappedSortField = 'price';
          else if (this.sortField === 'stok') mappedSortField = 'stock';
          else if (this.sortField === 'satuan') mappedSortField = 'unit';
          else if (this.sortField === 'rasa') mappedSortField = 'flavors';
          else if (this.sortField === 'kode_barang') mappedSortField = 'productCode';

          queryParams += `&sortBy=${mappedSortField}&sortDirection=${this.sortOrder === 1 ? 'asc' : 'desc'}`;
        }

        const response = await api.get(`/products?${queryParams}`);
        const result = response.data;

        // Map API response fields ke field lokal yang digunakan tabel
        this.data = (result.data || []).map((item) => ({
          productId: item.productId,
          kategori: this.categoriesList.find(c => c.categoryId === item.categoryId)?.name || '-',
          kode_barang: item.productCode,
          nama: item.name,
          ukuran: item.sizes,
          harga: item.price,
          stok: item.stock?.stock ?? 0,
          stockStatus: item.stock?.status || '-',
          satuan: item.unit,
          rasa: item.flavors,
          terakhir_update: this.formatDate(item.stock?.lastUpdated),
          // Simpan data mentah untuk keperluan edit
          _raw: item,
        }));

        // Handle pagination info
        if (result.pagging) {
          this.currentPage = result.pagging.currentPage;
          this.totalPages = result.pagging.totalPage;
          this.pageSize = result.pagging.size;
          // Fallback if totalItems is null, estimate from totalPage * size
          this.totalItems = (result.pagging.totalItems !== undefined && result.pagging.totalItems !== null)
            ? result.pagging.totalItems
            : (result.pagging.totalPage * result.pagging.size);
        }
      } catch (error) {
        console.error('Gagal memuat data produk:', error);
        this.$toast?.add?.({
          severity: 'error',
          summary: 'Gagal',
          detail: error.message || 'Gagal memuat data barang',
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
    onPage(event) {
      // event.page is the new page index (0-based)
      this.fetchProducts(event.page);
    },
    onSort(event) {
      this.sortField = event.sortField;
      this.sortOrder = event.sortOrder;
      this.fetchProducts(0); // Reset ke halaman pertama saat di-sort
    },
    onFilter(event) {
      this.fetchProducts(0); // Reset ke halaman pertama saat filter berubah
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
      } catch {
        return dateString;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(value);
    },
    editItem(item) {
      // Kirim data mentah API ke halaman edit
      sessionStorage.setItem('barang_edit_draft', JSON.stringify(item._raw || item));
      this.$router.push({
        name: 'edit_barang',
        params: { id: item.productId },
      });
    },
    confirmDelete(item) {
      this.tempData = item;
      this.showDeleteDialog = true;
    },
    async deleteItem() {
      if (!this.tempData) return;

      try {
        await api.delete(`/products/${this.tempData.productId}`)

        this.data = this.data.filter((item) => item.productId !== this.tempData.productId);
        this.showDeleteDialog = false;
        this.tempData = null;

        this.$toast?.add?.({
          severity: 'success',
          summary: 'Berhasil',
          detail: 'Data products berhasil dihapus',
          life: 2500
        });
      } catch (error) {
        console.error('Gagal menghapus product:', error);
        this.$toast?.add?.({
          severity: 'error',
          summary: 'Gagal',
          detail: error.message || 'Gagal menghapus data product',
          life: 3000,
        });
      }
    },
    async fetchCategoriesDropdown() {
      try {
        const response = await api.get('/categories/dropdown');
        this.kategoriOptions = response.data?.data || [];
      } catch (error) {
        console.error('Gagal memuat dropdown kategori:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await api.get('/categories');
        this.categoriesList = response.data?.data || [];
      } catch (error) {
        console.error('Gagal memuat list kategori:', error);
      }
    },
    async fetchRasaDropdown() {
      try {
        const response = await api.get('/products/flavors');
        this.rasaOptions = response.data?.data || [];
      } catch (error) {
        console.error('Gagal memuat dropdown rasa:', error);
      }
    },
    async fetchUkuranDropdown() {
      try {
        const response = await api.get('/products/sizes');
        this.ukuranOptions = response.data?.data || [];
      } catch (error) {
        console.error('Gagal memuat dropdown ukuran:', error);
      }
    },
    async fetchSatuanDropdown() {
      try {
        const response = await api.get('/products/units');
        this.satuanOptions = response.data?.data || [];
      } catch (error) {
        console.error('Gagal memuat dropdown satuan:', error);
      }
    },
    async fetchProductDropdown() {
      try {
        const response = await api.get('/products/dropdown');
        this.productOptions = response.data?.data || [];
      } catch (error) {
        console.error('Gagal memuat dropdown produk:', error);
      }
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
      dataKey="productId"
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
        field="nama"
        header="Nama Barang"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari nama barang..."
        style="min-width: 14rem"
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
            optionLabel="name"
            optionValue="categoryId"
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
            optionLabel="label"
            optionValue="value"
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
          <Select
            v-model="filterModel.value"
            :options="satuanOptions"
            optionLabel="label"
            optionValue="value"
            @change="filterCallback()"
            placeholder="Pilih satuan"
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
            optionLabel="label"
            optionValue="value"
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
          <button type="button" class="block rounded-lg py-1 px-2 bg-white border border-gray-300 text-gray-500 text-sm hover:bg-gray-300" @click="toggle($event, data.productId)">
            <i class="pi pi-ellipsis-h"></i>
          </button>

          <Menu
            :ref="`menu_${data.productId}`"
            :id="'overlay_menu_' + data.productId"
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
