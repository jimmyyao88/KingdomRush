/**
 *
 * 怪物基类
 * @author 
 *
 */
class MonsterBase extends VectorElements implements ILife{
    /**单一目标*/
    public target: any;
    /**是否被攻击*/
    public beAttack: boolean = false;
    /**弓箭瞄向目标向上偏移量(自身头部位置)*/
    public offy: number;
    
    /**当前生命力*/
    protected _hp: number;
    /**最大生命力*/
    protected life: number;
    
    /**状态标签*/
    protected stateLabel: string;
    /**开火延迟*/
    protected fireDelay: number=0;
    /**时间累计*/
    protected timesum: number=0;
    
    /**血条*/
    protected lifeBar: LifeBar;
    /**view MovieClip*/
    protected view: egret.MovieClip;
    
    /**价值（被消灭的金币数量）*/
    protected value: number;
    /**是否被杀死*/
    protected beKill: boolean;
    
    
	public constructor() {
        super();
        //申明状态机
        this.fsm = new StateMachine(this);
        //血条
        this.lifeBar = new LifeBar();
        this.addChild(this.lifeBar);
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
                this.target.target = null;
                this.target = null;
            }
        }
    }
	
    
    /**-------------------------------------------------------------实时刷新---------------------------------------------------------------*/
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
        if(_angle >=0 && _angle<=60 || _angle>=300 && _angle<=360){//right
            this.stateLabel = "walking";
            this.view.scaleX = 1;
        }
        else if(_angle>60 && _angle<120){//down
            this.stateLabel = "walkingDown";
        }
        else if(_angle>=120 && _angle<=240){//left
            this.stateLabel = "walking";
            this.view.scaleX = -1;
        }
        else if(_angle>240 && _angle<300){//up
            this.stateLabel = "walkingUp";
        }
    }
        
    ////////////////////////////////状态执行
    /**闲置中*/
    public idling(){
        if(!(this.curState == stateType.idleState)) {
            this.curState = stateType.idleState;
            this.view.gotoAndStop(this.stateLabel);
        }
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
        //判断目标!=null 则切换到闲置状态
        if(this.target!=null){
            this.fsm.changeState(stateType.idleState);
        }
        this.checkLast(this.stateLabel);
    }
    /**移动完毕*/
    public movingEnd(){
        if(!(this.curState == stateType.moveEndState)) {
            this.curState = stateType.moveEndState;
            //this.fsm.changeState(stateType.idleState);//敌人不要这句
            //console.log("arrive");
            this.canClear = true;
            //console.log("arrival 生命力-1");
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
        //攻击完毕敌人若死亡切换到移动状态
        if(this.target == null) {
            this.fsm.changeState(stateType.moveState);
        } else {
            //循环攻击
            if(this.timesum >= this.fireDelay) {
                //攻击之前检测目标是否活着
                this.moveOrFight();
                this.fsm.changeState(stateType.fightState);
                this.timesum = 0;
            }
        }
        
    }
    /**死亡中*/
    protected dieVoiceArr: string[] = ["monster_die1","monster_die2","monster_die3","monster_die4"];
    public dying(){
        if(!(this.curState == stateType.deadState)) {
            this.curState = stateType.deadState;
            this.view.gotoAndPlay(this.stateLabel);
            
            //死亡音效
            var idx = Math.floor(Math.random() * 4);
            SoundManager.playEffect(this.dieVoiceArr[idx]);
        }
        this.checkLastEnd(this.stateLabel);
    }
    /**死亡完毕-可以消除*/
    public dyingEnd(){
        if(!(this.curState == stateType.deadEndState)) {
            this.curState = stateType.deadEndState;
            
            this.beKill = true;
            this.canClear = true;
            //console.log("monster die");
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
    private checkLastEnd(curLabel:string){
        var nextFrameNum:number = this.view.currentFrame+1;
        var label: string = this.view._getFrameLabelForFrame(nextFrameNum).name;
        if( label != curLabel || this.view.currentFrame>=this.view.totalFrames){
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
    /**判断目标!=null 且目标距离达到攻击距离时则切换到攻击状态 若目标==null则切换到移动状态*/
    private moveOrFight(){
        if(this.target!=null){
            if(this.beAttack)//若被攻击则反击
                this.fsm.changeState(stateType.fightState);
            else
                this.fsm.changeState(stateType.idleState);
        }else{
            this.beAttack = false;
            this.fsm.changeState(stateType.moveState);
        }
    }
    
}
