<script setup>
import { ref, computed } from 'vue'
import WebHome from './views/web/Home.vue'
import MobileHome from './views/mobile/Home.vue'
import PostForm from './components/common/PostForm.vue'
import PostDetail from './components/common/PostDetail.vue'
import CategoryModal from './components/mobile/CategoryModal.vue'
import LoginModal from './components/common/LoginModal.vue'
import UserProfileModal from './components/common/UserProfileModal.vue'

const posts = ref([
  {
    id: 1,
    author: '吃瓜小王子',
    avatar: '🍉',
    content: '今天娱乐圈又爆大瓜了！听说某顶流要官宣了？大家怎么看？我觉得这次的瓜有点大啊，不知道是真是假。希望是真的吧，这样又有新瓜可以吃了！',
    category: '娱乐',
    images: [],
    likes: 128,
    comments: [
      { id: 1, author: '猹猹一号', content: '真的假的？我不信！', likes: 23 },
      { id: 2, author: '瓜田里的猹', content: '坐等实锤！', likes: 15 }
    ],
    createdAt: '2分钟前',
    isLiked: false
  },
  {
    id: 2,
    author: '猹中之王',
    avatar: '🐹',
    content: '刚吃完一个大瓜，现在还意犹未尽...有没有新瓜可以吃？最近的瓜都不太甜，希望能有个甜一点的瓜让我好好尝尝！',
    category: '日常',
    images: [],
    likes: 89,
    comments: [
      { id: 3, author: '吃瓜群众', content: '同求同求！', likes: 8 },
      { id: 4, author: '资深瓜农', content: '明天有大瓜，记得来看！', likes: 45 }
    ],
    createdAt: '15分钟前',
    isLiked: true
  },
  {
    id: 3,
    author: '瓜农小李',
    avatar: '🥒',
    content: '分享一个冷知识：猹其实是一种动物，不是吃瓜专用词哦！猹是獾的一种，鲁迅先生的《故乡》里有提到过。没想到吧，原来我们都是在学闰土吃瓜！',
    category: '日常',
    images: [],
    likes: 256,
    comments: [
      { id: 5, author: '涨知识了', content: '原来如此！', likes: 12 },
      { id: 6, author: '好奇宝宝', content: '那猹到底是什么动物？', likes: 3 }
    ],
    createdAt: '1小时前',
    isLiked: false
  },
  {
    id: 4,
    author: '情感大师',
    avatar: '💔',
    content: '今天心情不太好，感觉有点emo。工作压力好大，感情也不太顺利。有没有人来安慰一下我？或者给我讲个笑话也行啊！',
    category: '情感',
    images: [],
    likes: 45,
    comments: [
      { id: 7, author: '暖心小天使', content: '抱抱你！一切都会好起来的！', likes: 28 },
      { id: 8, author: '乐观主义者', content: '明天会更好！', likes: 19 }
    ],
    createdAt: '2小时前',
    isLiked: false
  },
  {
    id: 5,
    author: '打工人小张',
    avatar: '💼',
    content: '今天又加班到很晚，好累啊！什么时候才能不加班？感觉身体被掏空了。但是为了生活，还是得继续努力啊！加油，打工人！',
    category: '办公',
    images: [],
    likes: 167,
    comments: [
      { id: 9, author: '同是打工人', content: '加油！我们都是打工人！', likes: 56 },
      { id: 10, author: '过来人', content: '注意身体！', likes: 34 }
    ],
    createdAt: '3小时前',
    isLiked: true
  },
  {
    id: 6,
    author: '美食家小王',
    avatar: '🍜',
    content: '今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！今天做了一道红烧肉，超级好吃！肥而不腻，入口即化。有没有想学的？我可以分享教程！',
    category: '美食',
    images: [],
    likes: 312,
    comments: [
      { id: 11, author: '吃货一枚', content: '看起来好好吃！求教程！', likes: 89 },
      { id: 12, author: '厨房小白', content: '想学想学！', likes: 45 }
    ],
    createdAt: '4小时前',
    isLiked: false
  },
  {
    id: 7,
    author: '旅行达人',
    avatar: '✈️',
    content: '刚刚从云南回来，那里的风景真的太美了！洱海的水清澈见底，苍山的雪皑皑生辉。推荐大家一定要去一次！',
    category: '旅行',
    images: [],
    likes: 423,
    comments: [
      { id: 13, author: '向往旅行', content: '好想去！', likes: 67 },
      { id: 14, author: '去过的人', content: '确实很美！', likes: 32 }
    ],
    createdAt: '5小时前',
    isLiked: false
  },
  {
    id: 8,
    author: '科技爱好者',
    avatar: '🤖',
    content: '最新发布的iPhone 16 Pro真的太酷了！A18芯片性能超强，钛合金边框手感一流。就是价格有点贵啊...',
    category: '科技',
    images: [],
    likes: 567,
    comments: [
      { id: 15, author: '果粉', content: '已经预定了！', likes: 128 },
      { id: 16, author: '理性消费', content: '等等党永不为奴！', likes: 89 }
    ],
    createdAt: '6小时前',
    isLiked: true
  }
])

