<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="doct">
      <span class="doc"
      v-for="(item, index) in doct"
      :key="index"
      :class="currentIndex === index ? 'active': ''"
    ></span>
    </div>
  </div>
</template>
<script>
import { setTimeout, clearTimeout } from 'timers'
import { addClass } from 'common/js/dom'
import BScroll from 'better-scroll'
export default {
  name: 'Slider',
  data () {
    return {
      doct: [],
      currentIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      typ: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDoct()
      this._initSlider()
      this._autoPlay()

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    }, 20)
  },
  methods: {
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop, // 循环
          threshold: 0.3,
          speed: 400 // 轮播间隔
        }
      })
      this.slider.on('scrollEnd', (x, y) => {
        let pageIndex = this.slider.currentPage.pageX
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentIndex = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._autoPlay()
        }
      })
    },
    _setSliderWidth (isResize) {
      let width = 0
      this.children = this.$refs.sliderGroup.children
      this.sliderWidth = this.$refs.slider.clientWidth
      let length = this.$refs.sliderGroup.children.length
      for (let i = 0; i < length; i++) {
        addClass(this.children[i], 'slider-item')
        width += this.sliderWidth
        this.children[i].style.width = this.sliderWidth + 'px'
      }
      if (this.loop && !isResize) {
        width += 2 * this.sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDoct () {
      this.doct = new Array(this.children.length)
    },
    _autoPlay () {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>
<style lang="scss">
$w_100 : 100%;
.slider {
  min-height: 1px;
  position: relative;
  width: 100%;
  .slider-group {
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float:left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      img {
        width:$w_100
      }
    }
  }
  .doct{
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);
    .doc{
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background:#fff;
      opacity: 0.3;
      display: block;
      float: left;
      margin-right: 10px;
      &:last-child{
        margin-right: 0;
      }
      &.active{
        width: 20px;
        height: 10px;
        opacity: 1;
        border-radius: 5px;
      }
    }
  }
}
</style>
