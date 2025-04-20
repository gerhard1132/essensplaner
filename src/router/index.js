import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: '/',
        name: "Homepage",
        component: () => import('../views/Homepage.vue'),

    },
    {
        path: '/Projects',
        name: "Projects",
        component: () => import('../views/Projects.vue'),
    },
    {
        path: '/Games',
        name: "Games",
        component: () => import('../views/Games.vue'),
    },
    {
        path: '/More',
        name: "More",
        component: () => import('../views/More.vue'),
    },
    {
        path: '/More/Schachuhr',
        name: "Schachuhr",
        component: () => import('../components/More/Schachuhr.vue')
    },
    {
        path: '/More/Essensplan',
        name: "Essensplan",
        component: () => import('../components/More/Essensplan.vue')
    },
    {
        path: '/Games/SuperTicTacToe',
        name: "SuperTicTacToe",
        component: () => import('../components/Games/SuperTTT.vue')
    },
    {
        path: '/Games/Tanker',
        name: "Tanker",
        component: () => import('../components/Games/Tanker.vue')
    },
    {
        path: '/Games/Tron',
        name: "Tron",
        component: () => import('../components/Games/Tron.vue')
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