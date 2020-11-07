import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios'
import common from './common'
import crypto from './utils/crypto'
import back from './components/Back'
import $ from 'jquery'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import './assets/css/style.css'
import 'swiper/dist/css/swiper.min.css'

Vue.prototype.$func = common
Vue.prototype.$http = axios
Vue.prototype.$crypto = crypto
Vue.component('back', back)
Vue.config.productionTip = false
Vue.use(Viewer)
Viewer.setDefaults({
    'inline': false,    //为true时直接显示
    'button': true,     //退出按钮
    'navbar': true,     //图片缩略图
    'title': true,      //标题
    'toolbar': false,   //工具栏
    'tooltip': true,    //缩放百分比
    'movable': true,    //是否可移动
    'zoomable': true,   //是否可缩放
    'rotatable': true,  //是否可旋转
    'scalable': true,   //是否可翻转
    'transition': true, //css过渡
    'fullscreen': true, //是否全屏
    'keyboard': true,   //是否支持键盘
})

new Vue({
  	router,
  	store,
  	render: h => h(App)
}).$mount('#app')
