import Vue from "vue";
import VueRouter from 'vue-router';


import App from "./App.vue";
import Logs from './pages/Logs.vue'
import OwnerView from './pages/OwnerView.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: OwnerView },
  { path: '/logs', component: Logs },
];

export default new VueRouter({
  mode: 'history',
  routes
});