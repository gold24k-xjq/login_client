<template>
<div>
<!-- START -->
<div class="content" v-if="!is_post">
    <div class="w1200" overflow>
        <div class="cr_bg fl subnl d_subnl">
            <div class="subanw_t">
                <div class="subanw_tn">
                    <span>请输入模板ID</span> 
                    <input type="text" placeholder="请输入模板号" class="subanw_input" v-model="tempcode" @keyup.enter="getPaper"> 
                </div>
                <button class="rpt_ulrbtnl sub_rpt_btn" @click="getPaper">确定</button>
            </div>
        </div>
        <div class="cr_bg fr subnlr d_subnlr">
            <p>
                <span class="cr_bspan">例:</span>
                该答案卡模板ID为“00018003”
            </p>
            <img class="tem_img" src="../../assets/images/tidlz.png" />
        </div>
    </div>
</div>
<div class="content" v-else>
    <div class="w1200">
        <div class="cr_bg overflow">
            <div class="fl">
                <span class="rpt_ulltm">{{taskname}}</span> 
                <p>
                    <span class="subaid">模板ID：{{tempcode}}</span>
                </p>
            </div>
        </div>
        <div class="cr_bg">
            <p class="cr_bp">
                请根据实际作答情况标记，选择题填写你的答案，填空题和主观题参照答案自行批阅对错或半对，提交后不可修改！
            </p>
            <div class="saw_list" v-for="(item, index) in answers">
                <div class="saw_list_df">
                    <div class="ib_ln">{{item.orders}}.</div> 
                    <div class="ib_lc" v-if="item.subjective == 1">
                        <span :class="{'on': item.myanswer.indexOf(option) >= 0}" v-for="option in koptions" @click="saveAnswer(item.orders, option, item.ismultichoice)">{{option}}</span> 
                    </div>
                    <div class="ib_lc ib_lcn" v-else-if="item.subjective == 2">
                        <span :class="{'on': item.myanswer == index+1}" v-for="(option, index) in zoptions" @click="saveAnswer(item.orders, index+1)" v-html="option"></span> 
                    </div>
                    <div class="ib_lcf">
                        <i class="">参考答案:</i> 
                        <i class="saw_lg" v-html="item.answer"></i>
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
            tempcode: '',
            is_post: false,
            taskname: '',
            answers: [],
            myanswers: [],
            uid: '',//uid有三种来源，测评、学生列表提交答案传递过来的、筛选学生
            koptions: ['A', 'B', 'C', 'D'],
            zoptions: ['√', '×', '<i class="ib_hr">√</i>'],
            access: true,
        }
    },
    created() {

        let uid = this.$route.params.uid//可能是评测的uid，也可能是作业的uid
        let username = this.$route.params.username
        let type = this.$route.params.type

        uid && (this.uid = uid)
        username && (this.username = username)
        type && (this.type = type)

    },
    methods: {
        getPaper() {

            if (!this.tempcode) {
                this.$func.error('请输入模板号')
                return
            }

            this.$http.post('/getPaper', {'tempcode': this.tempcode}).then(res=>{

                this.is_post = true
                this.taskname = res.data.testname
                this.subject_id = res.data.subject_id
                this.subject = res.data.subject
                this.answers = res.data.answers

                let AnsArr = []

                for (var i = 0; i < res.data.answers.length; i++) {
                    AnsArr.push('')
                }

                this.myanswers = AnsArr

                this.$nextTick( () => {
                    this.$func.setMath()
                })

            }).catch(res=>{})
            
        },
        submit() {
  
            if (!this.access) return

            let data = {
                myanswers: this.myanswers,
                tempcode: this.tempcode,
                username: this.username,
                name: this.taskname,
                subject_id: this.subject_id,
                subject: this.subject,
                uid: this.uid,
                type: this.type,//区分教本校辅和练习册
                from: 1,
            }

            this.access = false

            this.$http.post('/savePaper', data).then(res=>{
                this.$func.success(res.msg)
                this.$router.push({name: 'CheckReport', query: {'id': res.data}})
            }).catch(res=>{})

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

            if (ismultichoice == 1) {
                let curAnswer = this.myanswers[order-1]
                if (curAnswer.indexOf(current) != -1) 
                    current = curAnswer.replace(current, '')
                else 
                    current = curAnswer+current
            }

            this.myanswers.splice(order-1, 1, current)

        },
    },
}

</script>