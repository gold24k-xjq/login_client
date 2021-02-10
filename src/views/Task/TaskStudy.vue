<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200 pt">
        <back></back>
        <div class="cr_bg">
            <p class="cr_bgtit cr_bgtitp">{{report.name}}<span class="cr_bgtiti_ft" @click="$refs.child.pdfOption(report)">下载pdf</span></p>

        </div>
        <div class="cr_bg">
            <p class="cr_cpc_b" v-html="report.comment"></p>
        </div>
        <div class="cr_bg">
            <a name="basic" class="anmao"></a>
            <div class="cr_tit">基本信息</div>
            <ul class="cr_info">
                <li><span class="cr_info01">学生姓名：{{report.username}}</span></li>
                <li><span class="cr_info02">得分率：{{report.score}}%</span></li>
                <li><span class="cr_info03">学科：{{report.subject}}</span></li>
            </ul>
        </div>
        <div class="cr_bg">
            <a name="score" class="anmao"></a>
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

        <div class="cr_bg">
            <a name="compare" class="anmao"></a>
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

        <Knowledges :knowledges="report.knowledge_info" from="2"></Knowledges>
        <QuestionInfo :questions="report.questionlist" :paper="report.questions" from="2"></QuestionInfo>
        
        <div class="cr_bg">
            <a name="wrongs" class="anmao"></a>
            <div class="cr_tit">错题巩固</div>
            <div class="cr_lmt" v-for="item in report.wrongs">
                <div class="wq_n"><span>第{{item.orders}}题[{{item.diff_name}}]</span></div>
                <div v-html="item.title"></div>
                <ul class="a_choose">
                    <li v-for="answer in item.answers">
                        <span class="fl">{{answer.order}}.</span>
                        <div class="fl a_choose_lid" v-html="answer.answer"></div>
                    </li>
                </ul>
                <div class="wq_b wq_b_img"><span>【我的答案】</span><div class="wq_bib" v-html="item.my_answer"></div></div>
                <div class="wq_b">
                    <div class="wq_b_df">
                        <span class="fl">【错因分析】</span>
                        <div class="saw_list_bb_df">
                            <div v-for="(reason, index) in item.reasons">
                                <label class="d_cb" :for="item.orders+'-'+index"> 
                                    {{reason.name}}
                                    <input :id="item.orders+'-'+index" type="checkbox" :checked="reason.checked"> 
                                    <span></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div style="margin-left: 96px;" v-if="item.wrong_info">教师批注：{{item.wrong_info || '未批注'}}</div>
                </div>
                <div class="wq_b"><span>【错题订正】</span><p :class="item.is_zhu == 1 ? 'wq_h40' : ''"></p></div>
                <!-- <div class="wq_b" v-if="report.is_vip"> -->
                <div class="wq_b">
                    <span>【变式练习】</span>
                    <div v-if="!item.streng">抱歉，暂未找到对应级别的试题</div>
                    <div v-else v-for="(streng, index) in item.streng">
                        <div class="d_pid">{{item.orders}}.{{index + 1}}[{{streng.diff_name}}]<div v-html="streng.title"></div></div>
                        <ul class="a_choose">
                            <li v-for="answer in streng.answers">
                                <span class="fl">{{answer.order}}.</span>
                                <div class="fl a_choose_lid" v-html="answer.answer"></div>
                            </li>
                        </ul>
                        <p :class="streng.subjective == 1 ? 'wq_h40' : 'wq_h20'"></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="cr_bg">
            <a name="answers" class="anmao"></a>
            <div class="cr_tit">参考答案</div>
            <div v-for="item in report.wrongs" class="cr_lmt">
                <p class="wq_n"><span>第{{item.orders}}题</span></p>
                <div class="wq_b">【参考答案】<div class="wq_bib" v-html="item.right_answer"></div></div>
                <div class="wq_b wq_b_img">【我的答案】<div class="wq_bib" v-html="item.my_answer"></div></div>
                <div class="wq_b">【试题解析】<div class="wq_bib" v-html="item.parse"></div></div>
                <!-- <div class="wq_b" v-if="report.is_vip"> -->
                <div class="wq_b">
                    <span>【变式练习】</span>
                    <div style="margin-top: 10px" v-for="(streng, index) in item.streng">
                    <p>{{item.orders}}.{{index + 1}}【参考答案】</p>
                    <p v-html="streng.answer1"></p>
                    </div>
                </div>
            </div>
        </div>

        <PdfOptions ref="child" from="7" title="下载提分手册"></PdfOptions>
    </div>
