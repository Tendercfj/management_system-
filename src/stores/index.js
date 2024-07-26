import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
function initState() {
  return {
    isCollapse: false,
    tags: [
      {
        path: "/home",
        name: "home",
        label: "首页",
        icon: "home",
      },
    ],
    currentMenu: "",
    menuList: [],
    token: "",
    routerList: [],
  };
}
export const useAllDataStore = defineStore("allData", () => {
  /* const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  } */
  //ref state属性
  //computed getters
  //function actions
  const state = ref(initState());

  watch(
    state,
    (newVal) => {
      if (!newVal.token) return;
      localStorage.setItem("store", JSON.stringify(newVal));
    },
    { deep: true }
  );

  function selectMenu(val) {
    if (val.name === "home") {
      state.value.currentMenu = null;
    } else {
      state.value.currentMenu = val;
      let index = state.value.tags.findIndex((item) => item.name === val.name);
      index === -1 ? state.value.tags.push(val) : "";
    }
  }
  function updateMenu(tag) {
    let index = state.value.tags.findIndex((item) => item.name === tag.name);
    state.value.tags.splice(index, 1);
  }
  function updateMenuList(val) {
    state.value.menuList = val;
  }
  function addMenu(router, type) {
    if (type === "refresh") {
      if (JSON.parse(localStorage.getItem("store"))) {
        state.value = JSON.parse(localStorage.getItem("store"));

        state.value.routerList = [];
      }
    }
    const menu = state.value.menuList;
    const module = import.meta.glob("../views/**/*.vue");
    const routeArr = [];
    menu.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          let url = `../views/${child.url}.vue`;
          child.component = module[url];
          routeArr.push(...item.children);
        });
      } else {
        let url = `../views/${item.url}.vue`;
        item.component = module[url];
        routeArr.push(item);
      }
    });
    state.value.routerList = [];
    let routers = router.getRoutes();
    routers.forEach((item) => {
      if (item.name === "main" || item.name === "login") {
        return;
      } else {
        router.removeRoute(item.name);
      }
    });
    routeArr.forEach((item) => {
      state.value.routerList.push(router.addRoute("main", item));
    });
  }
  function clean() {
    state.value.routerList.forEach((item) => {
      //router.removeRoute(item.name);
      if (item) item();
    });
    state.value = initState();
    localStorage.removeItem("store");
  }
  return { state, selectMenu, updateMenu, updateMenuList, addMenu, clean };
});
