<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'viewDetail'])

const searchQuery = ref('')
const expandedPosts = ref(new Set())
const MAX_LENGTH = 120

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) {
    return []
  }
  const query = searchQuery.value.toLowerCase()
  return props.posts.filter(post => 
    post.content.toLowerCase().includes(query) ||
    post.author.toLowerCase().includes(query) ||
    (post.category && post.category.toLowerCase().includes(query))
  )
})

const toggleExpand = (postId) => {
  if (expandedPosts.value.has(postId)) {
    expandedPosts.value.delete(postId)
  } else {
    expandedPosts.value.add(postId)
  }
}

const getDisplayContent = (content) => {
  if (!content) return ''
  return content.length > MAX_LENGTH ? content.slice(0, MAX_LENGTH) : content
}

const isExpanded = (postId) => expandedPosts.value.has(postId)

const shouldTruncate = (content) => content && content.length > MAX_LENGTH

const handleKeyup = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

watch(() => props.posts, () => {
  searchQuery.value = ''
})
</script>

<template>
  <div class="search-page" @keyup="handleKeyup">
    <div class="search-header">
      <button class="back-btn" @click="emit('close')">
        <svg viewBox="0 0 24 24" class="back-icon">
          <path 
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" 
            fill="#fff"
          />
        </svg>
      </button>
      <div class="search-input-wrapper">
        <input 
          v-model="searchQuery"
          type="text" 
          class="search-input"
          placeholder="搜索瓜..."
          autofocus
        />
        <svg v-if="searchQuery" viewBox="0 0 24 24" class="clear-icon" @click="searchQuery = ''">
          <path 
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" 
            fill="#999"
          />
        </svg>
      </div>
    </div>
    
    <div class="search-content">
      <div v-if="!searchQuery" class="search-hints">
        <h3 class="hints-title">🍉 热门搜索</h3>
        <div class="hints-list">
          <button 
            v-for="hint in ['娱乐圈大瓜', '情感故事', '职场吐槽', '美食分享', '旅行日记']" 
            :key="hint"
            class="hint-item"
            @click="searchQuery = hint"
          >
            {{ hint }}
          </button>
        </div>
      </div>
      
      <div v-else-if="searchResults.length === 0" class="empty-results">
        <div class="empty-icon">🔍</div>
        <p class="empty-text">没有找到相关的瓜</p>
        <p class="empty-hint">换个关键词试试？</p>
      </div>
      
      <div v-else class="search-results">
        <div class="results-count">找到 {{ searchResults.length }} 个瓜</div>
        <div class="post-list">
          <div 
            v-for="(post, index) in searchResults" 
            :key="post.id" 
            class="post-card animate-slide-up"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="post-header">
              <div class="avatar-wrapper">
                <span class="avatar">{{ post.avatar }}</span>
              </div>
              <div class="author-info">
                <span class="author-name">{{ post.author }}</span>
                <span class="post-time">{{ post.createdAt }}</span>
              </div>
            </div>
            
            <div v-if="post.category" class="post-category">
              <span class="category-tag">{{ post.category }}</span>
            </div>
            
            <div class="post-content">
              <p v-if="shouldTruncate(post.content) && !isExpanded(post.id)">
                {{ getDisplayContent(post.content) }}
                <span class="ellipsis">...</span>
              </p>
              <p v-else>{{ post.content }}</p>
              
              <button 
                v-if="shouldTruncate(post.content)" 
                class="expand-btn"
                @click="toggleExpand(post.id)"
              >
                <span class="expand-text">{{ isExpanded(post.id) ? '收起' : '展开' }}</span>
                <svg 
                  viewBox="0 0 24 24" 
                  class="expand-icon"
                  :class="{ expanded: isExpanded(post.id) }"
                >
                  <path 
                    d="M7.5 8.5L12 13l4.5-4.5" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            
            <div v-if="post.images && post.images.length > 0" class="post-images">
              <div class="image-grid">
                <div 
                  v-for="(img, idx) in post.images" 
                  :key="idx" 
                  class="image-item"
                  :class="{ 'single': post.images.length === 1 }"
                >
                  <img :src="img.base64" :alt="img.fileName" class="post-image" />
                </div>
              </div>
            </div>
            
            <div class="post-actions">
              <div class="action-item">
                <span class="action-icon">❤️</span>
                <span class="action-count">{{ post.likes }}</span>
              </div>
              <div class="action-item">
                <span class="action-icon">💬</span>
                <span class="action-count">{{ post.comments.length }}</span>
              </div>
              <button class="detail-btn" @click="emit('viewDetail', post)">
                <svg viewBox="0 0 24 24" class="detail-icon">
                  <path 
                    d="M12 4C6.48 4 2 8.48 2 14s4.48 10 10 10 10-4.48 10-10S17.52 4 12 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" 
                    fill="#999"
                  />
                </svg>
                <span class="action-count">详情</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #ff6b6b 0%, #ffa94d 100%);
}

