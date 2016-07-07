/**
 *
 * 所有塔基类
 * @author 
 *
 */
class TowerBase extends Base {
    /**纹理对象*/
    public bm: egret.Bitmap;
    /**引用场景中的对象层*/
    public contentLayer: egret.Sprite;
    /**位于舞台的坐标x,y(椭圆圆心)*/
    public sx: number;
    public sy: number;
    /**敌人数组*/
    public targets: any[]=[];
    /**进入射程的敌人数组(涉及排序 优先攻击距离终点最近者)*/
    public atargets: any[];
    /**售卖价格*/
    public sellPrice: number;
    
    /**射程范围最大半径*/
    public maxRadius: number = 140;
    /**射程范围最小半径*/
    public minRadius: number = 100;
    /**将圆沿y轴压扁变为椭圆时候的比例*/
    public ratioY: number;
    
    
	public constructor() {
        super();
	}
	
	
    /**销毁自身*/ 
    public destory(){
        
    }
	/**塔初始化*/
	public init(){
	    
	}
	/**实时刷新*/
    public onEnterFrame(advancedTime:number){
                
    }
}
