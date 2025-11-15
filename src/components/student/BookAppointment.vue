<template>
  <div class="book-appointment">
    <form @submit.prevent="handleSubmit" class="appointment-form">
      <div class="form-group">
        <label>Teacher</label>
        <input type="text" :value="teacher.name" disabled class="disabled-input" />
      </div>

      <div class="form-group">
        <label>Department</label>
        <input type="text" :value="teacher.department" disabled class="disabled-input" />
      </div>

      <div class="form-group">
        <label for="date">Preferred Date *</label>
        <input type="date" id="date" v-model="formData.date" required :min="minDate" />
      </div>

      <div class="form-group">
        <label for="time">Preferred Time *</label>
        <input type="time" id="time" v-model="formData.time" required />
      </div>

      <div class="form-group">
        <label for="duration">Duration *</label>
        <select id="duration" v-model="formData.duration" required>
          <option value="">Select Duration</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
        </select>
      </div>

      <div class="form-group">
        <label for="location">Preferred Location *</label>
        <select id="location" v-model="formData.location" required>
          <option value="">Select Location</option>
          <option value="Office">Office</option>
          <option value="Online - Zoom">Online - Zoom</option>
          <option value="Online - Google Meet">Online - Google Meet</option>
          <option value="Online - Microsoft Teams">Online - Microsoft Teams</option>
        </select>
      </div>

      <div class="form-group">
        <label for="reason">Reason for Appointment *</label>
        <textarea
          id="reason"
          v-model="formData.reason"
          rows="4"
          required
          placeholder="Please describe the reason for this appointment..."
        ></textarea>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="$emit('close')" :disabled="loading">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Booking...' : 'Book Appointment' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  teacher: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const loading = ref(false)
const error = ref(null)

const formData = ref({
  date: '',
  time: '',
  duration: '',
  location: '',
  reason: '',
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const handleSubmit = async () => {
  error.value = null
  loading.value = true

  try {
    // Get student name from user document first
    const { doc, getDoc } = await import('firebase/firestore')
    const userDoc = await getDoc(doc(db, 'users', authStore.user.uid))
    let studentName = authStore.user.email
    if (userDoc.exists()) {
      const userData = userDoc.data()
      studentName = userData.name || authStore.user.email
    }

    // Combine date and time into a single datetime
    const appointmentDateTime = new Date(`${formData.value.date}T${formData.value.time}`)

    // Create appointment document in Firestore
    const appointmentData = {
      studentId: authStore.user.uid,
      studentName: studentName,
      studentEmail: authStore.user.email,
      teacherId: props.teacher.id,
      teacherName: props.teacher.name,
      teacherEmail: props.teacher.email,
      date: formData.value.date,
      time: formData.value.time,
      appointmentDateTime: appointmentDateTime.toISOString(),
      duration: parseInt(formData.value.duration),
      location: formData.value.location,
      reason: formData.value.reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save to Firestore
    await addDoc(collection(db, 'appointments'), appointmentData)

    emit('success')
  } catch (err) {
    console.error('Error booking appointment:', err)
    error.value = err.message || 'Failed to book appointment. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.book-appointment {
  padding: 1.5rem;
}

.appointment-form {
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
.form-group select,
.form-group textarea {
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

.disabled-input {
  background-color: #f5f5f5;
  color: #7f8c8d;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
