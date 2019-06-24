<template>
  <div class="m-singer">
    <list-view :data="singerList"></list-view>
  </div>
</template>
<script>

import { getSingerList } from 'api/singer'
import ListView from '@/base/listview/listview'
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
    }
  },
  components: {
    ListView
  }
}

</script>

<style lang="scss" scope>

</style>
