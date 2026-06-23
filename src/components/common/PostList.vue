<script setup>
import { ref } from 'vue'

defineProps({
  posts: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggleLike', 'viewDetail'])

const expandedPosts = ref(new Set())

const MAX_LENGTH = 120

const melons = [
  `<svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#40c057"/><circle cx="12" cy="12" r="8.5" fill="#ffffff"/><circle cx="12" cy="12" r="7.5" fill="#ff4f68"/><circle cx="12" cy="8" r="0.8" fill="#2d211f"/><circle cx="9" cy="13" r="0.8" fill="#2d211f"/><circle cx="15" cy="13" r="0.8" fill="#2d211f"/><circle cx="10.5" cy="10" r="0.8" fill="#2d211f"/><circle cx="13.5" cy="10" r="0.8" fill="#2d211f"/><circle cx="12" cy="15" r="0.8" fill="#2d211f"/></svg>`,
  `<svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-10 12 12)"><path d="M 2 12 A 10 10 0 0 0 22 12 Z" fill="#40c057"/><path d="M 3.5 12 A 8.5 8.5 0 0 0 20.5 12 Z" fill="#ffffff"/><path d="M 4.5 12 A 7.5 7.5 0 0 0 19.5 12 Z" fill="#ff4f68"/><circle cx="9" cy="15" r="0.8" fill="#2d211f"/><circle cx="15" cy="15" r="0.8" fill="#2d211f"/><circle cx="12" cy="17" r="0.8" fill="#2d211f"/></g></svg>`,
  `<svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(15 12 12)"><path d="M 12 12 L 3.34 17 A 10 10 0 0 0 20.66 17 Z" fill="#40c057"/><path d="M 12 12 L 4.64 16.25 A 8.5 8.5 0 0 0 19.36 16.25 Z" fill="#ffffff"/><path d="M 12 12 L 5.5 15.75 A 7.5 7.5 0 0 0 18.5 15.75 Z" fill="#ff4f68"/><circle cx="12" cy="16.5" r="0.8" fill="#2d211f"/><circle cx="9.5" cy="14.5" r="0.8" fill="#2d211f"/><circle cx="14.5" cy="14.5" r="0.8" fill="#2d211f"/></g></svg>`,
  `<svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-20 12 12)"><path d="M 12 12 L 4.93 19.07 A 10 10 0 0 0 19.07 19.07 Z" fill="#40c057"/><path d="M 12 12 L 5.99 18.01 A 8.5 8.5 0 0 0 18.01 18.01 Z" fill="#ffffff"/><path d="M 12 12 L 6.7 17.3 A 7.5 7.5 0 0 0 17.3 17.3 Z" fill="#ff4f68"/><circle cx="12" cy="17.5" r="0.8" fill="#2d211f"/><circle cx="9.5" cy="16" r="0.8" fill="#2d211f"/><circle cx="14.5" cy="16" r="0.8" fill="#2d211f"/></g></svg>`
]

const getMelonIcon = (post) => {
  if (post.melonStyle !== undefined && post.melonStyle !== null) {
    return melons[post.melonStyle]
  }
  const index = post.id % melons.length
  return melons[index]
}

const toggleExpand = (postId) => {
  if (expandedPosts.value.has(postId)) {
    expandedPosts.value.delete(postId)
  } else {
    expandedPosts.value.add(postId)
  }
}

const getStrippedContent = (content) => {
  if (!content) return ''
  return content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
}

const getDisplayContent = (content) => {
  if (!content) return ''
  const stripped = getStrippedContent(content)
  return stripped.length > MAX_LENGTH ? stripped.slice(0, MAX_LENGTH) : stripped
}

const isExpanded = (postId) => expandedPosts.value.has(postId)

const shouldTruncate = (content) => {
  if (!content) return false
  return getStrippedContent(content).length > MAX_LENGTH
}
</script>

<template>
  <div class="post-list">
    <div 
      v-for="(post, index) in posts" 
      :key="post.id" 
      class="post-card animate-slide-up"
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      <div class="post-header">
        <div class="avatar-wrapper">
          <span class="avatar melon-avatar" v-html="getMelonIcon(post)"></span>
        </div>
        <div class="author-info">
          <span class="author-name">{{ post.author }}</span>
          <span class="post-time">{{ post.createdAt }}</span>
        </div>
        <div v-if="post.category" class="post-category">
          <span class="category-tag">{{ post.category }}</span>
        </div>
      </div>
      
      <div class="post-content">
        <div v-if="shouldTruncate(post.content) && !isExpanded(post.id)" class="post-text-content">
          {{ getDisplayContent(post.content) }}
          <span class="ellipsis">...</span>
        </div>
        <div v-else class="post-text-content" v-html="post.content"></div>
        
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
        <button 
          class="action-btn like-btn" 
          @click="emit('toggleLike', post)"
          :class="{ liked: post.isLiked }"
        >
          <svg 
            v-if="!post.isLiked" 
            viewBox="0 0 24 24" 
            class="action-icon"
          >
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill="#999"
            />
          </svg>
          <svg 
            v-else 
            viewBox="0 0 24 24" 
            class="action-icon liked-icon"
          >
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill="#ff6b6b"
            />
          </svg>
          <span class="action-count">{{ post.likes }}</span>
        </button>
        
        <button class="action-btn detail-btn" @click="emit('viewDetail', post)">
          <svg viewBox="0 0 24 24" class="action-icon">
            <path 
              d="M12 4C6.48 4 2 8.48 2 14s4.48 10 10 10 10-4.48 10-10S17.52 4 12 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" 
              fill="#999"
            />
          </svg>
          <span class="action-count">详情 · {{ post.comments.length }} 评论</span>
        </button>
      </div>
      
      <div class="watermelon-decor">
        <span class="watermelon-slice" v-html="getMelonIcon(post.id)"></span>
      </div>
    </div>
    
    <div v-if="posts.length === 0" class="empty-state">
      <div class="empty-watermelon animate-bounce" v-html="melons[3]"></div>
      <p class="empty-text">还没有瓜...</p>
      <p class="empty-hint">快来发布第一个瓜吧！</p>
    </div>
  </div>
</template>

<style scoped>
.post-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(255, 107, 107, 0.15);
}

.post-card:active {
  transform: scale(0.99);
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
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
  flex-shrink: 0;
}

.melon-avatar {
  background: #fbf9f8; /* Light background for the SVG */
  font-size: 2.2rem; /* Make the SVG fill the circle well */
  border: 1px solid #e8e0de;
}



.author-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.author-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-time {
  font-size: 0.75rem;
  color: #999;
}

.post-category {
  flex-shrink: 0;
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

.post-content .post-text-content {
  color: #333;
  line-height: 1.6;
  font-size: 0.9375rem;
  margin: 0;
  word-break: break-word;
}

.post-content .post-text-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 8px 0;
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
  padding: 6px 0;
  transition: all 0.3s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.expand-btn:hover {
  opacity: 0.8;
}

.expand-text {
  font-weight: 500;
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
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 6px 10px;
  border-radius: 20px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.action-btn:hover {
  background: #f8f9fa;
}

.action-btn:active {
  transform: scale(0.95);
}

.action-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.action-btn:hover .action-icon {
  transform: scale(1.1);
}

.liked-icon {
  animation: pulse 0.5s ease;
}

.action-count {
  font-size: 0.875rem;
  color: #666;
}

.like-btn.liked .action-count {
  color: #ff6b6b;
}

.watermelon-decor {
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0.2;
}

.watermelon-slice {
  font-size: 70px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.empty-watermelon {
  font-size: 56px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 1.125rem;
  color: #666;
  margin: 0 0 6px 0;
}

.empty-hint {
  font-size: 0.875rem;
  color: #999;
  margin: 0;
}

@media screen and (min-width: 768px) {
  .post-list {
    padding: 12px;
    gap: 12px;
    max-width: 700px;
    margin: 0 auto;
  }
  
  .post-card {
    padding: 16px 20px;
    border-radius: 6px;
    width: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  
  .post-header {
    margin-bottom: 10px;
  }
  
  .avatar {
    width: 48px;
    height: 48px;
    font-size: 1.375rem;
  }
  
  .author-name {
    font-size: 1rem;
  }
  
  .post-time {
    font-size: 0.8125rem;
  }
  
  .category-tag {
    padding: 4px 12px;
    font-size: 0.8125rem;
  }
  
  .post-content {
    margin-bottom: 10px;
  }
  
  .post-content .post-text-content {
    font-size: 0.9375rem;
    line-height: 1.6;
  }
  
  .expand-btn {
    font-size: 0.875rem;
    gap: 6px;
    margin-top: 6px;
  }
  
  .expand-icon {
    width: 16px;
    height: 16px;
  }
  
  .image-grid {
    gap: 8px;
  }
  
  .image-item {
    border-radius: 12px;
  }
  
  .image-item.single {
    max-height: 350px;
  }
  
  .post-actions {
    gap: 16px;
    padding-top: 6px;
    border-top: 1px solid #f5f5f5;
  }
  
  .action-btn {
    padding: 4px 10px;
    gap: 6px;
  }
  
  .action-icon {
    width: 18px;
    height: 18px;
  }
  
  .action-count {
    font-size: 0.9375rem;
  }
  
  .watermelon-slice {
    font-size: 80px;
  }
  
  .empty-state {
    padding: 60px 20px;
  }
  
  .empty-watermelon {
    font-size: 72px;
    margin-bottom: 16px;
  }
  
  .empty-text {
    font-size: 1.25rem;
  }
  
  .empty-hint {
    font-size: 1rem;
  }
}

@media screen and (min-width: 1024px) {
  .post-list {
    padding: 12px;
    gap: 12px;
    max-width: none;
    width: 100%;
  }
  
  .post-card {
    padding: 18px 24px;
    border-radius: 6px;
    width: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  
  .post-header {
    margin-bottom: 10px;
  }
  
  .avatar {
    width: 52px;
    height: 52px;
    font-size: 1.5rem;
  }
  
  .author-name {
    font-size: 1.0625rem;
  }
  
  .post-time {
    font-size: 0.875rem;
  }
  
  .category-tag {
    padding: 5px 14px;
    font-size: 0.875rem;
  }
  
  .post-content {
    margin-bottom: 10px;
  }
  
  .post-content .post-text-content {
    font-size: 1rem;
    line-height: 1.7;
  }
  
  .expand-btn {
    font-size: 0.9375rem;
    gap: 6px;
    margin-top: 6px;
  }
  
  .expand-icon {
    width: 18px;
    height: 18px;
  }
  
  .image-grid {
    gap: 10px;
  }
  
  .image-item {
    border-radius: 12px;
  }
  
  .image-item.single {
    max-height: 400px;
  }
  
  .post-actions {
    gap: 20px;
    padding-top: 6px;
    border-top: 1px solid #f5f5f5;
  }
  
  .action-btn {
    padding: 5px 12px;
    gap: 6px;
  }
  
  .action-icon {
    width: 20px;
    height: 20px;
  }
  
  .action-count {
    font-size: 1rem;
  }
  
  .watermelon-slice {
    font-size: 90px;
  }
  
  .empty-watermelon {
    font-size: 80px;
  }
  
  .empty-text {
    font-size: 1.375rem;
  }
  
  .empty-hint {
    font-size: 1.125rem;
  }
}

@media screen and (max-width: 320px) {
  .post-list {
    padding: 10px;
    gap: 12px;
  }
  
  .post-card {
    padding: 12px;
    border-radius: 16px;
  }
  
  .avatar {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .post-header {
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .author-name {
    font-size: 0.875rem;
  }
  
  .post-time {
    font-size: 0.625rem;
  }
  
  .category-tag {
    padding: 3px 10px;
    font-size: 0.6875rem;
  }
  
  .post-content .post-text-content {
    font-size: 0.8125rem;
    line-height: 1.5;
  }
  
  .expand-btn {
    font-size: 0.8125rem;
    margin-top: 8px;
  }
  
  .expand-icon {
    width: 14px;
    height: 14px;
  }
  
  .image-grid {
    gap: 6px;
  }
  
  .image-item {
    border-radius: 10px;
  }
  
  .post-actions {
    gap: 16px;
    padding-top: 10px;
  }
  
  .action-btn {
    padding: 4px 8px;
    gap: 4px;
  }
  
  .action-icon {
    width: 16px;
    height: 16px;
  }
  
  .action-count {
    font-size: 0.75rem;
  }
  
  .watermelon-slice {
    font-size: 56px;
  }
  
  .empty-state {
    padding: 30px 15px;
  }
  
  .empty-watermelon {
    font-size: 48px;
    margin-bottom: 10px;
  }
  
  .empty-text {
    font-size: 1rem;
  }
  
  .empty-hint {
    font-size: 0.75rem;
  }
}
.post-list {
  padding: 16px;
  gap: 16px;
}

.post-card {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 250, 242, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 8px;
  box-shadow: 0 14px 42px rgba(133, 46, 35, 0.1);
}

.post-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 132px;
  height: 100%;
  background:
    radial-gradient(circle at 72% 28%, rgba(51, 32, 28, 0.14) 0 3px, transparent 4px),
    radial-gradient(circle at 58% 62%, rgba(51, 32, 28, 0.12) 0 2px, transparent 3px),
    linear-gradient(135deg, rgba(255, 79, 104, 0.07), rgba(47, 158, 68, 0.08));
  pointer-events: none;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 22px 54px rgba(133, 46, 35, 0.16);
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

.author-name {
  color: #2d211f;
}

.post-time {
  color: #8a736b;
}

.category-tag {
  background: #fff4e5;
  border: 1px solid rgba(255, 107, 107, 0.22);
  color: #d9485f;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.48);
}

.post-content {
  position: relative;
  z-index: 1;
}

.post-content p {
  color: #3a2a26;
  line-height: 1.75;
}

.expand-btn {
  color: #2f9e44;
  font-weight: 700;
}

.post-actions {
  position: relative;
  z-index: 1;
  border-top: 1px dashed rgba(133, 46, 35, 0.14);
}

.action-btn {
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.54);
  border: 1px solid transparent;
}

.action-btn:hover {
  background: #fff7ed;
  border-color: rgba(255, 107, 107, 0.18);
  color: #ff4f68;
}

.like-btn.liked {
  background: rgba(255, 79, 104, 0.1);
}

.watermelon-decor {
  bottom: -12px;
  right: 10px;
  opacity: 0.1;
  transform: rotate(-12deg);
}

.empty-state {
  min-height: 360px;
  margin: 16px;
  border: 1px dashed rgba(47, 158, 68, 0.34);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
}

@media screen and (min-width: 768px) {
  .post-list {
    padding: 18px;
    gap: 18px;
    width: 100%;
    max-width: none;
    margin: 0;
  }

  .post-card {
    border-radius: 8px;
    padding: 20px 24px;
  }
}

@media screen and (min-width: 1024px) {
  .post-list {
    padding: 18px;
    gap: 18px;
    width: 100%;
    max-width: none;
    margin: 0;
  }

  .post-card {
    border-radius: 8px;
    padding: 22px 26px;
  }
}
</style>
