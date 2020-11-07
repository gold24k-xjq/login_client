<template>
<div>
<!-- START -->
<div class="content" v-if="!is_post">
    <div class="w1200" overflow>
        <div class="cr_bg fl subnl d_subnl">
            <div class="subanw_t">
                <div class="subanw_tn">
                    <span>请输入模板ID</span> 
                    <MyInput placeholder="请输入模板号" :data="papers" v-model="tempcode" @enter="getTaskPaper"></MyInput>
                </div>
                <div class="subanw_tn" v-if="task_type == 1">
                    <span>请输入学生姓名或学号</span>
                    <MyInput placeholder="请输入学生姓名或学号" :data="users" v-model="checked_name" @enter="getTaskPaper"></MyInput>
                </div>
                <div class="subanw_tn" v-if="task_type != 1">
                    <span>请选择班级：</span>
                    <div class="subanw_tn_se">
                        <select class="pop_ulipt" v-model="gid">
                            <option value="">请选择班级</option>
                            <option v-for="item in grades" :value="item.id">{{item.name}}</option>
                        </select>
                        <i class="pu_i"></i>
                    </div>
                </div>
                <div class="subanw_tn" v-if="task_type != 1">
                    <span>请选择类型：</span>
                    <div class="subanw_tn_se">
                        <select class="pop_ulipt" v-model="task_type">
                            <option value="2">按人</option>
                            <option value="3">按题</option>
                        </select>
                        <i class="pu_i"></i>
                    </div>
                </div>
                <button class="rpt_ulrbtnl sub_rpt_btn" @click="getTaskPaper">确定</button>
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
<div class="content" v-else-if="task_type != 3">
    <div class="w1200">
        <div class="cr_bg overflow">
            <div class="fl">
                <span class="rpt_ulltm">{{taskname}}</span> 
                <p>
                    <span class="subaid">模板ID：{{tempcode}}</span>
                    <span class="subaid">学号/姓名：{{code}}</span>
                </p>
            </div>
            <div class="fr">
                <MyCropper v-show="imgshow" :imgshow.sync="imgshow" :answers="answers" :uid="uid" :temp_code="tempcode" @getPaths="getPaths"></MyCropper>
                <button class="sub_tp_btn" @click="imgshow = true">上传作答</button>
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
                            <div v-for="(knowledge, index1) in item.knowledges" class="know_ul_div" :class="{'know_ul_div_g': !knowledge.checked}" @click="checked(item, knowledge.id)">{{knowledge.name}}<!-- <i>×</i> --></div>
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
                <div class="saw_list_bb saw_list_bbg" v-if="item.paths.length" @click="showView(item.orders)">查看作答</div> 
                <div :ref="item.orders" v-viewer>
                    <div v-for="item in item.paths">
                        <img :src="item" style="display: none" />
                    </div>
                </div>
            </div>
            <button class="sub_btn" @click="submitTask">提交</button>
        </div>
        <div class="cr_bg">
            <ul class="subp_ul_name">
                <li v-for="item in grade_users" :class="{'on': item.is_done || item.uid == uid}" @click="switchUsers(item)">{{item.username}}</li>
            </ul>
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
                    <span class="subaid">学号/姓名：{{code}}</span>
                </p>
            </div>
            <!-- <div class="fr">
                <MyCropper v-show="imgshow" :imgshow.sync="imgshow" :answers="answers" :uid="uid" :temp_code="tempcode" @getPaths="getPaths"></MyCropper>
                <button class="sub_tp_btn" @click="imgshow = true">上传作答</button>
            </div> -->
        </div>
        <div class="cr_bg">
            <p class="cr_bp">
                请根据实际作答情况标记，选择题填写你的答案，填空题和主观题参照答案自行批阅对错或半对，提交后不可修改！
            </p>
            <div class="saw_list" v-for="(item, index) in answers">
                <div class="saw_list_df">
                    <div class="ib_ln">{{item.orders}}.</div> 
                    <div class="ib_lcf">
                        <i class="">参考答案:</i> 
                        <i class="saw_lg" v-html="item.answer"></i>
                    </div>
                </div>
                <div v-for="user in users">
                    <div class="saw_list_df">
                        <div class="ib_lname">{{user.username}}</div>
                        <div class="ib_lc" v-if="item.subjective == 1">
                            <span :class="{'on': item.myanswer.indexOf(option) >= 0}" v-for="option in koptions" @click="saveAnswer(item.orders, option, item.ismultichoice)">{{option}}</span> 
                        </div>
                        <div class="ib_lc ib_lcn" v-else-if="item.subjective == 2">
                            <span :class="{'on': item.myanswer == index+1}" v-for="(option, index) in zoptions" @click="saveAnswer(item.orders, index+1)" v-html="option"></span> 
                            <button class="sub_tp_btn" @click="imgshow = true">上传作答</button>
                        </div>
                    </div>
                    <div class="saw_list_b" v-show="item.subjective == 2 && item.myanswer && item.myanswer != 1 && is_access == 1">
                        <div class="saw_list_bb" v-if="item.knowledges.length > 1">
                            <span>未掌握知识点：</span>
                            <div class="saw_list_bb_df  saw_list_bb_df_ml">
                                <div v-for="(knowledge, index1) in item.knowledges" class="know_ul_div" :class="{'know_ul_div_g': !knowledge.checked}" @click="checked(item, knowledge.id)">{{knowledge.name}}<!-- <i>×</i> --></div>
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
                <div class="saw_list_bb saw_list_bbg" v-if="item.paths.length" @click="showView(item.orders)">查看作答</div> 
                <div :ref="item.orders" v-viewer>
                    <div v-for="item in item.paths">
                        <img :src="item" style="display: none" />
                    </div>
                </div>
            </div>
            <button class="sub_btn" @click="submitTask">提交</button>
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
import MyCropper from '@/components/MyCropper'
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
            checked_name: '',//联想input输入值
            length: 3,//强化题数。普通提交作业时，默认是3
            is_access: 0,//是否弹出标记知识点
            reasons: ['知识点未掌握', '概念模糊', '审题错误', '运算错误', '思路错误', '其他'],//应该在后台返回
            task_type: 1,//1提交个人报告2提交班级报告
            grades: [],
            gid: '',
            grade_users: [],
            papers: [],
            imgshow: false,
        }
    },
    components: {
        MyInput,
        MyCropper,
    },
    created() {

        let uid = this.$route.params.uid//可能是评测的uid，也可能是作业的uid
        let tempcode = this.$route.params.temp_code
        let length = this.$route.params.length
        let task_type = this.$route.params.task_type

        uid && (this.uid = uid)
        this.task_type = task_type
        if (tempcode) {//传过来tempcode，代表来自学生列表
            this.tempcode = tempcode
            this.length = length
            this.is_post = true
            this.getTaskPaper()
        }

        this.getTaskUsers()
        this.getPaperList()
        
        if (task_type == 2) {
            this.getGrades()
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
                let user_data = []
                for (let item of data) {
                    item.checked = false
                    user_data[item.uid] = []
                }
                this.users = data
            }).catch(res=>{})
        },
        getPaperList() {
            this.$http.post('/getPaperList').then(res=>{
                let data = res.data
                for (let item of data) {
                    item.checked = false
                }
                this.papers = data
            }).catch(res=>{})
        },
        getGrades() {
            this.$http.post('/getTaskGrades').then(res=>{
                this.grades = res.data
            }).catch(res=>{})
        },
        getPaths(value) {
            this.answer_path = value
        },
        showView(orders) {
            const viewer = this.$refs[`${orders}`][0].$viewer
            viewer.show()
        },
        checked(item, kid) {//这里又问题
            let checked = item.knowledges.filter( f => f.checked)

            item.knowledges.forEach((value) => {
                if (value.checked) {
                    if (value.id == kid) {
                        if (checked.length >= 2) {
                            value.checked = !value.checked
                        } else {
                            this.$func.error('至少保留一个知识点')
                        }
                    }
                } else {
                    value.id == kid && (value.checked = !value.checked)
                }
                
            })
        },
        getTaskPaper() {

            this.checked_name && (this.code = this.checked_name)

            if (!this.tempcode) {
                this.$func.error('请输入模板号')
                return
            }

            if (this.task_type == 1 && !this.code && !this.uid) {
                this.$func.error('请输入学号或选择学生')
                return
            }

            if (this.task_type != 1 && !this.gid) {
                this.$func.error('请选择班级')
                return
            }

            let data = {'tempcode': this.tempcode, task_type: this.task_type}

            this.code && (data.code = this.code)
            this.uid && (data.uid = this.uid)
            this.gid && (data.grade_id = this.gid)

            this.$http.post('/getTaskPaper', data).then(res=>{

                this.is_post = true
                this.taskname = res.data.testname
                this.uid = res.data.uid
                res.data.code && (this.code = res.data.code)//班级列表直接过来的
                this.grade_id = res.data.grade_id
                this.is_access = res.data.is_access
                res.data.users && (this.grade_users = res.data.users)

                let AnsArr = []
                let choices = []

                res.data.answers.forEach(function(item){
                    choices.push({order: item.orders})
                    AnsArr.push('')
                    item.paths = []//为了上传题干
                    item.img_show = false
                    if (item.knowledges)
                    item.knowledges.forEach((value) => {
                        value.checked = true
                    })
                })
                
                this.choices = choices
                this.myanswers = AnsArr
                this.answers = res.data.answers
                this.origin_myans = [].concat(AnsArr)//深拷贝
                this.origin_ans = this.$func.clone(res.data.answers)
                
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

            this.answer_path && (data.answer_path = this.answer_path.join())
            
            this.access = false

            axios.post('https://api.zn1v1.com/api.php/PersonalWork', Qs.stringify(data)).then(res=>{
                if (res.data.Code == 200) {
                    this.access = true
                    if (this.task_type == 1) {
                        this.$func.success('完成测评')
                        this.$router.push({name: 'TaskList'})
                    } else { 
                        this.doNext()
                    }
                } else {
                    this.$func.error(res.data.msg)
                }
            }).catch(res=>{
                this.$func.error(res.data.msg)
            })
        },
        doNext() {
            let done = true
            for (let item of this.grade_users) {
                (item.uid == this.uid) && (item.is_done = 1)
                if (!item.is_done) {
                    this.$func.success('完成测评，自动跳转下一个')
                    this.switchUsers(item)
                    done = false
                    break;
                }
            }
            if (done) {
                this.$func.success('提交完毕，将自动退出')
                let _this = this
                setTimeout(function() {
                    _this.$router.push({name: 'TaskList'})
                }, 1000)
            }
        },
        switchUsers(item) {
            this.uid = item.uid
            this.code = item.username
            this.myanswers = [].concat(this.origin_myans)
            this.answers = this.$func.clone(this.origin_ans)
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