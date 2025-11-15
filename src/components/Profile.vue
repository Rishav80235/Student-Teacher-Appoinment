<template>
  <div class="profile-page">
    <div class="profile-header">
      <button class="back-button" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>
      <h2 class="page-title">My Profile</h2>
      <button 
        v-if="!isEditMode" 
        class="edit-profile-btn" 
        @click="enableEditMode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        Edit Profile
      </button>
    </div>

    <div class="profile-content">
      <!-- Profile Picture Section -->
      <div class="profile-picture-section">
        <div class="profile-avatar" @click="isEditMode && changePhoto()" :class="{ 'clickable': isEditMode }">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <div v-if="isEditMode" class="photo-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>Click to Change</span>
          </div>
        </div>
        <button v-if="isEditMode" class="change-photo-btn" @click="changePhoto">Change Photo</button>
        <h3 class="profile-name">{{ userData.name }}</h3>
        <p class="profile-role">{{ userRoleLabel }}</p>
      </div>

      <!-- Profile Information -->
      <div class="profile-sections">
        <!-- Personal Information -->
        <div class="profile-section">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Personal Information
          </h4>
          <div class="info-grid">
            <div class="info-item">
              <label>Full Name</label>
              <input type="text" v-model="userData.name" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Email</label>
              <input type="email" v-model="userData.email" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Phone</label>
              <input type="tel" v-model="userData.phone" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Date of Birth</label>
              <input type="date" v-model="userData.dateOfBirth" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Address</label>
              <textarea v-model="userData.address" class="editable-input" rows="2" :disabled="!isEditMode"></textarea>
            </div>
          </div>
        </div>

        <!-- Role-Specific Information -->
        <div class="profile-section" v-if="userType === 'teacher'">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Professional Information
          </h4>
          <div class="info-grid">
            <div class="info-item">
              <label>Department</label>
              <input type="text" v-model="userData.department" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Qualification</label>
              <input type="text" v-model="userData.qualification" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Experience (Years)</label>
              <input type="number" v-model="userData.experience" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Office Location</label>
              <input type="text" v-model="userData.officeLocation" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item full-width">
              <label>Bio</label>
              <textarea v-model="userData.bio" class="editable-input" rows="4" :disabled="!isEditMode"></textarea>
            </div>
          </div>
        </div>

        <div class="profile-section" v-if="userType === 'student'">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Academic Information
          </h4>
          <div class="info-grid">
            <div class="info-item">
              <label>Student ID</label>
              <input type="text" v-model="userData.studentId" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Department</label>
              <input type="text" v-model="userData.department" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Course</label>
              <input type="text" v-model="userData.course" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Year/Semester</label>
              <input type="text" v-model="userData.year" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Enrollment Date</label>
              <input type="date" v-model="userData.enrollmentDate" class="editable-input" :disabled="!isEditMode" />
            </div>
          </div>
        </div>

        <div class="profile-section" v-if="userType === 'admin'">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Administrative Information
          </h4>
          <div class="info-grid">
            <div class="info-item">
              <label>Admin ID</label>
              <input type="text" v-model="userData.adminId" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Position</label>
              <input type="text" v-model="userData.position" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Department</label>
              <input type="text" v-model="userData.department" class="editable-input" :disabled="!isEditMode" />
            </div>
            <div class="info-item">
              <label>Join Date</label>
              <input type="date" v-model="userData.joinDate" class="editable-input" :disabled="!isEditMode" />
            </div>
          </div>
        </div>

        <!-- Account Settings -->
        <div class="profile-section">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
            </svg>
            Account Settings
          </h4>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <label>Change Password</label>
                <p>Update your account password</p>
              </div>
              <button class="btn btn-secondary" @click="changePassword">Change</button>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <label>Two-Factor Authentication</label>
                <p>Add an extra layer of security</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="userData.twoFactorEnabled" />
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <label>Email Notifications</label>
                <p>Receive email updates</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="userData.emailNotifications" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Statistics (for teachers and students) -->
        <div class="profile-section" v-if="userType === 'teacher' || userType === 'student'">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="20" x2="12" y2="10"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
            Statistics
          </h4>
          <div class="stats-grid">
            <div class="stat-card" v-if="userType === 'teacher'">
              <div class="stat-value">{{ userData.stats?.totalAppointments || 0 }}</div>
              <div class="stat-label">Total Appointments</div>
            </div>
            <div class="stat-card" v-if="userType === 'teacher'">
              <div class="stat-value">{{ userData.stats?.totalStudents || 0 }}</div>
              <div class="stat-label">Students</div>
            </div>
            <div class="stat-card" v-if="userType === 'student'">
              <div class="stat-value">{{ userData.stats?.bookedAppointments || 0 }}</div>
              <div class="stat-label">Booked Appointments</div>
            </div>
            <div class="stat-card" v-if="userType === 'student'">
              <div class="stat-value">{{ userData.stats?.messagesSent || 0 }}</div>
              <div class="stat-label">Messages Sent</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="isEditMode" class="profile-actions">
        <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
        <button class="btn btn-primary" @click="saveProfile">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  userType: {
    type: String,
    required: true,
    validator: (value) => ['admin', 'teacher', 'student'].includes(value)
  }
})

