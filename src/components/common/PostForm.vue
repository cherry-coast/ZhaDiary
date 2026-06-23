<script setup>import { ref, computed } from 'vue';
import RichTextEditor from './RichTextEditor.vue';
const props = defineProps({
 categories: {
 type: Array,
 default: () => []
 }
});
const emit = defineEmits(['submit', 'close']);
const content = ref('');
const editorRef = ref(null);

const textContentLength = computed(() => {
  return content.value.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').length;
});

const handleInput = (e) => {
  content.value = e.target.innerHTML;
};

const isFullScreen = ref(false);

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
};

const selectedCategories = ref([]);
const customCategory = ref('');
const isSubmitting = ref(false);
const showCustomCategory = ref(false);
const defaultCategories = ['情感', '日常', '办公', '娱乐', '科技', '美食', '旅行', '其他'];
const allCategories = [...defaultCategories, ...props.categories];

const selectedMelonIndex = ref(null);
const selectMelon = (index) => {
  if (selectedMelonIndex.value === index) {
    selectedMelonIndex.value = null;
  } else {
    selectedMelonIndex.value = index;
  }
};

const melons = [
  `<svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#40c057"/><circle cx="12" cy="12" r="8.5" fill="#ffffff"/><circle cx="12" cy="12" r="7.5" fill="#ff4f68"/><circle cx="12" cy="8" r="0.8" fill="#2d211f"/><circle cx="9" cy="13" r="0.8" fill="#2d211f"/><circle cx="15" cy="13" r="0.8" fill="#2d211f"/><circle cx="10.5" cy="10" r="0.8" fill="#2d211f"/><circle cx="13.5" cy="10" r="0.8" fill="#2d211f"/><circle cx="12" cy="15" r="0.8" fill="#2d211f"/></svg>`,
  `<svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-10 12 12)"><path d="M 2 12 A 10 10 0 0 0 22 12 Z" fill="#40c057"/><path d="M 3.5 12 A 8.5 8.5 0 0 0 20.5 12 Z" fill="#ffffff"/><path d="M 4.5 12 A 7.5 7.5 0 0 0 19.5 12 Z" fill="#ff4f68"/><circle cx="9" cy="15" r="0.8" fill="#2d211f"/><circle cx="15" cy="15" r="0.8" fill="#2d211f"/><circle cx="12" cy="17" r="0.8" fill="#2d211f"/></g></svg>`,
  `<svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(15 12 12)"><path d="M 12 12 L 3.34 17 A 10 10 0 0 0 20.66 17 Z" fill="#40c057"/><path d="M 12 12 L 4.64 16.25 A 8.5 8.5 0 0 0 19.36 16.25 Z" fill="#ffffff"/><path d="M 12 12 L 5.5 15.75 A 7.5 7.5 0 0 0 18.5 15.75 Z" fill="#ff4f68"/><circle cx="12" cy="16.5" r="0.8" fill="#2d211f"/><circle cx="9.5" cy="14.5" r="0.8" fill="#2d211f"/><circle cx="14.5" cy="14.5" r="0.8" fill="#2d211f"/></g></svg>`,
  `<svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-20 12 12)"><path d="M 12 12 L 4.93 19.07 A 10 10 0 0 0 19.07 19.07 Z" fill="#40c057"/><path d="M 12 12 L 5.99 18.01 A 8.5 8.5 0 0 0 18.01 18.01 Z" fill="#ffffff"/><path d="M 12 12 L 6.7 17.3 A 7.5 7.5 0 0 0 17.3 17.3 Z" fill="#ff4f68"/><circle cx="12" cy="17.5" r="0.8" fill="#2d211f"/><circle cx="9.5" cy="16" r="0.8" fill="#2d211f"/><circle cx="14.5" cy="16" r="0.8" fill="#2d211f"/></g></svg>`
];
const handleSubmit = () => {
  if (!textContentLength.value)
    return;
  
  const cats = [...selectedCategories.value];
  if (showCustomCategory.value && customCategory.value.trim()) {
    cats.push(customCategory.value.trim());
  }
  
  const category = cats.join('、');
  
  isSubmitting.value = true;
  setTimeout(() => {
    emit('submit', {
      content: content.value,
      category,
      melonStyle: selectedMelonIndex.value
    });
    content.value = '';
    selectedCategories.value = [];
    customCategory.value = '';
    showCustomCategory.value = false;
    selectedMelonIndex.value = null;
    isSubmitting.value = false;
  }, 500);
};
const selectCategory = (cat) => {
  if (cat === '自定义') {
    showCustomCategory.value = !showCustomCategory.value;
    if (!showCustomCategory.value) {
      customCategory.value = '';
    }
  } else {
    const idx = selectedCategories.value.indexOf(cat);
    if (idx > -1) {
      selectedCategories.value.splice(idx, 1);
    } else {
      selectedCategories.value.push(cat);
    }
  }
};
</script>

