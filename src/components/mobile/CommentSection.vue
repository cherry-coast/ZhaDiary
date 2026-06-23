<script setup>
import { ref } from 'vue'

defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['addComment', 'close'])

const commentContent = ref('')
const isSubmitting = ref(false)

const handleSubmit = () => {
  if (!commentContent.value.trim()) return
  
  isSubmitting.value = true
  
  setTimeout(() => {
    emit('addComment', post.id, commentContent.value.trim())
    commentContent.value = ''
    isSubmitting.value = false
  }, 300)
}
</script>

<template>
  <div class="comment-overlay" @click.self="emit('close')">
    <div class="comment-section animate-slide-up">
      <div class="comment-header">
        <button class="back-btn" @click="emit('close')">
          <svg viewBox="0 0 24 24" class="back-icon">
            <path 
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" 
              fill="#333"
            />
          </svg>
        </button>
        <span class="comment-title">评论</span>
        <span class="comment-count">{{ post.comments.length }}</span>
      </div>
      
      <div class="original-post">
        <div class="post-avatar">
          <span>{{ post.avatar }}</span>
        </div>
        <div class="post-info">
          <span class="post-author">{{ post.author }}</span>
          <p class="post-text">{{ post.content }}</p>
        </div>
      </div>
      
      <div class="comment-list">
        <div 
          v-for="(comment, index) in post.comments" 
          :key="comment.id" 
          class="comment-item animate-slide-up"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="comment-avatar">
            <span>💬</span>
          </div>
          <div class="comment-body">
            <div class="comment-body-header">
              <span class="comment-author">{{ comment.author }}</span>
              <button class="comment-like-btn">
                <svg viewBox="0 0 24 24" class="like-icon">
                  <path 
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                    fill="#ccc"
                  />
                </svg>
                <span class="like-count">{{ comment.likes }}</span>
              </button>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
        </div>
        
        <div v-if="post.comments.length === 0" class="no-comments">
          <span class="no-comment-icon">🍉</span>
          <p>还没有评论，快来抢沙发！</p>
        </div>
      </div>
      
      <div class="comment-input-wrapper">
        <input 
          v-model="commentContent"
          type="text" 
          class="comment-input"
          placeholder="发表你的看法..."
          maxlength="200"
          @keyup.enter="handleSubmit"
        />
        <button 
          class="send-btn" 
          :disabled="!commentContent.trim() || isSubmitting"
          @click="handleSubmit"
        >
          <svg viewBox="0 0 24 24" class="send-icon">
            <path 
              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" 
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      
      <div class="mole-decoration">
        <span class="mole">🐹</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-overlay {
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
  backdrop-filter: blur(4px);
}

.comment-section {
  background: #fff;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
  position: relative;
  overflow: hidden;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  padding-top: calc(16px + env(safe-area-inset-top));
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.back-btn:hover {
  background: #eee;
}

.back-btn:active {
  transform: scale(0.95);
}

.back-icon {
  width: 18px;
  height: 18px;
}

.comment-title {
  flex: 1;
  font-size: 1.125rem;
  font-weight: bold;
  color: #333;
}

.comment-count {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
}

.original-post {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: #fff5f5;
  border-bottom: 1px solid #ffe4e4;
}

.post-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.post-info {
  flex: 1;
  overflow: hidden;
}

.post-author {
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
}

.post-text {
  margin: 4px 0 0 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comment-list {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
  background: #f8f9fa;
  border-radius: 14px;
  padding: 10px 12px;
}

.comment-body-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comment-author {
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
}

.comment-like-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  touch-action: manipulation;
}

.comment-like-btn:hover {
  background: #fff;
}

.like-icon {
  width: 14px;
  height: 14px;
}

.like-count {
  font-size: 0.75rem;
  color: #999;
}

.comment-text {
  margin: 0;
  font-size: 0.875rem;
  color: #333;
  line-height: 1.5;
  word-break: break-word;
}

.no-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
}

.no-comment-icon {
  font-size: 44px;
  margin-bottom: 10px;
  animation: bounce 2s ease-in-out infinite;
}

.no-comments p {
  color: #999;
  font-size: 0.875rem;
  margin: 0;
}

.comment-input-wrapper {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid #f0f0f0;
  padding-bottom: calc(14px + env(safe-area-inset-bottom));
}

.comment-input {
  flex: 1;
  border: 2px solid #f0f0f0;
  border-radius: 22px;
  padding: 10px 16px;
  font-size: 0.9375rem;
  outline: none;
  transition: all 0.3s ease;
}

.comment-input:focus {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.comment-input::placeholder {
  color: #bbb;
}

.send-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  width: 18px;
  height: 18px;
  color: #fff;
}

.mole-decoration {
  position: absolute;
  bottom: 120px;
  right: -15px;
  opacity: 0.05;
}

.mole {
  font-size: 100px;
}

