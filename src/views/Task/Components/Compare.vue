<template>
<!-- START -->
<div class="cr_lr fr">
    <div class="cr_bg">
        <div class="cr_tit">正确率波动折线图</div>
        <!-- <div class="zql_e">
            <div class="zql_el">
                <select class="pop_ulipt pop_ulipts">
                    <option>1</option>
                </select>
                <i class="pu_i"></i>
            </div>
            <div class="zql_em">
                <input type="text" id="test1" class="ipt">
            </div>
            <button class="set_tmrb">搜索</button>
        </div> -->
        <div ref='main' style="width:100%;height:500px;margin: 0.9375rem auto;"></div>
        <p class="zql_ep">温馨提示：折线图默认显示最近5次作业正确率的对比，如需查看其他可点击上方日期筛选（时间跨度大时会影响加载速度哦）</p>
    </div>
</div>
<!-- END -->
</template>

<script>

import echarts from "echarts"
export default {
    name: 'Compare',
    data() {
        return {
            
        }
    },
    created() {
        let practice_id = this.$route.query.practice_id
        let grade_id = this.$route.query.grade_id
        this.getReport(practice_id, grade_id)
    },
    methods: {
        getReport(practice_id, grade_id) {
            this.$http.post('/getGradeReportCompare', {practice_id: practice_id, grade_id: grade_id}).then(res=>{
                this.$nextTick(function () {
                    this.showchart(res.data)
                })
            }).catch(res=>{})
        },
        showchart(d){
            var myChart = echarts.init(this.$refs.main);
            let option = {
                title : {
                    text: '',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['平均正确率']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis: {
                    type : 'category',
                    name : '作业次数',
                    data: d.x,
                    boundaryGap: false, //显示在中间还是刻度线上
                    axisLabel: {
                        interval: 0,
                        rotate: -40
                    },
                    textStyle: {
                        color: '#7c8893',
                        fontSize: 12
                    },
                },
                yAxis: {
                    type : 'value',
                    name : '平均正确率',
                    axisLabel : {
                        formatter: '{value} %'
                    }  
                },
                tooltip: {},
                series: [{
                    name:'平均正确率',
                    data: d.y,
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