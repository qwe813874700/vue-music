// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import './common/scss/index.scss'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'
Vue.config.productionTip = false

fastclick.attach(document.body)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('common/image/default.png'),
  attempt: 1
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
