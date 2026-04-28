<script>
import Dropdown from "primevue/dropdown";

export default {
    components: {
        Dropdown,
    },
    data() {
        return {
            form: this.getDefaultForm(),
            kategoriOptions: ["Moiaa", "SBC", "Topping"],
            satuanOptions: ["PCS", "Pack", "Box"],
        };
    },
    computed: {
        isEditMode() {
            return this.$route?.name === "edit_barang";
        },
    },
    mounted() {
        this.initializeForm();
    },
    methods: {
        getDefaultForm() {
            return {
                kode_barang: "",
                nama: "",
                kategori: "",
                ukuran: "",
                harga: null,
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
                    harga: draft.harga ?? null,
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
        doSubmit() {
            this.$toast?.add?.({
                severity: "success",
                summary: "Berhasil",
                detail: this.isEditMode
                    ? `Perubahan barang ${this.form.kode_barang || this.form.nama || ""} berhasil disimpan`
                    : `Data barang ${this.form.kode_barang || this.form.nama || "baru"} siap disimpan`,
                life: 3000,
            });

            if (this.isEditMode) {
                sessionStorage.removeItem("barang_edit_draft");
            }

            this.$router.push({ name: "barang" });
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
                    <Dropdown
                        v-model="form.kategori"
                        :options="kategoriOptions"
                        class="kategori-dropdown w-full h-12 font-farro"
                        panelClass="kategori-dropdown-panel"
                        placeholder="Pilih kategori"
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
                    class="h-12 rounded-lg btn-primary px-5 font-farro text-white hover:bg-primary-dark transition duration-200"
                >
                    Simpan
                </button>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
:deep(.kategori-dropdown.p-focus) {
    border-color: var(#037D5B) !important;
    box-shadow: 0 0 0 1px var(--primary-color) !important;
    outline: none !important;
}

:deep(.kategori-dropdown-panel .p-dropdown-item.p-highlight) {
    background: var(#F3F5F8) !important;
}

:deep(.kategori-dropdown-panel .p-dropdown-item:not(.p-highlight):hover) {
    background: var(#E9F2EC) !important;
}
</style>