const showPostForm = ref(false)
const viewPostDetail = ref(null)
const showCategoryModal = ref(false)
const searchQuery = ref('')
const mobileSearchQuery = ref('')
const selectedCategories = ref([])
const customCategories = ref([])
const showLoginModal = ref(false)
const showUserProfile = ref(false)
const currentUser = ref(null)

const totalPosts = computed(() => posts.value.length)
const totalComments = computed(() => 
  posts.value.reduce((sum, post) => sum + post.comments.length, 0)
)

const allCategories = computed(() => {
  const postCategories = [...new Set(posts.value.map(p => p.category).filter(Boolean))]
  return [...customCategories.value, ...postCategories]
})

const postCounts = computed(() => {
  const counts = {}
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

const hasActiveFilters = computed(() => searchQuery.value || selectedCategories.value.length > 0)

const feedTitle = computed(() => {
  if (searchQuery.value) return `搜索：${searchQuery.value}`
  if (selectedCategories.value.length > 0) return selectedCategories.value.join('、')
  return '全部热瓜'
})

const addPost = (postData) => {
  const newPost = {
    id: Date.now(),
    author: '匿名吃瓜者',
    avatar: '🎭',
    content: postData.content,
    category: postData.category,
    images: postData.images || [],
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

const toggleLike = (post) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const addComment = (postId, content) => {
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

const handleSearch = (query) => {
  searchQuery.value = query.trim()
  mobileSearchQuery.value = searchQuery.value
}

const handleCategoryConfirm = (categories) => {
  selectedCategories.value = categories
}

const handleDesktopCategoryToggle = (categories) => {
  selectedCategories.value = categories
}

const viewDetail = (post) => {
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
        @logout="currentUser = null"
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
      :user="currentUser || {}"
      @close="showUserProfile = false"
      @updateUser="user => currentUser = user"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

body {
  background: #fff7ed;
  min-height: 100vh;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px 0;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 79, 104, 0.25);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 79, 104, 0.45);
}

.app-container {
  min-height: 100vh;
  background:
    radial-gradient(circle at 8% 12%, rgba(255, 99, 132, 0.16), transparent 28%),
    radial-gradient(circle at 92% 16%, rgba(42, 157, 84, 0.18), transparent 24%),
    linear-gradient(135deg, #fff7ed 0%, #fff1f1 46%, #eef9ed 100%);
  color: #2d211f;
}

.search-view {
  min-height: 100vh;
}

.main-view {
  min-height: 100vh;
}

.desktop-layout {
  display: none;
}

.mobile-layout {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  min-height: 100vh;
}

.main-content {
  padding-bottom: 100px;
}

.feed-status {
  margin: 18px 18px 0;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(133, 46, 35, 0.08);
}

.feed-eyebrow {
  margin: 0 0 4px;
  color: #8a736b;
  font-size: 0.78rem;
  font-weight: 700;
}

.feed-title {
  margin: 0;
  color: #2d211f;
  font-size: 1.16rem;
  line-height: 1.25;
}

.feed-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  color: #7b6a64;
  font-size: 0.86rem;
}

.status-chip {
  padding: 7px 10px;
  background: #fff4e5;
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 6px;
  color: #d9485f;
  cursor: pointer;
  font: inherit;
}

.status-chip:hover {
  background: #f2fbef;
  border-color: rgba(47, 158, 68, 0.26);
  color: #166534;
}

.mobile-topbar {
  position: sticky;
  top: 0;
  z-index: 80;
  padding: 14px 14px 12px;
  background: linear-gradient(135deg, rgba(255, 79, 104, 0.96), rgba(255, 179, 71, 0.94), rgba(47, 158, 68, 0.92));
  box-shadow: 0 12px 32px rgba(133, 46, 35, 0.16);
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.mobile-logo {
  width: 38px;
  height: 38px;
  padding: 5px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.22);
}

.mobile-brand h1 {
  margin: 0;
  color: #fff;
  font-size: 1.18rem;
  line-height: 1.2;
}

.mobile-brand p {
  margin: 2px 0 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.78rem;
}

.mobile-search {
  display: flex;
  gap: 8px;
}

.mobile-search input {
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 8px;
  outline: none;
  color: #2d211f;
  font: inherit;
  background: rgba(255, 255, 255, 0.94);
}

.mobile-search button {
  height: 40px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 8px;
  background: #fff;
  color: #d9485f;
  font-weight: 700;
  cursor: pointer;
}

.mobile-feed-status {
  margin: 12px 14px 0;
  align-items: flex-start;
}

.mock-data-note {
  margin: 0 18px 18px;
  padding: 12px 14px;
  color: #8a736b;
  font-size: 0.84rem;
  text-align: center;
  border-top: 1px dashed rgba(133, 46, 35, 0.14);
}

@media screen and (min-width: 768px) {
  .mobile-layout {
    display: none;
  }
  
  .desktop-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    background:
      linear-gradient(90deg, rgba(47, 158, 68, 0.08) 0 1px, transparent 1px),
      linear-gradient(180deg, rgba(255, 107, 107, 0.08) 0 1px, transparent 1px);
    background-size: 32px 32px;
  }
  
  .desktop-body {
    flex: 1;
    display: flex;
    overflow: hidden;
    padding: 18px;
    gap: 18px;
  }
  
  .desktop-sidebar {
    flex: 3;
    min-width: 280px;
    max-width: 380px;
    padding: 0;
    background: transparent;
    overflow: hidden;
  }
  
  .desktop-content {
    flex: 7;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.48);
    border: 1px solid rgba(255, 255, 255, 0.78);
    border-radius: 8px;
    box-shadow: 0 18px 60px rgba(133, 46, 35, 0.1);
    backdrop-filter: blur(18px);
  }
  
  .main-content {
    flex: 1;
    padding: 0;
    overflow-y: auto;
  }
  
  .desktop-post-btn {
    position: fixed;
    right: 40px;
    bottom: 40px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff4f68 0%, #ff7388 100%);
    border: 4px solid #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 24px rgba(255, 79, 104, 0.35);
    transition: all 0.3s ease;
    z-index: 100;
  }
  
  .desktop-post-btn:hover {
    transform: translateY(-4px) scale(1.05) rotate(-6deg);
    box-shadow: 0 14px 32px rgba(255, 79, 104, 0.45);
  }
  
  .desktop-post-btn:hover .watermelon-icon {
    transform: scale(1.15) rotate(12deg);
  }
  
  .desktop-post-btn:active {
    transform: scale(0.95);
  }
  
  .watermelon-icon {
    width: 30px;
    height: 30px;
    display: block;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .spoon-group {
    transform-origin: 30px 2px;
    transition: transform 0.3s ease;
  }
  
  .desktop-post-btn:hover .spoon-group {
    animation: scoop-animation 1.4s ease-in-out infinite;
  }
  
  .scooped-flesh,
  .scooped-seed {
    opacity: 0;
    transform: scale(0);
    transform-origin: 21px 11px;
  }
  
  .desktop-post-btn:hover .scooped-flesh,
  .desktop-post-btn:hover .scooped-seed {
    animation: flesh-appear 1.4s ease-in-out infinite;
  }
  
  .bite-hole {
    opacity: 0;
    transform: scale(0);
    transform-origin: 14px 12.5px;
    transition: all 0.3s ease;
  }
  
  .desktop-post-btn:hover .bite-hole {
    animation: bite-appear 1.4s ease-in-out infinite;
  }
  
  @keyframes scoop-animation {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    15% {
      transform: translate(1px, -1.5px) rotate(-8deg);
    }
    45% {
      transform: translate(-7px, 5px) rotate(18deg);
    }
    70% {
      transform: translate(-1.5px, -5px) rotate(-18deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }
  
  @keyframes flesh-appear {
    0%, 38% {
      opacity: 0;
      transform: scale(0);
    }
    45%, 85% {
      opacity: 1;
      transform: scale(1);
    }
    95%, 100% {
      opacity: 0;
      transform: scale(0);
    }
  }
  
  @keyframes bite-appear {
    0%, 40% {
      opacity: 0;
      transform: scale(0);
    }
    45%, 85% {
      opacity: 1;
      transform: scale(1);
    }
    95%, 100% {
      opacity: 0;
      transform: scale(0);
    }
  }
}

@media screen and (min-width: 1024px) {
  .desktop-sidebar {
    min-width: 300px;
    max-width: 420px;
    padding: 0;
  }
  
  .desktop-post-btn {
    right: 60px;
    bottom: 60px;
    width: 72px;
    height: 72px;
  }
  
  .edit-icon {
    width: 32px;
    height: 32px;
  }
}

@media screen and (max-width: 320px) {
  html {
    font-size: 13px;
  }
  
  .main-content {
    padding-bottom: 80px;
  }
}
</style>
