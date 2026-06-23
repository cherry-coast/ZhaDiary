<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'login'])

const isLoginMode = ref(true)
const transitionName = ref('slide-right')

const identifier = ref('') // Username or Email for Login
const password = ref('')
const email = ref('')
const code = ref('')
const username = ref('')

const isSubmitting = ref(false)
const countdown = ref(0)
let timer = null

// Reset form when modal opens or mode changes
const resetForm = () => {
  identifier.value = ''
  password.value = ''
  email.value = ''
  code.value = ''
  username.value = ''
  isSubmitting.value = false
  if (timer) {
    clearInterval(timer)
    countdown.value = 0
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    isLoginMode.value = true
    transitionName.value = 'slide-right'
    resetForm()
  }
})

watch(isLoginMode, (newVal) => {
  transitionName.value = newVal ? 'slide-right' : 'slide-left'
  resetForm()
})

const handleSendCode = () => {
  if (!email.value || countdown.value > 0) return
  
  // Start countdown
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSubmit = () => {
  if (isLoginMode.value) {
    if (!identifier.value.trim() || !password.value.trim()) return
  } else {
    if (!email.value.trim() || !code.value.trim() || !username.value.trim() || !password.value.trim()) return
  }
  
  isSubmitting.value = true
  
  // Mock API call
  setTimeout(() => {
    isSubmitting.value = false
    emit('login', {
      username: isLoginMode.value ? (identifier.value.includes('@') ? identifier.value.split('@')[0] : identifier.value) : username.value,
      avatar: '🍉', // Mock default avatar
      isLoggedIn: true
    })
    emit('close')
  }, 1000)
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('close')">
    <div class="login-modal animate-slide-up">
      <div class="modal-top-fixed">
        <button class="close-btn" @click="emit('close')">×</button>
        
        <div class="modal-header">
          <div class="logo-circle">
            <img src="/吃瓜.svg" class="login-logo" alt="吃瓜日记" />
          </div>
          <h2 class="title">{{ isLoginMode ? '欢迎回到吃瓜日记' : '加入吃瓜大军' }}</h2>
          <p class="subtitle">{{ isLoginMode ? '登录你的账号，一起愉快吃瓜' : '注册新账号，发现更多热瓜' }}</p>
        </div>

        <div class="mode-toggle">
          <button 
            class="toggle-btn" 
            :class="{ active: isLoginMode }" 
            @click="isLoginMode = true"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            登录
          </button>
          <button 
            class="toggle-btn" 
            :class="{ active: !isLoginMode }" 
            @click="isLoginMode = false"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            注册
          </button>
          <div class="toggle-slider" :class="{ 'right-side': !isLoginMode }"></div>
        </div>
      </div>
      
      <div class="modal-body-scroll">
        <form class="login-form" @submit.prevent="handleSubmit">
          <transition :name="transitionName" mode="out-in">
            <div v-if="isLoginMode" class="form-content" key="login">
              <div class="input-group">
                <label for="identifier">用户名 / 邮箱</label>
                <div class="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input 
                    id="identifier"
                    v-model="identifier" 
                    type="text" 
                    placeholder="请输入用户名或邮箱号"
                    required
                    class="premium-input with-icon"
                  />
                </div>
              </div>
              
              <div class="input-group">
                <label for="login-password">密码</label>
                <div class="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input 
                    id="login-password"
                    v-model="password" 
                    type="password" 
                    placeholder="请输入密码"
                    required
                    class="premium-input with-icon"
                  />
                </div>
              </div>
            </div>

            <div v-else class="form-content" key="register">
              <div class="input-group">
                <label for="email">邮箱号</label>
                <div class="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input 
                    id="email"
                    v-model="email" 
                    type="email" 
                    placeholder="请输入邮箱号"
                    required
                    class="premium-input with-icon"
                  />
                </div>
              </div>

              <div class="input-group">
                <label for="code">邮箱验证码</label>
                <div class="code-input-wrapper">
                  <div class="input-wrapper" style="flex: 1;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <input 
                      id="code"
                      v-model="code" 
                      type="text" 
                      placeholder="请输入验证码"
                      required
                      class="premium-input with-icon code-input"
                    />
                  </div>
                  <button 
                    type="button" 
                    class="send-code-btn" 
                    :disabled="!email || countdown > 0"
                    @click="handleSendCode"
                  >
                    {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label for="username">用户名</label>
                <div class="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input 
                    id="username"
                    v-model="username" 
                    type="text" 
                    placeholder="请输入用户名"
                    required
                    class="premium-input with-icon"
                  />
                </div>
              </div>
              
              <div class="input-group">
                <label for="register-password">密码</label>
                <div class="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input 
                    id="register-password"
                    v-model="password" 
                    type="password" 
                    placeholder="请输入密码"
                    required
                    class="premium-input with-icon"
                  />
                </div>
              </div>
            </div>
          </transition>

          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="loading-spinner"></span>
            <template v-else>
              <svg v-if="isLoginMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              {{ isLoginMode ? '登录' : '注册并登录' }}
            </template>
          </button>
        </form>
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

.login-modal {
  background: #ffffff;
  width: 100%;
  max-width: 420px;
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
  padding: 40px 32px 0;
  background: #ffffff;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.modal-body-scroll {
  padding: 24px 32px 40px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 79, 104, 0.1), rgba(255, 179, 71, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(255, 79, 104, 0.15);
}

.login-logo {
  width: 36px;
  height: 36px;
}

.title {
  margin: 0 0 6px;
  color: #2d211f;
  font-size: 1.5rem;
  font-weight: 800;
}

.subtitle {
  margin: 0;
  color: #8a736b;
  font-size: 0.9rem;
}

.mode-toggle {
  display: flex;
  position: relative;
  background: #f8f5f4;
  border-radius: 12px;
  padding: 4px;
  margin-top: 14px;
  margin-bottom: 8px;
}

.toggle-btn {
  flex: 1;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: #8e807a;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  z-index: 2;
  transition: color 0.3s ease;
}

.tab-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.toggle-btn.active .tab-icon {
  transform: scale(1.1);
}

.toggle-btn.active {
  color: #ff4f68;
}

.toggle-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1;
}

.toggle-slider.right-side {
  transform: translateX(100%);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-content {
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

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: #c4b9b5;
  transition: color 0.3s ease;
  pointer-events: none;
}

.input-wrapper:focus-within .input-icon {
  color: #ff4f68;
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

.premium-input.with-icon {
  padding-left: 42px;
}

.premium-input:focus {
  background: #ffffff;
  border-color: #ff4f68;
  box-shadow: 0 0 0 4px rgba(255, 79, 104, 0.1);
}

.premium-input::placeholder {
  color: #c4b9b5;
}

.code-input-wrapper {
  display: flex;
  gap: 12px;
}

.send-code-btn {
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #ff4f68;
  background: #fff;
  color: #ff4f68;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  min-width: 100px;
}

.send-code-btn:hover:not(:disabled) {
  background: #fff4f5;
}

.send-code-btn:disabled {
  border-color: #e8e0de;
  color: #a69b98;
  cursor: not-allowed;
  background: #f8f5f4;
}

.submit-btn {
  margin-top: 10px;
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
  gap: 8px;
  min-height: 52px;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(255, 79, 104, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
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

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
