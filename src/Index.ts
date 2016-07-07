/**
 *
 * 主界面
 * @author 
 *
 */
class Index extends egret.DisplayObjectContainer{
    
    private bg: egret.Bitmap;
    
    private logo: egret.Bitmap;
    
    private dropsp: egret.Sprite;
    
    private liantiao: egret.Bitmap;
    
    private btn: egret.Bitmap;
    
    
    private stageWidth: number;
    private stageHeight: number;
    
    private sdbg: egret.Sound;
    
	public constructor() {
        super();
        this.stageWidth = GameSetting.swid;
        this.stageHeight = GameSetting.shei;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        //播放bgsound
        SoundManager.playBgSound("gamebgsound");
	}
	public init(){
	    
	}
    private onAddToStage(event: egret.Event) {
        //图片背景
        this.bg = new egret.Bitmap();
        this.bg.texture = RES.getRes("welbg");
        this.bg.alpha = 0;
        this.addChild(this.bg);
        egret.Tween.get(this.bg).wait(500).to({ alpha: 1 },800);
        
        //logo
        this.logo = new egret.Bitmap();
        this.logo.texture = RES.getRes("wellogo");
        this.logo.anchorX = 0.5;
        this.logo.anchorY = 1;
        this.logo.x = this.stageWidth / 2;
        this.logo.y = -this.logo.height;
        this.addChild(this.logo);
        
        TweenMax.fromTo(this.logo,0.2,{y:-this.logo.height,scaleX:0.1,rotation:40},{delay:1.3,y:this.stageHeight/2+70,scaleX:1,rotation:0,ease:Circ.easeOut});
        //TweenMax.to(this.logo,0.1,{scaleX:0.9,yoyo:true,repeat:1,delay:1.45});
        //TweenMax.to(this.logo,0.1,{scaleY:1.1,yoyo:true,repeat:1,delay:1.46,onComplete:this.showLiantiao,onCompleteParams:[this]});
        
        //this.logo.scaleX = 0.1;
        //this.logo.rotation = 40;
        //egret.Tween.get(this.logo).wait(1300).to({ y: this.stageHeight / 2 + 70 },500,egret.Ease.bounceOut);
        egret.Tween.get(this.logo).wait(1450).to({ scaleX: 0.9 },100).to({ scaleX: 1 },100);
        egret.Tween.get(this.logo).wait(1460).to({ scaleY: 1.1 },100).to({ scaleY: 1 },100).call(this.showLiantiao,this);
        //链条
        
    }
    
    private showLiantiao(){
        this.dropsp = new egret.Sprite();
        this.dropsp.x = this.stageWidth / 2;
        this.dropsp.y = this.logo.y-30;
        this.addChildAt(this.dropsp,1);
        //liantiao
        this.liantiao = new egret.Bitmap();
        this.liantiao.texture = RES.getRes("liantiao");
        this.liantiao.anchorX = 0.5;
        this.liantiao.anchorY = 1;
        this.dropsp.addChild(this.liantiao);
        //btn
        this.btn = new egret.Bitmap();
        this.btn.texture = RES.getRes("welbtn");
        this.btn.anchorX = 0.5;
        this.btn.anchorY = 1;
        this.dropsp.addChild(this.btn);
        //move  改成TweenMax
        egret.Tween.get(this.dropsp).to({ y: this.logo.y+110},600,egret.Ease.bounceOut).call(this.addLis,this);
    }
    private addLis(){
        this.btn.touchEnabled = true;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.btnCkH,this);
    }
    private btnCkH(e:egret.TouchEvent){
        this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.btnCkH,this);
        //打开加载进度界面 加载资源下一场景
        Main.instance.dispatchEvent(new MainEvent(MainEvent.OPENLOADBAR,"maps"));
        //停止音效
        SoundManager.stopBgSound();
    }
    
    /*
    * 清除
    */ 
    public destroy(){
        RES.destroyRes("welbg");
        RES.destroyRes("wellogo");
        RES.destroyRes("liantiao");
        RES.destroyRes("welbtn");
    }
	
}
