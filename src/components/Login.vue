<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>Student-Teacher Appointment System</h1>
        <p>Welcome! Please login or register to continue</p>
      </div>

      <div class="login-tabs">
        <button
          class="tab-button"
          :class="{ active: currentTab === 'user' }"
          @click="switchTab('user')"
        >
          Student/Teacher
        </button>
        <button
          class="tab-button"
          :class="{ active: currentTab === 'admin' }"
          @click="switchTab('admin')"
        >
          Admin Login
        </button>
      </div>

      <div class="login-form-container">
        <!-- Admin Login Form -->
        <div v-if="currentTab === 'admin'">
          <div class="admin-notice">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <p>
              Admin & Sub-Admin access only. Only users with admin or sub-admin role can login here.
            </p>
          </div>
          <div v-if="!hasAdminAccount" class="setup-link">
            <p>
              Don't have an admin account?
              <a href="/admin-setup" @click.prevent="goToSetup">Create one here</a>
            </p>
          </div>
          <form @submit.prevent="handleAdminLogin" class="login-form">
            <div class="form-group">
              <label for="admin-email">Admin Email</label>
              <input
                type="email"
                id="admin-email"
                v-model="adminLoginData.email"
                required
                placeholder="Enter admin email"
              />
            </div>

            <div class="form-group">
              <label for="admin-password">Password</label>
              <div class="password-input-wrapper">
                <input
                  :type="showAdminPassword ? 'text' : 'password'"
                  id="admin-password"
                  v-model="adminLoginData.password"
                  required
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showAdminPassword = !showAdminPassword"
                >
                  <svg
                    v-if="showAdminPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    ></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="authStore.error" class="error-message">
              {{ authStore.error }}
            </div>

            <button type="submit" class="submit-button admin-button" :disabled="authStore.loading">
              {{ authStore.loading ? 'Logging in...' : 'Admin Login' }}
            </button>
          </form>
        </div>

        <!-- User Login/Registration -->
        <div v-else>
          <div class="user-tabs">
            <button
              class="user-tab-button"
              :class="{ active: isLogin }"
              @click="switchUserTab(true)"
            >
              Login
            </button>
            <button
              class="user-tab-button"
              :class="{ active: !isLogin }"
              @click="switchUserTab(false)"
            >
              Register
            </button>
          </div>

          <!-- User Login Form -->
          <form v-if="isLogin" @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input
                type="email"
                id="login-email"
                v-model="loginData.email"
                required
                placeholder="Enter your email"
              />
            </div>

            <div class="form-group">
              <label for="login-password">Password</label>
              <div class="password-input-wrapper">
                <input
                  :type="showLoginPassword ? 'text' : 'password'"
                  id="login-password"
                  v-model="loginData.password"
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showLoginPassword = !showLoginPassword"
                >
                  <svg
                    v-if="showLoginPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    ></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="authStore.error" class="error-message">
              {{ authStore.error }}
            </div>

            <button type="submit" class="submit-button" :disabled="authStore.loading">
              {{ authStore.loading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <!-- Registration Form -->
          <form v-else @submit.prevent="handleRegister" class="login-form">
            <div class="form-group">
              <label for="reg-name">Full Name</label>
              <input
                type="text"
                id="reg-name"
                v-model="registerData.name"
                required
                placeholder="Enter your full name"
              />
            </div>

            <div class="form-group">
              <label for="reg-email">Email</label>
              <input
                type="email"
                id="reg-email"
                v-model="registerData.email"
                required
                placeholder="Enter your email"
              />
            </div>

            <div class="form-group">
              <label for="reg-password">Password</label>
              <div class="password-input-wrapper">
                <input
                  :type="showRegPassword ? 'text' : 'password'"
                  id="reg-password"
                  v-model="registerData.password"
                  required
                  placeholder="Create a password"
                  minlength="6"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showRegPassword = !showRegPassword"
                >
                  <svg
                    v-if="showRegPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    ></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="reg-role">I am a</label>
              <select id="reg-role" v-model="registerData.role" required>
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div v-if="authStore.error" class="error-message">
              {{ authStore.error }}
            </div>

            <button type="submit" class="submit-button" :disabled="authStore.loading">
              {{ authStore.loading ? 'Registering...' : 'Register' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

// Component name for linting
defineOptions({
  name: 'LoginPage',
})

const router = useRouter()
const authStore = useAuthStore()

const currentTab = ref('user')
const isLogin = ref(true)

// Password visibility states
const showAdminPassword = ref(false)
const showLoginPassword = ref(false)
const showRegPassword = ref(false)

// Admin account existence check
const hasAdminAccount = ref(false)
let adminCheckUnsubscribe = null

// Clear errors when switching tabs
const switchTab = (tab) => {
  currentTab.value = tab
  authStore.error = null
}

const switchUserTab = (tab) => {
  isLogin.value = tab
  authStore.error = null
}

const goToSetup = () => {
  router.push('/admin-setup')
}

const loginData = ref({
  email: '',
  password: '',
})

const adminLoginData = ref({
  email: '',
  password: '',
})

const registerData = ref({
  name: '',
  email: '',
  password: '',
  role: '',
})

const handleLogin = async () => {
  const result = await authStore.login(loginData.value.email, loginData.value.password)
  if (result.success) {
    // Check if user is admin trying to login through regular login
    if (authStore.userRole === 'admin') {
      authStore.error = 'Please use Admin Login to access admin panel.'
      await authStore.logout()
      return
    }
    // Redirect based on role
    redirectBasedOnRole()
  }
}

const handleAdminLogin = async () => {
  const result = await authStore.login(adminLoginData.value.email, adminLoginData.value.password)
  if (result.success) {
    // Check if user is admin or sub-admin
    if (authStore.userRole !== 'admin' && authStore.userRole !== 'sub-admin') {
      authStore.error = 'Access denied. This account does not have admin privileges.'
      await authStore.logout()
      return
    }
    // Redirect to admin panel
    router.push('/admin')
  }
}

const handleRegister = async () => {
  const result = await authStore.register(
    registerData.value.email,
    registerData.value.password,
    registerData.value.name,
    registerData.value.role,
  )
  if (result.success) {
    // Show info message about first login
    alert(
      'Registration successful! You can login now. Note: Your first login will be allowed automatically, but subsequent logins require admin approval.',
    )
    // Redirect based on role
    redirectBasedOnRole()
  }
}

const redirectBasedOnRole = () => {
  const role = authStore.userRole
  if (role === 'admin') {
    router.push('/admin')
  } else if (role === 'teacher') {
    router.push('/teacher')
  } else if (role === 'student') {
    router.push('/student')
  }
}

// Check if admin account exists
const checkAdminExists = async () => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('role', '==', 'admin'))
    const querySnapshot = await getDocs(q)
    hasAdminAccount.value = !querySnapshot.empty
  } catch (error) {
    console.error('Error checking admin existence:', error)
    hasAdminAccount.value = false
  }
}

// Set up real-time listener for admin accounts
const setupAdminListener = () => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('role', '==', 'admin'))

    adminCheckUnsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        hasAdminAccount.value = !querySnapshot.empty
      },
      (error) => {
        console.error('Error in admin listener:', error)
        hasAdminAccount.value = false
      },
    )
  } catch (error) {
    console.error('Error setting up admin listener:', error)
    // Fallback to one-time check
    checkAdminExists()
  }
}

