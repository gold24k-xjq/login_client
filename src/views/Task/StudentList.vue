<template>
<!-- START -->
<div class="tab">
    <div class="cr_bg cr_bgn">
        <div class="jz_t_ccb">
            <span @click="clearUser" :class="{'jz_t_ccbs': !current_uid}">全部</span>
            <ul class="jz_t_cc">
                <li v-for="item in users" :class="{'on': current_uid == item.uid}" @click="byuser(item)">{{item.username}}</li>
            </ul>
        </div>
    </div>
    <div class="cr_bg cr_bgn">
        <div class="jz_t_ccb">
            <span @click="current_subject_id = 0" :class="{'jz_t_ccbs': current_subject_id == 0}">全部</span>
            <ul class="jz_t_cc">
                <li v-for="item in subjects" :class="{'on': current_subject_id == item.subject_id}" @click="current_subject_id = item.subject_id">{{item.subject_name}}</li>
            </ul>
            <ul class="jz_t_cc jz_t_ccc">
                <li v-for="item in types" :class="{'on': current_type == item.index}" @click="current_type = item.index">{{item.name}}</li>
                <!-- <li>知识点</li> -->
            </ul>
        </div>
    </div>
    
    <div class="cr_bg" v-if="current_type == 3">
        <ul class="rpt_ul rpt_uln" v-if="kreports.length > 0">
            <li v-for="(item, index) in kreports">
                <div class="rpt_ulpn">{{item.orders}}</div>
                <div class="fl rpt_ulltl" @click="goCenter(item)">
                    <img src="../../assets/images/sex_1.png" />
                    <p>{{item.student_name}}</p>
                </div>
                <div class="rpt_ulltmm">
                    <div class="rpt_ullt">
                        <span class="rpt_ulltm rpt_w65">{{item.student_name}} - {{item.subject_name}}</span>
                    </div>
                    <div class="rpt_ullb">
                        <span class="rpt_ullbl">全部知识点：{{item.is_get0 + item.is_get1 + item.is_get2}}</span>
                        <span class="rpt_ullbm">未强化：{{item.is_get0}}</span>
                        <span class="rpt_ullbc">已强化: {{item.is_get1}}</span>
                    </div>
                </div>
                <div class="rpt_ulr">
                    <router-link :to="{name: 'Center', query: {grade_id: item.grade_id, uid: item.uid, subject_id: item.subject_id, username: item.student_name, current: 0}}"><button class="rpt_ulrbtnr rpt_red">未强化</button></router-link>
                    <router-link :to="{name: 'Center', query: {grade_id: item.grade_id, uid: item.uid, subject_id: item.subject_id, username: item.student_name, current: 1}}"><button class="rpt_ulrbtnr">已强化</button></router-link>
                    <router-link :to="{name: 'Center', query: {grade_id: item.grade_id, uid: item.uid, subject_id: item.subject_id, username: item.student_name, current: 2}}"><button class="rpt_ulrbtnr rpt_redyw">强化中</button></router-link>
                </div>
            </li>
        </ul>
        <div class="nodata" v-else>暂无数据</div>
    </div>
    <div class="cr_bg" v-else>
        <ul class="rpt_ul rpt_uln" v-if="ureports.length > 0">
            <li v-for="(item, index) in ureports">
                <div class="rpt_ulpn">{{item.orders}}</div>
                <div class="fl rpt_ulltl" @click="goCenter(item)">
                    <img src="../../assets/images/sex_1.png" />
                    <p>{{item.name}}</p>
                    <!-- <p>学号：02356255</p> -->
                </div>
                <div class="rpt_ulltmm">
                    <div class="rpt_ullt">
                        <span class="rpt_ulltm rpt_w65">{{item.practice_name}}</span>
                        <span class="rpt_ulltr">{{item.addtime}}</span>
                        <!-- <span class="rpt_ulrpr">{{item.task_type}}</span> -->
                    </div>
                    <div class="rpt_ullb">
                        <span class="rpt_ullbl">得分率：{{item.correct}}%</span>
                        <span class="rpt_ullbm">等级：{{item.level}}</span>
                        <span class="rpt_ullbc">科目: {{item.subject_name}}</span>
                    </div>
                </div>
                <div class="rpt_ulr">
                    <router-link :to="{name: 'Questions', query: {'id': item.practice_id, 'uid': item.uid, 'gid': item.grade_id}}"><button class="rpt_ulrbtnr">题目解析</button></router-link>
                    <div class="rpt_ulrdc">
                        <button class="rpt_ulrbtnrr" @click="togglePanel(item)">强化训练<i :class="{'on': item.strshow}"></i></button>
                        <div class="rpt_ulrdcc" v-show="item.strshow">
                            <button class="rpt_ulrbtnr" style="margin-bottom: 15px" @click="goReport(item)" v-if="item.is_done && item.q_temp">完成强化训练</button>
                            <button class="rpt_ulrbtnr disabled" style="margin-bottom: 15px" v-else-if="item.is_done && !item.q_temp">无需强化训练</button>
                            <button class="rpt_ulrbtnr rpt_red" style="margin-bottom: 15px" @click="getDownload(item)" v-else>打印试题</button>
                            <a href="javascript:;" @click="goSub(item)"><button class="rpt_ulrbtnrr" :class="{'disabled': item.is_done == 1}" style="margin-bottom: 15px;margin-left: 35px;">提交答案</button></a>
                            <router-link :to="{name: 'Center', query: {grade_id: item.grade_id, uid: item.uid, subject_id: item.subject_id, username: item.name}}"><button class="rpt_ulrbtnrr" style="margin-bottom: 15px;margin-left: 35px;">单知识点</button></router-link>
                        </div>
                    </div>
                    <router-link :to="{name: 'TaskReport', query: {'pid': item.practice_id, 'uid': item.uid, 'gid': item.grade_id}}"><button class="rpt_ulrbtnr">查看报告</button></router-link>
                    <div class="rpt_ulrdc">
                        <button class="rpt_ulrbtnrr" @click="togglePanel1(item)">导出打印<i :class="{'on': item.pdfshow}"></i></button>
                        <div class="rpt_ulrdcc" v-show="item.pdfshow" style="width: 120px">
                            <a href="javascript:;" @click="getQuestionPdf(item)"><button class="rpt_ulrbtnrr" style="margin-left: 21px">打印错题</button></a>
                            <a href="javascript:;" @click="getPdf(item, 2)"><button class="rpt_ulrbtnrr" style="margin-left: 21px">打印报告</button></a>
                            <a href="javascript:;" v-if="item.correct == 100"><button class="rpt_ulrbtnrr disabled" style="margin-left: 21px">学习手册</button></a>
							<a href="javascript:;" @click="getPdf(item, 7)" v-else><button class="rpt_ulrbtnrr" style="margin-left: 21px">学习手册</button></a>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="nodata" v-else>暂无数据</div>
    </div>
    <div id="page" v-show="count > limit"></div>
