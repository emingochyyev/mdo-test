import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        meta: {
            requiresAuth: true,
        },
        component: () => import("../views/HomeView.vue"),
    },
    {
        path: "/login",
        name: "login",
        meta: {
            requiresAuth: true,
        },
        component: () => import("../views/LoginView.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("authToken");

    if (to.meta.requiresAuth && !token) {
        if (to.path !== "/login") {
            return next("/login");
        }
    }
    next();
});

export default router;
