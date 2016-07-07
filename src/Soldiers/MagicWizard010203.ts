/**
 *
 * 法师01
 * @author 
 *
 */
class MagicWizard010203 extends MagicWizardBase {
    public constructor() {
        super();
        this.anchorX = 0.5;
        var data = RES.getRes("MagicWizard010203json");
        var texture = RES.getRes("MagicWizard010203png");
        var mcf: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,texture);
        this.movieClipData = mcf.generateMovieClipData("MagicWizard010203");

        this.stateLabel = "idleDown";
        this.idleLabel = "idleDown";
    }
}
