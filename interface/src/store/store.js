import Vue from 'vue';
import Vuex from 'vuex';

import {getValues} from '../services/web3.js';

const ethereum = window.ethereum;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account : '',
    contractValues: {},
    errorMessage: '',
  },
  mutations: {
    UPDATE_FIELDS(state, payload) {
      state.contractValues = payload;
    },
    UPDATE_ACCOUNT(state, payload) {
      console.log(payload);
      state.account = payload;
    },
    UPDATE_ERROR(state, payload) {
      state.errorMessage = payload;
    }
  },
  actions: {
    async fetchValues(context) {
      const valuesObj = await getValues();
      context.commit("UPDATE_FIELDS", valuesObj)
      ;

      ethereum.on('accountsChanged', function(accounts) {
        console.log('accounts changed in store.js', accounts);
        context.commit("UPDATE_ACCOUNT", accounts[0]);
      })
    },
    setAccount(context, account) {
      context.commit("UPDATE_ACCOUNT", account);
    },
    setError(context, message) {
      context.commit("UPDATE_ERROR", message);
    }
  },
  getters: {
  },
});