<template>
  <div class="music-list">
    <div class="music-header">
      <div class="music-back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="music-title" v-html="title"></div>
    </div>
    <div class="bg-image" :style="bgStyle" ref="bgImg" @click="random">
      <div class="muisc-play" v-show="songs.length" ref="playBtn">
        <i class="icon-play"></i>
        <span class="play-text">随机播放全部</span>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      class="song-list-wapper"
      ref="songwapper"
      :listenScroll="true"
      @scroll="scroll"
      :probeType="3"
    >
      <div class="item-wapper">
        <song-list :songs="songs" @select-song="selectSong"></song-list>
      </div>
      <div class="loading-content" v-if="!songs.length">
        <loading :data="songs"></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../base/scroll/scroll'
import SongList from '../../base/song-list/song-list'
import Loading from '../../base/loading/loading'
import { mapActions } from 'vuex'
import { playListMixin } from '@/common/js/mixin'

const HEADER_HEIGHT = 44

export default {
  mixins: [playListMixin],
  props: {
    singer: {
      type: Object,
      default: () => {
        return {}
      }
    },
    songs: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      bgStyle: {
        background: `url(${this.bgImage})`
      },
      scrollY: 0
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  created () {
  },
  mounted () {
    this._initSongWapperTop()
  },
  watch: {
    scrollY (newVal) {
      let translateY = Math.max(this.minTransalteY, newVal)
      let scale = 1
      this.$refs.layer.style.transform = `translate3d(0, ${translateY}px, 0)`
      let pencent = Math.abs(newVal / this.imageHeight)
      let zindex = 0
      if (newVal > 0) {
        scale = 1 + pencent
      }
      if (newVal < this.minTransalteY) {
        zindex = 11
        this.$refs.playBtn.style.display = 'none'
        this.$refs.bgImg.style.paddingTop = 0
        this.$refs.bgImg.style.height = `${HEADER_HEIGHT}px`
      } else {
        this.$refs.bgImg.style.paddingTop = '70%'
        this.$refs.bgImg.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImg.style.zIndex = zindex
      this.$refs.bgImg.style.transform = `scale(${scale})`
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.songwapper.$el.style.bottom = bottom
      this.$refs.songwapper.refresh()
    },
    _initSongWapperTop () {
      this.imageHeight = this.$refs.bgImg.clientHeight
      this.minTransalteY = -this.imageHeight + HEADER_HEIGHT
      this.$refs.songwapper.$el.style.top = `${this.imageHeight}px`
    },
    back () {
      this.$router.go(-1)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    selectSong (item, index) {
      this.selectPlaySong({
        list: this.songs,
        index: index
      })
    },
    random () {
      this.randomPlaySong({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlaySong',
      'randomPlaySong'
    ]),
    refresh () {
      this.$refs.songwapper.refresh()
    }
  }
}
</script>
<style lang="scss">
@import 'common/scss/variable.scss';

$header-height:44px;

.music-list{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index: 101;
  .music-header{
    height: $header-height;
    position: absolute;
    top:0;
    left:0;
    right:0;
    z-index:100;
    .music-back{
      color: $color-theme;
      position: absolute;
      top:50%;
      transform: translateY(-50%);
      left:15px;
    }
    .music-title{
      color: $color-text;
      text-align: center;
      height: 100%;
      line-height: $header-height;
    }
  }
  .bg-image{
    position: relative;
    top:0;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .muisc-play{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;
      font-size: $font-size-small;
      border: 1px solid $color-theme;
      height:30px;
      line-height:30px;
      padding:0 20px;
      border-radius: 15px;
      color: $color-theme;
      .play-text{
        margin-left: 3px;
      }
    }
  }
  .bg-layer{
      position: relative;
      height: 100%;
      background: $color-background;
      z-index: 9;
  }
  .song-list-wapper{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background: $color-background;
    // overflow: hidden;
  }
  .loading-content{
    position: absolute;
    top:44px;
    left:50%;
    transform: translateX(-50%);
    z-index: 99999;
  }
}
</style>
