<template>
  <div class="login">
    <el-form :model="loginForm" class="login-form">
      <h1>欢迎登录</h1>
      <el-form-item>
        <el-input
          type="input"
          v-model="loginForm.username"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useAllDataStore } from "@/stores/index";
import { useRouter } from "vue-router";
const store = useAllDataStore();
const router = useRouter();
const loginForm = reactive({
  username: "",
  password: "",
});
const { proxy } = getCurrentInstance();
const handleLogin = async () => {
  const res = await proxy.$api.getMenu(loginForm);
  console.log(res);
  // TODO: 登录逻辑
  store.updateMenuList(res.menuList);
  store.state.token = res.token;
  store.addMenu(router);
  router.push({ name: "home" });
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100vh;
  background-image: url("../assets/images/background.png");
  background-size: 100%;
  overflow: hidden;
}
.login-form {
  width: 350px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 250px auto;
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }
  :deep(.el-form-item__content) {
    justify-content: center;
  }
}
</style>
