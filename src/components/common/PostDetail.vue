<script setup>
import { ref } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'addComment'])

const newComment = ref('')

const addComment = () => {
  if (!newComment.value.trim()) return
  
  emit('addComment', props.post.id, newComment.value.trim())
  newComment.value = ''
}

const handleKeyup = (e) => {
  if (e.key === 'Enter') {
    addComment()
  }
}
</script>

<template>
  <div class="detail-overlay" @click.self="emit('close')">
    <div class="detail-modal animate-slide-up">
      <div class="detail-header">
        <h2 class="detail-title">帖子详情</h2>
        <button class="close-btn" @click="emit('close')">
          <svg viewBox="0 0 24 24" class="close-icon">
            <path 
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" 
              fill="#ff4f68"
            />
          </svg>
        </button>
      </div>
      
      <div class="detail-content">
        <div class="post-header">
          <div class="avatar-wrapper">
            <span class="avatar">{{ post.avatar }}</span>
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
          <p>{{ post.content }}</p>
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
        
        <div class="post-stats">
          <div class="stat-row">
            <span class="stat-icon">❤️</span>
            <span class="stat-text">{{ post.likes }} 点赞</span>
          </div>
          <div class="stat-row">
            <span class="stat-icon">💬</span>
            <span class="stat-text">{{ post.comments.length }} 评论</span>
          </div>
        </div>
        
        <div class="comments-section">
          <h3 class="comments-title">评论 ({{ post.comments.length }})</h3>
          
          <div v-if="post.comments.length === 0" class="empty-comments">
            <p>还没有评论，快来抢沙发！</p>
          </div>
          
          <div v-else class="comments-list">
            <div 
              v-for="comment in post.comments" 
              :key="comment.id" 
              class="comment-item"
            >
              <div class="comment-avatar">💬</div>
              <div class="comment-content">
                <div class="comment-author">{{ comment.author }}</div>
                <div class="comment-text">{{ comment.content }}</div>
                <div class="comment-likes">❤️ {{ comment.likes }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="comment-input-area">
        <input 
          v-model="newComment"
          type="text" 
          class="comment-input"
          placeholder="写下你的评论..."
          @keyup="handleKeyup"
        />
        <button 
          class="comment-submit-btn" 
          :disabled="!newComment.trim()"
          @click="addComment"
        >
          <svg viewBox="0 0 24 24" class="send-icon">
            <path 
              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" 
              fill="#fff"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.detail-modal {
  width: 100%;
  max-width: 700px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: transparent;
  border-bottom: 1px dashed rgba(133, 46, 35, 0.14);
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #fff4e5;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #ffe4e4;
  transform: scale(1.05);
}

.close-icon {
  width: 20px;
  height: 20px;
}

.detail-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d211f;
  margin: 0;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 12px;
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
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
  margin-left: auto;
}

.category-tag {
  display: inline-block;
  padding: 4px 14px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  color: #fff;
  font-size: 0.75rem;
  border-radius: 20px;
  font-weight: 500;
}

.post-content {
  margin-bottom: 16px;
}

.post-content p {
  color: #333;
  line-height: 1.7;
  font-size: 1rem;
  margin: 0;
  word-break: break-word;
}

