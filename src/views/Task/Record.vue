<template>
<div class="content">
	<div class="w1200">
		<div class="cr_bg">
			<div class="port_t">
				<div class="port_t_l" :class="{'on': letter == 0}" @click="letter = 0">全部学生</div>
				<div class="port_t_m">
					<span v-for="(item, index) in letters" :class="{'on': letter == item}" @click="letter = item">{{item}}</span>
				</div>
				<!-- <input type="text" placeholder="姓名或账号" class="ipt" v-model="username" @keyup.enter="getUsers()"> -->
                <MyInput placeholder="姓名或账号" :data="totalUsers" v-model="username" @enter="getUsers"></MyInput>
                <button class="set_tmrb" style="margin-left: 0" @click="getUsers()">搜索</button>
			</div>
		</div>
        <div class="cr_bg">
            <div class="port_t">
                <div class="record_se">
                    <select class="pop_ulipt pop_ulipts" v-model="year_id">
                        <option value="" selected>请选择年级</option>
                        <option v-for="item in years" :value="item.year_id">{{item.year_name}}</option>
                    </select>      
                    <i class="pu_i"></i>             
                </div>
                <div class="record_se">
                    <select class="pop_ulipt pop_ulipts" v-model="grade_id">
                        <option value="" selected>请选择班级</option>
                        <option v-for="item in grades" :value="item.grade_id">{{item.grade_name}}</option>
                    </select>      
                    <i class="pu_i"></i>             
                </div>
                <MyInput placeholder="授课教师" :data="sk_users" v-model="teacher_name" @enter="getUsers"></MyInput>
                <MyInput placeholder="管理教师" :data="gl_users" v-model="teacher_name" @enter="getUsers"></MyInput>
            </div>
        </div>
		<div class="cr_bg">
			<table class="set_tmtab port_mt0">
				<tr>
					<th>序号</th> 
					<th>学生姓名</th> 
					<th>性别</th> 
					<th>账号</th> 
					<th>科目</th>
					<th>开始时间</th> 
					<th>结束时间</th>
					<th>提分手册</th>
					<th>未掌握知识点</th>
                    <th>教学方案</th>
                    <th>我的教案</th>
					<!-- <th>周题错集</th>
					<th>周强化题集</th> -->
				</tr>
				<tbody>
					<tr v-for="(item, index) in users" :class="{'set_tmtab_trbg':item.orders%2==0}">
						<td v-if="!item.noassign" :rowspan="item.sub_count">{{item.orders}}</td>
						<td v-if="!item.noassign" :rowspan="item.sub_count">{{item.username}}</td>
						<td v-if="!item.noassign" :rowspan="item.sub_count">{{item.sex}}</td>
						<td v-if="!item.noassign" :rowspan="item.sub_count">{{item.code}}</td>
						<td>{{item.subject_name}}</td>
						<td>{{item.addtime}}</td>
						<td>{{item.endtime}}</td>
						<td class="set_tmtab_ltdg">
							<router-link :to="{name: 'Center', query: {grade_id: item.grade_id, uid: item.uid, subject_id: item.subject_id, username: item.username, current: 0}}">{{item.task_count}}</router-link>
						</td>
						<td class="set_tmtab_ltdg">
							<router-link :to="{name: 'Center', query: {grade_id: item.grade_id, uid: item.uid, subject_id: item.subject_id, username: item.username, current: 1}}">{{item.knowledge_count}}</router-link>
						</td>
                        <td class="set_tmtab_ltdg">
                            <a href="http://zujuan.zn1v1.com/MaterialAll">查看</a>
                        </td>
                        <td class="set_tmtab_ltdg">
                            <a :href="getPath(item.uid)">{{item.path_count}}</a>
                        </td>
						<!-- <td class="set_tmtab_ltdg">
							<router-link :to="{name: 'Center', query: {grade_id: item.grade_id, uid: item.uid, subject_id: item.subject_id, username: item.username, current: 2}}">{{item.wrong_count}}</router-link>
						</td>
						<td class="set_tmtab_ltdg">
							<router-link :to="{name: 'Center', query: {grade_id: item.grade_id, uid: item.uid, subject_id: item.subject_id, username: item.username, current: 3}}">{{item.wrong_count}}</router-link>
						</td> -->
					</tr>
				</tbody>
			</table>
		</div>
		<div id="page" v-show="count > limit"></div>
	</div>
</div>
</template>

<script>
import MyInput from '@/components/MyInput'
export default {
    name: 'Record',
    data() {
        return {
            letter: 0,
            letters: [],
            users: [],
            totalUsers: [],
            count: 0,//一共多少，用于判断分页是否显示
            limit: 0,//每页多少
            username: '',
            years: [],
            year_id: '',
            grades: [],
            grade_id: '',
            sk_users: [],
            //sk_username: '',//授课教师，应该合并
            gl_users: [],
            teacher_name: '',
        }
    },
    components: {
        MyInput,
    },
    activated() {
        if (!this.$route.meta.isBack) {
            this.getUsers()
            this.setLetters()
            this.getYears()
        }
        this.$route.meta.isBack = false
    },
    beforeRouteEnter (to, from, next) {
        if (from.name == 'Center')
            to.meta.isBack = true
        next()
    },
    watch: {
        letter(value) {
            if (value || value === 0) {//当名称搜索时，置空，全部时为0
                this.username = ''
                this.getUsers()
            }
        },
        username() {
            this.letter = ''
        },
        year_id() {
            this.getUsers()
        },
        grade_id() {
            this.getUsers()
        },
        '$store.state.area_id': function (value) {
            this.setLetters()
            this.getUsers()
            this.getYears()
        }
    },
    methods: {
    	getUsers(page = 1) {
            let data = {page: page}
            this.username && (data.username = this.username)
            this.letter && (data.letter = this.letter)
            this.year_id && (data.year_id = this.year_id)
            this.grade_id && (data.grade_id = this.grade_id)
            this.teacher_name && (data.teacher_name = this.teacher_name)
            this.$http.post('/getRecordList', data).then(res=>{
                this.users = res.data.data
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
                            _this.getUsers(obj.curr)
                        }
                    }
                })
            }).catch(res=>{})
        },
        getYears() {
            this.$http.post('/getYears').then(res=>{
                this.years = res.data.years
                this.grades = res.data.grades
                let sk_users = res.data.sk_users
                for (let item of sk_users) {
                    item.checked = false
                }
                this.sk_users = sk_users
                let gl_users = res.data.gl_users
                for (let item of gl_users) {
                    item.checked = false
                }
                this.gl_users = gl_users
            })
        },
        setLetters() {
            this.$http.post('/getRecordTotal').then(res=>{
                let users = res.data.users
                for (let item of users) {
                    item.checked = false
                }
                this.totalUsers = users
                this.letters = res.data.letters
            })
        	/*let arr = [];
        	for(var i = 65; i < 91; i++){
        		let item = {name: String.fromCharCode(i)}
		        arr.push(item);
		    }
		    this.letters = arr*/
        },
        getPath(uid) {
            return "http://zujuan.zn1v1.com/Material?uid=" + uid
        }
    },
}
</script>

<style>
</style>
