/**
 *
 * 箭塔基类
 * @author 
 *
 */
class ArrowTowerBase extends TowerBase {
    /**开火延迟*/
    protected fireDelay: number = 1000;
    /**时间累计*/
    protected timesum: number = 0;
    /**先左或先右*/
    protected firstst: string="R";
    /**射击方向*/
    protected direct: string;
    /**单一目标*/
    protected target: any;
    /**音效资源*/
    protected voiceArr: string[] = ["arrow_ready1","arrow_ready2","arrow_ready3"];
    
	public constructor() {
        super();
        //播放音效
        var idx = Math.floor(Math.random() * 3);
        SoundManager.playEffect(this.voiceArr[idx]);
	}
	
	/**播放射击音效*/
	protected playFireVoice(){
        if(Math.random() > 0.5)
            SoundManager.playEffect("arrow_fire1");
        else
            SoundManager.playEffect("arrow_fire2");
	}
	
	/**帧事件*/
    public onEnterFrame(advancedTime:number){
        //筛选数组(进入范围)
        var i: number;
        this.atargets = [];
        for(i = 0;i < this.targets.length;i++) {
            var obj = this.targets[i];
            if(obj.target == null) {
                var isin: boolean = Utils.containsXY(obj.x,obj.y,this.sx,this.sy - 22,this.maxRadius,this.ratioY);
                var index = this.atargets.indexOf(obj);
                if(isin && obj.hp>0) {
                    if(index == -1)
                        this.atargets.push(obj);
                } else {
                    if(index != -1)
                        this.atargets.splice(index,1);
                }
            }
        }
        
        //排序、敌人的攻击对象不为null时则排到末尾
        for(i = 0;i < this.targets.length;i++) {
            var obj = this.targets[i];
            if(obj.target != null) {
                var isin: boolean = Utils.containsXY(obj.x,obj.y,this.sx,this.sy - 22,this.maxRadius,this.ratioY);
                var index = this.atargets.indexOf(obj);
                if(isin && obj.hp>0) {
                    if(index == -1)
                        this.atargets.push(obj);
                } else {
                    if(index != -1)
                        this.atargets.splice(index,1);
                }
            }
        }
    }
}
