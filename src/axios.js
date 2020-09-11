
import axios from 'axios'
import globals from './global'
import router from './router'
import common from './common'
import crypto from './utils/crypto'

var instance = axios.create({ timeout: 1000 * 10 })
var key = 'base64:drrMTn+bZQWAsZwPkKPI5RVeZovgiVR6/mN/9r/kekA='

// 相对路径设置
if(process.env.NODE_ENV == 'development')
    instance.defaults.baseURL = 'http://localhost/blog/public/api'//
else if(process.env.NODE_ENV == 'production')
    instance.defaults.baseURL = globals.host

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

//http request 拦截器
instance.interceptors.request.use(
	config => {

        //加密
        if (config.data && process.env.NODE_ENV == 'production') {
            config.headers.Params = crypto.encrypt(config.data)
            config.data = ''
        }

        let token = localStorage.getItem('token')
        //console.log(JSON.parse(window.atob(token.split('.')[1])))
        
        config.headers.ApiKey = key
        token && (config.headers.Authorization = 'bearer' + token)

	   return config

  	},
  	err => {
    	return Promise.reject(err)
  	}
)


//http response 拦截器
instance.interceptors.response.use(
  	response => {

        if (response.headers.authorization) {
            localStorage.setItem('token', response.headers.authorization)
            common.setCookie('token', response.headers.authorization)
        }
        
        //解密
        if(process.env.NODE_ENV == 'production')
            response.data.data = crypto.decrypt(response.data.data)
        

  		if (response.data.code === 200 || response.data.errorCode === 200)
  			return Promise.resolve(response.data);

        else if (response.data.code === 503) {
            goLogin(response.data.msg)
            return Promise.reject(response)

        }else {
	    	response.data.msg && layer.msg(response.data.msg, {anim: 6})
	    	return Promise.reject(response)
	    }

  	},
  	error => {
    	return Promise.reject(error)
  	}
);


const goLogin = (msg) => {

    layer.msg(msg, {anim: 1})

    //去掉遮罩层
    $(".layui-layer-shade").remove();

    common.clearCache()

    router.replace({'path': '/'})

}


export default instance