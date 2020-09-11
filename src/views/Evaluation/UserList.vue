<template>
	<div class="content">
	    <div class="w1200">
			<div class="cr_bg">
				<div class="checkl_ipt">
					<div class="crn_tittr ml">
						<div class="zql_emm">
							<input type="text" placeholder="请输入姓名或手机号" class="ipt" v-model="field" @keyup.enter="search">
						</div>
						<button class="set_tmrb" @click="search">搜索</button>
						<button class="set_tmrb" @click="download">导出全部</button>
					</div>
				</div>
				<table class="set_tmtab">
					<tr>
						<th>序号</th> 
						<th>姓名</th> 
						<th>科目</th> 
						<th>年级</th> 
						<th>手机号</th> 
						<th>测评日期</th> 
						<th>状态<!-- <i class="cr_izql"></i><i class="cr_izql1"></i> --></th> 
					</tr> 
					<tbody>
						<tr v-for="item in users">
							<td>{{item.orders}}</td> 
							<td>{{item.username}}</td> 
							<td>{{item.subject}}</td> 
							<td>{{item.year_name}}</td> 
							<td>{{item.phone}}</td>
							<td>{{item.addtime}}</td> 
							<td>{{item.type}}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div id="page" v-show="count > limit"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'UserList',
	data() {
		return {
			field: '',
			count: 0,//一共多少，用于判断分页是否显示
            limit: 0,//每页多少
			users: [],
		}
	},
	created() {
        this.getUsers()
    },
    methods: {
    	getUsers(page = 1) {
            let data = {page: page}
            this.sphone && (data.phone = this.sphone)
            this.susername && (data.username = this.susername)
            this.$http.post('/getUserList', data).then(res=>{
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
        search() {
            if (this.$func.isPhone(this.field)) {
                this.sphone = this.field
                this.susername = ''
            } else {
                this.susername = this.field
                this.sphone = ''
            }
            this.getUsers()
        },
        download() {
            this.$http.post('/export').then(res=>{
                this.$func.downloads(res.data)
            }).catch(res=>{})
        },
    },
}
</script>
