<template>
<div>
<!-- START -->
<div class="content" v-if="!is_post">
    <div class="w1200" overflow>
        <div class="cr_bg fl subnl d_subnl">
            <div class="subanw_t">
                <div class="subanw_tn">
                    <span>请输入模板ID</span> 
                    <input type="text" placeholder="请输入模板号" class="subanw_input" v-model="tempcode" @keyup.enter="towhere"> 
                </div>
                <div class="subanw_tn" v-if="from == 'TASK'">
                    <span>请输入学生姓名或学号</span>
                    <MyInput placeholder="请输入学生姓名或学号" :data="users" v-model="checked_name" @enter="towhere"></MyInput>
                </div>
                <button class="rpt_ulrbtnl sub_rpt_btn" @click="towhere">确定</button>
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
                    <span class="subaid" v-if="from == 'TASK'">学号/姓名：{{code}}</span>
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
                <div class="saw_list_b" v-show="item.subjective == 2 && item.myanswer && item.myanswer != 1 && is_access == 1">
                    <div class="saw_list_bb" v-if="item.knowledges.length > 1">
                        <span>未掌握知识点：</span>
                        <div class="saw_list_bb_df  saw_list_bb_df_ml">
                            <div v-for="(knowledge, index1) in item.knowledges" class="know_ul_div" :class="{'know_ul_div_g': !knowledge.checked}" @click="knowledge.checked = !knowledge.checked">{{knowledge.name}}<!-- <i>×</i> --></div>
                            <!-- <label :for="index + '-k' + index1" :name="item.orders|know" class="d_cb" v-for="(knowledge, index1) in item.knowledges"> 
                                {{knowledge.name}}
                                <input :id="index + '-k' + index1" :ref="item.orders|know" type="checkbox" :value="knowledge.id" checked> 
                                <span></span>
                            </label> -->
                        </div>
                    </div>
                    <div class="saw_list_bb">
                        <span>错因：</span>
                        <div class="saw_list_bb_df">
                            <label :for="index + '-w' + index1" :name="item.orders|why" class="d_cb" v-for="(reason, index1) in reasons"> 
                                {{reason}}
                                <input :id="index + '-w' + index1" :ref="item.orders|why" type="checkbox" :value="index1" @change="input_change(item.orders)"> 
                                <span></span>
                            </label>
                        </div>
                    </div>  
                    <textarea class="saw_list_bt" :ref="item.orders|parse" :id="item.orders|parse" maxlength="50" style="display: none;"></textarea>
                </div>
            </div>
            <button class="sub_btn" @click="subwhere">提交</button>
        </div>
    </div>
</div>
<!-- END -->
</div>
</template>

<script>

