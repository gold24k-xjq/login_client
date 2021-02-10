<template>
    <div class="cr_bg" id="editexam">
        <div class="test">
            <label class="test_l mt6">试卷类型</label>
            <div class="test_r">
                <label for="s1" class="d_cb test_label"> 
                    详版
                    <input id="s1" type="radio" name="paper_type" value="1" v-model="paper_type"> 
                    <span></span>
                </label>
                <label for="s2" class="d_cb test_label"> 
                    简版
                    <input id="s2" type="radio" name="paper_type" value="2" v-model="paper_type"> 
                    <span></span>
                </label>
            </div>
        </div>
        <div class="test" v-if="type !== 2">
            <label class="test_l mt6">考试名称</label>
            <div class="test_r">
                <input class="test_r_int" type="text" v-model="name" />
            </div>
        </div>
        <div class="test" v-if="type !== 1">
            <label class="test_l">年级科目</label>
            <div class="test_r">
                <div class="test_rr" v-for="(item, index1) in years" :key="item.year_id">
                    <span class="test_rr_sp">{{item.year_name}}</span>
                    <div class="test_rr_label">
                        <label :for="index1+'-'+index2" class="d_cb test_label" v-for="(sub, index2) in item.subjects" :key="sub.subject_id"> 
                            {{sub.subject_name}} 
                            <input :id="index1+'-'+index2" type="checkbox" :value="item.year_id+'-'+sub.subject_id+'-'+sub.subject_name+'-'+item.year_name" v-model="checked"> 
                            <span></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddExam',
    data() {
        return {
            years: [],
            checked: [],
            name: '',
            paper_type: 1,
        }
    },
    props: {
        edit_show: {
            type: Boolean,
            default: false
        },
        type: {
            type: [Number, String],
            default: 0
        },
        exam_id: {
            type: [Number, String],
        },
        exam_name: {
            type: String,
        },
    },
    watch: {
        edit_show(value) {
            this.checked = []
            this.name = this.exam_name || ''
            if (value) {
                this.type != 1 && this.getSubjects()
                this.$func.eject("editexam", '发起考试', ['800px', '600px']).then((index, dom)=> {
                    this.lay_index = index
                    this.submit()
                }).catch(res => {
                    this.$emit('update:edit_show', false)
                })
            }
        },
        exam_name(value) {
            this.name = value
        }
    },
    methods: {
        getSubjects() {
            this.$http.post('/getExamSubjects').then(res=>{
                this.years = res.data
            })
        },
        submit() {
            if (this.type == 1) {
                if (this.name == this.exam_name) {
                    this.$func.error('未做改变')
                    return
                }
                if (!this.name) {
                    this.$func.error('请输入考试名称')
                    return
                }
                this.$http.post('/editPaper', {id: this.exam_id, name: this.name, paper_type: this.paper_type,}).then(res=>{
                    this.$func.success(res.msg)
                    this.$emit('refresh', true)
                    this.closePop()
                })
            } else if (this.type == 2) {

                if (!this.checked.length) {
                    this.$func.error('请选择科目')
                    return
                }

                let data = {
                    paper_type: this.paper_type,
                    info: this.checked,
                    exam_id: this.exam_id,
                    name: this.name
                }
                this.$http.post('/addPaperSubject', data).then(res=>{
                    this.$func.success(res.msg)
                    this.$emit('refresh', true)
                    this.closePop()
                }).catch(res=> {
                    
                })
            } else {

                if (!this.name) {
                    this.$func.error('请输入考试名称')
                    return
                }

                let data = {
                    paper_type: this.paper_type,
                    info: this.checked,
                    name: this.name
                }
                this.$http.post('/addPaper', data).then(res=>{
                    this.$func.success(res.msg)
                    this.$emit('refresh', true)
                    this.closePop()
                })
            }
        },
        closePop() {
            this.$emit('update:edit_show', false)
            layer.close(this.lay_index)
        },
    }
}
</script>
