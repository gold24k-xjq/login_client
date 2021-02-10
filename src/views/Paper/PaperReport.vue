<template>
<div class="content">
	<div class="w1200 pt">
		<back></back>
		<div class="cr_nb">
			<div class="cr_nb_bg">
				<div class="cr_tit">总览<!-- <button class="fr cr_tit_btn">导出</button> --></div>
				<p class="ea_p">{{report.username}}同学你好，本次报告来自考试《{{report.name}}》，本次共有{{report.q_count - report.rq_count}}道错题（共{{report.q_count}}题），得分{{report.score}}分（满分{{report.score_total}}分），继续加油吧。</p>
				<table class="ea_tab">
					<tr>
						<th>姓名</th>
						<th>手机号</th>
						<th>学科</th>
						<th>试题数量</th>
						<th>本次得分</th>
						<th>满分</th>
						<th>知识点数量</th>
					</tr>
					<tr>
						<td>{{report.username}}</td>
						<td v-if="report.user">{{report.user.phone}}</td>
						<td>{{report.subject_name}}</td>
						<td>{{report.q_count}}</td>
						<td>{{report.score}}</td>
						<td>{{report.score_total}}</td>
						<td>{{report.k_count}}</td>
					</tr>
				</table>
			</div>
			<div class="cr_nb_bg">
				<div class="cr_tit">试卷分析</div>
				<div class="ea_ehts">
					<!-- <div id="main1" class="fl" style="width:50%;height: 350px"></div> -->
					<div class="fl" style="position: relative;width:33%;">
						<div class="ea_ehts_t">得分情况</div>
						<div ref="charts1" style="width:100%;height: 230px;"></div>	
						<div class="cr_infomf" style="bottom: 0">满分{{report.score_total}}分</div>				
					</div>
					<div class="fl" style="position: relative;width:33%;">
						<div class="ea_ehts_t">知识点掌握情况</div>
						<div ref="charts2" class="fl" style="width:100%;height: 230px"></div>
						<div class="cr_infomf" style="bottom: 0">知识点总数：{{report.k_count}}</div>	
					</div>
					<div id="main2" class="fl" style="width:33%;height: 230px"></div>
				</div>
			</div>
			<div class="cr_nb_bg"><PaperInfo :questions="report.questions"></PaperInfo></div>
			<div class="cr_nb_bg">
				<div class="cr_tit">知识点掌握情况</div>
				<table class="ea_grtab table_lf">
			        <tr>
			          	<th colspan="6">本次考试知识点分析</th>
			        </tr>
			        <tr>
			          	<th>一级知识点</th>
			          	<th>二级知识点</th>
			          	<th>三级知识点</th>
			          	<th>四级知识点</th>
			          	<th>得分比</th>
			          	<th>掌握水平</th>
			        </tr>
			        <tr v-for="(item, index) in report.knowledges">
			          	<td :rowspan="item.rowspan1" v-if="item.rowspan1">{{item.parents[0].knowledgename}}</td>
			          	<td :rowspan="item.rowspan2" v-if="item.rowspan2">{{item.parents[1].knowledgename}}</td>
			          	<td :rowspan="item.rowspan3" v-if="item.rowspan3">{{item.parents[2].knowledgename}}</td>
			          	<td><span v-if="item.parents[3]">{{item.parents[3].knowledgename}}</span></td>
			          	<td>{{item.percent}}%</td>
			          	<td>
			            	<div class="ea_grtab_f">
			              		<span class="cr_pro"><span class="cr_prola" :style="{width: item.percent+'%', backgroundColor: colors[item.level]}"></span><i>{{item.percent}}%</i></span>
			            	</div>
			          	</td>
			        </tr>
			    </table>
			</div>
			<!-- <div class="cr_nb_bg">
				<div class="cr_tit">知识图谱</div>
				<div id="main3" style="width:100%;height: 100vh;margin: 20px 0;"></div>
			</div> -->
			<div class="cr_nb_bg">
				<div class="cr_tit">知识点简评</div>
				<p class="ea_kp">{{report.knowledge_content}}</p>
				<div class="ea_ks">
					<span class="at" :style="bdcolors(item.level)" v-for="item in streng_knowledges">{{item.knowledge_name}}</span>
				</div>
			</div>
			<div class="cr_nb_bg">
				<div class="cr_tit">小结</div>
				<p class="ea_kp">{{report.comment}}</p>
			</div>
		</div>
	</div>
</div>
</template>

<script>

import echarts from "echarts"
const PaperInfo = () => import("@/components/PaperInfo")
export default {
	data () {
		return {
			report: [],
			streng_knowledges: [],
			colors: ['#ccc', '#f66203', '#ffed00', '#b4cd03', '#02a014', '#fff', '#fff', '#fff'],
		}
	},
	components: {
		PaperInfo,
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
			 this.$http.post('/getPaperReport', {id: this.id}).then(res=>{
                this.report = res.data
                this.$nextTick(() => {
                	//this.initData1();
					this.initData2();
					//this.initData3();
					this.initData4();
					this.initData5();
                })
            }).catch(res=>{})
		},
		bdcolors(index) {
			let color = this.colors[index]
			let style = `2px solid ${color}`
			return {border: style}
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