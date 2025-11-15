<template>
  <div class="approve-cancel-appointment">
    <h2 class="page-title">Approve/Cancel Appointment</h2>
    <p class="page-subtitle">Manage pending appointment requests from students</p>

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
          :class="{ active: filterStatus === 'cancelled' }"
          @click="filterStatus = 'cancelled'"
        >
          Cancelled ({{ cancelledCount }})
        </button>
      </div>
    </div>

    <div class="appointments-list">
      <div v-if="loading" class="loading-message">
        <p>Loading appointments...</p>
      </div>
      <div v-else-if="filteredAppointments.length === 0" class="no-results">
        <p>No {{ filterStatus }} appointments found.</p>
      </div>

      <div
        v-for="appointment in filteredAppointments"
        :key="appointment.id"
        class="appointment-card"
        :class="appointment.status"
      >
        <div class="appointment-header">
          <div class="student-info">
            <h3>{{ appointment.studentName }}</h3>
            <p class="student-email">{{ appointment.studentEmail }}</p>
            <span class="status-badge" :class="appointment.status">
              {{ appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }}
            </span>
          </div>
        </div>

        <div class="appointment-details">
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">{{ formatDate(appointment.date) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Time:</span>
            <span class="detail-value">{{ appointment.time }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration:</span>
            <span class="detail-value">{{ appointment.duration }} minutes</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">{{ appointment.location }}</span>
          </div>
          <div v-if="appointment.reason" class="detail-row">
            <span class="detail-label">Reason:</span>
            <span class="detail-value">{{ appointment.reason }}</span>
          </div>
        </div>

        <div v-if="appointment.status === 'pending'" class="appointment-actions">
          <button class="btn btn-approve" @click="approveAppointment(appointment.id)">
            Approve
          </button>
          <button class="btn btn-cancel" @click="cancelAppointment(appointment.id)">Cancel</button>
        </div>

        <div v-else class="appointment-actions">
          <button class="btn btn-secondary" @click="viewDetails(appointment)">View Details</button>
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
import { db } from '../../firebase/config'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const filterStatus = ref('pending')
const showSuccess = ref(false)
const successMessage = ref('')
const loading = ref(false)

// Appointments data from Firestore
const appointments = ref([])
let unsubscribeAppointments = null

// Fetch appointments from Firestore
const fetchAppointments = async () => {
  loading.value = true
  try {
    const appointmentsRef = collection(db, 'appointments')
    const q = query(appointmentsRef, where('teacherId', '==', authStore.user.uid))
    const querySnapshot = await getDocs(q)

    appointments.value = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        studentId: data.studentId,
        studentName: data.studentName || 'Unknown Student',
        studentEmail: data.studentEmail || '',
        date: data.date ? new Date(data.date) : new Date(),
        time: data.time || '',
        duration: data.duration || 30,
        location: data.location || '',
        reason: data.reason || '',
        status: data.status || 'pending',
        createdAt: data.createdAt || new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
  } finally {
    loading.value = false
  }
}

// Set up real-time listener for appointments
const setupAppointmentsListener = () => {
  try {
    const appointmentsRef = collection(db, 'appointments')
    const q = query(appointmentsRef, where('teacherId', '==', authStore.user.uid))

    unsubscribeAppointments = onSnapshot(
      q,
      (querySnapshot) => {
        appointments.value = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            studentId: data.studentId,
            studentName: data.studentName || 'Unknown Student',
            studentEmail: data.studentEmail || '',
            date: data.date ? new Date(data.date) : new Date(),
            time: data.time || '',
            duration: data.duration || 30,
            location: data.location || '',
            reason: data.reason || '',
            status: data.status || 'pending',
            createdAt: data.createdAt || new Date().toISOString(),
          }
        })
      },
      (error) => {
        console.error('Error in appointments listener:', error)
      },
    )
  } catch (error) {
    console.error('Error setting up appointments listener:', error)
    fetchAppointments()
  }
}

const filteredAppointments = computed(() => {
  return appointments.value.filter((apt) => apt.status === filterStatus.value)
})

const pendingCount = computed(() => {
  return appointments.value.filter((a) => a.status === 'pending').length
})

const approvedCount = computed(() => {
  return appointments.value.filter((a) => a.status === 'approved').length
})

const cancelledCount = computed(() => {
  return appointments.value.filter((a) => a.status === 'cancelled').length
})

const approveAppointment = async (id) => {
  try {
    await updateDoc(doc(db, 'appointments', id), {
      status: 'approved',
      updatedAt: new Date().toISOString(),
    })

    const appointment = appointments.value.find((a) => a.id === id)
    showSuccess.value = true
    successMessage.value = `Appointment with ${appointment.studentName} has been approved!`
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Error approving appointment:', error)
    alert('Error approving appointment. Please try again.')
  }
}

const cancelAppointment = async (id) => {
  const appointment = appointments.value.find((a) => a.id === id)
  if (confirm(`Are you sure you want to cancel the appointment with ${appointment.studentName}?`)) {
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      })

      showSuccess.value = true
      successMessage.value = `Appointment with ${appointment.studentName} has been cancelled.`
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      alert('Error cancelling appointment. Please try again.')
    }
  }
}

const viewDetails = (appointment) => {
  alert(
    `Appointment Details:\n\nStudent: ${appointment.studentName}\nEmail: ${appointment.studentEmail}\nDate: ${formatDate(appointment.date)}\nTime: ${appointment.time}\nDuration: ${appointment.duration} minutes\nLocation: ${appointment.location}\nReason: ${appointment.reason}\nStatus: ${appointment.status}`,
  )
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchAppointments()
  setupAppointmentsListener()
})

onUnmounted(() => {
  if (unsubscribeAppointments) {
    unsubscribeAppointments()
  }
})
</script>

<style scoped>
.approve-cancel-appointment {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
}

.page-subtitle {
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 1rem;
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

.appointments-list {
  display: grid;
  gap: 1.5rem;
}

.appointment-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #95a5a6;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.appointment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.appointment-card.pending {
  border-left-color: #f39c12;
}

.appointment-card.approved {
  border-left-color: #27ae60;
}

.appointment-card.cancelled {
  border-left-color: #e74c3c;
}

.appointment-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
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

.status-badge.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.appointment-details {
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

.appointment-actions {
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

.btn-cancel {
  background-color: #e74c3c;
  color: white;
}

.btn-cancel:hover {
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

.no-results,
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

  .appointment-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
