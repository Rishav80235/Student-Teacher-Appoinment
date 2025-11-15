<template>
  <div class="view-messages">
    <h2 class="page-title">View Messages</h2>
    <p class="page-subtitle">Communicate with your students</p>

    <div class="messages-container">
      <div class="messages-list">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-item"
          :class="{ unread: !message.read }"
          @click="selectMessage(message)"
        >
          <div class="message-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="message-info">
            <div class="message-header">
              <h4>{{ message.studentName }}</h4>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
            <p class="message-preview">{{ message.preview }}</p>
            <span v-if="!message.read" class="unread-badge">New</span>
          </div>
        </div>
      </div>

      <div class="message-detail" v-if="selectedMessage">
        <div class="message-detail-header">
          <div>
            <h3>{{ selectedMessage.studentName }}</h3>
            <p class="message-email">{{ selectedMessage.studentEmail }}</p>
          </div>
          <button class="btn btn-secondary" @click="selectedMessage = null">Close</button>
        </div>
        <div class="message-detail-content">
          <div class="message-meta">
            <span>Date: {{ formatDate(selectedMessage.timestamp) }}</span>
            <span>Time: {{ formatTime(selectedMessage.timestamp) }}</span>
          </div>
          <div class="message-body">
            <p>{{ selectedMessage.body }}</p>
          </div>
        </div>
        <div class="message-reply">
          <h4>Reply</h4>
          <textarea
            v-model="replyText"
            rows="4"
            placeholder="Type your reply here..."
            class="reply-textarea"
          ></textarea>
          <div class="reply-actions">
            <button class="btn btn-primary" @click="sendReply">Send Reply</button>
          </div>
        </div>
      </div>

      <div v-if="!selectedMessage" class="no-selection">
        <p>Select a message to view details</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const selectedMessage = ref(null)
const replyText = ref('')

// Sample messages data
const messages = ref([
  {
    id: 1,
    studentName: 'Alice Johnson',
    studentEmail: 'alice.johnson@student.edu',
    preview: 'Hello, I have a question about the assignment...',
    body: 'Hello Professor,\n\nI have a question about the assignment that was given last week. Could you please clarify the requirements for the project submission? I want to make sure I\'m following all the guidelines correctly.\n\nThank you for your time.\n\nBest regards,\nAlice',
    timestamp: new Date('2024-02-14T10:30:00'),
    read: false
  },
  {
    id: 2,
    studentName: 'Bob Williams',
    studentEmail: 'bob.williams@student.edu',
    preview: 'Regarding the exam schedule...',
    body: 'Hi Professor,\n\nI wanted to ask about the exam schedule. When will the midterm exam be conducted? I need to plan my study schedule accordingly.\n\nThanks,\nBob',
    timestamp: new Date('2024-02-13T14:20:00'),
    read: false
  },
  {
    id: 3,
    studentName: 'Carol Davis',
    studentEmail: 'carol.davis@student.edu',
    preview: 'Thank you for the feedback...',
    body: 'Dear Professor,\n\nThank you for the detailed feedback on my last assignment. I found it very helpful and will incorporate your suggestions in my next submission.\n\nBest regards,\nCarol',
    timestamp: new Date('2024-02-12T09:15:00'),
    read: true
  },
  {
    id: 4,
    studentName: 'David Miller',
    studentEmail: 'david.miller@student.edu',
    preview: 'Request for office hours...',
    body: 'Hello Professor,\n\nI would like to request a meeting during your office hours to discuss my project proposal. Would next Tuesday at 2 PM work for you?\n\nThank you,\nDavid',
    timestamp: new Date('2024-02-11T16:45:00'),
    read: true
  }
])

const selectMessage = (message) => {
  selectedMessage.value = message
  message.read = true
  replyText.value = ''
}

const sendReply = () => {
  if (replyText.value.trim()) {
    alert(`Reply sent to ${selectedMessage.value.studentName}:\n\n${replyText.value}`)
    replyText.value = ''
  } else {
    alert('Please enter a reply message')
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.view-messages {
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

.messages-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  height: calc(100vh - 300px);
  min-height: 500px;
}

.messages-list {
  background: #f8f9fa;
  border-radius: 12px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message-item {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  gap: 1rem;
}

.message-item:hover {
  background-color: #e8e8e8;
}

.message-item.unread {
  background-color: #e3f2fd;
  font-weight: 500;
}

.message-item:last-child {
  border-bottom: none;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.message-info {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.message-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
}

.message-time {
  color: #7f8c8d;
  font-size: 0.85rem;
  white-space: nowrap;
}

.message-preview {
  color: #555;
  font-size: 0.9rem;
  margin: 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  background-color: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
}

.message-detail {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.message-detail-header h3 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.message-email {
  color: #667eea;
  margin: 0;
  font-size: 0.9rem;
}

.message-detail-content {
  flex: 1;
  margin-bottom: 1.5rem;
}

.message-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.message-body {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  white-space: pre-wrap;
  line-height: 1.6;
  color: #2c3e50;
}

.message-reply {
  border-top: 1px solid #e0e0e0;
  padding-top: 1.5rem;
}

.message-reply h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.reply-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease;
}

.reply-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
}

.no-selection {
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

@media (max-width: 1024px) {
  .messages-container {
    grid-template-columns: 1fr;
    height: auto;
  }

  .messages-list {
    max-height: 300px;
  }

  .no-selection {
    display: none;
  }
}
</style>
