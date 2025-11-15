<template>
  <div class="add-sub-admin">
    <h2 class="page-title">Add Sub-Admin</h2>
    <p class="page-description">
      Sub-admins can help manage student and teacher data, handle password reset requests, and
      assist with account issues.
    </p>

    <form @submit.prevent="handleSubmit" class="sub-admin-form">
      <div class="form-group">
        <label for="name">Full Name *</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          required
          placeholder="Enter sub-admin's full name"
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
              placeholder="Set password for sub-admin"
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

      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          placeholder="Enter phone number (optional)"
        />
      </div>

      <div class="permissions-section">
        <h3 class="permissions-title">Permissions</h3>
        <div class="permissions-list">
          <label class="permission-item">
            <input type="checkbox" v-model="formData.permissions.manageStudents" />
            <span>Manage Students (View, Update, Delete)</span>
          </label>
          <label class="permission-item">
            <input type="checkbox" v-model="formData.permissions.manageTeachers" />
            <span>Manage Teachers (View, Update, Delete)</span>
          </label>
          <label class="permission-item">
            <input type="checkbox" v-model="formData.permissions.resetPasswords" />
            <span>Reset Passwords (Students & Teachers)</span>
          </label>
          <label class="permission-item">
            <input type="checkbox" v-model="formData.permissions.approveRegistrations" />
            <span>Approve Registrations</span>
          </label>
          <label class="permission-item">
            <input type="checkbox" v-model="formData.permissions.viewReports" />
            <span>View Reports & Analytics</span>
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="resetForm">Reset</button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Creating...' : 'Add Sub-Admin' }}
        </button>
      </div>
    </form>

    <div v-if="showSuccess" class="success-message">
      <h3>✅ Sub-Admin added successfully!</h3>
      <div class="credentials-box">
        <p><strong>Email:</strong> {{ createdSubAdmin.email }}</p>
        <p><strong>Password:</strong> {{ createdSubAdmin.password }}</p>
        <p class="info-text">
          Please share these credentials with the sub-admin. They can login using Admin Login.
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
  permissions: {
    manageStudents: true,
    manageTeachers: true,
    resetPasswords: true,
    approveRegistrations: true,
    viewReports: true,
  },
})

const showPassword = ref(false)
const showSuccess = ref(false)
const error = ref(null)
const loading = ref(false)
const createdSubAdmin = ref({ email: '', password: '' })

const handleSubmit = async () => {
  error.value = null
  showSuccess.value = false

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

    // Save sub-admin data to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email: formData.value.email,
      name: formData.value.name,
      role: 'sub-admin',
      phone: formData.value.phone || '',
      permissions: formData.value.permissions,
      createdAt: new Date().toISOString(),
      approved: true, // Sub-admins are automatically approved
      firstLoginUsed: false,
      addedByAdmin: true,
    })

    // Store credentials to show
    createdSubAdmin.value = {
      email: formData.value.email,
      password: formData.value.password,
    }

    showSuccess.value = true
    resetForm()
  } catch (err) {
    console.error('Error creating sub-admin:', err)
    error.value = err.message || 'Failed to create sub-admin account'
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
    permissions: {
      manageStudents: true,
      manageTeachers: true,
      resetPasswords: true,
      approveRegistrations: true,
      viewReports: true,
    },
  }
  showPassword.value = false
}
</script>

<style scoped>
.add-sub-admin {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
}

.page-description {
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.sub-admin-form {
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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

.permissions-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.permissions-title {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.permission-item:hover {
  background-color: #f0f0f0;
}

.permission-item input[type='checkbox'] {
  width: auto;
  margin: 0;
  cursor: pointer;
}

.permission-item span {
  font-size: 0.95rem;
  color: #2c3e50;
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
