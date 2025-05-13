import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: '/',
        name: "Homepage",
        component: () => import('../views/Homepage.vue'),

    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

export { routes };
export default router;