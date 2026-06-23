<script setup>
defineProps({
  selectedCategories: {
    type: Array,
    default: () => []
  },
  totalPosts: {
    type: Number,
    default: 0
  },
  hasActiveFilters: {
    type: Boolean,
    default: false
  },
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['home', 'category', 'post', 'openLogin', 'openProfile'])
</script>

<template>
  <nav class="bottom-nav" aria-label="移动端主导航">
    <button class="nav-item" :class="{ active: !hasActiveFilters }" @click="emit('home')">
      <span class="nav-symbol">⌂</span>
      <span class="nav-label">首页</span>
    </button>
    
    <button class="nav-item post-nav" aria-label="发布新瓜" @click="emit('post')">
      <span class="post-hit-area">
        <svg viewBox="0 0 32 32" class="nav-icon">
          <!-- Watermelon Slice (Perfectly Semicircular) -->
          <!-- Green Rind -->
          <path d="M2 12h28A14 14 0 0 1 2 12z" fill="#2f9e44" />
          <!-- White Rind -->
          <path d="M3.5 12h25A12.5 12.5 0 0 1 3.5 12z" fill="#fff" />
          <!-- Red Flesh -->
          <path d="M5 12h22A11 11 0 0 1 5 12z" fill="#ff4f68" />
          
          <!-- Seeds -->
          <circle cx="10" cy="15.5" r="0.8" fill="#2d211f" />
          <circle cx="22" cy="15.5" r="0.8" fill="#2d211f" />
          <circle cx="12.5" cy="18.5" r="0.8" fill="#2d211f" />
          <circle cx="19.5" cy="18.5" r="0.8" fill="#2d211f" />
          
          <!-- Bite Hole -->
          <circle class="bite-hole" cx="14" cy="12.5" r="3.5" fill="#fff" />
          
          <!-- Spoon Group -->
          <g class="spoon-group">
            <line x1="22.5" y1="9.5" x2="30" y2="2" stroke="#8a736b" stroke-width="1.6" stroke-linecap="round" />
            <ellipse cx="21" cy="11" rx="3.5" ry="2.2" transform="rotate(-45 21 11)" fill="#ffffff" stroke="#8a736b" stroke-width="1.2" />
            <!-- Scooped flesh and seed inside spoon -->
            <circle class="scooped-flesh" cx="21" cy="11" r="2.2" fill="#ff4f68" />
            <circle class="scooped-seed" cx="21.5" cy="11.5" r="0.4" fill="#2d211f" />
          </g>
        </svg>
        <span class="nav-label">发布</span>
      </span>
    </button>
    
    <button 
      class="nav-item category-nav" 
      :class="{ active: selectedCategories.length > 0 }" 
      @click="emit('category')"
    >
      <img src="/种类.svg" class="nav-icon" alt="" />
      <span class="nav-label">分类</span>
      <span v-if="selectedCategories.length > 0" class="category-badge">{{ selectedCategories.length }}</span>
    </button>
    
    <button class="nav-item profile-nav" @click="currentUser ? emit('openProfile') : emit('openLogin')">
      <div v-if="currentUser" class="profile-avatar">{{ currentUser.avatar }}</div>
      <svg v-else viewBox="0 0 24 24" class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span class="nav-label">我的</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: calc(12px + env(safe-area-inset-bottom));
  z-index: 100;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.86);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 30px rgba(133, 46, 35, 0.1);
  backdrop-filter: blur(20px);
}

.nav-item {
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 0;
  background: transparent;
  color: #8e807a;
  cursor: pointer;
  font: inherit;
  transition: all 0.25s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-symbol {
  font-size: 1.55rem;
  line-height: 1;
  color: #b5a9a4;
  transition: all 0.25s ease;
}

.nav-item.active .nav-symbol {
  color: #ff4f68;
  transform: scale(1.1);
  text-shadow: 0 2px 6px rgba(255, 79, 104, 0.2);
}

.category-nav .nav-icon {
  width: 22px;
  height: 22px;
  opacity: 0.6;
  filter: grayscale(40%);
  transition: all 0.25s ease;
}

.category-nav.active .nav-icon {
  opacity: 1;
  filter: grayscale(0) drop-shadow(0 2px 6px rgba(255, 79, 104, 0.15));
  transform: scale(1.1);
}

.profile-avatar {
  width: 22px;
  height: 22px;
  background: #ff4f68;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  margin-bottom: 2px;
  box-shadow: 0 2px 6px rgba(255, 79, 104, 0.3);
}

.nav-label {
  color: #8e807a;
  font-size: 0.72rem;
  font-weight: 700;
  transition: all 0.25s ease;
}

.nav-item.active .nav-label {
  color: #ff4f68;
}

.post-nav {
  flex: none;
  width: 80px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent !important;
}

.post-hit-area {
  width: 58px;
  height: 58px;
  margin-top: -24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  border: 4px solid #ffffff;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff4f68 0%, #ff7388 100%);
  box-shadow: 0 8px 20px rgba(255, 79, 104, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.post-nav:hover .post-hit-area {
  transform: translateY(-4px) scale(1.05) rotate(-6deg);
  box-shadow: 0 12px 24px rgba(255, 79, 104, 0.4);
}

.post-nav:hover .nav-icon {
  transform: scale(1.15) rotate(12deg);
}

.post-nav:active .post-hit-area {
  transform: translateY(-2px) scale(0.95);
  box-shadow: 0 4px 12px rgba(255, 79, 104, 0.2);
}

.post-hit-area .nav-icon {
  width: 22px;
  height: 22px;
  filter: none !important;
  opacity: 1 !important;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.post-hit-area .nav-label {
  color: #ffffff;
  font-size: 0.62rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.category-badge {
  position: absolute;
  top: 4px;
  right: calc(50% - 20px);
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff4f68 0%, #2f9e44 100%);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(255, 79, 104, 0.3);
}

.spoon-group {
  transform-origin: 30px 2px;
  transition: transform 0.3s ease;
}

.post-nav:hover .spoon-group {
  animation: scoop-animation 1.4s ease-in-out infinite;
}

.scooped-flesh,
.scooped-seed {
  opacity: 0;
  transform: scale(0);
  transform-origin: 21px 11px;
}

.post-nav:hover .scooped-flesh,
.post-nav:hover .scooped-seed {
  animation: flesh-appear 1.4s ease-in-out infinite;
}

.bite-hole {
  opacity: 0;
  transform: scale(0);
  transform-origin: 14px 12.5px;
  transition: all 0.3s ease;
}

.post-nav:hover .bite-hole {
  animation: bite-appear 1.4s ease-in-out infinite;
}

@keyframes scoop-animation {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  15% {
    transform: translate(1px, -1.5px) rotate(-8deg);
  }
  45% {
    transform: translate(-7px, 5px) rotate(18deg);
  }
  70% {
    transform: translate(-1.5px, -5px) rotate(-18deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

@keyframes flesh-appear {
  0%, 38% {
    opacity: 0;
    transform: scale(0);
  }
  45%, 85% {
    opacity: 1;
    transform: scale(1);
  }
  95%, 100% {
    opacity: 0;
    transform: scale(0);
  }
}

@keyframes bite-appear {
  0%, 40% {
    opacity: 0;
    transform: scale(0);
  }
  45%, 85% {
    opacity: 1;
    transform: scale(1);
  }
  95%, 100% {
    opacity: 0;
    transform: scale(0);
  }
}

@media screen and (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}
</style>
