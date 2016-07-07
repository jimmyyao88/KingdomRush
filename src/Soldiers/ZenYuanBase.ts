/**
 *
 * 怪物基类
 * @author 
 *
 */
class ZenYuanBase extends VectorElements implements ILife{
    /**单一目标*/
    public target: any;
    /**进入到士兵攻击范围的敌人数组*/
    public atargets: any[];
    /**是否移动到目标*/
    protected moveToTarget: boolean = false;
    
    /**当前生命力*/
    protected _hp: number;
    /**最大生命力*/
    public life: number;
    
    /**状态标签*/
    protected stateLabel: string;
    /**开火延迟*/
    protected fireDelay: number=0;
    /**时间累计*/
    protected timesum: number=0;
    
    /**选中状态管理*/
    protected selectYQ: egret.Shape;
    
    /**血条*/
    protected lifeBar: LifeBar;
    /**view MovieClip*/
    public view: egret.MovieClip;
    /**自动恢复hp(按百分比恢复生命)*/
    protected addhp: number;
    
    //相对于集结点的偏移量
    public xoffset: number=0;
    public yoffset: number=0;
    /**起始点（集结点）*/
    protected jijieDian: Vector2D;
    /**是否在集结点*/
    public atjijie: boolean = false;
    
    /**攻击范围最大半径*/
    protected maxSoldRadius: number = 60;
    /**攻击范围最小半径*/
    protected minSoldRadius: number = 40;
    /**将圆沿y轴压扁变为椭圆时候的比例*/
    protected ratioSoldY: number;
    /**存在时间*/
    protected sumTime: number = 0;
    protected totalTime: number = 30000;
    
    /**攻击音效数组*/
    protected voiceArr: string[] = ["shield_fire1","shield_fire2","shield_fire3"];
    
    
	public constructor() {
        super();
        this.ratioSoldY = this.minSoldRadius / this.maxSoldRadius;
        //申明状态机
        this.fsm = new StateMachine(this);
        //血条
        this.lifeBar = new LifeBar();
        this.addChild(this.lifeBar);
	}
	
    /**设置新的路径点 并移动*/
    public setPath2(v2d:Vector2D){
        this.posArr.length = 0;
        this.posArr.push(v2d);
        this.fsm.changeState(stateType.moveState);
        //塔类侦听事件 这里发送消息
    }
	
    /**检测生命*/
    public live() { 
        if(this._hp <= 0) {
            this.fsm.changeState(stateType.deadState);
        }
        if(this._hp > this.life) { 
            this._hp = this.life;
        }
    }
    /**生命值变动*/
    public set hp(value:number){
        this._hp = value;
        this.live();
        this.lifeBar.setProgress(this._hp,this.life);
    }
    public get hp():number{
        return this._hp;
    }
    
    
    
    /**销毁*/
    public onDestroy():void {
        super.onDestroy();
        if(this.target != null){
            this.target.target = null;
            this.target = null;
        }
    }
    
    /**碰撞检测*/
    protected hittest(){
        if(this.target != null) {
            this.target.hp -= this.damage;
            if(this.target.hp <= 0) {
                var idx: number = this.targets.indexOf(this.target);
                if(idx != -1)
                    this.targets.splice(idx,1);
                idx = this.atargets.indexOf(this.target);
                if(idx != -1)
                    this.atargets.splice(idx,1);
                this.target.target = null;
                this.target = null;
            }
        }
    }
	
    
    /**-----------------------------------------------------------------帧事件----------------------------------------------------------------------*/
    public onEnterFrame(advancedTime:number){
        //攻击间隔
        this.timesum += advancedTime;
        //状态刷新
        this.fsm.onEnterFrame(advancedTime);
        //向量刷新(移动)
        super.onEnterFrame(advancedTime);
        //clear
        if(this.canClear){
            ObjectPool.getInstance().destroyObject(this);
        }
    }
    
    /**移动方向判断*/
    protected getMoveAngle(_angle:number){
        //设置起始标签
        if(_angle >=0 && _angle<=90 || _angle>=270 && _angle<=360){//right
            this.stateLabel = "running";
            this.view.scaleX = 1;
        }
        else if(_angle>90 && _angle<270){//left
            this.stateLabel = "running";
            this.view.scaleX = -1;
        }
    }
            
