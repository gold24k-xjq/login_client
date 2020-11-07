<template>
<div id="mycro">
    <div class="w1200">
        <div class="vue_cr">
            <vueCropper
            ref="cropper"
            :img="option.img"
            :info="option.info"
            :outputSize="option.size"
            :outputType="option.outputType"
            :canScale="option.canScale"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :high="option.high"
            :maxImgSize="option.maxImgSize"
            :enlarge="option.enlarge"
            :mode="option.mode"
            @realTime="realTime"
            @imgLoad="imgLoad"
            @cropMoving="cropMoving"
            class="fl vue_cr_l"
            ></vueCropper>
            <div class="fr vue_cr_r">
                <div class="prewArea" @click="previewImg">
                    <div :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px','zoom': previews.zoom}">
                        <div :style="previews.div">
                            <img :src="previews.url" :style="previews.img">
                        </div>
                    </div>
                </div>
                <ul class="vue_cr_r_ul">
                    <li :class="{'on': item.orders == cur_order || item.paths.length}" v-for="item in answers" v-if="item.subjective == 2" @click="checkOrders(item)">{{item.orders}}</li>
                </ul>
                <div class="vue_cr_r_btn">
                    <div class="vue_cr_r_btn_t">
                        <label for="file">{{upload_text}}</label>
                        <input type="file" id="uploads" @change="changeImg" accept="image/png, image/jpeg, image/gif, image/jpg">
                    </div>
                    <div class="vue_cr_r_btn_b">
                        <button @click="changeScale(1)">放大</button>
                        <button @click="changeScale(-1)">缩小</button>
                        <button @click="rotateLeft">左旋转</button>
                        <button @click="rotateRight">右旋转</button>
                        <button @click="upload">上传</button>
                        <button @click="reset">清除</button>
                    </div>
                    <div class="vue_cr_r_btn_t">
                        <button class="vue_cr_r_btn_t_btn" @click="submit">确定</button>
                    </div>
                </div>
            </div>
        </div>    
    </div>
    <div class="model" v-show="model" @click="model = false">
        <div class="model-show">
            <img :src="modelSrc" alt="">
        </div>
    </div>
</div>
</template>

