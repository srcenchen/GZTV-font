<script></script>
<template>
  <div class="coil ml-4 mt-4">
    <div class="flex">
      <div class="text-h5 font-weight-bold">在线视频</div>
      <el-input style="width: 220px" class="ml-4" placeholder="在当前页搜索" :prefix-icon="Search"
                v-model="search_value"></el-input>
    </div>
    <v-tabs v-model="tab_id" @click="group_check=false">
      <v-tab key=-2 class="text-subtitle-2">首页</v-tab>
      <v-tab v-for="tab in tabs" :key="tab.Id" class="text-subtitle-2 ">{{ tab.Title }}</v-tab>
    </v-tabs>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbs_item" :key="item.id" to="/" @click="breadcrumb_click(item)" class="mb-2 mt-2 ml-2">{{ item.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex flex-wrap" v-if="items.length !== 0">
      <div v-for="item in items" :key="item.id" class="2xl:w-1/5 xl:w-1/4 lg:w-1/3 md:w-1/3 w-full pr-4 coil mb-2">
        <v-card @click="click_item(item)">
          <v-img :src="'/resource/upload/images/' + item.HeadImage " class="rounded w-full aspect-video" cover
                 v-if="!item.ParentGroup"/>
          <v-img src="@/assets/file_logo.png" class="rounded w-full aspect-video" v-else/>
          <div class="flex items-center mt-2">
            <div class="text-subtitle-2 ml-2 mr-2 truncate">{{ item.Title }}</div>
          </div>
          <div class="text-subtitle-2 font-weight-light ml-2 mb-2 mr-2 truncate">{{ item.Description }}</div>
          <div class="flex items-center mt-2 mb-5 ml-4">
            <v-badge :content="getGroup(item)" color="info"></v-badge>
          </div>
        </v-card>
      </div>
    </div>
    <div v-else-if="!loading" class="flex flex-col justify-center items-center w-full">
      <v-icon size="x-large">mdi-inbox-outline</v-icon>
      <div class="text-h6 font-weight-bold mt-2">空空如也</div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, watch} from 'vue'
import axios from 'axios'
import {useRouter} from "vue-router";
import {Search} from '@element-plus/icons-vue'

const search_value = ref('')

const tabs = ref([])
const groups = ref([])
const items = ref([])
const item_temp = ref([])
const loading = ref(true)
const tab_item = ref([])
const sub_group_id = ref(0)
const tab_id = ref(0)
const refresh_tab = ref(false)
const refresh_group = ref(false)
const breadcrumbs_item = ref([{
  title: '首页',
  tab_home: true,
  id: 0,
}])
onMounted(() => {
  axios.get('/api/video/get-video-group-list').then((res) => {
    groups.value = res.data.data.list
    tabs.value = res.data.data.list.filter((item) => {
      return item.ParentGroup === "-1";
    });
    axios.get('/api/video/get-video-list').then((res) => {
      items.value = res.data.data.list.reverse().filter((item) => {
        return item.IsHideMain !== true;
      });
      tab_item.value = items.value
      item_temp.value = res.data.data.list;
      loading.value = false
    })
  })
})
const router = useRouter()
const group_check = ref(false)

function breadcrumb_click(item) {
  if(item.tab_home)
    refresh_tab.value = !refresh_tab.value
  else{
    sub_group_id.value = item.id
    // 获取下标
    let index = breadcrumbs_item.value.indexOf(item);
    console.log(index)
    breadcrumbs_item.value.splice(index + 1)
  }

}

function click_item(item) {
  if (item.ParentGroup) {
    group_check.value = true
    sub_group_id.value = item.Id;
    //group_check.value = false
    breadcrumbs_item.value.push({
      title: item.Title,
      tab_home: false,
      id: item.Id,
    })
    refresh_group.value = !refresh_group.value
  } else
    router.push("/video-player/?id=" + item.Id)
}

watch([tab_id,refresh_tab], (tab_id_val, oldValue) => {
  // console.log(sub_group_id_val)
  if (tab_id_val[0] === 0) {
    items.value = item_temp.value.filter((item) => {
      return item.IsHideMain !== true;
    });
    breadcrumbs_item.value = [{
      title: '首页',
      tab_home: true,
      id: 0,
    }]
  } else {
    items.value = item_temp.value.filter((item) => {
      return item.GroupId === tabs.value[tab_id_val[0] - 1].Id && item.IsHideGroup !== true;
    });
    const group_temp = groups.value.filter((item) => {
      return item.ParentGroup === tabs.value[tab_id_val[0] - 1].Id + '';
    });
    group_temp.reverse()
    group_temp.forEach(function (item) {
      items.value.unshift(item)
    });
    breadcrumbs_item.value = [{
      title: tabs.value[tab_id_val[0] - 1].Title,
      tab_home: true,
      id: tabs.value[tab_id_val[0] - 1].Id,
    }]

  }
  tab_item.value = items.value
})

watch([sub_group_id,refresh_group], (sub_group_id_val, oldValue) => {
  items.value = item_temp.value.filter((item) => {
    return item.GroupId === sub_group_id_val[0] && item.IsHideGroup !== true;
  });
  const group_temp = groups.value.filter((item) => {
    return item.ParentGroup === sub_group_id_val[0] + '';
  });
  group_temp.reverse()
  group_temp.forEach(function (item) {
    items.value.unshift(item)
  });
  tab_item.value = items.value
})

watch(search_value, (newValue, oldValue) => {
  items.value = tab_item.value.filter(item => {
    return item.Title.includes(newValue) || item.Description.includes(newValue);
  });
});

// 获取分组名
function getGroup(item) {
  try {
    if (item.GroupId === -2) {
      return "未分组"
    } else {
      return groups.value.find((tab) => {
        return tab.Id === item.GroupId
      }).Title
    }
  } catch (e) {
    return '子分类'
  }
}

</script>
