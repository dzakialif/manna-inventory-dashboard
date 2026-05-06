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
            notifications: [
                {
                    type: "warning",
                    title: "Stok menipis",
                    message: "Beberapa item perlu segera di-restock.",
                    time: "5 menit lalu",
                    read: false,
                },
                {
                    type: "success",
                    title: "Barang masuk baru",
                    message: "Transaksi barang masuk telah berhasil disimpan.",
                    time: "22 menit lalu",
                    read: false,
                },
                {
                    type: "info",
                    title: "Permintaan pembelian",
                    message: "Ada permintaan pembelian baru yang menunggu persetujuan.",
                    time: "1 jam lalu",
                    read: false,
                },
                {
                    type: "danger",
                    title: "Stok kritis",
                    message: "Beberapa barang sudah masuk batas minimum stok.",
                    time: "2 jam lalu",
                    read: false,
                },
                {
                    type: "info",
                    title: "Laporan harian siap",
                    message: "Ringkasan aktivitas gudang hari ini telah tersedia.",
                    time: "Kemarin",
                    read: true,
                },
                {
                    type: "info",
                    title: "Pembaruan harga",
                    message: "Ada perubahan harga pada beberapa item persediaan.",
                    time: "Kemarin",
                    read: true,
                },
                {
                    type: "success",
                    title: "Stock opname selesai",
                    message: "Proses stock opname hari ini sudah selesai.",
                    time: "2 hari lalu",
                    read: true,
                },
            ],
            show_dialog: {
                profile: false,
                notifications: false,
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
                transaksi: "Transaksi",
                create_transaksi: "Transaksi",
                edit_transaksi: "Transaksi",
                stock_opname: "Stok Opname",
                create_opname: "Stok Opname",
                edit_opname: "Stok Opname",
                abc_analysis: "Analisis ABC",
                abc_analysis_detail: "Analisis ABC",
                stock_analysis: "Analisis Persediaan",
            };

            return routeTitles[this.$route?.name] || "Dashboard";
        },
        currentPageLink() {
            return this.$route?.path || "/dashboard";
        },
        unreadNotificationCount() {
            return this.notifications.filter((notification) => !notification.read)
                .length;
        },
        notificationBadgeLabel() {
            return this.unreadNotificationCount > 99
                ? "99+"
                : String(this.unreadNotificationCount);
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

        this._notifClickOutside = this.handleNotificationClickOutside.bind(this);
        document.addEventListener("mousedown", this._notifClickOutside);
    },
    unmounted() {
        document.removeEventListener("mousedown", this._notifClickOutside);
    },
    methods: {
        openNotificationDialog() {
            this.show_dialog.notifications = !this.show_dialog.notifications;
        },
        closeNotificationPanel() {
            this.show_dialog.notifications = false;
        },
        handleNotificationClickOutside(event) {
            const panel = this.$refs.notificationPanel;
            const btn = this.$refs.notificationBtn;
            if (
                panel &&
                !panel.contains(event.target) &&
                btn &&
                !btn.contains(event.target)
            ) {
                this.show_dialog.notifications = false;
            }
        },
        markNotificationAsRead(notification) {
            if (notification.read) return;
            notification.read = true;
        },
        markAllNotificationsAsRead() {
            this.notifications = this.notifications.map((notification) => ({
                ...notification,
                read: true,
            }));

            this.$toast.add({
                severity: "success",
                summary: "Semua notifikasi dibaca",
                life: 2500,
            });
        },
        notificationIcon(type) {
            const map = {
                warning: "mdi:alert-circle",
                success: "mdi:check-circle",
                info: "mdi:information",
                danger: "mdi:alert",
            };
            return map[type] || "mdi:bell";
        },
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
                    <div class="relative flex items-center">
                        <button
                            ref="notificationBtn"
                            type="button"
                            class="layout-topbar-action relative flex items-center justify-center"
                            aria-label="Notifications"
                            @click="openNotificationDialog"
                        >
                            <Icon
                                icon="mdi:bell-outline"
                                class="text-2xl text-primary"
                            />
                            <div
                                v-if="unreadNotificationCount > 0"
                                class="absolute font-farro -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] leading-5 text-center font-semibold shadow-sm"
                            >
                                {{ notificationBadgeLabel }}
                            </div>
                        </button>

                        <!-- Notification Dropdown Panel -->
                        <Transition name="notif-drop">
                            <div
                                v-if="show_dialog.notifications"
                                ref="notificationPanel"
                                class="notif-panel font-farro"
                            >
                                <!-- Header -->
                                <div class="notif-panel-header">
                                    <div class="notif-panel-header-left">
                                        <Icon icon="mdi:bell-badge" class="text-xl text-primary" />
                                        <span class="font-semibold text-sm">Notifikasi</span>
                                        <span v-if="unreadNotificationCount > 0" class="notif-badge-pill">
                                            {{ unreadNotificationCount }}
                                        </span>
                                    </div>
                                    <button
                                        class="notif-close-btn"
                                        @click="closeNotificationPanel"
                                        aria-label="Tutup"
                                    >
                                        <Icon icon="mdi:close" class="text-base" />
                                    </button>
                                </div>

                                <!-- List -->
                                <div class="notif-panel-body">
                                    <button
                                        v-for="(notification, index) in notifications"
                                        :key="`${notification.title}-${index}`"
                                        type="button"
                                        class="notif-item"
                                        :class="{ 'notif-item--unread': !notification.read }"
                                        @click="markNotificationAsRead(notification)"
                                    >
                                        <span class="notif-icon-wrap" :class="`notif-icon--${notification.type}`">
                                            <Icon :icon="notificationIcon(notification.type)" class="text-base" />
                                        </span>
                                        <div class="notif-content">
                                            <div class="notif-top-row">
                                                <span class="notif-title">{{ notification.title }}</span>
                                                <span class="notif-time">{{ notification.time }}</span>
                                            </div>
                                            <p class="notif-message">{{ notification.message }}</p>
                                        </div>
                                        <span v-if="!notification.read" class="notif-dot"></span>
                                    </button>

                                    <div v-if="notifications.length === 0" class="notif-empty">
                                        <Icon icon="mdi:bell-off-outline" class="text-3xl opacity-40" />
                                        <span>Tidak ada notifikasi</span>
                                    </div>
                                </div>

                                <!-- Footer -->
                                <div class="notif-panel-footer">
                                    <button
                                        class="notif-mark-all-btn"
                                        :disabled="unreadNotificationCount === 0"
                                        @click="markAllNotificationsAsRead"
                                    >
                                        <Icon icon="mdi:check-all" class="text-base" />
                                        Tandai semua sudah dibaca
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    </div>
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

    <!-- Notification Dialog removed — now uses inline dropdown panel -->

<<<<<<< Updated upstream
            <div v-if="notifications.length === 0" class="py-6 text-center text-surface-500">
                Tidak ada notifikasi.
            </div>
        </div>

        <template #footer>
            <Button
                label="Tandai sudah dibaca semua"
                icon="pi pi-check"
                :disabled="unreadNotificationCount === 0"
                @click="markAllNotificationsAsRead"
                class="w-full !bg-primary hover:!bg-primary-dark mt-5"
            />
        </template>
    </Dialog>
=======
>>>>>>> Stashed changes
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
input[type=file],
input[type=file]::-webkit-file-upload-button {
    cursor: pointer;
}
@media print {
    .no-print {
        display: none !important;
    }
}

/* ── Notification dropdown panel ── */
.notif-panel {
    position: absolute;
    top: calc(100% + 10px);
    right: -10px;
    width: 380px;
    background: #fff;
    border: 1px solid #e8eaf0;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
    z-index: 9999;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &::before {
        content: '';
        position: absolute;
        top: -6px;
        right: 22px;
        width: 12px;
        height: 12px;
        background: #fff;
        border-left: 1px solid #e8eaf0;
        border-top: 1px solid #e8eaf0;
        transform: rotate(45deg);
        border-radius: 2px 0 0 0;
    }
}

.notif-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 12px;
    border-bottom: 1px solid #f0f1f5;
    background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);

    &-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }
}

