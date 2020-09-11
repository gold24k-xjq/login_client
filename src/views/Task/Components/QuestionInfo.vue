<template>
<!-- START -->
<div class="cr_lr fr">
    <div class="cr_bg">
        <div class="cr_tit">试题分析</div>
        <div class="tana_t">
            <h2 class="tana_th2">正确率较低题目</h2>
            <p>以下题目正确率<60%！</p>
            <div class="tana_tt">
                <h3>主观题</h3>
                <div class="tana_ttd">
                    <a :href="'#'+key" v-for="(item, key, index) in report.total" v-if="item.is_zhu == 1 && item.per < 60">第{{key}}题</a>
                </div>
            </div>
            <div class="tana_tt">
                <h3>客观题</h3>
                <div class="tana_ttd">
                    <a :href="'#'+key" v-for="(item, key, index) in report.total" v-if="item.is_zhu == 0 && item.per < 60">第{{key}}题</a>
                </div>
            </div>
        </div>
        <div class="tana_t">
            <h2 class="tana_th2">正确率较高题目</h2>
            <p>以下题目正确率>85%！</p>
            <div class="tana_tt">
                <h3>主观题</h3>
                <div class="tana_ttd">
                    <a :href="'#'+key" v-for="(item, key, index) in report.total" v-if="item.is_zhu == 1 && item.per > 85">第{{key}}题</a>
                </div>
            </div>
            <div class="tana_tt">
                <h3>客观题</h3>
                <div class="tana_ttd">
                    <a :href="'#'+key" v-for="(item, key, index) in report.total" v-if="item.is_zhu == 0 && item.per > 85">第{{key}}题</a>
                </div>
            </div>
        </div>
        <div class="tana_t">
            <h2 class="tana_th2">正确率一般题目</h2>
            <p>以下题目60%≤正确率≤85%！</p>
            <div class="tana_tt">
                <h3>主观题</h3>
                <div class="tana_ttd">
                    <a :href="'#'+key" v-for="(item, key, index) in report.total" v-if="item.is_zhu == 1 && item.per >= 60 && item.per <= 85">第{{key}}题</a>
                </div>
            </div>
            <div class="tana_tt">
                <h3>客观题</h3>
                <div class="tana_ttd">
                    <a :href="'#'+key" v-for="(item, key, index) in report.total" v-if="item.is_zhu == 0 && item.per >= 60 && item.per <= 85">第{{key}}题</a>
                </div>
            </div>
        </div>
        <div class="crn_tit">
            <div class="cr_tit">试题详情</div>
            <!-- <button class="crn_titbtn">导出详情</button> -->
        </div>
        <table class="cr_table crdh_table">
            <tr>
                <th class="cr_table_fth">试题</th> 
                <th>选项人数</th> 
                <th>全对</th> 
                <th>错<i class="cr_ipd" id="showt" @mouseover="showTips" @mouseout="closeTips"></i></th> 
                <th>正确率</th> 
            </tr> 
            <tbody>
                <tr v-for="item in report.questions" :id="item.orders">
                    <td>
                        <div>第{{item.orders}}题</div>
                        <div v-html="item.title"></div>
                        <div v-for="(answer, key) in item.answers">{{key}}、<div class="cr_table_d" v-html="answer"></div></div>
                        <a class="cr_t_tita" href="javascript:;" @click="$parent.curentComponent = 'QuestionComment'">解析详情</a>
                    </td> 
                    <td class="cr_t_img"><div v-for="(option, key) in item.options" v-if="item.subjective == 1">选项{{key||'未作答'}}: {{option.per}}%（{{option.count}}人）</div></td> 
                    <td>{{item.get0}}</td> 
                    <td>{{item.get1}}({{item.get2}})</td> 
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
    name: 'QuestionInfo',
    data() {
        return {
            report: [],
        }
    },
    created() {
        let practice_id = this.$route.query.practice_id
        let grade_id = this.$route.query.grade_id
        this.getReport(practice_id, grade_id)
    },
    methods: {
        getReport(practice_id, grade_id) {
            this.$http.post('/getGradeReportQuestionInfo', {practice_id: practice_id, grade_id: grade_id}).then(res=>{
                this.report = res.data
                this.$nextTick( () => {
                    this.$func.setMath()
                })
            }).catch(res=>{})
        },
        showTips() {
            this.tip_index = layer.tips('括号内未半对数量，按未掌握统计', '#showt', {time: 0})
        },
        closeTips() {
            layer.close(this.tip_index)
        },
    }
}
</script>