/**
 *
 * 建造工具
 * @author 
 *
 */
class BuildTool extends egret.Sprite {
    
    private bm: egret.Bitmap;
    private icon: BuildIcon;
    private gold: number;
    
    //根据当前选中对象类型生成建造工具
	public constructor(obj:any,gold:number) {
        super();
        this.cacheAsBitmap = true;
        this.anchorX = this.anchorY = 0.5;
        this.scaleX = this.scaleY = 0.5;
        this.alpha = 0;
        //工具圆圈
        this.bm = Utils.createBitmapByName("yuan");
        this.addChild(this.bm);
        
        //当前关卡拥有金钱
        this.gold = gold;
        //生成建造工具ICON
        this.createTools(obj);
        
        //展开动画
        TweenMax.to(this,0.1,{ alpha: 1,scaleX: 1,scaleY: 1});
	}
	
	/**根据当前选中对象类型生成建造工具*/
	private createTools(obj:any){
    	
        if(obj instanceof Base01 || obj instanceof Base02 || obj instanceof Base03) {//地基01
            this.addIcon("ArrowTower01",-4,-4);
            this.addIcon("ShieldTower01",75,-4);
            this.addIcon("MagicTower01",-4,70);
            this.addIcon("ExploTower01",75,70);
        } else if(obj instanceof ArrowTower01) {//塔------------------01
            if(TowerLevel.ArrowTower["lv01-lv02"])
                this.addIcon("ArrowTower02",36,-14);
            else
                this.addIcon("LockTower",36,-14);
            this.addIcon("SellTower",43,98);
        } else if(obj instanceof ShieldTower01) {//防御塔01
            if(TowerLevel.ShieldTower["lv01-lv02"])
                this.addIcon("ShieldTower02",36,-14);
            else
                this.addIcon("LockTower",36,-14);
            this.addIcon("SellTower",43,98);
        } else if(obj instanceof MagicTower01) {//魔法塔01
            if(TowerLevel.MagicTower["lv01-lv02"])
                this.addIcon("MagicTower02",36,-14);
            else
                this.addIcon("LockTower",36,-14);
            this.addIcon("SellTower",43,98);
        } else if(obj instanceof ExploTower01) {//炮塔01
            if(TowerLevel.ExploTower["lv01-lv02"])
                this.addIcon("ExploTower02",36,-14);
            else
                this.addIcon("LockTower",36,-14);
            this.addIcon("SellTower",43,98);
        } else if(obj instanceof ArrowTower02) {//塔-------------------02
            if(TowerLevel.ArrowTower["lv02-lv03_1"])
                this.addIcon("ArrowTower03_1",0,-14);
            else
                this.addIcon("LockTower",0,-14);
            if(TowerLevel.ArrowTower["lv02-lv03_2"])
                this.addIcon("ArrowTower03_2",72,-14);
            else
                this.addIcon("LockTower",72,-14);
            this.addIcon("SellTower",43,98);
        } else if(obj instanceof ShieldTower02) {
            if(TowerLevel.ShieldTower["lv02-lv03_1"])
                this.addIcon("ShieldTower03_1",0,-14);
            else
                this.addIcon("LockTower",0,-14);
            if(TowerLevel.ShieldTower["lv02-lv03_2"])
                this.addIcon("ShieldTower03_2",72,-14);
            else
                this.addIcon("LockTower",72,-14);
            this.addIcon("SellTower",43,98);
        } else if(obj instanceof MagicTower02) {
            if(TowerLevel.MagicTower["lv02-lv03_1"])
                this.addIcon("MagicTower03_1",0,-14);
            else
                this.addIcon("LockTower",0,-14);
            if(TowerLevel.MagicTower["lv02-lv03_2"])
                this.addIcon("MagicTower03_2",72,-14);
            else
                this.addIcon("LockTower",72,-14);
            this.addIcon("SellTower",43,98);
        } else if(obj instanceof ExploTower02) {
            if(TowerLevel.ExploTower["lv02-lv03_1"])
                this.addIcon("ExploTower03_1",0,-14);
            else
                this.addIcon("LockTower",0,-14);
            if(TowerLevel.ExploTower["lv02-lv03_2"])
                this.addIcon("ExploTower03_2",72,-14);
            else
                this.addIcon("LockTower",72,-14);
            this.addIcon("SellTower",43,98);
        }else{//塔--------------------------------------------------------03_1  03_2
            this.addIcon("SellTower",43,98);
        }
        
	}
	
	/**建造一个icon*/
	private addIcon(type:string,x:number,y:number){
        this.icon = new BuildIcon(type,this.gold);
        this.icon.x = x;
        this.icon.y = y;
        this.icon.touchEnabled = true;
        this.icon.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.iconClickHandle,this);
        this.addChild(this.icon);
	}
	
	/**建造icon点击事件*/
	private iconClickHandle(e:egret.TouchEvent){
        var className = e.currentTarget.className;
        var price = e.currentTarget.price;
        if(this.gold >= price)
        this.dispatchEvent(new ToolEvent(ToolEvent.BUILD_START,className,price));
	}
	
	/**隐藏工具*/
	public hide(){
        var that = this;
        TweenMax.to(that,0.1,{ alpha: 0,scaleX: 0.5,scaleY: 0.5,onComplete: function() { 
            if(that.parent!=null){
                that.parent.removeChild(that);
            }
            }});
	}
}
