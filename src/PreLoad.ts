/**
 *
 * 游戏开始介绍页面
 * @author 
 *
 */
class PreLoad extends egret.DisplayObjectContainer {
    /*
     * bgimg
     */ 
    private bg: egret.Bitmap;
    /*
     * progressBarbg
     */ 
    private barbg: egret.Bitmap;
    /*
     * progressBartop
     */ 
    private bartop: egret.Bitmap;
    /*
     * start btn
     */ 
    private btn: egret.Bitmap;
    /*
     * 所有的容器全部继承自 DisplayObjectContainer 类，这个名称为 DisplayObjectContainer 的类又继承自 DisplayObject
     */ 
    private sp: egret.DisplayObjectContainer;
    
    private stageWidth: number;
    private stageHeight: number;
    
	public constructor() {
        super();
        this.stageWidth = GameSetting.swid;
        this.stageHeight = GameSetting.shei;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
    private onAddToStage(event:egret.Event) {
        //图片背景
        this.bg = new egret.Bitmap();
        this.bg.texture = RES.getRes("0ui_bg");
        this.addChild(this.bg);
        //进度条背景
        this.barbg = new egret.Bitmap();
        this.barbg.texture = RES.getRes("probarbg");
        this.barbg.anchorX = 0.5;
        this.barbg.x = this.stageWidth / 2;
        this.barbg.y = this.stageHeight - 138;
        this.addChild(this.barbg);
        //进度条容器
        this.sp = new egret.DisplayObjectContainer();
        this.sp.x = this.stageWidth / 2 - 91;
        this.sp.y = this.stageHeight - 129;
        this.addChild(this.sp);
        //进度条
        this.bartop = new egret.Bitmap();
        this.bartop.texture = RES.getRes("probartop");
        this.bartop.width=1;
        this.sp.addChild(this.bartop);
        
        //加载资源
        Loader.instance.load("welcomeload");
    }
    
    /*
     * 设置进度条
     */
    public setProgress(current, total):void {
        this.bartop.width=current/total*182;
    }
    
    /*
     * 加载完成
     */ 
    public loadComp(){
        this.removeChild(this.barbg);
        this.removeChild(this.sp);
        this.barbg = null;
        this.bartop = null;
        this.sp = null;
        
        this.btn = new egret.Bitmap();
        this.btn.texture = RES.getRes("0ui_btn");
        this.btn.anchorX = 0.5;
        this.btn.x = this.stageWidth / 2;
        this.btn.y = this.stageHeight - 156;
        this.addChild(this.btn);
        this.btn.touchEnabled = true;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchH,this);
    }
    
    /*
     * 清除
     */ 
    private destroy(){
        RES.destroyRes("0ui_bg");
        RES.destroyRes("0ui_btn");
    }
    
    /*
     * 点击开始
     */ 
    private touchH(e:egret.TouchEvent){
        this.btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchH,this);
        Main.instance.init();
        this.destroy();
    }
}
