<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/types'
import { message } from '@/utils/message'

const props = withDefaults(defineProps<{
  visible?: boolean
  user?: User
}>(), {
  visible: false,
  user: () => ({} as User)
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updateUser', user: User): void
}>()

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
      message.warning('请输入原密码')
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      message.warning('两次输入的新密码不一致')
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
    })
    emit('close')
  }, 800)
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="profile-modal animate-slide-up">
      <div class="modal-top-fixed">
        <button class="close-btn" @click="$emit('close')">×</button>
        
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

<style scoped src="../../css/components/common/UserProfileModal.css"></style>
