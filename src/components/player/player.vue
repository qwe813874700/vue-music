<template>
  <div class="player" v-if="currentSong">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="big-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle_left" ref="middleLeft">
            <div class="cd-wapper" v-if="currentSong.image" ref="cd-wapper">
              <div class="cd play" :class="cdRotate">
                <img :src="currentSong.image" class="image" alt="">
              </div>
            </div>
            <div class="cd-lyric">{{ currentShowLric }}</div>
          </div>
          <scroll class="middle_right" v-if="currentLyric" :data="currentLyric.lines" ref="lyricWapper">
            <div class="lyric-wapper">
              <p
                v-for="(item, index) in currentLyric.lines"
                :key="item.time"
                :class="{'active': currentLineNum == index}"
                ref="lyricText"
              >{{ item.txt }}</p>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="index-wapper">
            <span class="index" :class="{'active': currentShow === 'cd'}"></span>
            <span class="index" :class="{'active': currentShow !== 'cd'}"></span>
          </div>
          <div class="progress-wapper">
            <div class="time time_l">{{ format(currentTime) }}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :currentTime="currentTime" @currentClickTime="jumpTimeByClick"></progress-bar>
            </div>
            <div class="time time_r">{{ format(currentSong.duration) }}</div>
          </div>
          <div class="btn-wapper">
            <div class="icon icon-left" @click="changePlayMode">
              <i :class="modeIcon"></i>
            </div>
            <div class="icon icon-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon icon-center" @click="playSong">
              <i :class="playIcon"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen">
        <div class="mini-left">
          <div class="icon">
            <div class="img-wapper play" @click="getNomarl" :class="cdRotate">
              <img :src="currentSong.image" alt="">
            </div>
          </div>
          <div class="text">
            <h2 class="name">{{ currentSong.name }}</h2>
            <p class="desc">{{ currentSong.singer }}</p>
          </div>
        </div>
        <div class="mini-right">
          <div class="control" @click="playSong">
            <i :class="playIcon"></i>
          </div>
          <div class="control">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </div>
    </transition>
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="endPlayMusic"
    ></audio>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import progressBar from '@/base/progress-bar/progress-bar'
import { playMode } from '@/api/config'
import { shuffle } from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from '@/base/scroll/scroll'

