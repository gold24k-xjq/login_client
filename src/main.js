import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios'
import common from './common'
import crypto from './utils/crypto'
import back from './components/Back'
import $ from 'jquery'
import './assets/css/style.css'
import 'swiper/dist/css/swiper.min.css'

Vue.prototype.$func = common
Vue.prototype.$http = axios
Vue.prototype.$crypto = crypto
Vue.component('back', back)
Vue.config.productionTip = false

new Vue({
  	router,
  	store,
  	render: h => h(App)
}).$mount('#app')
