/**
 *
 * @author 
 *
 */
class FireBall extends FireBallBase {
    public constructor() {
        super();
        this.ratioSoldY = this.minSoldRadius / this.maxSoldRadius;
        //获取纹理
        this.view = new egret.MovieClip();
        this.addChild(this.view);
        this.anchorX = 0.5;
        this.anchorY = 1;
                
        var data = RES.getRes("stone1json");
        var texture = RES.getRes("stone1png");
        var mcf: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,texture);
        this.view.movieClipData = mcf.generateMovieClipData("stone1");
        this.view.anchorX = 0.5;
        this.view.x = this.view.width / 2;
                
        //设置数据属性
        //this.damage = 100;
    }
    /**创建-初始化*/
    public onCreate(){
        this.canClear = false;
        this.isHit = false;
        this.follow = false;
        this.isTravel = true;
        //this.target = null;
        
        this._maxSpeed = 5;
        
        
        this.fsm.changeState(stateType.idleState);
        this.curState = stateType.idleState;
    }
    
    /**初始化 运动路径点 并移动*/
    public init(xnum:number,ynum:number):void {
        //console.log(xnum + "   " + ynum);
        this.p1 = new egret.Point(xnum,ynum);
        this._position.x = this.x = xnum;
        this._position.y = this.y = ynum - 480;
        
        this.setPosArr();
    }
    
    /**帧事件*/
    public onEnterFrame(advancedTime: number) {
        super.onEnterFrame(advancedTime);
    }
}
