<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200 pt">
        <back></back>
        <div class="cr_bg">
            <p class="cr_bgtit cr_bgtitp">{{report.name}}</p>
        </div>
        <div class="cr_bg">
            <div class="cr_tit">基本信息</div>
            <ul class="cr_info">
                <li><span class="cr_info01">学生姓名：{{report.username}}</span></li>
                <li><span class="cr_info02">得分率：{{report.score}}%</span></li>
                <li><span class="cr_info03">学科：{{report.subject}}</span></li>
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
                    <div ref="charts3" style="width:386px;height:150px;"> </div>
                </li>
                <!-- <li>
                    <p>知识点分布</p>
                    <div ref="charts4" style="width:300px;height:150px;"> </div>
                </li> -->
            </ul>
        </div>
        <Knowledges :knowledges="report.knowledge_info"></Knowledges>
        <QuestionInfo :questions="report.questionlist"></QuestionInfo>
        <div class="cr_bg">
            <div class="cr_tit">多次对比折线图</div>
            <!-- <div class="wait_time">
                <div class="fl">
                    日期：
                    <label>
                        <input type="text" id="test" class="ipt">
                    </label> 
                    <span>-</span> 
                    <label>
                        <input type="text" id="test1" class="ipt">
                    </label> 
                    <button class="wait_tbtn">查看</button>
                </div>
            </div> -->
            <div ref="charts5" style="width:100%;height:500px;margin: 0 auto;"></div>
        </div>
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

import echarts from "echarts"
import $echarts from "@/utils/echarts"
import QuestionInfo from '@/components/QuestionInfo.vue'
import Knowledges from '@/components/Knowledges.vue'
export default {
    name: 'TaskReport',
    data() {
        return {
            report: [],
        }
    },
    created() {
        this.practice_id = this.$route.query.pid
        this.uid = this.$route.query.uid
        this.grade_id = this.$route.query.gid
        this.temp_code = this.$route.query.temp_code//已强化的报告会传递temp_code
        this.getRport()
    },
    components: {
        QuestionInfo,
        Knowledges,
    },
    methods: {
        getRport() {

            let data = {uid: this.uid, grade_id: this.grade_id}
            this.practice_id && (data.practice_id = this.practice_id)
            this.temp_code && (data.temp_code = this.temp_code)

            this.$http.post('/getTaskReport', data).then(res=>{

                this.report = res.data
                
                this.$nextTick(function () {
                    $echarts.chart1(res.data.score, this.$refs.charts1)
                    $echarts.chart2(res.data.kcount, this.$refs.charts2)
                    $echarts.chart3(res.data, this.$refs.charts3)
                    //$echarts.chart4(res.data.kweight, this.$refs.charts4)
                    this.chart5(res.data.chart5)
                })

            }).catch(res=>{})

        },
        chart5(c) {
            let myChart = echarts.init(this.$refs.charts5)
            let option = {
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: c.x,
                    boundaryGap: false, //显示在中间还是刻度线上
                    axisLabel: {
                        interval: 0,
                        rotate: -30
                    }
                },
                yAxis: {
                    type: 'value',
                    name: ''
                },
                tooltip: {},
                series: [{
                    data: c.y,
                    type: 'line',
                    lineStyle: {
                        //线
                        color: '#629bf1'
                    },
                    itemStyle: {
                        //点
                        color: '#629bf1',
                        borderWidth: 4
                    }
                }]
            };
            myChart.setOption(option);
        }
    },
}

</script>