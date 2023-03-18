<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
console.log(document.location)
</script>
<style scoped>
.container{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
