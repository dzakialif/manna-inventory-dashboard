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
            path: "/",
            component: AppLayout,
            children: [
                {
                    path: "dashboard",
                    name: "dashboard",
                    component: () => import("@/pages/dashboard/Dashboard.vue")
                }
            ]
        }
    ]
})

export default router;