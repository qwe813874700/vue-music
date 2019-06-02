<template>
  <div class="m-header">
    <div class="header-center">
      <div class="header-logo"></div>
      <div class="header-titile">
        Chicken Music
      </div>
    </div>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'MHeader'
}
</script>

<style lang="scss" scope>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.m-header{
  position: relative;
  height: 44px;
  color: $color-theme;
  text-align: center;
  font-size: 0;
  .header-center{
    .header-logo{
      display: inline-block;
      vertical-align: top;
      margin-top: 6px;
      width: 30px;
      height: 32px;
      margin-right: 9px;
      @include bg-image('../../common/image/logo');
      background-size: 30px 32px;
    }
    .header-titile{
      display: inline-block;
      vertical-align: top;
      line-height: 44px;
      font-size: $font-size-large;
    }
  }
  .mine{
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine{
      display: block;
      padding: 12px;
      font-size: 20px;
      color: $color-theme;
    }
  }
}
</style>
