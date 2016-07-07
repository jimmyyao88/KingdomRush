/**
 *
 * 炮弹基类
 * @author 
 *
 */
class ExploBase extends Elements {
    /**是否击中目标*/
    public isHit: boolean = false;
    /**是否失去目标*/
    public isMiss: boolean = false;
    /**是否跟踪目标*/
    public follow: boolean = false;
        
    /**起始坐标*/
    public p1:egret.Point;
    /**单一目标*/
    public target: any;
    /**进入到炮弹攻击范围的敌人数组*/
    public atargets: any[];
    /**瞄向目标向上偏移量*/
    public offy: number;
    /**弓箭箭头向下的角度*/
    public angle: number;
    
    /**攻击范围最大半径*/
    protected maxSoldRadius: number = 40;
    /**攻击范围最小半径*/
    protected minSoldRadius: number = 40;
    /**将圆沿y轴压扁变为椭圆时候的比例*/
    protected ratioSoldY: number;
        
    /**view MovieClip*/
    public view: egret.MovieClip;
    
    protected xSpeed:number;
    protected ySpeed:number;
    protected t0:number = 0;
    protected t1:number = 25;//高度
    protected g:number = 1;//重力
    protected angel:number;//夹角
    protected pos: egret.Point;
    
	public constructor() {
        super();
	}
	
    /**刷新*/
    public update() {
        if(this.follow) {
            this.move();
            this.hittest();
        }
    }
    
    /**计算双轴速度*/
    public setTarget(x: number,y: number): void {
        this.pos = new egret.Point(x,y);
        //根据终点计算双轴速度
        this.xSpeed = (this.pos.x - this.p1.x) / this.t1;
        this.ySpeed = (((this.pos.y - this.p1.y) - ((this.g * this.t1) * (this.t1 / 2))) / this.t1);
    }
    /**移动*/
    public move() {
        this.setTarget(this.target.x,this.target.y - this.offy);

        this.t0 += 0.5;
        this.x = (this.p1.x + (this.t0 * this.xSpeed));
        this.y = ((this.p1.y + (this.t0 * this.ySpeed)) + (((this.g * this.t0) * this.t0) / 2));
        this.t0 += 0.5;
        var Sx: number = (this.p1.x + (this.t0 * this.xSpeed));
        var Sy: number = ((this.p1.y + (this.t0 * this.ySpeed)) + (((this.g * this.t0) * this.t0) / 2));
        this.t0 -= 0.5;
        var dx: number = Sx - this.x;
        var dy: number = Sy - this.y;
        //this.angel = Math.atan2(dy,dx);
        //this.rotation = this.angel * 180 / Math.PI + 180;
        //根据弓箭的角度来允许碰撞
        this.angle = Math.atan2(dy,dx) * 180 / Math.PI + 180;
    }
                                                            
                                                        	
    /**帧事件*/
    public onEnterFrame(advancedTime: number) {
        //刷新
        this.update();
        //击中
        if(this.isHit) {
            this.view.gotoAndPlay("hit");
            this.isHit = false;
        }
        //播放完成
        if(this.view.currentLabel == "hitEnd") {
            this.canClear = true;
        }
        //销毁
        if(this.canClear) {
            ObjectPool.getInstance().destroyObject(this);
        }
    }
                                
                            	
    /**碰撞检测*/
    //根据坐标差值检测？
    //设置一个小的rectangle 优先尝试
    public hittest(): void {
        //允许攻击角度
        if(this.angle >= 0 && this.angle <= 180)
            return;
        //
        var disx: number = this.x - this.target.x < 0 ? this.target.x - this.x : this.x - this.target.x;
        var disy: number = this.y - this.target.y - this.offy < 0 ? this.target.y - this.offy - this.y : this.y - this.target.y - this.offy;
        if(disx <= 1 && disy <= 1) {//精确到1个像素内
            //在椭圆范围内的允许碰撞筛选数组(进入炮弹攻击的范围)
            var i: number;
            this.atargets = [];
            for(i = 0;i < this.targets.length;i++) {
                var obj = this.targets[i];
                var isin: boolean = Utils.containsXY(obj.x,obj.y,this.x,this.y,this.maxSoldRadius,this.ratioSoldY);
                var index = this.atargets.indexOf(obj);
                if(isin && obj.hp>0) {
                    if(index == -1)
                        this.atargets.push(obj);
                } else {
                    if(index != -1)
                        this.atargets.splice(index,1);
                }
            }
            //范围内敌人扣血
            for(i = 0;i < this.atargets.length;i++) {
                var obj = this.atargets[i];
                obj.hp -= this.damage;
            }
            //if(HitTest.hitTestRect(this,this.target)) {
            //this.target.hp -= this.damage;
            //击中敌人效果
            this.isHit = true;
            this.follow = false;
            //}
            
            //播放音效
            SoundManager.playEffect("explo_fireend1");
        }
    }
}
