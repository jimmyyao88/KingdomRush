/**
 *
 * @author 
 *
 */
class MagicBullet010203 extends MagicBulletBase {
    public constructor() {
        super();
        //获取纹理
        this.view = new egret.MovieClip();
        this.addChild(this.view);
        this.anchorX = this.anchorY = 0.5;
                
        var data = RES.getRes("MagicBullet010203json");
        var texture = RES.getRes("MagicBullet010203png");
        var mcf: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,texture);
        this.view.movieClipData = mcf.generateMovieClipData("MagicBullet010203");
                
        //设置数据属性
        //this.damage = 100;
    }
    /**创建-初始化*/
    public onCreate(){
        this.canClear = false;
        this.isHit = false;
        this.follow = false;
        this.isTravel = true;
        this.target = null;
        
        this._maxSpeed = 2;
        
        
        this.fsm.changeState(stateType.idleState);
        this.curState = stateType.idleState;
    }
    
    /**初始化 运动路径点 并移动*/
    public init(p1:egret.Point,tar:any):void {
        this.target = tar;
        
        this._position.x = this.x = p1.x;
        this._position.y = this.y = p1.y;
        
        this.setPosArr();
    }
    
    
    
    	
    /**帧事件*/
    public onEnterFrame(advancedTime: number) {
        super.onEnterFrame(advancedTime);
    }
}
