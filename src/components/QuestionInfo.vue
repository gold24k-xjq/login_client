<template>
<div class="cr_bg">
    <a name="questions" class="anmao"></a>
    <div class="cr_tit">题目作答情况<!-- <div class="fr" style="color: #1aa97b;cursor: pointer;" v-if="from == 2" @click="$parent.getPdf">查看学生作答</div> --></div>
    
    <table class="cr_table_t" v-for="i in num">
        <tr>
            <th>题号</th>
            <td v-for="item in questionPage[i]">{{item.orders}}</td>
        </tr> 
        <tr>
            <th>标准答案</th> 
            <td v-for="item in questionPage[i]">{{item.right_answer}}</td>
        </tr>
        <tr>
            <th>我的答案</th> 
            <td v-for="item in questionPage[i]">{{item.my_answer}}</td>
        </tr>
        <tr>
            <th>是否正确</th>  
            <td v-for="item in questionPage[i]">{{item.is_get == 1 ? '√' : '×'}}</td>
        </tr>
    </table>

    <div class="a_list_mt" v-if="from == 2">
        <div class="a_list" v-for="item in paper">
            <div class="a_list_d">{{item.orders}}.<div class="dis_inline" v-html="item.title"></div></div>
            <img class="a_list_img" :src="getImg(item.is_get)" />
            <ul class="a_choose">
                <li v-for="answer in item.answers">
                    <span class="fl">{{answer.order}}.</span>
                    <div class="fl a_choose_lid" v-html="answer.answer"></div>
                </li>
            </ul>
            <div class="a_anw" v-if="item.is_zhu == 1" v-html="item.my_answer"></div>
        </div>
    </div>

    <div v-if="from == 3">
        <div class="j-title cr_t_titw">这些题目你做错了</div>
        <div class="cr_lmt" v-for="item in questions" v-if="item.is_get == 0">
            <div>{{item.orders}}.<div class="dis_inline" v-html="item.title"></div></div>
            <ul class="a_choose">
                <li v-for="answer in item.answers">
                    <span class="fl">{{answer.order}}.</span>
                    <div class="fl a_choose_lid" v-html="answer.answer"></div>
                </li>
            </ul>
            <div class="wq_b wq_b_img"><span>【我的答案】</span><div class="wq_bib" v-html="item.my_answer"></div></div>
            <div class="wq_b wq_b_img"><span>【参考答案】</span><div class="wq_bib" v-html="item.right_answer"></div></div>
            <div class="wq_b wq_b_img"><span>【知识点】</span><div class="wq_bib" v-html="item.knowledges"></div></div>
        </div>
        <div class="j-title checked">这些题目你做对了</div>
        <div class="cr_lmt" v-for="item in questions" v-if="item.is_get == 1">
            <div>{{item.orders}}.<div class="dis_inline" v-html="item.title"></div></div>
            <ul class="a_choose">
                <li v-for="answer in item.answers">
                    <span class="fl">{{answer.order}}.</span>
                    <div class="fl a_choose_lid" v-html="answer.answer"></div>
                </li>
            </ul>
            <div class="wq_b wq_b_img"><span>【我的答案】</span><div class="wq_bib" v-html="item.my_answer"></div></div>
            <div class="wq_b wq_b_img"><span>【参考答案】</span><div class="wq_bib" v-html="item.right_answer"></div></div>
            <div class="wq_b wq_b_img"><span>【知识点】</span><div class="wq_bib" v-html="item.knowledges"></div></div>
        </div>
    </div>
    

</div>
</template>

<script>
export default {
    name: 'QuestionInfo',
    data() {
        return {
            num: '',
            questionPage: [],
        }
    },
    props: {
        questions: {
            type: [Array, Object]
        },
        paper: {
            type: [Array, Object]
        },
        from: {
            type: [String, Number],
            default: 1
        }
    },
    watch: {
        questions() {
            this.num = Math.ceil(this.questions.length / 20)
            let questionPage = []
            for (var i = 1; i <= this.num; i++) {
                questionPage[i] = this.questions.slice((i-1)*20, i*20)
            }
            this.questionPage = questionPage
        },
    },
    methods: {
        getImg(is_get) {
            let path = ''
            switch(is_get) {
                case 0:
                path = require("@/assets/images/cuo.png")
                break;
                case 1:
                path = require("@/assets/images/dui.png")
                break;
                case 2:
                path = require("@/assets/images/bd.png")
                break;
            }
            return path
        },
    },
}
</script>