    ////////////////////////////////状态执行
    /**闲置中*/
    public idling(){
        if(!(this.curState == stateType.idleState)) {
            this.curState = stateType.idleState;
            this.view.gotoAndStop(this.stateLabel);
        }
        //闲置中判断敌人!=null 若进入攻击范围则切换到攻击状态 否则切换到移动状态移动到能攻击敌人的范围 若敌人==null 则回到集结点
        this.moveOrFight();
    }
    /**移动中*/
    public moving(){
        //移动角度判断
        this.getMoveAngle(this._angle);
        if(!(this.curState == stateType.moveState)) {
            this.curState = stateType.moveState;
            this.view.gotoAndPlay(this.stateLabel);
        }
        this.checkLast(this.stateLabel);
    }
    /**移动完毕*/
    public movingEnd(){
        if(!(this.curState == stateType.moveEndState)) {
            this.curState = stateType.moveEndState;
            this.fsm.changeState(stateType.idleState);//本方这句
            //console.log("arrive");
        }
    }
    /**攻击中*/
    public fighting(){
        if(!(this.curState == stateType.fightState)) {
            this.curState = stateType.fightState;
            this.view.gotoAndPlay(this.stateLabel);
            //攻击方向
            if(this.target != null) {
                if(this.x <= this.target.x) {
                    this.view.scaleX = 1;
                } else {
                    this.view.scaleX = -1;
                } 
            }
            //播放攻击音效
            var idx = Math.floor(Math.random() * 3);
            SoundManager.playEffect(this.voiceArr[idx]);
        }
        this.checkLastEnd(this.stateLabel);
    }
    /**攻击完毕-碰撞检测*/
    public fightingEnd(){
        if(!(this.curState == stateType.fightEndState)) {
            this.curState = stateType.fightEndState;
            //console.log("hittest");
            this.hittest();
            this.timesum = 0;
        }
        //攻击完毕敌人若死亡切换到闲置状态
        if(this.target == null) {
            //若敌人数组为[]则回到集结点
            //if(this.targets.length == 0) {
            //this.setPath2(this.jijieDian);
            //} else {
            this.fsm.changeState(stateType.idleState);
            //}
        } else {
            //循环攻击
            if(this.timesum >= this.fireDelay) {
                this.fsm.changeState(stateType.fightState);
                this.timesum = 0;
            }
        }
    }
    /**死亡中*/
    public dying(){
        if(!(this.curState == stateType.deadState)) {
            this.curState = stateType.deadState;
            this.view.gotoAndPlay(this.stateLabel);
            //console.log("士兵死亡");
        }
        this.checkLastEnd(this.stateLabel);
    }
    /**死亡完毕-可以消除*/
    public dyingEnd(){
        if(!(this.curState == stateType.deadEndState)) {
            this.curState = stateType.deadEndState;
            //console.log("士兵canClear");
            this.canClear = true;
        }
    }
            	
    /**循环播放检查*/
    private checkLast(str:string){
        var nextFrameNum:number = this.view.currentFrame+1;
        var mz: string = this.view._getFrameLabelForFrame(nextFrameNum).name;
        if( mz != str){
            this.view.gotoAndPlay(str);
        }
    }
                
    /**播放结束检查*/
    private checkLastEnd(str:string){
        var nextFrameNum:number = this.view.currentFrame+1;
        var mz: string = this.view._getFrameLabelForFrame(nextFrameNum).name;
        if( mz != str || this.view.currentFrame>=this.view.totalFrames){
            this.view.stop();
            if(this.curState == stateType.fightState){
                this.fsm.changeState(stateType.fightEndState);
            }else if(this.curState == stateType.deadState){
                this.fsm.changeState(stateType.deadEndState);
            }
        }
    }
            
    ////////////////////////////////状态切换
    /**闲置*/
    public isIdle():boolean{
        this.stateLabel = "idle";
        return true;
    }
    /**移动*/
    public isMove():boolean{
        //this.stateLabel = "walking";
        return true;
    }
    /**攻击*/
    public isFighting():boolean{
        this.stateLabel = "fighting";
        return true;
    }
    /**死亡*/
    public isDead():boolean{
        this.stateLabel = "dead";
        return true;
    }
    ////////////////////////////////状态判断
    /**闲置中判断敌人!=null 且若进入攻击范围则切换到攻击状态 否则切换到移动状态移动到能攻击敌人的范围 若敌人==null 则回到集结点*/
    private moveOrFight(){
        //获取目标敌人 互设目标
        this.getTarget();
        //移动到和攻击目标
        if(this.target!=null){
            //移动到目标地点
            if(!this.moveToTarget){
                this.moveToTarget = true;
                this.target.beAttack = false;
                //判断x,y距离
                var tx: number;
                var ty: number;
                
                if(this.target.x < this.x)
                    tx = this.target.x + 16;
                else
                    tx = this.target.x - 16;
                ty = this.target.y;
                
                this.atjijie = false;
                this.setPath2(new Vector2D(tx,ty));
            }else{
                this.moveToTarget = false;
                //移动完毕后攻击
                this.fsm.changeState(stateType.fightState);
                this.target.beAttack = true;
            }
        }else{
            this.moveToTarget = false;
            //若敌人数组为0且没在集结点则回到集结点
            //是否移动中判断
            if(this.atargets.length == 0){
                if(!this.atjijie) {
                    this.atjijie = true;
                    this.setPath2(this.jijieDian);
                }
            }
        }
        
    }
    //寻找敌人
    private getTarget(){
        //筛选数组(进入士兵攻击的范围)
        var i: number;
        this.atargets = [];
        for(i = 0;i < this.targets.length;i++) {
            var obj = this.targets[i];
            var isin: boolean = Utils.containsXY(obj.x,obj.y,this.x,this.y,this.maxSoldRadius,this.ratioSoldY);
            var index = this.atargets.indexOf(obj);
            if(isin) {
                if(index == -1)
                    this.atargets.push(obj);
            } else {
                if(index != -1)
                    this.atargets.splice(index,1);
            }
        }
        //互设目标
        var j: number;
        var tarlen: number = this.atargets.length;
        if(tarlen > 0) {
            if(this.target == null) {
                for(j = 0;j < tarlen;j++) {
                    var tar = this.atargets[j];
                    if(tar.target == null) {
                        tar.target = this;
                        this.target = tar;
                        break;
                    }
                }
            }
        }
    }
    
}
