<template>
<div>
<!-- START -->
<div id="kp">
    <div class="test_cf_cont">
        <div class="test know_p_t">
            <div class="test_r_select">
                <select v-model="year_id">
                    <option value="">请选择年级</option>
                    <option v-for="item in exam.years" :key="item.year_id" :value="item.year_id">{{item.year_name}}</option>
                </select>
            </div>
            <div class="test_r_select">
                <select v-model="textbook_id">
                    <option value="">选择教材</option>
                    <option v-for="item in exam.books" v-show="item.year_id == year_id" :key="item.textbook_id" :value="item.textbook_id">{{item.textbook_name}}</option>
                </select>
            </div>
            <div class="test_r_select">
                <select v-model="chapter_id">
                    <option value="">选择-章</option>
                    <option v-for="item in exam.chapters" v-show="item.textbook_id == textbook_id" :key="item.chapter_id" :value="item.chapter_id">{{item.chapter_name}}</option>
                </select>
            </div>
        </div>
        <div class="know_mb">
            <h1 class="know_h1">已选择系统知识点</h1>
            <div class="know_ul">
                <div class="know_ul_div" v-for="(item, index) in knowledges" :key="index">{{item.name}}<i @click="removek(item.kids)">×</i></div>
            </div>
        </div>
        <div class="know_mb">
            <h1 class="know_h1">选择知识点</h1>
            <div class="know_ul">
                <div v-for="(item, index) in exam.knowledges" v-show="item.chapter_id === chapter_id">
                    <label :for="index" class="d_cb know_ul_label" :title="item.knowledge_name" :key="index">
                        {{item.knowledge_name}}
                        <input :id="index" type="checkbox" :value="item.knowledge_id" :data-name="item.knowledge_name" :data-book_id="item.textbook_id" v-model="knowledge_ids" @click="savek" :ref="item.knowledge_id"> 
                        <span></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END -->
</div>
</template>

<script>
export default {
    data () {
        return {
            year_id: '',
            textbook_id: '',
            chapter_id: '',
            knowledge_ids: [],
            knowledges: [],
        }
    },
    props: {
        k_show: {
            type: Boolean
        },
        exam: {
            type: [Array, Object]
        },
        ck_knowledges: {
            type: [Array, Object]
        },
        ck_kids: {
            type: [Number, String]
        },
    },
    watch: {
        k_show(value) {
            let title = `${this.exam.name} - ${this.exam.year_name}（${this.exam.subject_name}）- 知识点`
            if (value) {
                this.chapter_id = ''
                this.knowledge_ids = []
                this.$func.eject("kp", title, ['80%', '600px']).then((index, dom)=> {
                    this.lay_index = index
                    this.submit()
                }).catch(res => {
                    this.$emit('update:k_show', false)
                })
            }
        },
        year_id(value) {
            this.textbook_id = ''
            this.chapter_id = ''
        },
        textbook_id(value) {
            this.chapter_id = ''
        },
        ck_knowledges(value) {
            this.knowledges = value
        },
        ck_kids(value) {
            this.knowledge_ids = value.split(',')
        },
    },
    methods: {
        savek($e) {
            let target = $e.target
            if (this.knowledges.length >= 5 && target.checked) {
                $e.preventDefault()
                this.$func.error('知识点过多')
                return
            }

            let knowledge = {}
            knowledge.name = target.dataset.name
            knowledge.book_id = target.dataset.book_id
            knowledge.kids = target.value
            if (target.checked) {
                this.knowledges.push(knowledge)
            } else {
                this.doremove(knowledge.kids)
            }
        },
        removek(kids) {
            this.$refs[`${kids}`][0].checked = false
            this.doremove(kids)
        },
        doremove(kids) {
            for (let i in this.knowledges) {
                this.knowledges[i]['kids'] == kids && this.knowledges.splice(i, 1)
            }
        },
        submit() {
            if (this.knowledges.length == 0) {
                this.$func.error('请选择知识点')
                return
            }
            this.$emit('getkids', this.knowledge_ids.join())
            this.$emit('getknowledges', this.knowledges)
            this.$emit('update:k_show', false)
            layer.close(this.lay_index)
        },
    },
}
</script>

<style>
</style>
