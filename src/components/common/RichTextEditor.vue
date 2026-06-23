<script setup>
import '@wangeditor/editor/dist/css/style.css' // import css

import { onBeforeUnmount, ref, shallowRef, watch, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isFullScreen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// editor instance, use shallowRef
const editorRef = shallowRef()

// mode
const mode = 'default' // or 'simple'

// HTML content
const valueHtml = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  if (valueHtml.value !== newVal) {
    valueHtml.value = newVal
  }
})

watch(valueHtml, (newVal) => {
  emit('update:modelValue', newVal)
})

const toolbarConfig = {
  excludeKeys: [
    'uploadImage',
    'uploadVideo',
    'fullScreen' // We will manage full screen ourselves
  ]
}

const editorConfig = { 
  placeholder: '分享你的瓜... (支持富文本输入)',
  autoFocus: false
}

// create editor callback
const handleCreated = (editor) => {
  editorRef.value = editor
  if (props.isFullScreen) {
    setTimeout(() => {
      editor.focus()
    }, 100)
  }
}

const handleChange = (editor) => {
  valueHtml.value = editor.getHtml()
}

// before unmount, destroy editor
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<template>
  <div class="rich-text-container" :class="{ 'is-fullscreen': isFullScreen }">
    <!-- Only show toolbar in full screen mode to keep the normal mode clean -->
    <Toolbar
      v-show="isFullScreen"
      style="border-bottom: 1px solid #e8e0de"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      class="editor-toolbar"
    />
    <Editor
      class="editor-content"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<style scoped>
.rich-text-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e0de;
  border-radius: 12px;
  background: #fbf9f8;
  overflow: hidden;
  transition: all 0.3s ease;
}

.rich-text-container:focus-within {
  background: #ffffff;
  border-color: #ff4f68;
  box-shadow: 0 0 0 4px rgba(255, 79, 104, 0.1);
}

.editor-toolbar {
  background: #fff;
  z-index: 100;
}

.editor-content {
  flex: 1;
  min-height: 120px;
  overflow-y: auto;
}

/* Internal overrides for WangEditor inside our container */
:deep(.w-e-text-container) {
  background-color: transparent !important;
  font-family: inherit;
  font-size: 1rem;
  color: #2d211f;
}

:deep(.w-e-text-placeholder) {
  font-style: normal;
  color: #c4b9b5;
  top: 14px;
  left: 16px;
  line-height: 1.5;
}

:deep(.w-e-text-container [data-slate-editor]) {
  padding: 14px 48px 14px 16px;
  min-height: 120px;
  line-height: 1.5;
}

:deep(.w-e-text-container [data-slate-editor] > *:first-child) {
  margin-top: 0;
}

/* Fullscreen mode styling */
.rich-text-container.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  border-radius: 0;
  border: none;
  background: #ffffff;
}

.rich-text-container.is-fullscreen .editor-content {
  height: calc(100vh - 42px) !important; /* Adjust based on toolbar height */
  overflow-y: hidden;
}

.rich-text-container.is-fullscreen :deep(.w-e-text-container [data-slate-editor]) {
  height: 100%;
}
</style>
