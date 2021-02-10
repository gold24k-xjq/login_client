<template>
<div class="content">
	<div class="w1200 pt">
		<back></back>
		<div class="cr_nb">
            <div class="cr_nb_bg zh_liptoh" >
                <p class="cr_bgtit fl">{{report.name}}
                	<!-- <i class="cr_bgtiti" @click="getPdf"></i> -->
                	<span class="cr_bgtiti_ft" @click="getPdf">下载pdf</span>	
                </p>
                <img class="cr_bgtitimg fr" :src="report.path">
            </div>
			<div class="cr_nb_bg">
				<div class="cr_tit">基本信息</div>
				<table class="ea_tab">
					<tr>
						<th>姓名</th>
						<th>手机号</th>
						<th>学科</th>
						<th>试题数量</th>
						<th>本次得分率</th>
						<th>最高得分率</th>
						<th>知识点数量</th>
                        <th>等级</th>
					</tr>
					<tr>
						<td>{{report.username}}</td>
						<td>{{report.phone}}</td>
						<td>{{report.subject}}</td>
						<td>{{report.q_count}}</td>
						<td>{{report.score}}%</td>
						<td>100%</td>
						<td v-if="report.kcount">{{report.kcount.total}}</td>
                        <td>{{report.level}}</td>
					</tr>
				</table>
			</div>
			<div class="cr_nb_bg">
				<div class="cr_tit">成绩分析</div>
				<div class="ea_ehts">
					<!-- <div id="main1" class="fl" style="width:50%;height: 350px"></div> -->
					<div class="fl" style="position: relative;width:33%;">
						<div class="ea_ehts_t">得分情况</div>
						<div ref="charts1" style="width:100%;height: 230px;"></div>	
						<div class="cr_infomf" style="bottom: 0">最高得分率100%</div>				
					</div>
					<div class="fl" style="position: relative;width:33%;">
						<div class="ea_ehts_t">知识点掌握情况</div>
						<div ref="charts2" class="fl" style="width:100%;height: 230px"></div>
						<div class="cr_infomf" style="bottom: 0" v-if="report.kcount">知识点总数：{{report.kcount.total}}</div>	
					</div>
					<!-- <div id="main2" ref="charts3" class="fl" style="width:33%;height: 230px"></div> -->
					<div class="fl" style="position: relative;width:33%;">
						<div class="ea_ehts_t">题目完成情况</div>
						<div ref="charts3" class="fl" style="width:100%;height: 230px"></div>
					</div>
				</div>
			</div>
            <div class="cr_nb_bg">
                <div class="cr_tit">试卷分析</div>
                <table class="cr_table_t">
                    <tr>
                        <th>难度系数</th>
                        <th width="50%">题号</th> 
                        <th>做对数</th> 
                        <th>做错数</th> 
                    </tr> 
                    <tbody>
                        <tr v-for="(item, index) in report.q_weight">
                            <td>{{item.diff}}</td>
                            <td>{{item.orders}}</td> 
                            <td>{{item.right}}</td> 
                            <td>{{item.wrong}}</td> 
                        </tr>
                    </tbody>
                </table>
            </div>
            <Knowledges :knowledges="report.knowledges"></Knowledges>
			<QuestionInfo :questions="report.questionlist" from="3"></QuestionInfo>
            <div class="cr_nb_bg">
                <div class="cr_tit">变式练习</div>
                <div v-for="(item, kindex) in report.knowledges" v-if="item.true == 0">
                    <div class="j-title">【知识点】{{item.name}}</div>
                    <div v-if="!item.streng">抱歉，暂未找到对应级别的试题</div>
                    <div class="cr_lmt" v-else v-for="(streng, index) in item.streng">
                        <div>{{kindex + 1}}.{{index + 1}}<div class="dis_inline" v-html="streng.title"></div></div>
                        <ul class="a_choose">
                            <li v-for="answer in streng.answers">
                                <span class="fl">{{answer.order}}.</span>
                                <div class="fl a_choose_lid" v-html="answer.answer"></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="cr_nb_bg">
                <div class="cr_tit">参考答案</div>
                <div class="j-title checked">评测题目参考答案</div>
                <div class="cr_lmt" v-for="item in report.questionlist">
                    <div>第{{item.orders}}题</div>
                    <div class="wq_b wq_b_img"><span>【参考答案】</span><div class="wq_bib" v-html="item.right_answer"></div></div>
                    <div class="wq_b wq_b_img"><span>【试题解析】</span><div class="wq_bib" v-html="item.parse || '暂无解析'"></div></div>
                </div>
                <div class="j-title checked">变式练习参考答案</div>
                <div class="cr_lmt" v-for="(item, kindex) in report.knowledges" v-if="item.true == 0">
                    <div v-for="(streng, index) in item.streng">
                        <div>第{{kindex + 1}}.{{index + 1}}题</div>
                        <div class="wq_b wq_b_img"><span>【参考答案】</span><div class="wq_bib" v-html="streng.answer1"></div></div>
                        <div class="wq_b wq_b_img"><span>【试题解析】</span><div class="wq_bib" v-html="streng.answer2 || '暂无解析'"></div></div>
                    </div>
                </div>
            </div>
			<div class="cr_nb_bg">
				<div class="cr_tit">小结</div>
				<p class="ea_kp cr_t_titw">{{report.comment}}</p>
			</div>
		</div>
	</div>
