<template>
	<div class="content">
		<div class="w1200">
			<div class="homebg">
				<EvoTitle></EvoTitle>
				<ul class="poster_ul">
					<li v-for="item in imgs">
						<div class="poster_ul_d">
							<img :src="item.url" />
							<div class="poster_ul_dp">
								<button @click="drawImage(item.url, item.name)">免费下载</button>
							</div>
						</div>
						<p><span>{{item.type}}</span>{{item.name}}</p>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
const EvoTitle = () => import("@/components/EvoTitle")
export default {
	name: 'Poster',
    data() {
        return {
            imgs: [],
        }
    },
    components: {
        EvoTitle
    },
    created() {
    	let userinfo = localStorage.getItem("userinfo")
    	let users = JSON.parse(decodeURIComponent(window.atob(userinfo)))
    	this.qrcode = users.qrcode
    	this.logo = users.logo || require('@/assets/images/logo_01.png')
    	this.getImgs()
    },
    methods: {
    	getImgs() {
    		this.$http.post('/getPosters').then(res=>{
                this.imgs = res.data
            }).catch(res=>{})
    	},
    	drawImage(url, name){
    		
    		let _this = this

    		var myImage = new Image();
    		myImage.crossOrigin = 'Anonymous';
            myImage.src = url + '?v='+ Math.random();

            myImage.onload = function(){

            	var canvas = document.createElement("canvas");
	            canvas.width = myImage.width;
	            canvas.height = myImage.height;
	            var context = canvas.getContext("2d");

	            context.rect(0 , 0 , canvas.width , canvas.height);
	            context.fillStyle = "#fff";
	            context.fill();

                context.drawImage(myImage , 0 , 0 , myImage.width , myImage.height);

                //context.font = "60px Courier New";
                //context.fillText("我是文字",350,450);

                var myImage2 = new Image();
                myImage2.crossOrigin = 'Anonymous';
                myImage2.src = _this.logo + '?v='+ Math.random();
                
                myImage2.onload = function(){
                    context.drawImage(myImage2 , 20 , 20 , 170 , 50);//logo的宽高，默认

                    if (!_this.qrcode) {

                    	var base64 = canvas.toDataURL("image/png");  //"image/png" 这里注意一下
	                    _this.downloadFile(name + '.png', base64);

                    } else {
                    
	                    var myImage3 = new Image();
	                	myImage3.crossOrigin = 'Anonymous';
	                	myImage3.src = _this.qrcode + '?v='+ Math.random();//加了随机码，浏览器不会使用缓存，重新发起跨域请求

	                	myImage3.onload = function(){

	                		let qrcode_width = 120//logo 的宽高
	                		let qrcode_height = 120

	                		let x = (myImage.width - qrcode_width) / 2
	                		let y = myImage.height - qrcode_height - 80

	                		context.drawImage(myImage3 , x , y , qrcode_width , qrcode_height);
	                    	var base64 = canvas.toDataURL("image/png");  //"image/png" 这里注意一下
	                    	_this.downloadFile(name + '.png', base64);

	                	}

                	}

                    //var img = document.getElementById('avatar');
                    //img.setAttribute('src' , base64);
                }
            }
        },
      	downloadFile(fileName, content) {
	        let aLink = document.createElement('a');
	        let blob = this.base64ToBlob(content); //new Blob([content]);

	        let evt = document.createEvent("HTMLEvents");
	        evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
	        aLink.download = fileName;
	        aLink.href = URL.createObjectURL(blob);

	        // aLink.dispatchEvent(evt);
	        //aLink.click()
	        aLink.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));//兼容火狐
      	},
      	//base64转blob
      	base64ToBlob(code) {
	        let parts = code.split(';base64,');
	        let contentType = parts[0].split(':')[1];
	        let raw = window.atob(parts[1]);
	        let rawLength = raw.length;

	        let uInt8Array = new Uint8Array(rawLength);

	        for (let i = 0; i < rawLength; ++i) {
	          uInt8Array[i] = raw.charCodeAt(i);
	        }
	        return new Blob([uInt8Array], {type: contentType});
      	},
    }
}
</script>
