<script setup>
import Header from '../../components/web/Header.vue'
import CategorySidebar from '../../components/web/CategorySidebar.vue'
import PostList from '../../components/common/PostList.vue'

defineProps({
  totalPosts: {
    type: Number,
    required: true
  },
  totalComments: {
    type: Number,
    required: true
  },
  allCategories: {
    type: Array,
    required: true
  },
  selectedCategories: {
    type: Array,
    required: true
  },
  filteredPosts: {
    type: Array,
    required: true
  },
  currentUser: {
    type: Object,
    default: null
  },
  postCounts: {
    type: Object,
    required: true
  }
})

defineEmits([
  'openPostForm',
  'search',
  'openLogin',
  'openProfile',
  'logout',
  'toggleCategory',
  'toggleLike',
  'viewDetail'
])
</script>

<template>
  <div class="desktop-layout">
    <Header 
      :totalPosts="totalPosts" 
      :totalComments="totalComments"
      :categories="allCategories"
      :selectedCategories="selectedCategories"
      :filteredCount="filteredPosts.length"
      :currentUser="currentUser"
      @openPostForm="$emit('openPostForm')"
      @search="query => $emit('search', query)"
      @openLogin="$emit('openLogin')"
      @openProfile="$emit('openProfile')"
      @logout="$emit('logout')"
    />
    
    <div class="desktop-body">
      <aside class="desktop-sidebar">
        <CategorySidebar 
          :selectedCategories="selectedCategories"
          :allCategories="allCategories"
          :postCounts="postCounts"
          @toggleCategory="categories => $emit('toggleCategory', categories)"
        />
      </aside>
      
      <div class="desktop-content">
        <main class="main-content">
          <PostList 
            :posts="filteredPosts"
            @toggleLike="post => $emit('toggleLike', post)"
            @viewDetail="post => $emit('viewDetail', post)"
          />
        </main>
        
        <div class="mock-data-note">
          当前使用本地模拟数据，接口接入后再启用分页加载。
        </div>
        
        <button class="desktop-post-btn" @click="$emit('openPostForm')">
          <svg viewBox="0 0 32 32" class="watermelon-icon">
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
        </button>
      </div>
    </div>
  </div>
</template>
