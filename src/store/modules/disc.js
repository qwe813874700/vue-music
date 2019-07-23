import * as types from '../mutations-type'

const disc = {
  state: {
    disc: {}
  },
  getters: {
    disc: state => state.disc
  },
  mutations: {
    [types.SET_DISC]: (state, data) => {
      state.disc = data
    }
  },
  actions: {}
}
export default disc