onMounted(() => {
  // If already logged in, redirect
  if (authStore.isAuthenticated) {
    redirectBasedOnRole()
  }

  // Check for admin account and set up listener
  checkAdminExists()
  setupAdminListener()

  // Check URL params for tab selection
  const urlParams = new URLSearchParams(window.location.search)
  const tab = urlParams.get('tab')
  if (tab === 'admin') {
    currentTab.value = 'admin'
  }
})

onUnmounted(() => {
  // Clean up listener
  if (adminCheckUnsubscribe) {
    adminCheckUnsubscribe()
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #2c3e50;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.login-header p {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.login-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
}

.tab-button {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #7f8c8d;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  top: 2px;
}

.tab-button:hover {
  color: #667eea;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.login-form-container {
  margin-top: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 3rem;
  width: 100%;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #667eea;
}

.password-toggle:focus {
  outline: none;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.submit-button {
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: #fee;
  color: #c33;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #fcc;
}

.admin-notice {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: #856404;
}

.admin-notice svg {
  color: #ffc107;
  flex-shrink: 0;
}

.admin-notice p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.user-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.user-tab-button {
  flex: 1;
  padding: 0.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  top: 2px;
}

.user-tab-button:hover {
  color: #667eea;
}

.user-tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.admin-button {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.admin-button:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

.setup-link {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.setup-link p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.setup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.setup-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-container {
    padding: 1.5rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
