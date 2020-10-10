import Vue from 'vue';
import Vuex from 'vuex';

import {getValues} from '../services/web3.js';

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
    },
    async fetchValues(context) {
      const valuesObj = await getValues();
      context.commit("UPDATE_FIELDS", valuesObj);
    }
  },
  getters: {

  },
});