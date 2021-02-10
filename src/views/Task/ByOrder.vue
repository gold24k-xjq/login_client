<template>
<div>
    <div class="task_oa">
        <div v-for="(item, index) in answers" class="task_oal">
            <div class="task_orders" :class="{'on': (item.subjective == 1 && (item.myanswer != item.answer)) || (item.subjective == 2 && item.myanswer == 2)}" @click="checkOrder(item, index, uid)">{{item.orders}}</div>
            <div class="task_oalb">
                <div class="saw_list_b">
                    <div class="saw_list_bb">
                        <div class="ib_lc" v-if="item.subjective == 1 && cur_order == (item.orders+uid) && item.myanswer != item.answer">
                            <div><i>标准答案：{{item.answer}}</i> </div>
                            <i>学生答案：</i>
                            <span v-for="option in item.options" :class="{'no': item.myanswer.indexOf(option) >= 0 && item.myanswer != item.answer}" @click="saveMyAnswer(item, index, option)">{{option}}</span>
                        </div>
                    </div>
                </div>
                <div class="saw_list_b" v-show="item.subjective == 2 && item.myanswer == 2 && is_access == 1 && cur_order == (item.orders+uid)">
                    <div class="saw_list_bb" v-if="item.knowledges.length > 1">
                        <span class="saw_list_bb_s">未掌握知识点：</span>
                        <div class="saw_list_bb_df saw_list_bb_df_ml">
                            <div v-for="(knowledge, index1) in item.knowledges" class="know_ul_div" :class="{'know_ul_div_g': !knowledge.checked}" @click="checked(item, knowledge.id)">{{knowledge.name}}</div>
                        </div>
                    </div>
                    <div class="saw_list_bb">
                        <span class="saw_list_bb_s">错因：</span>
                        <div class="saw_list_bb_df saw_list_bb_df_la">
                            <label :for="index + '-w' + index1 + uid" :name="uid+item.orders|why" class="d_cb" v-for="(reason, index1) in reasons"> 
                                {{reason}}
                                <input :id="index + '-w' + index1 + uid" type="checkbox" :value="index1" v-model="item.reason_ids"> 
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <textarea class="saw_list_bt" maxlength="50" v-model="item.parse" v-show="item.reason_ids.indexOf(last_reason) != -1"></textarea>
                    <div class="sub_tp_btn_s" v-if="type == 2">
                        <button class="sub_tp_btn" @click="showImg()">上传作答</button>
                        <div class="saw_list_bb saw_list_bbg" v-if="item.paths.length" @click="showView(uid+item.orders)">查看作答</div> 
                    </div>
                    <div class="saw_list_bb saw_list_bbg" v-else-if="item.paths.length" @click="showView(uid+item.orders)">查看作答</div>
                    <div :ref="uid+item.orders" v-viewer>
                        <div v-for="item in item.paths">
                            <img :src="item" style="display: none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>               
    </div>
    <div class="sub_wl">
        <div>错题记录：</div>
        <div v-for="(item, index) in answers">
            <div v-if="item.subjective == 1 && item.myanswer != item.answer">
                <div class="subt_cc">
                    <span class="subt_c subt_cw">第{{item.orders}}题：</span>
                    <span class="subt_c">学生选项：{{item.myanswer}}</span>
                    <span class="subt_c">正确选项：{{item.answer}}</span>
                </div>
            </div>
            <div v-if="item.subjective == 2 && item.myanswer != 1">
                <div class="subt_kk">
                    <div class="subt_cw">第{{item.orders}}题：</div>
                    <div>
                        <div class="subt_k">未掌握知识点：
                            <div class="subt_k_cr" v-for="(knowledge, index1) in item.knowledges" v-if="knowledge.checked">{{knowledge.name}}</div>
                        </div>
                        <div class="subt_k">错因：
                            <div v-for="(reason, rindex) in reasons" v-show="item.reason_ids.indexOf(rindex) != -1">{{reason}}</div> 
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'MyInput',
    data() {
        return {
            reasons: ['知识点未掌握', '概念模糊', '审题错误', '运算错误', '思路错误', '其他'],//应该在后台返回
            cur_order: '',//记录当前题号
        }
    },
    props: {
        answers: {
            type: [Array, Object]
        },
        uid: {
            type: [Number, String],
            default: ''
        },
        is_access: {
            type: [Number, String],
            default: 0
        },
        type: {
            type: [Number, String],
            default: 1
        }
    },
    computed: {
        last_reason() {
            return this.reasons.length - 1
        }
    },
    filters: {
        parse(value) {
            return 'parse' + value
        },
        know(value) {
            return 'know' + value
        },
        why(value) {
            return 'why' + value
        },
    },
    methods: {
        checkOrder(item, index, uid = '') {//应该清空主观题所选的知识点及错因
            let status
            if (item.subjective == 1) {
                status = item.myanswer == item.answer ? "" : item.answer
            } else {
                status = item.myanswer == 1 ? 2 : 1
            }
            item.myanswer = status
            //this.myanswers.splice(index, 1, status)
            this.cur_order = item.orders + uid
            //this.$emit('getAnswers', this.answers)
        },
        saveMyAnswer(item, index, option) {
            let myanswer = item.myanswer
            if (item.ismultichoice == 1) {
                myanswer = myanswer.indexOf(option) != -1 ? myanswer.replace(option, '') : this.$func.string_order(myanswer+option)
            } else {
                myanswer = option
            }
            item.myanswer = myanswer
            //this.myanswers.splice(index, 1, myanswer)
            if (myanswer == item.answer) {
                this.$func.error(`${myanswer}为正确选项`)
            } else {
                this.$func.success(`已选${myanswer}`)
            }
            //this.$emit('getAnswers', this.answers)
        },
        checked(item, kid) {
            let checked = item.knowledges.filter( f => f.checked)
            item.knowledges.forEach((value) => {
                if (value.checked) {
                    if (value.id == kid) {
                        if (checked.length >= 2) {
                            value.checked = !value.checked
                        } else {
                            this.$func.error('至少保留一个知识点')
                        }
                    }
                } else {
                    value.id == kid && (value.checked = !value.checked)
                }
            })
        },
        showView(orders) {
            const viewer = this.$refs[`${orders}`][0].$viewer
            viewer.show()
        },
        showImg() {
            this.$parent.imgshow = true
            this.$parent.cur_uid = this.uid
            this.$parent.cur_answers = this.answers
        },
    },
}
</script>