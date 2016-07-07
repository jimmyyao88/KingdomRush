/**
 *
 * 防御士兵01
 * @author 
 *
 */
class ZenYuan1 extends ZenYuanBase{
    
    //每次点击生成长度为1的路径寻路点
	public constructor() {
        super();
        //纹理
        this.addTexture();
	}
    /**添加纹理 初始化数据*/
    private addTexture(){
        this.anchorX = 0.5;
        this.anchorY = 1;
        //获取纹理
        this.view = new egret.MovieClip();
        this.addChild(this.view);
        var data = RES.getRes("ZenYuan1json");
        var texture = RES.getRes("ZenYuan1png");
        var mcf: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,texture);
        this.view.movieClipData = mcf.generateMovieClipData("ZenYuan1");
        this.view.anchorX = 0.5;
        this.view.x = this.view.width / 2;
        //血条位置
        this.lifeBar.x = 27;
        this.lifeBar.y = 5;
        //初始不会变化的数据
        this._maxSpeed = 0.6;
        //this.damage = 4;
        //this.life = 400;
        this.fireDelay = 1000;
        
    }
	
    /**创建-初始化*/
    public onCreate(){
        this.hp = 400;
        this.posArr = [];
        this._pathIndex = 0;
        
        this.sumTime = 0;
        this.timesum = 0;
        this.lifeBar.reSet();
        this.lifeBar.visible = true;
        this.canClear = false;
        
        this.atjijie = false;
        this.moveToTarget = false;
        
        
        this.fsm.changeState(stateType.idleState);
        this.curState = stateType.idleState;
        
        //this.view.touchEnabled = true;
        this.view.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.viewSelect,this);
    }
    
    /**初始化 运动路径点 并移动*/
    public init(arr:number[][]):void {
        this.atjijie = true;
        this._position.x = this.x = arr[0][0];
        this._position.y = this.y = arr[0][1];
                
        var i:number = 1;
        var len:number = arr.length;
        for(i;i < arr.length;i++){
            this.jijieDian = new Vector2D(arr[i][0]+this.xoffset,arr[i][1]+this.yoffset);
            this.posArr.push(this.jijieDian);
        }
        
        this.fsm.changeState(stateType.moveState);
    }
    
    /**设置新的集结点*/
    public setPoint(arr:number[]){
        this.dispatchEvent(new SoldEvent(SoldEvent.MOVE,this,arr));
    }
    
    /**设置新的路径点 并移动*/
    public setPath(arr:number[]){
        this.atjijie = true;
        this.posArr.length = 0;
        this.jijieDian = new Vector2D(arr[0]+this.xoffset,arr[1]+this.yoffset);
        this.posArr.push(this.jijieDian);
        this.fsm.changeState(stateType.moveState);
        
        if(this.target == null)
            return;
        if(this.target.target != null){
            this.target.target = null;
        }
        this.target = null;
        //塔类侦听事件 这里发送消息
    }
    
    /**帧事件*/
    public onEnterFrame(advancedTime:number){
        super.onEnterFrame(advancedTime);
        //计算多少秒后死亡
        this.sumTime += advancedTime;
        if(this.sumTime>=this.totalTime){
            this.hp = 0;
            this.lifeBar.reSet();
            this.lifeBar.visible = false;
            this.getMoveAngle(90);
            this.sumTime = 0;
        }
    }
    
    /**鼠标选中对象*/
    private viewSelect(e:egret.TouchEvent){
        //Group.selectItem(this);
    }
    
    /**销毁*/
    public onDestroy(): void {
        super.onDestroy();
        this.view.touchEnabled = false;
        //this.view.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.viewSelect,this);
    }
    
}
