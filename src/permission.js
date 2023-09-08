/**
 * 全站权限配置
 *
 */
import router from "./router/router";
import store from "@/store";
import { validatenull } from "@/util/validate";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { blankRoute } from '@/router/page'
NProgress.configure({ showSpinner: false });

/**
 * 导航守卫，相关内容可以参考:
 * https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
 */
function replaceLoginPage() {
  const path = window.location.hash.split('#')[1]
  let locationUrl
    if(window.location.host.match(RegExp(/com/))) {
        locationUrl = `http://console.idatatrust.com/#/login`
    }else {
        locationUrl = `${window.location.protocol}//${window.location.hostname}:38888/#/login`
    }
    window.name = `${window.location.origin}/#${path}`
    window.location.href = locationUrl
}


function getMenu(next, to) {
  store.dispatch("GetMenu", { type: true, id: -1 }).then(data => {
      if (data.length === 0) return next();
      router.$avueRouter.formatRoutes(data, true);
      router.addRoutes(blankRoute)
      next(to);
  });
}

router.beforeEach((to, from, next) => {

  // 缓冲设置
  if (
    to.meta.keepAlive === true &&
    store.state.tags.tagList.some(ele => {
      return ele.value === to.fullPath;
    })
  ) {
    to.meta.$keepAlive = true;
  } else {
    NProgress.start();
    if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
      to.meta.$keepAlive = true;
    } else {
      to.meta.$keepAlive = false;
    }
  }
  const meta = to.meta || {};
  if (store.getters.access_token) {
    if (to.path === "/login") {
      // next({ path: "/" });
      replaceLoginPage()
    } else {
      // NOTE: 当用户角色不存在时，会存在无限请求用户信息接口的问题
      if (store.getters.roles.length === 0) {
        store
          .dispatch("GetUserInfo")
          .then(() => {
            getMenu(next, to);
            store.dispatch("GetUserLogo")
          })
          .catch(() => {
            store.dispatch("FedLogOut").then(() => {
              // next({ path: "/login" });
              replaceLoginPage()
            });
          });
      } else {
        const value = to.query.src || to.fullPath;
        const label = to.query.name || to.name;

        // 针对外链跳转
        if (value.includes("http", "https")) {
          NProgress.done();
          window.open(value, label, "_blank");
          return;
        }

        if (
          meta.isTab !== false &&
          !validatenull(value) &&
          !validatenull(label)
        ) {
          store.commit("ADD_TAG", {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            group: router.$avueRouter.group || []
          });
        }
        next();
      }
    }
  } else {
    if (meta.isAuth === false) {
      next();
    } else {
      // next("/login");
      replaceLoginPage()
    }
  }
});

router.afterEach(() => {
  NProgress.done();
  const title = store.getters.tag.label;
  router.$avueRouter.setTitle(title);
});
