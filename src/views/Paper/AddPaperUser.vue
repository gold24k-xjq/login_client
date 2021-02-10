<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200">
        <back></back>
        <div class="homebg d_hb">
            <p class="pop_upt">试卷分析采集信息</p>
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
                <div class="pop_ul">
                    <label>科目</label>
                    <select id="subject_id" class="pop_ulipt pop_ulipts" v-model="subject_id" @change="getSubject">
                        <option value="">请选择</option>
                        <option :value="item.subject_id" v-for="item in subjects" v-show="item.year_id == year_id">{{item.subject_name}}</option>
                    </select>
                    <i class="pu_i" style="right: 16%;top: 17px;"></i>
                </div>
                <div class="pop_ul">
                    <label>试卷</label>
                    <select id="paper_id" class="pop_ulipt pop_ulipts" v-model="paper_id">
                        <option value="">请选择</option>
                        <option :value="item.id" v-for="item in papers">{{item.name}}</option>
                    </select>
                    <i class="pu_i" style="right: 16%;top: 17px;"></i>
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
    name: 'AddPaperUser',
    data() {
        return {
            username: '',
            year_id: '',
            subject_id: '',
            paper_id: '',
            sex: 1,
            phone: '',
            subjects: [],
            years: [],
            papers: [],
        }
    },
    watch: {
        year_id(value) {
            this.subject_id = ''
        },
        subject_id(value) {
            this.paper_id = ''
            value && this.getPapers()
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
        getPapers() {
            this.$http.post('/getPaperBySubject', {subject_id: this.subject_id, year_id: this.year_id, status: this.type}).then(res=>{
                this.papers = res.data
            }).catch(res=>{})
        },
        getSubject(e) {
            this.subject = e.target.options[e.target.selectedIndex].text
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

            if (!this.paper_id) {
                this.$func.tips('请选择试卷', 'paper_id')
                return
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
                this.$func.success(res.msg)
                //this.$router.push({name: 'SubExam', params: {'uid': res.data.uid, 'username': res.data.username, paper_id: this.paper_id}})
                this.$router.push({name: 'SubExam', query: {'uid': res.data.uid, 'username': res.data.username, paper_id: this.paper_id, type: this.type}})
            }).catch(res=>{})

        },
    },
}

</script>