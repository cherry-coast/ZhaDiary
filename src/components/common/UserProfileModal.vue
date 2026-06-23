<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'updateUser'])

const avatars = ['🍉', '🐹', '🥒', '🎭', '🦄', '🐶', '🐱', '🐼', '🦊', '🐰', '🦁', '🐸']
const selectedAvatar = ref('')

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const isSubmitting = ref(false)

watch(() => props.visible, (newVal) => {
  if (newVal && props.user) {
    selectedAvatar.value = props.user.avatar || '🍉'
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  }
})

const handleSave = () => {
  // Basic validation if trying to change password
  if (newPassword.value || confirmPassword.value) {
    if (!oldPassword.value) {
      alert('请输入原密码')
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      alert('两次输入的新密码不一致')
      return
    }
  }

  isSubmitting.value = true
  
  // Mock API call to update user
  setTimeout(() => {
    isSubmitting.value = false
    emit('updateUser', {
      ...props.user,
      avatar: selectedAvatar.value
      // Note: In a real app, password changes are handled securely on backend
    })
    emit('close')
  }, 800)
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('close')">
    <div class="profile-modal animate-slide-up">
      <div class="modal-top-fixed">
        <button class="close-btn" @click="emit('close')">×</button>
        
        <div class="modal-header">
          <h2 class="title">个人信息设置</h2>
          <p class="subtitle">修改你的专属吃瓜头像和密码</p>
        </div>
      </div>

      <div class="modal-body-scroll">
        <div class="settings-content">
          <!-- Avatar Selection -->
          <div class="setting-section">
            <h3 class="section-title">选择头像</h3>
            <div class="avatar-grid">
              <div 
                v-for="avatar in avatars" 
                :key="avatar"
                class="avatar-item"
                :class="{ active: selectedAvatar === avatar }"
                @click="selectedAvatar = avatar"
              >
                {{ avatar }}
              </div>
            </div>
          </div>

          <!-- Password Change -->
          <div class="setting-section">
            <h3 class="section-title">修改密码 (选填)</h3>
            <div class="password-form">
              <div class="input-group">
                <label for="old-pwd">原密码</label>
                <input 
                  id="old-pwd"
                  v-model="oldPassword" 
                  type="password" 
                  placeholder="请输入原密码"
                  class="premium-input"
                />
              </div>
              
              <div class="input-group">
                <label for="new-pwd">新密码</label>
                <input 
                  id="new-pwd"
                  v-model="newPassword" 
                  type="password" 
                  placeholder="请输入新密码"
                  class="premium-input"
                />
              </div>

              <div class="input-group">
                <label for="confirm-pwd">确认新密码</label>
                <input 
                  id="confirm-pwd"
                  v-model="confirmPassword" 
                  type="password" 
                  placeholder="请再次输入新密码"
                  class="premium-input"
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          class="save-btn" 
          :disabled="isSubmitting"
          @click="handleSave"
        >
          <span v-if="isSubmitting" class="loading-spinner"></span>
          <span v-else>保存修改</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.profile-modal {
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  border-radius: 24px;
  position: relative;
  box-shadow: 0 24px 60px rgba(133, 46, 35, 0.2);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
}

.modal-top-fixed {
  padding: 32px 32px 16px;
  background: #ffffff;
  flex-shrink: 0;
  position: relative;
  border-bottom: 1px dashed #e8e0de;
  z-index: 10;
}

.modal-body-scroll {
  padding: 24px 32px 32px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-body-scroll::-webkit-scrollbar {
  width: 4px;
}
.modal-body-scroll::-webkit-scrollbar-track {
  background: transparent;
  margin: 10px 0;
}
.modal-body-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 79, 104, 0.2);
  border-radius: 4px;
}
.modal-body-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 79, 104, 0.4);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f8f5f4;
  color: #8e807a;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-btn:hover {
  background: #ffe3e3;
  color: #ff4f68;
  transform: rotate(90deg);
}

.modal-header {
  text-align: center;
}

.title {
  margin: 0 0 6px;
  color: #2d211f;
  font-size: 1.4rem;
  font-weight: 800;
}

.subtitle {
  margin: 0;
  color: #8a736b;
  font-size: 0.9rem;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 1rem;
  color: #2d211f;
  margin: 0;
  font-weight: 700;
  position: relative;
  padding-left: 12px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: #ff4f68;
  border-radius: 4px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  background: #fbf9f8;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e8e0de;
}

.avatar-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background: #ffffff;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.avatar-item:hover {
  transform: scale(1.1);
}

.avatar-item.active {
  border-color: #ff4f68;
  background: #fff4f5;
  transform: scale(1.15);
  box-shadow: 0 6px 16px rgba(255, 79, 104, 0.2);
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  color: #5d4a44;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: 4px;
}

.premium-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #e8e0de;
  background: #fbf9f8;
  color: #2d211f;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.premium-input:focus {
  background: #ffffff;
  border-color: #ff4f68;
  box-shadow: 0 0 0 4px rgba(255, 79, 104, 0.1);
}

.premium-input::placeholder {
  color: #c4b9b5;
}

.save-btn {
  margin-top: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #ff4f68 0%, #ff7388 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(255, 79, 104, 0.3);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 52px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(255, 79, 104, 0.4);
}

.save-btn:active:not(:disabled) {
  transform: translateY(0);
}

.save-btn:disabled {
  background: #e8e0de;
  box-shadow: none;
  color: #a69b98;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media screen and (max-width: 480px) {
  .avatar-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
