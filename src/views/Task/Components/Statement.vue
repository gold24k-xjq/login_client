<template>
<!-- START -->
<div class="cr_lr fr">
    <div class="cr_bg">
        <div class="cr_tit">提交统计</div>
        <div class="charts_box2">
            <div class="tjtj_list">
                <div class="tjtj_txt1 line1"><p class="numtxt1">{{origin.total}}</p><span>人</span></div>
                <div class="tjtjtxt2 line1">应交人数</div>
            </div>
            <div class="tjtj_list">
                <div class="chartsdiv chartsdiv2">
                    <div class="circle green" style="left:12px">
                        <div class="pie_left">
                            <div class="left"></div>
                        </div>
                        <div class="pie_right">
                            <div class="right"></div>
                        </div>
                        <div class="mask bgh"><span class="green font30">{{origin.count}}</span></div>
                    </div>
                </div>
                <div class="tjtjtxt2 line1">实交人数</div>
            </div>
            <div class="tjtj_list" style="margin-right: 0px;">
                <div class="chartsdiv chartsdiv2">
                    <div class="circle red" style="left:12px">
                        <div class="pie_left">
                            <div class="left"></div>
                        </div>
                        <div class="pie_right">
                            <div class="right"></div>
                        </div>
                        <div class="mask bgh"><span class="font30">{{origin.undone}}</span></div>
                    </div>
                </div>
                <div class="tjtjtxt2 line1">未交人数</div>
            </div>
        </div>
        <div class="crn_tit">
            <div class="cr_tit">人员统计</div>
        </div>
        <table class="kzb_tabel">
            <tr class="czb_tr">
                <td width="20%" class="bgfc">
                    已交：<span class="green">{{origin.count}}</span>人
                </td>
                <td width="80%" class="txtl">
                    <router-link :to="{name: 'TaskReport', query: {'pid': practice_id, 'uid': item.uid, 'gid': grade_id}}" v-for="item in users.done" :key="item.uid">
                        <p class="tjtj_name statistical">{{item.name}}</p>
                    </router-link>                        
                </td>
            </tr>
            <tr class="czb_tr">
                <td width="20%" class="bgfc">
                    未交：<span class="red">{{origin.undone}}</span>人
                </td>
                <td width="80%" class="txtl">
                    <p class="tjtj_name" v-for="item in users.undone">{{item.name}}</p>                     
                </td>
            </tr>
        </table>
    </div>
</div>
<!-- END -->
</template>

<script>


export default {
    name: 'Statement',
    data() {
        return {
            practice_id: '',
            grade_id: '',
            users: []
        }
    },
    props: {
        origin: {
            type: [Array, Object]
        }
    },
    created() {
        let practice_id = this.$route.query.practice_id
        let grade_id = this.$route.query.grade_id
        this.practice_id = practice_id
        this.grade_id = grade_id
        this.getUsers()
    },
    methods: {
        getUsers() {
            this.$http.post('/getGradeReportState', {practice_id: this.practice_id, grade_id: this.grade_id, subject_id: this.origin.subject_id}).then(res=>{
                this.users = res.data
            }).catch(res=>{})
        },
    },
}
</script>