const emit = defineEmits(['close'])

const isEditMode = ref(false)
const originalData = ref({})

// Sample user data - in real app, this would come from an API/store
const userData = ref({
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  // Teacher specific
  department: '',
  qualification: '',
  experience: '',
  officeLocation: '',
  bio: '',
  // Student specific
  studentId: '',
  course: '',
  year: '',
  enrollmentDate: '',
  // Admin specific
  adminId: '',
  position: '',
  joinDate: '',
  // Settings
  twoFactorEnabled: false,
  emailNotifications: true,
  // Stats
  stats: {}
})

const userRoleLabel = computed(() => {
  const labels = {
    admin: 'Administrator',
    teacher: 'Teacher',
    student: 'Student'
  }
  return labels[props.userType] || 'User'
})

// Initialize user data based on type
onMounted(() => {
  if (props.userType === 'admin') {
    userData.value = {
      name: 'Admin User',
      email: 'admin@unifiedmentor.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1985-01-15',
      address: '123 Admin Street, City, State 12345',
      adminId: 'ADM001',
      position: 'System Administrator',
      department: 'Administration',
      joinDate: '2020-01-01',
      twoFactorEnabled: true,
      emailNotifications: true,
      stats: {}
    }
  } else if (props.userType === 'teacher') {
    userData.value = {
      name: 'Dr. John Smith',
      email: 'john.smith@university.edu',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1980-05-20',
      address: '456 Teacher Avenue, City, State 12345',
      department: 'Computer Science',
      qualification: 'Ph.D. in Computer Science',
      experience: 10,
      officeLocation: 'Building A, Room 205',
      bio: 'Experienced professor with expertise in computer science and software engineering.',
      twoFactorEnabled: false,
      emailNotifications: true,
      stats: {
        totalAppointments: 45,
        totalStudents: 120
      }
    }
  } else if (props.userType === 'student') {
    userData.value = {
      name: 'Alice Johnson',
      email: 'alice.johnson@student.edu',
      phone: '+1 (555) 111-2222',
      dateOfBirth: '2002-08-10',
      address: '789 Student Road, City, State 12345',
      studentId: 'STU001',
      department: 'Computer Science',
      course: 'B.Sc. Computer Science',
      year: '3rd Year',
      enrollmentDate: '2021-09-01',
      twoFactorEnabled: false,
      emailNotifications: true,
      stats: {
        bookedAppointments: 8,
        messagesSent: 15
      }
    }
  }
})

const enableEditMode = () => {
  // Save original data before editing
  originalData.value = JSON.parse(JSON.stringify(userData.value))
  isEditMode.value = true
}

const changePhoto = () => {
  // Create a file input element
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // In a real app, you would upload the file to a server
      const reader = new FileReader()
      reader.onload = (e) => {
        // You could update the profile avatar here
        alert('Photo uploaded successfully! (In a real app, this would update the profile picture)')
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const changePassword = () => {
  const newPassword = prompt('Enter new password:')
  if (newPassword) {
    alert('Password changed successfully!')
  }
}

const saveProfile = () => {
  // In real app, this would save to API
  console.log('Saving profile:', userData.value)
  alert('Profile updated successfully!')
  isEditMode.value = false
  originalData.value = {}
}

const cancelEdit = () => {
  // Restore original data
  if (Object.keys(originalData.value).length > 0) {
    userData.value = JSON.parse(JSON.stringify(originalData.value))
  }
  isEditMode.value = false
  originalData.value = {}
}
</script>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #2c3e50;
  font-size: 0.95rem;
}

.back-button:hover {
  background: #e0e0e0;
}

.page-title {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.edit-profile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.edit-profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.edit-profile-btn svg {
  width: 18px;
  height: 18px;
}

.profile-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.profile-picture-section {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.profile-avatar.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-avatar.clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.profile-avatar.clickable:hover .photo-overlay {
  opacity: 1;
}

.photo-overlay svg {
  margin-bottom: 0.5rem;
}

.photo-overlay span {
  font-size: 0.85rem;
  font-weight: 500;
}

.change-photo-btn {
  display: block;
  margin: 0.5rem auto 1rem;
  padding: 0.5rem 1.5rem;
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.change-photo-btn:hover {
  background: #667eea;
  color: white;
}

.profile-name {
  margin: 0.5rem 0 0.25rem;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.profile-role {
  margin: 0;
  color: #667eea;
  font-size: 1rem;
  font-weight: 500;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.section-title svg {
  color: #667eea;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  margin-bottom: 0.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
}

.editable-input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
  background: white;
}

.editable-input:focus {
  outline: none;
  border-color: #667eea;
}

.editable-input:disabled {
  background: #f8f9fa;
  color: #2c3e50;
  cursor: default;
  border-color: #e0e0e0;
  opacity: 1;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.setting-info {
  flex: 1;
}

.setting-info label {
  display: block;
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.setting-info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.85rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
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
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .profile-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
