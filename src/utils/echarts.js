
import echarts from "echarts"

const chart1 = (score, refs) => {
    /*let y1 = 3 * score
    let y2 = Math.round((300 - y1) * 100) / 100*/
    let y1 = score
    let y2 = 100 - score
    let myChart = echarts.init(refs)
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
            label: {
                show: true,
                position: 'center',
                // formatter:"{d}%"
                formatter: function (params) { // 默认显示第一个数据
                  if (params.dataIndex === 0) {
                    return params.percent+'%'
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
}


const chart2 = (k, refs) => {
    let myChart = echarts.init(refs)
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
}


const chart3 = (questions, refs) => {
    let myChart = echarts.init(refs)
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['#01AA8D', '#D71A20'],
        color: ['#4b9bf2', '#febc44'],
        legend: {
            orient: 'horizontal',
            left:'center',
            bottom: -5,
            data: ['正确数', '错误数']
        },
        series: [{
            name: '题目完成情况',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
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
                    fontSize: '14',
                    fontWeight: 'bold'
                }
            },
             labelLine: {
                show: true,
                normal: {
                    length: 2,//设置延长线的长度
                    length2: 30,//设置第二段延长线的长度
                }
            },
            data: [
                {value: questions.get, name: '正确数'},
                {value: questions.unget, name: '错误数'},
            ]
        }]
    };
    myChart.setOption(option);
}


const chart4 = (k, refs) => {
    let myChart = echarts.init(refs)
    let option = {
        color: ['#D71A20', '#FF9900','#007BC8','#01AA8D','#D71A20'],
        series : [{
            name: '访问来源',
            type: 'pie',    // 设置图表类型为饼图
            radius: '70%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            data: k
        }]
    };
    myChart.setOption(option);
}


export default {
    chart1,
    chart2,
    chart3,
    chart4,
}