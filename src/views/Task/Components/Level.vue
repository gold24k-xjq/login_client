<template>
<!-- START -->
<div class="cr_lr fr">
    <div class="cr_bg">
        <div class="cr_tit level_f">总览<button class="level_btn" @click="simpleReport">导出报告<i class="cr_bgtiti"></i></button></div>
        <ul class="cr_lrlist">
            <li>
                <p>平均正确率</p>
                <div ref='charts1' style="width:300px;height:200px;"> </div>
            </li>
            <li>
                <p>评定等级分布</p>
                <div ref='charts2' style="width:300px;height:200px;"> </div>
            </li>
            <li>
                <p>正确率前五名</p>
                <div style="width:300px;height:200px;"> 
                    <div class="cr_lrlistd">
                        <span v-for="item in report.top"><i></i>{{item}}</span>
                    </div>
                    <p>正确率后五名</p>
                    <div class="cr_lrlistd">
                        <span v-for="item in report.bottom"><i></i>{{item}}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <div class="cr_bg">
        <div class="cr_tit">评定等级</div>
        <table class="cr_table">
            <tr>
                <th>姓名</th> 
                <th>班级</th> 
                <th @click="dosort">正确率<i :class="sort ? 'cr_izql1' : 'cr_izql'"></i></th> 
                <th>评定<i class="cr_ipd" id="showt" @mouseover="showTips" @mouseout="closeTips"></i></th> 
            </tr> 
            <tbody>
                <tr v-for="item in students">
                    <td class="cr_t_tit">{{item.name}}</td> 
                    <td class="cr_t_img">{{item.grade_name}}</td> 
                    <td>
                        <span class="cr_pro">
                            <span class="cr_prola" :style="{width: item.correct+'%'}"></span>
                            <i>{{item.correct}}%</i>
                        </span>
                    </td> 
                    <td class="cr_proa">{{item.level}}</td> 
                </tr>
            </tbody>
        </table>
    </div>
</div>
<!-- END -->
</template>

<script>

import echarts from "echarts"
export default {
    name: 'Level',
    data() {
        return {
            sort: false,
            report: [],
            students: [],
        }
    },
    created() {
        let practice_id = this.$route.query.practice_id
        let grade_id = this.$route.query.grade_id
        this.practice_id = practice_id
        this.grade_id = grade_id
        this.getReport(practice_id, grade_id)
    },
    methods: {
        getReport(practice_id, grade_id) {
            this.$http.post('/getGradeReportLevel', {practice_id: practice_id, grade_id: grade_id}).then(res=>{
                this.report = res.data
                this.students = res.data.list
                let level = res.data.level
                let data1 = []
                let data2 = []
                let keys
                for(let item in level) {
                    keys = item+'['+level[item]+']人'
                    data1.push(keys)
                    data2.push({'name': keys, 'value': level[item]})
                }
                this.$nextTick(function () {
                    this.chart1(res.data.avg)
                    this.chart2(data1, data2)
                })
            }).catch(res=>{})
        },
        simpleReport() {
            let data = {grade_id: this.grade_id, practice_id: this.practice_id, from: 8}
            this.$func.getPdf(data)
        },
        showTips() {
            this.tip_index = layer.tips('A等级: 正确率≥90%<br>B等级: 正确率≥80%<br>C等级: 正确率≥60%<br>D等级: 正确率<60%', '#showt', {time: 0})
        },
        closeTips() {
            layer.close(this.tip_index)
        },
        dosort() {
            this.sort = !this.sort
            this.students = this.$func.sortBykey(this.students, 'correct', this.sort)
        },
        chart1(avg) {
            let myChart = echarts.init(this.$refs.charts1)
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                color:['red', '#ccc'],
                series: [{
                    name:'平均正确率',
                    type: 'pie',
                    center: ['50%', '50%'], // 饼图的圆心坐标
                    radius: ['65%', '80%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    label: { //  饼图图形上的文本标签
                        normal: { // normal 是图形在默认状态下的样式
                            show: true,
                            position: 'center',
                            color: 'red',
                            fontSize: 20,
                            fontWeight: 'bold',
                            formatter: '{d}%\n{b}' // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {
                            value: avg,
                            name: "",
                            label: {
                                normal: {
                                    show: true
                                }
                            }
                        },
                        {
                            value: 100 - avg,
                            name: '',
                            label: {
                                normal: {
                                    show: false
                                }
                            }
                        }
                    ]
                }]
            };
            myChart.setOption(option);
        },
        chart2(data1, data2) {
            let myChart = echarts.init(this.$refs.charts2)
            let option = {
                title: {
                    text: '',
                    x: 'left'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                grid:{   //绘图区调整
                    x:0,  //左留白
                    y:10,   //上留白
                    x2:500,  //右留白
                    y2:10   //下留白
                },
                color: ['#00AA8D', '#FE9900', '#007BC8', '#D1102F'],
                legend: {
                    orient: 'vertical',
                    left: 0,
                    bottom:0,
                    data: data1
                },
                stillShowZeroSum: false,
                series: [
                    {
                        name: '评定等级分布',
                        type: 'pie',
                        radius: '60%',
                        center: ['55%', '50%'],
                        data: data2,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(128, 128, 128, 0.5)'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        },
    },
}
</script>