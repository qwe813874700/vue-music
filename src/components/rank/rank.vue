<template>
  <div class="m-rank">
    <scroll class="rank-list">
      <ul>
        <li class="item" v-for="item in rankList" :key="item.id"  @click="selectRank(item)">
            <div class="item-image">
              <img v-lazy="item.picUrl" alt="">
            </div>
            <ul class="songlist">
              <li class="song"
                v-for="(list, index) in item.songList"
                :key="index"
              >
                {{ getSortSong(index, list.singername, list.songname) }}
              </li>
            </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
    <div class="loading-content" v-if="!rankList.length">
      <loading :data="rankList"></loading>
    </div>
  </div>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import { getRankList } from '@/api/rank'
import { mapMutations } from 'vuex'
import Loading from '../../base/loading/loading'

export default {
  name: 'Rank',
  data () {
    return {
      rankList: []
    }
  },
  components: {
    Scroll,
    Loading
  },
  created () {
    setTimeout(() => {
      this.getRankList()
    }, 1000)
  },
  methods: {
    getRankList () {
      getRankList().then(res => {
        if (res.code === 0) {
          this.rankList = res.data.topList
        }
      })
    },
    getSortSong (index, singName, songName) {
      return `${index + 1}.${singName}-${songName}`
    },
    selectRank (rank) {
      console.log(rank)
      this.$router.push({
        path: `/rank/${rank.id}`
      })
      this.SET_RANK(rank)
    },
    ...mapMutations([
      'SET_RANK'
    ])
  }
}
</script>

<style lang="scss" scope>
  @import '@/common/scss/variable';
  .m-rank{
    position: fixed;
    top: 100px;
    bottom: 0;
    left: 0;
    right: 0;
    .rank-list{
      height:100%;
      overflow: hidden;
      .item{
        padding-top:20px;
        margin: 0 20px;
        height:100px;
        display: flex;
        .item-image{
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .songlist{
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: $color-highlight-background;
          color: $color-text-d;
          font-size: $font-size-small;
          .song{
            line-height: 26px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
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
