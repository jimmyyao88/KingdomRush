/**
 *
 * 弓箭手基类
 * @author 
 *
 */
class ArrowShooterBase extends egret.MovieClip{
    /**开始标签*/
    protected startLabel: string;
    /**结束标签*/
    protected endLabel: string;
    /**等待标签*/
    protected idleLabel: string;
    
	public constructor() {
        super();
	}
	
    public onEnterFrame(advancedTime:number){
        if(this.currentLabel == this.endLabel){
            this.gotoAndStop(this.idleLabel);
        }
    }
    	
    /**发射 参数：方向*/
    public fire(direct:string){
        if(direct == "downR"){
            this.startLabel = "shootDown";
            this.endLabel= "shootDownEnd";
            this.idleLabel = "idleDown";
            this.scaleX = 1;
        }else if(direct == "upR"){
            this.startLabel = "shootUp";
            this.endLabel= "shootUpEnd";
            this.idleLabel = "idleUp";
            this.scaleX = 1;
        }else if(direct == "downL"){
            this.startLabel = "shootDown";
            this.endLabel= "shootDownEnd";
            this.idleLabel = "idleDown";
            this.scaleX = -1;
        }else if(direct == "upL"){
            this.startLabel = "shootUp";
            this.endLabel= "shootUpEnd";
            this.idleLabel = "idleUp";
            this.scaleX = -1;
        }
        this.gotoAndPlay(this.startLabel);
        //console.log("fire");
    }
    
}
