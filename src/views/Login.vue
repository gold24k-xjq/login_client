<template>
<div>
<!-- START -->
<div class="header">
    <div class="w1200">
        <div class="header_left fl"><img class="logo" src="../assets/images/logo_01.png" /></div>
        <div class="header_right fr">
            <div class="header_rf fl">你好，请登录</div>
        </div>
    </div>
</div>
<div class="logo_m">
	<div class="w1200">	
        <div class="logo_mpt" v-if="!isIE">
    	    <div class="logo_mr">
    			<div class="logo_mrl fl">
    				<p class="logo_mrlp">初高中智能1对1辅导</p>
    				<img class="logo_mrlimg" src="../assets/images/in_01.png" />
    			</div>
    			<!-- 选择登录身份 -->
    			<div class="logo_mrr logo_mrrch fl" v-if="show == 0">
    				<div class="logo_mrrtit"><img src="../assets/images/logo_02.png" /></div>
    				<div class="logo_mrrline"><p>选择登录身份</p></div>
    				<div class="zh_logo">
    				   	<div class="zh_lipt zh_liptoh">
    				    	<div class="zh_lipttb zh_lipttbls fl" @click="show = 1">
    							<img src="../assets/images/in_02.png" />
    							<p>我是老师</p>
    				     	</div>
    				     	<div class="zh_lipttb zh_liptxs fl" @click="show = 2">
    							<img src="../assets/images/in_03.png" />
    							<p>我是学生</p>
    				     	</div>
    				   	</div>
    				</div>    
    			</div>
    			<!-- 老师登录 -->
    			<div class="logo_mrr logo_mrrls fl" v-if="show == 1">
    				<div class="logo_mrrtit">老师登录</div>
    				<div class="zh_logo zh_logols">
    				   	<div class="zh_lipt">
    				     	<label>
    				       		<div class="zh_bg"><span></span></div>
    				       		<input type="text" class="zh_bgin" placeholder="请输入账号" @keyup.enter="submit" v-model="username" />
    				     	</label>
    				     	<label>
    				       		<div class="ma_bg"><span></span></div>
    				       		<div class="ma_code">
    				       			<input type="password" placeholder="请输入密码"  autocomplete="off" @keyup.enter="submit" v-model="password" />
    				       			<span class="get_code"></span>
    				       		</div>       
    				     	</label>
    				   	</div>
    				   <button class="zh_lbtn" @click="submit">登录</button>
    				</div>    
    			</div>
    			<!-- 学生登录 -->
    			<div class="logo_mrr logo_mrrxs  fl" v-if="show == 2">
    				<div class="logo_mrrtit">学生登录</div>
    				<ul class="logo_ltab">
    				  	<li><span :class="{'on': student_type == 1}" @click="student_type = 1">账户密码登录</span></li>
    				  	<li><span :class="{'on': student_type == 2}" @click="student_type = 2">微信扫码登录</span></li>
    				</ul>
    				<div class="zh_logo tab" v-show="student_type == 1">
    				   	<div class="zh_lipt">
    				     	<label>
    				       		<div class="zh_bg"><span></span></div>
    				       		<input type="text" placeholder="请输入账号" @keyup.enter="login" v-model="username" />
    				     	</label>
    				     	<label>
    				       		<div class="ma_bg"><span></span></div>
    				       		<div class="ma_code">
    				       			<input type="password" placeholder="请输入密码" @keyup.enter="login" v-model="password" autocomplete="off" maxlength="4" />
    				       			<span class="get_code"></span>
    				       		</div>       
    				     	</label>
    				   	</div>
    				   	<button class="zh_lbtn" @click="login">登录</button>
    				</div>
    				<div class="wx_logo tab" v-show="student_type == 2">
    				   	<div class="zh_lipt" style="margin: 0.3rem auto;" id="login">
    				     	<!-- <img class="wx_code" src="../assets/images/in_08.png" /> -->
    				   	</div>
    				  	<div class="zh_ls">
    				     	<p>打开手机微信 扫一扫 登录</p>
    				   	</div>
    				</div>    
    				    
    			</div>
    		
    	    </div>
        </div>
        <div class="mp-body" v-else>
            <div class="page_msg">
                <div>
                    <p><i class="icon_msg_mini"></i>你正在使用的浏览器内核版本过低，微软已经不再提供技术支持，为避免可能存在的安全隐患，请尽快升级你的浏览器或者安装更安全的浏览器访问成长AI。</p>
                </div>
            </div>
            <div class="browser_list">
                <a href="http://xiazai.sogou.com/detail/34/0/6262355089742005676.html" target="view_window" class="browser_item chrome">
                    <i class="icon_browser"></i>
                    <p class="browser_name">Chrome</p>
                </a>
                <a href="https://browser.qq.com/" target="view_window" class="browser_item qqbrowser">
                    <i class="icon_browser"></i>
                    <p class="browser_name">QQ浏览器</p>
                </a>
                <a href="https://ie.sogou.com/" target="view_window" class="browser_item sogou_browser">
                    <i class="icon_browser"></i>
                    <p class="browser_name">搜狗浏览器</p>
                </a>
                <a href="https://browser.360.cn/ee/" target="view_window" class="browser_item security_browser360">
                    <i class="icon_browser"></i>
                    <p class="browser_name">360浏览器</p>
                </a>
            </div>
            <div class="browser_tips">
                <p>
                    如果你正在使用的是双核浏览器，比如QQ浏览器、搜狗浏览器、猎豹浏览器、世界之窗浏览器、傲游浏览器、360浏览器等，可以使用浏览器的极速模式来继续访问成长AI。
                </p>
            </div>
        </div>
	</div>