<template>
  <div class="post-form-overlay" @click.self="emit('close')">
    <div class="post-form animate-slide-up">
      <div class="form-header">
        <h2 class="form-title">🍉 发个瓜</h2>
        <button class="close-btn" @click="emit('close')">
          <svg viewBox="0 0 24 24" class="close-icon">
            <path 
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" 
              fill="#ff4f68"
            />
          </svg>
        </button>
      </div>
      
      <div class="form-body-scroll">
      
      <div class="category-section">
        <p class="category-label">选择分类</p>
        <div class="category-picker">
          <button 
            v-for="cat in [...new Set(allCategories), '自定义']" 
            :key="cat"
            class="category-item"
            :class="{ active: selectedCategories.includes(cat) || (cat === '自定义' && showCustomCategory) }"
            @click="selectCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
        <input 
          v-if="showCustomCategory"
          v-model="customCategory"
          type="text"
          class="custom-category-input"
          placeholder="输入自定义分类"
          maxlength="10"
          @keyup.enter="content && handleSubmit()"
        />
      </div>
      
      <div class="editor-wrapper" :class="{ 'fullscreen-wrapper': isFullScreen }">
        <div class="editor-header-controls">
          <button class="fullscreen-btn" @click="toggleFullScreen" title="全屏富文本编辑">
            <svg v-if="!isFullScreen" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
            <span v-if="isFullScreen" class="fullscreen-text">退出全屏</span>
          </button>
        </div>
        <RichTextEditor 
          v-model="content"
          :isFullScreen="isFullScreen"
        />
        <span v-if="!isFullScreen" class="char-count-overlay">{{ textContentLength }}/500</span>
        
        <!-- Action buttons in fullscreen mode -->
        <div v-if="isFullScreen" class="fullscreen-actions">
          <span class="char-count">{{ textContentLength }}/500</span>
          <button class="cancel-btn" @click="toggleFullScreen">缩小</button>
          <button 
          class="submit-btn" 
          :disabled="(!textContentLength && images.length === 0) || isSubmitting"
          @click="handleSubmit"
        >
          <span>{{ isSubmitting ? '发布中...' : '发布瓜' }}</span>
          <svg v-if="!isSubmitting" viewBox="0 0 24 24" class="send-icon">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      </div>
      
      <!-- image upload section removed -->
      
      <div class="form-footer">
        <div class="emoji-picker">
          <button 
            v-for="(svg, index) in melons" 
            :key="index"
            class="emoji-item melon-style-btn"
            :class="{ active: selectedMelonIndex === index }"
            @click="selectMelon(index)"
            v-html="svg"
          >
          </button>
        </div>
        
        <button 
          class="submit-btn" 
          :disabled="!textContentLength || isSubmitting"
          @click="handleSubmit"
        >
          <span>{{ isSubmitting ? '发布中...' : '发布瓜' }}</span>
          <svg v-if="!isSubmitting" viewBox="0 0 24 24" class="send-icon">
            <path 
              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" 
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-form-overlay {
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

.post-form {
  background: #fff;
  width: 100%;
  max-width: 600px;
  border-radius: 8px 8px 0 0;
  animation: slideUp 0.3s ease;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 16px 20px;
  flex-shrink: 0;
  background: transparent;
  z-index: 10;
}

.form-body-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 14px 20px 20px 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

.form-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.close-btn {
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
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.close-btn:hover {
  background: #eee;
}

.close-btn:active {
  transform: scale(0.95);
}

.close-icon {
  width: 18px;
  height: 18px;
}

.category-section {
  margin-bottom: 14px;
}

.category-label {
  font-size: 0.875rem;
  color: #666;
  margin: 0 0 8px 0;
}

.category-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.category-item {
  padding: 6px 14px;
  border-radius: 20px;
  background: #f5f5f5;
  border: none;
  font-size: 0.875rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.category-item:hover {
  background: #ffe4e4;
}

.category-item.active {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  color: #fff;
}

.custom-category-input {
  width: 100%;
  border: 2px solid #ff6b6b;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  outline: none;
}

.custom-category-input:focus {
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.editor-wrapper {
  position: relative;
  margin-bottom: 14px;
}

.fullscreen-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #fff;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.editor-header-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10001;
}

.fullscreen-wrapper .editor-header-controls {
  top: 0;
  right: 16px;
  height: 41px;
  display: flex;
  align-items: center;
}

.fullscreen-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid #e8e0de;
  border-radius: 6px;
  padding: 6px 10px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.fullscreen-btn:hover {
  background: #fbf9f8;
  color: #ff4f68;
  border-color: #ff4f68;
}

.fullscreen-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.fullscreen-actions {
  position: absolute;
  bottom: 16px;
  right: 24px;
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 16px;
}

.cancel-btn {
  background: #f5f5f5;
  border: none;
  border-radius: 24px;
  padding: 10px 24px;
  color: #666;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #e8e0de;
}

.image-upload-section {
  margin-bottom: 14px;
}

.upload-btn-wrapper {
  margin-bottom: 12px;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
}

.upload-btn:hover {
  border-color: #ff6b6b;
  background: #fff5f5;
}

.file-input {
  display: none;
}

.upload-icon {
  width: 20px;
  height: 20px;
}

.upload-text {
  font-size: 0.875rem;
  color: #666;
}

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
}

.image-preview-item {
  position: relative;
  width: calc(33.333% - 7px);
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  background: rgba(0,0,0,0.8);
}

.remove-icon {
  width: 14px;
  height: 14px;
}

.image-count {
  font-size: 0.75rem;
  color: #999;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  gap: 12px;
}

.char-count {
  font-size: 0.875rem;
  color: #999;
  flex-shrink: 0;
}

.emoji-picker {
  display: flex;
  gap: 6px;
}

.emoji-item {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.emoji-item:hover {
  transform: scale(1.15);
  background: #ffe4e4;
}

.emoji-item:active {
  transform: scale(0.95);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ff4f68;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 24px;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 79, 104, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  width: 18px;
  height: 18px;
  display: block;
  transition: transform 0.25s ease;
}

.submit-btn:hover:not(:disabled) .send-icon {
  transform: translate(2px, -2px) scale(1.05);
}

@media screen and (min-width: 768px) {
  .post-form {
    max-width: 700px;
    border-radius: 8px 8px 0 0;
  }
  
  .form-header {
    padding: 28px 28px 22px 28px;
  }
  
  .form-body-scroll {
    padding: 14px 28px 2px 28px;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .close-btn {
    width: 44px;
    height: 44px;
  }
  
  .close-icon {
    width: 20px;
    height: 20px;
  }
  
  .post-input {
    padding: 18px 20px;
    font-size: 1rem;
    min-height: 120px;
    border-radius: 8px;
  }
  
  .form-footer {
    margin-top: 18px;
    gap: 16px;
  }
  
  .char-count {
    font-size: 1rem;
  }
  
  .emoji-picker {
    gap: 10px;
  }
  
  .emoji-item {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  .submit-btn {
    padding: 12px 28px;
    font-size: 1rem;
    border-radius: 24px;
  }
  
  .send-icon {
    width: 20px;
    height: 20px;
  }
}

@media screen and (min-width: 1024px) {
  .post-form-overlay {
    align-items: center;
  }
  
  .post-form {
    max-width: 600px;
    border-radius: 8px;
    padding-bottom: 28px;
    max-height: 80vh;
  }
}

@media screen and (max-width: 320px) {
  .post-form {
    border-radius: 8px 8px 0 0;
  }
  
  .form-header {
    padding: 16px 16px 12px 16px;
  }
  
  .form-body-scroll {
    padding: 14px 16px 16px 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }
  
  .form-title {
    font-size: 1.125rem;
  }
  
  .close-btn {
    width: 36px;
    height: 36px;
  }
  
  .close-icon {
    width: 16px;
    height: 16px;
  }
  
  .post-input {
    padding: 12px;
    font-size: 0.875rem;
    min-height: 80px;
    border-radius: 8px;
  }
  
  .form-footer {
    margin-top: 12px;
    gap: 8px;
  }
  
  .char-count {
    font-size: 0.75rem;
  }
  
  .emoji-picker {
    gap: 4px;
  }
  
  .emoji-item {
    width: 30px;
    height: 30px;
    font-size: 0.875rem;
  }
  
  .submit-btn {
    padding: 8px 16px;
    font-size: 0.875rem;
    border-radius: 8px;
  }
}
.post-form-overlay {
  background: rgba(45, 33, 31, 0.46);
}

.post-form {
  background:
    radial-gradient(circle at 90% 8%, rgba(47, 158, 68, 0.12), transparent 26%),
    linear-gradient(180deg, #ffffff 0%, #fff8ef 100%);
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: 0 24px 70px rgba(45, 33, 31, 0.24);
}

.form-header {
  border-bottom: 1px dashed rgba(133, 46, 35, 0.14);
}

.form-body-scroll::-webkit-scrollbar {
  width: 4px;
}
.form-body-scroll::-webkit-scrollbar-track {
  background: transparent;
  margin: 10px 0;
}
.form-body-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 79, 104, 0.2);
  border-radius: 4px;
}
.form-body-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 79, 104, 0.4);
}

.form-title {
  color: #2d211f;
}

.close-btn {
  background: #fff4e5;
  border-radius: 8px;
}

.close-btn:hover {
  background: #ffe4e4;
  transform: scale(1.05);
}

.category-label {
  color: #7b6a64;
  font-weight: 700;
}

.category-item {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(133, 46, 35, 0.1);
  color: #5d433c;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-item:hover {
  background: #fff4e5;
  border-color: #ff6b6b;
  transform: translateY(-1px);
}

.category-item.active {
  background: #8e807a !important;
  color: #fff !important;
  border-color: transparent !important;
  box-shadow: 0 6px 14px rgba(142, 128, 122, 0.25);
}

.submit-btn {
  background: #ff4f68;
  border-radius: 24px;
}

.custom-category-input {
  background: rgba(255, 255, 255, 0.76);
  border-color: rgba(133, 46, 35, 0.12);
  border-radius: 8px;
}

.custom-category-input:focus {
  border-color: #ff4f68;
  box-shadow: 0 0 0 4px rgba(255, 79, 104, 0.1);
}

.upload-btn {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(47, 158, 68, 0.28);
  border-radius: 8px;
}

.upload-btn:hover {
  background: #f2fbef;
  border-color: #2f9e44;
}

.emoji-item {
  background: #fff4e5;
  border-radius: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: #e03b53;
  box-shadow: 0 12px 26px rgba(255, 79, 104, 0.35);
}

.melon-style-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  font-size: 1.5rem !important;
}

.melon-style-btn.active {
  border-color: #ff4f68;
  background: #ffe4e4;
  transform: scale(1.1);
}

.char-count-overlay {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 0.75rem;
  color: #c4b9b5;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.7);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
