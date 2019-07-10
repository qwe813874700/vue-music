import * as types from '../mutations-type'

const singer = {
  state: {
    singer: {}
  },
  getters: {
    singer: state => state.singer
  },
  mutations: {
    [types.SET_SINGER]: (state, data) => {
      state.singer = data
    }
  },
  actions: {}
}
export default singer
