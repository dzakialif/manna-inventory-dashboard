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
                    path: "/transaksi",
                    name: "transaksi",
                    component: () => import("@/pages/transaksi/Transaksi.vue")
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

export default router;