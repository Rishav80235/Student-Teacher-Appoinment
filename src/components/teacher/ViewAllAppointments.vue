<template>
  <div class="view-all-appointments">
    <h2 class="page-title">View All Appointments</h2>
    <p class="page-subtitle">Overview of all your scheduled appointments</p>

    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-value">{{ totalAppointments }}</div>
        <div class="stat-label">Total Appointments</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ upcomingAppointments }}</div>
        <div class="stat-label">Upcoming</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ completedAppointments }}</div>
        <div class="stat-label">Completed</div>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-controls">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by student name or email..."
          class="search-input"
        />
        <select v-model="filterStatus" class="filter-select">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div class="appointments-table">
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredAppointments.length === 0">
            <td colspan="7" class="no-data">No appointments found</td>
          </tr>
          <tr
            v-for="appointment in filteredAppointments"
            :key="appointment.id"
            class="appointment-row"
          >
            <td>
              <div class="student-cell">
                <strong>{{ appointment.studentName }}</strong>
                <span class="student-email">{{ appointment.studentEmail }}</span>
              </div>
            </td>
            <td>{{ formatDate(appointment.date) }}</td>
            <td>{{ appointment.time }}</td>
            <td>{{ appointment.duration }} min</td>
            <td>{{ appointment.location }}</td>
            <td>
              <span class="status-badge" :class="appointment.status">
                {{ appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon" @click="viewDetails(appointment)" title="View Details">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <button
                  v-if="appointment.status === 'pending'"
                  class="btn-icon btn-approve"
                  @click="approveAppointment(appointment.id)"
                  title="Approve"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
                <button
                  v-if="appointment.status !== 'completed' && appointment.status !== 'cancelled'"
                  class="btn-icon btn-cancel"
                  @click="cancelAppointment(appointment.id)"
                  title="Cancel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterStatus = ref('all')

// Sample appointments data
const appointments = ref([
  {
    id: 1,
    studentName: 'Alice Johnson',
    studentEmail: 'alice.johnson@student.edu',
    date: new Date('2024-02-20'),
    time: '10:00 AM',
    duration: 30,
    location: 'Office',
    status: 'approved'
  },
  {
    id: 2,
    studentName: 'Bob Williams',
    studentEmail: 'bob.williams@student.edu',
    date: new Date('2024-02-18'),
    time: '2:00 PM',
    duration: 45,
    location: 'Online - Zoom',
    status: 'pending'
  },
  {
    id: 3,
    studentName: 'Carol Davis',
    studentEmail: 'carol.davis@student.edu',
    date: new Date('2024-02-15'),
    time: '11:00 AM',
    duration: 30,
    location: 'Office',
    status: 'completed'
  },
  {
    id: 4,
    studentName: 'David Miller',
    studentEmail: 'david.miller@student.edu',
    date: new Date('2024-02-22'),
    time: '3:00 PM',
    duration: 60,
    location: 'Online - Google Meet',
    status: 'approved'
  },
  {
    id: 5,
    studentName: 'Emma Wilson',
    studentEmail: 'emma.wilson@student.edu',
    date: new Date('2024-02-19'),
    time: '9:00 AM',
    duration: 30,
    location: 'Office',
    status: 'cancelled'
  }
])

const filteredAppointments = computed(() => {
  let filtered = appointments.value

  // Filter by status
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(apt => apt.status === filterStatus.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(apt =>
      apt.studentName.toLowerCase().includes(query) ||
      apt.studentEmail.toLowerCase().includes(query)
    )
  }

  // Sort by date
  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
})

const totalAppointments = computed(() => appointments.value.length)

const upcomingAppointments = computed(() => {
  const today = new Date()
  return appointments.value.filter(apt => 
    new Date(apt.date) >= today && 
    (apt.status === 'approved' || apt.status === 'pending')
  ).length
})

const completedAppointments = computed(() => {
  return appointments.value.filter(apt => apt.status === 'completed').length
})

const approveAppointment = (id) => {
  const appointment = appointments.value.find(a => a.id === id)
  if (appointment) {
    appointment.status = 'approved'
  }
}

const cancelAppointment = (id) => {
  if (confirm('Are you sure you want to cancel this appointment?')) {
    const appointment = appointments.value.find(a => a.id === id)
    if (appointment) {
      appointment.status = 'cancelled'
    }
  }
}

const viewDetails = (appointment) => {
  alert(`Appointment Details:\n\nStudent: ${appointment.studentName}\nEmail: ${appointment.studentEmail}\nDate: ${formatDate(appointment.date)}\nTime: ${appointment.time}\nDuration: ${appointment.duration} minutes\nLocation: ${appointment.location}\nStatus: ${appointment.status}`)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.view-all-appointments {
  max-width: 1400px;
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

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-controls {
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

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.appointments-table {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
}

tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;
}

tbody tr:hover {
  background-color: #f0f0f0;
}

tbody tr:last-child {
  border-bottom: none;
}

td {
  padding: 1rem;
  color: #2c3e50;
  font-size: 0.9rem;
}

.student-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.student-cell strong {
  color: #2c3e50;
}

.student-email {
  color: #667eea;
  font-size: 0.85rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.completed {
  background-color: #cce5ff;
  color: #004085;
}

.status-badge.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background-color: #e0e0e0;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background-color: #d0d0d0;
  transform: scale(1.1);
}

.btn-icon.btn-approve {
  background-color: #d4edda;
  color: #155724;
}

.btn-icon.btn-approve:hover {
  background-color: #c3e6cb;
}

.btn-icon.btn-cancel {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-icon.btn-cancel:hover {
  background-color: #f5c6cb;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

@media (max-width: 1024px) {
  .appointments-table {
    overflow-x: auto;
  }

  table {
    min-width: 800px;
  }
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }
}
</style>
