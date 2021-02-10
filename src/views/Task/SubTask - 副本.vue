<template>
<div>
<!-- START -->
<div class="content" v-if="!is_post">
    <div class="w1200" overflow>
        <div class="cr_bg fl subnl d_subnl">
            <div class="subanw_t">
                <div class="subanw_tn">
                    <span>请选择提交方式：</span>
                    <div class="subanw_tn_se">
                        <select class="pop_ulipt" v-model="task_type">
                            <option value="1">按人</option>
                            <option value="2">按班</option>
                        </select>
                        <i class="pu_i"></i>
                    </div>
                </div>
                <div class="subanw_tn">
                    <span>请输入模板ID</span> 
                    <MyInput placeholder="请输入模板号" :data="papers" v-model="tempcode" @others="getPaperName" @enter="beforePaper"></MyInput>
                </div>
                <div class="subanw_tn" v-if="task_type == 1">
                    <span>请输入学生姓名或学号</span>
                    <MyInput placeholder="请输入学生姓名或学号" :data="users" v-model="checked_name" @enter="beforePaper"></MyInput>
                </div>
                <div class="subanw_tn" v-else>
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
                <button class="rpt_ulrbtnl sub_rpt_btn" @click="beforePaper">确定</button>
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
<!-- 教师未批阅 - 个人-->
<div v-else-if="work_type == 1">
<div class="content" v-if="task_type != 3">
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
        <div class="cr_bg" v-if="task_type == 2">
            <ul class="subp_ul_name">
                <li v-for="item in grade_users" :class="{'done': item.is_done, 'on': item.uid == uid}" @click="switchUsers(item)">{{item.username}}</li>
            </ul>
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
                            <div v-for="(knowledge, index1) in item.knowledges" class="know_ul_div" :class="{'know_ul_div_g': !knowledge.checked}" @click="checked(item, knowledge.id)">{{knowledge.name}}</div>
                        </div>
                    </div>
                    <div class="saw_list_bb">
                        <span>错因：</span>
                        <div class="saw_list_bb_df">
                            <label :for="index + '-w' + index1" :name="item.orders|why" class="d_cb" v-for="(reason, index1) in reasons"> 
                                {{reason}}
                                <input :id="index + '-w' + index1" type="checkbox" :value="index1" v-model="item.reason_ids"> 
                                <span></span>
                            </label>
                        </div>
                    </div> 
                    <textarea class="saw_list_bt" maxlength="50" v-model="item.parse" v-show="item.reason_ids.indexOf(last_reason) != -1"></textarea>
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
<!-- 教师未批阅 - 班级-->
<div class="content" v-else>
    <div class="w1200">
        <div class="cr_bg overflow">
            <div class="fl">
                <span class="rpt_ulltm">{{taskname}}</span> 
                <p>
                    <span class="subaid">模板ID：{{tempcode}}</span>
                    <!-- <span class="subaid">学号/姓名：{{code}}</span> -->
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
                    <div class="ib_lcf">
                        <i class="">参考答案:</i> 
                        <i class="saw_lg" v-html="item.answer"></i>
                    </div>
                </div>
                <div v-for="(user, uindex) in grade_users">
                    <div class="saw_list_df">
                        <div class="ib_lname">{{user.username}}</div>
                        <div class="ib_lc" v-if="item.subjective == 1">
                            <span :class="{'on': user.answers[index].myanswer.indexOf(option) >= 0}" v-for="option in koptions" @click="saveAnswers(uindex, item.orders, option, item.ismultichoice)">{{option}}</span> 
                        </div>
                        <div class="ib_lc ib_lcn" v-else-if="item.subjective == 2">
                            <span :class="{'on': user.answers[index].myanswer == zindex+1}" v-for="(option, zindex) in zoptions" @click="saveAnswers(uindex, item.orders, zindex+1)" v-html="option"></span> 
                            <button class="sub_tp_btn" @click="showImg(user)">上传作答</button>
                        </div>
                        <div class="saw_list_bb saw_list_bbg saw_list_bbgg" v-if="user.answers[index].paths.length" @click="showView(user.uid+item.orders)">查看作答</div> 
                    </div>
                    <div class="saw_list_b" v-show="item.subjective == 2 && user.answers[index].myanswer && user.answers[index].myanswer != 1 && is_access == 1">
                        <div class="saw_list_bb" v-if="item.knowledges.length > 1">
                            <span>未掌握知识点：</span>
                            <div class="saw_list_bb_df  saw_list_bb_df_ml">
                                <div v-for="(knowledge, index1) in user.answers[index].knowledges" class="know_ul_div" :class="{'know_ul_div_g': !knowledge.checked}" @click="checkeds(uindex, index, knowledge.id)">{{knowledge.name}}</div>
                            </div>
                        </div>
                        <div class="saw_list_bb">
                            <span>错因：</span>
                            <div class="saw_list_bb_df">
                                <label :for="index + '-w' + index1 + uindex" :name="user.uid+item.orders|why" class="d_cb" v-for="(reason, index1) in reasons"> 
                                    {{reason}}
                                    <input :id="index + '-w' + index1 + uindex" :ref="user.uid+item.orders|why" type="checkbox" :value="index1" @change="input_change($event, item, user.uid)">
                                    <span></span>
                                </label>
                            </div>
                        </div> 
                        <textarea class="saw_list_bt" :ref="user.uid+item.orders|parse" :id="user.uid+item.orders|parse" maxlength="50" style="display: none;"></textarea>
                    </div>
                    <div :ref="user.uid+item.orders" v-viewer>
                        <div v-for="item in user.answers[index].paths">
                            <img :src="item" style="display: none" />
                        </div>
                    </div>
                </div>
            </div>
            <MyCropper v-show="imgshow" :imgshow.sync="imgshow" :answers="cur_answers" :uid="cur_uid" :temp_code="tempcode" @getPaths="getPaths"></MyCropper>
            <button class="sub_btn" @click="submitTaskTotal">提交</button>
        </div>
        <div class="sub_lypop" v-show="progress_show" >
            <div id="per" class="layui-progress layui-progress-big" lay-showPercent="true" lay-filter="setPercent">
                <div class="layui-progress-bar layui-bg-green" lay-percent="0%"></div>
            </div>
            <p>提交中请稍后...</p>
        </div>

    </div>
