<template>
  <div class="singer-detail">
    <music-list :songs="songList" :title="singer.name" :bg-image="singer.avatar"></music-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'
import MusicList from '../music-list/music-list'
import { ERR_OK } from 'api/config'

export default {
  name: 'SingerDetail',
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  data () {
    return {
      songList: []
    }
  },
  components: {
    MusicList
  },
  created () {
    this._getSongListBySinger(this.singer.id)
    console.log(this.singer)
  },
  mounted () {
  },
  methods: {
    _getSongListBySinger (singerId) {
      if (!singerId) {
        this.$router.push('../singer')
        return
      }
      getSingerDetail(singerId).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
            this.songList = songs
          })
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style lang="scss">
  @import 'common/scss/variable.scss';

  .singer-detail{
    position: fixed;
    z-index: 100;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    background: $color-background;
  }
</style>
