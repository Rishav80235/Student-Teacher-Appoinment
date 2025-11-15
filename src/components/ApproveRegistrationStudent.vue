<template>
  <div class="approve-registration-student">
    <h2 class="page-title">Approve Registration (Teachers & Students)</h2>

    <div class="filter-section">
      <div class="filter-tabs">
        <button
          class="filter-tab"
          :class="{ active: filterStatus === 'pending' }"
          @click="filterStatus = 'pending'"
        >
          Pending ({{ pendingCount }})
        </button>
        <button
          class="filter-tab"
          :class="{ active: filterStatus === 'approved' }"
          @click="filterStatus = 'approved'"
        >
          Approved ({{ approvedCount }})
        </button>
        <button
          class="filter-tab"
          :class="{ active: filterStatus === 'rejected' }"
          @click="filterStatus = 'rejected'"
        >
          Rejected ({{ rejectedCount }})
        </button>
      </div>
    </div>

    <div class="students-list">
      <div v-if="filteredStudents.length === 0" class="no-results">
        <p>No {{ filterStatus }} registrations found.</p>
      </div>

      <div
        v-for="student in filteredStudents"
        :key="student.id"
        class="student-card"
        :class="student.status"
      >
        <div class="student-header">
          <div class="student-avatar">
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
          <div class="student-info">
            <h3>{{ student.name }}</h3>
            <p class="student-email">{{ student.email }}</p>
            <div class="role-badge" :class="student.role">
              {{ student.role === 'teacher' ? 'Teacher' : 'Student' }}
            </div>
            <span class="status-badge" :class="student.status">
              {{ student.status.charAt(0).toUpperCase() + student.status.slice(1) }}
            </span>
          </div>
        </div>

        <div class="student-details">
          <div class="detail-row">
            <span class="detail-label">Role:</span>
            <span class="detail-value">{{
              student.role === 'teacher' ? 'Teacher' : 'Student'
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Registration Date:</span>
            <span class="detail-value">{{ formatDate(student.createdAt) }}</span>
          </div>
          <div v-if="student.lastLoginAt" class="detail-row">
            <span class="detail-label">First Login Used:</span>
            <span class="detail-value">{{ student.firstLoginUsed ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="student.lastLoginAt" class="detail-row">
            <span class="detail-label">Last Login:</span>
            <span class="detail-value">{{ formatDate(student.lastLoginAt) }}</span>
          </div>
        </div>

        <div v-if="student.status === 'pending'" class="student-actions">
          <button class="btn btn-approve" @click="approveStudent(student.id)">Approve</button>
          <button class="btn btn-reject" @click="rejectStudent(student.id)">Reject</button>
        </div>

        <div v-else class="student-actions">
          <button class="btn btn-secondary" @click="viewDetails(student)">View Details</button>
          <button
            v-if="student.status === 'rejected'"
            class="btn btn-approve"
            @click="approveStudent(student.id)"
          >
            Approve Now
          </button>
        </div>
      </div>
    </div>

    <div v-if="showSuccess" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

const filterStatus = ref('pending')
const showSuccess = ref(false)
const successMessage = ref('')
const loading = ref(false)

// Users data from Firestore
const users = ref([])
let unsubscribeUsers = null

// Fetch users from Firestore
const fetchUsers = async () => {
  loading.value = true
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('role', 'in', ['teacher', 'student']))
    const querySnapshot = await getDocs(q)

    users.value = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || 'N/A',
        email: data.email || '',
        role: data.role || 'student',
        createdAt: data.createdAt || new Date().toISOString(),
        approved: data.approved || false,
        firstLoginUsed: data.firstLoginUsed || false,
        lastLoginAt: data.lastLoginAt || null,
        status: data.approved ? 'approved' : data.rejected ? 'rejected' : 'pending',
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

// Set up real-time listener
const setupListener = () => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('role', 'in', ['teacher', 'student']))

    unsubscribeUsers = onSnapshot(
      q,
      (querySnapshot) => {
        users.value = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || 'N/A',
            email: data.email || '',
            role: data.role || 'student',
            createdAt: data.createdAt || new Date().toISOString(),
            approved: data.approved || false,
            firstLoginUsed: data.firstLoginUsed || false,
            lastLoginAt: data.lastLoginAt || null,
            rejected: data.rejected || false,
            status: data.approved ? 'approved' : data.rejected ? 'rejected' : 'pending',
          }
        })
      },
      (error) => {
        console.error('Error in users listener:', error)
      },
    )
  } catch (error) {
    console.error('Error setting up listener:', error)
    fetchUsers()
  }
}

