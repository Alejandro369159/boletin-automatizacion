import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import AdminSidebar from '@/layout/AdminSidebar.vue'
import SubscribersPage from '@/pages/SubscribersPage.vue'
import SubscriberDetailPage from '@/pages/SubscriberDetailPage.vue'
import CreateSuscriber from '@/pages/CreateSuscriber.vue'
import EmailsPage from '@/pages/EmailsPage.vue'
import CreateEmail from '@/pages/CreateEmail.vue'
import EmailDetailPage from '@/pages/EmailDetailPage.vue'

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
          component: SubscriberDetailPage,
        },
        {
          path: 'suscriptores/nuevo',
          name: 'create-subscriber',
          component: CreateSuscriber,
        },
        {
          path: 'correos',
          name: 'emails',
          component: EmailsPage,
        },
        {
          path: 'correos/nuevo',
          name: 'new-email',
          component: CreateEmail,
        },
        {
          path: 'correos/:id',
          name: 'email',
          component: EmailDetailPage,
        },
      ],
    },
  ],
})

export default router