</div>
</template>

<script>

import echarts from "echarts"
import $echarts from "@/utils/echarts"
const QuestionInfo = () => import("@/components/QuestionInfo")
const Knowledges = () => import("@/components/Knowledges")
export default {
	data () {
		return {
			report: [],
			streng_knowledges: [],
			colors: ['#ccc', '#f66203', '#ffed00', '#b4cd03', '#02a014', '#fff', '#fff', '#fff'],
		}
	},
	components: {
        QuestionInfo,
        Knowledges
	},
	created() {
		this.id = this.$route.query.id
		this.getReport()
	},
	watch: {
		report(value) {
			this.streng_knowledges = value.knowledges.filter(f => f.level <= 3)
		}
	},
	methods:{
		getReport() {
            this.$http.post('/getOnlineReport', {id: this.id}).then(res=>{

                this.report = res.data
                
                this.$nextTick(function () {
                    $echarts.chart1(res.data.score, this.$refs.charts1)
                    $echarts.chart2(res.data.kcount, this.$refs.charts2)
                    $echarts.chart3(res.data.questions, this.$refs.charts3)
                })

            }).catch(res=>{})
			/*this.$http.post('/getPaperReport', {id: this.id}).then(res=>{
                this.report = res.data
                this.$nextTick(() => {
                	//this.initData1();
					this.initData2();
					//this.initData3();
					this.initData4();
					this.initData5();
                })
            }).catch(res=>{})*/
		},
		bdcolors(index) {
			let color = this.colors[index]
			let style = `2px solid ${color}`
			return {border: style}
		},
		getPdf() {
			let item = this.report
            let data = {id: item.id, username: item.username, from: 11}
            this.$func.getPdf(data)
        },
	    //初始化数据
	    initData1() {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main1'));
			var data = []
			this.report.knowledges.forEach(item => {
				data.push({value: item.score_percent, name: item.knowledge_name})
			})

			// 绘制图表
			myChart.setOption({
				title : {
					text: '本次一级知识点分数占比',//主标题
					subtext: '',//副标题
					x: 'center',//x轴方向对齐方式
				},
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					bottom: 'bottom',
					data: []
				},
				series : [
					{
						name: '本次一级知识点分数占比',
						type: 'pie',
						minAngle: 5,           　　 //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
						avoidLabelOverlap: true,   //是否启用防止标签重叠策略
						radius : '70%',
						center: ['50%', '58%'],
						data: data,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							},
							normal:{
								color: function(params) {
									//自定义颜色
									/*var colorList = [          
										'#d71920', '#ff9900', '#007bc8', '#dfcf23', '#2ad19b', '#00aa8d',
									];
									return colorList[params.dataIndex]*/
									return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
								},
							}
						},
						label:{        
							 normal:{
								formatter(v) {
									let text = v.name + '' + Math.round(v.percent)+'%'
									if(text.length <= 8)
									{
										return text;
									}else if(text.length > 8 && text.length <= 16){
										return text = `${text.slice(0,8)}\n${text.slice(8)}`
									}else if(text.length > 16 && text.length <= 24){
										return text = `${text.slice(0,8)}\n${text.slice(8,16)}\n${text.slice(16)}`
									}else if(text.length > 24 && text.length <= 30){
										return text = `${text.slice(0,8)}\n${text.slice(8,16)}\n${text.slice(16,24)}\n${text.slice(24)}`
									}else if(text.length > 30){
										return text = `${text.slice(0,8)}\n${text.slice(8,16)}\n${text.slice(16,24)}\n${text.slice(24,30)}\n${text.slice(30)}`
									}
								},
								textStyle : {
									fontSize : 12
								}
							}
					    }
					}
				]
			});
	    },
		initData2() {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main2'));
			// 绘制图表
			myChart.setOption({
				title : {
					text: '试题对错数占比',//主标题
					x:'center',//x轴方向对齐方式
					textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
		                fontWeight: 'normal',
		                fontSize:'16',
		                color:"#000"
		            },
				},
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				color: ['#01aa8d', '#d71a20','#ccc'],
				legend: {
					orient: 'horizontal',// vertical
					left: 'center',
					bottom:-5,
					data: ['做对', '做错', '半对']
				},
				series: [
					{
						name: '试题对错数占比',
						type: 'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						center: ['50%', '55%'],
						fontWeight:'none',
						label: {
							show: false,
							position: 'center'
						},
						emphasis: {
							label: {
								show: false,
								fontSize: '30',
								fontWeight: 'bold'
							}
						},
						labelLine: {
		                    show: true,
		                    normal: {
		                        length: 2,//设置延长线的长度
		                        length2: 60,//设置第二段延长线的长度
		                    }
		                },
		                label: {
		                    show: true,
		                    position: 'center',
		                     normal: {
		                            formatter: ' {b|{b}} {c|{c}}  \n\n',       //图形外文字上下显示
		                            borderWidth: 20,
		                            borderRadius: 4,
		                            padding: [0, -30],          //文字和图的边距
		                            rich: {
		                                a: {
		                                    color: '#333',
		                                    fontSize: 20,
		                                    lineHeight: 20
		                                },
		                                
		                            }
		                        }
		                },
						data: [
							{value: this.report.question_get[1], name: '做对'},
							{value: this.report.question_get[2], name: '做错'},
							{value: this.report.question_get[3], name: '半对'},
						]
					}
				]
			});
		},
		initData4() {
			let score = this.report.score
		    let y1 = this.report.percent
		    let y2 = 100 - y1
		    let myChart = echarts.init(this.$refs.charts1)
		    var option = { 
		        tooltip: {
		            trigger: 'item',
		            formatter: '{a} <br/>{b}: {c} ({d}%)'
		        },
		        color: ['#01AA8D', '#D71A20'],
		        legend: {
		            orient: 'vertical',
		            right:0,
		            bottom: 0,
		            data: ['正确数', '错误数']
		        },
		        textStyle: {　　　　　　　　　
		             fontSize: 18,
		        },
		        series: [{
		            name: '得分情况',
		            type: 'pie',
		            radius: ['50%', '70%'],
		            avoidLabelOverlap: false,
		            center:['50%','55%'],
		            label: {
		                show: true,
		                position: 'center',
		                // formatter:"{d}%"
		                formatter: function (params) { // 默认显示第一个数据
		                  if (params.dataIndex === 0) {
		                    return score+'分'
		                  }
		                },
		            },
		            emphasis: {
		                label: {
		                    show: true,
		                    fontSize: '14',
		                    fontWeight: 'bold',
		                }
		            },
		            labelLine: {
		                show: false
		            },
		            data: [ 
		                {
		                    value: y1,
		                    itemStyle: {
		                        normal: {
		                            color: "#01C15F"

		                        },  
		                    },
		    
		                },
		                {
		                    value: y2,
		                    itemStyle: {
		                        normal: {
		                            color: "#c9c9c9"
		                        }
		                    }
		                },
		            ]
		        }]
		    };
		    myChart.setOption(option);
		},
		initData5() {
			let myChart = echarts.init(this.$refs.charts2)
			let k =this.report.k_get
		    var option = {
		        tooltip: {
		            trigger: 'item',
		            formatter: '{a} <br/>{b}: {c} ({d}%)'
		        },
		        color: ['#01AA8D', '#D71A20'],
		        legend: {
		            orient: 'vertical',
		            right:0,
		            bottom: 0,
		            data: ['', '']
		        },
		        series: [{
		            name: '知识掌握情况',
		            type: 'pie',
		            radius: ['50%', '70%'],
		            avoidLabelOverlap: true,
		            center:['50%','55%'],
		            labelLine: {
		                show: true,
		                normal: {
		                    length: 2,//设置延长线的长度
		                    length2: 30,//设置第二段延长线的长度
		                }
		            },
		            label: {
		                show: true,
		                position: 'center',
		                normal: {
		                    formatter: ' {b|{b}} {c|{c}}  \n\n',       //图形外文字上下显示
		                    borderWidth: 20,
		                    borderRadius: 4,
		                    padding: [0, -30],          //文字和图的边距
		                    rich: {
		                        a: {
		                            color: '#333',
		                            fontSize: 20,
		                            lineHeight: 20
		                        },
		                        
		                    },
		                    textStyle: {
		                        fontSize: 12
		                      }
		                }
		            },
		            emphasis: {
		                label: {
		                    show: true,
		                    fontSize: '20',
		                    fontWeight: 'bold'
		                }
		            },
		            data: [
		                {value: k.get, name: '已掌握'},
		                {value: k.unget, name: '未掌握'},
		            ]
		        }]
		    };
		    myChart.setOption(option);
		},
		initData3() {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main3'));
			var Cdata = [
				{name: '未掌握'},
				{name: '入门'},
				{name: '了解'},
				{name: '熟练'},
			    {name: '掌握'},	
			    {name: ''},
			    {name: ''},
			    {name: ''},
			]
			
			const levels = 4//知识点掌握级别的最大数，及级别个数减1
			const klevel_num = 4//知识点父子级别个数

			var Sdata = []
			this.report.knowledges.forEach(item => {
				Sdata.push({category: item.level, name: item.knowledge_name})
				item.parents.forEach(value => {
					Sdata.findIndex(f => f.name == value.knowledgename) == -1 && Sdata.push({category: levels+klevel_num-parseInt(value.level), name: value.knowledgename})
				})
			})   
			
			var linkData = []
			this.report.knowledges.forEach(item => {
				for (let i = item.parents.length - 1; i >= 1; i --) {
					linkData.push({source: item.parents[i-1].knowledgename, target: item.parents[i].knowledgename})
				}
				
			})
			
			var color = this.colors
			function solve_Sdata(val){
			    for(var i=0; i<val.length; i++){
			    	if (val[i].category >= levels+1) {
			    		let size = 70+(val[i].category-levels)*10
			    		val[i] = {
				            name: val[i].name,
				            symbolSize: size, // 控制每个圆的大小
				            draggable: false, // 控制是否可拖动
				            category: val[i].category, // 对应工具显示隐藏
				            itemStyle: {
				                normal: {
				                    borderColor: '#000', //圆边框的颜色
				                    borderWidth: 1,
				                    color: color[val[i].category], // 圆背景的颜色
				                }
				            }
				        }
			    	} else {
			    		val[i] = {
				            name: val[i].name,
				            symbolSize: 70, // 控制每个圆的大小
				            draggable: false, // 控制是否可拖动
				            category: val[i].category, // 对应工具显示隐藏
				            itemStyle: {
				                normal: {
				                    borderColor: '#fff', //圆边框的颜色
				                    borderWidth: 0,
				                    color: color[val[i].category], // 圆背景的颜色
				                }
				            }
				        }
			    	}
			        
			    }
			    return val
			}
			
			function solve_linkData(val){
			    for(var i=0; i<val.length; i++){
			        val[i]['lineStyle'] = {
			            normal: {
			                color: {
			                    type: 'linear',
			                    x: 0,
			                    y: 0,
			                    x2: 0,
			                    y2: 1,
			                    colorStops: [{
			                        offset: 0, color: '#d8e4eb' // 0% 处的颜色
			                    }, {
			                        offset: 1, color: '#929db3' // 100% 处的颜色
			                    }],
			                    globalCoord: false // 缺省为 false
			                }
			            }
			        }
			    }
			   return val 
			}
			
			var series = [
			    {
			        type: 'graph',
			        layout: 'force',
			        force:{
			            repulsion: 180,//控制区域大小
			            edgeLength: 100//控制线的长短
			        },
			        roam: false, // 整个是否可拖动  
					focusNodeAdjacency: true,//是否显示关联节点
			        label: {
		                show: true, // 圆圈中文字是否显示
						textStyle: {
						    fontSize: 12,
						    color: "#000"
						},
						formatter(v) {
							let text = v.name
							let num = 5
							if (text.length <= num) {
								return text
							} else {
								let count = Math.ceil(text.length / num)
								let final = ''
								for (let i = 0; i < count; i ++) {
									let enter = i+1 == count ? '' : '\n'
									final += text.slice(i*num, (i+1)*num) + enter
								}
								return final
							}
						},
			        },
			        edgeSymbolSize: [0, 10],
			        edgeLabel: {
			            normal: { // 连线上的文字配置
			                show: false, //是否显示
			                textStyle: {
			                    fontSize: 12,
			                    color: "#000"
			                },
			                formatter: "{c}"
			            }
			        },
			        // edgeSymbol: ['circle', 'arrow'], // 连接线的指向箭头
			        data: solve_Sdata(Sdata),
			        links: solve_linkData(linkData), //父-->子节点数据
			        lineStyle: {
			            normal: {
			                opacity: 1,
			                width: 1,
			                curveness: 0, // 连接线的弯曲程度
			                type:'dotted',
			            }
			        },
			        categories: Cdata //圆的类别组件数据
			    }
			]
			// 绘制图表
			myChart.setOption({
				backgroundColor: '#fff',
		        tooltip: {},
		        animationDurationUpdate: 1500,
		        animationEasingUpdate: 'quinticInOut',
		        color: color,
		        legend: { // 类别是否显示
		            show: true,
		            textStyle: {
		                color: "#000"
		            },
		        },
		        series: series
			});
		},
	}
}
</script>