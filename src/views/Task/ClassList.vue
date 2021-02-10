<template>
<!-- START -->
<div class="tab">
    <div class="cr_bg cr_bgn">
        <div class="jz_t_ccb">
            <span @click="clearGrade" :class="{'jz_t_ccbs': !current_gradeid}">全部</span>
            <ul class="jz_t_cc">
                <li v-for="item in grades" :class="{'on': current_gradeid == item.id}" @click="bygrade(item)">{{item.name}}</li>
            </ul>
        </div>
    </div>
    <div class="cr_bg">
        <ul class="jz_list" v-if="greports.length > 0">
            <li class="jz_listli" v-for="(item, index) in greports">
                <div class="rpt_ulpn">{{item.orders}}</div>
                <div class="jz_listl">
                    <div class="rpt_ullt">
                        <span class="rpt_ulltm">{{item.practice_name}}</span>
                        <span class="rpt_ulltr">{{item.addtime}}</span>
                    </div>
                    <ul class="jz_listlul">
                        <li><i></i>当前提交总人数：{{item.count}}人</li>
                        <li>考察知识点个数：{{item.knum}}个</li>
                        <li>最低正确率：{{item.min}}%</li>
                        <li>平均正确率：{{item.avg}}%</li>
                        <li>最高正确率：{{item.max}}%</li>
                    </ul>
                </div>
                <div class="jz_listlb">
                    <div class="fl jz_listlbl">
                        <span class="jz_listlblys"><i class="jz_listlbly"></i>{{item.grade_name}}</span>
                        <span class="rpt_ullbl">应交人数：{{item.total}}</span>
                        <span class="rpt_ullbm">实交人数：{{item.count}}</span>
                        <span class="rpt_ullbc">未交人数: {{item.undone}}</span>
                    </div>
                    <router-link :to="{name: 'GradeReport', query: {'practice_id': item.practice_id, 'grade_id': item.grade_id}}"><button class="fr jz_lisr">查看报告</button></router-link>
                </div>
            </li>
        </ul>
        <div class="nodata" v-else>暂无数据</div>
    </div>
    <div id="page" v-show="count > limit"></div>
</div>
<!-- END -->
</template>

<script>


export default {
    name: 'Statement',
    data() {
        return {
            current_gradeid: '',
            grades: [],
            greports: [],
            count: 0,//一共多少，用于判断分页是否显示
            limit: 0,//每页多少
        }
    },
    activated() {
        if (!this.$route.meta.isBack) {
            this.getGrades()
            this.getGradeTasks()
        }
        this.$route.meta.isBack = false
    },
    watch: {
        '$store.state.area_id': function (value) {
            this.getGrades()
            this.getGradeTasks()
        }
    },
    methods: {
        getGrades() {
            this.$http.post('/getTaskGrades').then(res=>{
                this.grades = res.data
            }).catch(res=>{})
        },
        getGradeTasks(page = 1) {
            let data = {page: page}
            this.current_gradeid && (data.grade_id = this.current_gradeid)
            this.$http.post('/getGradeTasks', data).then(res=>{
                this.greports = res.data.data
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
                            _this.getGradeTasks(obj.curr)
                        }
                    }
                });
            }).catch(res=>{})
        },
        bygrade(item) {
            this.current_gradeid = item.id
            this.getGradeTasks()
        },
        clearGrade() {
            this.current_gradeid = ''
            this.getGradeTasks()
        },
    },
}
</script>