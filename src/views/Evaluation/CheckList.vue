<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200">
        <div class="homebg">
            <div class="cr_bgn">
                <div class="cr_tit">发起入学测评</div>  
            </div>
            <ul class="home_ul">
                <li>
                    <router-link :to="{name: 'AddUser', query: {type: 1}}" href="javascript:;">
                        <img src="../../assets/images/rn_02.png" />
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name: 'AddUser', query: {type: 2}}" href="javascript:;">
                        <img src="../../assets/images/rn_01.png" />
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name: 'AddUser', query: {type: 3}}" href="javascript:;">
                        <img src="../../assets/images/rn_03.png" />
                    </router-link>
                </li>
                 <li>
                    <a @click="showCode" href="javascript:;">
                        <img src="../../assets/images/rn_04.png" />
                    </a>
                </li>
            </ul>
            <div class="checkl_ipt">
                <div class="crn_tittr ml">
                    <!-- <span>按姓名搜索：</span> -->
                    <div class="zql_emm">
                        <input type="text" placeholder="请输入姓名或手机号" class="ipt" v-model="field" @keyup.enter="search">
                    </div>
                    <button class="set_tmrb" @click="search">搜索</button>
                </div>
                <div class="crn_tittr">
                    <span>按时间：</span>
                    <div class="zql_em">
                        <input type="text" class="ipt" id="timer1">
                    </div>
                    <!-- <button class="set_tmrb">搜索</button> -->
                </div>
                <div class="pop_ul">
                    <span>按来源：</span>
                    <select class="pop_ulipt pop_ulipts" v-model="from">
                        <option value="" selected>全部</option>
                        <option value="1">智能练习册</option>
                        <option value="2">校本教辅</option>
                        <option value="3">校内在线测评</option>
                        <option value="4">校外在线评测</option>
                    </select>
                    <i class="pu_i"></i>
                </div>
                <router-link class="cp_stat" to="/UserList" v-if="usergroup_id == 43">测评统计</router-link>
            </div>
            <ul class="rpt_ul" v-if="reports.length > 0">
                <li v-for="(item, index) in reports">
                    <div class="rpt_ulpn">{{item.orders}}</div>
                    <div class="rpt_ulltl">
                        <img :src="setSex(item.sex)" />
                        <p>{{item.username}}</p>
                    </div>
                    <div class="rpt_ulltmm">

                        <div class="rpt_ullt">
                            <span class="rpt_ulltm">{{item.name}} - {{item.teacher_name}}</span>
                            <span class="rpt_ulltr">{{item.addtime}}</span>
                        </div>
                        <div class="rpt_ullb">
                            <span class="rpt_ullbl">得分率：{{item.score}}%</span>
                            <span class="rpt_ullbm">等级：{{item.level}}</span>
                            <span class="rpt_ullbc">科目: {{item.subject}}</span>
                            <!-- <span class="rpt_ullbcc">来源: {{item.type}}</span> -->
                        </div>
                    </div>
                    <div class=" rpt_ulr">
                        <router-link :to="{name: 'CheckQuestions', query: {id: item.id}}"><button class="rpt_ulrbtnr">题目解析</button></router-link>
                        <a href="javascript:;" @click="getQuestionPdf(item)"><button class="rpt_ulrbtnrr">导出题目</button></a>
                        <router-link :to="{name: 'CheckReport', query: {id: item.id}}"><button class="rpt_ulrbtnr">查看报告</button></router-link>
                        <a href="javascript:;" @click="getPdf(item)"><button class="rpt_ulrbtnrr">打印报告</button></a>
                        <!-- <a href="javascript:;" @click="$refs.child.pdfOption(item, 1)"><button class="rpt_ulrbtnrr">打印报告</button></a> -->
                    </div>
                   
                </li>
            </ul>
            <div class="nodata" v-else>暂无数据</div>
        </div>
        <div id="page" v-show="count > limit"></div>

    </div>
</div>

<div v-show="qshow" id="qrcode">
    <img :src="qrcode" class="layui_img">
</div>

<PdfOptions ref="child" from="1"></PdfOptions>

<!-- END -->
</div>
</template>

<script>


import store from '@/store'
import PdfOptions from '@/components/PdfOptions.vue'
export default {
    name: 'CheckList',
    data() {
        return {
            usergroup_id: '',
            qshow: false,
            qrcode: '',
            reports: [],
            count: 0,//一共多少，用于判断分页是否显示
            limit: 0,//每页多少
            from: '',//来源筛选
            field: '',//搜索
        }
    },
    components: {
        PdfOptions,
    },
    activated() {
        let userinfo = localStorage.getItem("userinfo")
        if (userinfo) {
            let users = JSON.parse(decodeURIComponent(window.atob(userinfo)))
            this.usergroup_id = users.usergroup_id
            this.qrcode = users.qrcode
        }
        if (!this.$route.meta.isBack) {
            this.getReports()
        }
        this.$route.meta.isBack = false
    },
    beforeRouteEnter (to, from, next) {
        //解决测评后，列表不刷新的问题
        if ((from.name == 'CheckReport' || from.name == 'CheckQuestions') && store.state.evo_status != 1)
            to.meta.isBack = true
        next()
    },
    watch: {
        from() {
            this.getReports()
        },
    },
    methods: {
        getReports(page = 1) {
            let data = {page: page}
            this.from && (data.type = this.from)
            this.sphone && (data.phone = this.sphone)
            this.susername && (data.username = this.susername)
            this.date && (data.date = this.date)
            this.$http.post('/getReportList', data).then(res=>{
                this.reports = res.data.data
                this.count = res.data.count
                this.limit = res.data.limit
                let _this = this
                layui.laypage.render({
                    elem: 'page',
                    count: res.data.count,
                    limit: res.data.limit,
                    curr: page,
                    jump: function(obj, first){
                        if (!first) {
                            _this.getReports(obj.curr)
                        }
                    }
                })
            }).catch(res=>{})
        },
        search() {
            if (this.$func.isPhone(this.field)) {
                this.sphone = this.field
                this.susername = ''
            } else {
                this.susername = this.field
                this.sphone = ''
            }
            this.getReports()
        },
        getPdf(item) {
            let data = {id: item.id, school_id: item.school_id, name: item.name, username: item.username, from: 1}
            this.$func.getPdf(data)
        },
        getQuestionPdf(item) {
            let data = {id: item.id, school_id: item.school_id, name: item.name, username: item.username, from: 3}
            this.$func.getPdf(data)
        },
        setSex(sex) {
            sex = sex || 1
            return require('../../assets/images/sex_'+sex+'.png')
        },
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
    },
    mounted() {
        let _this = this
        layui.laydate.render({
            elem: '#timer1',
            range: true,
            done: function(value, date, endDate){
                _this.date = value
                _this.getReports()
            }
        })
    },
}

</script>