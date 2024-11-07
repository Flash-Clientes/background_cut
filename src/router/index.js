import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/Home.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('../views/analytics/Analytics.vue'),
    name: 'Analytics',
    children: [
      {
        path: '',
        component: () => import('../views/analytics/views/dashboard/Dashboard.vue'),
        name: 'Dashboard',
      },
      {
        path: '/uploader',
        component: () => import('../views/analytics/views/uploader/Uploader.vue'),
        name: 'Uploader',
      },
      {
        path: '/history',
        component: () => import('../views/analytics/views/history/History.vue'),
        name: 'History',
      },
    ]
  },
  {
    path: '/customizations',
    name: 'Customizations',
    component: () => import('../modules/customizations/list-customizations/ListCustomizations.vue'),
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('../views/errors/not-found/NotFound.vue'),
    name: 'NotFound',
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
