<script>
import Select from "primevue/select";
import { api } from "@/utils/api";

export default {
    components: {
        Select,
    },
    data() {
        return {
            form: this.getDefaultForm(),
            kategoriOptions: [],
            satuanOptions: ["PCS", "Pack", "Box"],
            submitting: false,
        };
    },
    computed: {
        isEditMode() {
            return this.$route?.name === "edit_barang";
        },
    },
    async mounted() {
        this.initializeForm();
        await this.fetchCategories();
    },
    methods: {
        getDefaultForm() {
            return {
                kode_barang: "",
                nama: "",
                kategori: "",
                ukuran: "",
                harga: "",
                stok: "",
                satuan: "",
                rasa: "",
            };
        },
        initializeForm() {
            if (!this.isEditMode) {
                this.form = this.getDefaultForm();
                return;
            }

            const routeId = this.$route?.params?.id;
            const rawDraft = sessionStorage.getItem("barang_edit_draft");

            if (!rawDraft) {
                return;
            }

            try {
                const draft = JSON.parse(rawDraft);

                if (String(draft.id) !== String(routeId)) {
                    return;
                }

                this.form = {
                    ...this.getDefaultForm(),
                    kode_barang: draft.kode_barang || "",
                    nama: draft.nama || "",
                    kategori: draft.kategori || "",
                    ukuran: draft.ukuran || "",
                    harga: draft.harga ?? "",
                    stok: draft.stok ?? "",
                    satuan: draft.satuan || "",
                    rasa: draft.rasa || "",
                };
            } catch {
                this.$toast?.add?.({
                    severity: "warn",
                    summary: "Perhatian",
                    detail: "Data edit tidak valid, silakan pilih edit ulang dari tabel.",
                    life: 2500,
                });
            }
        },
        async fetchCategories() {
            try {
                const response = await api.get('/categories/');
                // Simpan hasil ke kategoriOptions, kita butuh name dan categoryId
                this.kategoriOptions = response.data?.data || [];
            } catch (error) {
                console.error("Gagal memuat kategori", error);
            }
        },
        async doSubmit() {
            if (this.submitting) return;

            // Validasi sederhana
            if (!this.form.kode_barang || !this.form.nama || !this.form.kategori) {
                this.$toast?.add?.({ severity: 'warn', summary: 'Peringatan', detail: 'Harap lengkapi field wajib!', life: 3000 });
                return;
            }

            this.submitting = true;
            try {
                const payload = {
                    categoryId: this.form.kategori, // form.kategori menyimpan categoryId
                    productCode: this.form.kode_barang,
                    name: this.form.nama,
                    unit: this.form.satuan,
                    sizes: this.form.ukuran,
                    flavors: this.form.rasa,
                    price: Number(this.form.harga) || 0,
                    initialStock: Number(this.form.stok) || 0
                };

                if (!this.isEditMode) {
                    await api.post('/products', payload);
                    this.$toast?.add?.({
                        severity: "success",
                        summary: "Berhasil",
                        detail: `Barang ${this.form.nama} berhasil ditambahkan`,
                        life: 3000,
                    });
                } else {
                    // Logika edit akan ditambahkan di request selanjutnya jika dibutuhkan
                    // Untuk saat ini hanya mengsimulasikan success untuk edit
                    this.$toast?.add?.({
                        severity: "success",
                        summary: "Berhasil",
                        detail: `Perubahan barang ${this.form.nama} berhasil disimpan`,
                        life: 3000,
                    });
                    sessionStorage.removeItem("barang_edit_draft");
                }
                
                this.$router.push({ name: "barang" });
            } catch (error) {
                console.error("Gagal menyimpan barang", error);
                this.$toast?.add?.({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.message || "Gagal menyimpan barang",
                    life: 3000,
                });
            } finally {
                this.submitting = false;
            }
        },
    },
};
</script>

<template>
    <div class="card">
        <h6 class="mb-6 text-xl font-farro font-bold">
            {{ isEditMode ? "Edit Barang" : "Tambah Barang" }}
        </h6>

        <form @submit.prevent="doSubmit()">
            <div class="flex justify-center gap-4 mb-4">
                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Kode Barang <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.kode_barang"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Input kode barang..."
                    />
                </div>

                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Nama Barang <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.nama"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Masukkan nama barang..."
                    />
                </div>
            </div>
            
            <div class="flex justify-center gap-4 mb-4">
                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Kategori <span class="text-red-500">*</span></label>
                    <Select
                        v-model="form.kategori"
                        :options="kategoriOptions"
                        optionLabel="name"
                        optionValue="categoryId"
                        placeholder="Pilih kategori"
                        class="font-farro w-full"
                        showClear
                        :pt="{
                        root: {
                            class: 'flex items-center !bg-white !text-black !border !border-gray-300 !rounded-lg !h-12 !w-full focus-within:!border-primary focus-within:!ring-1 focus-within:!ring-primary',
                        },
                        label: { class: form.kategori ? '!text-black !text-md' : '!text-gray-400 !text-md' },
                        dropdown: { class: '!text-black !bg-white' },
                        overlay: { class: '!bg-white !text-black !border !border-gray-200 !shadow-md' },
                        listContainer: { class: 'bg-white' },
                        list: { class: '!bg-white' },
                        option: { class: '!text-black !font-farro !bg-white hover:!bg-surface-hover' },
                        optionLabel: { class: '!text-black' },
                        emptyMessage: { class: '!text-black !bg-white' },
                        }"
                    />
                </div>
            </div>

            <div class="flex justify-center gap-4 mb-4">
                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Ukuran <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.ukuran"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Input ukuran barang..."
                    />
                </div>

                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Harga <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.harga"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Masukkan harga barang..."
                    />
                </div>
            </div>

            <div v-if="!isEditMode" class="flex justify-center gap-4 mb-4">
                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Stok <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.stok"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Masukkan stok barang..."
                    />
                </div>
            </div>

            <div class="flex justify-center gap-4 mb-4">
                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Satuan <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.satuan"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Input satuan barang..."
                    />
                </div>

                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Rasa <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.rasa"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Masukkan rasa barang..."
                    />
                </div>
            </div>

            <div class="flex justify-end gap-3">
                <router-link
                    to="/barang"
                    class="h-12 inline-flex items-center rounded-lg border-2 border-gray-500 bg-white px-5 font-farro text-gray-600 hover:bg-gray-200 hover:text-gray-700 transition duration-200"
                >
                    Batal
                </router-link>
                <button
                    type="submit"
                    class="h-12 flex items-center justify-center rounded-lg bg-primary px-5 font-farro text-white hover:bg-primary-dark transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="submitting"
                >
                    <i v-if="submitting" class="pi pi-spin pi-spinner mr-2"></i>
                    {{ submitting ? 'Menyimpan...' : 'Simpan' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
:deep(.kategori-dropdown.p-focus) {
    border-color: #037d5b !important;
    box-shadow: 0 0 0 1px #037d5b !important;
    outline: none !important;
}

:deep(.kategori-dropdown-panel .p-dropdown-item.p-highlight) {
    background: #f3f5f8 !important;
}

:deep(.kategori-dropdown-panel .p-dropdown-item:not(.p-highlight):hover) {
    background: #e9f2ec !important;
}
</style>
