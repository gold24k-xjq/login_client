<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200">
        <div class="homebg">
            <div class="cr_bgn">
                <div class="cr_tit">发起入学测评</div>  
            </div>
            <ul class="home_ul">
                <li>
                    <a @click="addUser(1)" href="javascript:;">
                        <img src="../../assets/images/rn_02.png" />
                    </a>
                </li>
                <li>
                    <a @click="addUser(2)" href="javascript:;">
                        <img src="../../assets/images/rn_01.png" />
                    </a>
                </li>
                <li>
                    <a @click="addUser(3)" href="javascript:;">
                        <img src="../../assets/images/rn_03.png" />
                    </a>
                </li>
                 <li>
                    <a @click="showCode" href="javascript:;">
                        <img src="../../assets/images/rn_04.png" />
                    </a>
                </li>
            </ul>
            <div class="checkl_ipt">
                <div class="crn_tittr ml">
                    <!-- <span>按姓名搜索：</span> -->
                    <div class="zql_emm">
                        <input type="text" placeholder="请输入姓名或手机号" class="ipt" v-model="field" @keyup.enter="search">
                    </div>
                    <button class="set_tmrb" @click="search">搜索</button>
                </div>
                <div class="crn_tittr">
                    <span>按时间：</span>
                    <div class="zql_em">
                        <input type="text" class="ipt" id="timer1">
                    </div>
                    <!-- <button class="set_tmrb">搜索</button> -->
                </div>
                <div class="pop_ul">
                    <span>按来源：</span>
                    <select class="pop_ulipt pop_ulipts" v-model="from">
                        <option value="" selected>全部</option>
                        <option value="1">智能练习册</option>
                        <option value="2">校本教辅</option>
                        <option value="3">校内在线测评</option>
                        <option value="4">校外在线评测</option>
                    </select>
                    <i class="pu_i"></i>
                </div>
                <router-link class="cp_stat" to="/UserList" v-if="usergroup_id == 43">测评统计</router-link>
            </div>
            <ul class="rpt_ul" v-if="reports.length > 0">
                <li v-for="(item, index) in reports">
                    <div class="rpt_ulpn">{{item.orders}}</div>
                    <div class="rpt_ulltl">
                        <img :src="setSex(item.sex)" />
                        <p>{{item.username}}</p>
                    </div>
                    <div class="rpt_ulltmm">

                        <div class="rpt_ullt">
                            <span class="rpt_ulltm">{{item.name}}</span>
                            <span class="rpt_ulltr">{{item.addtime}}</span>
                        </div>
                        <div class="rpt_ullb">
                            <span class="rpt_ullbl">得分率：{{item.score}}%</span>
                            <span class="rpt_ullbm">等级：{{item.level}}</span>
                            <span class="rpt_ullbc">科目: {{item.subject}}</span>
                            <!-- <span class="rpt_ullbcc">来源: {{item.type}}</span> -->
                        </div>
                    </div>
                    <div class=" rpt_ulr">
                        <router-link :to="{name: 'CheckQuestions', query: {id: item.id}}"><button class="rpt_ulrbtnr">题目解析</button></router-link>
                        <a href="javascript:;" @click="getQuestionPdf(item)"><button class="rpt_ulrbtnrr">导出题目</button></a>
                        <router-link :to="{name: 'CheckReport', query: {id: item.id}}"><button class="rpt_ulrbtnr">查看报告</button></router-link>
                        <a href="javascript:;" @click="getPdf(item)"><button class="rpt_ulrbtnrr">打印报告</button></a>
                    </div>
                   
                </li>
            </ul>
            <div class="nodata" v-else>暂无数据</div>
        </div>
        <div id="page" v-show="count > limit"></div>

    </div>
</div>

