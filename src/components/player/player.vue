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
        <div class="middle">
          <div class="middle_left">
            <div class="cd-wapper" v-if="currentSong.image" ref="cd-wapper">
              <div class="cd play" :class="cdRotate">
                <img :src="currentSong.image" class="image" alt="">
              </div>
            </div>
            <div class="cd-lyric">明明很爱你</div>
          </div>
          <div class="middle_right"></div>
        </div>
        <div class="bottom">
          <div class="index-wapper">
            <span class="index"></span>
            <span class="index"></span>
          </div>
          <div class="progress-wapper">
            <div class="time time_l">{{ format(currentTime) }}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :currentTime="currentTime" @currentClickTime="jumpTimeByClick"></progress-bar>
            </div>
            <div class="time time_r">{{ format(currentSong.duration) }}</div>
          </div>
          <div class="btn-wapper">
            <div class="icon icon-left">
              <i class="icon-sequence"></i>
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
            <div class="img-wapper" @click="getNomarl" :class="cdRotate">
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
    ></audio>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import progressBar from '@/base/progress-bar/progress-bar'
export default {
  name: 'player',
  data () {
    return {
      songReady: false,
      currentTime: 0
    }
  },
  components: {
    progressBar
  },
  computed: {
    cdRotate () {
      return this.playing ? '' : 'pause'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex'
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
      this.SET_PLAYING(!this.playing)
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
      this.$refs.audio.currentTime = time
    },
    ...mapMutations([
      'SET_FULL_SCREEN',
      'SET_PLAYING',
      'SET_CURRENT_INDEX'
    ])
  },
  watch: {
    currentSong (newVal) {
      this.$nextTick(() => {
        this.$refs.audio.play()
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