</div>
</div>
<!-- 教师已批阅 - 个人 -->
<div v-else>
<div class="content" v-if="task_type == 1">
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
                请根据教师批改后的纸质作业，将错误题号在下列题号中进行标记，正确题目无需标记，提交后不可修改。
            </p>
            <!-- <div class="task_oa">
                <div v-for="(item, index) in answers" class="task_oal">
                    <div class="task_orders" :class="{'on': (item.subjective == 1 && (item.myanswer != item.answer)) || (item.subjective == 2 && item.myanswer == 2)}" @click="checkOrder(item, index)">{{item.orders}}</div>
                    <div class="task_oalb">
                        <div class="saw_list_b">
                            <div class="saw_list_bb">
                                <div class="ib_lc" v-if="item.subjective == 1 && cur_order == item.orders && item.myanswer != item.answer">
                                    <span v-for="option in koptions" :class="{'no': item.myanswer.indexOf(option) >= 0 && item.myanswer != item.answer}" @click="saveMyAnswer(item, index, option)">{{option}}</span>
                                    <i>标准答案：{{item.answer}}</i> 
                                </div>
                            </div>
                        </div>
                        <div class="saw_list_b" v-show="item.subjective == 2 && item.myanswer == 2 && is_access == 1 && cur_order == item.orders">
                            <div class="saw_list_bb" v-if="item.knowledges.length > 1">
                                <span class="saw_list_bb_s">未掌握知识点：</span>
                                <div class="saw_list_bb_df saw_list_bb_df_ml">
                                    <div v-for="(knowledge, index1) in item.knowledges" class="know_ul_div" :class="{'know_ul_div_g': !knowledge.checked}" @click="checked(item, knowledge.id)">{{knowledge.name}}</div>
                                </div>
                            </div>
                            <div class="saw_list_bb">
                                <span class="saw_list_bb_s">错因：</span>
                                <div class="saw_list_bb_df">
                                    <label :for="index + '-w' + index1" :name="item.orders|why" class="d_cb" v-for="(reason, index1) in reasons"> 
                                        {{reason}}
                                        <input :id="index + '-w' + index1" type="checkbox" :value="index1" v-model="item.reason_ids"> 
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                            <textarea class="saw_list_bt" maxlength="50" v-model="item.parse" v-show="item.reason_ids.indexOf(last_reason) != -1"></textarea>
                            <div class="saw_list_bb saw_list_bbg" v-if="item.paths.length" @click="showView(item.orders)">查看作答</div>
                            <div :ref="item.orders" v-viewer>
                                <div v-for="item in item.paths">
                                    <img :src="item" style="display: none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>               
            </div>
            <div class="sub_wl">
                <div>错题记录：</div>
                <div v-for="(item, index) in answers">
                    <div v-if="item.subjective == 1 && item.myanswer != item.answer">
                        <div class="subt_cc">
                            <span class="subt_c">第{{item.orders}}题：</span>
                            <span class="subt_c">学生选项：{{item.myanswer}}</span>
                            <span class="subt_c">正确选项：{{item.answer}}</span>
                        </div>
                    </div>
                    <div v-if="item.subjective == 2 && item.myanswer != 1">
                        <div class="subt_kk">
                            <div>第{{item.orders}}题：</div>
                            <div>
                                <div class="subt_k">未掌握知识点：
                                    <div class="subt_k_cr" v-for="(knowledge, index1) in item.knowledges" v-if="knowledge.checked">{{knowledge.name}}</div>
                                </div>
                                <div class="subt_k">错因：
                                    <div v-for="(reason, rindex) in reasons" v-show="item.reason_ids.indexOf(rindex) != -1">{{reason}}</div> 
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
            <ByOrder :answers="answers" :is_access="is_access" :uid="uid" type="1"></ByOrder>
            <button class="sub_btn" @click="submitTask">提交</button>
        </div>
    </div>
