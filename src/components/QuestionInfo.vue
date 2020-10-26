<template>
<div class="cr_bg">
    <div class="cr_tit">题目作答情况<div class="fr" style="color: #1aa97b;cursor: pointer;" v-if="from == 2" @click="$parent.getPdf">查看学生作答</div></div>
    
    <table class="cr_table_t" v-for="i in num">
        <tr>
            <th>题号</th>
            <td v-for="item in questionPage[i]">{{item.orders}}</td>
        </tr> 
        <tr>
            <th>标准答案</th> 
            <td v-for="item in questionPage[i]">{{item.right_answer}}</td>
        </tr>
        <tr>
            <th>我的答案</th> 
            <td v-for="item in questionPage[i]">{{item.my_answer}}</td>
        </tr>
        <tr>
            <th>是否正确</th>  
            <td v-for="item in questionPage[i]">{{item.is_get == 1 ? '√' : '×'}}</td>
        </tr>
    </table>
</div>
</template>

<script>
export default {
    name: 'QuestionInfo',
    data() {
        return {
            num: '',
            questionPage: [],
        }
    },
    props: {
        questions: {
            type: [Array, Object]
        },
        from: {
            type: [String, Number],
            default: 1
        }
    },
    watch: {
        questions() {
            this.num = Math.ceil(this.questions.length / 20)
            let questionPage = []
            for (var i = 1; i <= this.num; i++) {
                questionPage[i] = this.questions.slice((i-1)*20, i*20)
            }
            this.questionPage = questionPage
        },
    },
    methods: {
        
    },
}
</script>