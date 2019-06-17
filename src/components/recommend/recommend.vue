<template>
  <div class="m-recommend">
    <scroll :data="discList" class="recommend-content" ref="scroll">
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
            <li v-for="(item, index) in discList" :key="index">
              <div class="recommend-box">
                <div class="recommend-img">
                  <img  v-lazy="item.cover"  width="60" height="60" alt="">
                </div>
                <div class="recommend-text">
                  <p class="text-top">{{ item.title }}</p>
                  <p class="text-bottom">播放量:{{ item.listen_num }}</p>
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
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'api/recommend.js'
import Slider from '../../base/slider/slider'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'

export default {
  name: 'Recommend',
  data () {
    return {
      bannerList: [],
      discList: []
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created () {
    this.getRecommendList()
    setTimeout(() => {
      this.getDiscListByrecommend()
    }, 2000)
  },
  methods: {
    getRecommendList () {
      getRecommend().then((res) => {
        if (res.code === 0) {
          this.bannerList = res.data.slider
        }
      })
    },
    getDiscListByrecommend () {
      getDiscList().then((res) => {
        if (res.code === 0 && res.recomPlaylist.code === 0) {
          this.discList = res.recomPlaylist.data.v_hot
        }
      })
    },
    loadImage () {
      if (this.checkLoadImage) {
        this.$refs.scrol.refresh()
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
              img{
              }
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
