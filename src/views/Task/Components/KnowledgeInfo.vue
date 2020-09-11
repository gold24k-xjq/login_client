<template>
<!-- START -->
<div class="cr_lr  fr">
    <div class="cr_bg">
        <div class="cr_tit">知识点详情</div>
        <table class="cr_table  crd_table">
            <tr>
                <th>知识点</th>  
                <th>题目信息</th>  
                <th>知识点已掌握人数</th>
                <th>知识点未掌握人数</th>  
                <th class="number" @click="dosort">
                    掌握率
                    <span>
                        <i :class="sort ? 'cr_izql1' : 'cr_izql'"></i>
                    </span>
                </th>
            </tr>  
            <tbody>
                <tr v-for="item in report">
                    <td>{{item.knowledge}}</td>  
                    <td>{{item.orders}}</td>   
                    <td>{{item.get}}</td>  
                    <td>{{item.unget}}</td>  
                    <td class="cr_t_lc">{{item.per}}%</td>  
                </tr>
            </tbody>
        </table>
    </div>
</div>
<!-- END -->
</template>

<script>


export default {
    name: 'KnowledgeInfo',
    data() {
        return {
            report: [],
            sort: false,
        }
    },
    created() {
        let practice_id = this.$route.query.practice_id
        let grade_id = this.$route.query.grade_id
        this.getReport(practice_id, grade_id)
    },
    methods: {
        getReport(practice_id, grade_id) {
            this.$http.post('/getGradeReportKnowledgeInfo', {practice_id: practice_id, grade_id: grade_id}).then(res=>{
                this.report = res.data
            }).catch(res=>{})
        },
        dosort() {
            this.sort = !this.sort
            this.report = this.$func.sortBykey(this.report, 'per', this.sort)
        },
    }
}
</script>