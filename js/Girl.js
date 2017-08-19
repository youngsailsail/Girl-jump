
(function () {
    //放在外面,只用获取一次;
    var container=document.getElementsByClassName('container');
    var Button=document.querySelectorAll('input');
    window.Girl = Class.extend({
        init : function () {
            this.width = 51.2;
            this.height =2048/8-165;//减去图片上下多余的宽度
            this.x = (game.canvas.width - this.width) * 0.5;//在画布正中绘制女孩儿
            this.y = game.canvas.height -48- this.height;
            // 女孩脚步的状态 合法值: 2 7 12 17 22 27 32 37//每隔200渲染一次;
            this.pace = 2;
            // 脚步的频率
            this.singRate = 10;
            // 下落时的帧数
            this.dropFrame = game.frameUtil.currentFrame;//初始化时候的帧数
            // 下落的增量
            this.dy = 0;
            // 下落的角度
            this.rotateAngle = 0;
            // 脚步的状态 0: 下 1: 上
            this.state = 0;
            // 空间的阻力
            this.deleteY = 1;
            // 调用方法绑定事件
            this.bindClick();
            // 女孩儿是否死亡
            this.die = false;
            // 女孩死亡动画的索引
            this.dieAnimationIndex = 0;
        },

        update : function () {
            // 0.更新女孩死亡的动画
            if(this.die === true) {
                this.dieAnimationIndex ++;
                if (this.dieAnimationIndex === 50){
                    // 停止定时器
                    game.pause();
                    container[0].style.display='block';//展示最高分和当前得分
                    // 绘制游戏结束
                    var gameOverX = (game.canvas.width - 626) * 0.5;
                    var gameOverY = (game.canvas.height - 144) * 0.5;
                    game.context.drawImage(game.allImageObj['gameover'],gameOverX,gameOverY);
                    container[1].style.display='block';//展示重新开始,清空记录,作者信息
                    Button[0].value='当前得分:'+game.frameUtil.currentFrame;//设置当前得分
                    //将最高分保存在本地
                    var a2=document.getElementById('audio2');
                    if (localStorage.count)
                    {
                        Button[1].value='往期最高得分:'+ localStorage.count;//展示上一次的最高分
                        if(game.frameUtil.currentFrame>localStorage.count){
                            localStorage.count=game.frameUtil.currentFrame;
                            document.getElementById('audio3').play();//破纪录音乐
                            Button[0].value+='     打破纪录!'
                        }else{
                            a2.play();
                        }

                    } else
                        {
                        Button[1].value='往期最高得分:0';//第一次游戏
                        localStorage.count=game.frameUtil.currentFrame;//等于死亡时的帧数
                            a2.play();//死亡音乐
                        }

                    Button[3].onclick=function () {
                        localStorage.count=0;
                        Button[1].value='往期最高得分:0';
                    };
                }
                return;
            }
            // 1.每10帧更新更新女孩的脚步状态
            if(game.frameUtil.currentFrame % this.singRate === 0){
                this.pace +=5;
                if(this.pace >= 37){//最后一个之后回到开始状态
                    this.pace = 2;
                }
            }

            // 2.根据女孩的状态判断是下落还是上升
            if (this.state === 0) { //下落
                // 自由落体
                this.dy = 0.001 * 0.5 * 9.8 * Math.pow(game.frameUtil.currentFrame - this.dropFrame,2);
                this.rotateAngle += 1;//下落角度越来越前倾

            } else if (this.state === 1) { //上升
                // 阻力越来越大
                this.deleteY++;
                // 默认的冲上向上16
                this.dy = -16 + this.deleteY;
                if (this.dy >= 0) { //冲力小于阻力,下落
                    // 下落的状态
                    this.state = 0;
                    //更新下落的帧数
                    this.dropFrame = game.frameUtil.currentFrame;
                }

            }

            // 3.更新Y值
            this.y += this.dy;

            // 4.关闭上空
            if (this.y <= 0 ) {
                this.y = 0;
            }

            // 5.封锁地面
            if(this.y >= game.canvas.height - this.height - 48) {
                this.y = game.canvas.height - this.height - 48
            }
        },

        render : function () {
            if(this.die === true) {
                // 绘制热血
                var sWidth = 1625 / 5,sHeight = 828 / 6;
                var col = this.dieAnimationIndex % 5;
                var row = parseInt(this.dieAnimationIndex / 5);
                game.context.drawImage(game.allImageObj['blood'],col * sWidth,row * sHeight,sWidth,sHeight,this.x - 80,this.y,sWidth,sHeight);
                return;
            }


            if(this.y <game.canvas.height - this.height - 48){//离开地面的时候
                game.context.save();
                // 位移画布到女孩的中点
                game.context.translate(this.x + this.width * 0.5,this.y + this.height * 0.5);
                // 旋转
                game.context.rotate(this.rotateAngle * Math.PI / 180);
                // 让画布复位
                game.context.translate(-(this.x + this.width * 0.5),-(this.y + this.height * 0.5));}
          // 绘制女孩
            game.context.drawImage(game.allImageObj['girl'],this.pace *this.width,2048/8*4+84,this.width,this.height,this.x,this.y,this.width,this.height);
            game.context.restore();

        },

        // 绑定事件
        bindClick : function () {
       // 备份指针
            var a1 =document.getElementById('audio');
            var self = this;
            game.canvas.addEventListener('mousedown',function () {
                  a1.play();
                // 改变女孩的状态
                self.state = 1;
                // 改变女孩的角度,向后倾
                self.rotateAngle = -23;
                // 归位置
                self.deleteY = 1;
            });

        }
    });
})();
