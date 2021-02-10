<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200">
        <div class="homebg">
            <div class="plist_t">
                <div class="checkl_ipt fl">
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
                </div>
                <router-link to="/TestList" class="fr jz_t_ulbtn jz_t_ulbtn_y">设置</router-link>
                <router-link :to="{name: 'AddPaperUser', query: {type: 1}}"class="fr jz_t_ulbtn">上传简版</router-link>
                <router-link :to="{name: 'AddPaperUser', query: {type: 2}}"class="fr jz_t_ulbtn">上传详版</router-link>
            </div>
        </div>
        <div class="cr_bg cr_bgn">
            <ul class="rpt_ul rpt_ul_plr" v-if="reports.length > 0">
                <li v-for="(item, index) in reports">
                    <div class="rpt_ulpn">{{item.orders}}</div>
                    <div class="rpt_ulltl">
                        <img :src="setSex(item.sex)" />
                        <p>{{item.username}}</p>
                    </div>
                    <div class="rpt_ulltmm">

                        <div class="rpt_ullt">
                            <span class="rpt_ulltm">{{item.name}}</span>
                            <span class="rpt_ulltr">{{item.addtime}}</span>
                        </div>
                        <div class="rpt_ullb">
                            <span class="rpt_ullbl">得分：{{item.score}}</span>
                            <span class="rpt_ullbm">等级：{{item.level}}</span>
                            <span class="rpt_ullbc">科目: {{item.subject_name}}</span>
                        </div>
                    </div>
                    <div class="rpt_ulr">
                        <router-link :to="{name: 'PaperReport', query: {id: item.id}}" v-if="item.type == 2"><button class="rpt_ulrbtnr">查看报告</button></router-link>
                        <router-link :to="{name: 'PaperReportSimple', query: {id: item.id}}" v-else><button class="rpt_ulrbtnr">查看报告</button></router-link>
                        <a href="javascript:;" @click="$refs.child.pdfOption(item)"><button class="rpt_ulrbtnrr">打印报告</button></a>
                    </div>
                   
                </li>
            </ul>
            <!-- <div class="nodata" v-else>暂无数据</div> -->
            <router-link to="/TestList" class="none_paper" v-if="is_post && reports.length == 0" @click><img src="@/assets/images/nopaper.jpg" /></router-link>
        </div>
        <div id="page" v-show="count > limit"></div>

    </div>
</div>

<PdfOptions ref="child" from="10" title="下载试卷分析"></PdfOptions>

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
            reports: [],
            count: 0,//一共多少，用于判断分页是否显示
            limit: 0,//每页多少
            field: '',//搜索
            is_post: false,
        }
    },
    components: {
        PdfOptions,
    },
    activated() {
        if (!this.$route.meta.isBack) {
            this.getReports()
        }
        this.$route.meta.isBack = false
    },
    beforeRouteEnter (to, from, next) {//del
        //解决测评后，列表不刷新的问题
        if ((from.name == 'CheckReport' || from.name == 'CheckQuestions') && store.state.evo_status != 1)
            to.meta.isBack = true
        next()
    },
    watch: {
        from() {
            this.getReports()
        },
        '$store.state.area_id': function (value) {
            this.getReports()
        }
    },
    methods: {
        getReports(page = 1) {
            let data = {page: page}
            this.sphone && (data.phone = this.sphone)
            this.susername && (data.username = this.susername)
            this.date && (data.date = this.date)
            this.$http.post('/getPaperReportList', data).then(res=>{
                this.is_post = true
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
        setSex(sex) {
            sex = sex || 1
            return require('../../assets/images/sex_'+sex+'.png')
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