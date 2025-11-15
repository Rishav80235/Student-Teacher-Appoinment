import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminPanel from '../components/AdminPanel.vue'
import TeacherPanel from '../components/TeacherPanel.vue'
import StudentPanel from '../components/StudentPanel.vue'
import Login from '../components/Login.vue'
import AdminSetup from '../components/AdminSetup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: '/admin-setup',
      name: 'AdminSetup',
      component: AdminSetup,
      meta: { requiresAuth: false },
    },
    {
      path: '/admin',
      name: 'AdminPanel',
      component: AdminPanel,
      meta: { requiresAuth: true, roles: ['admin', 'sub-admin'] },
    },
    {
      path: '/teacher',
      name: 'TeacherPanel',
      component: TeacherPanel,
      meta: { requiresAuth: true, roles: ['admin', 'teacher'] },
    },
    {
      path: '/student',
      name: 'StudentPanel',
      component: StudentPanel,
      meta: { requiresAuth: true, roles: ['admin', 'student'] },
    },
  ],
})

// Route guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // If route requires auth
  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }

    // Check if user has required role
    if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
      // Redirect based on user role
      if (authStore.isAdmin) {
        next('/admin')
      } else if (authStore.isTeacher) {
        next('/teacher')
      } else if (authStore.isStudent) {
        next('/student')
      } else {
        next('/login')
      }
      return
    }
  }

  // If user is logged in and tries to access login page, redirect to their dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      next('/admin')
    } else if (authStore.isTeacher) {
      next('/teacher')
    } else if (authStore.isStudent) {
      next('/student')
    } else {
      next()
    }
    return
  }

  next()
})

export default router
