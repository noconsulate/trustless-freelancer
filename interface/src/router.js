import Vue from "vue";
import VueRouter from "vue-router";

import Splash from "./pages/Splash.vue";
import App from "./App.vue";
import Logs from "./pages/Logs.vue";
import MerchantView from "./pages/MerchantView.vue";
import ClientView from "./pages/ClientView.vue";
import Contract from "./pages/Contract.vue";
import CreateInvoice from "./pages/CreateInvoice/CreateInvoice";
import Invoice from "./pages/Invoice";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Splash, name: "splash" },
  { path: "/merchant", component: MerchantView, name: "merchant" },
  { path: "/client", component: ClientView, name: "client" },
  { path: "/logs", component: Logs, name: "logs" },
  { path: "/contract", component: Contract, name: "contract" },
  { path: "/create_invoice", component: CreateInvoice, name: "createInvoice" },
  { path: "/invoice", component: Invoice, name: "invoice" },
];

export default new VueRouter({
  mode: "history",
  routes,
});
