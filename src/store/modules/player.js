import * as types from '../mutations-type'

const music = {
  state: {
    playing: false, // 记录当前是否播放
    fullScreen: false, // 当前是否全屏
    playList: [], // 当前需要播放的歌曲
    sequenceList: [], // 随机播放的歌曲,
    mode: 1,
    currentIndex: -1
  },
  getters: {
    playing: state => state.playing,
    fullScreen: state => state.fullScreen,
    playList: state => state.playList,
    sequeceList: state => state.sequeceList,
    mode: state => state.mode,
    currentIndex: state => state.currentIndex,
    currentSong: (state) => {
      return state.playList[state.currentIndex]
    }
  },
  mutations: {
    [types.SET_PLAYING]: (state, data) => {
      state.playing = data
    },
    [types.SET_FULL_SCREEN]: (state, data) => {
      state.fullScreen = data
    },
    [types.SET_PLAY_LIST]: (state, data) => {
      state.playList = data
    },
    [types.SET_SEQUENCE_LIST]: (state, data) => {
      state.playing = data
    },
    [types.SET_MODE]: (state, data) => {
      state.mode = data
    },
    [types.SET_CURRENT_INDEX]: (state, data) => {
      state.currentIndex = data
    }
  },
  actions: {
    selectPlaySong: ({commit, state}, {list, index}) => {
      commit(types.SET_PLAYING, true)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAY_LIST, list)
      commit(types.SET_SEQUENCE_LIST, list)
      commit(types.SET_CURRENT_INDEX, index)
    }
  }
}
export default music
