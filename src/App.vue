<template>
  <el-container class="out-container">
    <!-- <el-header class="header">Header</el-header> -->
    <el-container class="inner-container">
      <NavDrawer/>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import NavDrawer from 'frontend/components/main/NavDrawer.vue';
</script>
<style scoped>
.out-container{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.inner-container{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
