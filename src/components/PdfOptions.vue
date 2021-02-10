<template>
<!-- 导出打印弹窗 -->
<div class="port_up" id="add" v-show="show">
    <h1 class="port_up_h1">{{title}}</h1>
    <div class="port_up_m">
        <div>下载范围：</div>
        <ul>
            <li v-for="item in pdfs" @click="item.checked = !item.checked">
                <div :class="[{'on': item.checked}, myclass(item.index)]"></div>
                <p><i :class="[{'at': item.checked}]"></i>{{item.name}}</p>
            </li>
        </ul>
    </div>
    <button class="port_up_btn" @click="getPdf">下载</button>
</div>
</template>

<script>
export default {
    name: 'PdfOptions',
    data() {
        return {
            show: false,
            pdfs: [
                {index: 1, name: '封面', checked: true},
                {index: 2, name: '报告', checked: true},
                {index: 3, name: '错题及变式练习', checked: true},
                //{index: 4, name: '学生作答', checked: true},
                {index: 5, name: '参考答案', checked: true},
            ],
        }
    },
    props: { 
        from: {
            type: [Number, String],
            default: 7//7提分手册10试卷分析1没用了
        },
        title: {
            type: String,
        }
    },
    watch: {
        from: {
            immediate:true,
            handler: function(value) {
                if (value == 7) {
                    this.pdfs.splice(2, 0, {index: 4, name: '学生作答', checked: true})
                    this.pdfs.push({index: 6, name: '未掌握知识点', checked: false})
                }
            }
        },
    },
    methods: {
        getPdf() {
            let options = []
            for(let i of this.pdfs) {
                i.checked && (options.push(i.index))
            }
            options = options.join()
            let item = this.item

            let data = {}
            if (this.from == 7)
                data = {practice_id: item.practice_id, uid: item.uid, grade_id: item.grade_id, school_id: item.school_id, name: item.name, username: item.name, from: this.from, options: options}
            else if (this.from == 1)
                data = {id: item.id, school_id: item.school_id, name: item.name, username: item.username, from: this.from, options: options}
            else if (this.from == 10)
                data = {id: item.id, username: item.username, from: this.from, options: options}
            this.$func.getPdf(data)
        },
        pdfOption(item) {
            this.show = true
            this.item = item
            /*this.pdfs.forEach(item => {
                item.checked = true
            })*/
            this.$func.open("add", false, ["1000px", "500px"]).then((index, dom)=> {
                this.index = index
            })
        },
        myclass(index) {
            this.from == 10 && index == 1 && (index = 10)
            return 'port_up_m_bg'+index
        }
    },
}
</script>