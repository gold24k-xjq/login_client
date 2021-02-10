<template>
<div>
    <ul class="home_ul">
        <li>
            <router-link :to="{name: 'AddUser', query: {type: 1}}">
                <img src="@/assets/images/rn_02.png" />
            </router-link>
        </li>
        <li>
            <router-link :to="{name: 'AddUser', query: {type: 3}}">
                <img src="@/assets/images/rn_03.png" />
            </router-link>
        </li>
        <li>
            <a @click="showCode" href="javascript:;">
                <img src="@/assets/images/rn_04.png" />
            </a>
        </li>
        <li>
            <router-link :to="{name: 'PaperList'}">
                <img src="@/assets/images/rn_05.png" />
            </router-link>
            <div class="home_ul_l_d">
                <router-link :to="{name: 'AddPaperUser', query: {type: 1}}">上传简版</router-link>
                <router-link :to="{name: 'AddPaperUser', query: {type: 2}}">上传详版</router-link>
                <router-link to="/TestList">设置</router-link>
            </div>
        </li>
        <li>
            <router-link :to="{name: 'Poster'}">
                <img src="@/assets/images/rn_06.png" />
            </router-link>
        </li>
    </ul>

    <div v-show="qshow" id="qrcode">
        <img :src="qrcode" class="layui_img">
    </div>
</div>
</template>

<script>
export default {
    name: 'EvoTitle',
    data() {
        return {
            qshow: false,
            qrcode: '',
        }
    },
    created() {
        let userinfo = localStorage.getItem("userinfo")
        if (userinfo) {
            let users = JSON.parse(decodeURIComponent(window.atob(userinfo)))
            this.qrcode = users.qrcode
        }
    },
    methods: {
        showCode() {
            if (!this.qrcode) {
                this.$func.error('请生成二维码后重新登录')
                return
            }
            this.qshow = true
            this.$func.open("qrcode", "请扫描二维码", ["800px", "500px"]).then((index, dom)=> {
                this.index = index
            })
        },
    }
}
</script>