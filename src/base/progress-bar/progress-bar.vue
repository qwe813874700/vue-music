<template>
  <div class="progress-bar" ref="bar">
    <div class="bar-inner" ref="inner" @click="jumpSongToTime">
      <div class="progress"></div>
      <div class="progress-btn-wrapper" ref="wapper">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const BTN_WIDTH = 15

export default {
  props: {
    currentTime: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      innerWidth
    }
  },
  computed: {
    ...mapGetters([
      'currentSong'
    ])
  },
  methods: {
    _initWidthByTime (time) {
      let innerWidth = this.$refs.inner.offsetWidth - BTN_WIDTH // 计算当前inner宽度减去按钮宽度
      if (time > 0) {
        let progress = time / this.currentSong.duration // 计算当前百分比
        this._setWapperWidth(progress * innerWidth)
      } else {
        this._setWapperWidth(0)
      }
    },
    _setWapperWidth (width) {
      let innerWidth = this.$refs.inner.offsetWidth - BTN_WIDTH
      if (innerWidth < width) {
        width = innerWidth
      }
      this.$refs.wapper.style.width = `${width}px`
    },
    jumpSongToTime (e) {
      let innerWidth = this.$refs.inner.offsetWidth - BTN_WIDTH
      // 计算当前距离 当前 横坐标-盒子距离左边距离
      let wapperX = e.x - this.$refs.bar.offsetLeft
      wapperX = wapperX < 0 ? 0 : wapperX
      this._setWapperWidth(wapperX)
      let currX = wapperX / innerWidth
      currX = currX > 1 ? 1 : currX
      this.$emit('currentClickTime', currX * this.currentSong.duration)
    }
  },
  watch: {
    currentTime (newTime) {
      this._initWidthByTime(newTime)
    }
  }
}
</script>
<style lang="scss">
@import 'common/scss/variable';
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      width: 0;
      height: 100%;
      background: $color-theme;
      border-radius: 5px;
      position: relative;
      .progress-btn{
        width:15px;
        height:15px;
        border-radius: 50%;
        background: #fff;
        position: absolute;
        top:50%;
        transform: translateY(-50%);
        right: -15px;
      }
    }
  }
}
</style>
