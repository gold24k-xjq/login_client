<template>
<div>
    <div class="record_pr"> 
        <input type="text" :placeholder="placeholder" class="subanw_input" :class="{'subanw_p_in': isActive}" v-model="code" @focus="focus" @blur="blurs" @keyup.enter="enter" @keyup.down="down" @keyup.up="up" @input="$emit('input', $event.target.value)">
        <div class="subanw_p" v-show="isActive">
            <p v-for="item in users" @click="selected(item.username)" :class="{'checked': item.checked}">{{item.username}}</p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'MyInput',
    data() {
        return {
            isActive: false,//输入框焦点
            index: -1,//高亮选中
            code: '',
            users: []
        }
    },
    props: {
        placeholder: {
            type: String,
            default: "请输入学生姓名或学号"
        },
        data: {//需要联想的数据，注意username需一致
            type: [Array, Object]
        },
        value: {//为了v-model
            type: [Number, String]
        }
    },
    watch: {
        code(value) {
            this.users = this.data.filter( f => f.username.indexOf(value) != -1 )
        },
        data(value) {
            this.users = value
        },
    },
    methods: {
        focus() {
            this.saveChecked('')
            this.isActive = true
        },
        blurs() {
            let _this = this
            setTimeout(function(){//定时可以让焦点和点击事件同时执行
                _this.isActive = false
            }, 250)
        },
        selected(name) {//有时间加上键盘事件
            this.saveChecked(name)
            this.$emit('enter')
            this.isActive = false
        },
        enter() {
            this.saveChecked(this.checked_name)
            this.$emit('enter')
        },
        saveChecked(name) {
            this.code = name
            this.$emit('input', name)//传递给父组件
        },
        down() {
            if (this.index < this.users.length - 1) {
                this.index ++
            } else {
                this.index = 0
            }
            for (let index in this.users) {
                if (index == this.index) {
                    this.users[index]['checked'] = true
                    this.checked_name = this.users[index]['username']
                } else this.users[index]['checked'] = false
            }
            this.keyboard = true//应该没用了
        },
        up() {
            if (this.index > 0) {
                this.index --
            } else {
                this.index = this.users.length - 1
            }
            for (let index in this.users) {
                if (index == this.index) {
                    this.users[index]['checked'] = true
                    this.checked_name = this.users[index]['username']
                } else this.users[index]['checked'] = false
            }
            this.keyboard = true
        },
    },
}
</script>