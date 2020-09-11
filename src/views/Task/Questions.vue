<template>
<div>
<!-- START -->
<div class="content">
    <div class="w1200 pt">
        <back></back>
        <Paper :questions="questions" :report="report" from="2"></Paper>
    </div>
</div>
<!-- END -->
</div>
</template>

<script>


import Paper from '@/components/Paper.vue'
export default {
    name: 'Questions',
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
        let uid = this.$route.query.uid
        let gid = this.$route.query.gid
        this.getRport(id, uid, gid)
    },
    components: {
        Paper,
    },
    methods: {
        getRport(id, uid, gid) {

            this.$http.post('/getQuestions', {id: id, uid: uid, grade_id: gid}).then(res=>{

                this.questions = res.data.questions
                this.report = res.data
                this.$nextTick( () => {
                    this.$func.setMath()
                })

            }).catch(res=>{})

        },
    },
}

</script>