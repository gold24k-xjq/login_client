<template>
<div>
    <div class="cr_tit">题目作答情况</div>
    
    <table class="cr_table_t" v-for="i in num">
        <tr style="background: #FAF8F9">
            <th>题号</th>
            <td v-for="(item, index) in questionPage[i]">{{item.orders}}</td>
        </tr> 
        <tr>
            <th>得分</th> 
            <td v-for="(item, index) in questionPage[i]">{{item.score}}</td>
        </tr>
    </table>
</div>
</template>

<script>
export default {
    name: 'PaperInfo',
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
    },
    watch: {
        questions(value) {
            this.num = Math.ceil(value.length / 20)
            let questionPage = []
            for (var i = 1; i <= this.num; i++) {
                questionPage[i] = value.slice((i-1)*20, i*20)
            }
            this.questionPage = questionPage
        },
    },
    methods: { 
    },
}
</script>