/**
 *
 * 弓箭基类
 * @author 
 *
 */
class MagicBulletBase extends VectorElements {
    /**是否运行过程中*/
    public isTravel: boolean = false;
    /**是否击中目标*/
    public isHit: boolean = false;
    /**是否跟踪目标*/
    public follow: boolean = false;
    
    /**起始坐标*/
    public p1:egret.Point;
    /**单一目标*/
    public target: any;
    /**瞄向目标向上偏移量*/
    public offy: number;
    
    /**view MovieClip*/
    public view: egret.MovieClip;
    
    
    /**定个速度*/
    //向量
    
    protected angel:number;//夹角
    
    
	public constructor() {
        super();
        //申明状态机
        this.fsm = new StateMachine(this);
	}
	
    /**刷新*/
    public update() {
        if(this.follow) {
            //this.move();
            //this.hittest();
        }
    }
    
    /**闲置中*/
    public idling(){
        if(!(this.curState == stateType.idleState)) {
            this.curState = stateType.idleState;
            //this.view.gotoAndStop(this.stateLabel);
        }
    }
    /**移动中*/
    public moving(){
        //移动角度判断
        //this.getMoveAngle(this._angle);
        if(!(this.curState == stateType.moveState)) {
            this.curState = stateType.moveState;
            //this.view.gotoAndPlay(this.stateLabel);
            //console.log("moving");
        }
        this.setPosArr();
    }
    /**移动完毕*/
    public movingEnd(){
        if(!(this.curState == stateType.moveEndState)) {
            this.curState = stateType.moveEndState;
            this.fsm.changeState(stateType.idleState);//本方这句
            //console.log("arrive");
            this.hittest();
        }
    }
    
    /**闲置*/
    public isIdle():boolean{
        //console.log("isIdle");
        return true;
    }
    /**移动*/
    public isMove():boolean{
        //console.log("isMove");
        return true;
    }
    
    public setPosArr(){
        this._pathIndex = 0;
        this.posArr.length = 0;
        var v2d:Vector2D = new Vector2D(this.target.x,this.target.y-this.target.offy);
        this.posArr.push(v2d);
        this.fsm.changeState(stateType.moveState);
    }
    
    /**移动
    public move() {
        var dx: number = this.target.x - this.x;
        var dy: number = this.target.y - this.offy - this.y;
        this.x += dx / 6;
        this.y += dy / 6;
        this.angel = Math.atan2(dy,dx);
        this.rotation = this.angel * 180 / Math.PI;
    }
     */                           
                            	
    /**帧事件*/
    public onEnterFrame(advancedTime: number) {
        super.onEnterFrame(advancedTime);
        this.rotation = this._angle;
        //状态刷新
        this.fsm.onEnterFrame(advancedTime);
        //刷新
        this.update();
        //旅行
        if(this.isTravel){
            this.view.gotoAndPlay("travel");
            this.isTravel = false;
        }
        //击中
        if(this.isHit) {
            this.view.gotoAndPlay("hit");
            this.isHit = false;
        }
        //播放完成
        if(this.view.currentLabel == "hitEnd") {
            this.canClear = true;
        }
        if(this.view.currentLabel == "travelEnd"){
            this.view.gotoAndPlay("travel");
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
        //if(this.angle >= 0 && this.angle <= 180)
            //return;
        //
        //var disx: number = this.x - this.target.x < 0 ? this.target.x - this.x : this.x - this.target.x;
        //var disy: number = this.y - this.target.y-this.target.offy < 0 ? this.target.y-this.target.offy - this.y : this.y - this.target.y-this.target.offy;
       // if(disx <= 4 && disy <= 4) {//精确到1个像素内
            if(HitTest.hitTestRect(this,this.target)) {
                this.target.hp -= this.damage;
                //console.log(this.target.hp);
                this.isHit = true;//击中敌人效
                
                this.follow = false;
            }
       // }
    }
        
}
