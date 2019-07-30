import Vue from 'vue'
import Vuex from 'vuex'
import singer from './modules/singer'
import player from './modules/player'
import disc from './modules/disc'
import rank from './modules/rank'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    singer,
    player,
    disc,
    rank
  }
})