.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  padding-top: calc(16px + env(safe-area-inset-top));
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.back-btn:hover {
  background: rgba(255,255,255,0.3);
}

.back-icon {
  width: 20px;
  height: 20px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: none;
  border-radius: 24px;
  font-size: 0.9375rem;
  outline: none;
  background: rgba(255,255,255,0.95);
}

.search-input::placeholder {
  color: #999;
}

.clear-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.search-content {
  padding: 16px;
  padding-bottom: 100px;
}

.search-hints {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 20px;
}

.hints-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 14px 0;
}

.hints-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hint-item {
  padding: 8px 16px;
  border-radius: 20px;
  background: #f5f5f5;
  border: none;
  font-size: 0.875rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hint-item:hover {
  background: #ffe4e4;
  color: #ff6b6b;
}

.empty-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 1.125rem;
  color: #fff;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.empty-hint {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.8);
  margin: 0;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.results-count {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.9);
  padding: 0 8px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  background: #fff;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  position: relative;
  z-index: 1;
}



.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.post-time {
  font-size: 0.75rem;
  color: #999;
}

.post-category {
  margin-bottom: 10px;
}

.category-tag {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  color: #fff;
  font-size: 0.75rem;
  border-radius: 20px;
  font-weight: 500;
}

.post-content {
  margin-bottom: 14px;
}

.post-content p {
  color: #333;
  line-height: 1.6;
  font-size: 0.9375rem;
  margin: 0;
  word-break: break-word;
}

.ellipsis {
  color: #999;
}

.expand-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 0.875rem;
  cursor: pointer;
}

.expand-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.post-images {
  margin-bottom: 14px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.image-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.image-item.single {
  grid-column: span 3;
  max-height: 300px;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-actions {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-icon {
  font-size: 1rem;
}

.action-count {
  font-size: 0.875rem;
  color: #666;
}

.detail-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
}

.detail-icon {
  width: 18px;
  height: 18px;
}

@media screen and (min-width: 768px) {
  .search-page {
    display: none;
  }
}
.search-page {
  background:
    radial-gradient(circle at 12% 12%, rgba(255, 255, 255, 0.34), transparent 24%),
    linear-gradient(135deg, #ff4f68 0%, #ff9a55 48%, #2f9e44 100%);
}

.search-header {
  position: sticky;
  top: 0;
  z-index: 2;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
}

.back-btn {
  border: 1px solid rgba(255, 255, 255, 0.26);
}

.search-input {
  box-shadow: 0 12px 30px rgba(45, 33, 31, 0.16);
}

.search-input:focus {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.26), 0 12px 30px rgba(45, 33, 31, 0.16);
}

.search-hints,
.post-card {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 250, 242, 0.92));
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: 0 18px 48px rgba(45, 33, 31, 0.16);
  border-radius: 8px;
}

.hint-item {
  background: #fff4e5;
  color: #5d433c;
}

.hint-item:hover {
  background: #f2fbef;
  color: #166534;
}

.category-tag {
  background: #fff4e5;
  border: 1px solid rgba(255, 107, 107, 0.22);
  color: #d9485f;
  border-radius: 6px;
}

.expand-btn {
  color: #2f9e44;
  font-weight: 700;
}

.avatar {
  background: radial-gradient(circle at 35% 30%, #fff7a8 0 16%, #ff5d73 17% 55%, #2f9e44 56% 100%);
  border: 2px solid #ffffff;
  box-shadow: 
    0 0 0 1px rgba(255, 79, 104, 0.25),
    0 4px 10px rgba(133, 46, 35, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.post-card:hover .avatar {
  transform: scale(1.05);
  box-shadow: 
    0 0 0 2px rgba(255, 79, 104, 0.4),
    0 6px 14px rgba(133, 46, 35, 0.14);
}
</style>
