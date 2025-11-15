<template>
  <div class="admin-panel">
    <!-- Header -->
    <header class="admin-header">
      <div class="header-left">
        <div class="logo">
          <h2>Admin Panel</h2>
        </div>
      </div>
      <div class="header-center">
        <nav class="header-nav">
          <button
            class="nav-button"
            :class="{ active: route.path === '/admin' }"
            @click="navigateTo('/admin')"
          >
            Admin
          </button>
          <button
            class="nav-button"
            :class="{ active: route.path === '/teacher' }"
            @click="navigateTo('/teacher')"
          >
            Teacher
          </button>
          <button
            class="nav-button"
            :class="{ active: route.path === '/student' }"
            @click="navigateTo('/student')"
          >
            Student
          </button>
        </nav>
      </div>
      <div class="header-right">
        <div class="profile-container" @click="toggleProfileMenu">
          <div class="profile-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div v-if="showProfileMenu" class="profile-menu">
            <button class="profile-button" @click="handleProfile">Profile</button>
            <button class="profile-button" @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>
    </header>

    <div class="admin-content-wrapper">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <nav class="sidebar-nav">
          <button
            class="sidebar-button"
            :class="{ active: activeSection === 'add-teacher' }"
            @click="setActiveSection('add-teacher')"
          >
            Add Teacher
          </button>
          <button
            class="sidebar-button"
            :class="{ active: activeSection === 'update-delete-teacher' }"
            @click="setActiveSection('update-delete-teacher')"
          >
            Update/Delete Teacher
          </button>
          <button
            class="sidebar-button"
            :class="{ active: activeSection === 'approve-student' }"
            @click="setActiveSection('approve-student')"
          >
            Approve Registration Student
          </button>
          <button
            class="sidebar-button"
            :class="{ active: activeSection === 'add-sub-admin' }"
            @click="setActiveSection('add-sub-admin')"
          >
            Add Sub-Admin
          </button>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="admin-main-content">
        <Profile v-if="showProfile" :user-type="'admin'" @close="closeProfile" />
        <component v-else :is="currentComponent" />
      </main>
    </div>

    <!-- Footer -->
    <footer class="admin-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>About</h4>
          <p>Student-Teacher Appointment Management System</p>
          <p>Version 1.0.0</p>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>Email: admin@unifiedmentor.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Unified Mentor. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AddTeacher from './AddTeacher.vue'
import UpdateDeleteTeacher from './UpdateDeleteTeacher.vue'
import ApproveRegistrationStudent from './ApproveRegistrationStudent.vue'
import AddSubAdmin from './AddSubAdmin.vue'
import Profile from './Profile.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const activeSection = ref('add-teacher')
const showProfileMenu = ref(false)
const showProfile = ref(false)

const navigateTo = (path) => {
  router.push(path)
}

const components = {
  'add-teacher': AddTeacher,
  'update-delete-teacher': UpdateDeleteTeacher,
  'approve-student': ApproveRegistrationStudent,
  'add-sub-admin': AddSubAdmin,
}

const currentComponent = computed(() => {
  return components[activeSection.value] || AddTeacher
})

const setActiveSection = (section) => {
  activeSection.value = section
  showProfileMenu.value = false
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleProfile = () => {
  showProfile.value = true
  showProfileMenu.value = false
}

const closeProfile = () => {
  showProfile.value = false
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await authStore.logout()
    router.push('/login')
  }
  showProfileMenu.value = false
}

// Close profile menu when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.profile-container')) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.admin-panel {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* Header Styles */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left .logo h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-nav {
  display: flex;
  gap: 0.5rem;
}

.nav-button {
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.nav-button.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.header-right {
  position: relative;
}

.profile-container {
  position: relative;
  cursor: pointer;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.profile-icon:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.profile-icon svg {
  color: white;
}

.profile-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  overflow: hidden;
  z-index: 1000;
}

.profile-button {
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: white;
  color: #333;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.95rem;
}

.profile-button:hover {
  background-color: #f0f0f0;
}

.profile-button:last-child {
  border-top: 1px solid #e0e0e0;
  color: #e74c3c;
}

.profile-button:last-child:hover {
  background-color: #fee;
  color: #c0392b;
}

/* Content Wrapper */
.admin-content-wrapper {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 140px);
}

/* Sidebar Styles */
.admin-sidebar {
  width: 250px;
  background-color: #2c3e50;
  padding: 2rem 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.sidebar-button {
  padding: 1rem 1.5rem;
  background-color: transparent;
  border: none;
  color: #ecf0f1;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.sidebar-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.sidebar-button.active {
  background-color: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.sidebar-button.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background-color: white;
  border-radius: 0 4px 4px 0;
}

/* Main Content Styles */
.admin-main-content {
  flex: 1;
  padding: 2rem;
  background-color: #ffffff;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
}

/* Footer Styles */
.admin-footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ecf0f1;
  padding: 2rem 2rem 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.footer-section h4 {
  margin: 0 0 1rem 0;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
}

.footer-section p {
  margin: 0.5rem 0;
  color: #bdc3c7;
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin: 0.5rem 0;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.footer-section ul li a:hover {
  color: #667eea;
}

.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.social-links a:hover {
  color: #667eea;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: #95a5a6;
  font-size: 0.85rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-header {
    padding: 1rem;
  }

  .admin-content-wrapper {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    padding: 1rem 0;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 1rem;
  }

  .sidebar-button {
    white-space: nowrap;
    min-width: 150px;
  }

  .admin-main-content {
    margin: 0.5rem;
    padding: 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
