<template>
  <div class="singer-detail">
    <music-list :singer="singer" :songs="songList"></music-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong } from 'common/js/song'
import MusicList from '../music-list/music-list'

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
        if (res.code === 0) {
          this.songList = this._normalSongData(res.data.list)
          console.log(this.songList)
        }
      })
    },
    _normalSongData (list) {
      let ret = []
      list.forEach(item => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
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
