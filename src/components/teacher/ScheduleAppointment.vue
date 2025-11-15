<template>
  <div class="schedule-appointment">
    <h2 class="page-title">Schedule Appointment</h2>
    <p class="page-subtitle">Set your available time slots for student appointments</p>

    <form @submit.prevent="handleSubmit" class="appointment-form">
      <div class="form-group">
        <label for="date">Date *</label>
        <input
          type="date"
          id="date"
          v-model="formData.date"
          required
          :min="minDate"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="start-time">Start Time *</label>
          <input
            type="time"
            id="start-time"
            v-model="formData.startTime"
            required
          />
        </div>

        <div class="form-group">
          <label for="end-time">End Time *</label>
          <input
            type="time"
            id="end-time"
            v-model="formData.endTime"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label for="duration">Duration per Appointment (minutes) *</label>
        <select id="duration" v-model="formData.duration" required>
          <option value="">Select Duration</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
        </select>
      </div>

      <div class="form-group">
        <label for="location">Location/Platform *</label>
        <select id="location" v-model="formData.location" required>
          <option value="">Select Location</option>
          <option value="Office">Office</option>
          <option value="Online - Zoom">Online - Zoom</option>
          <option value="Online - Google Meet">Online - Google Meet</option>
          <option value="Online - Microsoft Teams">Online - Microsoft Teams</option>
        </select>
      </div>

      <div class="form-group">
        <label for="max-appointments">Maximum Appointments *</label>
        <input
          type="number"
          id="max-appointments"
          v-model="formData.maxAppointments"
          min="1"
          max="20"
          required
          placeholder="Maximum number of appointments for this slot"
        />
      </div>

      <div class="form-group">
        <label for="notes">Additional Notes</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          rows="4"
          placeholder="Any additional information for students..."
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="resetForm">Reset</button>
        <button type="submit" class="btn btn-primary">Schedule Appointment Slot</button>
      </div>
    </form>

    <div v-if="showSuccess" class="success-message">
      Appointment slot scheduled successfully!
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const formData = ref({
  date: '',
  startTime: '',
  endTime: '',
  duration: '',
  location: '',
  maxAppointments: '',
  notes: ''
})

const showSuccess = ref(false)

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const handleSubmit = () => {
  console.log('Appointment slot data:', formData.value)
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    resetForm()
  }, 3000)
}

const resetForm = () => {
  formData.value = {
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    location: '',
    maxAppointments: '',
    notes: ''
  }
}
</script>

<style scoped>
.schedule-appointment {
  max-width: 800px;
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

.appointment-form {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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

.success-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #d4edda;
  color: #155724;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
