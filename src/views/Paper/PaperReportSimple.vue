<template>
<div class="content">
	<div class="w1200 pt">
		<back></back>
		<div class="cr_nb">
			<div class="cr_nb_bg">
				<div class="cr_tit">总览<!-- <button class="fr cr_tit_btn">导出</button> --></div>
				<p class="ea_p">{{report.username}}同学你好，本次报告来自考试《{{report.name}}》，本次共有{{report.q_count - report.rq_count}}道错题（共{{report.q_count}}题），得分{{report.score}}分（满分{{report.score_total}}分），继续加油吧。</p>
				<table class="ea_tab">
					<tr>
						<th>姓名</th>
						<th>手机号</th>
						<th>学科</th>
						<th>试题数量</th>
						<th>正确数</th>
						<th>错误数</th>
						<th>知识点数量</th>
					</tr>
					<tr v-if="report">
						<td>{{report.username}}</td>
						<td v-if="report.user">{{report.user.phone}}</td>
						<td>{{report.subject_name}}</td>
						<td>{{report.q_count}}</td>
						<td v-if="report.question_get">{{report.question_get[1]}}</td>
						<td v-if="report.question_get">{{report.question_get[2]}}</td>
						<td>{{report.k_count}}</td>
					</tr>
				</table>
			</div>
			<div class="cr_nb_bg"><PaperInfo :questions="report.questions"></PaperInfo></div>
			<div class="cr_nb_bg">
				<div class="cr_tit">知识点掌握情况</div>
				<table class="ea_grtab">
					<tr>
						<th>序号</th>
						<th>知识点</th>
						<th>是否掌握</th>
					</tr>
					<tr v-for="(item, index) in report.knowledges">
						<td>{{index + 1}}</td>
						<td>{{item.knowledge_name}}</td>
						<td>
							{{item.is_get == 1 ? '是' : '否'}}
						</td>
					</tr>
				</table>
			</div>
			<div class="cr_nb_bg">
				<div class="cr_tit">小结</div>
				<p class="ea_kp">{{report.comment}}</p>
			</div>
		</div>
	</div>
</div>
</template>

<script>

const PaperInfo = () => import("@/components/PaperInfo")
export default {
	data () {
		return {
			report: [],
			streng_knowledges: [],
		}
	},
	components: {
		PaperInfo,
	},
	created() {
		this.id = this.$route.query.id
		this.getReport()
	},
	methods:{
		getReport() {
			 this.$http.post('/getPaperReport', {id: this.id}).then(res=>{
                this.report = res.data
            }).catch(res=>{})
		},
		bdcolors(index) {
			let color = this.colors[index]
			let style = `2px solid ${color}`
			return {border: style}
		},
	}
}
</script>