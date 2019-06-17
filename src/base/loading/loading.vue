<template>
  <div class="m-lodding">
    <img src="./loading.gif" width="24" height="24" alt="">
    <p>{{ title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在加载数据...'
    }
  }
}
</script>

<style lang="scss">
  @import 'common/scss/variable';
  .m-lodding{
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-l;
  }
</style>
