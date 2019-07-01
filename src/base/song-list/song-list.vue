<template>
  <div class="song-list">
    <ul class="song-wapper">
      <li class="song-item" v-for="(item, index) in songs" :key="index">
        <div class="song-content">
          <h2 class="name">{{ item.name }}</h2>
          <p class="desc">{{ _getAlbumAndSinger(item.singer, item.album) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    _getAlbumAndSinger (album, singer) {
      return `${singer} - ${album}`
    }
  }
}
</script>
<style lang="scss">
@import 'common/scss/variable.scss';

.song-list{
  .song-wapper{
    .song-item{
      &:first-child{
        padding-top:20px;
      }
      .song-content{
        display: flex;
        flex-direction: column;
        padding: 10px 0 10px 25px;
        font-size: $font-size-medium;
        .name{
          padding-bottom: 10px;
        }
        .desc{
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
