<template>
  <div aria-label="A complete example of page header">
    <el-page-header @back="onBack">
      <template #breadcrumb>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">
            homepage
          </el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/localuser">route 1</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </template>
    </el-page-header>
  </div>
</template>

<script setup lang="ts">
import { ElNotification as notify } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()



const onBack = () => {
  notify('Back')
  router.go(-1)
}
</script>
