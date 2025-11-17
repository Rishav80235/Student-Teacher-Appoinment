<template>
  <div class="student-panel">
    <!-- Header -->
    <header class="panel-header">
      <div class="header-left">
        <div class="logo">
          <h2>Student Panel</h2>
        </div>
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
            <button class="profile-button" @click="handleDeleteAccount">Delete My Account</button>
            <button class="profile-button" @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>
    </header>

    <div class="panel-content-wrapper">
      <!-- Main Content Area -->
      <main class="panel-main-content">
        <Profile v-if="showProfile" :user-type="'student'" @close="closeProfile" />
        <template v-else>
          <div class="search-section">
            <h2 class="page-title">Search Teacher</h2>

            <!-- Subject Categories Filter -->
            <div class="subject-categories">
              <h3 class="categories-title">Filter by Subject</h3>
              <div class="categories-container">
                <button
                  v-for="category in subjectCategories"
                  :key="category"
                  class="category-chip"
                  :class="{ active: selectedCategory === category }"
                  @click="filterByCategory(category)"
                >
                  {{ category }}
                </button>
                <button
                  class="category-chip clear-filter"
                  :class="{ active: selectedCategory === 'all' }"
                  @click="filterByCategory('all')"
                >
                  All Subjects
                </button>
              </div>
            </div>

            <!-- Search Input -->
            <div class="search-container">
              <input
                type="text"
                v-model="searchQuery"
                @input="searchTeachers"
                placeholder="Search teachers by name, department, or subject..."
                class="search-input"
              />
              <button class="search-button" @click="searchTeachers">Search</button>
            </div>
          </div>

          <div v-if="teachersList.length > 0" class="teachers-section">
            <h3 class="section-title">Available Teachers</h3>
            <div class="teachers-grid">
              <div v-for="teacher in teachersList" :key="teacher.id" class="teacher-card">
                <div class="teacher-avatar">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
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
                <div class="teacher-info">
                  <h4>{{ teacher.name }}</h4>
                  <p class="teacher-department">{{ teacher.department }}</p>
                  <div
                    v-if="teacher.subjects && teacher.subjects.length > 0"
                    class="teacher-subjects"
                  >
                    <span v-for="subject in teacher.subjects" :key="subject" class="subject-tag">
                      {{ subject }}
                    </span>
                  </div>
                  <p class="teacher-qualification">{{ teacher.qualification }}</p>
                  <p v-if="teacher.experience" class="teacher-experience">
                    {{ teacher.experience }} years of experience
                  </p>
                </div>
                <div class="teacher-actions">
                  <button class="btn btn-primary" @click="bookAppointment(teacher)">
                    Book Appointment
                  </button>
                  <button class="btn btn-secondary" @click="sendMessage(teacher)">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="loadingTeachers" class="loading-message">
            <p>Loading teachers...</p>
          </div>

          <div v-else-if="hasSearched" class="no-results">
            <p>No teachers found. Try a different search term or category.</p>
          </div>

          <div v-else class="welcome-message">
            <p>Use the filters or search above to find teachers</p>
            <p v-if="allTeachers.length === 0" class="no-teachers-note">
              No teachers available yet. Teachers will appear here once they are registered and
              approved.
            </p>
          </div>
        </template>
      </main>
    </div>

    <!-- Footer -->
    <footer class="panel-footer">
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

    <!-- Book Appointment Modal -->
    <div v-if="showBookModal" class="modal-overlay" @click="closeBookModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Book Appointment with {{ selectedTeacher?.name }}</h3>
          <button class="close-button" @click="closeBookModal">&times;</button>
        </div>
        <BookAppointment
          :teacher="selectedTeacher"
          @close="closeBookModal"
          @success="handleBookingSuccess"
        />
      </div>
    </div>

    <!-- Send Message Modal -->
    <div v-if="showMessageModal" class="modal-overlay" @click="closeMessageModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Send Message to {{ selectedTeacher?.name }}</h3>
          <button class="close-button" @click="closeMessageModal">&times;</button>
        </div>
        <SendMessage
          :teacher="selectedTeacher"
          @close="closeMessageModal"
          @success="handleMessageSuccess"
        />
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
import BookAppointment from './student/BookAppointment.vue'
import SendMessage from './student/SendMessage.vue'
import Profile from './Profile.vue'

const router = useRouter()
const authStore = useAuthStore()
const searchQuery = ref('')
const hasSearched = ref(false)
const showBookModal = ref(false)
const showMessageModal = ref(false)
const selectedTeacher = ref(null)
const showProfileMenu = ref(false)
const showProfile = ref(false)
const selectedCategory = ref('all')

// Subject categories
const subjectCategories = ref([
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
  'Economics',
  'Business',
  'Art',
  'Music',
  'Physical Education',
  'Languages',
])

// Teachers data from Firestore
const allTeachers = ref([])
let unsubscribeTeachers = null

const teachersList = ref([])
const loadingTeachers = ref(false)

// Fetch teachers from Firestore
const fetchTeachers = async () => {
  loadingTeachers.value = true
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('role', '==', 'teacher'))
    const querySnapshot = await getDocs(q)

    allTeachers.value = querySnapshot.docs
      .map((doc) => {
        const data = doc.data()
        // Only show approved teachers
        if (data.approved === true || data.addedByAdmin === true) {
          return {
            id: doc.id,
            name: data.name || 'N/A',
            email: data.email || '',
            department: data.department || 'Not specified',
            subjects: data.subjects || [],
            qualification: data.qualification || 'Not specified',
            experience: data.experience || 0,
            phone: data.phone || '',
            bio: data.bio || '',
          }
        }
        return null
      })
      .filter((teacher) => teacher !== null)
  } catch (error) {
    console.error('Error fetching teachers:', error)
  } finally {
    loadingTeachers.value = false
  }
}