.post-images {
  margin-bottom: 16px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.image-item {
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: #f5f5f5;
}

.image-item.single {
  grid-column: span 3;
  max-height: 400px;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-stats {
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  font-size: 1rem;
}

.stat-text {
  font-size: 0.875rem;
  color: #666;
}

.comments-section {
  margin-bottom: 0;
}

.comments-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.empty-comments {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.empty-comments p {
  font-size: 0.875rem;
  color: #999;
  margin: 0;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-author {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.comment-text {
  font-size: 0.9375rem;
  color: #333;
  line-height: 1.5;
  word-break: break-word;
}

.comment-likes {
  font-size: 0.75rem;
  color: #ff6b6b;
  margin-top: 6px;
}

.comment-input-area {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.comment-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 24px;
  font-size: 0.9375rem;
  outline: none;
  transition: all 0.2s ease;
}

.comment-input:focus {
  border-color: #ff6b6b;
}

.comment-input::placeholder {
  color: #999;
}

.comment-submit-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0 0 2px; /* Reset browser padding and offset 2px to the right for optical centering */
  line-height: 1;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.comment-submit-btn:hover:not(:disabled) {
  transform: scale(1.05) translateY(-1px);
  box-shadow: 0 6px 16px rgba(255, 79, 104, 0.35);
}

.comment-submit-btn:active:not(:disabled) {
  transform: scale(0.95) translateY(0);
}

.comment-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  width: 18px;
  height: 18px;
  display: block;
  transition: transform 0.25s ease;
}

.comment-submit-btn:hover:not(:disabled) .send-icon {
  transform: translate(2px, -2px) scale(1.05);
}

@media screen and (min-width: 768px) {
  .detail-modal {
    border-radius: 8px 8px 0 0;
  }
  
  .detail-header {
    padding: 20px 24px;
  }
  
  .close-btn {
    width: 40px;
    height: 40px;
  }
  
  .close-icon {
    width: 22px;
    height: 22px;
  }
  
  .detail-title {
    font-size: 1.25rem;
  }
  
  .detail-content {
    padding: 24px;
    padding-bottom: 12px;
  }
  
  .avatar {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }
  
  .author-name {
    font-size: 1.125rem;
  }
  
  .post-time {
    font-size: 0.875rem;
  }
  
  .category-tag {
    padding: 5px 18px;
    font-size: 0.875rem;
  }
  
  .post-content p {
    font-size: 1.125rem;
    line-height: 1.8;
  }
  
  .image-grid {
    gap: 12px;
  }
  
  .image-item {
    border-radius: 20px;
  }
  
  .image-item.single {
    max-height: 500px;
  }
  
  .post-stats {
    gap: 32px;
    padding: 16px 0;
  }
  
  .stat-icon {
    font-size: 1.125rem;
  }
  
  .stat-text {
    font-size: 1rem;
  }
  
  .comments-title {
    font-size: 1.125rem;
    margin-bottom: 16px;
  }
  
  .comment-item {
    padding: 16px;
    gap: 14px;
  }
  
  .comment-avatar {
    width: 44px;
    height: 44px;
    font-size: 1.25rem;
  }
  
  .comment-author {
    font-size: 0.9375rem;
  }
  
  .watermelon-slice {
    font-size: 80px;
  }
  
  .comment-text {
    font-size: 1rem;
  }
  
  .comment-likes {
    font-size: 0.8125rem;
  }
  
  .comment-input-area {
    padding: 16px 24px;
    padding-bottom: 16px;
  }
  
  .comment-input {
    padding: 14px 20px;
    font-size: 1rem;
    border-radius: 28px;
  }
  
  .comment-submit-btn {
    width: 48px;
    height: 48px;
  }
  
  .send-icon {
    width: 20px;
    height: 20px;
  }
}

@media screen and (min-width: 1024px) {
  .detail-overlay {
    align-items: center;
  }
  
  .detail-modal {
    max-width: 600px;
    border-radius: 8px;
    max-height: 80vh;
  }
}
.detail-overlay {
  background: rgba(45, 33, 31, 0.46);
  backdrop-filter: blur(4px);
}

.detail-modal {
  background:
    radial-gradient(circle at 90% 8%, rgba(47, 158, 68, 0.1), transparent 26%),
    linear-gradient(180deg, #ffffff, #fff8ef);
  border: none;
  box-shadow: 0 24px 70px rgba(45, 33, 31, 0.24);
}



.avatar {
  background: radial-gradient(circle at 35% 30%, #fff7a8 0 16%, #ff5d73 17% 55%, #2f9e44 56% 100%);
  border: 2px solid #ffffff;
  box-shadow: 
    0 0 0 1px rgba(255, 79, 104, 0.25),
    0 4px 10px rgba(133, 46, 35, 0.08);
}

.category-tag {
  background: #fff4e5;
  border: 1px solid rgba(255, 107, 107, 0.22);
  color: #d9485f;
  border-radius: 6px;
}

.post-stats {
  border-top: 1px dashed rgba(133, 46, 35, 0.14);
  border-bottom: 1px dashed rgba(133, 46, 35, 0.14);
}

.empty-comments,
.comment-item {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(133, 46, 35, 0.08);
  border-radius: 8px;
}

.comment-avatar {
  background: linear-gradient(135deg, #ff4f68 0%, #ffb347 58%, #2f9e44 100%);
}

.comment-submit-btn {
  background: #ff4f68;
  box-shadow: 0 4px 12px rgba(255, 79, 104, 0.25);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.comment-submit-btn:hover:not(:disabled) {
  background: #e03b53;
}

.comment-input {
  background: rgba(255, 255, 255, 0.78);
  border-color: rgba(133, 46, 35, 0.12);
  border-radius: 8px;
}

.comment-input:focus {
  border-color: #2f9e44;
}
</style>
