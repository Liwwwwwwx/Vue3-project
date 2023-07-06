<template>
  <el-row>
    <el-col :span="4" class="on_page_sidebar">
      <el-row class="tac">
        <el-col :span="24">
          <div class="mb-2">hirain</div>
          <el-menu @open="handleOpen" @close="handleClose">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <User />
                </el-icon>
                <span>用户中心</span>
              </template>
              <router-link to="/localuser">
                <el-menu-item index="1-1">Local User</el-menu-item>
              </router-link>
              <router-link to="/remoteuser">
                <el-menu-item index="1-2">Remote User</el-menu-item>
              </router-link>
            </el-sub-menu>
          </el-menu>
        </el-col>
      </el-row>
    </el-col>
    <el-col class="content" :span="20">
      <Title></Title>
      <router-view />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { User } from "@element-plus/icons-vue";
import Title from "@/components/title.vue";
import { ref } from "vue";

let select_menu_item = ref(false);

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style lang="scss">
.on_page_sidebar {
  margin: 0;
  background-color: #222c3c;
  height: 790px;

  .tac {
    text-align: center;
    font-size: 28px;
    font-weight: 300;
    font-family: Raleway;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #2a3547;
    color: #e6eaee;
  }
}

.content {
  padding: 15px;
}

.el-menu,
.el-menu-item,
.el-sub-menu__title {
  border: none;
  background-color: #222c3c;
  color: #e6eaee;
}

.el-sub-menu__title:hover,
.el-menu-item:hover {
  background-color: #1d2531;
}
</style>