// Set up real-time listener for teachers
const setupTeachersListener = () => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('role', '==', 'teacher'))

    unsubscribeTeachers = onSnapshot(
      q,
      (querySnapshot) => {
        allTeachers.value = querySnapshot.docs
          .map((doc) => {
            const data = doc.data()
            // Only show approved teachers
            if (data.approved === true || data.addedByAdmin === true) {
              return {
                id: doc.id,
                name: data.name || 'N/A',
                email: data.email || '',
                department: data.department || 'Not specified',
                subjects: data.subjects || [],
                qualification: data.qualification || 'Not specified',
                experience: data.experience || 0,
                phone: data.phone || '',
                bio: data.bio || '',
              }
            }
            return null
          })
          .filter((teacher) => teacher !== null)

        // Refresh search results when teachers list updates
        searchTeachers()
      },
      (error) => {
        console.error('Error in teachers listener:', error)
      },
    )
  } catch (error) {
    console.error('Error setting up teachers listener:', error)
    fetchTeachers()
  }
}

const filterByCategory = (category) => {
  selectedCategory.value = category
  searchTeachers()
}

const searchTeachers = () => {
  let filteredTeachers = [...allTeachers.value]

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filteredTeachers = filteredTeachers.filter((teacher) => {
      if (!teacher.subjects || teacher.subjects.length === 0) return false
      return (
        teacher.subjects.some((subject) =>
          subject.toLowerCase().includes(selectedCategory.value.toLowerCase()),
        ) || teacher.department.toLowerCase().includes(selectedCategory.value.toLowerCase())
      )
    })
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    hasSearched.value = true
    const query = searchQuery.value.toLowerCase()
    filteredTeachers = filteredTeachers.filter((teacher) => {
      const matchesName = teacher.name.toLowerCase().includes(query)
      const matchesDepartment = teacher.department.toLowerCase().includes(query)
      const matchesQualification = teacher.qualification.toLowerCase().includes(query)
      const matchesSubjects =
        teacher.subjects &&
        teacher.subjects.some((subject) => subject.toLowerCase().includes(query))
      return matchesName || matchesDepartment || matchesQualification || matchesSubjects
    })
  } else {
    hasSearched.value = selectedCategory.value !== 'all'
  }

  teachersList.value = filteredTeachers
}

const bookAppointment = (teacher) => {
  selectedTeacher.value = teacher
  showBookModal.value = true
}

const sendMessage = (teacher) => {
  selectedTeacher.value = teacher
  showMessageModal.value = true
}

const closeBookModal = () => {
  showBookModal.value = false
  selectedTeacher.value = null
}

const closeMessageModal = () => {
  showMessageModal.value = false
  selectedTeacher.value = null
}

const handleBookingSuccess = () => {
  closeBookModal()
  alert('Appointment booked successfully!')
}

const handleMessageSuccess = () => {
  closeMessageModal()
  alert('Message sent successfully!')
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

const handleDeleteAccount = async () => {
  if (
    !confirm(
      'This will permanently delete your account and all associated data. This action cannot be undone. Continue?',
    )
  ) {
    showProfileMenu.value = false
    return
  }

  const result = await authStore.deleteAccount()
  if (result.success) {
    alert('Your account has been deleted successfully.')
    router.push('/login')
  } else if (result.error) {
    alert(`Failed to delete account: ${result.error}`)
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
  // Fetch teachers and set up real-time listener
  fetchTeachers()
  setupTeachersListener()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // Clean up teachers listener
  if (unsubscribeTeachers) {
    unsubscribeTeachers()
  }
})
</script>

<style scoped>
.student-panel {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* Header Styles */
.panel-header {
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
.panel-content-wrapper {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 140px);
}

/* Main Content Styles */
.panel-main-content {
  flex: 1;
  padding: 2rem;
  background-color: #ffffff;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
}

.search-section {
  margin-bottom: 2rem;
}

.subject-categories {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.categories-title {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.categories-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.category-chip {
  padding: 0.5rem 1.25rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-chip:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.category-chip.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.category-chip.clear-filter {
  background: #e74c3c;
  border-color: #e74c3c;
  color: white;
}

.category-chip.clear-filter:hover {
  background: #c0392b;
  border-color: #c0392b;
}

.category-chip.clear-filter.active {
  background: #c0392b;
  border-color: #c0392b;
}

.search-container {
  display: flex;
  gap: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-button {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.teachers-section {
  margin-top: 2rem;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.teacher-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.teacher-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.teacher-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
}

.teacher-info {
  margin-bottom: 1.5rem;
}

.teacher-info h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.teacher-department {
  color: #667eea;
  margin: 0.25rem 0;
  font-weight: 500;
  font-size: 0.95rem;
}

.teacher-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.subject-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.teacher-qualification {
  color: #555;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.teacher-experience {
  color: #7f8c8d;
  margin: 0.25rem 0;
  font-size: 0.85rem;
}

.teacher-actions {
  display: flex;
  gap: 0.75rem;
  flex-direction: column;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  transform: translateY(-2px);
}

.no-results,
.welcome-message,
.loading-message {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.loading-message {
  color: #667eea;
  font-weight: 500;
}

.no-teachers-note {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #95a5a6;
  font-style: italic;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #7f8c8d;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #2c3e50;
}

/* Footer Styles */
.panel-footer {
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

@media (max-width: 768px) {
  .panel-header {
    padding: 1rem;
  }

  .search-container {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }

  .teachers-grid {
    grid-template-columns: 1fr;
  }

  .panel-main-content {
    margin: 0.5rem;
    padding: 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
