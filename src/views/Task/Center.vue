<template>
<div>
<!-- START -->
<div class="content">
    
    <div class="w1200 overflow cont_bg">
        <back></back>
        <ul class="jz_t_ul fl">
            <li v-for="(item, index) in title" :class="{'on': current == index}" @click="current = index">{{item}}</li>
        </ul>
        <div class="fr jz_t_r">
            <select class="pop_ulipt pop_ulipts" @change="selected">
                <option v-for="(item, index) in subjects" :selected="item.subject_id == subject_id">{{item.subject_name}}</option>
            </select>
            <i class="pu_i"></i>
        </div>
         <p class="fr center_name">{{username}}</p>
    </div>
    
    <div class="w1200 overflow cont_bg" v-show="current == KNOW">
        <ul class="jz_t_ul fl">
            <li v-for="(item, index) in k_title" :class="{'on': k_cur == index}" @click="k_cur = index">{{item.name}}（{{item.count}}）</li>
        </ul>
    </div>

    <div class="w1200 cont_bg" style="padding-bottom: 20px;">
        <div class="cr_bg" v-if="current == STUDY">
            <table class="set_tmtab port_mt0">
                <tbody>
                    <tr v-for="(item, index) in reports">
                        <td class="port_mt0_tdl"><i>{{index + 1}}.</i>{{item.practice_name}}<span>{{item.addtime}}</span></td>
                        <td>
                            <button :class="item.study_path ? 'port_btn_y' : 'port_btn_g'" @click="$refs.child.pdfOption(item)">{{item.study_path ? '已导出' : '导出打印'}}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ul class="int_ul" style="margin-left: 1.25rem;" v-else-if="current == WRONG || current == STRENG">
            <li v-for="item in weeks" style="margin-top: 15px;">
                <p class="int_tbt"><i></i>{{item.subject_name}}{{wrong_name}}</p>
                <p class="int_tbt1">{{$func.formatDate(item.start)}} 至 {{$func.formatDate(item.end)}}</p>
                <p class="int_tbt2">发布时间：<span>{{item.addtime}}</span></p>
                <button class="int_tbtn" @click="getDownload(item)">查看题集<i></i></button>
            </li>
        </ul>
        <div class="cen_t" v-else>
            <div v-if="knowledges.length > 0">
                <div class="cen_list" v-for="chapter in knowledges">
                    <h1 class="cen_lh1">{{chapter.chapter}}<span>（{{chapter.count}}）</span></h1>
                    <div v-for="unit in chapter.unit">
                        <h2 class="cen_lh2">{{unit.unit}}<span>（{{unit.count}}）</span></h2>
                        <ul class="cen_lul">
                            <li class="pv_blli" v-for="knowledge in unit.knowledges">
                                <span :class="'wa_r'+knowledge.weight">{{knowledge.weightname}}</span> 
                                <span class="pv_span line">{{knowledge.knowledge}}</span>
                                <button class="rpt_ulrbtnm rpt_redyw" @click="setStrengReturnCode(knowledge)">提交答案</button>
                                <button class="rpt_ulrbtnm" @click="setStreng(knowledge)">下载试题</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div v-else class="cont_none">
                <img src="../../assets/images/none.png">
                <p>暂无对应知识点</p>
            </div>
        </div>
    </div>
    <div id="page" v-show="count > limit && current == 5"></div>
</div>
<!-- 导出打印弹窗 -->
<PdfOptions ref="child"></PdfOptions>
<!-- END -->
</div>
</template>

<script>

