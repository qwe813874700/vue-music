<template>
  <div class="progress-bar" ref="bar">
    <div class="bar-inner" ref="inner" @click="jumpSongToTime">
      <div class="progress"></div>
      <div class="progress-btn-wrapper" ref="wapper">
        <div class="progress-btn" @touchstart="startTouchBtn" @touchend="touchEndBtn"></div>
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
      innerWidth: 0,
      firstTouchPosX: 0,
      currentTouchPosX: 0,
      isMove: false
    }
  },
  mounted () {
    this.innerWidth = this.$refs.inner.offsetWidth - BTN_WIDTH
  },
  computed: {
    ...mapGetters([
      'currentSong'
    ])
  },
  methods: {
    _initWidthByTime (time) {
      let innerWidth = this.innerWidth // 计算当前inner宽度减去按钮宽度
      if (time > 0) {
        let progress = time / this.currentSong.duration // 计算当前百分比
        this._setWapperWidth(progress * innerWidth)
      } else {
        this._setWapperWidth(0)
      }
    },
    _setWapperWidth (width) {
      let innerWidth = this.innerWidth
      if (innerWidth < width) {
        width = innerWidth
      }
      this.$refs.wapper.style.width = `${width}px`
    },
    jumpSongToTime (e) {
      let innerWidth = this.innerWidth
      // 计算当前距离 当前 横坐标-盒子距离左边距离
      let wapperX = e.x - this.$refs.bar.offsetLeft
      wapperX = wapperX < 0 ? 0 : wapperX
      this._setWapperWidth(wapperX)
      let currX = wapperX / innerWidth
      currX = currX > 1 ? 1 : currX
      this.$emit('currentClickTime', currX * this.currentSong.duration)
    },
    startTouchBtn (e) {
      this.isMove = true // 当前是点击时 可移动滚动条
      this.firstTouchPosX = this.$refs.wapper.style.width.replace('px', '') // 获取当前wapper宽度就是当前获取的坐标
      this.touchBtn = document.addEventListener('touchmove', this.touchMoveBtn)
      document.addEventListener('touchend', this.touchMoveBtn)
    },
    touchMoveBtn (e) {
      if (!this.isMove) {
        return
      }
      this.currentTouchPosX = e.touches[0].pageX - this.$refs.bar.offsetLeft // 获取当前移动到的位置
      if (this.currentTouchPosX < 0) {
        this.currentTouchPosX = 0
      } else if (this.currentTouchPosX > this.innerWidth) {
        this.currentTouchPosX = this.innerWidth
      } else {
        this.currentTouchPosX = this.currentTouchPosX
      }
      this._setWapperWidth(this.currentTouchPosX)
      this.$emit('')
    },
    touchEndBtn (e) {
      this.isMove = false
      this.$emit('currentClickTime', this.currentTouchPosX / this.innerWidth * this.currentSong.duration)
      document.removeEventListener('touchmove', this.touchBtn, false)
    }
  },
  watch: {
    currentTime (newTime) {
      if (this.isMove) {
        return
      }
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
