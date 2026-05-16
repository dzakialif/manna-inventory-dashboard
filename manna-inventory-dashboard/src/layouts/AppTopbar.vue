<script>
import { useLayout } from "@/layouts/composables/layout";
import { Icon } from '@iconify/vue';
import { api } from '@/utils/api';

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
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        this.$router.push('/login');
                    },
                },
            ],
            form_profile: {
                name: "",
                username: "",
                email: "",
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
            if (!newValue) {
                this.error.password = true;
            } else if (newValue.length < 8) {
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
        this.fetchUserProfile();

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
                const userJson = localStorage.getItem('user');
                let userId = '';
                if (userJson) {
                    const parsed = JSON.parse(userJson);
                    userId = parsed.userId || parsed.id || '';
                }

                if (!userId) return;

                const response = await api.get('/users/' + userId);

                if (response.data && response.data.data) {
                    this.userProfile = response.data.data;

                    this.form_profile = {
                        name: this.userProfile.name || "",
                        username: this.userProfile.username || "",
                        email: this.userProfile.email || "",
                    };
                }
            } catch (error) {
                this.$toast.add({
                    severity: "error",
                    summary: "Gagal memuat profil",
                    detail:
                        error.response?.data?.message || error.message || "Terjadi kesalahan",
                    life: 5000,
                });
            }
        },
        toggle(event) {
            this.$refs.menu.toggle(event);
        },
        dialogProfile() {
            this.show_dialog.profile = true;
        },
        async doChangeProfile() {
            this.form_profile.loading = true;

            if (!this.form_profile.name) {
                this.$toast.add({
                    severity: "error",
                    summary: "Form tidak lengkap",
                    detail: "Nama wajib diisi",
                    life: 3000,
                });
                this.form_profile.loading = false;
                return;
            }

            try {
                const userJson = localStorage.getItem('user');
                let userId = '';
                if (userJson) {
                    const parsed = JSON.parse(userJson);
                    userId = parsed.userId || parsed.id || '';
                }

                if (!userId) {
                    throw new Error("User ID tidak ditemukan");
                }

                const payload = {
                    name: this.form_profile.name,
                    username: this.form_profile.username,
                    email: this.form_profile.email,
                };

                const response = await api.put(
                    '/users/' + userId,
                    payload
                );

                if (response.status === 200) {
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

                let errorMessage = "Terjadi kesalahan saat memperbarui profil";
                let errorSummary = "Gagal Memperbarui Profil";

                if (error.response && error.response.data) {
                    if (error.response.data.errors && error.response.data.errors.length > 0) {
                        errorMessage = error.response.data.errors[0];
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }

                    if (errorMessage.toLowerCase().includes('already exists')) {
                        errorSummary = "Data Sudah Digunakan";
                        if (errorMessage.toLowerCase().includes('email')) {
                            errorMessage = "Email yang Anda masukkan sudah terdaftar oleh pengguna lain.";
                        } else if (errorMessage.toLowerCase().includes('username')) {
                            errorMessage = "Username yang Anda masukkan sudah digunakan.";
                        }
                    }
                } else if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                    errorSummary = "Koneksi Terputus";
                    errorMessage = "Tidak dapat terhubung ke server.";
                }

                this.$toast.add({
                    severity: "error",
                    summary: errorSummary,
                    detail: errorMessage,
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
                const userJson = localStorage.getItem('user');
                let userId = '';
                if (userJson) {
                    const parsed = JSON.parse(userJson);
                    userId = parsed.userId || parsed.id || '';
                }

                if (!userId) {
                    throw new Error("User ID tidak ditemukan");
                }

                const payload = {
                    currentPassword: this.form_password.old_password,
                    newPassword: this.form_password.password,
                    confirmPassword: this.form_password.password_confirmation,
                };

                console.log("Payload yang dikirim:", payload);

                const response = await api.post(
                    '/users/' + userId + '/reset-password',
                    payload
                );

                if (response.status === 200) {
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
                let errorSummary = "Gagal Mengubah Password";

                if (error.response && error.response.data) {
                    if (error.response.data.errors && error.response.data.errors.length > 0) {
                        errorMessage = error.response.data.errors[0];
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }

                    if (errorMessage.toLowerCase().includes('invalid current password') || error.response.status === 401) {
                        errorSummary = "Kata Sandi Lama Salah";
                        errorMessage = "Kata sandi lama yang Anda masukkan tidak sesuai.";
                        this.error.old_password = true;
                        this.error.old_password_message = errorMessage;
                    } else if (errorMessage.toLowerCase().includes('do not match')) {
                        errorSummary = "Validasi Gagal";
                        errorMessage = "Konfirmasi kata sandi baru tidak cocok.";
                    }
                } else if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                    errorSummary = "Koneksi Terputus";
                    errorMessage = "Tidak dapat terhubung ke server.";
                }

                this.$toast.add({
                    severity: "error",
                    summary: errorSummary,
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
                        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                            <i class="pi pi-user text-xl"></i>
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
        class="profile-dialog"
    >
        <!-- User Card Header -->
        <div class="profile-header">
            <div class="profile-header-avatar">
                <i class="pi pi-user text-2xl"></i>
            </div>
            <div class="profile-header-info">
                <h5 class="font-farro font-semibold text-base m-0 text-gray-800">
                    {{ userProfile?.name || user?.name }}
                </h5>
                <span class="font-farro text-sm text-gray-500">
                    {{ userProfile?.email || form_profile.email || '—' }}
                </span>
            </div>
        </div>

        <Tabs value="0">
            <TabList>
                <Tab value="0" class="text-left">
                    <h6 class="mb-0 text-sm font-farro"><i class="pi pi-user mr-1 text-xs"></i> Edit Profil</h6>
                </Tab>
                <Tab value="1" class="text-left">
                    <h6 class="mb-0 text-sm font-farro"><i class="pi pi-lock mr-1 text-xs"></i> Edit Kata Sandi</h6>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <form @submit.prevent="doChangeProfile()" class="mt-4 px-1">
                        <div class="form-group mb-4">
                            <label class="block font-farro mb-2 text-sm text-gray-600"
                                >Nama Lengkap</label
                            >
                            <IconField>
                                <InputIcon class="pi pi-user" />
                                <InputText
                                    type="text"
                                    placeholder="Nama Lengkap"
                                    class="w-full h-12 font-farro !border !border-gray-300 !rounded-lg focus:!border-primary focus:!ring-1 focus:!ring-primary"
                                    v-model="form_profile.name"
                                    :disabled="form_profile.loading"
                                    required
                                />
                            </IconField>
                        </div>
                        <div class="form-group mb-4">
                            <label class="block font-farro mb-2 text-sm text-gray-600"
                                >Username</label
                            >
                            <IconField>
                                <InputIcon class="pi pi-at" />
                                <InputText
                                    type="text"
                                    placeholder="Username"
                                    class="w-full h-12 font-farro !border !border-gray-300 !rounded-lg focus:!border-primary focus:!ring-1 focus:!ring-primary"
                                    v-model="form_profile.username"
                                    :disabled="form_profile.loading"
                                />
                            </IconField>
                        </div>
                        <div class="form-group mb-6">
                            <label class="block font-farro mb-2 text-sm text-gray-600"
                                >Email</label
                            >
                            <IconField>
                                <InputIcon class="pi pi-envelope" />
                                <InputText
                                    type="email"
                                    placeholder="example@mail.com"
                                    class="w-full h-12 font-farro !border !border-gray-300 !rounded-lg focus:!border-primary focus:!ring-1 focus:!ring-primary"
                                    v-model="form_profile.email"
                                    :disabled="form_profile.loading"
                                />
                            </IconField>
                        </div>
                        <div class="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                class="profile-btn-cancel font-farro"
                                @click="show_dialog.profile = false"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                @click="doChangeProfile()"
                                class="profile-btn-save font-farro"
                                :disabled="form_profile.loading"
                            >
                                <i
                                    class="pi pi-spin pi-spinner text-base"
                                    v-if="form_profile.loading"
                                ></i>
                                <i class="pi pi-check text-sm" v-else></i>
                                Simpan
                            </button>
                        </div>
                    </form>
                </TabPanel>
                <TabPanel value="1">
                    <form @submit.prevent="doChangePassword()" class="mt-4 px-1">
                        <div class="form-group mb-4">
                            <label class="block font-farro mb-2 text-sm text-gray-600"
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
                                    class="w-full h-12 font-farro !border !border-gray-300 !rounded-lg focus:!border-primary focus:!ring-1 focus:!ring-primary"
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
                        <div class="profile-divider"></div>
                        <div class="form-group mb-4">
                            <label class="block font-farro mb-2 text-sm text-gray-600"
                                >Kata Sandi Baru</label
                            >
                            <IconField class="mb-2">
                                <InputIcon class="pi pi-key" />
                                <InputText
                                    :type="
                                        password_visible.password
                                            ? 'text'
                                            : 'password'
                                    "
                                    placeholder="Masukkan kata sandi baru"
                                    class="w-full h-12 font-farro !border !border-gray-300 !rounded-lg focus:!border-primary focus:!ring-1 focus:!ring-primary"
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
                            <div class="flex items-center gap-1 text-xs mt-1 font-farro transition-colors duration-200" 
                                 :class="!form_password.password ? 'text-gray-500' : (error.password ? 'text-danger' : 'text-success')">
                                <i :class="!form_password.password ? 'pi pi-info-circle' : (error.password ? 'pi pi-times-circle' : 'pi pi-check-circle')" class="text-xs"></i>
                                <span>
                                    Input password baru minimal 8 karakter.
                                </span>
                            </div>
                        </div>
                        <div class="form-group mb-6">
                            <label class="block font-farro mb-2 text-sm text-gray-600"
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
                                    class="w-full h-12 font-farro !border !border-gray-300 !rounded-lg focus:!border-primary focus:!ring-1 focus:!ring-primary"
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
                            <div class="flex items-center gap-1 text-xs mt-1 font-farro transition-colors duration-200" 
                                 :class="!form_password.password_confirmation ? 'text-gray-500' : (error.password_confirmation ? 'text-danger' : 'text-success')">
                                <i :class="!form_password.password_confirmation ? 'pi pi-info-circle' : (error.password_confirmation ? 'pi pi-times-circle' : 'pi pi-check-circle')" class="text-xs"></i>
                                <span>
                                    {{ !form_password.password_confirmation ? 'Ketik ulang kata sandi baru Anda.' : (error.password_confirmation ? 'Kata sandi tidak cocok dengan kata sandi baru.' : 'Kata sandi cocok.') }}
                                </span>
                            </div>
                        </div>
                        <div class="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                class="profile-btn-cancel font-farro"
                                @click="show_dialog.profile = false"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                @click="doChangePassword()"
                                class="profile-btn-save font-farro"
                                :disabled="form_password.loading"
                            >
                                <i
                                    class="pi pi-spin pi-spinner text-base"
                                    v-if="form_password.loading"
                                ></i>
                                <i class="pi pi-check text-sm" v-else></i>
                                Simpan
                            </button>
                        </div>
                    </form>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Dialog>

    <!-- Notification Dialog removed — now uses inline dropdown panel -->


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

/* ── Profile Dialog ── */
.profile-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    margin: -8px -24px 16px;
    background: linear-gradient(135deg, rgba(11, 100, 52, 0.08) 0%, rgba(11, 100, 52, 0.03) 100%);
    border-bottom: 1px solid rgba(11, 100, 52, 0.12);
    border-radius: 0;
}

.profile-header-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #0B6434;
    color: #fff;
    box-shadow: 0 4px 14px rgba(11, 100, 52, 0.3);
    flex-shrink: 0;
}

.profile-header-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.profile-readonly-field {
    opacity: 0.65;
}

.profile-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #d1fae5 20%, #d1fae5 80%, transparent);
    margin: 4px 0 16px;
}

.password-hint {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 11px;
    line-height: 1.5;
    color: #9ca3af;
    padding: 6px 8px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #f3f4f6;

    &--error {
        color: #ef4444;
        background: #fef2f2;
        border-color: #fee2e2;
    }
}

.profile-btn-cancel {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #6b7280;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
        color: #374151;
    }
}

.profile-btn-save {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 24px;
    border-radius: 10px;
    border: none;
    background: #0B6434;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(11, 100, 52, 0.25);

    &:hover:not(:disabled) {
        background: #0E7A40;
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(11, 100, 52, 0.35);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
    }
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
        background: #ecfdf5;
        border-color: #d1fae5;
        cursor: pointer;

        &:hover {
            background: #d1fae5;
            border-color: #a7f3d0;
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
    background: #0B6434;
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
    border: 1px solid #d1fae5;
    background: #ecfdf5;
    color: #0B6434;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;

    &:hover:not(:disabled) {
        background: #d1fae5;
        border-color: #a7f3d0;
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
