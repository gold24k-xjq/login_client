<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200">
        <div class="cr_bg">
            <!-- <h1 class="dt_h1">标题</h1> -->
            <p class="dt_p">已答{{done}}题，未答{{undone}}题</p>
            <ul class="cr_tanaul dt_cr">
                <li v-for="(item, index) in questions" :class="[{'on': current == index}, {'done': item.myanswer}]" @click="toIndex(index)">{{index + 1}}</li>
            </ul>
        </div>
        <div class="cr_bg">
            <div class=" swiper-container swiper_online">
                <ul class="cr_talist_ul dt_cr_talist_ul swiper-wrapper">
                    <li class="cr_talist_ulli swiper-slide" v-for="(item, index) in questions">
                        <div>
                            <p style="display: inline-block;">{{index + 1}}、<div class="x-title" v-html="item.title"></div></p>
                        </div>
                        <ul class="cr_talist_uiu">
                            <li v-for="(answer, key) in item.answers" @click="checked(index, key)">
                                <span class="wa_list_g" :class="{'wa_list_gg': key == item.myanswer}"></span>
                                <p class="wa_list_gp">{{key}} <div v-html="answer"></div></p>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="vrot_btn">
                    <button class="x-prev" :class="{'on': current != 0}">上一题</button> 
                    <button class="x-next" :class="{'on': current != total-1}">下一题</button>
                    <button class="cp_btnn" @click="submit">交卷</button>
                </div>
                <div class="cp_p">单选题，请选择你认为正确的答案</div>
            </div>
        </div>
        
    </div>
</div>
<!-- END -->
</div>
</template>

<script>

import Swiper from 'swiper'
export default {
    name: 'Online',
    data() {
        return {
            questions: [],
            total: 0,
            done: 0,
            undone: 0,
            access: true,
            current: 0,
        }
    },
    created() {

        this.uid = this.$route.params.uid
        this.username = this.$route.params.username
        this.year_id = this.$route.params.year_id
        this.subject_id = this.$route.params.subject_id
        this.subject = this.$route.params.subject
        this.item = this.$route.params.item
        this.mode = this.$route.params.mode
        this.chapter_id = this.$route.params.chapter_id
        this.diff = this.$route.params.diff

        this.getPaper()

    },
    methods: {
        getPaper() {

            let data = {
                year_id: this.year_id, 
                subject_id: this.subject_id,
                item: this.item,
                mode: this.mode,
                chapter_id: this.chapter_id,
                diff: this.diff,
            }

            this.$http.post('/getOnline', data).then(res=>{

                let data = res.data
                let myanswers = []
                for (let index in data) {
                    data[index]['myanswer'] = ''
                    myanswers[index] = {
                        'knowledge_id': data[index]['knowledge_id'],
                        'question_id': data[index]['question_id'],
                        'myanswer': ''
                    }  
                }
                this.myanswers = myanswers
                this.questions = data
                this.total = this.undone = data.length
                this.$nextTick( () => {
                    this.$func.setMath()
                })

            }).catch(res=>{})
            
        },
        submit() {
  
            if (!this.access) return

            let data = {
                myanswers: this.myanswers,
                username: this.username,
                tempcode: '',
                name: this.subject + '在线测评',
                subject_id: this.subject_id,
                subject: this.subject,
                uid: this.uid,
                type: 3,
                from: 2,
            }
            
            this.access = false

            this.$http.post('/savePaper', data).then(res=>{
                this.$func.success(res.msg)
                this.$router.push({name: 'CheckReport', query: {'id': res.data}})
            }).catch(res=>{})

        },
        checked(index, answer) {
            this.questions[index]['myanswer'] = answer
            this.myanswers[index]['myanswer'] = answer
            let done = 0
            for(let item of this.myanswers){
                if(item.myanswer) done++
            }
            this.done = done
            this.undone = this.total - this.done
        },
        toIndex(index) {
            this.current = index
            this.swiper.slideToLoop(index, 200, false)
        },
    },
    mounted () {

        let _this = this

        this.swiper = new Swiper ('.swiper_online', {

            observer: true,
            observeParents: true,
            spaceBetween: 0,
            autoHeight: true,
            navigation: {
                nextEl: '.x-next',
                prevEl: '.x-prev',
            },
            on:{
                slideChangeTransitionEnd: function(){
                    _this.current = this.realIndex
                }
            }

        })

    },
}

</script>
<style scoped="">
    .cr_talist_ulli {font-family: MJXc-TeX-math-I,MJXc-TeX-math-Ix,MJXc-TeX-math-Iw,MJXc-TeX-main-R,MJXc-TeX-main-Rw}
</style>