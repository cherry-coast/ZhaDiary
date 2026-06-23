<script setup>
import { ref } from 'vue'

defineProps({
  totalPosts: {
    type: Number,
    default: 0
  },
  totalComments: {
    type: Number,
    default: 0
  },
  categories: {
    type: Array,
    default: () => []
  },
  selectedCategories: {
    type: Array,
    default: () => []
  },
  filteredCount: {
    type: Number,
    default: 0
  },
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['openPostForm', 'search', 'filterCategory', 'openLogin', 'logout', 'openProfile'])

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value.trim())
}

const handleKeyup = (e) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="logo-section header-left">
        <div class="watermelon-logo animate-bounce">
          <img src="/吃瓜.svg" class="watermelon-svg" alt="吃瓜日记" />
        </div>
        <div class="title-section">
          <h1 class="title">吃瓜日记</h1>
          <p class="subtitle">猹的快乐老家</p>
        </div>
      </div>
      
      <div class="desktop-search header-center">
        <input 
          v-model="searchQuery"
          type="text" 
          class="search-input"
          placeholder="搜索瓜..."
          @keyup="handleKeyup"
        />
        <button class="search-submit-btn" @click="handleSearch" title="吃瓜搜索">
          <svg viewBox="0 0 24 24" class="search-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 5.5 8.5 A 5 5 0 0 1 8.5 5.5" stroke="#ff4f68" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
            <circle cx="10" cy="10" r="7" stroke="#ff4f68" stroke-width="2" />
            <line x1="15" y1="15" x2="21" y2="21" stroke="#40c057" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 6.5 9 A 3.5 3.5 0 0 0 13.5 9 Z" fill="#ff4f68" />
            <path d="M 6.5 9 A 3.5 3.5 0 0 0 13.5 9" stroke="#40c057" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="8.5" cy="10.5" r="0.6" fill="#ffffff" />
            <circle cx="11.5" cy="10.5" r="0.6" fill="#ffffff" />
          </svg>
        </button>
      </div>

      <div class="user-section header-right">
        <div v-if="currentUser" class="user-profile">
          <div class="user-avatar clickable" @click="emit('openProfile')" title="修改个人信息">{{ currentUser.avatar }}</div>
          <span class="user-name clickable" @click="emit('openProfile')" title="修改个人信息">{{ currentUser.username }}</span>
          <button class="logout-btn" @click="emit('logout')" title="退出登录">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
        <button v-else class="login-trigger-btn" @click="emit('openLogin')">登录 / 注册</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  padding: 16px;
  padding-top: calc(16px + env(safe-area-inset-top));
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 30px rgba(255, 107, 107, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.watermelon-logo {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.watermelon-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.title-section {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  margin: 0;
}

.subtitle {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.8);
  margin: 2px 0 0 0;
}

.desktop-search,
.user-section {
  display: none;
}

.mobile-header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  position: relative;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.action-btn:hover {
  background: rgba(255,255,255,0.3);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-icon {
  width: 18px;
  height: 18px;
}

.category-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #40c057;
  color: #fff;
  font-size: 0.5625rem;
  padding: 1px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.post-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.post-btn:hover {
  transform: scale(1.1);
  background: rgba(255,255,255,0.3);
}

.post-btn:active {
  transform: scale(0.95);
}

.plus-icon {
  font-size: 1.75rem;
  color: #fff;
  font-weight: 300;
}

.stats-bar {
  display: flex;
  justify-content: space-around;
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 10px 0;
  backdrop-filter: blur(10px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: bold;
  color: #fff;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.8);
}

.stat-divider {
  width: 1px;
  background: rgba(255,255,255,0.3);
}

@media screen and (min-width: 768px) {
  .header {
    padding: 12px 20px;
    padding-top: 12px;
    border-radius: 0;
    box-shadow: 0 2px 20px rgba(255, 107, 107, 0.2);
  }
  
  .header-content {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
    margin-bottom: 0;
  }
  
  .header-left {
    justify-self: start;
  }
  
  .header-center {
    justify-self: center;
  }
  
  .header-right {
    justify-self: end;
  }
  
  .watermelon-logo {
    width: 36px;
    height: 36px;
  }
  
  .title {
    font-size: 1.25rem;
  }
  
  .subtitle {
    font-size: 0.75rem;
  }
  
  .desktop-search {
    display: flex;
    gap: 8px;
  }
  
  .search-input {
    width: 360px;
    padding: 12px 20px;
    border: none;
    border-radius: 24px;
    font-size: 1rem;
    outline: none;
    background: rgba(255,255,255,0.95);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .search-input:focus {
    width: 380px;
  }
  
  .search-input::placeholder {
    color: #999;
  }
  
  .search-submit-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .search-submit-btn:hover {
    background: #fff4f5;
    border-color: #ff4f68;
    transform: scale(1.1) rotate(-5deg);
    box-shadow: 0 6px 16px rgba(255, 79, 104, 0.25) !important;
  }
  
  .search-icon {
    width: 24px;
    height: 24px;
  }
  
  .user-section {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  
  .login-trigger-btn {
    padding: 8px 20px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
  }
  
  .login-trigger-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.15);
    padding: 4px 12px 4px 4px;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .user-avatar.clickable,
  .user-name.clickable {
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  .user-avatar.clickable:hover,
  .user-name.clickable:hover {
    opacity: 0.8;
  }
  
  .user-name {
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .logout-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s ease;
  }
  
  .logout-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
  }

  .mobile-header-actions {
    display: none;
  }
  
  .stats-bar {
    display: none;
  }
}

@media screen and (min-width: 1024px) {
  .header {
    padding: 14px 24px;
  }
  
  .watermelon-logo {
    width: 40px;
    height: 40px;
  }
  
  .title {
    font-size: 1.375rem;
  }
  
  .subtitle {
    font-size: 0.8125rem;
  }
  
  .search-input {
    width: 460px;
    padding: 12px 20px;
  }
  
  .search-input:focus {
    width: 480px;
  }
}

@media screen and (max-width: 320px) {
  .header {
    padding: 12px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }
  
  .watermelon-logo {
    width: 36px;
    height: 36px;
  }
  
  .title {
    font-size: 1.25rem;
  }
  
  .subtitle {
    font-size: 0.625rem;
  }
  
  .action-btn {
    width: 36px;
    height: 36px;
  }
  
  .action-icon {
    width: 16px;
    height: 16px;
  }
  
  .post-btn {
    width: 40px;
    height: 40px;
  }
  
  .plus-icon {
    font-size: 1.5rem;
  }
  
  .stats-bar {
    padding: 8px 0;
  }
  
  .stat-value {
    font-size: 1rem;
  }
  
  .stat-label {
    font-size: 0.625rem;
  }
}
.header {
  background:
    linear-gradient(135deg, rgba(255, 79, 104, 0.96) 0%, rgba(255, 145, 72, 0.96) 52%, rgba(47, 158, 68, 0.94) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.42);
  box-shadow: 0 18px 46px rgba(133, 46, 35, 0.18);
  overflow: hidden;
}

.header::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 12% 25%, rgba(255, 255, 255, 0.34) 0 4px, transparent 5px),
    radial-gradient(circle at 78% 38%, rgba(51, 32, 28, 0.16) 0 3px, transparent 4px),
    radial-gradient(circle at 68% 72%, rgba(51, 32, 28, 0.14) 0 2px, transparent 3px);
}

.header-content {
  position: relative;
  z-index: 1;
}

.watermelon-logo {
  width: 50px;
  height: 50px;
  padding: 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.36);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 22px rgba(133, 46, 35, 0.14);
}

.title {
  letter-spacing: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.86);
}

.search-input,
.search-submit-btn {
  box-shadow: 0 8px 24px rgba(133, 46, 35, 0.1);
}

.search-input {
  color: #2d211f;
}

.search-input:focus {
  background: #ffffff;
  box-shadow: 0 12px 36px rgba(133, 46, 35, 0.25);
}

@media screen and (min-width: 768px) {
  .header {
    margin: 0;
    padding: 14px 24px;
  }

  .watermelon-logo {
    width: 44px;
    height: 44px;
    border-radius: 8px;
  }
}
</style>
