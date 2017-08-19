
(function () {
    window.Game = Class.extend({
        // 初始化方法
        init : function (option) {
            option = option || {};
            // 0.备份指针
            var self = this;
            // 1.fps
            this.fps = option.fps || 60;
            // 2.实例化帧工具类
            this.frameUtil = new FrameUtil();
            // 3.获取画布和上下文
            this.canvas = document.getElementById(option.canvasId);
            this.context = this.canvas.getContext('2d');
            // 4.实例化加载本地数据类
            this.staticSourceUtil = new StaticSourceUtil();
            // 5.本地所有图片数据
            this.allImageObj = {};
            // 6.加载本地数据
            // 接受:所有的dom对象,所有的图片个数,已经加载的dom对象
            this.staticSourceUtil.loadImage('girl.json',function (allImageObj,allImageCount,loadImageCount) {
                // 6.1 判断图片资源是否加载完毕
                if (allImageCount === loadImageCount) {
                    // 保存本地所有的图片数据
                    self.allImageObj = allImageObj;
                    // 加载完毕后开始游戏
                    self.run();
                }
            });
            // 7.游戏是否结束
            this.isGameOver = false;
        },
        //2.运行游戏
        run : function () {
            // 1.备份this
            var self = this;
            // 2.定时器
            this.timer = setInterval(function () {
                self.runLoop();
            },1000/self.fps); // fps:每秒传输的帧数 (1000/100 = 10;-->每一帧需要10毫秒),每过一帧运行一次
            //3.创建房屋
            this.house =  new Background({
                y : this.canvas.height - 256 - 100,//需要减去自身还有草丛高度
                width : 300,
                height : 256,
                image : this.allImageObj['house'],
                speed : 2//越远物体感觉移动越慢
            });

            //4.创建树
            this.tree =  new Background({
                y : this.canvas.height - 216 - 48,//减去自身和沙漠高度
                width : 300,
                height : 216,
                image : this.allImageObj['tree'],
                speed : 3
            });

            //5.创建沙漠
            this.shamo =  new Background({
                y : this.canvas.height - 48,
                width : 48,
                height : 48,
                image : this.allImageObj['shamo'],
                speed : 4
            });

            // 6. 定义一个仙人掌数组
            this.cactusArr = [new Cactus()];
            // 7.创建女孩儿
            this.girl = new Girl();

        },

        // 游戏运行循环-->每一帧执行一次(10毫秒),不断刷新
        runLoop : function () {
            // 0.清屏
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
            // 1.计算真实的帧数
            this.frameUtil.render();
            // 2.绘制fps
            this.context.fillText('FPS /' + this.frameUtil.realFps,15,15);
            // 3.绘制总帧数
            this.context.fillText('FNO /' + this.frameUtil.currentFrame,15,30);
            // 4.更新和渲染房子
            this.house.update();
            this.house.render();
            // 5.更新和渲染树
            this.tree.update();
            this.tree.render();
            // 6.更新和渲染沙漠
            this.shamo.update();
            this.shamo.render();
            // 7.创建仙人掌,每过100添加一株
            if(!this.isGameOver&&this.frameUtil.currentFrame % 100 === 0){
                this.cactusArr.push(new Cactus());
            }
            // 7.1更新和渲染仙人掌(遍历)
            for (var i = 0; i < this.cactusArr.length; i++) {
                this.cactusArr[i].update();
                this.cactusArr[i].render();
            }

            // 8.更新和渲染女孩儿
            this.girl.update();
            this.girl.render();
        },

        // 暂停游戏
        pause : function () {
            // 停止定时器,不再渲染
            clearInterval(this.timer);
        },

        // 结束游戏
        gameOver : function () {
            // 游戏结束
            this.isGameOver = true;
            // 停止背景
            this.house.pause();
            this.tree.pause();
            this.shamo.pause();
            // 停止仙人掌
            for (var i = 0; i < this.cactusArr.length; i++) {
                this.cactusArr[i].pause();
            }
            // 发出通知,女孩死亡了
            this.girl.die = true;

        }

    });
})();
