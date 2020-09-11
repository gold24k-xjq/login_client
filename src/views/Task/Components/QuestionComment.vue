<template>
<!-- START -->
<div class="cr_lr fr">
    <div class="cr_bg">
        <div class="cr_tit">试题讲评</div>
        <div class="tp_expb">
            <div class="tp_expbb">
                <div class="tp_expbl" @click="show_ans = !show_ans">隐藏答案和解析</div>
                <div class="tp_expbl" @click="show_user = !show_user">隐藏学生名单</div>
            </div>
            <!-- <div class="tp_expbb">
                <div class="tp_expblp">上一题</div>
                <div class="tp_expbln">下一题</div>
            </div> -->
        </div>
        <div class="tp_expn">
            <div class="tp_expnw swiper-container swipera">
                <div class="tp_expn_ln swiper-wrapper">
                    <span class="swiper-slide" :class="{'on': current == index}" v-for="(item, index) in report">第{{item.orders}}题</span>
                </div>
                <!-- <div class="tp_expnp swiper-button-prev"></div>
                <div class="tp_expnn swiper-button-next"></div> -->
            </div>
        </div>
        <div class="tp_expl" v-for="(item, index) in report" v-show="current == index">
            <div class="tp_expll">
                <div class="tp_expllt">
                    <h1>班级正确率</h1>
                    <span class="red">{{item.is_get ? item.is_get[0].per : 0}}%</span>
                    <!-- <h1 class="ml20">年级正确率</h1>
                    <span class="green">100.00%</span> -->
                </div>
                <div class="tp_expllm" v-html="item.title"></div>
                <!-- <div class="tp_expllb">试题反馈</div> -->
            </div>
            <div class="tp_expll" v-show="show_ans">
                <div class="tp_expllt">
                    <h1>答案与解析</h1>
                </div>
                <div class="tp_expllm">
                    答案:<div v-html="item.right_answer"></div>
                </div>
                <div class="tp_expllb">
                    解析：<p class="tp_expllbp" v-html="item.parse||'暂无解析'"></p>
                </div>
            </div>
            <div class="tp_expll" v-show="show_user">
                <div class="tp_expllt">
                    <h1>作答统计</h1>
                </div>
                <div v-for="is in item.is_get">
                    <div class="tp_expllb">
                        {{is.name}}：<span class="tp_expllbs">{{is.count}}人占{{is.per}}%</span>
                    </div>
                    <div class="tp_expllb">
                        {{is.users}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END -->
</template>

<script>

import Swiper from 'swiper'
export default {
    name: 'QuestionComment',
    data() {
        return {
            current : 0,
            report: [],
            show_ans: true,
            show_user: true,
        }
    },
    created() {
        let practice_id = this.$route.query.practice_id
        let grade_id = this.$route.query.grade_id
        this.getReport(practice_id, grade_id)
    },
    mounted() {
        let that = this
        this.swipera = new Swiper('.swipera', {
            freeMode: true,
            freeModeMomentumRatio: 0.5,
            slidesPerView: 7,
            slidesPerGroup: 1,
            observer: true, 
            observeParents: true,
            /*navigation: {
                nextEl: '.tp_expnn',
                prevEl: '.tp_expnp',
            },*/
            on: {
                slideChangeTransitionEnd: function(){
                    that.current = this.activeIndex
                },
                click: function(){
                    that.current = this.clickedIndex
                    that.swipera.slideToLoop(this.clickedIndex, 200, false)
                }
            }
        })

    },
    methods: {
        getReport(practice_id, grade_id) {
            this.$http.post('/getGradeReportComment', {practice_id: practice_id, grade_id: grade_id}).then(res=>{
                this.report = res.data
                this.$nextTick( () => {
                    this.$func.setMath()
                })
            }).catch(res=>{})
        },
    },
}
</script>