<div class="pop_up" id="add" v-show="show">

    <p class="pop_upt">入学测评采集信息</p>
    <div class="pop_ul">
        <label>姓名</label>
        <input id="username" type="text" class="pop_ulipt" placeholder="请输入姓名" v-model="username" required />
    </div>
    <div class="pop_ul">
        <label>年级</label>
        <select id="year_id" class="pop_ulipt pop_ulipts" v-model="year_id" >
            <option value="">请选择</option>
            <option v-for="(item, key) in years" :value="item.year_id">{{item.year_name}}</option>
        </select>
        <i class="pu_i" style="right: 16%;top: 17px;"></i>
    </div>
    <div v-show="type == 3">
        <div class="pop_ul">
            <label>科目</label>
            <select id="subject_id" class="pop_ulipt pop_ulipts" v-model="subject_id" @change="getSubject">
                <option value="">请选择</option>
                <option :value="item.subject_id" v-for="item in subjects" v-show="item.year_id == year_id">{{item.subject_name}}</option>
            </select>
            <i class="pu_i" style="right: 16%;top: 17px;"></i>
        </div>
        <div class="pop_ul" v-show="pharse_id == 2">
            <label>出题范围</label>
            <select class="pop_ulipt pop_ulipts" v-model="item">
                <option value="1">上学期</option>
                <option value="2">下学期</option>
                <option value="0">全一册</option>
            </select>
            <i class="pu_i" style="right: 16%;top: 17px;"></i>
        </div>
        <div class="pop_ul">
            <label>出题方式</label>
            <select class="pop_ulipt pop_ulipts" v-model="mode">
                <option value="1">随机出题</option>
                <option value="2">章节出题</option>
            </select>
            <i class="pu_i" style="right: 16%;top: 17px;"></i>
        </div>
        <div class="pop_ul" v-show="mode == 2">
            <label>章节选择</label>
            <select id="chapter_id" class="pop_ulipt pop_ulipts" v-model="chapter_id">
                <option value="">请选择</option>
                <option v-for="item in chapters" :value="item.chapter_id">{{item.chapter}}</option>
            </select>
            <i class="pu_i" style="right: 16%;top: 17px;"></i>
        </div>
        <div class="pop_ul">
            <label>出题难度</label>
            <select class="pop_ulipt pop_ulipts" v-model="diff">
                <option value="">随机</option>
                <option v-for="item in diffs" :value="item.key">{{item.value}}</option>
            </select>
            <i class="pu_i" style="right: 16%;top: 17px;"></i>
        </div>
    </div>
    <div class="pop_ul">
        <label>性别</label>
        <div class="ai_labint">
            <input id="item1" type="radio" name="item" v-model="sex" value="1" checked>
            <label for="item1"></label>
            <span>男</span>
        </div>
        <div class="ai_labint" id="sex">
            <input id="item2" type="radio" name="item" v-model="sex" value="2">
            <label for="item2"></label>
            <span>女</span>
        </div>
    </div>
    <div class="pop_ul">
        <label>年龄</label>
        <input class="pop_ulipt" type="number" v-model="age" placeholder="请输入年龄" min="1" max="10" maxlength="10" />
    </div>
    <div class="pop_ul">
        <label>手机号</label>
        <input id="phone" class="pop_ulipt" type="number" v-model="phone" placeholder="请输入手机号" />
    </div>
    <button class="pop_up_btn" @click="submit">确定</button>

</div>

<div v-show="qshow" id="qrcode">
    <img :src="qrcode" class="layui_img">
</div>

<!-- END -->
</div>
</template>

<script>

