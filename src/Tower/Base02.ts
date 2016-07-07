/**
 *
 * 地基02
 * @author 
 *
 */
class Base02 extends Base{
    
	public constructor() {
        super();
        this.cacheAsBitmap = true;
        var bm: egret.Bitmap = Utils.createBitmapByName("Base02");
        this.anchorX = 0.5;
        this.anchorY = 1;
        this.addChild(bm);
	}
	
    public onEnterFrame(advancedTime:number){
        
    }
    
    
}
