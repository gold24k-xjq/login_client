<template>
<div>
<!-- START -->
<div class="content" id="ExamConfig">
    <div class="w1200 pt">
        <div class="cr_bg_pt">
            <div class="test_cf_tit">
                <p>{{exam.name}}——{{exam.year_name}}（{{exam.subject_name}}）—试卷配置</p>
            </div>
            <div class="test_cf_cont">
                <div class="test_pc">
                    <label>试题：</label>
                    <div class="test_r flex">
                        <div class="test_r_ipt">
                            <input type="number" maxlength="2" v-model="q_count"/>道题
                        </div>
                        <div class="test_r_select test_r_iptlr">
                            <select v-model="cur_qtype">
                                <option value="">请选择题型</option>
                                <option v-for="(item, index) in exam.types" :key="index" :value="item.id">{{item.qtype}}</option>
                            </select>
                            <i></i>
                        </div>
                        <button class="test_cf_btn1" @click="showInfo">添加</button>
                        <div>当前总分：{{totalScore}}</div>
                    </div>
                </div>
                <div class="test_mb" v-for="(item, index) in paper" :key="index">
                    <span>题型：{{item.qtype_name}}
                        <span class="test_cf_span">数量：{{item.count}}</span>
                        <span class="test_cf_span_df">分数：<input type="number" maxlength="2" class="test_cf_ipt" v-model="item.score" @input="setScore1($event.target.value, item)" /></span>
                        <span class="test_cf_span_df" v-if="item.ismultichoice == 1">漏选分数：<input type="number" maxlength="2" class="test_cf_ipt" v-model="item.lou" @input="louScore1($event.target.value, item)" /></span>
                        <button class="test_mb_ul_btn" @click="delType(index)">删除题型</button>
                    </span>
                    <ul class="test_mb_ul">
                        <li class="test_mb_ul_li">
                            <span>题号</span><span>题型</span><span>分值</span><span  v-if="item.ismultichoice == 1">漏选分值</span><span v-if="item.subjective == 1">选项</span><span>关联知识点</span><span>插入试题</span><span>删除试题</span>
                        </li>
                        <li v-for="(info, index1) in item.info" :key="index1">
                            <span>{{info.order}}、</span>
                            <span class="test_mb_ul_lismf">{{item.qtype_name}}</span>
                            <!-- <span class="test_cf_span">别名：<input type="text" maxlength="10" class="test_cf_ipt" :value="info.alias" @input="info.alias = $event.target.value" style="width: 80px;"/></span> -->
                            <span class="test_cf_span_df test_mb_ul_lismf">分值：<input type="number" maxlength="2" class="test_cf_ipt" v-model="info.scoreq" @input="setScore2($event.target.value, item, info)" /></span>
                            <span class="test_cf_span" v-if="item.ismultichoice == 1">漏选分值：<input type="number" maxlength="2" class="test_cf_ipt" v-model="info.lou" @input="louScore2($event.target.value, info)" /></span>
                            <span class="test_cf_span_df test_mb_ul_lismf" v-if="item.subjective == 1">选项：<input type="number" maxlength="2" class="test_cf_ipt" v-model="info.option" /></span>
                            <button class="test_mb_ul_btn" @click="choosek(index, index1)">知识点（{{info.know_info ? info.know_info.length : 0}}）</button>
                            <button class="test_mb_ul_btn test_mb_ul_btn_c1" @click="insertq(item, index1)">插入试题</button>
                            <button class="test_mb_ul_btn test_mb_ul_btn_c2" @click="deleteq(item, index1)">删除该题</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="test_btn">
                <button class="test_btn_g" @click="submit">确定</button>
                <button class="test_btn_c" @click="$router.go(-1)">返回</button>
            </div>
        </div>
        
    </div>
</div>
<KnowledgePoint v-show="k_show" :k_show.sync="k_show" :exam="exam" :ck_knowledges="knowledges" :ck_kids="kids" @getkids="getkids" @getknowledges="getknowledges"></KnowledgePoint>
<!-- END -->
</div>
</template>

<script>

