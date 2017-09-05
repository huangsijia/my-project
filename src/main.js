// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from "vue-router";

window.Vue = Vue;
Vue.use(VueRouter);
import routerOption from './router.js'
const router = new VueRouter(routerOption);

window.Hub = new Vue();

Vue.config.productionTip = false

/* eslint-disable no-new */
const app = new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')