<template>
  <div class="add-teacher">
    <h2 class="page-title">Add New Teacher</h2>
    <form @submit.prevent="handleSubmit" class="teacher-form">
      <div class="form-group">
        <label for="name">Full Name *</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          required
          placeholder="Enter teacher's full name"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="email">Email Address *</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            placeholder="Enter email address"
          />
        </div>

        <div class="form-group">
          <label for="password">Password *</label>
          <div class="password-input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="formData.password"
              required
              placeholder="Set password for teacher"
              minlength="6"
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <svg
                v-if="showPassword"
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
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            required
            placeholder="Enter phone number"
          />
        </div>

        <div class="form-group">
          <label for="department">Department *</label>
          <select id="department" v-model="formData.department" required>
            <option value="">Select Department</option>
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
        <label for="qualification">Qualification *</label>
        <input
          type="text"
          id="qualification"
          v-model="formData.qualification"
          required
          placeholder="e.g., Ph.D., M.Sc., B.Ed."
        />
      </div>

      <div class="form-group">
        <label for="experience">Years of Experience</label>
        <input
          type="number"
          id="experience"
          v-model="formData.experience"
          min="0"
          placeholder="Enter years of experience"
        />
      </div>

      <div class="form-group">
        <label for="subjects">Subjects * (Select multiple)</label>
        <div class="subjects-container">
          <label v-for="subject in availableSubjects" :key="subject" class="subject-checkbox">
            <input type="checkbox" :value="subject" v-model="formData.subjects" />
            <span>{{ subject }}</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="bio">Bio/Description</label>
        <textarea
          id="bio"
          v-model="formData.bio"
          rows="4"
          placeholder="Enter teacher's bio or description"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="resetForm">Reset</button>
        <button type="submit" class="btn btn-primary">Add Teacher</button>
      </div>
    </form>

    <div v-if="showSuccess" class="success-message">
      <h3>✅ Teacher added successfully!</h3>
      <div class="credentials-box">
        <p><strong>Email:</strong> {{ createdTeacher.email }}</p>
        <p><strong>Password:</strong> {{ createdTeacher.password }}</p>
        <p class="info-text">
          Please share these credentials with the teacher. They can login immediately without
          approval.
        </p>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const formData = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  department: '',
  qualification: '',
  experience: '',
  subjects: [],
  bio: '',
})

const showPassword = ref(false)
const showSuccess = ref(false)
const error = ref(null)
const loading = ref(false)
const createdTeacher = ref({ email: '', password: '' })

const availableSubjects = [
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
]

const handleSubmit = async () => {
  error.value = null
  showSuccess.value = false

  // Validate subjects
  if (formData.value.subjects.length === 0) {
    error.value = 'Please select at least one subject'
    return
  }

  // Validate password
  if (formData.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.value.email,
      formData.value.password,
    )
    const firebaseUser = userCredential.user

    // Save teacher data to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email: formData.value.email,
      name: formData.value.name,
      role: 'teacher',
      phone: formData.value.phone,
      department: formData.value.department,
      qualification: formData.value.qualification,
      experience: formData.value.experience || 0,
      subjects: formData.value.subjects,
      bio: formData.value.bio || '',
      createdAt: new Date().toISOString(),
      approved: true, // Admin-added teachers are automatically approved
      firstLoginUsed: false,
      addedByAdmin: true,
    })

    // Store credentials to show
    createdTeacher.value = {
      email: formData.value.email,
      password: formData.value.password,
    }

    showSuccess.value = true
    resetForm()
  } catch (err) {
    console.error('Error creating teacher:', err)
    error.value = err.message || 'Failed to create teacher account'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    qualification: '',
    experience: '',
    subjects: [],
    bio: '',
  }
  showPassword.value = false
}
</script>

<style scoped>
.add-teacher {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

.teacher-form {
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
  padding: 1.5rem;
  background-color: #d4edda;
  color: #155724;
  border-radius: 8px;
}

.success-message h3 {
  margin: 0 0 1rem 0;
  color: #155724;
}

.credentials-box {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 2px solid #27ae60;
}

.credentials-box p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.credentials-box strong {
  color: #2c3e50;
}

.info-text {
  margin-top: 1rem !important;
  padding-top: 1rem;
  border-top: 1px solid #c3e6cb;
  font-size: 0.9rem !important;
  color: #155724;
  font-style: italic;
}

.error-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
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

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.subjects-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.subject-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.subject-checkbox:hover {
  background-color: #f0f0f0;
}

.subject-checkbox input[type='checkbox'] {
  width: auto;
  margin: 0;
  cursor: pointer;
}

.subject-checkbox span {
  font-size: 0.95rem;
  color: #2c3e50;
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
