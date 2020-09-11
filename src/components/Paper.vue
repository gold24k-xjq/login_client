<template>
<div class="cr_bg">
    <div class="cr_tit">题目解析</div>
    <div class="cr_tana">
        <div class="cr_tana_t">
            <p class="fl">全部题目</p>
            <p class="fr cr_tana_tr">
                <span class="cr_tana_trf"><i></i>正确</span>
                <span class="cr_tana_trt"><i></i>错误</span>
                <span class="cr_tana_trtt"><i></i>半对</span>
            </p>
        </div>
        <ul class="cr_tanaul">
            <li :class="color(item.is_get)" v-for="item in questions"><!-- <a :href="'#'+item.question_id"> -->{{item.orders}}<!-- </a> --></li>
        </ul>
    </div>
    <div class="cr_talist">
        <div class="cr_talistt">
            <div class="fl mt">题目解析</div>
            <i class="cr_bgtiti" style="vertical-align: -12px;" @click="getPdf"></i>
            <ul class="fr cr_talistt_ul">
                <li :class="{'on': index == current}" v-for="(item, index) in types" @click="current = index">{{item}}</li>
            </ul>
        </div>
        <ul class="cr_talist_ul cr_talist_uln">
            <li :id="item.question_id" class="cr_talist_ulli" v-for="item in questions" v-show="question_show(item.is_get)">
                <div>
                    <p class="cr_talist_ullip">{{item.orders}}、<div class="cr_talist_ullitit" v-html="item.title"></div></p>
                </div>
                <ul class="cr_talist_uiu">
                    <li v-for="(answer, key) in item.answers">
                        <span class="wa_list_g wa_list_gg"></span>
                        <p>{{key}}、<div class="cr_talist_uiuf" v-html="answer"></div></p>
                    </li>
                </ul>
                <div class="cr_talist_uiug">正确答案：<div class="cr_talist_uiug_d" v-html="item.right_answer"></div></div>
                <div class="cr_talist_uiug">我的答案：<div class="cr_talist_uiug_d" :class="{'red': item.is_get == 0}" v-html="item.my_answer"></div></div>
                <div class="cr_talist_uiug">
                    <p>题目解析：</p>
                    <p v-html="item.parse||'暂无解析'"></p>
                    <!-- <p>{{item.parse}}</p> -->
                </div>
                <div class="cr_talist_uiug">知识点:{{item.knowledges}}</div>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    name: 'Paper',
    data() {
        return {
            current: 0,
            types: ['全部题目', '查看对题', '查看错题'],
        }
    },
    props: {
        questions: {
            type: [Array, Object]
        },
        report: {
            type: [Array, Object]
        },
        from: {
            type: [Number, String],
            default: 2
        }
    },
    methods: {
        getPdf() {
            let data
            if (this.from == 1)
                data = {id: this.report.id, school_id: this.report.school_id, name: this.report.name, username: this.report.username, from: 3}
            else
                data = {practice_id: this.report.practice_id, uid: this.report.uid, grade_id: this.report.grade_id, school_id: this.report.school_id, name: this.report.name, username: this.report.username, from: 4}
            this.$func.getPdf(data)
        },
        question_show($is_get) {
            if (this.current == 0) {
                return true;
            } else if (this.current == 1) {
                return $is_get === 1;
            } else if (this.current == 2) {
                return $is_get === 0 || $is_get === 2;
            }
        },
        color($is_get) {
            let classes
            switch($is_get) {
                case 0:
                classes = 'on'
                break;
                case 1:
                classes = ''
                break;
                case 2:
                classes = 'at'
                break;
                default:
                classes = 'on'
            }
            return classes
        }
    },
}
</script>