/**
 *
 * 弓箭手01 动作资源类
 * @author 
 *
 */
class ArrowShooter01 extends ArrowShooterBase {
    
	public constructor() {
        super();
        this.anchorX = 0.5;
        var data = RES.getRes("ArrowShooter01json");
        var texture = RES.getRes("ArrowShooter01png");
        var mcf: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,texture);
        this.movieClipData = mcf.generateMovieClipData("ArrowShooter01");
        
        this.startLabel = "";
        this.endLabel= "";
        this.idleLabel = "idleDown";
        
	}
}
