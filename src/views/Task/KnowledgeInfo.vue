<template>
<!-- START -->
<div class="cr_lr  fr">
    <div class="cr_bg">
        <div class="cr_tit">知识点详情</div>
        <table class="cr_table  crd_table">
            <tr>
                <th>知识点</th>  
                <th>题目信息</th>  
                <th>正确数量</th>  
                <th>错误数量</th>  
                <th>掌握率</th>  
                <th>知识点已掌握人数</th>
                <th>知识点未掌握人数</th>  
                <th  class="number">
                    掌握率
                    <span>
                        <i  style="color:  #999;">↑</i><i  style="color:  #999;">↓</i>
                        </span>
                </th>
            </tr>  
            <tbody>
                <tr>
                    <td>浮力大小的计算</td>  
                    <td>1,2,3</td>  
                    <td>2</td>  
                    <td>1</td>  
                    <td>66.67</td>  
                    <td>0</td>  
                    <td>1</td>  
                    <td  class="cr_t_lc">0.00%</td>  
                </tr>
                <tr>
                    <td>浮力大小的计算</td>
                    <td>1,2,3</td>  
                    <td>2</td>  
                    <td>1</td>  
                    <td>66.67</td>  
                    <td>0</td>  
                    <td>1</td>  
                    <td  class="cr_t_lc">0.00%</td>  
                </tr>
            </tbody>
        </table>
    </div>
</div>
<!-- END -->
</template>

<script>


export default {
    name: 'KnowledgeInfo',
    data() {
        return {
            
        }
    },
    created() {

        console.log('知识点详情加载了！！！')

    },
}
</script>