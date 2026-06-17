import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/login",
            name:"login",
            meta: { auth: false},
            component: () => import("@/pages/Auth/Login.vue")
        },
        {
            component: AppLayout,
            meta: { auth: true},
            children: [
                {
                    path: "/dashboard",
                    name: "dashboard",
                    component: () => import("@/pages/dashboard/Dashboard.vue")
                },
                {
                    path: "/barang",
                    name: "barang",
                    component: () => import("@/pages/barang/Barang.vue")
                },
                {
                    path: "/barang/create",
                    name: "create_barang",
                    component: () => import("@/pages/barang/Form.vue")
                },
                {
                    path: "/barang/edit/:id",
                    name: "edit_barang",
                    component: () => import("@/pages/barang/Form.vue")
                },
                {
                    path: "/transaksi",
                    name: "transaksi",
                    component: () => import("@/pages/transaksi/Transaksi.vue")
                },
                {
                    path: "/transaksi/create",
                    name: "create_transaksi",
                    component: () => import("@/pages/transaksi/Form.vue")
                },
                {
                    path: "/transaksi/edit/:id",
                    name: "edit_transaksi",
                    component: () => import("@/pages/transaksi/Form.vue")
                },
                {
                    path: "/transaksi/detail/:id",
                    name: "detail_transaksi",
                    component: () => import("@/pages/transaksi/Detail.vue")
                },
                {
                    path: "/barang-keluar",
                    name: "barang_keluar",
                    component: () => import("@/pages/barang-keluar/BarangKeluar.vue")
                },
                {
                    path: "/kategori",
                    name: "kategori",
                    component: () => import("@/pages/kategori/Kategori.vue")
                },
                {
                    path: "/stock-opname",
                    name: "stock_opname",
                    component: () => import("@/pages/stock-opname/StockOpname.vue")
                },
                {
                    path: "/stock-opname/create",
                    name: "create_opname",
                    component: () => import("@/pages/stock-opname/Form.vue")
                },
                {
                    path: "/stock-opname/edit/:id",
                    name: "edit_opname",
                    component: () => import("@/pages/stock-opname/Form.vue")
                },
                {
                    path: "/abc-analysis",
                    name: "abc_analysis",
                    component: () => import("@/pages/abc-analysis/ABCAnalysis.vue")
                },
                {
                    path: "/abc-analysis/detail/:id",
                    name: "abc_analysis_detail",
                    component: () => import("@/pages/abc-analysis/Details.vue")
                },
                {
                    path: "/stock-analysis",
                    name: "stock_analysis",
                    component: () => import("@/pages/stock-analysis/StockAnalysis.vue")
                },
                {
                    path: "/stock-analysis/detail/:id",
                    name: "stock_analysis_detail",
                    component: () => import("@/pages/stock-analysis/Details.vue")
                },
            ]
        },
    ]
})

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('token');
    
    // Mengecek apakah route butuh autentikasi
    // Kita gunakan to.matched.some agar child route juga mewarisi meta auth dari parent-nya
    const authRequired = to.matched.some(record => record.meta.auth === true);

    if (authRequired && !loggedIn) {
        // Jika butuh login tapi belum login, lempar ke halaman login
        return next('/login');
    }

    if (to.path === '/login' && loggedIn) {
        // Jika sudah login tapi mencoba ke halaman login, kembalikan ke dashboard
        return next('/dashboard');
    }

    if (to.path === '/') {
        // Redirect root ke dashboard
        return next('/dashboard');
    }

    // Lanjutkan navigasi
    next();
});

export default router;