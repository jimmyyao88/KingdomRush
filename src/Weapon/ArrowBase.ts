/**
 *
 * 弓箭基类
 * @author 
 *
 */
class ArrowBase extends Elements {
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
    /**瞄向目标向上偏移量*/
    public offy: number;
    /**弓箭箭头向下的角度*/
    public angle: number;
    
    /**view MovieClip*/
    public view: egret.MovieClip;
    
    
    protected xSpeed:number;
    protected ySpeed:number;
    protected t0:number = 0;
    protected t1:number = 20;
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
        this.angel = Math.atan2(dy,dx);
        this.rotation = this.angel * 180 / Math.PI + 180;
        //根据弓箭的角度来允许碰撞
        this.angle = this.rotation;
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
        //失去目标(插地)
        if(this.isMiss) {
            this.view.gotoAndPlay("miss");
            this.isMiss = false;
        }
        //播放完成
        if(this.view.currentLabel == "hitEnd" || this.view.currentLabel == "missEnd") {
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
        var disy: number = this.y - this.target.y-this.offy < 0 ? this.target.y-this.offy - this.y : this.y - this.target.y-this.offy;
        if(disx <= 1 && disy <= 1) {//精确到1个像素内
            //if(HitTest.hitTestRect(this,this.target)) {
                this.target.hp -= this.damage;
                //console.log(this.target.hp);
                
                //在上一次攻击时已经死亡则插地
                if(this.target.hp<=-this.damage){
                    this.isMiss = true;//插地效果
                    this.rotation = 270;
                    //x,y坐标随机偏移几像素
                    var dx: number = 2 - Math.random() * 4;
                    var dy: number = Math.random() * 6+4;
                    this.x += dx;
                    this.y += dy;
                }
                //else if(this.target.hp <= 0) {
                    //this.target.canClear = true;//
                    //this.isHit = true;//击中敌人效果
                //}
                else{
                    this.isHit = true;//击中敌人效果
                    //播放音效
                    if(Math.random() > 0.4)
                        SoundManager.playEffect("arrow_hit2");
                    else
                        SoundManager.playEffect("arrow_hit1");
                }
                
                this.follow = false;
            //}
        }
    }
        
}
