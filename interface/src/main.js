import Vue from "vue";

import App from "./App.vue";

import store from "./store/store";
import router from "./router";
import "./assets/tailwind.css";

Vue.config.devtools = true;

new Vue({
  store,
  render: (h) => h(App),
  router,
}).$mount("#app");
