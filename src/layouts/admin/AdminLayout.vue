<template>
  <v-app>
    <AppBar v-model:is_show="is_show"/>
    <FooterBar/>
    <v-navigation-drawer v-model="is_show" :location="mob ? 'top' : 'left'" >
      <v-list density="compact" nav>
        <v-list-item v-bind:key='tab.to' v-for="tab in tabs" color="primary" :prepend-icon="tab.icon" :title="tab.title"
                     :to="'/admin/' + tab.to"></v-list-item>
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
import {POSITION, useToast} from "vue-toastification";
import axios from "axios";
import md5 from "md5";
import router from "@/router";

const is_show = ref(false)
const {mobile} = useDisplay()
if (!mobile.value)
  is_show.value = true
const mob = computed(() => {
  return mobile.value
})

const tabs = [{
  title: "视频管理",
  icon: "mdi-video",
  to: "video-manage"
}, {
  title: "分类管理",
  icon: "mdi-view-module",
  to: "group-manage"
}, {
  title: "直播管理",
  icon: "mdi-video-input-antenna",
  to: "live-manage"
}, {
  title: "系统设置",
  icon: "mdi-cog",
  to: "system-manage"
}]

const toast = useToast();
toast.success("Welcome", {timeout: 2000});
document.title = "后台管理";


// 发送密码验证请求
const data = {
  username: localStorage.getItem("username"),
  password: md5(localStorage.getItem("password")),
};
axios.post("/api/user/login-verify", data).then((res) => {
  if (res.data.data.isSuccess) {
    return
  } else {
    const toast = useToast();
    toast.error("身份失效，重新登录！", {position: POSITION.TOP_CENTER});
    localStorage.clear()
    router.push("/admin")
  }
});
</script>

<style>
</style>
