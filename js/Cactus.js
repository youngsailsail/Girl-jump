(function () {
    window.Cactus = Class.extend({
        init : function () {
            // 1.方向 0:向下,1:向上
             this.dir = _.random(0,1);
            // 2.宽高
            this.height = _.random(104,game.canvas.height * 0.5);
            this.width =this.height<=135?95:205;
            this.x2=205-this.width;
            // 3.坐标
            this.x = game.canvas.width;
            this.y = this.dir == 0 ? 0 : game.canvas.height - this.height - 48;

            // 4.速度
            this.speed = 4;
            //设置上下增量
            this.dy=_.random(-60,60);
            // 仙人掌的状态 0: 下 1: 上
            this.state = 0;

        },
        
        update : function () {
            this.x -= this.speed;
            
            // 销毁离开画布的仙人掌
            if (this.x < -this.width){
                game.cactusArr = _.without(game.cactusArr,this);
            }

            // 仙人掌和小女孩的碰撞检测
            if(game.girl.x + game.girl.width > this.x && game.girl.x < this.x + this.width) { // 进入仙人掌区域
                if(this.dir == 0) { // 仙人掌向下
                if(game.girl.y < this.height ) {
                        game.gameOver();
                    }
                } else if (this.dir == 1){ // 仙人掌向上
                 if((game.girl.y + game.girl.height) > this.y ) {
                        game.gameOver();
                    }
                }
                
            }
        },

        pause : function () {
            this.speed = 0;
        },

        render : function () {
            // 判断方向
            if(this.dir == 0) { // 向下

                game.context.drawImage(game.allImageObj['cactus1'],0,1664-this.height,this.width,this.height,this.x,this.y,this.width,this.height);
                
            } else if (this.dir == 1) {// 向上
                
                game.context.drawImage(game.allImageObj['cactus0'],this.x2,0,this.width,this.height,this.x,this.y,this.width,this.height);
                
            }
        }
    });
})();
