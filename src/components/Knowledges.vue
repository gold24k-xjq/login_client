<template>
<div class="cr_bg">
    <a name="knowledges" class="anmao"></a>
    <div class="cr_tit">知识点掌握情况</div>
    <table class="cr_table cr_tablekg">
        <tr>
            <th>序号</th>
            <th>知识点</th> 
            <!-- <th>关联题目</th>  -->
            <th width="10%" v-if="from == 1">是否掌握</th>
            <th width="10%" v-else>掌握率</th> 
        </tr> 
        <tbody>
            <tr v-for="(item, index) in knowledges">
                <td>{{index + 1}}</td>
                <td :class="item.true == 1 ? 'cr_t_tit' : 'cr_t_titw'" v-html="item.name"></td> 
                <!-- <td class="cr_t_img">{{item.orders}}</td>  -->
                <td :class="item.true == 1 ? 'cr_t_tit' : 'cr_t_titw'" v-if="from == 1">{{item.true == 1 ? '是' : '否'}}</td> 
                <td :class="item.true == 1 ? 'cr_t_tit' : 'cr_t_titw'" v-else>{{item.correct}}</td> 
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
export default {
    name: 'Knowledges',
    data() {
        return {
            
        }
    },
    props: {
        knowledges: {
            type: [Array, Object]
        },
        from: {
            type: [String, Number],
            default: 1
        }
    },
    methods: {
        
    },
}
</script>