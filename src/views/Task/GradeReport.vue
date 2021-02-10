<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200 pt">
        <back></back>
        <div class="cr_bg overflow">
            <div class="fl crt_l">{{report.practice_name}}</div>
            <div class="fr crt_r">【{{report.grade_name}}】应交人数/实交人数/未交人数：{{report.total}}/{{report.count}}/{{report.undone}}人</div>
        </div>
        <div class="cr_l">
            <ul class="cr_ll fl">
                <li v-for="item in titles" :class="{'on': curentComponent == item.component}" @click="curentComponent = item.component">{{item.name}}</li>
            </ul>
            <keep-alive><component :is="curentComponent" :origin="report"></component></keep-alive>
        </div>
    </div>
</div>
<!-- END -->
</div>
</template>

<script>


const Level = () => import("./Components/Level")
const QuestionInfo = () => import("./Components/QuestionInfo")
const KnowledgeInfo = () => import("./Components/KnowledgeInfo")
const Compare = () => import("./Components/Compare")
const QuestionComment = () => import("./Components/QuestionComment")
const Streng = () => import("./Components/Streng")
const Statement = () => import("./Components/Statement")
export default {
    name: 'GradeReport',
    data() {
        return {
            curentComponent: 'Level',
            titles: [
                {name: '评定等级', component: 'Level'},
                {name: '试题详情', component: 'QuestionInfo'},
                {name: '知识点详情', component: 'KnowledgeInfo'},
                {name: '多次对比', component: 'Compare'},
                {name: '试题讲评', component: 'QuestionComment'},
                // {name: '题集下载', component: 'Streng'},
                {name: '提交统计', component: 'Statement'}
            ],
            report: [],
        }
    },
    created() {
        let practice_id = this.$route.query.practice_id
        let grade_id = this.$route.query.grade_id
        this.getReport(practice_id, grade_id)
    },
    components:{
        Level,
        QuestionInfo,
        KnowledgeInfo,
        Compare,
        QuestionComment,
        Streng,
        Statement
    },
    methods: {
        getReport(practice_id, grade_id) {
            this.$http.post('/getGradeReportTitle', {practice_id: practice_id, grade_id: grade_id}).then(res=>{
                this.report = res.data
            }).catch(res=>{})
        },
    },
}

</script>