<template>
  <div class="m-tab">
    <router-link class="tab-list" tag="div" to="./recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link class="tab-list" tag="div" to="./singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link class="tab-list" tag="div" to="./rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link class="tab-list" tag="div" to="./search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Tab'
}
</script>

<style lang="scss" scope>
@import 'common/scss/mixin.scss';
@import 'common/scss/variable.scss';
.m-tab{
  @include flex-around();
  .tab-list{
    padding:20px 0;
    &.router-link-active{
      .tab-link{
        color: $color-theme;
        padding-bottom:8px;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
