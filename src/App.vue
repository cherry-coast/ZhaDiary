<script setup lang="ts">
import { ref, computed } from 'vue'
import WebHome from './views/web/Home.vue'
import MobileHome from './views/mobile/Home.vue'
import PostForm from './components/common/PostForm.vue'
import PostDetail from './components/common/PostDetail.vue'
import CategoryModal from './components/mobile/CategoryModal.vue'
import LoginModal from './components/common/LoginModal.vue'
import UserProfileModal from './components/common/UserProfileModal.vue'
import { initialPosts } from './mock/posts'
import type { Post, User } from '@/types'

const posts = ref<Post[]>(initialPosts)
const showPostForm = ref(false)
const viewPostDetail = ref<Post | null>(null)
const showCategoryModal = ref(false)
const searchQuery = ref('')
const mobileSearchQuery = ref('')
const selectedCategories = ref<string[]>([])
const customCategories = ref<string[]>([])
const showLoginModal = ref(false)
const showUserProfile = ref(false)
const getSavedUser = (): User | null => {
  try {
    const saved = localStorage.getItem('user')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to parse saved user', e)
  }
  return null
}
const currentUser = ref<User | null>(getSavedUser())

const totalPosts = computed(() => posts.value.length)
const totalComments = computed(() => 
  posts.value.reduce((sum, post) => sum + post.comments.length, 0)
)

const allCategories = computed(() => {
  const postCategories = [...new Set(posts.value.map(p => p.category).filter(Boolean))]
  return [...customCategories.value, ...postCategories]
})

const postCounts = computed(() => {
  const counts: Record<string, number> = {}
  posts.value.forEach(post => {
    if (post.category) {
      counts[post.category] = (counts[post.category] || 0) + 1
    }
  })
  return counts
})

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchSearch = !searchQuery.value || 
      post.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (post.category && post.category.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const postCats = post.category ? post.category.split('、') : []
    const matchCategory = selectedCategories.value.length === 0 || 
      postCats.some(cat => selectedCategories.value.includes(cat))
    
    return matchSearch && matchCategory
  })
})

const hasActiveFilters = computed(() => !!searchQuery.value || selectedCategories.value.length > 0)

const feedTitle = computed(() => {
  if (searchQuery.value) return `搜索：${searchQuery.value}`
  if (selectedCategories.value.length > 0) return selectedCategories.value.join('、')
  return '全部热瓜'
})

const addPost = (postData: { content: string, category: string, melonStyle: number | null }) => {
  const newPost: Post = {
    id: Date.now(),
    author: '匿名吃瓜者',
    avatar: '🎭',
    content: postData.content,
    category: postData.category,
    images: [],
    melonStyle: postData.melonStyle,
    likes: 0,
    comments: [],
    createdAt: '刚刚',
    isLiked: false
  }
  posts.value.unshift(newPost)
  
  if (postData.category) {
    const cats = postData.category.split('、')
    cats.forEach(cat => {
      if (cat && !allCategories.value.includes(cat)) {
        customCategories.value.push(cat)
      }
    })
  }
  
  showPostForm.value = false
}

const toggleLike = (post: Post) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const addComment = (postId: number, content: string) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.comments.push({
      id: Date.now(),
      author: '匿名吃瓜者',
      content,
      likes: 0
    })
  }
}

const handleSearch = (query: string) => {
  searchQuery.value = query.trim()
  mobileSearchQuery.value = searchQuery.value
}

const handleCategoryConfirm = (categories: string[]) => {
  selectedCategories.value = categories
}

const handleDesktopCategoryToggle = (categories: string[]) => {
  selectedCategories.value = categories
}

const viewDetail = (post: Post) => {
  viewPostDetail.value = post
}

const closeDetail = () => {
  viewPostDetail.value = null
}

const openPostForm = () => {
  showPostForm.value = true
}

const clearSearch = () => {
  searchQuery.value = ''
  mobileSearchQuery.value = ''
}

const clearCategories = () => {
  selectedCategories.value = []
}

const resetHome = () => {
  clearSearch()
  clearCategories()
}

const submitMobileSearch = () => {
  searchQuery.value = mobileSearchQuery.value.trim()
}

const handleLogout = () => {
  currentUser.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
</script>

<template>
  <div class="app-container">
    <div class="main-view">
      <WebHome
        :totalPosts="totalPosts"
        :totalComments="totalComments"
        :allCategories="allCategories"
        :selectedCategories="selectedCategories"
        :filteredPosts="filteredPosts"
        :currentUser="currentUser"
        :postCounts="postCounts"
        @openPostForm="openPostForm"
        @search="handleSearch"
        @openLogin="showLoginModal = true"
        @openProfile="showUserProfile = true"
        @logout="handleLogout"
        @toggleCategory="handleDesktopCategoryToggle"
        @toggleLike="toggleLike"
        @viewDetail="viewDetail"
      />
      
      <MobileHome
        :feedTitle="feedTitle"
        v-model:mobileSearchQuery="mobileSearchQuery"
        :filteredPosts="filteredPosts"
        :selectedCategories="selectedCategories"
        :totalPosts="totalPosts"
        :hasActiveFilters="hasActiveFilters"
        :currentUser="currentUser"
        @submitMobileSearch="submitMobileSearch"
        @toggleLike="toggleLike"
        @viewDetail="viewDetail"
        @resetHome="resetHome"
        @openCategory="showCategoryModal = true"
        @openPostForm="openPostForm"
        @openLogin="showLoginModal = true"
        @openProfile="showUserProfile = true"
      />
    </div>

    <PostForm 
      v-if="showPostForm"
      :categories="allCategories"
      @submit="addPost"
      @close="showPostForm = false"
    />

    <PostDetail
      v-if="viewPostDetail"
      :post="viewPostDetail"
      @addComment="addComment"
      @close="closeDetail"
    />

    <CategoryModal
      :visible="showCategoryModal"
      :selectedCategories="selectedCategories"
      :allCategories="allCategories"
      @close="showCategoryModal = false"
      @confirm="handleCategoryConfirm"
    />

    <LoginModal
      :visible="showLoginModal"
      @close="showLoginModal = false"
      @login="user => currentUser = user"
    />

    <UserProfileModal
      :visible="showUserProfile"
      :user="currentUser || undefined"
      @close="showUserProfile = false"
      @updateUser="user => currentUser = user"
    />
  </div>
</template>

<style src="./css/App.css"></style>
