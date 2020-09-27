<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200 pt">
        <back></back>
        <div class="cr_bg zh_liptoh" >
            <p class="cr_bgtit fl">{{report.name}}<i class="cr_bgtiti" @click="getPdf"></i></p>
            <img class="cr_bgtitimg fr" :src="report.path">
        </div>
        <div class="cr_bg">
            <div class="cr_tit">基本信息</div>
            <ul class="cr_info">
                <li><span class="cr_info01">学生姓名：{{report.username}}</span></li>
                <li><span class="cr_info02">得分率：{{report.score}}%</span></li>
                <li><span class="cr_info03">学科：{{report.subject}}</span></li>
                <li><span class="cr_info04">手机号：{{report.phone||'未填写'}}</span></li>
            </ul>
        </div>
        <div class="cr_bg">
            <div class="cr_tit">成绩分析</div>
            <ul class="cr_info">
                <li>
                    <p>得分率</p>
                    <div ref="charts1" style="width:386px;height:150px;"> </div><div class="cr_infomf">最高得分率100%</div>
                </li>
                <li>
                    <p>知识掌握情况</p>
                    <div ref="charts2" style="width:386px;height:150px;"> </div><div class="cr_infomf" v-if="report.kcount">知识点总数：{{report.kcount.total}}</div>
                </li>
                <li>
                    <p>题目完成情况</p>
                    <div ref="charts3" style="width:386px;height:150px;margin-top: 9px;"> </div>
                </li>
                <!-- <li>
                    <p>知识点分布</p>
                    <div ref="charts4" style="width:300px;height:150px;"> </div>
                </li> -->
            </ul>
        </div>
        <Knowledges :knowledges="report.knowledges"></Knowledges>
        <QuestionInfo :questions="report.questionlist"></QuestionInfo>
        <!-- <Paper :questions="report.questionlist"></Paper> -->
        <div class="cr_bg">
            <div class="cr_tit">测评小结</div>
            <p class="cr_cpc">{{report.username}}同学，你好：</p>
            <p class="cr_cpc">数据分析显示，{{report.comment}}</p>
        </div>
    </div>
</div>
<!-- END -->
</div>
</template>

<script>

import $echarts from "@/utils/echarts"
import Paper from '@/components/Paper.vue'
import QuestionInfo from '@/components/QuestionInfo.vue'
import Knowledges from '@/components/Knowledges.vue'
export default {
    name: 'CheckReport',
    data() {
        return {
            report: [],
        }
    },
    created() {
        let id = this.$route.query.id
        this.getRport(id)
    },
    components: {
        Paper,
        QuestionInfo,
        Knowledges,
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if (from.name == 'CheckList')
                vm.$store.commit("SETEVOSTATUS", 2)
            else if (from.name == 'Online' || from.name == 'SubPaper')
                vm.$store.commit("SETEVOSTATUS", 1)
        })
    },
    methods: {
        getRport(id) {

            this.$http.post('/getReport', {id: id}).then(res=>{

                this.report = res.data
                
                this.$nextTick(function () {
                    $echarts.chart1(res.data.score, this.$refs.charts1)
                    $echarts.chart2(res.data.kcount, this.$refs.charts2)
                    $echarts.chart3(res.data.questions, this.$refs.charts3)
                    //$echarts.chart4(res.data.kweight, this.$refs.charts4)
                })

            }).catch(res=>{})

        },
        getPdf() {
            let data = {id: this.report.id, school_id: this.report.school_id, name: this.report.name, username: this.report.username, from: 1}
            this.$func.getPdf(data)
        },
    },
}

</script>