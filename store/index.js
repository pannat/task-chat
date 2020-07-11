import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default () => new Vuex.Store({
  state: {
    userName: localStorage.getItem('userName')
  },
  mutations: {
    SET_NAME: (state, name) => {
      state.userName = name
      localStorage.setItem('userName', name)
    }
  },
  actions: {
    setName({commit}, name) {
      commit('SET_NAME', name)
    }},
  getters: {
    userName: state => state.userName
  }
});


