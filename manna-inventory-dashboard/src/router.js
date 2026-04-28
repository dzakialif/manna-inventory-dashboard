import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/login",
            name:"login",
            component: () => import("@/pages/Auth/Login.vue")
        },
        {
            component: AppLayout,
            meta: {},
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
                    path: "/barang-masuk",
                    name: "barang_masuk",
                    component: () => import("@/pages/barang-masuk/BarangMasuk.vue")
                },
                {
                    path: "/barang-keluar",
                    name: "barang_keluar",
                    component: () => import("@/pages/barang-keluar/BarangKeluar.vue")
                },
                // {
                //     path: "/kategori-barang",
                //     name: "kategori_barang",
                //     component: () => import("@/pages/kategori-barang/KategoriBarang.vue")
                // },
                {
                    path: "/stock-opname",
                    name: "stock_opname",
                    component: () => import("@/pages/stock-opname/StockOpname.vue")
                },
                {
                    path: "/abc-analysis",
                    name: "abc_analysis",
                    component: () => import("@/pages/abc-analysis/ABCAnalysis.vue")
                },
                {
                    path: "/stock-analysis",
                    name: "stock_analysis",
                    component: () => import("@/pages/stock-analysis/StockAnalysis.vue")
                },
            ]
        },
    ]
})

export default router;