const singer = {
  state: {
    singer: {}
  },
  getters: {
    singer: state => state.singer
  },
  mutations: {
    SET_SINGER: (state, data) => {
      state.singer = data
    }
  },
  actions: {}
}
export default singer
