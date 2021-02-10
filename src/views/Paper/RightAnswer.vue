<template>
<div>
    <div id="right_answer">
        <div class="at_cont">
            <table class="at_cont_table">
                <tr>
                    <th>题目序号</th>
                    <th>题目类型</th>
                    <th>正确答案</th>
                </tr>
                <tr v-for="(item, index) in questions" :key="index">
                    <td>{{item.order}}</td>
                    <td>{{item.qtype_name}}</td>
                    <td class="at_td_tl">
                        <label :for="index+'-'+aindex" class="d_cb test_label" v-for="(answer, aindex) in item.answers" :key="aindex">
                            {{answer}}
                            <input :id="index+'-'+aindex" :name="index" :type="item.type" :value="answer" v-model="item.myanswer">
                            <span></span>
                        </label>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'RightAnswer',
    data () {
        return {
            s: [],
            questions: [],
        }
    },
    props: {
        answer_show: {
            type: Boolean
        },
        exam: {
            type: [Array, Object]
        },
    },
    watch: {
        answer_show(value) {
            let title = `${this.exam.name} - ${this.exam.year_name}（${this.exam.subject_name}）- 标准答案`
            if (value) {
                this.$func.eject("right_answer", title, ['80%', '600px']).then((index, dom)=> {
                    this.lay_index = index
                    this.submit()
                }).catch(res => {
                    this.$emit('update:answer_show', false)
                })
            }
        },
        exam() {
            this.getContent()
        },
    },
    methods: {
        getContent() {
            this.$http.post('/getPaperAnswers', {id: this.exam.id}).then(res=>{
                this.questions = res.data
            })
        },
        submit() {
            let answers = []
            let alldone = true

            this.questions.forEach(item => {
                let myanswer = item.ismultichoice == 1 ? item.myanswer.join('') : item.myanswer
                answers.push(myanswer)
                !item.myanswer && (alldone = false)
            })
            answers = answers.join()

            if (!alldone) {
                this.$func.error('请全部勾选')
                return
            }
            this.$http.post('/savePaperAnswers', {id: this.exam.id, answers: answers}).then(res=>{
                this.$func.success(res.msg)
                this.$emit('update:answer_show', false)
                layer.close(this.lay_index)
            })
        },
    },
}
</script>
<style scoped="scoped">

</style>
