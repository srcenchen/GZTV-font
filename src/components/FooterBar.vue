<script setup>
import {ref, onMounted} from 'vue'
import axios from 'axios'
const footer = ref("")
onMounted(() => {
  axios.get('/api/setting/get-footer').then(res => {
    footer.value = res.data.data.Footer
  })
})
</script>

<template>
  <v-app-bar flat height="64" location="bottom" class="border-t">
    <div className="flex flex-col items-center justify-center w-full">
      <p class="text-body-2">本项目由伞恩晨同学开发维护并提供技术支持</p>
      <p class="text-body-2">{{ footer }}</p>
    </div>
  </v-app-bar>
</template>
