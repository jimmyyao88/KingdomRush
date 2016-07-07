/**
 *
 * 炮塔基类
 * @author 
 *
 */
class ExploTowerBase extends TowerBase {
    
    /**开火延迟*/
    protected fireDelay: number = 1000;
    /**时间累计*/
    protected timesum: number = 0;
    /**单一目标*/
    protected target: any;
    /**是否开火*/
    protected isfire: boolean = false;
    /**音效资源*/
    protected voiceArr: string[] = ["explo_ready1","explo_ready2","explo_ready3"];
    
    public view: egret.MovieClip;
    
	public constructor() {
        super();
        //播放音效
        var idx = Math.floor(Math.random() * 3);
        SoundManager.playEffect(this.voiceArr[idx]);
	}
	
    /**射击音效*/
    protected playFireVoice(){
        SoundManager.playEffect("explo_firestart1");
    }
	
    /**帧事件*/
    public onEnterFrame(advancedTime: number) {
        //动作播放完成
        if(this.view.currentLabel == "shootEnd"){
            this.view.gotoAndStop("idle");
        }
        //筛选数组(进入范围)
        var i: number;
        this.atargets = [];
        for(i = 0;i < this.targets.length;i++) {
            var obj = this.targets[i];
            //if(obj.target == null) {
                var isin: boolean = Utils.containsXY(obj.x,obj.y,this.sx,this.sy - 22,this.maxRadius,this.ratioY);
                var index = this.atargets.indexOf(obj);
                if(isin && obj.hp > 0) {
                    if(index == -1)
                        this.atargets.push(obj);
                } else {
                    if(index != -1)
                        this.atargets.splice(index,1);
                }
            //}
        }
                        
        //排序、敌人的攻击对象不为null时则排到末尾
        /*for(i = 0;i < this.targets.length;i++) {
            var obj = this.targets[i];
            if(obj.target != null) {
                var isin: boolean = Utils.containsXY(obj.x,obj.y,this.sx,this.sy - 22,this.maxRadius,this.ratioY);
                var index = this.atargets.indexOf(obj);
                if(isin && obj.hp > 0) {
                    if(index == -1)
                        this.atargets.push(obj);
                } else {
                    if(index != -1)
                        this.atargets.splice(index,1);
                }
            }
        }*/
                                
        //进入范围敌人数组为空则直接返回
        //if(this.atargets.length == 0) {
            //this.timesum = this.fireDelay;
            //return;
        //}    
                                
        //取进入范围数组第一个
        //this.target = this.atargets[0];
    }
}
