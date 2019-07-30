<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getSongListByTopId } from 'api/rank'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

export default {
  computed: {
    title () {
      return this.rank.topTitle
    },
    bgImage () {
      return this.rank.picUrl
    },
    ...mapGetters([
      'rank'
    ])
  },
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.rank.id) {
        this.$router.push('/recommend')
        return
      }
      getSongListByTopId(this.rank.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData.data)) {
          ret.push(createSong(musicData.data))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="scss">
.slide-enter-active, .slide-leave-active{
  transition: all 0.3s

}
.slide-enter, .slide-leave-to{
  transform: translate3d(100%, 0, 0)
}
</style>
