<template>
  <div class="update-delete-teacher">
    <h2 class="page-title">Update/Delete Teacher</h2>

    <div class="search-section">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search teachers by name, email, or department..."
          class="search-input"
        />
        <button class="search-button" @click="searchTeachers">Search</button>
      </div>
    </div>

    <div class="teachers-list">
      <div v-if="filteredTeachers.length === 0" class="no-results">
        <p>No teachers found. Try adjusting your search.</p>
      </div>

      <div
        v-for="teacher in filteredTeachers"
        :key="teacher.id"
        class="teacher-card"
      >
        <div class="teacher-info">
          <h3>{{ teacher.name }}</h3>
          <p class="teacher-email">{{ teacher.email }}</p>
          <p class="teacher-details">
            <span class="detail-item">
              <strong>Department:</strong> {{ teacher.department }}
            </span>
            <span class="detail-item">
              <strong>Phone:</strong> {{ teacher.phone }}
            </span>
            <span class="detail-item">
              <strong>Qualification:</strong> {{ teacher.qualification }}
            </span>
            <span v-if="teacher.experience" class="detail-item">
              <strong>Experience:</strong> {{ teacher.experience }} years
            </span>
          </p>
        </div>
        <div class="teacher-actions">
          <button class="btn btn-edit" @click="editTeacher(teacher)">Edit</button>
          <button class="btn btn-delete" @click="deleteTeacher(teacher.id)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Edit Teacher</h3>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="updateTeacher" class="edit-form">
          <div class="form-group">
            <label for="edit-name">Full Name *</label>
            <input
              type="text"
              id="edit-name"
              v-model="editingTeacher.name"
              required
            />
          </div>

          <div class="form-group">
            <label for="edit-email">Email Address *</label>
            <input
              type="email"
              id="edit-email"
              v-model="editingTeacher.email"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="edit-phone">Phone Number *</label>
              <input
                type="tel"
                id="edit-phone"
                v-model="editingTeacher.phone"
                required
              />
            </div>

            <div class="form-group">
              <label for="edit-department">Department *</label>
              <select id="edit-department" v-model="editingTeacher.department" required>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="English">English</option>
                <option value="History">History</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="edit-qualification">Qualification *</label>
            <input
              type="text"
              id="edit-qualification"
              v-model="editingTeacher.qualification"
              required
            />
          </div>

          <div class="form-group">
            <label for="edit-experience">Years of Experience</label>
            <input
              type="number"
              id="edit-experience"
              v-model="editingTeacher.experience"
              min="0"
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Teacher</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showSuccess" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const showEditModal = ref(false)
const editingTeacher = ref(null)
const showSuccess = ref(false)
const successMessage = ref('')

// Sample teachers data - in real app, this would come from an API
const teachers = ref([
  {
    id: 1,
    name: 'Dr. John Smith',
    email: 'john.smith@university.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    qualification: 'Ph.D. in Computer Science',
    experience: 10
  },
  {
    id: 2,
    name: 'Prof. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1 (555) 234-5678',
    department: 'Mathematics',
    qualification: 'M.Sc. in Mathematics',
    experience: 8
  },
  {
    id: 3,
    name: 'Dr. Michael Brown',
    email: 'michael.brown@university.edu',
    phone: '+1 (555) 345-6789',
    department: 'Physics',
    qualification: 'Ph.D. in Physics',
    experience: 15
  }
])

const filteredTeachers = computed(() => {
  if (!searchQuery.value.trim()) {
    return teachers.value
  }
  const query = searchQuery.value.toLowerCase()
  return teachers.value.filter(teacher =>
    teacher.name.toLowerCase().includes(query) ||
    teacher.email.toLowerCase().includes(query) ||
    teacher.department.toLowerCase().includes(query)
  )
})

const searchTeachers = () => {
  // Search is handled by computed property
}

const editTeacher = (teacher) => {
  editingTeacher.value = { ...teacher }
  showEditModal.value = true
}

const updateTeacher = () => {
  const index = teachers.value.findIndex(t => t.id === editingTeacher.value.id)
  if (index !== -1) {
    teachers.value[index] = { ...editingTeacher.value }
    showSuccess.value = true
    successMessage.value = 'Teacher updated successfully!'
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  }
  closeModal()
}

const deleteTeacher = (id) => {
  if (confirm('Are you sure you want to delete this teacher?')) {
    const index = teachers.value.findIndex(t => t.id === id)
    if (index !== -1) {
      teachers.value.splice(index, 1)
      showSuccess.value = true
      successMessage.value = 'Teacher deleted successfully!'
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    }
  }
}

const closeModal = () => {
  showEditModal.value = false
  editingTeacher.value = null
}
</script>

<style scoped>
.update-delete-teacher {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

.search-section {
  margin-bottom: 2rem;
}

.search-box {
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

.teachers-list {
  display: grid;
  gap: 1.5rem;
}

.teacher-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.teacher-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.teacher-info {
  flex: 1;
}

.teacher-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.teacher-email {
  color: #667eea;
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.teacher-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
  color: #555;
  font-size: 0.9rem;
}

.detail-item {
  display: flex;
  gap: 0.5rem;
}

.teacher-actions {
  display: flex;
  gap: 1rem;
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

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-edit:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.1rem;
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

.edit-form {
  padding: 1.5rem;
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
.form-group select {
  width: 100%;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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
  .teacher-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .teacher-actions {
    width: 100%;
    margin-top: 1rem;
  }

  .btn {
    flex: 1;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .search-box {
    flex-direction: column;
  }
}
</style>
