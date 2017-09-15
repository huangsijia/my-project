<template>
    <div class="verification ">
        <div @click='drawPic'>
            <canvas id="canvas" width="120" height="35"></canvas>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                canvasValue:''
            }
        },
        props:['inputValue','num', 'stop'],
        watch:{
            inputValue(to,from){
                if(to.length<this.num){
                    return false;
                }
                if(to == this.canvasValue){
                    this.$emit('verifyValue',true)
                }else{
                    this.$emit('verifyValue',false)
                }
            },
            canvasValue(to,from){

                if(this.inputValue.length<this.num){
                    return false;
                }
                if(to == this.inputValue){
                    this.$emit('verifyValue',true)
                }else{
                    this.$emit('verifyValue',false)
                }
            }
        },
        methods:{
            randomNum(min,max){
                return Math.floor(Math.random()*(max-min)+min);
            },
            randomColor(min,max){
                var _r = this.randomNum(min,max);
                var _g = this.randomNum(min,max);
                var _b = this.randomNum(min,max);
                return "rgb("+_r+","+_g+","+_b+")";
            },
            drawPic(){
                if(this.stop){
                    return false;
                }

                var $canvas = document.getElementById("canvas");
                var _str = "0123456789";
                var _picTxt = "";
                var _num = this.num;
                var _width = $canvas.width;
                var _height = $canvas.height;
                var ctx = $canvas.getContext("2d");
                ctx.textBaseline = "bottom";
                // ctx.fillStyle = randomColor(180,240);
                ctx.fillStyle = 'white'
                ctx.fillRect(0,0,_width,_height);
                for(var i=0; i<_num; i++){

                    var x = (_width-20)/_num*i+15;

                    var y = this.randomNum(_height/10*9,_height);
                    var deg = this.randomNum(-45,45);
                    var txt = _str[this.randomNum(0,_str.length)];
                    // if(this.inputValue && this.inputValue.length == _num){
                    //     txt = this.inputValue.slice(i, i + 1);
                    // }
                    
                    _picTxt += txt;
                    ctx.fillStyle = this.randomColor(10,100);
                    ctx.font = this.randomNum(25,35)+"px SimHei";
                    ctx.translate(x,y);
                    ctx.rotate(deg*Math.PI/180);
                    ctx.fillText(txt, 0,0);
                    ctx.rotate(-deg*Math.PI/180);
                    ctx.translate(-x,-y);
                }
                for(var i=0; i<_num; i++){
                    ctx.strokeStyle = this.randomColor(90,180);
                    ctx.beginPath();
                    ctx.moveTo(this.randomNum(0,_width), this.randomNum(0,_height));
                    ctx.lineTo(this.randomNum(0,_width), this.randomNum(0,_height));
                    ctx.stroke();
                }

                this.canvasValue = _picTxt;

            }
        },
        mounted(){
            this.drawPic()
        }
    }
</script>

<style lang="scss" type="text/css" scoped="">
    .verification{

        width:100%;
        height:100%;
        position:relative;
        div{
            position:absolute;
            top:50%;
            left:50%;
            -webkit-transform: translate(-50%,-50%);
               -moz-transform: translate(-50%,-50%);
                -ms-transform: translate(-50%,-50%);
                 -o-transform: translate(-50%,-50%);
                    transform: translate(-50%,-50%);
        }

    }
</style>