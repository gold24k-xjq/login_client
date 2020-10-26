<template>
<div class="header header_bb">
    <div class="w1200">
        <div class="header_left fl" @click="goIndex"><img class="logo" :src="logo" /></div>
        <div class="header_right fr">
            <ul class="header_ul fl" v-show="islogin">
                <li v-if="usergroup_id != 43">
                    <router-link :to="{name: 'TaskList'}"><span class="at" :class="{'on': 2 == $route.meta.index}">学情报告</span></router-link>
                </li>
                <li v-if="usergroup_id != 43">
                    <router-link :to="{name: 'Record'}"><span class="at" :class="{'on': 3 == $route.meta.index}">学生档案</span></router-link>
                </li>
                <li>
                    <router-link :to="{name: 'CheckList'}"><span class="at" :class="{'on': 1 == $route.meta.index}">入学测评</span></router-link>
                </li>
                <li v-if="usergroup_id != 42 && usergroup_id != 43">
                    <a href="http://zujuan.zn1v1.com"><span class="at">组卷备课</span></a>
                </li>
                <li v-if="usergroup_id == 40">
                    <a href="http://system.zn1v1.com"><span class="at">设置</span></a>
                </li>
            </ul>
            <div class="header_rf fl" @click="out = !out">你好，{{username}}<i class="h_rf_xl"></i></div>
            <div class="header_out" v-show="out" @click="outLogin"><i class="h_out"></i>退出登录</div>
        </div>
    </div>
</div>
</template>

<script>


export default {
    name: 'Header',
    data() {
        return {
            username: '请登录',
            usergroup_id: '',
            logo: require('../assets/images/logo_01.png'),
            islogin: false,
            out:false,
        }
    },
    created() {

        let token = localStorage.getItem("token")//监听变化
        let userinfo = localStorage.getItem("userinfo")
        token && (this.islogin = true)
        if (userinfo) {
            let users = JSON.parse(decodeURIComponent(window.atob(userinfo)))
            this.username = users.username
            this.usergroup_id = users.usergroup_id
            users.logo && (this.logo = users.logo)
        }
        //userinfo && (this.username = JSON.parse(decodeURIComponent(window.atob(userinfo))).username)

    },
    methods: {
        outLogin() {
            this.$http.post('/outLogin').then(res=>{
                this.$func.clearCache()
                this.$func.success(res.msg)
                this.$router.replace('/')
            }).catch(res=>{})
        },
        goIndex() {
            this.$router.push('/CheckList')
        }
    },
}
</script>