</div>
<!-- END -->
</template>

<script>


export default {
    name: 'Statement',
    data() {
        return {
            current_uid: '',
            current_type: 1,
            current_subject_id: 0,
            users: [],
            ureports: [],
            subjects: [],
            kreports: [],//知识点
            access: true,
            count: 0,//一共多少，用于判断分页是否显示
            limit: 0,//每页多少
            types: [
                {index: 1, name: '作业报告'},
                {index: 2, name: '强化报告'},
                {index: 3, name: '知识点'},
            ]
        }
    },
    activated() {
        if (!this.$route.meta.isBack) {
            this.getSubjects()
            this.getTaskUsers()
            this.getTaskList()
        }
        this.$route.meta.isBack = false
    },
    watch: {
        current_type(value) {
            if (value == 3)
                this.getKnowledges()
            else
                this.getTaskList()
        },
        current_subject_id() {
            if (this.current_type == 3)
                this.getKnowledges()
            else
                this.getTaskList()
        },
        current_uid() {
            if (this.current_type == 3)
                this.getKnowledges()
            else
                this.getTaskList()
        }
    },
    methods: {
        getTaskUsers() {
            this.$http.post('/getTaskUsers').then(res=>{
                this.users = res.data
            }).catch(res=>{})
        },
        getTaskList(page = 1) {
            let data = {page: page}
            if (this.current_uid) {
                data.uid = this.current_uid
                data.grade_id = this.current_gid
            }
            data.type = this.current_type
            data.subject_id = this.current_subject_id
            this.$http.post('/getTaskList', data).then(res=>{
                let data = res.data.data
                for (let index in data) {
                    data[index]['pdfshow'] = false
                    data[index]['strshow'] = false
                }
                this.ureports = data
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
        getKnowledges(page = 1) {
            let data = {page: page}
            if (this.current_uid) {
                data.uid = this.current_uid
                data.grade_id = this.current_gid
            }
            data.subject_id = this.current_subject_id
            this.$http.post('/getUserKnowledges', data).then(res=>{
                let data = res.data.data
                this.kreports = data
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
                            _this.getKnowledges(obj.curr)
                        }
                    }
                })
            }).catch(res=>{})
        },
        getSubjects() {
            this.$http.post('/getSchoolSubjects').then(res=>{
                this.subjects = res.data
            }).catch(res=>{})
        },
        goReport(item) {
            this.$router.push({name: 'TaskReport', query: {'temp_code': item.q_temp, 'uid': item.uid, 'gid': item.grade_id}})
        },
        goSub(item) {
            if (item.is_done == 1) {
                this.$func.error('强化训练已完成')
            } else {
                if (item.q_temp) {
                    this.$router.push({name: 'SubPaper', params: {'temp_code': item.q_temp, 'uid': item.uid, from: 'TASK'}})
                } else {
                    if (!this.access) return
                    this.access = false
                    this.$func.load()
                    this.$http.post('/setStrengReturnCode', {'uid': item.uid, 'practice_id': item.practice_id}).then(res=>{
                        this.access = true
                        layer.closeAll('loading');
                        this.$router.push({name: 'SubPaper', params: {'temp_code': res.data, 'uid': item.uid, from: 'TASK'}})
                    }).catch(res=>{
                        this.access = true
                        layer.closeAll('loading');
                    })
                }
            }
        },
        getPdf(item, from) {
            let data = {practice_id: item.practice_id, uid: item.uid, grade_id: item.grade_id, school_id: item.school_id, name: item.practice_name, username: item.name, from: from}
            this.$func.getPdf(data)
        },
        getQuestionPdf(item) {
            let data = {practice_id: item.practice_id, uid: item.uid, grade_id: item.grade_id, school_id: item.school_id, name: item.practice_name, username: item.name, from: 4}
            this.$func.getPdf(data)
        },
        byuser(item) {
            this.current_uid = item.uid
            this.current_gid = item.grade_id
        },
        clearUser() {
            this.current_uid = ''
            this.current_gid = ''
        },
        stopshow() {//清除导出打印div，暂时没用
            for (let item of this.ureports) {
                item.pdfshow = false
            }
        },
        getDownload(item) {
            if (item.path) {
                this.$func.downloads(item)
            } else {
                if (!this.access) return
                this.access = false
                this.$func.load()
                this.$http.post('/setStreng', {'uid': item.uid, 'practice_id': item.practice_id}).then(res=>{
                    //下载完成后应该把q_temp保存到列表中，现在需要刷新
                    this.access = true
                    layer.closeAll('loading');
                    this.$func.downloads(res.data)
                }).catch(res=>{
                    this.access = true
                    layer.closeAll('loading');
                })
            }
        },
        goCenter(item) {
            this.$router.push({name: 'Center', query: {grade_id: item.grade_id, uid: item.uid, subject_id: item.subject_id, username: item.name}})
        },
		togglePanel (item) { 
　　　　　	//阻止冒泡
			// console.log(item.strshow)
			if(!item.strshow){
				for(var i=0;i<this.ureports.length;i++){
				   // console.log(this.ureports[i].strshow)
				   this.ureports[i].strshow = false;
				   this.ureports[i].pdfshow = false;
				}
			}
　　　　　　event || (event = window.event);
　　　　　　event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
　　　　　　item.strshow ? this.hide(item) : this.show(item)
		},
		show (item) {
			item.strshow = true
			item.pdfshow = false
			this.items = item
			document.addEventListener('click', this.hidePanel, false)
		},

		hide (item) {
			item.strshow = false
			document.removeEventListener('click', this.hidePanel, false)
		},

		hidePanel (e) {
			//if (this.$refs.main) {//点击除弹出层外的空白区域
				this.items.strshow = false
			//}
		},
		togglePanel1 (item) {
　　　　　	//阻止冒泡
			if(!item.pdfshow){
				for(var i=0;i<this.ureports.length;i++){
				   // console.log(this.ureports[i].strshow)
				   this.ureports[i].strshow = false;
				   this.ureports[i].pdfshow = false;
				}
			}
　　　　　　event || (event = window.event);
　　　　　　event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
　　　　　　item.pdfshow ? this.hide1(item) : this.show1(item)
		},
		show1 (item) {
			item.pdfshow = true
			item.strshow = false
			this.items = item
			document.addEventListener('click', this.hidePanel1, false)
		},
		
		hide1 (item) {
			item.pdfshow = false
			document.removeEventListener('click', this.hidePanel1, false)
		},
		
		hidePanel1 (e) {
			//if (this.$refs.main) {//点击除弹出层外的空白区域
				this.items.pdfshow = false
			//}
		},
	},
}
</script>