const KnowledgePoint = () => import("./KnowledgePoint")
export default {
    data () {
        return {
            exam: [],
            id: '',
            q_count: '',//题数
            cur_qtype: '',//当前题型
            paper: [],
            k_show: false,
            total: 0,//总题数
            knowledges: [],
            kids: '',
            paper_id: '',
            totalScore: 0,
        }
    },
    components: {
        KnowledgePoint,
    },
    created() {
        this.id = this.$route.query.id
        this.getExams()
    },
    watch: {
        q_count() {
            let total = 0
            this.paper.forEach(item => {
                total += parseInt(item.count)
            })
            this.total = total
        },
    },
    methods: {
        getExams() {
            this.$http.post('/getPaperInfo', {id: this.id}).then(res=>{
                this.exam = res.data
                if (res.data.content) {
                    this.paper = res.data.content
                    this.setTotalScore()
                }
            })
        },
        submit() {
            if (!this.paper.length) {
                this.$func.error('请选择题型')
                return
            }
            let k_done = true
            let s_done = true
            let order
            this.paper.forEach(item => {
                item.info.forEach(value => {
                    if (value.know_info.length == 0) {
                        k_done = false
                        order = value.order
                    }
                    !value.scoreq && (s_done = false)
                })
            })
            if (!s_done) {
                this.$func.error('请设置分数')
                return
            }
            if (!k_done) {
                this.$func.error(`第${order}题未标记知识点`)
                return
            }
            this.$http.post('/saveContent', {id: this.id, content: this.paper}).then(res=>{
                this.$router.push('/TestList')
            })
        },
        delType(index) {
            this.paper.splice(index, 1)
            this.resetOrder()
            this.setTotalScore()
        },
        choosek(index, index1) {
            this.knowledges = this.$func.clone(this.paper[index]['info'][index1]['know_info'])
            this.kids = this.paper[index]['info'][index1]['kids']
            this.k_show = true
            this.cur_index = index
            this.cur_index1 = index1
        },
        getkids(value) {
            this.paper[this.cur_index]['info'][this.cur_index1]['kids'] = value
        },
        getknowledges(value) {
            this.paper[this.cur_index]['info'][this.cur_index1]['know_info'] = value
        },
        setScore1(score, item) {
            if (score < 0) {
                this.$func.error('请输入合理的分数')
                item.score = ''
                return
            }
            score = score || 0
            let f = item.score/item.count
            let per = f % 1 === 0 ? f : f.toFixed(1)
            item.info.forEach((value) => {
                value.scoreq = per
            })
            this.setTotalScore()
        },
        setScore2(score, item, info) {
            if (score < 0) {
                this.$func.error('请输入合理的分数')
                info.scoreq = ''
                return
            }
            let item_score = 0
            item.info.forEach((value) => {
                let scoreq = value.scoreq || 0
                item_score += Number(scoreq)
            })
            item.score = item_score
            this.setTotalScore()
        },
        louScore1(score, item) {
            let min = Math.min.apply(Math, item.info.map(value => { return value.scoreq }))
            if (score < 0 || Number(score) > Number(min)) {
                this.$func.error('请输入合理的分数')
                item.lou = ''
                return
            }
            item.info.forEach((value) => {
                value.lou = score
            })
        },
        louScore2(score, info) {
            if (score < 0 || Number(score) > Number(info.scoreq)) {
                this.$func.error('请输入合理的分数')
                info.lou = ''
            }
        },
        setTotalScore() {
            let totalScore = 0
            this.paper.forEach(item => {
                let score = item.score || 0
                totalScore += Number(score)
            })
            this.totalScore = totalScore
        },
        insertq(item, index) {
            let ins = this.$func.clone(item.info[index])
            ins.kids = ''
            ins.know_info = []
            ins.scoreq = 0
            ins.alias = ''
            item.info.splice(index, 0, ins)

            item.count ++
            this.resetOrder()
            
        },
        deleteq(item, index) {
            item.score -= item.info[index].scoreq
            item.info.splice(index, 1)
            item.count --
            item.count == 0 && this.paper.splice(index, 1)//删除最后一道同时，删除该题型
            this.resetOrder()
            this.setTotalScore()
        },
        resetOrder() {
            let first = 1//重新索引题号
            this.paper.forEach(item => {
                item.info.forEach(value => {
                    value.order = first
                    first ++
                })
            })
        },
        showInfo() {

            let if_exist = this.paper.filter( f => f.qtype_id == this.cur_qtype)
            if (if_exist.length) {
                this.$func.error('该题型已存在')
                return
            }
            if (!this.q_count || !/(^[1-9]\d*$)/.test(this.q_count)) {
                this.$func.error('请输入合理的题目数量')
                return
            }
            if (!this.cur_qtype) {
                this.$func.error('请选择题型')
                return
            }


            let cur_typename, cur_subjective, cur_ismultichoice, cur_is_blank, cur_is_judge
            let questions = []
            let alias = 0
            
            for (let item of this.exam.types) {
                if (item.id == this.cur_qtype) {
                    cur_typename = item.qtype
                    cur_subjective = item.subjective
                    cur_ismultichoice = item.ismultichoice
                    cur_is_blank = item.is_blank
                    cur_is_judge = item.is_judge
                }
            }

            for (let i = 1; i <= this.q_count; i++) {
                let question = {
                    order: this.total + i,
                    alias: this.total + i,
                    lou: 0,
                    scoreq: 0,
                    kids: '',
                    know_info: []
                }
                let option_num = cur_is_judge == 1 ? 2 : 4
                cur_subjective == 1 && (question.option = option_num)
                questions.push(question)
            }

            let cur = {
                qtype_id: this.cur_qtype,
                qtype_name: cur_typename,
                subjective: cur_subjective,
                ismultichoice: cur_ismultichoice,
                is_blank: cur_is_blank,
                count: this.q_count,
                lou: '',
                score: '',
                info: questions
            }

            this.paper.push(cur)
            this.cur_qtype = ''
            this.q_count = ''
        },
    },
}
</script>