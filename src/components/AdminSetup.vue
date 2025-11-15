<template>
  <div class="admin-setup-page">
    <div class="setup-container">
      <div class="setup-header">
        <h1>Admin Account Setup</h1>
        <p>Create the first admin account for the system</p>
        <p class="warning-text">⚠️ This page should be removed after creating the admin account</p>
      </div>

      <form @submit.prevent="handleCreateAdmin" class="setup-form">
        <div class="form-group">
          <label for="admin-name">Admin Name</label>
          <input
            type="text"
            id="admin-name"
            v-model="adminData.name"
            required
            placeholder="Enter admin name"
          />
        </div>

        <div class="form-group">
          <label for="admin-email">Admin Email</label>
          <input
            type="email"
            id="admin-email"
            v-model="adminData.email"
            required
            placeholder="Enter admin email"
          />
        </div>

        <div class="form-group">
          <label for="admin-password">Password</label>
          <div class="password-input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="admin-password"
              v-model="adminData.password"
              required
              placeholder="Create a password (min 6 characters)"
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

        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <div class="password-input-wrapper">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirm-password"
              v-model="adminData.confirmPassword"
              required
              placeholder="Confirm password"
              minlength="6"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <svg
                v-if="showConfirmPassword"
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

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          ✅ Admin account created successfully!<br />
          Email: {{ adminData.email }}<br />
          You can now login with these credentials.
        </div>

        <button type="submit" class="submit-button" :disabled="loading || success">
          {{ loading ? 'Creating Admin...' : success ? 'Admin Created' : 'Create Admin Account' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const adminData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)
const error = ref(null)
const success = ref(false)

// Password visibility states
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleCreateAdmin = async () => {
  error.value = null
  success.value = false

  // Validate passwords match
  if (adminData.value.password !== adminData.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  // Validate password length
  if (adminData.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminData.value.email,
      adminData.value.password,
    )
    const firebaseUser = userCredential.user

    // Save admin data to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email: adminData.value.email,
      name: adminData.value.name,
      role: 'admin',
      createdAt: new Date().toISOString(),
      approved: true,
    })

    success.value = true
    loading.value = false

    // Clear form after 2 seconds and redirect to login
    setTimeout(() => {
      adminData.value = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }
      // Redirect to login page with admin tab after successful creation
      window.location.href = '/login?tab=admin'
    }, 2000)
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
}
</script>

<style scoped>
.admin-setup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.setup-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
}

.setup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.setup-header h1 {
  color: #2c3e50;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.setup-header p {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0.25rem 0;
}

.warning-text {
  color: #e74c3c !important;
  font-weight: 500;
  margin-top: 1rem !important;
}

.setup-form {
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

.form-group input {
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

.password-toggle:focus {
  outline: none;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.submit-button {
  padding: 0.875rem;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: #fee;
  color: #c33;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #fcc;
}

.success-message {
  padding: 1rem;
  background-color: #d4edda;
  color: #155724;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #c3e6cb;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .setup-container {
    padding: 1.5rem;
  }

  .setup-header h1 {
    font-size: 1.5rem;
  }
}
</style>
