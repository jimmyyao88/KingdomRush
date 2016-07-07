/**
 *
 * 弓箭手02 动作资源类
 * @author 
 *
 */
class ArrowShooter02 extends ArrowShooterBase {
    
	public constructor() {
        super();
        this.anchorX = 0.5;
        var data = RES.getRes("ArrowShooter02json");
        var texture = RES.getRes("ArrowShooter02png");
        var mcf: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,texture);
        this.movieClipData = mcf.generateMovieClipData("ArrowShooter02");
        
        this.startLabel = "";
        this.endLabel= "";
        this.idleLabel = "idleDown";
        
	}
}