const KNOW = 1
const WRONG = 2
const STRENG = 3
import PdfOptions from '@/components/PdfOptions.vue'
export default {
    name: 'Center',
    data() {
        return {
            show: false,
            access: true,
            knowledges: [],
            weeks: [],
            subjects: [],
            reports: [],
            username: '',
            subject_id: '',
            count: 0,//一共多少，用于判断分页是否显示
            limit: 0,//每页多少
            current: 0,
            k_cur: 0,//未强化已强化
            title: ['学习手册', '未掌握知识点', '周错题集', '周强化题集'],
            //k_title: ['未强化', '已强化', '强化中'],
            k_title: [
                {name: '未强化', count: 0},
                {name: '已强化', count: 0},
                {name: '强化中', count: 0},
            ],
            wrong_name: '错题集',
            STUDY: 0,
            KNOW: 1,
            WRONG: 2,
            STRENG: 3,
        }
    },
    components: {
        PdfOptions,
    },
    created() {
        this.grade_id = this.$route.query.grade_id
        this.username = this.$route.query.username
        this.uid = this.$route.query.uid
        this.subject_id = this.$route.query.subject_id
        let current = this.$route.query.current
        current && (this.current = current)
        this.getSubjects()
    },
    watch: {
        subject_id: {
            handler(newName, oldName) {
                if (newName) {
                    this.getKnowledges()
                    this.getWeeks()
                    this.getTaskList()
                }
            },
            immediate: true
        },
        current(value) {
            value == this.KNOW && this.allk && (this.knowledges = this.allk[this.k_cur])
            value == this.WRONG && (this.wrong_name = '错题集')
            value == this.STRENG && (this.wrong_name = '个性题集')
        },
        k_cur(value) {
            this.allk && (this.knowledges = this.allk[value])
        },
    },
    methods: {
        getTaskList(page = 1) {
            let data = {page: page}
            data.from = 1//需要十条分页
            data.type = 1//只查作业报告
            data.uid = this.uid
            data.grade_id = this.grade_id
            data.subject_id = this.subject_id
            this.$http.post('/getTaskList', data).then(res=>{
                let data = res.data.data
                this.reports = data
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
                            _this.getTaskList(obj.curr)
                        }
                    }
                })
            }).catch(res=>{})
        },
        getKnowledges() {
            this.$http.post('/getKnowledges', {grade_id: this.grade_id, uid: this.uid, subject_id: this.subject_id}).then(res=>{
                this.allk = res.data
                for(let index in this.k_title) {
                    let count = 0
                    res.data[index].forEach((item) => {
                        count += item.count
                    })
                    this.k_title[index].count = count
                }
                this.knowledges = res.data[this.k_cur]
            }).catch(res=>{})
        },
        getWeeks() {
            this.$http.post('/getWeeks', {uid: this.uid, subject_id: this.subject_id}).then(res=>{
                this.weeks = res.data
            }).catch(res=>{})
        },
        getSubjects() {
            this.$http.post('/getStudentSubjects', {uid: this.uid}).then(res=>{
                this.subjects = res.data
                if (!this.grade_id)
                    this.switchs(0)
            }).catch(res=>{})
        },
        setStreng(item) {
            if (this.k_cur == 1) {//已强化
                this.$func.error('无需强化')
                return
            }
            let data = {
                knowledge_id: item.knowledge_id,
                knowledge: item.knowledge,
                textbook_id: item.textbook_id,
                subject_id: this.subject_id,
                uid: this.uid,
                username: this.username,
            }
            this.$func.setStreng('/knowledgeStreng', data)
        },
        setStrengReturnCode(item) {
            if (this.k_cur == 1) {//已强化
                this.$func.error('无需强化')
                return
            }
            if (!this.access) return
            this.access = false
            this.$func.load()
            let data = {
                knowledge_id: item.knowledge_id,
                knowledge: item.knowledge,
                textbook_id: item.textbook_id,
                subject_id: this.subject_id,
                uid: this.uid,
                username: this.username,
            }
            this.$http.post('/knowledgeStrengReturnCode', data).then(res=>{
                this.access = true
                layer.closeAll('loading');
                this.$router.push({name: 'SubPaper', params: {'temp_code': res.data, 'uid': this.uid, from: 'TASK'}})
            }).catch(res=>{
                this.access = true
                layer.closeAll('loading');
            })
        },
        switchs(index) {
            let reset = this.subjects[index]
            this.grade_id = reset.grade_id
            this.subject_id = reset.subject_id
        },
        selected(e) {
            this.switchs(e.target.selectedIndex)
        },
        getDownload(item) {
            if (this.current == this.WRONG) {//错题集
                let data = {uid: this.uid, subject_id: this.subject_id, start: item.start, end: item.end, username: this.username, from: 5}
                this.$func.getPdf(data)
            } else if (this.current == this.STRENG) {//强化题集
                if (item.path) {
                    this.$func.downloads(item)
                } else {
                    if (!this.access) return
                    this.access = false
                    this.$func.load()
                    let data = {
                        'username': this.username,
                        'uid': this.uid, 
                        'subject_id': item.subject_id, 
                        'start': item.start, 
                        'end': item.end
                    }
                    this.$http.post('/setStrengByUid', data).then(res=>{
                        this.access = true
                        layer.closeAll('loading')
                        this.$func.downloads(res.data)
                    }).catch(res=>{
                        this.access = true
                        layer.closeAll('loading')
                    })
                }
            } else {
                this.$func.error('error')
            }
            
        },
    },
}

</script>
<style scoped="">
    .int_ul li{
        width: 218px;
        margin-right: 15px;

    }
    .int_ul li:nth-child(5n){
        margin-right: 0;
    }
    .cont_bg{
        margin-top: 10px;
    }
</style>