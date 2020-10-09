import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    contractValues: {},
  },
  mutations: {
    UPDATE_FIELDS(state, payload) {
      state.contractValues = payload;
    }
  },
  actions: {
    updateFields(context, values) {
      context.commit("UPDATE_FIELDS", values);
    }
  },
  getters: {

  },
});