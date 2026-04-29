<script>
import Dropdown from "primevue/dropdown";

export default {
    components: {
        Dropdown,
    },
    data() {
        return {
            form: this.getDefaultForm(),
        };
    },
    computed: {
        isEditMode() {
            return this.$route?.name === "edit_opname";
        },
    },
    mounted() {
        this.initializeForm();
    },
    methods: {
        getDefaultForm() {
            return {
                tanggal_opname: "",
                nama: "",
                stok_sistem: "",
                stok_fisik: "",
                selisih: "",
                note: "",
            };
        },
        initializeForm() {
            if (!this.isEditMode) {
                this.form = this.getDefaultForm();
                return;
            }

            const routeId = this.$route?.params?.id;
            const rawDraft = sessionStorage.getItem("opname_edit_draft");

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
                    tanggal_opname: draft.tanggal_opname || "",
                    nama: draft.nama || "",
                    stok_sistem: draft.stok_sistem || "",
                    stok_fisik: draft.stok_fisik || "",
                    selisih: draft.selisih || "",
                    note: draft.note || "",
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
                    ? `Perubahan barang ${this.form.tanggal_opname || this.form.nama || ""} berhasil disimpan`
                    : `Data barang ${this.form.tanggal_opname || this.form.nama || "baru"} siap disimpan`,
                life: 3000,
            });

            if (this.isEditMode) {
                sessionStorage.removeItem("opname_edit_draft");
            }

            this.$router.push({ name: "stock-opname" });
        },
    },
};
</script>

<template>
    <div class="card">
        <h6 class="mb-6 text-xl font-farro font-bold">
            {{ isEditMode ? "Edit Opname" : "Tambah Opname" }}
        </h6>

        <form @submit.prevent="doSubmit()">
            <div class="flex justify-center gap-4 mb-4">
                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Tanggal Opname <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.tanggal_opname"
                        type="date"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Input tanggal opname..."
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
                    <label class="mb-2 block font-farro">Stok Sistem <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.stok_sistem"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Masukkan stok sistem..."
                    />
                </div>
            </div>

            <div class="flex justify-center gap-4 mb-4">
                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Stok Fisik <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.stok_fisik"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Masukkan stok fisik..."
                    />
                </div>

                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Selisih <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.selisih"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Masukkan selisih..."
                    />
                </div>
            </div>

            <div class="flex justify-center gap-4 mb-4">
                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Catatan <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.note"
                        type="text"
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Input catatan..."
                    />
                </div>

            </div>

            <div class="flex justify-end gap-3">
                <router-link
                    to="/stock-opname"
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
