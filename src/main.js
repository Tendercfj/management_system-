import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/api/mock.js";
import api from "@/api/api";
import "@/assets/less/index.less";
/* import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; */
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import { useAllDataStore } from "./stores";
import { createPinia } from "pinia";
function isRoute(to) {
  return (
    router.getRoutes().filter((route) => route.path === to.path).length > 0
  );
}
router.beforeEach((to, from, next) => {
  if (to.path !== "/login" && !store.state.token) {
    return { name: "login" };
  }
  if (!isRoute(to)) {
    return { name: "404" };
  }
  next();
});

const pinia = createPinia();

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(pinia);
const store = useAllDataStore();
store.addMenu(router, "refresh");

/* app.use(ElementPlus); */

app.config.globalProperties.$api = api;
app.use(router);
app.mount("#app");