@media screen and (min-width: 768px) {
  .comment-section {
    max-width: 700px;
    border-radius: 28px 28px 0 0;
  }
  
  .comment-header {
    padding: 20px;
    padding-top: 20px;
  }
  
  .back-btn {
    width: 44px;
    height: 44px;
  }
  
  .back-icon {
    width: 20px;
    height: 20px;
  }
  
  .comment-title {
    font-size: 1.25rem;
  }
  
  .comment-count {
    padding: 6px 14px;
    font-size: 1rem;
  }
  
  .original-post {
    padding: 18px 20px;
    gap: 14px;
  }
  
  .post-avatar {
    width: 48px;
    height: 48px;
    font-size: 1.375rem;
  }
  
  .post-author {
    font-size: 1rem;
  }
  
  .post-text {
    font-size: 1rem;
  }
  
  .comment-list {
    padding: 18px 20px;
    gap: 18px;
  }
  
  .comment-avatar {
    width: 44px;
    height: 44px;
    font-size: 1.25rem;
  }
  
  .comment-body {
    border-radius: 18px;
    padding: 14px 16px;
  }
  
  .comment-author {
    font-size: 1rem;
  }
  
  .like-icon {
    width: 16px;
    height: 16px;
  }
  
  .like-count {
    font-size: 0.875rem;
  }
  
  .comment-text {
    font-size: 1rem;
  }
  
  .no-comments {
    padding: 40px 20px;
  }
  
  .no-comment-icon {
    font-size: 56px;
    margin-bottom: 14px;
  }
  
  .no-comments p {
    font-size: 1rem;
  }
  
  .comment-input-wrapper {
    padding: 18px 20px;
    gap: 14px;
  }
  
  .comment-input {
    padding: 12px 20px;
    font-size: 1rem;
    border-radius: 24px;
  }
  
  .send-btn {
    width: 48px;
    height: 48px;
  }
  
  .send-icon {
    width: 20px;
    height: 20px;
  }
  
  .mole {
    font-size: 130px;
  }
}

@media screen and (min-width: 1024px) {
  .comment-overlay {
    align-items: center;
  }
  
  .comment-section {
    max-width: 600px;
    border-radius: 28px;
    padding-bottom: 20px;
  }
  
  .comment-header {
    padding-top: 20px;
  }
}

@media screen and (max-width: 320px) {
  .comment-header {
    padding: 12px;
    padding-top: calc(12px + env(safe-area-inset-top));
    gap: 10px;
  }
  
  .back-btn {
    width: 36px;
    height: 36px;
  }
  
  .back-icon {
    width: 16px;
    height: 16px;
  }
  
  .comment-title {
    font-size: 1rem;
  }
  
  .comment-count {
    padding: 3px 10px;
    font-size: 0.75rem;
  }
  
  .original-post {
    padding: 12px;
    gap: 10px;
  }
  
  .post-avatar {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .post-author {
    font-size: 0.75rem;
  }
  
  .post-text {
    font-size: 0.75rem;
  }
  
  .comment-list {
    padding: 12px;
    gap: 12px;
  }
  
  .comment-avatar {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }
  
  .comment-body {
    border-radius: 12px;
    padding: 8px 10px;
  }
  
  .comment-author {
    font-size: 0.75rem;
  }
  
  .like-icon {
    width: 12px;
    height: 12px;
  }
  
  .like-count {
    font-size: 0.625rem;
  }
  
  .comment-text {
    font-size: 0.75rem;
  }
  
  .no-comments {
    padding: 24px 15px;
  }
  
  .no-comment-icon {
    font-size: 36px;
    margin-bottom: 8px;
  }
  
  .no-comments p {
    font-size: 0.75rem;
  }
  
  .comment-input-wrapper {
    padding: 12px;
    gap: 8px;
  }
  
  .comment-input {
    padding: 8px 14px;
    font-size: 0.875rem;
    border-radius: 20px;
  }
  
  .send-btn {
    width: 38px;
    height: 38px;
  }
  
  .send-icon {
    width: 16px;
    height: 16px;
  }
  
  .mole {
    font-size: 80px;
  }
}
.comment-overlay {
  background: rgba(45, 33, 31, 0.46);
}

.comment-section {
  background:
    radial-gradient(circle at 90% 10%, rgba(47, 158, 68, 0.1), transparent 26%),
    linear-gradient(180deg, #ffffff, #fff8ef);
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: 0 24px 70px rgba(45, 33, 31, 0.24);
}

.comment-header {
  border-bottom: 1px dashed rgba(133, 46, 35, 0.14);
}

.back-btn {
  background: #fff4e5;
  border-radius: 8px;
}

.comment-count,
.send-btn {
  background: linear-gradient(135deg, #ff4f68 0%, #ffb347 58%, #2f9e44 100%);
}

.original-post {
  background: rgba(255, 244, 229, 0.7);
  border-bottom: 1px dashed rgba(133, 46, 35, 0.14);
}

.post-avatar {
  background: radial-gradient(circle at 35% 30%, #fff7a8 0 16%, #ff5d73 17% 55%, #2f9e44 56% 100%);
  border: 3px solid #fff;
}

.comment-body {
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(133, 46, 35, 0.08);
}

.comment-input {
  background: rgba(255, 255, 255, 0.78);
  border-color: rgba(133, 46, 35, 0.12);
  border-radius: 8px;
}

.comment-input:focus {
  border-color: #2f9e44;
  box-shadow: 0 0 0 4px rgba(47, 158, 68, 0.12);
}
</style>
  border-radius: 8px;