//应该把采集信息切出去
export default {
    name: 'CheckList',
    data() {
        return {
            usergroup_id: '',
            username: '',
            year_id: '',
            subject_id: '',
            sex: '',
            age: '',
            phone: '',
            show: false,
            qshow: false,
            qrcode: '',
            reports: [],
            type: 0,//区分来源123
            count: 0,//一共多少，用于判断分页是否显示
            limit: 0,//每页多少
            from: '',//来源筛选
            field: '',//搜索
            pharse_id: 2,//出题范围是否显示
            subjects: [],
            years: [],
            chapters: [],
            item: 1,//出题范围
            mode: 1,//出题方式
            chapter_id: '',
            diff: '',//难度
            diffs: [
                {key: 1, value: '简单'},
                {key: 2, value: '一般'},
                {key: 3, value: '较难'},
            ],
        }
    },
    created() {
        let userinfo = localStorage.getItem("userinfo")
        if (userinfo) {
            let users = JSON.parse(decodeURIComponent(window.atob(userinfo)))
            this.usergroup_id = users.usergroup_id
            this.qrcode = users.qrcode
        }
        
    },
    activated() {
        if (!this.$route.meta.isBack) {
            this.getReports()
            this.getSubjects()
        }
        this.$route.meta.isBack = false
    },
    beforeRouteEnter (to, from, next) {
        if (from.name == 'CheckReport' || from.name == 'CheckQuestions')
            to.meta.isBack = true
        next()
    },
    watch: {
        from() {
            this.getReports()
        },
        year_id(value) {
            let pharse_id = ''
            for(let item of this.years) {
                (item.year_id == value) && (pharse_id = item.pharse_id)
            }
            this.pharse_id = pharse_id
            
            this.getChapters()
        },
        subject_id() {
            this.getChapters()
        },
        item() {
            this.getChapters()
        },
    },
    methods: {
        getReports(page = 1) {
            let data = {page: page}
            this.from && (data.type = this.from)
            this.sphone && (data.phone = this.sphone)
            this.susername && (data.username = this.susername)
            this.date && (data.date = this.date)
            this.$http.post('/getReportList', data).then(res=>{
                this.reports = res.data.data
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
                            _this.getReports(obj.curr)
                        }
                    }
                })
            }).catch(res=>{})
        },
        getSubjects() {
            this.$http.post('/getSubjects').then(res=>{
                this.years = res.data.years
                this.subjects = res.data.subjects
            }).catch(res=>{})
        },
        getChapters() {
            if (this.year_id && this.subject_id)
            this.$http.post('/getChapters', {year_id: this.year_id, subject_id: this.subject_id, item: this.item}).then(res=>{
                this.chapters = res.data
            }).catch(res=>{})
        },
        search() {
            if (this.$func.isPhone(this.field)) {
                this.sphone = this.field
                this.susername = ''
            } else {
                this.susername = this.field
                this.sphone = ''
            }
            this.getReports()
        },
        getPdf(item) {
            let data = {id: item.id, school_id: item.school_id, name: item.name, username: item.username, from: 1}
            this.$func.getPdf(data)
        },
        getQuestionPdf(item) {
            let data = {id: item.id, school_id: item.school_id, name: item.name, username: item.username, from: 3}
            this.$func.getPdf(data)
        },
        getSubject(e) {
            this.subject = e.target.options[e.target.selectedIndex].text
        },
        setSex(sex) {
            sex = sex || 1
            return require('../../assets/images/sex_'+sex+'.png')
        },
        addUser(type = 1) {
            let height = "600px"
            this.show = true
            this.type = type
            type == 3 && (height = "900px")
            this.$func.open("add", "入学测评采集信息", ["900px", height]).then((index, dom)=> {
                this.index = index
            })
        },
        showCode() {
            if (!this.qrcode) {
                this.$func.error('请生成二维码后重新登录')
                return
            }
            this.qshow = true
            this.$func.open("qrcode", "请扫描二维码", ["800px", "500px"]).then((index, dom)=> {
                this.index = index
            })
        },
        submit() {
  
            if (!this.username) {
                this.$func.tips('请输入姓名', 'username')
                return
            }
            
            if (!this.year_id) {
                this.$func.tips('请选择年级', 'year_id')
                return
            }

            if (!this.sex) {
                this.$func.tips('请选择性别', 'sex')
                return
            }

            if (this.type == 3) {

                if (!this.subject_id) {
                    this.$func.tips('请选择科目', 'subject_id')
                    return
                }

                if (this.mode == 2 && !this.chapter_id) {
                    this.$func.tips('请选择章节', 'chapter_id')
                    return
                }

            }

            if (this.phone && !this.$func.isPhone(this.phone)) {
                this.$func.tips('格式错误', 'phone')
                return
            }

            let data = {
                username: this.username, 
                year_id: this.year_id,
                phone: this.phone,
                sex: this.sex,
                age: this.age
            }

            this.$http.post('/addCheckUser', data).then(res=>{
                layer.close(this.index)
                this.$func.success(res.msg)
                if (this.type == 3)
                    this.$router.push({name: 'Online', params: {
                        'uid': res.data.uid, 
                        'username': res.data.username, 
                        'year_id': this.year_id, 
                        'subject_id': this.subject_id, 
                        'subject': this.subject,
                        'item': this.item,
                        'mode': this.mode,
                        'chapter_id': this.chapter_id,
                        'diff': this.diff,
                    }})
                else
                    this.$router.push({name: 'SubPaper', params: {'uid': res.data.uid, 'username': res.data.username, 'from': 'EVO', type: this.type}})
            }).catch(res=>{
                layer.close(this.index)
            })

        },
    },
    mounted() {
        let _this = this
        layui.laydate.render({
            elem: '#timer1',
            range: true,
            done: function(value, date, endDate){
                _this.date = value
                _this.getReports()
            }
        })
    },
}

</script>