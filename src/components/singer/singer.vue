<template>
  <div class="m-singer">
    <list-view :data="singerList" @select-singer="selectSinger"></list-view>
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>

import { getSingerList } from 'api/singer'
import ListView from '@/base/listview/listview'
import { mapMutations } from 'vuex'
const HOT_NAME = '热门'

const HOT_LEN = 10

export default {
  name: 'Singer',
  data () {
    return {
      singerList: []
    }
  },
  created () {
    this._initSingerList()
  },
  methods: {
    _initSingerList () {
      getSingerList().then(res => {
        if (res.code === 0) {
          this.singerList = this._normalSingerList(res.data.list)
        }
      })
    },
    _normalSingerList (list) {
      let map = {
        hot: {
          items: [],
          title: HOT_NAME
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_LEN) {
          map.hot.items.push({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
          map[key].items.push({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        } else {
          map[key].items.push({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        }
      })
      let ret = [] // ret
      let hot = []
      for (const key in map) {
        if (/[a-zA-Z]/.test(map[key].title)) {
          ret.push(map[key])
        } else if (map[key].title === HOT_NAME) {
          hot.push(map[key])
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt() - b.title.charCodeAt()
      })
      return hot.concat(ret)
    },
    selectSinger (item) {
      this.$router.push({
        path: `/singer/${item.id}`
      })
      this.setSinger(item)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
}

</script>

<style lang="scss" scope>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transform: translate3d(-100%, 0, 0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translate3d(100%, 0,0);
}
</style>