import axios from 'axios'
import Qs from 'qs'
import MyInput from '@/components/MyInput'
export default {
    name: 'SubPaper',
    data() {
        return {
            tempcode: '',
            code: '',
            is_post: false,
            taskname: '',
            answers: [],
            myanswers: [],
            users: [],
            uid: '',//uid有三种来源，测评、学生列表提交答案传递过来的、筛选学生
            koptions: ['A', 'B', 'C', 'D'],
            zoptions: ['√', '×', '<i class="ib_hr">√</i>'],
            access: true,
            from: 'EVO',
            checked_name: '',//联想input输入值
            length: 3,//强化题数。普通提交作业时，默认是3
            is_access: 0,//是否弹出标记知识点
            reasons: ['未掌握知识点', '概念模糊', '审题错误', '运算错误', '思路错误', '其他'],//应该在后台返回
        }
    },
    components: {
        MyInput,
    },
    created() {

        let uid = this.$route.params.uid//可能是评测的uid，也可能是作业的uid
        let username = this.$route.params.username
        let type = this.$route.params.type
        let from = this.$route.params.from
        let tempcode = this.$route.params.temp_code
        let length = this.$route.params.length

        uid && (this.uid = uid)
        username && (this.username = username)
        type && (this.type = type)
        this.from = from
        if (tempcode) {//传过来tempcode，代表来自学生列表
            this.tempcode = tempcode
            this.length = length
            this.is_post = true
            this.getTaskPaper()
        }
        if (from == 'TASK') {//作业获取学生列表
            this.getTaskUsers()
        }

    },
    filters: {
        parse(value) {
            return 'parse' + value
        },
        know(value) {
            return 'know' + value
        },
        why(value) {
            return 'why' + value
        },
    },
    methods: {
        getTaskUsers() {
            this.$http.post('/getTaskUsers').then(res=>{
                let data = res.data
                for (let item of data) {
                    item.checked = false
                }
                this.users = data
            }).catch(res=>{})
        },
        towhere() {
            this.checked_name && (this.code = this.checked_name)
            if (this.from == 'EVO') this.getPaper()
            else this.getTaskPaper()
        },
        subwhere() {
            if (this.from == 'EVO') this.submit()
            else this.submitTask()
        },
        getTaskPaper() {

            if (!this.tempcode) {
                this.$func.error('请输入模板号')
                return
            }

            if (!this.code && !this.uid) {
                this.$func.error('请输入学号或选择学生')
                return
            }

            let data = {'tempcode': this.tempcode}

            this.code && (data.code = this.code)
            this.uid && (data.uid = this.uid)

            this.$http.post('/getTaskPaper', data).then(res=>{

                this.is_post = true
                this.taskname = res.data.testname
                this.uid = res.data.uid
                res.data.code && (this.code = res.data.code)//班级列表直接过来的
                this.grade_id = res.data.grade_id
                this.is_access = res.data.is_access

                let AnsArr = []
                let choices = []

                res.data.answers.forEach(function(item){
                    choices.push({order: item.orders})
                    AnsArr.push('')
                    if (item.knowledges)
                    item.knowledges.forEach((value) => {
                        value.checked = true
                    })
                })
                
                this.choices = choices
                this.myanswers = AnsArr
                this.answers = res.data.answers
                
                this.$nextTick( () => {
                    this.$func.setMath()
                })

            }).catch(res=>{})

        },
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
        input_change(orders) {//textarea是否显示
            let check_ids = []
            this.$refs[`why${orders}`].forEach((value) => {
                value.checked && (check_ids.push(value.value))
            })
            let length = (this.reasons.length - 1).toString()
            let display = 'none'
            check_ids.indexOf(length) != -1 && (display = 'block')//length为其他在数组中的键位，应该做成关联数组
            this.$refs[`parse${orders}`][0].style.display = display
        },
        submitTask() {
            if (!this.access) return
            
            let that = this
            let allchecked = true
            let order = 1
            
            this.choices.forEach((item) => {

                let kids = []
                /*if (that.$refs[`know${item.order}`])
                that.$refs[`know${item.order}`].forEach((value) => {
                    value.checked && (kids.push(value.value))
                })*/
                that.answers.forEach((value) => {
                    if (value.orders === item.order && value.knowledges) {
                        value.knowledges.forEach((k) => {
                            k.checked && (kids.push(k.id))
                        })
                    }
                    
                })
                
                //判断是否选择知识点，因有的题目没有知识点，故不能强制，可以注掉
                if (kids.length == 0) {
                    allchecked = false
                    order = item.order
                }

                let reason_ids = []
                if (that.$refs[`why${item.order}`])
                that.$refs[`why${item.order}`].forEach((value) => {
                    value.checked && (reason_ids.push(value.value))
                })

                item.kids = kids.join()
                item.reason_ids = reason_ids.join()
                item.parse = that.$refs[`parse${item.order}`][0].value

            })

            /*if (!allchecked) {
                this.$func.error(`第${order}题请至少选择一个知识点`)
                return
            }*/
            
            
            let data = {
                data: this.myanswers.join(','),
                temp_code: this.tempcode,
                paths: '',
                grade: this.grade_id,
                uid: this.uid,
                length: this.length,
                choices: this.choices
            }
            
            this.access = false

            axios.post('https://api.zn1v1.com/api.php/PersonalWork', Qs.stringify(data)).then(res=>{
                if (res.data.Code == 200) {
                    this.$func.success('完成测评')
                    this.$router.push({name: 'TaskList'})
                } else {
                    this.$func.error(res.data.msg)
                }
            }).catch(res=>{
                this.$func.error(res.data.msg)
            })
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