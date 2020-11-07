<template>
<div>
<!-- START -->
<div class="content">
    
        <div class="w1200 overflow cont_bg">
            <ul class="jz_t_ul fl">
                <li v-for="(item, index) in types" :class="{'on': curentComponent == item.component}" @click="curentComponent = item.component">{{item.name}}</li>
            </ul>
            <a href="javascript:;" @click="jump" class="fr jz_t_ulbtn">上传新作业</a>
        </div>
    
    <div class="w1200">
        <keep-alive><component :is="curentComponent"></component></keep-alive>
    </div>
</div>
<!-- END -->
</div>
</template>

<script>


const ClassList = () => import("./ClassList")
const StudentList = () => import("./StudentList")
export default {
    name: 'TaskList',
    data() {
        return {
            types: [
                {name: '学生', 'component': 'StudentList'},
                {name: '班级', 'component': 'ClassList'}
            ],
            curentComponent: 'StudentList',
        }
    },
    beforeRouteEnter(to, from, next) {
        if (from.name == 'GradeReport' || from.name == 'TaskReport' || from.name == 'Questions' || from.name == 'Center')
            to.meta.isBack = true
        next()
    },
    components: {
        ClassList,
        StudentList
    },
    methods: {
        jump() {
            let task_type = this.curentComponent == 'ClassList' ? 2 : 1
            this.$router.push({name: 'SubTask', params: {task_type: task_type}})
        },
    },
}

</script>