const filteredStudents = computed(() => {
  return users.value.filter((user) => user.status === filterStatus.value)
})

const pendingCount = computed(() => {
  return users.value.filter((u) => u.status === 'pending').length
})

const approvedCount = computed(() => {
  return users.value.filter((u) => u.status === 'approved').length
})

const rejectedCount = computed(() => {
  return users.value.filter((u) => u.status === 'rejected').length
})

const approveStudent = async (id) => {
  try {
    await updateDoc(doc(db, 'users', id), {
      approved: true,
      rejected: false,
      approvedAt: new Date().toISOString(),
    })

    const user = users.value.find((u) => u.id === id)
    showSuccess.value = true
    successMessage.value = `${user.role === 'teacher' ? 'Teacher' : 'Student'} ${user.name} has been approved!`
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Error approving user:', error)
    alert('Error approving user. Please try again.')
  }
}

const rejectStudent = async (id) => {
  const user = users.value.find((u) => u.id === id)
  if (
    confirm(
      `Are you sure you want to reject ${user.role === 'teacher' ? 'teacher' : 'student'} ${user.name}'s registration?`,
    )
  ) {
    try {
      await updateDoc(doc(db, 'users', id), {
        approved: false,
        rejected: true,
        rejectedAt: new Date().toISOString(),
      })

      showSuccess.value = true
      successMessage.value = `${user.role === 'teacher' ? 'Teacher' : 'Student'} ${user.name} registration has been rejected.`
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    } catch (error) {
      console.error('Error rejecting user:', error)
      alert('Error rejecting user. Please try again.')
    }
  }
}

const viewDetails = (user) => {
  alert(
    `${user.role === 'teacher' ? 'Teacher' : 'Student'} Details:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nRegistration Date: ${formatDate(user.createdAt)}\nFirst Login Used: ${user.firstLoginUsed ? 'Yes' : 'No'}\nStatus: ${user.status}`,
  )
}

onMounted(() => {
  fetchUsers()
  setupListener()
})

// Clean up listener on unmount
onUnmounted(() => {
  if (unsubscribeUsers) {
    unsubscribeUsers()
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.approve-registration-student {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.filter-tab {
  padding: 0.75rem 1.5rem;
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

.filter-tab:hover {
  color: #667eea;
}

.filter-tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.students-list {
  display: grid;
  gap: 1.5rem;
}

.student-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #95a5a6;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.student-card.pending {
  border-left-color: #f39c12;
}

.student-card.approved {
  border-left-color: #27ae60;
}

.student-card.rejected {
  border-left-color: #e74c3c;
}

.student-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.student-info {
  flex: 1;
}

.student-info h3 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.student-email {
  color: #667eea;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
}

.role-badge.teacher {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge.student {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.student-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #7f8c8d;
  font-weight: 500;
  font-size: 0.9rem;
}

.detail-value {
  color: #2c3e50;
  font-size: 0.9rem;
}

.student-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-approve {
  background-color: #27ae60;
  color: white;
}

.btn-approve:hover {
  background-color: #229954;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.btn-reject {
  background-color: #e74c3c;
  color: white;
}

.btn-reject:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  transform: translateY(-2px);
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.success-message {
  position: fixed;
  top: 100px;
  right: 20px;
  padding: 1rem 1.5rem;
  background-color: #d4edda;
  color: #155724;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 3000;
  font-weight: 500;
}

@media (max-width: 768px) {
  .filter-tabs {
    flex-direction: column;
    border-bottom: none;
  }

  .filter-tab {
    border-bottom: 1px solid #e0e0e0;
    border-left: 3px solid transparent;
    top: 0;
  }

  .filter-tab.active {
    border-left-color: #667eea;
    border-bottom-color: #e0e0e0;
  }

  .student-header {
    flex-direction: column;
    text-align: center;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .student-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