export default {
  name: 'player',
  data () {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      currentShowLric: '',
      touch: {
        pageX: 0,
        pageY: 0,
        detailX: 0,
        detailY: 0
      }
    }
  },
  components: {
    progressBar,
    Scroll
  },
  computed: {
    cdRotate () {
      return this.playing ? '' : 'pause'
    },
    modeIcon () {
      return this.mode === playMode.loop ? 'icon-loop' : this.mode === playMode.random ? 'icon-random' : 'icon-sequence'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequeceList'
    ])
  },
  methods: {
    back () {
      this.SET_FULL_SCREEN(false)
    },
    ready () {
      this.songReady = true
    },
    error () {},
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (interval) {
      interval = interval | 0
      let min = Math.floor(interval / 60)
      let second = interval % 60
      return `${min}:${second < 10 ? '0' + second : second}`
    },
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        preset: {
          duration: 400,
          esaing: 'linear'
        }
      })

      animations.runAnimation(this.$refs['cd-wapper'], 'move', done)
    },
    afterEnter (el) {
      this.$refs['cd-wapper'].style.animation = ''
      animations.registerAnimation('move')
    },
    leave (el, done) {
      this.$refs['cd-wapper'].style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs['cd-wapper'].style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs['cd-wapper'].addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs['cd-wapper'].style.transition = ''
      this.$refs['cd-wapper'].style.transform = ''
    },
    _getPosAndScale () {
      const tragetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = tragetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingBottom - paddingTop - width / 2
      return {
        x,
        y,
        scale
      }
    },
    getNomarl () {
      this.SET_FULL_SCREEN(true)
    },
    playSong () {
      const playing = !this.playing
      this.SET_PLAYING(playing)
      playing ? this.currentLyric.play() : this.currentLyric.stop()
    },
    next () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.SET_CURRENT_INDEX(index)
      this.autoPlaySong()
      this.songReady = false
    },
    prev () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.SET_CURRENT_INDEX(index)
      this.autoPlaySong()
      this.songReady = false
    },
    autoPlaySong () {
      if (!this.playing) {
        this.SET_PLAYING(true)
      }
    },
    jumpTimeByClick (time) {
      const currentTime = time
      this.$refs.audio.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    changePlayMode () {
      const mode = (this.mode + 1) % 3
      this.SET_MODE(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequeceList)
      } else {
        list = this.sequeceList
      }
      this.resetIndex(list)
      this.SET_PLAY_LIST(list)
    },
    resetIndex (list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.SET_CURRENT_INDEX(index)
    },
    ...mapMutations([
      'SET_FULL_SCREEN',
      'SET_PLAYING',
      'SET_CURRENT_INDEX',
      'SET_MODE',
      'SET_PLAY_LIST'
    ]),
    endPlayMusic () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    getLyric () {
      this.currentSong.getLyric().then(res => {
        this.currentLyric = new Lyric(res, this.lyricHandle)
        if (this.playing) {
          this.currentLyric.play()
        }
      })
    },
    lyricHandle ({lineNum, text}) {
      this.currentShowLric = this.currentLyric.lines[lineNum].txt
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lyricText = this.$refs.lyricText[this.currentLineNum - 5]
        this.$refs.lyricWapper.scrollToElement(lyricText, 1000)
      } else {
        let lyricText = this.$refs.lyricText[0]
        this.$refs.lyricWapper.scrollToElement(lyricText, 1000)
      }
    },
    middleTouchStart (e) {
      const touch = e.touches[0]
      this.isMiddleStart = true
      this.touch.pageX = touch.pageX
      this.touch.pageY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.isMiddleStart) {
        return
      }
      const touch = e.touches[0]
      this.touch.detailX = touch.pageX - this.touch.pageX
      this.touch.detailY = touch.pageY - this.touch.pageY
      this.isMove = Math.abs(this.touch.detailX) > Math.abs(this.touch.detailY)
      if (!this.isMove) {
        return
      }
      if ((this.currentShow === 'cd' && this.touch.detailX > 0) || (this.currentShow !== 'cd' && this.touch.detailX < 0)) {
        return
      }
      this.touch.percen = Math.abs(this.touch.detailX / window.innerWidth)
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + this.touch.detailX))
      this.$refs.lyricWapper.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.middleLeft.style.opacity = 1 - this.touch.percen
      this.$refs.middleLeft.style.transition = 'all .3s'
    },
    middleTouchEnd (e) {
      let offsetWidth = 0
      if (!this.isMove) {
        return
      }
      if (this.currentShow === 'cd') {
        if (this.touch.detailX > 0) {
          return
        }
        if (this.touch.percen > 0.1) {
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
          this.$refs.middleLeft.style.opacity = 0
        } else {
          offsetWidth = 0
        }
      } else {
        if (this.touch.detailX < 0) {
          return
        }
        if (this.touch.percen < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          this.$refs.middleLeft.style.opacity = 1
        } else {
          offsetWidth = window.innerWidth
        }
      }
      this.$refs.lyricWapper.$el.style.transition = 'all .3s'
      this.$refs.lyricWapper.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    currentSong (newVal, oldVal) {
      if (oldVal && newVal.id === oldVal.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.getLyric()
      })
    },
    playing (newVal) {
      this.$nextTick(() => {
        let audio = this.$refs.audio
        newVal ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style lang="scss" scope>
@import 'common/scss/variable';
.player{
  .background{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: .6;
    filter: blur(20px);
    img{
      width:100%;
      height:100%;
    }
  }
  .big-player{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background: $color-highlight-background;
    .top{
      position: relative;
      margin-bottom: 20px;
      .back{
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back{
          display: block;
          padding: 9px;
          font-size: 22px;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title{
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 18px;
        color: #fff;
      }
      .subtitle{
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #fff;
      }
    }
    .middle{
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      text-align: center;
      .middle_left{
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wapper{
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            &.play{
              animation: rotate 20s linear infinite;
            }
            &.pause{
              animation-play-state: paused;
            }
            .image{
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid hsla(0,0%,100%,.1);
            }
          }
        }
        .cd-lyric{
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: hsla(0,0%,100%,.5);
          text-align: center;
          margin-top:30px;
        }
      }
      .middle_right{
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wapper{
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
        }
        p {
          line-height: 32px;
          color: hsla(0,0%,100%,.5);
          font-size: 14px;
          &.active{
            color: #fff;
          }
        }
      }
    }
    .bottom{
      position: absolute;
      bottom: 50px;
      width: 100%;
      .index-wapper{
        text-align: center;
        font-size: 0;
        .index{
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: hsla(0,0%,100%,.5);
          &.active{
            background: #fff;
            width:20px;
            border:10px;
          }
        }
        .index.active{
          width: 20px;
          border-radius: 5px;
          background: hsla(0,0%,100%,.8);
        }
      }
      .progress-wapper{
        display: flex;
        align-items: center;
        width: 90%;
        margin: 0 auto;
        padding: 10px 0;
        .time{
          color: #fff;
          font-size: 12px;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
        }
        .time_l{
          text-align: left;
        }
        .time_r{
          text-align: right;
        }
        .progress-bar-wrapper{
          flex:1;
        }
      }
      .btn-wapper{
        display: flex;
        justify-content: space-around;
        align-items: center;
        .icon{
          font-size:30px;
          color: $color-theme;
        }
        .icon-center{
          font-size: 40px;
        }
      }
    }
    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player{
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: #333;
    align-items: center;
    justify-content: space-between;
    .mini-left{
      display: flex;
      align-items: center;
      .icon{
        width: 40px;
        height: 40px;
        padding: 0 10px 0 20px;
        .img-wapper{
          width:100%;
          height:100%;
          &.play{
            animation: rotate 20s linear infinite;
          }
          &.pause{
            animation-play-state: paused;
          }
          img{
            width:100%;
            height:100%;
            border-radius: 50%;
          }
        }
      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 20px;
        .name{
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: $font-size-medium;
        }
        .desc{
          font-size: $font-size-small;
          color:$color-text-d;
        }
      }
    }
    .mini-right{
      display: flex;
      .control{
        flex: 0 0 30px;
        padding: 0 10px;
        font-size:30px;
        color: $color-theme;
      }
    }
  }
  @keyframes rotate {
    0%{
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
    }
  }
}
</style>
