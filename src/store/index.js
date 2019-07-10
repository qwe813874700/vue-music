import Vue from 'vue'
import Vuex from 'vuex'
import singer from './modules/singer'
import player from './modules/player'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    singer,
    player
  }
})
