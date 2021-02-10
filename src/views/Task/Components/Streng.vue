<template>
<!-- START -->
<div class="cr_lrn fr">
    <div class="error-tab">
        <ul>
            <li v-for="(item, index) in titles" @click="switchs(index)" :class="{'on': current == index}">{{item}}</li>
        </ul>
    </div>
    <div style="border-top: 1px solid #cbcbcb;margin-top: -1px;">
        <div class="cr_bgp" v-show="current == 0">
            <div class="cr_bg" style="margin-top: 0;">
                <div class="crn_titt">
                    <div class="cr_tit">共性题集</div>
                    <!-- <div class="crn_tittr">
                        <span>按时间筛选：</span>
                        <div class="zql_em">
                            <input type="text" class="ipt">
                        </div>
                        <button class="set_tmrb">搜索</button>
                    </div> -->
                </div>
                <ul class="int_tb">
                    <li v-for="item in common">
                        <p class="int_tbt">{{item.subject_name}}共性题集</p>
                        <p class="int_tbt1">{{$func.formatDate(item.start)}} 至 {{$func.formatDate(item.end)}}</p>
                        <p class="int_tbt2">发布时间：<span>{{item.addtime}}</span></p>
                        <!-- <button class="int_tbtn" @click="getCommonDownload(item)">下载</button> -->
                        <div class="int_tbnn">
                            <button @click="getCommonPdf(item)">错题集</button>
                            <button @click="getCommonDownload(item)">强化题集</button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="cr_bgp" v-show="current == 1">
            <div class="cr_bg" style="margin-top: 0;">
                <div class="crn_titt">
                    <div class="cr_tit">个性题集</div>
                    <div class="crn_tittr ml">
                        <span>按姓名搜索：</span>
                        <div class="zql_emm">
                            <input type="text" class="ipt" placeholder="请准确输入学生姓名" v-model="username" @keyup.enter="search">
                        </div>
                        <button class="set_tmrb" @click="search">搜索</button>
                    </div>
                    <!-- <div class="crn_tittr">
                        <span>按时间筛选：</span>
                        <div class="zql_em">
                            <input type="text" class="ipt" id="timer1" @click="getTime">
                        </div>
                        <button class="set_tmrb">搜索</button>
                    </div> -->
                </div>
                <div class="tp_expn">
                    <div class="tp_expnw tp_expnww swiper-container swiper-streng">
                        <div class="tp_expnp"></div><div class="tp_expnn"></div>
                        <div class="tp_expn_ln swiper-wrapper">
                            <span class="swiper-slide" :class="{'on': current_uid == item.uid}" @click="current_uid = item.uid;current_username = item.username" v-for="(item, index) in users">{{item.username}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cr_bg">
                <div class="cr_titn"><span>个人成绩多次对比折线图</span></div>
                <div ref="main" style="width: 85%;height:500px;margin-left: 20px;"></div>
                <p class="zql_ep">温馨提示：折线图默认显示最近5次作业正确率的对比<!-- ，如需查看其他可点击上方日期筛选（时间跨度大时会影响加载速度哦） --></p>
            </div>
            <div class="cr_bg">
                <div class="crn_tit">
                    <div class="cr_titn"><span>强化题集</span></div>
                    <!-- <button class="crn_titbtn">下载全部</button> -->
                </div>
                <ul class="int_ul">
                    <li v-for="item in weeks">
                        <p class="int_tbt"><i></i>{{item.subject_name}}个性题集</p>
                        <p class="int_tbt1">{{$func.formatDate(item.start)}} 至 {{$func.formatDate(item.end)}}</p>
                        <p class="int_tbt2">发布时间：<span>{{item.addtime}}</span></p>
                        <!-- <button class="int_tbtn" @click="getDownload(item)">查看强化题集<i></i></button> -->
                        <div class="int_ul_d">
                            <button class="int_ul_d_btn" @click="getPdf(item)">错题集<i></i></button>
                            <button class="int_ul_d_btn" @click="getDownload(item)">强化题集<i></i></button>
                        </div>
                       
                    </li>
                </ul>
            </div>
        </div>
        <div class="cr_bgp" v-show="current == 2">
            <div class="cr_bg" style="margin-top: 0;">
                <div class="crn_titt">
                    <div class="cr_tit">个性错题集</div>
                    <div class="crn_tittr">
                        <span>按时间筛选：</span>
                        <div class="zql_em">
                            <input type="text" id="test1" class="ipt">
                        </div>
                        <button class="set_tmrb">搜索</button>
                    </div>
                </div>
            </div>
            <div class="cr_bg">
                <div class="cr_titn"><span>错题集</span></div>
                <ul class="int_ul">
                    <li>
                        <p class="int_tbt"><i></i>物理共性强化题集</p>
                        <p class="int_tbt1">2020-03-20 至 2020-03-26</p>
                        <p class="int_tbt2">发布时间：<span>2020-03-27</span></p>
                        <button class="int_tbtn">打包下载<i></i></button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
<!-- END -->
</template>

<script>

import echarts from "echarts"
import Swiper from 'swiper'
export default {
    name: 'Streng',
    data() {
        return {
            current: 1,
            //titles: ['共性强化题集', '个性强化题集', '个性打包下载'],
            titles: ['共性题集', '个性题集'],
            current_uid: 0,
            current_username: '',//为了生成个性报告时带上用户名
            users: [],
            weeks: [],
            common: [],
            username: '',//搜索
            access: true,
        }
    },
    created() {
        let practice_id = this.$route.query.practice_id
        let grade_id = this.$route.query.grade_id
        this.grade_id = grade_id
        this.subject_id = this._props.origin.subject_id
        this.getReport()
        this.getCommon()
    },
    props: {
        origin: {
            type: [Array, Object]
        }
    },
    watch: {
        current_uid(value) {
            this.getWeekByUid()
            this.getScoreByUid()
        },
    },
    methods: {
        getCommon() {
            this.$http.post('/getGradeReportStrengCommon', {subject_id: this.subject_id, grade_id: this.grade_id}).then(res=>{
                this.common = res.data
            }).catch(res=>{})
        },
        getReport() {
            this.$http.post('/getGradeUsers', {subject_id: this.subject_id, grade_id: this.grade_id}).then(res=>{
                this.current_uid = res.data[0].uid
                this.current_username = res.data[0].username
                this.users = res.data
            }).catch(res=>{})
        },
        getWeekByUid(uid) {
            this.$http.post('/getWeekByUid', {uid: this.current_uid, subject_id: this.subject_id}).then(res=>{
                this.weeks = res.data
            }).catch(res=>{})
        },
        getScoreByUid(uid) {
            this.$http.post('/getScoreByUid', {uid: this.current_uid, grade_id: this.grade_id}).then(res=>{
                this.$refs.main.style.display = 'block'
                this.$nextTick(function () {
                    this.showchart(res.data)
                })
            }).catch(res=>{
                this.$refs.main.style.display = 'none'
            })
        },
        getPdf(item) {
            let data = {uid: this.current_uid, subject_id: item.subject_id, start: item.start, end: item.end, username: this.current_username, from: 5}
            this.$func.getPdf(data)
        },
        getCommonPdf(item) {
            let data = {grade_id: this.grade_id, subject_id: item.subject_id, start: item.start, end: item.end, from: 6}
            this.$func.getPdf(data)
        },
        getCommonDownload(item) {
            
            if (!this.access) return
            this.access = false
            this.$func.load()
            let data = {
                'grade_id': this.grade_id,
                'subject_id': item.subject_id, 
                'start': item.start, 
                'end': item.end
            }
            this.$http.post('/setStrengCommon', data).then(res=>{
                this.access = true
                layer.closeAll('loading');
                this.$func.downloads(res.data)
            }).catch(res=>{
                this.access = true
                layer.closeAll('loading');
            })
            
        },
        getDownload(item) {
            if (item.path) {
                this.$func.downloads(item)
            } else {
                if (!this.access) return
                this.access = false
                this.$func.load()
                let data = {
                    'username': this.current_username,
                    'uid': this.current_uid, 
                    'subject_id': item.subject_id, 
                    'start': item.start, 
                    'end': item.end
                }
                this.$http.post('/setStrengByUid', data).then(res=>{
                    this.access = true
                    layer.closeAll('loading')
                    this.$func.downloads(res.data)
                }).catch(res=>{

                    this.access = true
                    layer.closeAll('loading')
                })
            }
        },
        search() {
            if (!this.username) {
                this.$func.error('请准确输入学生姓名')
                return
            }
            let result = this.$func.find(this.username, this.users)
            let uid = result[1]
            if (!uid) {
                this.$func.error('信息不存在')
                return
            }
            this.swiperstreng.slideToLoop(result[0], 200, false)
            this.current_uid = uid
            this.current_username = result[2]
        },
        switchs(index) {
            this.current = index
            //$(window).resize(myChart.resize)
            $(window).trigger('resize');
        },
        showchart(e){
            var myChart = echarts.init(this.$refs.main);
            let option = {
                title : {
                    text: '',
                    subtext: ''
                },
                /*tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'line' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },*/
                tooltip: {
                    trigger: 'axis',
                  　axisPointer: {
                  　　　type: 'cross'
                  　},
                  　formatter:function(params){
                        var res = params[0].name+'<br/>';
                        var res='<div><p>'+params[0].name+'</p></div>' 
                        res+='<p>'+'个人正确率'+':'+params[0].data+'</p>'
                        res+='<p>'+'班级平均正确率'+':'+params[1].data+'</p>'
                        res+='<p>'+'班级最高正确率'+':'+params[2].data+'</p>'
                        res+='<p>'+'提交作业时间'+':'+params[3].data+'</p>'
                  　　　return res;
                  　}
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                legend: {
                    data:['个人正确率', '班级平均正确率', '班级最高正确率', '提交作业时间']
                },
                color: ['#FE9900', '#87CEFA', '#DA70D6'],
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
                xAxis: [{
                    type : 'category',
                    boundaryGap : false,
                    data : e.name,
                    axisLabel: {  /*****重点还是在这里哦**///
                        textStyle: {
                            color: '#7c8893',
                            fontSize: 12
                        },
                        interval: 0,
                         rotate: -20       
                    }
                }],
                yAxis: [{
                    type : 'value',
                    axisLabel : {
                        formatter: '{value} %'
                    }
                }],
                series : [
                    {
                        name:'个人正确率',
                        type:'bar',
                        barWidth: 20, // 柱图宽度
                        barMaxWidth: 20, // 最大宽度
                        data: e.score
                    },
                    {
                        name: '班级平均正确率',
                        type: 'line',
                        data: e.avg
                    },
                    {
                        name: '班级最高正确率',
                        type: 'line',
                        data: e.max
                    },
                    {
                        name: '提交作业时间',
                        type: 'line',
                        data: e.addtime
                    }
                ]
            }
            myChart.setOption(option);
        }
    },
    mounted() {
        this.swiperstreng = new Swiper('.swiper-streng', {
            freeMode: true,
            freeModeMomentumRatio: 0.5,
            slidesPerView: 7,
            slidesPerGroup: 1,
            observer: true, 
            observeParents: true,
            navigation: {
                nextEl: '.tp_expnn',
                prevEl: '.tp_expnp',
            }
        })
    },
}
</script>