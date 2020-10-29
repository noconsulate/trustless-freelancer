import Vue from "vue";
import VueRouter from "vue-router";

import App from "./App.vue";
import Logs from "./pages/Logs.vue";
import MerchantView from "./pages/MerchantView.vue";
import Contract from "./pages/Contract.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/merchant", component: MerchantView, name: "merchant" },
  { path: "/logs", component: Logs, name: "logs" },
  { path: "/contract", component: Contract, name: "contract" },
];

export default new VueRouter({
  mode: "history",
  routes,
});
