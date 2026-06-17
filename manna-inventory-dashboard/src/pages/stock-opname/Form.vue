<script>
import Select from "primevue/select";
import CustomSelect from "@/components/CustomSelect.vue";
import Textarea from "primevue/textarea";
import { api } from "@/utils/api";

export default {
    components: {
        Select,
        CustomSelect,
        Textarea,
    },
    data() {
        return {
            form: this.getDefaultForm(),
            barangOptions: [],
            submitting: false,
        };
    },
    computed: {
        isEditMode() {
            return this.$route?.name === "edit_opname";
        },
    },
    watch: {
        async "form.nama"(newVal) {
            if (!newVal) {
                this.form.stok_sistem = "";
                return;
            }

            try {
                const response = await api.get(`/stocks/${newVal}`);
                this.form.stok_sistem = response.data?.data ?? "";
            } catch (error) {
                console.error("Gagal mengambil stok barang:", error);
            }
        },
        "form.stok_sistem"() {
            this.calculateSelisih();
        },
        "form.stok_fisik"() {
            this.calculateSelisih();
        },
    },
    async mounted() {
        await Promise.all([
            this.initializeForm(),
            this.fetchProducts(),
        ])
    },
    methods: {
        getDefaultForm() {
            return {
                tanggal_opname: "",
                nama: "",
                stok_sistem: "",
                stok_fisik: "",
                selisih: 0,
                note: "",
            };
        },
        calculateSelisih() {
            const sistem = Number(this.form.stok_sistem) || 0;
            const fisik = Number(this.form.stok_fisik) || 0;
            this.form.selisih = fisik - sistem;
        },
        async initializeForm() {
            if (!this.isEditMode) {
                this.form = this.getDefaultForm();
                return;
            }

            const opnameId = this.$route?.params?.id;
            if (!opnameId) return;

            try {
                const response = await api.get(`/stock-opnames/${opnameId}`);
                const opname = response.data?.data;
                if (opname) {
                    this.form = {
                        tanggal_opname: opname.date || "",
                        nama: opname.productId || "",
                        stok_sistem: opname.stockSystem || 0,
                        stok_fisik: opname.stockActual || 0,
                        selisih: opname.diff || 0,
                        note: opname.note || "",
                    }
                }
            } catch (error) {
                console.error("Gagal mengambil data stock opname", error);
                this.$toast?.add?.({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.message || "Gagal memuat data stock opname untuk diedit.",
                    life: 3000,
                });
            }
        },
        async fetchProducts() {
            try {
                const response = await api.get(`/products/dropdown`);
                this.barangOptions = response.data?.data || [];
            } catch (error) {
                console.error("Gagal memuat barang", error);
                this.$toast?.add?.({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.message || "Gagal memuat data barang.",
                    life: 3000,
                });
            }   
        },
        async doSubmit() {
            if (this.submitting) return;

            // validasi sederhana
            if (!this.form.tanggal_opname || !this.form.nama || this.form.stok_sistem === "" || this.form.stok_fisik === "") {
                this.$toast?.add?.({
                    severity: "warn",
                    summary: "Peringatan",
                    detail: "Harap lengkapi field wajib!",
                    life: 3000,
                });
                return;
            }

            this.submitting = true;
            try {
                // Ambil userId dari localStorage
                const userJson = localStorage.getItem('user');
                let userId = '';
                if (userJson) {
                    const parsed = JSON.parse(userJson);
                    userId = parsed.userId || parsed.id || '';
                }

                const payload = {
                    date: this.form.tanggal_opname,
                    productId: this.form.nama,
                    stockSystem: Number(this.form.stok_sistem) || 0,
                    stockActual: Number(this.form.stok_fisik) || 0,
                    note: this.form.note || "",
                    userId: userId,
                };

                if (!this.isEditMode) {
                    await api.post("/stock-opnames", payload);
                    this.$toast?.add?.({
                        severity: "success",
                        summary: "Berhasil",
                        detail: `Stock opname baru berhasil ditambahkan`,
                        life: 3000,
                    });
                } else {
                    const opnameId = this.$route?.params?.id;
                    await api.put(`/stock-opnames/${opnameId}`, {
                        date: payload.date,
                        productId: payload.productId,
                        stockSystem: payload.stockSystem,
                        stockActual: payload.stockActual,
                        note: payload.note,
                        userId: payload.userId,
                    });
                    this.$toast?.add?.({
                        severity: "success",
                        summary: "Berhasil",
                        detail: `Perubahan stock opname berhasil disimpan`,
                        life: 3000,
                    });
                    sessionStorage.removeItem("opname_edit_draft");
                }

                this.$router.push({ name: "stock_opname" });
            } catch (error) {
                console.error("Gagal menyimpan stock opname", error);
                this.$toast?.add?.({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.message || "Gagal menyimpan stock opname",
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
                    <CustomSelect
                        v-model="form.nama"
                        :options="barangOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Pilih barang"
                        class="font-farro w-full !h-12"
                        style="height: 3rem;"
                        showClear
                        filter
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
                        readonly
                        class="font-farro h-12 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 focus:outline-none cursor-not-allowed"
                        placeholder="Selisih otomatis dihitung..."
                    />
                </div>
            </div>

            <div class="flex justify-center gap-4 mb-4">
                <div class="form-group mb-2 w-full">
                    <label class="mb-2 block font-farro">Catatan <span class="text-red-500">*</span></label>
                    <Textarea
                        v-model="form.note"
                        type="text"
                        class="font-farro w-full rounded-lg border border-gray-300 p-4 focus:ring-2 focus:ring-primary focus:outline-none"
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
                    class="h-12 rounded-lg bg-primary px-5 font-farro text-white hover:bg-primary-dark transition duration-200"
                >
                    Simpan
                </button>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
:deep(.p-select) {
    height: 3rem !important;
    min-height: 3rem !important;
    border-radius: 0.5rem !important; /* matches rounded-lg of other fields */
}
</style>
