import Vue from 'vue';
import Vuex from 'vuex';

import {getValues, getClients} from '../services/web3.js';

const ethereum = window.ethereum;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account : 'please enable ethereum',
    contractValues: {},
    errorMessage: '',
    txHash: '',
    clients: [],
  },
  mutations: {
    UPDATE_FIELDS(state, payload) {
      state.contractValues = payload;
    },
    UPDATE_CLIENTS(state, payload) {
      //i think my warning is coming from here
      console.log(payload);
      state.clients = payload;
    },
    UPDATE_ACCOUNT(state, payload) {
      console.log(payload);
      state.account = payload;
    },
    UPDATE_ERROR(state, payload) {
      state.errorMessage = payload;
    },
    UPDATE_TXHASH(state, payload) {
      state.txHash = payload;
    }
  },
  actions: {
    async fetchValues(context) {
      // const valuesObj = await getValues();
      // context.commit("UPDATE_FIELDS", valuesObj)
      // ;

      const clientsArray = await getClients();
      context.commit("UPDATE_CLIENTS", clientsArray);


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
    },
    setTxHash(context, hash) {
      context.commit("UPDATE_TXHASH", hash);
    }
  },
  getters: {
  },
});