.notif-badge-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
}

.notif-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;

    &:hover {
        background: #f3f4f6;
        color: #111;
    }
}

.notif-panel-body {
    flex: 1 1 auto;
    overflow-y: auto;
    max-height: 340px;
    padding: 10px 10px 6px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 99px;
    }
}

.notif-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
    text-align: left;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid transparent;
    background: transparent;
    cursor: default;
    transition: background 0.15s, border-color 0.15s;

    &--unread {
        background: #f5f7ff;
        border-color: #e0e5ff;
        cursor: pointer;

        &:hover {
            background: #eef1ff;
            border-color: #c7d0ff;
        }

        .notif-title {
            font-weight: 700;
        }
    }

    &:not(.notif-item--unread):hover {
        background: #f9fafb;
    }
}

.notif-icon-wrap {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    margin-top: 2px;
    font-size: 16px;
}

.notif-icon--warning {
    background: #fef3c7;
    color: #d97706;
}
.notif-icon--success {
    background: #d1fae5;
    color: #059669;
}
.notif-icon--info {
    background: #dbeafe;
    color: #2563eb;
}
.notif-icon--danger {
    background: #fee2e2;
    color: #dc2626;
}

.notif-content {
    flex: 1;
    min-width: 0;
}

.notif-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 3px;
}

.notif-title {
    font-size: 13px;
    font-weight: 500;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.notif-time {
    font-size: 11px;
    color: #9ca3af;
    white-space: nowrap;
    flex-shrink: 0;
}

.notif-message {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.notif-dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6366f1;
    margin-top: 6px;
}

.notif-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 32px 0;
    color: #9ca3af;
    font-size: 13px;
}

.notif-panel-footer {
    padding: 10px 12px 12px;
    border-top: 1px solid #f0f1f5;
}

.notif-mark-all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid #e0e7ff;
    background: #f5f7ff;
    color: #4f46e5;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;

    &:hover:not(:disabled) {
        background: #e0e7ff;
        border-color: #c7d2fe;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
}

/* Dropdown animation */
.notif-drop-enter-active,
.notif-drop-leave-active {
    transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.notif-drop-enter-from,
.notif-drop-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
}

</style>
