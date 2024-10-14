import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/Home.vue'),
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
