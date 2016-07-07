/**
 *
 * 地基01
 * @author 
 *
 */
class Base01 extends Base{
    
	public constructor() {
        super();
        this.cacheAsBitmap = true;
        var bm: egret.Bitmap = Utils.createBitmapByName("empty01");
        this.anchorX = 0.5;
        this.anchorY = 1;
        this.addChild(bm);
	}
	
    public onEnterFrame(advancedTime:number){
        
    }
    
    
}
