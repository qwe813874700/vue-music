import * as types from '../mutations-type'

const rank = {
  state: {
    rank: {}
  },
  getters: {
    rank: state => state.rank
  },
  mutations: {
    [types.SET_RANK]: (state, data) => {
      state.rank = data
    }
  },
  actions: {}
}
export default rank
