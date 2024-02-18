<template>
  <v-app>
    <AppBar v-model:is_show="is_show"/>
    <FooterBar/>
    <v-navigation-drawer v-model="is_show" :location="mob ? 'top' : 'left'">
      <v-list density="compact" nav>
        <v-list-item color="primary" prepend-icon="mdi-video" title="在线视频"
                     to="/online-video"></v-list-item>
        <v-list-item color="primary" prepend-icon="mdi-video-input-antenna" title="直播大厅"
                     to="/live-room"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view v-slot="{ Component }">
        <v-scroll-x-transition mode="out-in">
          <component :is="Component"/>
        </v-scroll-x-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useDisplay} from 'vuetify'
import AppBar from '@/components/AppBar.vue'
import FooterBar from "@/components/FooterBar.vue";
import axios from "axios";
import {useToast} from "vue-toastification";

const is_show = ref(false)
const {mobile} = useDisplay()
if (!mobile.value)
  is_show.value = true
const mob = computed(() => {
  return mobile.value
})

function noticePad() {
  // 获取notice
  axios.get("/api/setting/get-notice").then((res) => {
    // console.log(res);
    const data = res.data["data"]["notice"];
    if (data === "") return;
    const toast = useToast();
    toast.info(data, {timeout: 2000});
  });

}
noticePad()
document.title = "赣中电视台";
</script>

<style>
</style>
