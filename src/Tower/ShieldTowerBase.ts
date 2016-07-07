/**
 *
 * 防御塔基类
 * @author 
 *
 */
class ShieldTowerBase extends TowerBase {
    /**引用场景中的士兵数组*/
    protected objArr: any[];
    /**引用场景中的区域绘制层*/
    public areaLayer: egret.Sprite;
    //创建soldiers的timer
    protected timer: egret.Timer;
    
    /**集结点偏移量数组*/
    protected offArr: number[][] = [[10,0],[0,-10],[-10,0]];
    /**集结点偏移量数组索引*/
    protected offIdx: number = -1;
    /**集结点*/
    public soldPoint: egret.Point;
    
    /**士兵恢复总时间*/
    protected createTime: number = 10000;
    /**时间累计*/
    protected timesum: number = 0;
    
    /**音效资源*/
    protected voiceArr: string[] = ["shield_ready1","shield_ready2","shield_ready3"];
    
	public constructor() {
        super();
        //播放音效
        var idx = Math.floor(Math.random() * 3);
        SoundManager.playEffect(this.voiceArr[idx]);
	}
}
