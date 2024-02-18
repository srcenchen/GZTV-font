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
import {useToast} from "vue-toastification";

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
  title: "合辑管理",
  icon: "mdi-view-module",
  to: "group-manage"
}, {
  title: "直播管理",
  icon: "mdi-video-input-antenna",
  to: "live-manage"
}, {
  title: "公告管理",
  icon: "mdi-bell",
  to: "notice-manage"
}, {
  title: "系统设置",
  icon: "mdi-cog",
  to: "system-manage"
}]

const toast = useToast();
toast.success("Welcome", {timeout: 2000});
document.title = "后台管理";
</script>

<style>
</style>