<script>
import { VueCropper }  from 'vue-cropper' 
export default {
    name: 'MyCropper',
    data() {
        return {
            option: {
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 0.8, // 裁剪生成图片的质量
                outputType: 'png', // 裁剪生成图片的格式
                canScale: true, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 500, // 默认生成截图框宽度
                autoCropHeight: 200, // 默认生成截图框高度
                fixedBox: false, // 固定截图框大小 不允许改变
                fixed: false, // 是否开启截图框宽高固定比例
                //fixedNumber: [2, 1], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMove: true,//上传图片是否可以移动
                canMoveBox: true, // 截图框能否拖动
                original: true, // 上传图片按照原始比例渲染
                centerBox: true, // 截图框是否被限制在图片里面
                infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                high: true,//是否按照设备的dpr 输出等比例图片
                maxImgSize: 2000,//限制图片最大宽度和高度
                enlarge: 1,//图片根据截图框输出比例倍数
                mode: 'cover',//图片默认渲染方式
            },
            previews: {},
            is_upload: false,
            upload_text: '选择图片',
            cur_order: '',
            access: true,
            paths: [],//存储路径，返回给父组件
            model: false,//弹窗显示图片，可以用viewer代替
            modelSrc: '',
            limit: 2,//最多上传图片数量
        }
    },
    components: {
        VueCropper,
    },
    props: {
        imgshow: {
            type: Boolean,
            default: false
        },
        answers: {
            type: [Array, Object],
        },
        uid: {
            type: [Number, String],
        },
        temp_code: {
            type: String,
        },
    },
    watch: {
        imgshow(value) {
            let _this = this
            let dom = $('#mycro')
            if (value) {
                let index = layer.open({
                    type: 1,
                    title: '上传作答',
                    content: dom,
                    end: function() {
                        _this.$emit('update:imgshow', false)
                        _this.$emit('getPaths', _this.paths)
                    },
                });
                layer.full(index);
            }
        },
        answers: {
            handler: function(n) {
                let path_num = []
                n.forEach((item) => {
                    path_num[item.orders] = 1
                })
                this.path_num = path_num
            },
            immediate: true
        },
        is_upload(value) {
            this.upload_text = value ? '更换图片' : '选择图片'
        },
        uid(value) {
            this.paths = []
            this.model = false
            this.modelSrc = ''
            this.option.img = ''
            this.is_upload = false
            this.cur_order = ''
        },
    },
    methods: {
        changeImg(e) {
            let _this = this
            let file = e.target.files[0]
            this.fileUpload = file
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                this.$func.error('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                return
            }
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                let data
                if (typeof e.target.result === 'object') {// 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]))
                } else {
                    data = e.target.result
                }
                _this.option.img = data
            }
            this.is_upload = true
        },
        upload() {
            if (!this.is_upload) {
                this.$func.error('请上传图片')
                return
            }
            if (!this.cur_order) {
                this.$func.error('请选择题号')
                return
            }
            if (this.path_num[this.cur_order] > this.limit) {
                this.$func.error('同一题目最多上传'+this.limit+'张')
                return
            }
            let _this = this
            if (this.path_num[this.cur_order] == this.limit) {
                layer.confirm('当前题目已经上传，请选择续传还是重传', {
                    btn: ['续传', '重传'] //按钮
                }, function(index){
                    layer.close(index)
                    _this.doUpload()
                }, function(index){
                    _this.path_num[_this.cur_order] --
                    layer.close(index)
                    _this.doUpload()
                });
            } else {
                this.doUpload()
            }
        },
        doUpload() {
            if (!this.access) return
            let name = this.cur_order + '-' + this.path_num[this.cur_order]
            let object = this.temp_code+'/'+this.uid+'/'+name+'.'+this.option.outputType
            this.access = false
            this.$refs.cropper.getCropData((content) => {
                let data = {
                    content: content,
                    object: object,
                    noencrypt: true
                }
                this.$http.post('/uploadImg', data).then(res=>{
                    this.cur_item.paths.push(res.data+'?t=' + new Date().getTime())
                    this.paths.push(res.data)
                    this.path_num[this.cur_order] ++
                    this.$func.success('上传成功')
                    this.access = true
                }).catch(res=>{})
            })
        },
        submit() {
            let paths = [...new Set(this.paths)]
            this.$emit('getPaths', paths)
            this.$emit('update:imgshow', false)
            layer.closeAll()
        },
        reset() {
            if (!this.cur_order) {
                this.$func.error('请选择题号')
                return
            }
            if (this.path_num[this.cur_order] == 1) {
                this.$func.error('请先上传')
                return
            }
            for (let i = 1; i <= this.limit; i++) {
                let name = '/' + this.cur_order + '-' + i + '.' + this.option.outputType
                this.paths = this.paths.filter( f => f.indexOf(name) != -1)
            }
            this.path_num[this.cur_order] = 1
            this.cur_item.paths = []
            this.$func.success('清除成功')
        },
        checkOrders(item) {
            this.cur_item = item
            this.cur_order = item.orders
        },
        previewImg() {
            this.$refs.cropper.getCropData((data) => {
                this.model = true
                this.modelSrc = data
            })
        },
        imgLoad() {
            //console.log('初始成功')
        },
        realTime(data) {
            data.zoom = 270 / data.w//定宽
            this.previews = data
        },
        cropMoving() {
            //console.log('裁剪框移动中')
        },
        // 放大缩小
        changeScale(num = 1) {
            this.$refs.cropper.changeScale(num);
        },
        // 左旋转
        rotateLeft() {
            this.$refs.cropper.rotateLeft();
        },
        // 右旋转
        rotateRight() {
            this.$refs.cropper.rotateRight();
        },

    },
}
</script>