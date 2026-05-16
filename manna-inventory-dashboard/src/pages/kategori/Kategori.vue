<script>
import { api } from '@/utils/api';

export default {
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
        nama: { value: null, matchMode: 'contains' },
        deskripsi: { value: null, matchMode: 'contains' },
        tanggal_dibuat: { value: null, matchMode: 'contains' },
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
      // Delete dialog
      showDeleteDialog: false,
      tempData: null,
      // Form dialog (Create/Edit)
      showFormDialog: false,
      isEdit: false,
      submitting: false,
      formData: {
        categoryId: null,
        name: '',
        desc: '',
      },
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      try {
        const response = await api.get('/categories/');
        const result = response.data;

        // Map API response fields ke field lokal yang digunakan tabel
        this.data = (result.data || []).map((item) => ({
          categoryId: item.categoryId,
          nama: item.name,
          deskripsi: item.desc || '-',
          tanggal_dibuat: this.formatDate(item.createdAt),
          // Simpan data mentah untuk keperluan edit
          _raw: item,
        }));

        // Handle pagination info
        if (result.pagging) {
          this.currentPage = result.pagging.currentPage;
          this.totalPages = result.pagging.totalPage;
          this.pageSize = result.pagging.size;
          this.totalItems = result.pagging.totalItems;
        }
      } catch (error) {
        console.error('Gagal memuat data kategori:', error);
        this.$toast?.add?.({
          severity: 'error',
          summary: 'Gagal',
          detail: error.message || 'Gagal memuat data kategori',
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    // ── Form Dialog (Create / Edit) ──────────────────────
    openCreateDialog() {
      this.formData = { categoryId: null, name: '', desc: '' };
      this.isEdit = false;
      this.showFormDialog = true;
    },
    async editItem(item) {
      this.submitting = true; // Use submitting state for loading indicator if needed
      try {
        const response = await api.get(`/categories/${item.categoryId}`);
        const categoryData = response.data?.data || item._raw || item;

        this.formData = {
          categoryId: categoryData.categoryId,
          name: categoryData.name || item.nama,
          desc: categoryData.desc || '',
        };
        this.isEdit = true;
        this.showFormDialog = true;
      } catch (error) {
        console.error('Gagal mengambil detail kategori:', error);
        this.$toast?.add?.({
          severity: 'error',
          summary: 'Gagal',
          detail: 'Gagal memuat detail kategori',
          life: 3000,
        });
      } finally {
        this.submitting = false;
      }
    },
    async saveCategory() {
      // Validasi dasar
      if (!this.formData.name || !this.formData.name.trim()) {
        this.$toast?.add?.({
          severity: 'warn',
          summary: 'Validasi',
          detail: 'Nama kategori tidak boleh kosong',
          life: 3000,
        });
        return;
      }

      this.submitting = true;
      try {
        const payload = {
          name: this.formData.name.trim(),
          desc: this.formData.desc?.trim() || null,
        };

        if (this.isEdit) {
          await api.put(`/categories/${this.formData.categoryId}`, payload);
        } else {
          await api.post('/categories/create', payload);
        }

        this.showFormDialog = false;
        this.$toast?.add?.({
          severity: 'success',
          summary: 'Berhasil',
          detail: this.isEdit ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan',
          life: 2500,
        });

        // Refresh data tabel
        await this.fetchCategories();
      } catch (error) {
        console.error('Gagal menyimpan kategori:', error);
        this.$toast?.add?.({
          severity: 'error',
          summary: 'Gagal',
          detail: error.message || 'Gagal menyimpan data kategori',
          life: 3000,
        });
      } finally {
        this.submitting = false;
      }
    },

    // ── Delete ────────────────────────────────────────────
    confirmDelete(item) {
      this.tempData = item;
      this.showDeleteDialog = true;
    },
    async deleteItem() {
      if (!this.tempData) return;

      try {
        await api.delete(`/categories/${this.tempData.categoryId}`);

        this.data = this.data.filter((item) => item.categoryId !== this.tempData.categoryId);
        this.showDeleteDialog = false;
        this.tempData = null;

        this.$toast?.add?.({
          severity: 'success',
          summary: 'Berhasil',
          detail: 'Data kategori dihapus',
          life: 2500,
        });
      } catch (error) {
        console.error('Gagal menghapus kategori:', error);
        this.$toast?.add?.({
          severity: 'error',
          summary: 'Gagal',
          detail: error.message || 'Gagal menghapus data kategori',
          life: 3000,
        });
      }
    },

    // ── Helpers ───────────────────────────────────────────
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
    toggle(event, itemId) {
      this.$refs[`menu_${itemId}`]?.toggle?.(event);
    },
  },
};
</script>

<template>
  <div class="card">
    <div class="text-right mb-6">
      <button
        type="button"
        class="h-12 inline-flex items-center font-farro rounded-lg btn-primary bg-primary text-white hover:bg-primary-dark transition duration-200 px-5"
        @click="openCreateDialog"
      >
        <Icon icon="mdi:plus" class="text-xl mr-2"></Icon> Tambah Kategori
      </button>
    </div>

    <DataTable
      class="barang-datatable font-farro text-sm"
      :value="data"
      v-model:filters="filters"
      filterDisplay="row"
      :paginator="true"
      :rows="10"
      dataKey="categoryId"
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
        header="Nama Kategori"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari nama kategori..."
        style="min-width: 14rem"
      >
        <template #body="{ data }">{{ data.nama }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <input
            v-model="filterModel.value"
            type="text"
            class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Cari nama kategori..."
            @input="filterCallback()"
          />
        </template>
      </Column>

      <Column
        :pt="columnPt"
        class="font-farro text-md"
        field="deskripsi"
        header="Deskripsi"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari deskripsi..."
        style="min-width: 18rem"
      >
        <template #body="{ data }">{{ data.deskripsi }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <input
            v-model="filterModel.value"
            type="text"
            class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Cari deskripsi..."
            @input="filterCallback()"
          />
        </template>
      </Column>

      <Column
        :pt="columnPt"
        class="font-farro text-md"
        field="tanggal_dibuat"
        header="Tanggal Dibuat"
        sortable
        filter
        :showFilterMenu="false"
        filterPlaceholder="Cari tanggal..."
        style="min-width: 14rem"
      >
        <template #body="{ data }">{{ data.tanggal_dibuat }}</template>
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

      <Column :pt="columnPt" class="font-farro text-md" header="Aksi" style="min-width: 10rem">
        <template #body="{ data }">
          <button type="button" class="block rounded-lg py-1 px-2 bg-white border border-gray-300 text-gray-500 text-sm hover:bg-gray-300" @click="toggle($event, data.categoryId)">
            <i class="pi pi-ellipsis-h"></i>
          </button>

          <Menu
            :ref="`menu_${data.categoryId}`"
            :id="'overlay_menu_' + data.categoryId"
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

  <!-- Dialog Form Create / Edit Kategori -->
  <Dialog
    v-model:visible="showFormDialog"
    :header="isEdit ? 'Edit Kategori' : 'Tambah Kategori'"
    :style="{ width: '28rem' }"
    modal
    :closable="!submitting"
  >
    <div class="flex flex-col gap-4 mt-2">
      <div class="flex flex-col gap-1">
        <label class="font-farro text-sm font-semibold text-gray-700">Nama Kategori <span class="text-red-500">*</span></label>
        <input
          v-model="formData.name"
          type="text"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Masukkan nama kategori..."
          :disabled="submitting"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-farro text-sm font-semibold text-gray-700">Deskripsi</label>
        <textarea
          v-model="formData.desc"
          rows="3"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-farro focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          placeholder="Masukkan deskripsi (opsional)..."
          :disabled="submitting"
        ></textarea>
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <Button type="button" label="Batal" severity="secondary" @click="showFormDialog = false" :disabled="submitting"></Button>
      <button
        type="button"
        @click="saveCategory"
        class="rounded-lg bg-primary px-6 py-2 text-white font-farro hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        :disabled="submitting"
      >
        <i v-if="submitting" class="pi pi-spin pi-spinner mr-2"></i>
        <i v-else class="pi pi-check mr-2"></i>
        {{ submitting ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>
  </Dialog>

  <!-- Dialog Konfirmasi Delete Kategori -->
  <Dialog v-model:visible="showDeleteDialog" header="Hapus Kategori" :style="{ width: '25rem' }">
    <span class="text-surface-500 block mb-8">
      Apakah Anda yakin ingin menghapus kategori <strong>{{ tempData?.nama }}</strong
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
</style>
