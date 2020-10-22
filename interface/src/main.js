import Vue from "vue";

import App from "./App.vue";

import store from './store/store';
import router from './router';

new Vue({
  store,
  render: h => h(App),
  router
}).$mount("#app");
