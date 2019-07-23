<template>
  <div class="m-recommend">
    <scroll :data="discList" class="recommend-content" ref="scroll" v-show="songList.length == 0">
      <div>
        <slider v-if="bannerList.length">
          <div
            v-for="(item, index) in bannerList"
            :key="index"
          >
            <router-link  to="/">
              <img :src="item.picUrl" alt="" @load="loadImage">
            </router-link>
          </div>
        </slider>
        <div class="reccommend-list">
          <div class="reccommend-title">
            <p class="title">热门歌单推荐</p>
          </div>
          <ul v-show="discList.length">
            <li v-for="item in discList" :key="item.dissid" @click="getSongsByDissid(item)">
              <div class="recommend-box">
                <div class="recommend-img">
                  <img  v-lazy="item.imgurl"  width="60" height="60" alt="">
                </div>
                <div class="recommend-text">
                  <p class="text-top">{{ item.dissname }}</p>
                  <p class="text-bottom">播放量:{{ item.listennum }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loadding-content" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'api/recommend.js'
import Slider from '../../base/slider/slider'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import { playListMixin } from '@/common/js/mixin'
import { ERR_OK } from '@/api/config'
import MusicList from '@/components/music-list/music-list'
import { mapMutations } from 'vuex'

export default {
  name: 'Recommend',
  mixins: [playListMixin],
  data () {
    return {
      bannerList: [],
      discList: [],
      songList: [],
      dissObj: {}
    }
  },
  components: {
    Slider,
    Scroll,
    Loading,
    MusicList
  },
  created () {
    this.getRecommendList()
    setTimeout(() => {
      this.getDiscListByrecommend()
    }, 60)
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    getRecommendList () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.bannerList = res.data.slider
        }
      })
    },
    getDiscListByrecommend () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    getSongsByDissid (disc) {
      this.$router.push({
        path: `/recommend/${disc.dissid}`
      })
      this.SET_DISC(disc)
    },
    ...mapMutations([
      'SET_DISC'
    ]),
    loadImage () {
      if (this.checkLoadImage) {
        this.$refs.scroll.refresh()
      }
    }
  }
}
</script>

<style lang="scss" scope>
@import '../../common/scss/variable.scss';
.m-recommend{
  position: fixed;
  top: 100px;
  bottom: 0;
  left:0;
  right:0;
  .recommend-content{
    height:100%;
    overflow: hidden;
    .reccommend-list{
      .reccommend-title{
        text-align: center;
        color: $color-theme;
        font-size: $font-size-medium;
        padding: 25px
      }
      ul{
        padding:0 20px 20px 20px;
        li{
          margin-top:10px;
          .recommend-box {
            display: flex;
            align-items: center;
            .recommend-img{
              padding-right:20px;
            }
            .recommend-text{
              display: flex;
              flex-direction: column;
              justify-items: center;
              flex:1;
              line-height: 20px;
              .text-top{
                color: $color-text;
                font-size: $font-size-medium ;
                margin-bottom:20px;
              }
              .text-bottom{
                color: $color-text-d;
                font-size: $font-size-medium;
              }
            }
          }
        }
      }
    }
    .loadding-content{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%)
    }
  }
}
</style>
