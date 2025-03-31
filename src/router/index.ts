import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import AdminSidebar from '@/layout/AdminSidebar.vue'
import SubscribersPage from '@/pages/SubscribersPage.vue'
import EmailsPage from '@/pages/EmailsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    // Layout wrapper
    {
      path: '',
      component: AdminSidebar,
      children: [
        {
          path: 'suscriptores',
          name: 'subscribers',
          component: SubscribersPage,
        },
        {
          path: 'suscriptores/:id',
          name: 'subscriber',
          component: SubscribersPage,
        },
        {
          path: 'correos',
          name: 'emails',
          component: EmailsPage,
        },
        {
          path: 'correos/:id',
          name: 'email',
          component: EmailsPage,
        },
      ],
    },
  ],
})

export default router
