<script>
import Select from "primevue/select";

export default {
    components: {
        Select,
    },
    data() {
        return {
            form: this.getDefaultForm(),
            jenisOptions: ["Masuk", "Keluar", "Opname"],
            barangOptions: [
                { nama: "Moiaa Swiss Choco 1000 grm", harga: 15000000 },
                { nama: "Moiaa Mango 1000 grm", harga: 800000 },
                { nama: "SBC Cappucino Original 1000 grm", harga: 1200000 },
                { nama: "Moiaa Strawberry 1000 grm", harga: 2500000 },
                { nama: "SBC Swiss Choco 1000 grm", harga: 1500000 },
                { nama: "Moiaa Mango 200 grm", harga: 750000 },
                { nama: "SBC Green Tea 500 grm", harga: 1800000 },
                { nama: "Topping Cheese Cream 500 grm", harga: 4500000 },
            ],
        };
    },
    computed: {
        isEditMode() {
            return this.$route?.name === "edit_transaksi";
        },
        totalItem() {
            return this.form.items.length;
        },
        totalQuantity() {
            return this.form.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        },
        totalNilai() {
            return this.form.items.reduce((sum, item) => sum + this.getSubtotal(item), 0);
        },
    },
    mounted() {
        this.initializeForm();
    },
    methods: {
        getDefaultForm() {
            return {
                tanggal: "",
                no_invoice: "",
                jenis: "",
                items: [this.getDefaultItem()],
            };
        },
        getDefaultItem() {
            return {
                nama_barang: null,
                quantity: 1,
                harga: 0,
            };
        },
        initializeForm() {
            if (!this.isEditMode) {
                this.form = this.getDefaultForm();
                // Auto-generate invoice number for new transactions
                const now = new Date();
                const yymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
                this.form.no_invoice = `IN-INV-${yymm}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")}`;
                this.form.tanggal = now.toISOString().split("T")[0];
                return;
            }

            const routeId = this.$route?.params?.id;
            const rawDraft = sessionStorage.getItem("transaksi_edit_draft");

            if (!rawDraft) return;

            try {
                const draft = JSON.parse(rawDraft);
                if (String(draft.id) !== String(routeId)) return;

                this.form = {
                    ...this.getDefaultForm(),
                    tanggal: draft.tanggal || "",
                    no_invoice: draft.no_invoice || "",
                    jenis: draft.jenis || "",
                    items: draft.items?.length ? draft.items : [this.getDefaultItem()],
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
        onBarangSelect(item) {
            if (item.nama_barang) {
                const barang = this.barangOptions.find((b) => b.nama === item.nama_barang);
                if (barang) {
                    item.harga = barang.harga;
                }
            } else {
                item.harga = 0;
            }
        },
        getSubtotal(item) {
            return (Number(item.quantity) || 0) * (Number(item.harga) || 0);
        },
        addItem() {
            this.form.items.push(this.getDefaultItem());
        },
        removeItem(index) {
            if (this.form.items.length > 1) {
                this.form.items.splice(index, 1);
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(value || 0);
        },
        doSubmit() {
            this.$toast?.add?.({
                severity: "success",
                summary: "Berhasil",
                detail: this.isEditMode
                    ? `Perubahan transaksi ${this.form.no_invoice} berhasil disimpan`
                    : `Transaksi ${this.form.no_invoice} berhasil dibuat`,
                life: 3000,
            });

            if (this.isEditMode) {
                sessionStorage.removeItem("transaksi_edit_draft");
            }

            this.$router.push({ name: "transaksi" });
        },
    },
};
</script>

<template>
    <div class="card">
        <h6 class="mb-6 text-xl font-farro font-bold">
            {{ isEditMode ? "Edit Transaksi" : "Tambah Transaksi" }}
        </h6>

        <form @submit.prevent="doSubmit()">

            <!-- ── Section 1: Informasi Transaksi ── -->
            <div class="mb-6 rounded-xl border border-gray-200 p-5 bg-gray-50">
                <h6 class="font-farro font-semibold text-gray-700 mb-4 text-base">
                    <i class="pi pi-file-edit mr-2 text-primary"></i>Informasi Transaksi
                </h6>
                <div class="flex justify-center gap-4 mb-4">
                    <div class="form-group mb-2 w-full">
                        <label class="mb-2 block font-farro">Tanggal <span class="text-red-500">*</span></label>
                        <input
                            v-model="form.tanggal"
                            type="date"
                            class="font-farro h-12 w-full rounded-lg border border-gray-300 bg-white px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    <div class="form-group mb-2 w-full">
                        <label class="mb-2 block font-farro">No. Invoice <span class="text-red-500">*</span></label>
                        <input
                            v-model="form.no_invoice"
                            type="text"
                            class="font-farro h-12 w-full rounded-lg border border-gray-300 bg-white px-4 focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Contoh: IN-INV-202604-0001"
                        />
                    </div>

                    <div class="form-group mb-2 w-full">
                        <label class="mb-2 block font-farro">Jenis Transaksi <span class="text-red-500">*</span></label>
                        <Select
                            v-model="form.jenis"
                            :options="jenisOptions"
                            placeholder="Pilih jenis transaksi"
                            class="font-farro w-full"
                            showClear
                            :pt="{
                            root: {
                                class: 'flex items-center !bg-white !text-black !border !border-gray-300 !rounded-lg !h-12 !w-full focus-within:!border-primary focus-within:!ring-1 focus-within:!ring-primary',
                            },
                            label: { class: form.jenis ? '!text-black !text-md' : '!text-gray-400 !text-md' },
                            dropdown: { class: '!text-gray-500 !bg-white' },
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
            </div>

            <!-- ── Section 2: Detail Barang ── -->
            <div class="mb-6 rounded-xl border border-gray-200 p-5 bg-gray-50">
                <div class="flex items-center justify-between mb-4">
                    <h6 class="font-farro font-semibold text-gray-700 text-base">
                        <i class="pi pi-list mr-2 text-primary"></i>Detail Barang
                    </h6>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 h-9 font-farro text-sm text-white hover:bg-primary-dark transition duration-200"
                        @click="addItem"
                    >
                        <i class="pi pi-plus text-xs"></i> Tambah Baris
                    </button>
                </div>

                <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table class="w-full font-farro text-sm">
                        <thead>
                            <tr class="bg-gray-100 border-b border-gray-200">
                                <th class="px-4 py-3 text-left font-semibold text-gray-600 w-8">No</th>
                                <th class="px-4 py-3 text-left font-semibold text-gray-600">Nama Barang</th>
                                <th class="px-4 py-3 text-left font-semibold text-gray-600 w-32">Quantity</th>
                                <th class="px-4 py-3 text-left font-semibold text-gray-600 w-44">Harga Satuan</th>
                                <th class="px-4 py-3 text-left font-semibold text-gray-600 w-44">Subtotal</th>
                                <th class="px-4 py-3 text-center font-semibold text-gray-600 w-16">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(item, index) in form.items"
                                :key="index"
                                class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                            >
                                <td class="px-4 py-3 text-gray-500">{{ index + 1 }}</td>

                                <!-- Nama Barang -->
                                <td class="px-4 py-3">
                                    <Select
                                        v-model="item.nama_barang"
                                        :options="barangOptions"
                                        optionLabel="nama"
                                        optionValue="nama"
                                        placeholder="Pilih barang..."
                                        class="font-farro w-full"
                                        showClear
                                        @change="onBarangSelect(item)"
                                        :pt="{
                                        root: {
                                            class: 'flex items-center !bg-white !text-black !border !border-gray-300 !rounded-lg !h-10 !w-full focus-within:!border-primary focus-within:!ring-1 focus-within:!ring-primary',
                                        },
                                        label: { class: item.nama_barang ? '!text-black !text-sm' : '!text-gray-400 !text-sm' },
                                        dropdown: { class: '!text-gray-500 !bg-white' },
                                        overlay: { class: '!bg-white !text-black !border !border-gray-200 !shadow-md' },
                                        listContainer: { class: 'bg-white' },
                                        list: { class: '!bg-white' },
                                        option: { class: '!text-black !font-farro !bg-white hover:!bg-surface-hover' },
                                        optionLabel: { class: '!text-black' },
                                        emptyMessage: { class: '!text-black !bg-white' },
                                        }"
                                    />
                                </td>

                                <!-- Quantity -->
                                <td class="px-4 py-3">
                                    <input
                                        v-model.number="item.quantity"
                                        type="number"
                                        min="1"
                                        class="font-farro h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="0"
                                    />
                                </td>

                                <!-- Harga Satuan -->
                                <td class="px-4 py-3">
                                    <input
                                        v-model.number="item.harga"
                                        type="number"
                                        min="0"
                                        class="font-farro h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="0"
                                    />
                                </td>

                                <!-- Subtotal (readonly) -->
                                <td class="px-4 py-3">
                                    <div class="h-10 flex items-center rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm text-gray-700">
                                        {{ formatCurrency(getSubtotal(item)) }}
                                    </div>
                                </td>

                                <!-- Hapus -->
                                <td class="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                                        :disabled="form.items.length === 1"
                                        @click="removeItem(index)"
                                        title="Hapus baris"
                                    >
                                        <i class="pi pi-trash text-sm"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ── Section 3: Ringkasan ── -->
            <div class="mb-6 rounded-xl border border-gray-200 p-5 bg-gray-50">
                <h6 class="font-farro font-semibold text-gray-700 mb-4 text-base">
                    <i class="pi pi-calculator mr-2 text-primary"></i>Ringkasan
                </h6>
                <div class="grid grid-cols-3 gap-4">
                    <div class="rounded-lg bg-white border border-gray-200 p-4 flex flex-col gap-1">
                        <span class="font-farro text-xs text-gray-500 uppercase tracking-wide">Total Item</span>
                        <span class="font-farro text-2xl font-bold text-gray-800">{{ totalItem }}</span>
                        <span class="font-farro text-xs text-gray-400">jenis barang</span>
                    </div>
                    <div class="rounded-lg bg-white border border-gray-200 p-4 flex flex-col gap-1">
                        <span class="font-farro text-xs text-gray-500 uppercase tracking-wide">Total Quantity</span>
                        <span class="font-farro text-2xl font-bold text-gray-800">{{ totalQuantity }}</span>
                        <span class="font-farro text-xs text-gray-400">unit</span>
                    </div>
                    <div class="rounded-lg bg-white border border-primary p-4 flex flex-col gap-1">
                        <span class="font-farro text-xs text-gray-500 uppercase tracking-wide">Total Nilai</span>
                        <span class="font-farro text-xl font-bold text-primary">{{ formatCurrency(totalNilai) }}</span>
                        <span class="font-farro text-xs text-gray-400">total transaksi</span>
                    </div>
                </div>
            </div>

            <!-- ── Section 4: Actions ── -->
            <div class="flex justify-end gap-3">
                <router-link
                    to="/transaksi"
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
</style>