</div>
<div class="maodian">
    <a v-for="item in titles" :href="item.src">{{item.title}}</a>
    <!-- <a href="#basic">一、基本信息</a>
    <a href="#score">二、成绩分析</a>
    <a href="#compare">三、多次对比折线图</a>
    <a href="#knowledges">四、知识点掌握情况</a>
    <a href="#questions">五、题目作答情况</a>
    <a href="#wrongs">六、错题巩固</a>
    <a href="#answers">七、参考答案</a>
    <a href="#comments">八、测评小结</a> -->
</div>
<!-- END -->
</div>
</template>

<script>

import echarts from "echarts"
import $echarts from "@/utils/echarts"
import QuestionInfo from '@/components/QuestionInfo.vue'
import Knowledges from '@/components/Knowledges.vue'
import PdfOptions from '@/components/PdfOptions.vue'
export default {
    name: 'TaskReport',
    data() {
        return {
            report: [],
            titles: [
                {'src': '#basic', 'title': '一、基本信息'},
                {'src': '#score', 'title': '二、成绩分析'},
                {'src': '#compare', 'title': '三、多次对比折线图'},
                {'src': '#knowledges', 'title': '四、知识点掌握情况'},
                {'src': '#questions', 'title': '五、题目作答情况'},
                {'src': '#wrongs', 'title': '六、错题巩固'},
                {'src': '#answers', 'title': '七、参考答案'},
            ],
            vip_titles: [
                {'src': '#basic', 'title': '一、基本信息'},
                {'src': '#score', 'title': '二、成绩分析'},
                {'src': '#compare', 'title': '三、多次对比折线图'},
                {'src': '#knowledges', 'title': '四、知识点掌握情况'},
                {'src': '#questions', 'title': '五、题目作答情况'},
                {'src': '#wrongs', 'title': '六、错题巩固'},
                {'src': '#answers', 'title': '七、参考答案'},
                {'src': '#comments', 'title': '八、测评小结'},
            ],
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
        PdfOptions,
    },
    methods: {
        getRport() {

            let data = {uid: this.uid, grade_id: this.grade_id}
            this.practice_id && (data.practice_id = this.practice_id)
            this.temp_code && (data.temp_code = this.temp_code)

            this.$http.post('/getTaskStudy', data).then(res=>{

                this.report = res.data

                //this.report.is_vip && (this.titles = this.vip_titles)
                
                this.$nextTick(function () {
                    $echarts.chart1(res.data.score, this.$refs.charts1)
                    $echarts.chart2(res.data.kcount, this.$refs.charts2)
                    $echarts.chart3(res.data, this.$refs.charts3)
                    this.chart5(res.data.chart5)
                    this.$func.setMath()
                })

            }).catch(res=>{})

        },
        getPdf() {
            let data = {practice_id: this.report.practice_id, uid: this.report.uid, grade_id: this.grade_id, name: this.report.name, username: this.report.username, from: 9}
            this.$func.getPdf(data)
        },
        chart5(c) {
            let myChart = echarts.init(this.$refs.charts5)
            let option = {
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: c.x,
                    boundaryGap: false, //显示在中间还是刻度线上
                    axisLabel: {
                        interval: 0,
                        rotate: -40,
						margin:20,
						formatter:function(value){  
							var str = ""; 
							var num = 4; //每行显示字数 
							var valLength = value.length; //该项x轴字数  
							var rowNum = Math.ceil(valLength / num); // 行数  
							
							if(rowNum > 1) {
								for(var i = 0; i < rowNum; i++) {
									var temp = "";
									var start = i * num;
									var end = start + num;
									temp = value.substring(start, end) + "\n";
									str += temp; 
								}
								return str;
							} else {
								return value;
							} 
						}
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