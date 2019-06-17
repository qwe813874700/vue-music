<template>
  <div class="wapper" ref="wapper">
    <slot></slot>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wapper) {
        return
      }
      this.scroll = new Bscroll(this.$refs.wapper, {
        probeType: this.probeType,
        click: this.click
      })
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.scroll.refresh()
      }, 20)
    }
  }
}
</script>
<style lang="scss" scope>
</style>
