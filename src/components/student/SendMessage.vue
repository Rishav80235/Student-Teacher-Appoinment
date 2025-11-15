<template>
  <div class="send-message">
    <form @submit.prevent="handleSubmit" class="message-form">
      <div class="form-group">
        <label>To</label>
        <input
          type="text"
          :value="teacher.name"
          disabled
          class="disabled-input"
        />
      </div>

      <div class="form-group">
        <label>Department</label>
        <input
          type="text"
          :value="teacher.department"
          disabled
          class="disabled-input"
        />
      </div>

      <div class="form-group">
        <label for="subject">Subject *</label>
        <input
          type="text"
          id="subject"
          v-model="formData.subject"
          required
          placeholder="Enter message subject"
        />
      </div>

      <div class="form-group">
        <label for="message">Message *</label>
        <textarea
          id="message"
          v-model="formData.message"
          rows="6"
          required
          placeholder="Type your message here..."
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
        <button type="submit" class="btn btn-primary">Send Message</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  teacher: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const formData = ref({
  subject: '',
  message: ''
})

const handleSubmit = () => {
  console.log('Sending message:', {
    to: props.teacher,
    ...formData.value
  })
  emit('success')
}
</script>

<style scoped>
.send-message {
  padding: 1.5rem;
}

.message-form {
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
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
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

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
