import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userRole = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isTeacher = computed(() => userRole.value === 'teacher')
  const isStudent = computed(() => userRole.value === 'student')

  // Initialize auth state listener
  const initAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser
        // Fetch user role from Firestore
        await fetchUserRole(firebaseUser.uid)
      } else {
        user.value = null
        userRole.value = null
      }
    })
  }

  // Fetch user role from Firestore
  const fetchUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        userRole.value = userDoc.data().role
      }
    } catch (err) {
      console.error('Error fetching user role:', err)
      error.value = err.message
    }
  }

  // Register new user (only student and teacher, not admin)
  const register = async (email, password, name, role) => {
    loading.value = true
    error.value = null
    try {
      // Prevent admin registration through this method
      if (role === 'admin') {
        error.value = 'Admin accounts cannot be created through registration.'
        return { success: false, error: 'Admin accounts cannot be created through registration.' }
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Save user data to Firestore
      // First login is allowed, but second login requires admin approval
      const userData = {
        email: email,
        name: name,
        role: role,
        createdAt: new Date().toISOString(),
        approved: false, // Admin approval required for second login onwards
        firstLoginUsed: false, // Track if first login has been used
      }

      // Add teacher-specific fields if role is teacher
      if (role === 'teacher') {
        userData.department = ''
        userData.subjects = []
        userData.qualification = ''
        userData.experience = 0
        userData.phone = ''
        userData.bio = ''
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), userData)

      user.value = firebaseUser
      userRole.value = role

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Login user
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      // Fetch user role and user data
      await fetchUserRole(userCredential.user.uid)

      // Get user document to check approval status
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))

      if (userDoc.exists()) {
        const userData = userDoc.data()

        // Admin and sub-admin accounts are always approved
        if (userData.role === 'admin' || userData.role === 'sub-admin') {
          return { success: true }
        }

        // Teachers added by admin are automatically approved
        if (userData.addedByAdmin === true) {
          // Update first login if not already done
          if (userData.firstLoginUsed === false) {
            await updateDoc(doc(db, 'users', userCredential.user.uid), {
              firstLoginUsed: true,
              lastLoginAt: new Date().toISOString(),
            })
          }
          return { success: true }
        }

        // Check if this is the first login (firstLoginUsed is false)
        if (userData.firstLoginUsed === false) {
          // Allow first login, then mark first login as used
          await updateDoc(doc(db, 'users', userCredential.user.uid), {
            firstLoginUsed: true,
            lastLoginAt: new Date().toISOString(),
          })
          return { success: true }
        } else {
          // This is second login or later - check if admin has approved
          if (!userData.approved) {
            await logout()
            error.value =
              'Your account requires admin approval for full access. Please contact the administrator.'
            return {
              success: false,
              error:
                'Your account requires admin approval for full access. Please contact the administrator.',
            }
          }
        }
      }

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Logout user
  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      await signOut(auth)
      user.value = null
      userRole.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Delete current user account (auth + Firestore document)
  const deleteAccount = async () => {
    if (!user.value) {
      return { success: false, error: 'No user logged in.' }
    }

    loading.value = true
    error.value = null
    try {
      const uid = user.value.uid

      // Delete Firestore user document
      await deleteDoc(doc(db, 'users', uid))

      // Delete Firebase Auth user
      await deleteUser(user.value)

      user.value = null
      userRole.value = null

      return { success: true }
    } catch (err) {
      console.error('Error deleting account:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    userRole,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    initAuth,
    register,
    login,
    logout,
    deleteAccount,
    fetchUserRole,
  }
})
