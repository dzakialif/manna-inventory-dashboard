<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Logo from '@/assets/images/logo-mannapanna.png'
import LogPict from '@/assets/images/login-picture.jpg'

const backgroundColor = ref('#1a1a2e')

const form = ref({
    email: '',
    password: '',
    captcha_value: '',
    loading: false
})

const showPassword = ref(false)
const captchaImg = ref('https://via.placeholder.com/176x60?text=Captcha')
const show_alert = ref({
    revoke: false
})
const temp_response = ref(null)

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const refreshCaptcha = () => {
    // Dummy refresh captcha
    console.log('Refresh captcha')
}

const doLogin = (event) => {
    form.value.loading = true
    
    // Simulasi login
    setTimeout(() => {
        console.log('Login attempt:', {
            email: form.value.email,
            password: form.value.password,
            captcha: form.value.captcha_value
        })
        form.value.loading = false
        
        // Simulasi sukses login
        alert('Login berhasil! (Dummy)')
    }, 1500)
}

const revokeLogin = (response) => {
    form.value.loading = true
    setTimeout(() => {
        console.log('Revoke login')
        form.value.loading = false
        show_alert.value.revoke = false
    }, 1000)
}
</script>
<template>
    <div class="login flex bg-slate-100">
        <div class="w-1/2 relative">
            <div class="h-screen p-4">
                <img :src="LogPict" alt="login-picture" class="h-full w-full object-cover shadow-2xl rounded-xl" />
            </div>
            <div class="absolute inset-x-0 top-4 bottom-4 right-4 left-4 rounded-xl bg-black bg-opacity-50"></div>
            <h1 class="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-2xl font-farro font-bold">PT MANNA PANNA INDONESIA</h1>
            <h2 class="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-lg font-farro">Memberi Rasa, <span class="text-warning">Membuka Peluang</span></h2>
        </div>
        <div class="w-1/2">
            <div
                class="flex justify-center items-center w-full h-screen"
            >
                <div class="w-full h-[70vh] max-w-md p-6 shadow-2xl rounded-xl border-2 border-primary">
                    <div class="flex flex-col items-center gap-2 mb-8">
                        <img :src="Logo" alt="logo" class="w-36" />
                        <h1 class="text-2xl font-farro font-bold text-black">
                            Manna Inventoy System
                        </h1>
                        <p class="text-black font-farro text-sm">
                            Enter your email and password to sign in to your account
                        </p>
                    </div>
                    <form @submit.prevent="doLogin" class="space-y-8">
                        <div class="font-farro">
                            <label
                                for="email"
                                class="block text-sm font-medium text-black mb-1"
                                >Email</label
                            >
                            <input
                                type="email"
                                id="email"
                                v-model="form.email"
                                required
                                placeholder="Input your email..."
                                class="w-full px-4 py-3 bg-slate-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:focus:ring-[#037d5b]"
                            />
                        </div>
                        <div class="font-farro">
                            <label
                                for="password"
                                class="block text-sm font-medium text-black mb-1"
                                >Password</label
                            >
                            <div class="relative">
                                <input
                                    :type="showPassword ? 'text' : 'password'"
                                    id="password"
                                    v-model="form.password"
                                    required
                                    placeholder="Input your password"
                                    class="w-full px-4 py-3 bg-slate-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:focus:ring-[#037d5b]"
                                />
                                <i
                                    :class="
                                        showPassword
                                            ? 'pi pi-eye-slash'
                                            : 'pi pi-eye'
                                    "
                                    @click="togglePasswordVisibility"
                                    class="absolute right-0 top-4 translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition duration-300"
                                ></i>
                            </div>
                            <div class="text-right mt-2">
                                <a href="#" class="text-sm text-primary hover:text-primary-light font-medium">
                                    Forgot Password?
                                </a>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                :disabled="form.loading"
                                class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-y-110 hover:scale-x-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i
                                    class="pi pi-spin pi-spinner text-[20px]"
                                    v-if="form.loading"
                                ></i>
                                <span v-else>Sign-in</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <Dialog
        v-model:visible="show_alert.revoke"
        header="Delete"
        :style="{ width: '25rem' }"
    >
        <span class="text-surface-500 dark:text-surface-400 block mb-8">
            User still login in another session, do you want to release this
            respected session?
        </span>
        <div class="flex justify-end gap-2">
            <button
                type="button"
                label="Cancel"
                severity="secondary"
                class="font-bold items-center rounded-lg border-2 border-gray-400 bg-white text-md text-gray-600 hover:bg-gray-300 hover:scale-105 transform transition duration-300 py-3 px-5"
                @click="show_alert.revoke = false"
            >
                Batal
            </button>
            <button
                type="button"
                @click="revokeLogin(temp_response)"
                class="font-bold items-center rounded-lg bg-gradient-to-r from-[#1ad0e5] to-[#78e8a6] hover:bg-none hover:bg-black hover:text-white hover:scale-105 transform transition duration-300 text-md text-black py-3 px-5 group"
                :disabled="form.loading"
            >
                <i
                    class="pi pi-spin pi-spinner text-[20px]"
                    v-if="form.loading"
                ></i>
                Yes
            </button>
        </div>
    </Dialog>
</template>

<style lang="scss" scoped>
.login {
    min-height: 100vh;
}
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}
.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

/* Keep browser autofill from overriding Tailwind input background on submit/Enter. */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 1000px #f1f5f9 inset !important;
        box-shadow: 0 0 0 1000px #f1f5f9 inset !important;
        -webkit-text-fill-color: #111827;
        transition: background-color 5000s ease-in-out 0s;
    }

    input[type='email'],
    input[type='password'],
    input[type='email']:focus,
    input[type='password']:focus {
        background-color: #f1f5f9;
    }

.box-wrapper {
    .box {
        width: 460px;
        height: calc(100vh - 132px);
        border-top-left-radius: 24px;
        border-top-right-radius: 24px;
        padding: 60px 40px;
        position: absolute;
        bottom: 0;
    }
    @media (max-width: 991px) {
        .box {
            position: relative;
            top: 0;
            height: auto;
            border-bottom-left-radius: 24px;
            border-bottom-right-radius: 24px;
        }
    }
    @media (max-width: 576px) {
        .box {
            width: 100%;
        }
    }
    @media (max-width: 400px) {
        padding: 0 15px;
        .box {
            padding: 30px 20px;
        }
    }
    @media (max-height: 778px) {
        .box {
            height: calc(100vh - 70px);
        }
    }
    @media (max-height: 680px) {
        .box {
            height: calc(100vh - 30px);
        }
    }
}
</style>
