/**
 *
 * 火球类
 * @author 
 *
 */
class FireBallBase extends VectorElements {
    /**是否运行过程中*/
    public isTravel: boolean = false;
    /**是否击中目标*/
    public isHit: boolean = false;
    /**是否跟踪目标*/
    public follow: boolean = false;
    
    /**起始坐标*/
    public p1:egret.Point;
    /**瞄向目标向上偏移量*/
    public offy: number;
    private atargets: any[];
    
    /**view MovieClip*/
    public view: egret.MovieClip;
    
    /**攻击范围最大半径*/
    protected maxSoldRadius: number = 40;
    /**攻击范围最小半径*/
    protected minSoldRadius: number = 30;
    /**将圆沿y轴压扁变为椭圆时候的比例*/
    protected ratioSoldY: number;
    
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
        }
        
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
        var v2d:Vector2D = new Vector2D(this.p1.x,this.p1.y);
        
        this.posArr.push(v2d);
        this.fsm.changeState(stateType.moveState);
    }
                              
                            	
    /**帧事件*/
    public onEnterFrame(advancedTime: number) {
        super.onEnterFrame(advancedTime);
        //this.rotation = this._angle;
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
    public hittest(): void {
        //允许攻击角度
        var disx: number = this.x - this.p1.x < 0 ? this.p1.x - this.x : this.x - this.p1.x;
        var disy: number = this.y - this.p1.y < 0 ? this.p1.y - this.y : this.y - this.p1.y;
        if(disx <= 1 && disy <= 1) {//精确到1个像素内
            //在椭圆范围内的允许碰撞筛选数组(进入炮弹攻击的范围)
            var i: number;
            this.atargets = [];
            for(i = 0;i < this.targets.length;i++) {
                var obj = this.targets[i];
                var isin: boolean = Utils.containsXY(obj.x,obj.y,this.x,this.y,this.maxSoldRadius,this.ratioSoldY);
                var index = this.atargets.indexOf(obj);
                if(isin && obj.hp > 0) {
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
            //击中敌人效果
            this.isHit = true;
                        
            //播放音效
            //SoundManager.playEffect("explo_fireend1");
        }
    }
        
}