</div>
<!-- 教师已批阅 - 班级 -->
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
                请根据教师批改后的纸质作业，将错误题号在下列题号中进行标记，正确题目无需标记，提交后不可修改。
            </p>
            <div class="task_orders_l" v-for="(user, uindex) in grade_users">
                <div class="task_orders_name">{{user.username}}</div>
                <ByOrder :answers="user.answers" :is_access="is_access" :uid="user.uid" type="2"></ByOrder>
                <!-- <div class="task_oa">
                    <div v-for="(item, index) in user.answers" class="task_oal">
                        <div class="task_orders" :class="{'on': (item.subjective == 1 && (item.myanswer != item.answer)) || (item.subjective == 2 && item.myanswer == 2)}" @click="checkOrder(item, index, user.uid)">{{item.orders}}</div>
                        <div class="task_oalb">
                            <div class="saw_list_b">
                                <div class="saw_list_bb">
                                    <div class="ib_lc" v-if="item.subjective == 1 && cur_order == (item.orders+user.uid) && item.myanswer != item.answer">
                                        <span v-for="option in koptions" :class="{'on': item.myanswer.indexOf(option) >= 0 && item.myanswer != item.answer}" @click="saveMyAnswer(item, index, option)">{{option}}</span> 
                                        <i>标准答案：{{item.answer}}</i> 
                                    </div>
                                </div>
                            </div>
                            <div class="saw_list_b" v-show="item.subjective == 2 && item.myanswer == 2 && is_access == 1 && cur_order == (item.orders+user.uid)">
                                <div class="saw_list_bb" v-if="item.knowledges.length > 1">
                                    <span class="saw_list_bb_s">未掌握知识点：</span>
                                    <div class="saw_list_bb_df saw_list_bb_df_ml">
                                        <div v-for="(knowledge, index1) in item.knowledges" class="know_ul_div" :class="{'know_ul_div_g': !knowledge.checked}" @click="checked(item, knowledge.id)">{{knowledge.name}}</div>
                                    </div>
                                </div>
                                <div class="saw_list_bb">
                                    <span class="saw_list_bb_s">错因：</span>
                                    <div class="saw_list_bb_df">
                                        <label :for="index + '-w' + index1 + uindex" :name="user.uid+item.orders|why" class="d_cb" v-for="(reason, index1) in reasons"> 
                                            {{reason}}
                                            <input :id="index + '-w' + index1 + uindex" :ref="user.uid+item.orders|why" type="checkbox" :value="index1" @change="input_change($event, item, user.uid)">
                                            <span></span>
                                        </label>
                                    </div>
                                </div> 
                                <textarea class="saw_list_bt" :ref="user.uid+item.orders|parse" :id="user.uid+item.orders|parse" maxlength="50" style="display: none;"></textarea>
                                <div class="sub_tp_btn_s">
                                    <button class="sub_tp_btn" @click="showImg(user)">上传作答</button>
                                    <div class="saw_list_bb saw_list_bbg" v-if="user.answers[index].paths.length" @click="showView(user.uid+item.orders)">查看作答</div> 
                                </div>
                                <div :ref="user.uid+item.orders" v-viewer>
                                    <div v-for="item in user.answers[index].paths">
                                        <img :src="item" style="display: none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
            <MyCropper v-show="imgshow" :imgshow.sync="imgshow" :answers="cur_answers" :uid="cur_uid" :temp_code="tempcode" @getPaths="getPaths"></MyCropper>
            <button class="sub_btn" @click="submitTaskTotal">提交</button>
        </div>
        <div class="sub_lypop" v-show="progress_show" >
            <div id="per" class="layui-progress layui-progress-big" lay-showPercent="true" lay-filter="setPercent">
                <div class="layui-progress-bar layui-bg-green" lay-percent="0%"></div>
            </div>
            <p>提交中请稍后...</p>
        </div>
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
const ByOrder = () => import("./ByOrder")
export default {
    name: 'SubPaper',
    data() {
        return {
            tempcode: '',
            code: '',
            is_post: false,
            taskname: '',
            answers: [],
            //myanswers: [],
            users: [],
            uid: '',//uid有三种来源，测评、学生列表提交答案传递过来的、筛选学生
            koptions: ['A', 'B', 'C', 'D'],
            zoptions: ['√', '×', '<i class="ib_hr">√</i>'],
            access: true,
            checked_name: '',//联想input输入值
            length: 3,//强化题数。普通提交作业时，默认是3
            is_access: 0,//是否弹出标记知识点
            reasons: ['知识点未掌握', '概念模糊', '审题错误', '运算错误', '思路错误', '其他'],//应该在后台返回
            task_type: 1,//1提交个人报告2按人提交班级报告3按题提交
            grades: [],
            gid: '',
            grade_users: [],
            papers: [],
            imgshow: false,
            cur_uid: '',
            cur_answers: [],
            progress_show: false,//进度条是否显示
            work_type: 1,//教师是否批阅，12
            //cur_order: '',//记录当前题号
        }
    },
    components: {
        MyInput,
        MyCropper,
        ByOrder,
    },
    created() {

        let uid = this.$route.params.uid//可能是评测的uid，也可能是作业的uid
        let tempcode = this.$route.params.temp_code
        let length = this.$route.params.length
        let task_type = this.$route.params.task_type

        /*this.tempcode = 'KJ619225'
        this.gid = 3635
        this.work_type = 1
        this.task_type = 3
        this.getTaskPaper()*/
        /*this.tempcode = 'KJ619225'
        this.code = '李智'
        this.work_type = 2
        this.getTaskPaper()*/

        uid && (this.uid = uid)
        task_type && (this.task_type = task_type)
        if (tempcode) {//传过来tempcode，代表来自学生列表
            this.tempcode = tempcode
            this.length = length
            this.is_post = true
            this.getTaskPaper()
        } else {
            this.getTaskUsers()
            this.getPaperList() 
            this.getGrades()
        }

    },
    mounted() {
        let _this = this
        layui.use('element', function(){
            var element = layui.element;
            element.init()
            _this.element = element
        });
    },
    watch: {
        '$store.state.area_id': function (value) {
            this.getTaskUsers()
            this.getPaperList()
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
    computed: {
        last_reason() {
            return this.reasons.length - 1
        }
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
                this.user_data = user_data
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
        getPaperName(value) {//获取作业名，没用上，因为没办法获取学生对应的教师
            this.paper_name = value
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
        checked(item, kid) {
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
        checkeds(uindex, aindex, kid) {
            let item = this.grade_users[uindex].answers[aindex]
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

            this.grade_users.splice(uindex, 1, this.grade_users[uindex])
        },
        showImg(user) {
            this.imgshow = true
            this.cur_uid = user.uid
            this.cur_answers = user.answers
        },
        beforePaper() {
            if (this.task_type == 1 && (!this.tempcode || !this.checked_name)) return
            if (this.task_type != 1 && (!this.tempcode || !this.gid)) return
            this.$http.post('/getSubmitInfo', {tempcode: this.tempcode, code: this.checked_name, grade_id: this.gid}).then(res=>{
                this.$func.confirm(res.data, ['已批阅', '未批阅']).then(res => {
                    this.work_type = 2
                    this.getTaskPaper()
                }).catch(res => {
                    this.work_type = 1
                    this.getTaskPaper()
                })
            }).catch(res=>{})
            
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

                let AnsArr = []
                let choices = []
                let _this = this

                res.data.answers.forEach(function(item){
                    choices.push({order: item.orders})
                    item.paths = []//为了上传题干
                    item.img_show = false
                    item.parse = ''//错因，其他
                    item.reason_ids = []

                    if (item.knowledges)
                    item.knowledges.forEach((value) => {
                        value.checked = true
                    })

                    if (_this.work_type == 2) {//为2时，默认全对
                        if (item.subjective == 1) {
                            item.myanswer = item.answer
                            AnsArr.push(item.answer)
                        } else {
                            item.myanswer = 1
                            AnsArr.push(1)
                        }
                    } else {
                        AnsArr.push('')
                    }
                })
                
                this.choices = choices
                //this.myanswers = AnsArr
                this.answers = res.data.answers
                //this.origin_myans = [].concat(AnsArr)//深拷贝
                this.origin_ans = this.$func.clone(res.data.answers)

                if (res.data.users) {
                    res.data.users.forEach(function(item) {
                        item.answers = _this.$func.clone(_this.answers)
                        item.choices = _this.$func.clone(_this.choices)
                    })
                    this.grade_users = res.data.users
                }
                
                this.$nextTick( () => {
                    this.$func.setMath()
                })

            }).catch(res=>{})

        },
        input_change($e, item, uid = '') {//可以删除了
            //存储错因（只是为了错题记录处显示）
            if ($e.target.checked)
                item.reasons.push($e.target.dataset.name)
            else
                item.reasons = item.reasons.filter(item => item != $e.target.dataset.name)
            //textarea是否显示
            let orders = item.orders+uid
            let check_ids = []
            this.$refs[`why${orders}`].forEach((value) => {
                value.checked && (check_ids.push(value.value))
            })
            let length = (this.reasons.length - 1).toString()
            let display = 'none'
            check_ids.indexOf(length) != -1 && (display = 'block')//length为其他在数组中的键位，应该做成关联数组
            this.$refs[`parse${orders}`][0].style.display = display
        },
        submitTaskTotal() {
            
            if (!this.access) return
            let _this = this
            this.progress_show = true
            this.done = 0//
            this.access = false
            let alldata = []

            this.grade_users.forEach(async (user) => {
                //获取错因及知识点
                user.choices.forEach((item) => {

                    /*let kids = []
                    user.answers.forEach((value) => {
                        if (value.orders === item.order && value.knowledges) {
                            value.knowledges.forEach((k) => {
                                k.checked && (kids.push(k.id))
                            })
                        }
                        
                    })
                    
                    let reason_ids = []
                    if (_this.$refs[`why${user.uid}${item.order}`])
                    _this.$refs[`why${user.uid}${item.order}`].forEach((value) => {
                        value.checked && (reason_ids.push(value.value))
                    })

                    item.kids = kids.join()
                    item.reason_ids = reason_ids.join()
                    item.parse = _this.$refs[`parse${user.uid}${item.order}`][0].value*/

                    let kids = []
                    user.answers.forEach((value) => {
                        if (value.orders === item.order) {
                            if (value.knowledges)
                            value.knowledges.forEach((k) => {
                                k.checked && (kids.push(k.id))
                            })
                            item.reason_ids = value.reason_ids.join()
                            item.parse = value.parse
                        }
                    })
                    item.kids = kids.join()

                })

                let myanswers = []
                let paths = []
                user.answers.forEach((item) => {
                    myanswers.push(item.myanswer)
                    item.paths.forEach((path) => {//去掉路径后面的时间戳
                        let arr = []
                        arr = path.split('?t=')
                        paths.push(arr.shift())
                    })
                })

                let data = {
                    data: myanswers.join(','),
                    temp_code: _this.tempcode,
                    paths: '',
                    grade: _this.grade_id,
                    uid: user.uid,
                    length: _this.length,
                    choices: user.choices
                }

                paths && (data.answer_path = paths.join())

                alldata.push(data)
                await (this.alldata = alldata)

            })  
            console.log(this.alldata)
            return
            this.doSubmit()          

        },
        doSubmit() {
            let data = this.alldata.shift()//递减
            let _this = this
            let count = this.grade_users.length
            axios.post('https://api.zn1v1.com/api.php/PersonalWork', Qs.stringify(data)).then(res=>{
                if (res.data.Code == 200) {
                    this.done ++
                    let percent = 100*this.done / count
                    this.element.progress('setPercent', percent+'%');
                    if (this.alldata.length > 0) {
                        setTimeout(function() {
                            _this.doSubmit()
                        }, 400)//延时执行
                    } else {
                        _this.access = true
                        _this.progress_show = false
                        _this.$func.success('提交完毕，将自动退出')
                        setTimeout(function() {
                            _this.$router.push({name: 'TaskList'})
                        }, 1000)
                    }
                } else {
                    this.$func.error(res.data.msg)
                }
            }).catch(res=>{
                console.log(res)
            })
        },
        /*setChoice1() {//备份，可以删除了
            let that = this
            this.choices.forEach((item) => {

                let kids = []

                that.answers.forEach((value) => {
                    if (value.orders === item.order && value.knowledges) {
                        value.knowledges.forEach((k) => {
                            k.checked && (kids.push(k.id))
                        })
                    }
                    
                })

                let reason_ids = []
                if (that.$refs[`why${item.order}`])
                that.$refs[`why${item.order}`].forEach((value) => {
                    value.checked && (reason_ids.push(value.value))
                })

                item.kids = kids.join()
                item.reason_ids = reason_ids.join()
                item.parse = that.$refs[`parse${item.order}`][0].value

            })
        },*/
        setChoice() {
            let _this = this
            this.choices.forEach((item) => {
                let kids = []
                _this.answers.forEach((value) => {
                    if (value.orders === item.order) {
                        if (value.knowledges)
                        value.knowledges.forEach((k) => {
                            k.checked && (kids.push(k.id))
                        })
                        item.reason_ids = value.reason_ids.join()
                        item.parse = value.parse
                    }
                })
                item.kids = kids.join()
            })
        },
        submitTask() {
            if (!this.access) return
            
            let that = this
            let allchecked = true
            let order

            let myanswers = []
            this.answers.forEach(item => {
                myanswers.push(item.myanswer)
                if (!item.myanswer) {
                    allchecked = false
                    order = item.orders
                }
            })

            if (!allchecked && this.work_type == 1) {//快速提交存在为空的情况
                this.$func.error(`第${order}题未标记`)
                return
            }
            
            this.setChoice()
            
            let data = {
                data: myanswers.join(','),
                temp_code: this.tempcode,
                paths: '',
                grade: this.grade_id,
                uid: this.uid,
                length: this.length,
                choices: this.choices
            }

            this.answer_path && (data.answer_path = this.answer_path.join())
            console.log(data)
            return
            this.access = false

            this.doSubmitTask(data)
        },
        doSubmitTask(data) {
            axios.post('https://api.zn1v1.com/api.php/PersonalWork', Qs.stringify(data)).then(res=>{
                if (res.data.Code == 200) {
                    this.access = true
                    if (this.task_type == 1) {
                        this.$func.success('提交完毕')
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
                    this.$func.success('提交完毕，自动跳转下一个')
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
            //this.myanswers = [].concat(this.origin_myans)
            this.answers = this.$func.clone(this.origin_ans)
        },
        /*checkOrder(item, index, uid = '') {//应该清空主观题所选的知识点及错因
            let status
            if (item.subjective == 1) {
                status = item.myanswer == item.answer ? "" : item.answer
            } else {
                status = item.myanswer == 1 ? 2 : 1
            }
            item.myanswer = status
            this.myanswers.splice(index, 1, status)
            this.cur_order = item.orders + uid
            //this.cur_order = this.cur_order == item.orders ? "" : item.orders + uid
        },
        saveMyAnswer(item, index, option) {
            let myanswer = item.myanswer
            if (item.ismultichoice == 1) {
                myanswer = myanswer.indexOf(option) != -1 ? myanswer.replace(option, '') : this.$func.string_order(myanswer+option)
            } else {
                myanswer = option
            }
            item.myanswer = myanswer
            this.myanswers.splice(index, 1, myanswer)
            if (myanswer == item.answer) {
                this.$func.error(`${myanswer}为正确选项`)
            } else {
                this.$func.success(`已选${myanswer}`)
            }
        },*/
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
                    } else
                        index.myanswer = current
                }
            }
            this.answers = answers

            /*if (ismultichoice == 1) {
                let curAnswer = this.myanswers[order-1]
                if (curAnswer.indexOf(current) != -1) 
                    current = curAnswer.replace(current, '')
                else  
                    current = curAnswer+current
            }
            this.myanswers.splice(order-1, 1, current)*/

        },
        saveAnswers(uindex, order, current, ismultichoice = 0) {
            this.grade_users[uindex].answers.forEach((index) => {
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
            })
            this.grade_users.splice(uindex, 1, this.grade_users[uindex])
        },
    },
}

</script>