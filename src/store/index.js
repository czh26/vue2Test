import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getter'
Vue.use(Vuex)
const sotre = new Vuex.Store({
  state: {
    user: 1
  },
  getters,
  mutations: {
    add (state, param) {
      state.user++
    }
  },
  actions: {},
  modules: {}
})
export default sotre
