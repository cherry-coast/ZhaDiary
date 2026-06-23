<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  selectedCategories: {
    type: Array,
    default: () => []
  },
  allCategories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'confirm'])

const localSelected = ref([...props.selectedCategories])
const defaultCategories = ['情感', '日常', '办公', '娱乐', '科技', '美食', '旅行', '其他']

const allAvailableCategories = computed(() => {
  const categories = [...new Set([...defaultCategories, ...props.allCategories])]
  return categories.sort()
})

const selectCategory = (cat) => {
  const index = localSelected.value.indexOf(cat)
  if (index > -1) {
    localSelected.value.splice(index, 1)
  } else {
    localSelected.value.push(cat)
  }
}

const isSelected = (cat) => localSelected.value.includes(cat)

const selectAll = () => {
  localSelected.value = [...allAvailableCategories.value]
}

const clearAll = () => {
  localSelected.value = []
}

const handleConfirm = () => {
  emit('confirm', [...localSelected.value])
  emit('close')
}

const handleClose = () => {
  localSelected.value = [...props.selectedCategories]
  emit('close')
}
</script>

<template>
  <Transition name="modal">
    <div v-if="visible" class="category-modal-overlay" @click.self="handleClose">
      <div class="category-modal">
        <div class="modal-header">
          <h3 class="modal-title">🍉 选择分类</h3>
          <button class="close-btn" @click="handleClose">
            <svg viewBox="0 0 24 24" class="close-icon">
              <path 
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" 
                fill="#ff4f68"
              />
            </svg>
          </button>
        </div>
        
        <div class="modal-actions">
          <button class="action-btn" @click="selectAll">全选</button>
          <button class="action-btn" @click="clearAll">清除</button>
        </div>
        
        <div class="category-grid">
          <button 
            v-for="cat in allAvailableCategories" 
            :key="cat"
            class="category-item"
            :class="{ selected: isSelected(cat) }"
            @click="selectCategory(cat)"
          >
            <span class="category-name">{{ cat }}</span>
            <svg 
              v-if="isSelected(cat)" 
              viewBox="0 0 24 24" 
              class="check-icon"
            >
              <path 
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" 
                fill="#fff"
              />
            </svg>
          </button>
        </div>
        
        <div class="modal-footer">
          <button class="confirm-btn" @click="handleConfirm">
            确定 ({{ localSelected.length }})
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.category-modal-overlay {
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
  backdrop-filter: blur(4px);
}

.category-modal {
  width: 100%;
  max-width: 700px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  animation: slideUp 0.3s ease;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 1.125rem;
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
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #eee;
}

.close-icon {
  width: 18px;
  height: 18px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 20px;
  background: #f5f5f5;
  border: none;
  font-size: 0.875rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #ffe4e4;
  color: #ff6b6b;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  max-height: 40vh;
  overflow-y: auto;
}

.category-item {
  position: relative;
  padding: 10px 20px;
  border-radius: 24px;
  background: #f5f5f5;
  border: 2px solid transparent;
  font-size: 0.9375rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-item:hover {
  background: #ffe4e4;
  border-color: #ff6b6b;
}

.category-item.selected {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  border-color: transparent;
  color: #fff;
}

.category-name {
  font-weight: 500;
}

.check-icon {
  width: 16px;
  height: 16px;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.confirm-btn {
  width: 100%;
  padding: 14px;
  border-radius: 24px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%);
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.confirm-btn:active {
  transform: translateY(0);
}

@media screen and (min-width: 768px) {
  .category-modal-overlay {
    align-items: center;
  }
  
  .category-modal {
    max-width: 500px;
    border-radius: 8px;
    padding-bottom: 24px;
  }
  
  .modal-header {
    margin-bottom: 20px;
  }
  
  .modal-title {
    font-size: 1.375rem;
  }
  
  .category-item {
    padding: 12px 24px;
    font-size: 1rem;
  }
  
  .confirm-btn {
    padding: 16px;
    font-size: 1.125rem;
  }
}
.category-modal-overlay {
  background: rgba(45, 33, 31, 0.46);
}

.category-modal {
  background:
    radial-gradient(circle at 88% 8%, rgba(47, 158, 68, 0.12), transparent 28%),
    linear-gradient(180deg, #ffffff, #fff8ef);
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: 0 24px 70px rgba(45, 33, 31, 0.24);
}

.modal-header {
  padding-bottom: 14px;
  border-bottom: 1px dashed rgba(133, 46, 35, 0.14);
}

.modal-title {
  color: #2d211f;
}

.close-btn,
.action-btn {
  background: #fff4e5;
  border-radius: 8px;
}

.close-btn:hover {
  background: #ffe4e4;
  transform: scale(1.05);
}

.action-btn:hover {
  background: #f2fbef;
  color: #166534;
}

.category-item {
  background: rgba(255, 255, 255, 0.72);
  border-color: rgba(133, 46, 35, 0.08);
  color: #5d433c;
}

.category-item:hover {
  background: #fff4e5;
  border-color: rgba(47, 158, 68, 0.28);
}

.category-item.selected,
.confirm-btn {
  background: linear-gradient(135deg, #ff4f68 0%, #ffb347 58%, #2f9e44 100%);
}

.confirm-btn:hover {
  box-shadow: 0 12px 26px rgba(255, 79, 104, 0.22);
}
</style>
