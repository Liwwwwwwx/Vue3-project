<template>
  <div class="container">
    <div class="box"></div>
    <div class="load">
      <div class="logo"></div>
      <div class="name">
        {{ homeTitle }}
      </div>
      <div class="loadInfo">
        <el-input
          class="info"
          placeholder="请输入用户名称"
          clearable
          v-model="user.userName"
        >
        </el-input>
        <el-input
          class="info"
          placeholder="请输入登录密码"
          show-password
          clearable
          v-model="user.passWord"
        >
        </el-input>
        <el-button @click="load" id="btn" type="primary">登录</el-button>
      </div>
    </div>
    <div class="box"></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useLoadStore } from "@/store/load";
import { useGlobalStore } from "@/store/global";
import { toRefs } from "vue";

const router = useRouter();
const load_store = useLoadStore();
const global_store = useGlobalStore();

const { homeTitle } = global_store;
const { user } = toRefs(load_store);

function load() {
  router.push({
    path: "/localuser",
  });

  window.sessionStorage.setItem("username", user.value.userName);
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  .box {
    width: 33%;
    height: 220px;
    background-color: #0079fe;
  }

  .load {
    width: 34%;
    height: 420px;
    background-color: #ffffff;
    border-top: 10px solid #0079fe;
    box-shadow: 0 0 5px #000;
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo {
      width: 72px;
      height: 72px;
      border: 1px solid black;
      border-radius: 50%;
      margin-top: 26px;
    }

    .name {
      font-size: 24px;
      font-weight: 600;
      color: #0079fe;
      text-align: center;
    }

    .loadInfo {
      width: 300px;
      .info {
        margin-top: 20px;
        .el-input__inner {
          width: 100%;
          height: 50px;
          line-height: 50px;
        }
      }

      #btn {
        width: 100%;
        height: 50px;
        margin-top: 20px;
      }
    }
  }
}
</style>
