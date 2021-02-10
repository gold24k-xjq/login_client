<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200">
        <div class="homebg d_hb">
            <p class="pop_upt">入学测评采集信息</p>
            <div class="d_hb_w">
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
                    <div class="pop_ul">
                        <label>教材</label>
                        <select id="textbook_id" class="pop_ulipt pop_ulipts" v-model="textbook_id">
                            <option value="">请选择</option>
                            <option :value="item.textbook_id" v-for="item in books" v-show="item.year_id == year_id && item.subject_id == subject_id">{{item.textbook_name}}</option>
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
                        <div class="pop_ul">
                            <label>章节选择</label>
                            <div class="d_cb_w">
                            <label :for="key" class="d_cb" v-for="(item, key) in chapters">
                                {{item.chapter}}
                                <input :id="key" type="checkbox" :value="item.chapter_id" v-model="chapter_id"> <span></span>
                            </label>
                          </div>
                        </div>
                    </div>
                    <div class="pop_ul">
                        <label>出题难度</label>
                        <select class="pop_ulipt pop_ulipts" v-model="diff">
                            <option value="">随机</option>
                            <option v-for="item in diffs" :value="item.key">{{item.value}}</option>
                        </select>
                        <i class="pu_i" style="right: 16%;top: 17px;"></i>
                    </div>
                    <div class="pop_ul">
                        <label>出题数量</label>
                        <select class="pop_ulipt pop_ulipts" v-model="qcount">
                            <option v-for="item in qcounts" :value="item.key">{{item.value}}</option>
                        </select>
                        <i class="pu_i" style="right: 16%;top: 17px;"></i>
                    </div>
                </div>
                <div class="pop_ul">
                    <label>性别</label>
                    <select class="pop_ulipt pop_ulipts" v-model="sex">
                        <option value="1">男</option>
                        <option value="2">女</option>
                    </select>
                    <i class="pu_i" style="right: 16%;top: 17px;"></i>
                </div>
                <div class="pop_ul">
                    <label>手机号</label>
                    <input id="phone" class="pop_ulipt" type="number" v-model="phone" placeholder="请输入手机号" />
                </div>
                <button class="pop_up_btn" @click="submit">确定</button>
            </div>
        </div>
    </div>
</div>
<!-- END -->
</div>
</template>

<script>


export default {
    name: 'AddUser',
    data() {
        return {
            username: '',
            year_id: '',
            subject_id: '',
            sex: 1,
            age: '',
            phone: '',
            type: 0,//区分来源123
            pharse_id: 2,//出题范围是否显示
            subjects: [],
            years: [],
            books: [],
            chapters: [],
            textbook_id: '',//出题范围
            mode: 1,//出题方式
            chapter_id: [],
            diff: '',//难度
            diffs: [
                {key: 1, value: '一般'},
                {key: 2, value: '较难'},
                // {key: 3, value: '较难'},
            ],
            qcount: 20,
            qcounts: [
                {key: 5, value: '5道'},
                {key: 10, value: '10道'},
                {key: 15, value: '15道'},
                {key: 20, value: '20道'},
            ],
        }
    },
    watch: {
        year_id(value) {
            let pharse_id = ''
            for(let item of this.years) {
                (item.year_id == value) && (pharse_id = item.pharse_id)
            }
            this.pharse_id = pharse_id
            this.textbook_id = ''
        },
        subject_id() {
            this.textbook_id = ''
        },
        textbook_id() {
            this.getChapters()
        },
    },
    created() {
        this.type = this.$route.query.type
        this.getSubjects()
    },
    methods: {
        getSubjects() {
            this.$http.post('/getSubjects').then(res=>{
                this.years = res.data.years
                this.subjects = res.data.subjects
                this.books = res.data.books
            }).catch(res=>{})
        },
        getChapters() {
            if (this.subject_id && this.textbook_id)
            this.$http.post('/getChapters', {subject_id: this.subject_id, textbook_id: this.textbook_id}).then(res=>{
                this.chapters = res.data
            }).catch(res=>{})
        },
        getSubject(e) {
            this.subject = e.target.options[e.target.selectedIndex].text
        },
        submit() {

            if (this.type >= 4) {
                this.$func.error('Wrong Params')
                return
            }
  
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

                if (!this.textbook_id) {
                    this.$func.tips('请选择教材', 'textbook_id')
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
                        'textbook_id': this.textbook_id,
                        'mode': this.mode,
                        'chapter_id': this.chapter_id,
                        'diff': this.diff,
                        'qcount': this.qcount,
                    }})
                else
                    this.$router.push({name: 'SubPaper', params: {'uid': res.data.uid, 'username': res.data.username, type: this.type}})
            }).catch(res=>{
                layer.close(this.index)
            })

        },
    },
}

</script>