</div>

<!-- END -->
</div>
</template>

<script>



export default {

  	name: 'Login',

  	data() {
  		return {
  			show: 0,
  			student_type: 1,
  			username: '',
  			password: '',
            isIE: false,
  		}
  	},

    created() {

        let code = this.$route.query.code
        code && this.wxlogin(code)

        this.isIE = !!window.ActiveXObject || "ActiveXObject" in window

    },

  	watch: {
        student_type(value) {
            if (value == 2) {
                this.getCode()
            }
        }
    },

  	methods: {

  		submit() {
  			
  			if (!this.username || !this.password) {
  				this.$func.error("请输入账号密码")
  				return
  			}

            let data = {username: this.username, password: this.password}

  			this.$http.post('/login', data).then(res=>{
  				this.$func.success(res.msg)
  				localStorage.setItem("userinfo", window.btoa(window.encodeURIComponent(JSON.stringify(res.data))))
                if (res.data.usergroup_id == 43)
                    this.$router.replace('CheckList')
                else
                    this.$router.replace('TaskList')
  			}).catch(res=>{})

  		},

        login() {

            if (!this.username || !this.password) {
                this.$func.error("请输入账号密码")
                return
            }
            
            this.$http.post('/slogin', {username: this.username, password: this.password}).then(res=>{
                this.$func.success(res.msg)
                location.href = "http://xuesheng.zn1v1.com/report"
            }).catch(res=>{})

        },

        wxlogin (code) {
            
            this.$http.post('/wxlogin', {code: code}).then(res=>{
                
                this.$func.success(res.msg)
                location.href = "http://xuesheng.zn1v1.com/report"

            }).catch(res=>{})  

        },

        getCode() {
            new WxLogin({
                self_redirect: false,
                id: "login", 
                appid: "wxdc3f027030864698", 
                scope: "snsapi_login", 
                redirect_uri: "https://www.zn1v1.com",
                state: "",
                style: "",
                href: "data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDE0MHB4O30NCi5pbXBvd2VyQm94IC50aXRsZSB7ZGlzcGxheTogbm9uZTt9DQouaW1wb3dlckJveCAuaW5mbyB7d2lkdGg6IDIwMHB4O30NCi5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZX0NCi5pbXBvd2VyQm94IC5zdGF0dXMge3RleHQtYWxpZ246IGNlbnRlcjt9"
            })
        },

  	}

}
</script>