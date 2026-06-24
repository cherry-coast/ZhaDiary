<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import type { User } from '@/types'
import { login as apiLogin, register as apiRegister, sendCode as apiSendCode } from '@/api/auth'
import { message } from '@/utils/message'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const validateEmail = (val: string): boolean => {
  return EMAIL_REGEX.test(val)
}

const props = withDefaults(defineProps<{
  visible?: boolean
}>(), {
  visible: false
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'login', user: User): void
}>()

const isLoginMode = ref(true)
const transitionName = ref('slide-right')
const loginMethod = ref<'password' | 'code'>('password')

const identifier = ref('') // Username or Email for Login
const password = ref('')
const email = ref('')
const code = ref('')
const username = ref('')

const isSubmitting = ref(false)
const countdown = ref(0)
let timer: any = null

const updateCountdown = () => {
  if (!email.value) {
    countdown.value = 0
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    return
  }

  // Verification code countdown type: isLoginMode ? 'login' : 'register'
  const key = `send_code_timer_${email.value}_${isLoginMode.value ? 'login' : 'register'}`
  const expireTimeStr = localStorage.getItem(key)
  if (expireTimeStr) {
    const expireTime = parseInt(expireTimeStr, 10)
    const remaining = Math.ceil((expireTime - Date.now()) / 1000)
    if (remaining > 0) {
      countdown.value = remaining
      if (!timer) {
        timer = setInterval(() => {
          const rem = Math.ceil((expireTime - Date.now()) / 1000)
          if (rem <= 0) {
            countdown.value = 0
            clearInterval(timer)
            timer = null
          } else {
            countdown.value = rem
          }
        }, 1000)
      }
      return
    }
  }

  // Clear if expired or not found
  countdown.value = 0
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// Reset form when modal opens or mode changes
const resetForm = () => {
  identifier.value = ''
  password.value = ''
  email.value = ''
  code.value = ''
  username.value = ''
  isSubmitting.value = false
  loginMethod.value = 'password'
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  countdown.value = 0
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

watch(email, () => {
  updateCountdown()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const handleSendCode = async () => {
  if (!email.value || countdown.value > 0) return
  
  const trimmedEmail = email.value.trim()
  if (!validateEmail(trimmedEmail)) {
    message.warning('请输入有效的邮箱地址')
    return
  }
  
  isSubmitting.value = true
  try {
    const type = isLoginMode.value ? 2 : 1 // 1: Register, 2: Login
    await apiSendCode({ email: trimmedEmail, type })
    
    message.success('验证码发送成功，请查收邮件')
    
    // Set 2-minute countdown (120 seconds)
    const expireTime = Date.now() + 120000
    const key = `send_code_timer_${email.value}_${isLoginMode.value ? 'login' : 'register'}`
    localStorage.setItem(key, expireTime.toString())
    
    updateCountdown()
  } catch (error: any) {
    message.error(error.message || '发送验证码失败')
  } finally {
    isSubmitting.value = false
  }
}

const handleSubmit = async () => {
  if (isLoginMode.value) {
    if (loginMethod.value === 'password') {
      const u = identifier.value.trim()
      const p = password.value
      if (!u || !p) return
      if (u.length > 20) {
        message.warning('用户名长度不能超过20个字符')
        return
      }
      if (p.length > 20) {
        message.warning('密码长度不能超过20个字符')
        return
      }
    } else {
      const e = email.value.trim()
      const c = code.value.trim()
      if (!e || !c) return
      if (!validateEmail(e)) {
        message.warning('请输入有效的邮箱地址')
        return
      }
    }
  } else {
    const e = email.value.trim()
    const c = code.value.trim()
    const u = username.value.trim()
    const p = password.value
    if (!e || !c || !u || !p) return
    if (!validateEmail(e)) {
      message.warning('请输入有效的邮箱地址')
      return
    }
    if (u.length > 20) {
      message.warning('用户名长度不能超过20个字符')
      return
    }
    if (p.length > 20) {
      message.warning('密码长度不能超过20个字符')
      return
    }
  }
  
  isSubmitting.value = true
  
  try {
    if (isLoginMode.value) {
      const isPassword = loginMethod.value === 'password'
      const param = {
        loginType: isPassword ? 1 : 2,
        username: isPassword ? identifier.value.trim() : undefined,
        password: isPassword ? password.value : undefined,
        email: !isPassword ? email.value.trim() : undefined,
        code: !isPassword ? code.value.trim() : undefined
      }
      
      const response = await apiLogin(param)
      const authVO = response.data
      
      // Store token
      localStorage.setItem('token', authVO.token)
      localStorage.setItem('user', JSON.stringify({
        username: authVO.username,
        avatar: authVO.avatar || '🍉',
        isLoggedIn: true
      }))
      
      emit('login', {
        username: authVO.username,
        avatar: authVO.avatar || '🍉',
        isLoggedIn: true
      })
      emit('close')
    } else {
      const param = {
        username: username.value.trim(),
        password: password.value,
        email: email.value.trim(),
        nickname: username.value.trim(),
        code: code.value.trim()
      }
      
      const response = await apiRegister(param)
      const authVO = response.data
      
      // Store token
      localStorage.setItem('token', authVO.token)
      localStorage.setItem('user', JSON.stringify({
        username: authVO.username,
        avatar: authVO.avatar || '🍉',
        isLoggedIn: true
      }))
      
      emit('login', {
        username: authVO.username,
        avatar: authVO.avatar || '🍉',
        isLoggedIn: true
      })
      emit('close')
    }
  } catch (error: any) {
    message.error(error.message || '操作失败')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="login-modal animate-slide-up">
      <div class="modal-top-fixed">
        <button class="close-btn" @click="$emit('close')">×</button>
        
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
              <div class="login-method-tabs">
                <button 
                  type="button"
                  class="method-tab" 
                  :class="{ active: loginMethod === 'password' }"
                  @click="loginMethod = 'password'"
                >
                  账号密码登录
                </button>
                <button 
                  type="button"
                  class="method-tab" 
                  :class="{ active: loginMethod === 'code' }"
                  @click="loginMethod = 'code'"
                >
                  邮箱验证码登录
                </button>
              </div>

              <template v-if="loginMethod === 'password'">
                <div class="input-group">
                  <label for="identifier">用户名</label>
                  <div class="input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <input 
                      id="identifier"
                      v-model="identifier" 
                      type="text" 
                      placeholder="请输入用户名"
                      required
                      maxlength="20"
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
                      maxlength="20"
                      class="premium-input with-icon"
                    />
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="input-group">
                  <label for="login-email">邮箱号</label>
                  <div class="input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <input 
                      id="login-email"
                      v-model="email" 
                      type="email" 
                      placeholder="请输入邮箱号"
                      required
                      class="premium-input with-icon"
                    />
                  </div>
                </div>

                <div class="input-group">
                  <label for="login-code">邮箱验证码</label>
                  <div class="code-input-wrapper">
                    <div class="input-wrapper" style="flex: 1;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                      <input 
                        id="login-code"
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
              </template>
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
                    maxlength="20"
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
                    maxlength="20"
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

<style scoped src="../../css/components/common/LoginModal.css"></style>
