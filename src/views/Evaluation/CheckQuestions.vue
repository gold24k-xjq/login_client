<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200 pt">
        <back></back>
        <Paper :questions="questions" :report="report" from="1"></Paper>
    </div>
</div>
<!-- END -->
</div>
</template>

<script>


import Paper from '@/components/Paper.vue'
export default {
    name: 'CheckQuestions',
    data() {
        return {
            current: 0,
            types: ['全部题目', '查看对题', '查看错题'],
            questions: [],
            report: [],//为了下载pdf
        }
    },
    created() {
        let id = this.$route.query.id
        this.getRport(id)

        let _this = this
        this.page = 0
        //this.xx = setInterval(_this.xjq, 30000)
        //this.xjq()
    },
    components: {
        Paper,
    },
    methods: {
        getRport(id) {

            this.$http.post('/getCheckQuestions', {id: id}).then(res=>{

                this.questions = res.data.questions
                this.report = res.data
                this.$nextTick( () => {
                    this.$func.setMath()
                })

            }).catch(res=>{})

        },
        xjq() {
            this.page ++
            this.$http.post('/test', {page: this.page}).then(res=>{
                console.log(res.msg)
            }).catch(res=>{
                console.log(res.data)
                /*if (res.data.code == 600)
                clearInterval(this.xx)*/
            })
        },
    },
}

</script>