/**
 *
 * 血条
 * @author 
 *
 */
class LifeBar extends egret.Sprite{
    
    private bg: egret.Bitmap;
    private bar: egret.Bitmap;//18
    
	public constructor() {
        super();
        this.bg = Utils.createBitmapByName("lifeBarBg");
        this.addChild(this.bg);
        this.bar = Utils.createBitmapByName("lifeBar");
        this.addChild(this.bar);
        this.bar.x = this.bar.y = 1;
        
        this.cacheAsBitmap = true;
	}
	
	public setProgress(hp:number,life:number){
        var num: number = 18 * hp / life;
        var per: number = num < 0 ? 0 : num;
        this.bar.width = per;
	}
	
	public reSet(){
        this.bar.width = 18;
	}
}
