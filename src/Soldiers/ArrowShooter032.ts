/**
 *
 * 弓箭手02 动作资源类
 * @author 
 *
 */
class ArrowShooter032 extends ArrowShooterBase {
    
	public constructor() {
        super();
        this.anchorX = 0.5;
        var data = RES.getRes("ArrowShooter032json");
        var texture = RES.getRes("ArrowShooter032png");
        var mcf: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,texture);
        this.movieClipData = mcf.generateMovieClipData("ArrowShooter03_2");
        
        this.startLabel = "";
        this.endLabel= "";
        this.idleLabel = "idleDown";
        
	}
}
