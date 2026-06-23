<script setup>
import { computed } from 'vue'
import PostList from '../../components/common/PostList.vue'
import BottomNav from '../../components/mobile/BottomNav.vue'

const props = defineProps({
  feedTitle: {
    type: String,
    required: true
  },
  mobileSearchQuery: {
    type: String,
    required: true
  },
  filteredPosts: {
    type: Array,
    required: true
  },
  selectedCategories: {
    type: Array,
    required: true
  },
  totalPosts: {
    type: Number,
    required: true
  },
  hasActiveFilters: {
    type: Boolean,
    required: true
  },
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'update:mobileSearchQuery',
  'submitMobileSearch',
  'toggleLike',
  'viewDetail',
  'resetHome',
  'openCategory',
  'openPostForm',
  'openLogin',
  'openProfile'
])

const localSearchQuery = computed({
  get: () => props.mobileSearchQuery,
  set: (val) => emit('update:mobileSearchQuery', val)
})
</script>

<template>
  <div class="mobile-layout">
    <header class="mobile-topbar">
      <div class="mobile-brand">
        <img src="/吃瓜.svg" class="mobile-logo" alt="吃瓜日记" />
        <div>
          <h1>吃瓜日记</h1>
          <p>{{ feedTitle }}</p>
        </div>
      </div>
      <form class="mobile-search" @submit.prevent="$emit('submitMobileSearch')">
        <input
          v-model="localSearchQuery"
          type="search"
          placeholder="搜索瓜、作者或分类"
        />
        <button type="submit">搜索</button>
      </form>
    </header>

    <main class="main-content">
      <PostList 
        :posts="filteredPosts"
        @toggleLike="post => $emit('toggleLike', post)"
        @viewDetail="post => $emit('viewDetail', post)"
      />
    </main>
    
    <BottomNav 
      :selectedCategories="selectedCategories"
      :totalPosts="totalPosts"
      :hasActiveFilters="hasActiveFilters"
      :currentUser="currentUser"
      @home="$emit('resetHome')"
      @category="$emit('openCategory')"
      @post="$emit('openPostForm')"
      @openLogin="$emit('openLogin')"
      @openProfile="$emit('openProfile')"
    />
  </div>
</template>
