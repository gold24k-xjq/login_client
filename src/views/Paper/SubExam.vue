<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200">
        <div class="cr_bg overflow">
            <div class="fl">
                <span class="rpt_ulltm">{{taskname}}</span> 
                <p>
                    <span class="subaid">姓名：{{username}}</span>
                </p>
            </div>
        </div>
        <div class="cr_bg" v-if="type == 2">
            <p class="cr_bp">
                请根据实际作答情况标记，客观题标记学生答案，主观题参照答案自行批阅对错或半对（半对需标记分数），提交后不可修改！
            </p>
            <div class="saw_list" v-for="(item, index) in answers">
                <div class="saw_list_df">
                    <div class="ib_ln">{{item.orders}}.</div> 
                    <div class="ib_lc" v-if="item.subjective == 1">
                        <span :class="{'on': item.myanswer.indexOf(option) >= 0}" v-for="option in item.options" @click="saveAnswer(item.orders, option, item.ismultichoice)">{{option}}</span> 
                    </div>
                    <div class="ib_lc ib_lcn" v-else-if="item.subjective == 2">
                        <span :class="{'on': item.myanswer == index+1}" v-for="(option, index) in zoptions" @click="saveAnswer(item.orders, index+1)" v-html="option"></span> 
                    </div>
                    <div class="ib_lcf" v-show="item.subjective == 2 && item.myanswer && item.myanswer == 3">
                         得分 <input type="number" class="ipt" v-model="item.score" min="0" :max="item.maxscore" @input="is_max(item)">
                    </div>
                </div>
                <div class="saw_list_b" v-show="item.subjective == 2 && item.myanswer && item.myanswer != 1">
                    <div class="saw_list_bb" v-if="item.knowledges && item.knowledges.length > 1">
                        <span>未掌握知识点：</span>
                        <div class="saw_list_bb_df  saw_list_bb_df_ml">
                            <div v-for="(knowledge, index1) in item.knowledges" class="know_ul_div" :class="{'know_ul_div_g': !knowledge.checked}" @click="checked(item, knowledge.kids)">{{knowledge.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="sub_btn" @click="submit">提交</button>
        </div>
        <div class="cr_bg" v-else>
            <p class="cr_bp">
                请根据教师批改后的纸质作业，将错误题号在下列题号中进行标记，正确题目无需标记，提交后不可修改。
            </p>
            <div class="task_oa">
                <div v-for="(item, index) in answers" class="task_oal">
                    <div class="task_orders" :class="{'on': item.myanswer == 2}" @click="checkOrder(item, index)">{{item.orders}}</div>
                    <div class="task_oalb">
                        <div class="saw_list_b" v-show="item.subjective == 2 && item.myanswer == 2 && cur_order == item.orders">
                            <div class="saw_list_bb" v-if="item.knowledges.length > 1">
                                <span class="saw_list_bb_s">未掌握知识点：</span>
                                <div class="saw_list_bb_df saw_list_bb_df_ml">
                                    <div v-for="(knowledge, index1) in item.knowledges" class="know_ul_div" :class="{'know_ul_div_g': !knowledge.checked}" @click="checked(item, knowledge.kids)">{{knowledge.name}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>               
            </div>
            <button class="sub_btn" @click="submit">提交</button>
        </div>
    </div>
</div>
<!-- END -->
</div>
</template>

<script>

export default {
    name: 'SubPaper',
    data() {
        return {
            username: '',
            taskname: '',
            answers: [],
            myanswers: [],
            uid: '',
            zoptions: ['√', '×', '<i class="ib_hr">√</i>'],
            access: true,
            cur_order: '',
        }
    },
    created() {

        this.uid = this.$route.query.uid
        this.username = this.$route.query.username
        this.paper_id = this.$route.query.paper_id
        this.type = this.$route.query.type

        this.getPaper()

    },
    methods: {
        getPaper() {

            if (!this.paper_id) {
                this.$func.error('请选择试卷')
                return
            }

            this.$http.post('/getPaperContent', {id: this.paper_id}).then(res=>{

                this.taskname = res.data.name

                let _this = this
                
                res.data.answers.forEach(function(item){
                    if (item.knowledges)
                    item.knowledges.forEach((value) => {
                        value.checked = true
                    })
                    _this.type == 1 && (item.myanswer = 1)
                })

                this.answers = res.data.answers
                
            }).catch(res=>{})
            
        },
        is_max(item) {
            if (Number(item.score) > Number(item.maxscore)) {
                this.$func.error(`值必须小于或等于${item.maxscore}。`)
                item.score = ''
            }
        },
        checkOrder(item) {
            item.myanswer = item.myanswer == 1 ? 2 : 1
            this.cur_order = item.orders
        },
        submit() {
  
            if (!this.access) return

            let data = {
                answers: this.answers,
                paper_id: this.paper_id,
                username: this.username,
                uid: this.uid,
                type: this.type
            }
            
            this.access = false

            this.$http.post('/saveExamPaper', data).then(res=>{
                this.$func.success(res.msg)
                if (this.type == 2)
                    this.$router.replace({name: 'PaperReport', query: {'id': res.data}})
                else
                    this.$router.replace({name: 'PaperReportSimple', query: {'id': res.data}})
            }).catch(res=>{})

        },
        checked(item, kid) {
            let checked = item.knowledges.filter( f => f.checked)
            item.knowledges.forEach((value) => {
                if (value.checked) {
                    if (value.kids == kid) {
                        if (checked.length >= 2) {
                            value.checked = !value.checked
                        } else {
                            this.$func.error('至少保留一个知识点')
                        }
                    }
                } else {
                    value.kids == kid && (value.checked = !value.checked)
                }
                
            })
        },
        saveAnswer(order, current, ismultichoice = 0) {
                
            let answers = this.answers
            
            for(let index of answers){
                if(order == index.orders) {
                    if (ismultichoice == 1) {
                        if (index.myanswer) {
                            if (index.myanswer.indexOf(current) != -1) 
                                index.myanswer = index.myanswer.replace(current, '')
                            else 
                                index.myanswer = index.myanswer+current
                        } else 
                            index.myanswer = current
                    }else
                        index.myanswer = current
                }
            }

            this.answers = answers

        },
    },
}

</script>