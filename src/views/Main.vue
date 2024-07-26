<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 自定义的左侧组件 -->
      <common-aside />

      <el-container>
        <!-- 自定义的顶部组件 -->
        <el-header>
          <common-header />
        </el-header>
        <!-- 自定义的Tab组件 -->
        <common-tab></common-tab>
        <!-- 自定义的主体组件 -->
        <el-main class="right-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";
import CommonTab from "@/components/CommonTab.vue";
</script>

<style lang="scss" scoped>
.common-layout,
.lay-container {
  height: 100%;
}
.el-header {
  background-color: #333;
}
</style>
