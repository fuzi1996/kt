<template>
  <el-menu
    default-active="/setting"
    class="el-menu-vertical-aside"
    :collapse="isCollapse"
    active-text-color="#409eff"
    background-color="#263445"
    text-color="#bfcbd9"
    @select="handleMenuSelect"
  >
    <el-menu-item index="/setting" class="menu">
      <el-icon><setting /></el-icon>
      <template #title>Config</template>
    </el-menu-item>
    <el-menu-item index="#" class="menu-collapse" @click="handleMenuCollapseClick">
      <el-icon v-if="isCollapse"><DArrowRight /></el-icon>
      <el-icon v-else><DArrowLeft /></el-icon>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Setting,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter();
const isCollapse = ref<boolean>(true)
const handleMenuSelect = (index: string) => {
  if(index !== '#'){
    router.push(index)
  }
}
const handleMenuCollapseClick = () => {
  isCollapse.value = !isCollapse.value
}
</script>
<style scoped>
.menu-collapse{
  position: absolute;
  bottom: 0;
  width: 100%;
}
.el-menu-vertical-aside{
  height: 100%;
}
.el-menu-vertical-aside:not(.el-menu--collapse) {
  width: 200px;
}
.menu{
  border-bottom: 1px;
}
</style>
