<template>
<div class="content">
    <div class="w1200 pt">
        <back></back>
        <div class="cr_bg dflex">
            <a href="javascript:;" @click="addExam"><button class="tl_c_r_btn">添加试卷</button></a>
        </div>
        <div class="cr_bg">
            <ul>
                <li class="jz_listli" v-for="(item, index) in exams" :key="index">
                    <!-- 考试进行中列表 -->
                    <div>
                        <div class="tl_c tl_c_pl">
                            <div class="tl_c_l">
                                <span class="tl_c_lf">{{item.name}}</span>
                                <div class="tl_c_l_b">
                                    <span class="tl_c_l_f">发起时间：{{item.addtime}}</span>
                                    <span class="tl_c_c">创建人：{{item.username}}</span>
                                </div>
                            </div>
                            <div class="tl_c_r">
                                <ul>
                                    <li @click="editName(item)">
                                        <div class="tl_c_r_li_d"><i class="tl_c_r_li_d_i3"></i></div>
                                        <p>修改</p>
                                    </li>
                                    <li @click="delExam(item.exam_id, index)">
                                        <div class="tl_c_r_li_d"><i class="tl_c_r_li_d_i6"></i></div>
                                        <p>删除</p>
                                    </li>
                                    <li @click="addSubject(item)">
                                        <div class="tl_c_r_li_d"><i class="tl_c_r_li_d_i4"></i></div>
                                        <p>添加科目</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="tl_bb" v-for="(exam, eindex) in item.exams" :key="exam.tt_id">
                            <span class="tl_c_lf">{{exam.year_name}}</span>
                            <span class="tl_bb_s">{{exam.subject_name}}</span>
                            <button class="tl_bb_btn_bcc on" @click="goConfig(exam.id, exam.paper_type)">试卷配置</button>
                            <button class="tl_bb_btn_bcc" v-if="exam.paper_type == 1" :class="{'on': exam.content}" @click="goAnswer(exam)">标准答案</button>
                            <button class="tl_bb_btn_bcr" @click="delTest(exam.id, index, eindex)">删除科目</button>
                        </div>
                    </div>
                </li>
            </ul>
            <AddExam v-show="edit_show" :edit_show.sync="edit_show" :type="type" :exam_id="exam_id" :exam_name="exam_name" @refresh="getExams()"></AddExam>
            <RightAnswer v-show="answer_show" :answer_show.sync="answer_show" :exam="exam"></RightAnswer>
        </div>
        <div class="none_paper" v-if="exams && exams.length == 0"><img src="@/assets/images/empty.png" /></div>
        <div id="page" v-show="count > limit"></div>
    </div>
</div>
</template>

<script>

const AddExam = () => import("./AddExam")
const RightAnswer = () => import("./RightAnswer")
export default {
    name: 'ExamList',
    data() {
        return {
            exams: null,
            exam: [],
            answer_show: false,
            edit_show: false,
            type: 0,
            exam_id: '',
            exam_name: '',
            count: 0,//一共多少，用于判断分页是否显示
            limit: 0,//每页多少
        }
    },
    created() {
        this.getExams()
    },
    components: {
        AddExam,
        RightAnswer
    },
    watch: {
        '$store.state.area_id': function (value) {
            this.getExams()
        }
    },
    methods: {
        getExams(page = 1) {
            let data = {page: page}
            this.$http.post('/getPapers', data).then(res=>{
                this.exams = res.data.data
                this.count = res.data.count
                this.limit = res.data.limit
                let _this = this
                layui.laypage.render({
                    elem: 'page',
                    count: res.data.count,
                    limit: res.data.limit,
                    curr: page,
                    jump: function(obj, first){
                        if (!first) {
                            _this.getExams(obj.curr)
                        }
                    }
                })
            }).catch(res=>{
                this.exams = []
            })
        },
        goConfig(id, paper_type) {
            if (paper_type == 1)
                this.$router.push({name: 'PaperConfig', query: {id: id}})
            else
                this.$router.push({name: 'PaperConfigSimple', query: {id: id}})
        },
        goAnswer(exam) {
            if (exam.status == 0) {
                this.$func.error('请先配置试卷')
                return
            }
            this.exam = exam
            this.answer_show = true
        },
        addExam() {
            this.exam_id = ''
            this.exam_name = ''
            this.edit_show = true
            this.type = 0
        },
        editName(item) {
            this.exam_id = item.exam_id
            this.exam_name = item.name
            this.edit_show = true
            this.type = 1
        },
        addSubject(item) {
            this.exam_id = item.exam_id
            this.exam_name = item.name
            this.edit_show = true
            this.type = 2
        },
        delExam(id, index) {
            this.$func.confirm('确认删除该考试？').then(res => {
                this.$http.post('/delPaperExam', {id: id}).then(res=>{
                    this.exams.splice(index, 1)
                    this.exams.length == 0 && this.getExams()
                    this.$func.success(res.msg)
                })
            }).catch(res => {})
        },
        delTest(id, index, eindex) {
            this.$func.confirm('确认删除该科目？').then(res => {
                this.index = index
                this.eindex = eindex
                this.delSubject(id)
            }).catch(res => {})
        },
        delSubject(id) {
            this.$http.post('/delPaper', {id: id}).then(res=>{
                this.exams[this.index]['exams'].splice(this.eindex, 1)
            })
        },
    },
}
</script>