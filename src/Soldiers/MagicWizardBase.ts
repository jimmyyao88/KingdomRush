/**
 * 
 * 法师基类
 * @author 
 *
 */
class MagicWizardBase extends egret.MovieClip {
    /**状态标签*/
    protected stateLabel: string;
    /**结束标签*/
    protected endLabel: string;
    /**等待标签*/
    protected idleLabel: string;

    public constructor() {
        super();
    }

    public onEnterFrame(advancedTime: number) {
        this.checkLastEnd(this.stateLabel);
    }
        	
    /**发射 参数：方向*/
    public fire(direct: string) {
        if(direct == "down") {
            this.stateLabel = "shoot_down";
            this.idleLabel = "idleDown";
        } else if(direct == "up") {
            this.stateLabel = "shoot_up";
            this.idleLabel = "idleUp";
        }
        this.gotoAndPlay(this.stateLabel);
    }
    
    /**播放结束检查*/
    protected checkLastEnd(str:string){
        var nextFrameNum:number = this.currentFrame+1;
        var mz: string = this._getFrameLabelForFrame(nextFrameNum).name;
        if( mz != str || this.currentFrame>=this.totalFrames){
            this.gotoAndStop(this.idleLabel);
        }
    }

}
