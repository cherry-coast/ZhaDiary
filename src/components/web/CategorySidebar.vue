<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedCategories: {
    type: Array,
    default: () => []
  },
  allCategories: {
    type: Array,
    default: () => []
  },
  postCounts: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['toggleCategory'])

const defaultCategories = ['全部', '情感', '日常', '办公', '娱乐', '科技', '美食', '旅行', '其他']

const allAvailableCategories = computed(() => {
  const categories = [...new Set([...defaultCategories, ...props.allCategories])]
  return categories.sort((a, b) => {
    if (a === '全部') return -1
    if (b === '全部') return 1
    return a.localeCompare(b)
  })
})

const isSelected = (cat) => {
  if (cat === '全部') {
    return props.selectedCategories.length === 0
  }
  return props.selectedCategories.includes(cat)
}

const getPostCount = (cat) => {
  if (cat === '全部') {
    return Object.values(props.postCounts).reduce((sum, count) => sum + count, 0)
  }
  return props.postCounts[cat] || 0
}

const toggleCategory = (cat) => {
  if (cat === '全部') {
    emit('toggleCategory', [])
    return
  }
  
  const newSelection = isSelected(cat)
    ? props.selectedCategories.filter(c => c !== cat)
    : [...props.selectedCategories, cat]
    
  emit('toggleCategory', newSelection)
}
</script>

<template>
  <aside class="category-sidebar">
    <div class="sidebar-header">
      <h3 class="sidebar-title">
        <img src="/种类.svg" class="category-icon" alt="分类" />
        分类
      </h3>
    </div>
    
    <div class="category-tags">
      <button 
        v-for="cat in allAvailableCategories" 
        :key="cat"
        class="category-tag"
        :class="{ active: isSelected(cat) }"
        @click="toggleCategory(cat)"
      >
        <span class="tag-icon" v-if="cat === '全部'">📋</span>
        <span class="tag-icon" v-else-if="cat === '情感'">💔</span>
        <span class="tag-icon" v-else-if="cat === '日常'">📅</span>
        <span class="tag-icon" v-else-if="cat === '办公'">💼</span>
        <span class="tag-icon" v-else-if="cat === '娱乐'">🎬</span>
        <span class="tag-icon" v-else-if="cat === '科技'">🤖</span>
        <span class="tag-icon" v-else-if="cat === '美食'">🍜</span>
        <span class="tag-icon" v-else-if="cat === '旅行'">✈️</span>
        <span class="tag-text">{{ cat }}</span>
        <span class="tag-count">{{ getPostCount(cat) }}</span>
      </button>
    </div>
    
    <div class="sidebar-footer">
      <span v-if="selectedCategories.length > 0" class="selected-info">
        已选 {{ selectedCategories.length }} 个分类
      </span>
      <span v-else class="selected-info">
        全部 {{ getPostCount('全部') }} 个瓜
      </span>
    </div>
  </aside>
</template>

<style scoped>
.category-sidebar {
  width: 100%;
  background: #ffffff;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sidebar-header {
  margin-bottom: 16px;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  width: 20px;
  height: 20px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.category-tag:hover {
  background: #fff0f0;
  border-color: #ffd6d6;
}

.category-tag.active {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 169, 77, 0.15) 100%);
  border-color: #ff6b6b;
}

.tag-icon {
  font-size: 0.875rem;
  align-self: center;
  line-height: 1;
}

.tag-text {
  color: #333;
  align-self: center;
  line-height: 1;
}

.category-tag.active .tag-text {
  color: #ff6b6b;
  font-weight: 500;
}

.tag-count {
  font-size: 0.75rem;
  color: #999;
  background: #fff;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 24px;
  text-align: center;
  align-self: center;
  line-height: 1;
}

.category-tag.active .tag-count {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.sidebar-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.selected-info {
  font-size: 0.8125rem;
  color: #666;
}
.category-sidebar {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 250, 242, 0.82));
  border: 1px solid rgba(255, 255, 255, 0.86);
  border-radius: 8px;
  box-shadow: 0 18px 48px rgba(133, 46, 35, 0.11);
  backdrop-filter: blur(18px);
  padding: 16px;
  overflow: hidden;
}

.sidebar-header {
  padding-bottom: 14px;
  border-bottom: 1px dashed rgba(133, 46, 35, 0.14);
}

.sidebar-title {
  color: #2d211f;
  font-size: 1.08rem;
}

.category-icon {
  width: 24px;
  height: 24px;
}

.category-tags {
  flex: 1;
  overflow-y: auto;
  gap: 12px;
  padding-right: 4px;
}

.category-tag {
  width: 100%;
  justify-content: flex-start;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(133, 46, 35, 0.08);
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(133, 46, 35, 0.04);
}

.category-tag:hover {
  transform: translateX(3px);
  background: #fff7ed;
  border-color: rgba(255, 107, 107, 0.25);
}

.category-tag.active {
  background: linear-gradient(135deg, rgba(255, 79, 104, 0.14), rgba(47, 158, 68, 0.12));
  border-color: rgba(47, 158, 68, 0.36);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.56), 0 10px 24px rgba(47, 158, 68, 0.1);
}

.tag-icon {
  width: 24px;
  font-size: 1rem;
}

.tag-text {
  flex: 1;
  color: #3a2a26;
  font-weight: 600;
}

.category-tag.active .tag-text {
  color: #166534;
}

.tag-count {
  background: #fff4e5;
  color: #d9485f;
}

.sidebar-footer {
  border-top: 1px dashed rgba(133, 46, 35, 0.14);
}

.selected-info {
  color: #7b6a64;
}
</style>
