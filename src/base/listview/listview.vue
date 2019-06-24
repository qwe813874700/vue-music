<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="3" @scrolls="scroll">
    <ul class="listview-content">
      <li class="list-content" v-for="item in data" :key="item.title" ref="listGroup">
        <h2 class="listview-title">{{ item.title }}</h2>
        <ul  class="list">
          <li v-for="(group, index) in item.items" :key="index" class="list-group-item">
            <img v-lazy="group.avatar" alt="">
            <span class="name">{{ group.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="index-content">
      <ul class="index">
        <li class="index-gourp-item"
        v-for="(item, index) in showIndexList"
        :key="index" :data-index="index"
        @touchstart.stop.prevent="touchToGroup"
        @touchmove.stop.prevent="touchMoveToGroup"
        :class="{'current': index === currentIndex}"
      >
        {{ item }}
      </li>
      </ul>
    </div>
    <div class="list-fixed"
      v-show="fixedTopTitle"
      ref="fixedTop"
    >
      <h1 class="fixed-title">
        {{ fixedTopTitle }}
      </h1>
    </div>
    <div class="loading-content">
      <loading v-if="!data.length"></loading>
    </div>
  </scroll>
</template>

<script>

import Scroll from '../scroll/scroll'
import { getData } from '../../common/js/dom'
import Loading from '../loading/loading'

const INDEX_HEIGHT = 18
const TITLE_HEIGHT = 40

export default {
  name: 'listview',
  created () {
    this.touches = {}
    this.listHeight = []
  },
  data () {
    return {
      listenScroll: true,
      scrollY: 0,
      currentIndex: 0,
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
    showIndexList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTopTitle () {
      if (this.scrollY <= 0) {
        return ''
      }
      return this.data[this.currentIndex].title ? this.data[this.currentIndex].title : '热门'
    }
  },
  watch: {
    data (val) {
      setTimeout(() => {
        this._groupHeight()
      }, 20)
    },
    scrollY (val) {
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (!height2 || (val >= height1 && val < height2)) {
          this.currentIndex = i
          this.diff = height2 - val
          return
        }
        if (val <= 0) {
          this.currentIndex = 0
          return
        }
      }
      this.currentIndex = 0
    },
    diff (val) {
      let fixedTop = (val > 0 && val < TITLE_HEIGHT) ? val - TITLE_HEIGHT : 0
      this.$refs.fixedTop.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  methods: {
    touchToGroup (e) {
      let index = getData(e.target, 'index') // 获取当前点击的data-index
      this.touches.y1 = e.touches[0].pageY
      this.touches.index = Number(index)
      this._ScrollTo(index)
    },
    touchMoveToGroup (e) {
      this.touches.y2 = e.touches[0].pageY
      let subPageY = Math.floor((this.touches.y2 - this.touches.y1) / INDEX_HEIGHT) + this.touches.index
      this._ScrollTo(subPageY)
    },
    scroll (pos) {
      this.scrollY = -pos.y
    },
    _ScrollTo (index) {
      if (index < 0) {
        return
      } else if (index > this.$refs.listGroup.length) {
        return
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // 跳转到当前点击的listGroup
    },
    _groupHeight () {
      this.listHeight = []
      let group = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < group.length; i++) {
        const item = group[i].clientHeight
        height += item
        this.listHeight.push(height)
      }
    }
  }
}
</script>

<style lang="scss" scope>
@import 'common/scss/variable';
.listview{
  position: fixed;
  top: 100px;
  bottom: 0;
  left:0;
  right:0;
  overflow: hidden;
  .listview-content{
    .list-content{
      .listview-title{
        height:40px;
        line-height: 40px;
        padding-left:15px;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-medium;
      }
      .list{
        .list-group-item{
          display: flex;
          align-items: center;
          padding:0 20px 20px 20px;
          &:first-child{
            padding-top:20px;
          }
          img{
            width:55px;
            height:55px;
            border-radius: 50%;
          }
          .name{
            margin-left:15px;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .index-content{
    width:20px;
    position: absolute;
    right:0;
    top:50%;
    text-align: center;
    transform: translateY(-50%);
    padding: 20px 0;
    background: $color-highlight-background;
    border-radius: 10px;
    .index{
      .index-gourp-item{
        color: $color-text-d;
        padding: 3px;
        font-size: $font-size-small;
        &.current{
          color: $color-theme
        }
      }
    }
  }
  .list-fixed{
    position: absolute;
    top:0;
    left:0;
    right:0;
    .fixed-title{
      height:40px;
      line-height: 40px;
      padding-left:15px;
      background: $color-highlight-background;
      color: $color-text-d;
      font-size: $font-size-medium;
    }
  }
}
</style>
