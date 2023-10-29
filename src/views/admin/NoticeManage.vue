<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {POSITION, useToast} from "vue-toastification";
const notice = ref("")

onMounted(() => {
  axios.get('/api/setting/get-notice').then(res => {
    notice.value = res.data.data.notice
  })
})

function submit() {
  axios.get('/api/setting/set-notice?notice=' + notice.value).then(res => {
    const toast = useToast();
    if (res.data.code === 0) {
      // Use it!
      toast.success("设置成功", {position: POSITION.TOP_CENTER});
    } else {
      toast.error("操作失败", {position: POSITION.TOP_CENTER});
    }
  })
}
</script>

<template>
  <div className="flex flex-col m-5">
    <h2>公告管理</h2>
    <div class="flex flex-col mt-2">
      <v-textarea v-model="notice" variant="outlined"></v-textarea>
      <div>
        <v-btn variant="outlined" @click="submit">保存</v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
