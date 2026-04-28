<script>
import { useLayout } from "@/layouts/composables/layout";
import axios from "axios";
import { Icon } from '@iconify/vue';

export default {
    components: {
        Icon,
    },
    data() {
        return {
            userProfile: null,
            show_dialog: {
                profile: false,
            },
            toggleMenu: null,
            overlayMenuProfiles: [
                {
                    label: "Akun",
                    icon: "pi pi-user",
                    command: () => {
                        this.dialogProfile();
                    },
                },
                {
                    label: "Logout",
                    icon: "pi pi-sign-out",
                    command: () => {
                        this.$auth.logout({
                            makeRequest: true,
                            redirect: { name: "login" },
                        });
                    },
                },
            ],
            form_profile: {
                name: "",
                email: "",
                phone: "",
                photo: "",
                photo_preview: "",
                loading: false,
            },
            form_password: {
                old_password: "",
                password: "",
                password_confirmation: "",
                loading: false,
            },
            password_visible: {
                old_password: false,
                password: false,
                password_confirmation: false,
            },
            error: {
                old_password: false,
                password: false,
                password_confirmation: false,
            },
        };
    },
    computed: {
        currentPageTitle() {
            const routeTitles = {
                dashboard: "Dashboard",
                barang: "Data Barang",
                create_barang: "Data Barang",
                edit_barang: "Data Barang",
                barang_masuk: "Barang Masuk",
                barang_keluar: "Barang Keluar",
                kategori_barang: "Kategori Barang",
                stock_opname: "Stok Opname",
                abc_analysis: "Analisis ABC",
                stock_analysis: "Analisis Persediaan",
            };

            return routeTitles[this.$route?.name] || "Dashboard";
        },
        currentPageLink() {
            return this.$route?.path || "/dashboard";
        },
        user() {
            // UI mode fallback while auth integration is temporarily disabled.
            return {
                name: "Guest User",
            };
        },
        oldPasswordIcon() {
            return this.password_visible.old_password
                ? "pi-eye-slash"
                : "pi-eye";
        },
        PasswordIcon() {
            return this.password_visible.password ? "pi-eye-slash" : "pi-eye";
        },
        PasswordConfirmationIcon() {
            return this.password_visible.password_confirmation
                ? "pi-eye-slash"
                : "pi-eye";
        },
    },
    watch: {
        "form_password.old_password": function (newValue) {
            if (!newValue) {
                this.error.old_password = true;
            } else {
                this.error.old_password = false;
            }
        },
        "form_password.password": function (newValue, oldValue) {
            const regex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{6,}$/;

            if (!newValue) {
                this.error.password = true;
            } else if (newValue.length < 6) {
                this.error.password = true;
            } else if (!regex.test(newValue)) {
                this.error.password = true;
            } else {
                this.error.password = false;
            }
        },
        "form_password.password_confirmation": function (newValue, oldValue) {
            if (this.form_password.password !== newValue) {
                this.error.password_confirmation = true;
            } else {
                this.error.password_confirmation = false;
            }
        },
    },
    created() {
        const layout = useLayout();
        this.toggleMenu = layout.toggleMenu;
        // this.fetchUserProfile(); // Temporarily disabled to focus on layout rendering.

        // Dummy profile to keep topbar/avatar visible without backend dependency.
        this.userProfile = {
            name: "Guest User",
            photo_url: "",
        };
    },
    methods: {
        async fetchUserProfile() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/setting/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.$auth.token()}`,
                        },
                    },
                );

                if (response.data.code === 200) {
                    this.userProfile = response.data.data;

                    this.form_profile = {
                        name: this.userProfile.name || "",
                        email: this.userProfile.email || "",
                        phone: this.userProfile.phone || "",
                        photo_preview: this.userProfile.photo_url || "",
                    };
                }

                const pictureResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/setting/profile/picture`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.$auth.token()}`,
                        },
                    },
                );

                if (
                    pictureResponse.data.code === 200 &&
                    pictureResponse.data.data.image
                ) {
                    this.form_profile.photo_preview =
                        pictureResponse.data.data.image;
                }
            } catch (error) {
                this.$toast.add({
                    severity: "error",
                    summary: "Gagal memuat profil",
                    detail:
                        error.response?.data?.message || "Terjadi kesalahan",
                    life: 5000,
                });

                if (error.response?.status === 401) {
                    this.$auth.logout();
                }
            }
        },
        toggle(event) {
            this.$refs.menu.toggle(event);
        },
        dialogProfile() {
            this.show_dialog.profile = true;
        },
        async onInputFile(event) {
            const file = event.target.files[0];
            if (!file) return;

            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ];
            if (!allowedTypes.includes(file.type)) {
                this.$toast.add({
                    severity: "error",
                    summary: "Format tidak didukung",
                    detail: "Hanya JPEG, JPG, PNG, atau WebP",
                    life: 5000,
                });
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                this.$toast.add({
                    severity: "error",
                    summary: "File terlalu besar",
                    detail: "Maksimal 2MB",
                    life: 5000,
                });
                return;
            }

            try {
                const base64String = await this.convertFileToBase64(file);

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/setting/profile/picture`,
                    { image: base64String },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${this.$auth.token()}`,
                        },
                    },
                );

                if (response.data.code === 200) {
                    this.$toast.add({
                        severity: "success",
                        summary: "Foto profil berhasil diupdate!",
                        life: 3000,
                    });

                    this.form_profile.photo_preview = base64String;

                    await this.fetchUserProfile();
                }
            } catch (error) {
                let errorMessage = "Terjadi kesalahan saat mengunggah foto";
                if (error.response) {
                    errorMessage =
                        error.response.data.message ||
                        error.response.statusText;
                }
                this.$toast.add({
                    severity: "error",
                    summary: "Gagal mengunggah foto",
                    detail: errorMessage,
                    life: 5000,
                });
            }
        },

        convertFileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const base64 = reader.result;
                    resolve(base64);
                };
                reader.onerror = (error) => reject(error);
            });
        },
        async doChangeProfile() {
            this.form_profile.loading = true;

            if (!this.form_profile.name || !this.form_profile.phone) {
                this.$toast.add({
                    severity: "error",
                    summary: "Form tidak lengkap",
                    detail: "Nama dan nomor handphone wajib diisi",
                    life: 3000,
                });
                this.form_profile.loading = false;
                return;
            }

            try {
                const payload = {
                    name: this.form_profile.name,
                    phone: this.form_profile.phone,
                };

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/setting/profile`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${this.$auth.token()}`,
                        },
                    },
                );

                if (response.data.code === 200) {
                    this.$toast.add({
                        severity: "success",
                        summary:
                            response.data.message ||
                            "Profil berhasil diperbarui!",
                        life: 3000,
                    });

                    await this.fetchUserProfile();
                    this.show_dialog.profile = false;
                } else {
                    throw new Error(
                        response.data.message || "Update profile failed",
                    );
                }
            } catch (error) {
                console.error("Update error:", error);

                this.$toast.add({
                    severity: "error",
                    summary: "Gagal memperbarui profil",
                    detail: error.response?.data?.message || error.message,
                    life: 5000,
                });
            } finally {
                this.form_profile.loading = false;
            }
        },
        async doChangePassword() {
            if (this.error.password || this.error.password_confirmation) {
                this.$toast.add({
                    severity: "error",
                    summary: "Validasi gagal",
                    detail: "Harap perbaiki error pada form password",
                    life: 5000,
                });
                return;
            }

            if (
                this.form_password.password !==
                this.form_password.password_confirmation
            ) {
                this.$toast.add({
                    severity: "error",
                    summary: "Password tidak cocok",
                    detail: "Password baru dan konfirmasi password harus sama",
                    life: 5000,
                });
                return;
            }

            this.form_password.loading = true;

            try {
                const payload = {
                    current_password: this.form_password.old_password,
                    new_password: this.form_password.password,
                };

                console.log("Payload yang dikirim:", payload);

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/setting/change-password`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${this.$auth.token()}`,
                        },
                    },
                );

                if (response.data && response.data.code === 200) {
                    this.$toast.add({
                        severity: "success",
                        summary: "Password berhasil diubah!",
                        life: 3000,
                    });

                    this.form_password = {
                        old_password: "",
                        password: "",
                        password_confirmation: "",
                        loading: false,
                    };

                    this.show_dialog.profile = false;
                } else {
                    throw new Error(
                        response.data?.message || "Gagal mengubah password",
                    );
                }
            } catch (error) {
                console.error("Change password error:", error);

                let errorMessage = "Terjadi kesalahan saat mengubah password";
                if (error.response) {
                    if (error.response.status === 400) {
                        errorMessage = "Password lama salah";
                        this.error.old_password = true;
                        this.error.old_password_message =
                            "Password lama yang Anda masukkan salah";
                    } else if (
                        error.response.data &&
                        error.response.data.message
                    ) {
                        errorMessage = error.response.data.message;
                    }
                }

                this.$toast.add({
                    severity: "error",
                    summary: "Gagal mengubah password",
                    detail: errorMessage,
                    life: 5000,
                });
            } finally {
                this.form_password.loading = false;
            }
        },
    },
};
</script>

<template>
    <div class="layout-topbar no-print">
        <div class="layout-topbar-logo-container font-farro">
            <button
                class="layout-menu-button layout-topbar-action"
                @click="toggleMenu"
            >
                <Icon icon="mdi:menu" class="text-primary text-2xl"></Icon>
            </button>
            <router-link :to="currentPageLink" class="layout-topbar-logo">
                {{ currentPageTitle }}
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <div class="layout-topbar-action" @click="dialogProfile()">
                        <div
                            class="photo w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600"
                            :style="{
                                backgroundImage: `url(${userProfile?.photo_url || form_profile.photo_preview})`,
                            }"
                        >
                            <i
                                class="pi pi-user"
                                v-if="
                                    !userProfile?.photo_url &&
                                    !form_profile.photo_preview
                                "
                            ></i>
                        </div>
                    </div>

                    <h6
                        class="text-14 text-black opacity-60 my-0 flex items-center relative cursor-pointer"
                        @click="dialogProfile()"
                    >
                        <span class="font-farro"
                            >Hallo,&nbsp;</span
                        >
                        <span class="font-farro">
                            {{ userProfile?.name || user?.name }}
                        </span>
                    </h6>

                    <button type="button" @click="toggle">
                        <i class="pi pi-angle-down"></i>
                    </button>
                    <Menu
                        ref="menu"
                        id="overlay_menu"
                        :model="overlayMenuProfiles"
                        :popup="true"
                    />
                </div>
            </div>
        </div>
    </div>

    <Dialog
        v-model:visible="show_dialog.profile"
        header="Akun"
        :style="{ width: '500px' }"
    >
        <Tabs value="0">
            <TabList>
                <Tab value="0" class="text-left">
                    <h6 class="mb-0 text-sm">Edit Profil</h6>
                </Tab>
                <Tab value="1" class="text-left">
                    <h6 class="mb-0 text-sm">Edit Kata Sandi</h6>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div
                        class="card !p-5 !mb-6 mt-4 flex relative justify-between items-center"
                    >
                        <div
                            class="photo w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600"
                            :style="{
                                backgroundImage: `url(${form_profile.photo_preview})`,
                            }"
                        >
                            <i
                                class="pi pi-user"
                                v-if="!form_profile.photo_preview"
                            ></i>
                        </div>
                        <div class="font-farro text-sm">
                            Ganti Foto Profil
                            <i class="pi pi-chevron-right"></i>
                        </div>
                        <input
                            class="absolute w-full h-full opacity-0"
                            type="file"
                            @input="onInputFile"
                            accept=".jpeg, .jpg, .png, .svg, .webp"
                        />
                    </div>
                    <form @submit.prevent="doChangeProfile()">
                        <div class="form-group mb-4">
                            <label class="block font-farro mb-2"
                                >Nama Lengkap</label
                            >
                            <InputText
                                type="text"
                                placeholder="Nama Lengkap"
                                class="w-full h-12"
                                v-model="form_profile.name"
                                :disabled="form_profile.loading"
                                required
                            />
                        </div>
                        <div class="form-group mb-4">
                            <label class="block font-farro mb-2"
                                >Nomor Handphone</label
                            >
                            <InputText
                                type="text"
                                placeholder="+62 896 1234 1234"
                                class="w-full h-12"
                                v-model="form_profile.phone"
                                :disabled="form_profile.loading"
                                required
                            />
                        </div>
                        <div class="form-group mb-6">
                            <label class="block font-farro mb-2"
                                >Email</label
                            >
                            <InputText
                                type="email"
                                placeholder="example@mail.com"
                                class="w-full h-12"
                                v-model="form_profile.email"
                                :disabled="form_profile.loading"
                                readonly
                            />
                        </div>
                        <div class="flex justify-end gap-2">
                            <Button
                                type="button"
                                label="Batal"
                                severity="secondary"
                                @click="show_dialog.profile = false"
                            ></Button>
                            <button
                                type="button"
                                @click="doChangeProfile()"
                                class="rounded-lg btn-primary w-20 text-white hover:bg-primary-emphasis disabled:border-gray-200 disabled:bg-gray-200"
                                :disabled="form_profile.loading"
                            >
                                <i
                                    class="pi pi-spin pi-spinner text-[20px]"
                                    v-if="form_profile.loading"
                                ></i>
                                Simpan
                            </button>
                        </div>
                    </form>
                </TabPanel>
                <TabPanel value="1">
                    <form @submit.prevent="doChangePassword()" class="py-4">
                        <div class="form-group mb-0">
                            <label class="block font-farro mb-2"
                                >Kata Sandi Lama</label
                            >
                            <IconField>
                                <InputIcon class="pi pi-key" />
                                <InputText
                                    :type="
                                        password_visible.old_password
                                            ? 'text'
                                            : 'password'
                                    "
                                    placeholder="Masukkan kata sandi lama"
                                    class="w-full h-12"
                                    :invalid="error.old_password"
                                    v-model="form_password.old_password"
                                    required
                                />
                                <InputIcon
                                    :class="oldPasswordIcon"
                                    class="pi cursor-pointer"
                                    @click="
                                        password_visible.old_password =
                                            !password_visible.old_password
                                    "
                                />
                            </IconField>
                        </div>
                        <hr />
                        <div class="form-group mb-4">
                            <label class="block font-farro mb-2"
                                >Kata Sandi Baru</label
                            >
                            <IconField class="mb-1">
                                <InputIcon class="pi pi-key" />
                                <InputText
                                    :type="
                                        password_visible.password
                                            ? 'text'
                                            : 'password'
                                    "
                                    placeholder="Masukkan kata sandi baru"
                                    class="w-full h-12"
                                    v-model="form_password.password"
                                    :invalid="error.password"
                                    required
                                />
                                <InputIcon
                                    :class="PasswordIcon"
                                    class="pi cursor-pointer"
                                    @click="
                                        password_visible.password =
                                            !password_visible.password
                                    "
                                />
                            </IconField>
                            <small
                                class="opacity-60"
                                :class="{ 'text-red-500': error.password }"
                            >
                                Kata sandi Anda harus minimal 6 karakter dan
                                harus menyertakan kombinasi lowercase dan
                                uppercase, angka, huruf, dan karakter khusus
                                (!$@%%).
                            </small>
                        </div>
                        <div class="form-group mb-6">
                            <label class="block font-farro mb-2"
                                >Konfirmasi Kata Sandi Baru</label
                            >
                            <IconField>
                                <InputIcon class="pi pi-key" />
                                <InputText
                                    :type="
                                        password_visible.password_confirmation
                                            ? 'text'
                                            : 'password'
                                    "
                                    placeholder="Masukkan kata sandi baru, lagi"
                                    class="w-full h-12"
                                    v-model="
                                        form_password.password_confirmation
                                    "
                                    :invalid="error.password_confirmation"
                                    required
                                />
                                <InputIcon
                                    :class="PasswordConfirmationIcon"
                                    class="pi cursor-pointer"
                                    @click="
                                        password_visible.password_confirmation =
                                            !password_visible.password_confirmation
                                    "
                                />
                            </IconField>
                        </div>
                        <div class="flex justify-end gap-2">
                            <Button
                                type="button"
                                label="Batal"
                                severity="secondary"
                                @click="show_dialog.profile = false"
                            ></Button>
                            <button
                                type="button"
                                @click="doChangePassword()"
                                class="rounded-lg btn-primary w-20 text-white hover:bg-primary-emphasis disabled:border-gray-200 disabled:bg-gray-200 px-3"
                                :disabled="form_password.loading"
                            >
                                <i
                                    class="pi pi-spin pi-spinner text-[20px]"
                                    v-if="form_password.loading"
                                ></i>
                                Simpan
                            </button>
                        </div>
                    </form>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Dialog>
</template>

<style lang="scss" scoped>
.layout-menu-button:hover {
    background-color: white !important;
    border-radius: 0.375rem;
}

:deep(.p-dialog-content) {
    margin-top: -1.5rem;
}
:deep(.p-tab h6) {
    font-weight: 400;
    font-size: 14px;
}
:deep(.p-tab-active h6) {
    font-weight: 700;
}
.card {
    box-shadow: 0px 2px 10px 0px #0000001a;
}
.photo {
    background-repeat: no-repeat;
    background-size: cover;
}
input[type=file], /* FF, IE7+, chrome (except button) */
input[type=file]::-webkit-file-upload-button {
    /* chromes and blink button */
    cursor: pointer;
}
@media print {
    .no-print {
        display: none !important;
    }
}
</style>
