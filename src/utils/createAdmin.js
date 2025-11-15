// Helper script to create an admin account
// Run this in the browser console or create a temporary admin setup page

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

/**
 * Create an admin account
 * @param {string} email - Admin email
 * @param {string} password - Admin password (min 6 characters)
 * @param {string} name - Admin name
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const createAdminAccount = async (email, password, name) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Save admin data to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email: email,
      name: name,
      role: 'admin',
      createdAt: new Date().toISOString(),
      approved: true,
    })

    console.log('Admin account created successfully!')
    console.log('Email:', email)
    console.log('User ID:', firebaseUser.uid)

    return { success: true }
  } catch (error) {
    console.error('Error creating admin account:', error)
    return { success: false, error: error.message }
  }
}

// Example usage (uncomment and run in browser console):
// createAdminAccount('admin@unifiedmentor.com', 'Admin123!', 'Admin User')
