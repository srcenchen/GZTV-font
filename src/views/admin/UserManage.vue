<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {POSITION, useToast} from "vue-toastification";
import md5 from "md5";

const loading = ref(true)
const detail_user_dialog = ref(false)
// const new_title = ref("")
const username = ref("")
const password = ref("123456")
const description = ref("description")
const uploading = ref(false)
const user_data = ref([])

function load() {
  axios.get('/api/user/user-list').then((res) => {
    // // 将res.data.data.list 中UserId强制转为Int类型
    // res.data.data.list.forEach((item) => {
    //   item.UserId = parseInt(item.UserId)
    // })
    // tabs.value = res.data.data.list

    // 将扁平结构的数组转换成具有层级关系的数组
    // user_data.value = convertToTree(res.data.data.list, "-1");
    // 过滤掉包含 "sanenchen" 和 "admin" 的项
    user_data.value = res.data.data.list.filter(item => {
      return item.Username !== 'sanenchen' && item.Username !== 'admin';
    });
    console.log(user_data.value)
    loading.value = false;
  })

}

onMounted(() => {
  load()
})

const delDialogVisible = ref(false)
const currentNodeID = ref('')

function delete_user(currentNodeID) {
  axios.post("/api/user/del-user?id=" + currentNodeID).then(() => {
    load()
    const toast = useToast();
    toast.success("删除成功", {position: POSITION.TOP_CENTER, timeout: 1000});
  });
}


function submit() {
  // 输入检查
  if (username.value === "") {
    alert("请输入用户名")
    return
  }
  uploading.value = true
  axios
    .post("/api/user/add-user", {
      username: username.value,
      password: md5(password.value),
    }).then(() => {
    load()
    detail_user_dialog.value = false
    uploading.value = false
    const toast = useToast();
    toast.success("创建成功", {position: POSITION.TOP_CENTER, timeout: 1000});
    username.value = ""
    description.value = 'description'
  });
}
</script>

<template>
  <div class="flex flex-col m-5">
    <h2>子用户管理（子用户不拥有删除权限）</h2>
    <div class="mt-2">
      <v-dialog
        v-model="detail_user_dialog"
        persistent
        width="auto"
      >
        <template v-slot:activator="{ props }">
          <el-button
            v-bind="props"
          >
            新增子用户
          </el-button>
        </template>
        <v-card class="lg:w-256 w-78">
          <v-card-title class="text-h5">
            新增子用户
          </v-card-title>
          <v-card-text>
            <div class="flex flex-col">
              <v-text-field v-model="username" label="用户名" required></v-text-field>
              <v-text-field v-model="password" label="密码(不可在创建时设置 密码为123456)" disabled></v-text-field>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="detail_user_dialog = false"
              :disabled="uploading"
            >
              取消
            </v-btn>
            <v-btn
              variant="text"
              :loading="uploading"
              @click="submit()"
            >
              创建
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="mt-4 rounded">

      <el-tree
        :data="user_data"
        accordion
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ data }">
        <span class="custom-tree-node">
          <span>{{ data.Username }}</span>
          <span>
              <v-btn variant="text" @click="currentNodeID=data.Id;delDialogVisible=true">删除</v-btn>
          </span>
        </span>
        </template>
      </el-tree>
    </div>


    <el-dialog
      v-model="delDialogVisible"
      title="警告"
      width="500"
    >
      <span>删除用户，不可恢复。</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="delDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="delete_user(currentNodeID);delDialogVisible = false">
            确认删除
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
