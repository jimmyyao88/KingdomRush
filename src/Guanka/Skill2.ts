/**
 *
 * 技能-增援
 * @author 
 *
 */
class Skill2 extends SkillBase{
    public atargets: any[]=[];
    
    protected soldiers: any[] = [];
    protected sold1: ZenYuan1;
    protected sold2: ZenYuan2;
    /**集结点偏移量数组*/
    protected offArr: number[][] = [[-10,0],[10,10]];
    /**集结点偏移量数组索引*/
    protected offIdx: number = -1;
    
	public constructor() {
        super();
	}
	
    public init(off:string,on:string,cdtime:number,layer:egret.Sprite){
        this.off = off;
        this.on = on;
        this.cdtime = cdtime;
        this.contentLayer = layer;
        
        this.initbm();
        //技能图片
        this.skillbm.texture = RES.getRes(off);
    }
    
    
    
	/**技能释放*/
	public setPoint(arr:number[]){
        super.setPoint(arr);
        //利用对象池创建增援士兵
        var posarr: number[][];
        this.sold1 = <ZenYuan1>ObjectPool.getInstance().createObject(ZenYuan1);
        this.sold2 = <ZenYuan2>ObjectPool.getInstance().createObject(ZenYuan2);
        this.sold1.life = this.sold2.life = Math.sqrt(GuankaBase.instance.hardxs) * 20;
        this.sold1.damage = this.sold2.damage = Math.sqrt(GuankaBase.instance.hardxs) * 4;
        //加入到引用对象
        this.contentLayer.addChild(this.sold1);
        this.contentLayer.addChild(this.sold2);
        GuankaBase.instance.objArr.push(this.sold1);
        GuankaBase.instance.objArr.push(this.sold2);
        this.soldiers.push(this.sold1);
        this.soldiers.push(this.sold2);
        //坐标偏移
        this.sold1.xoffset = this.offArr[0][0];
        this.sold1.yoffset = this.offArr[0][1];
        this.sold2.xoffset = this.offArr[1][0];
        this.sold2.yoffset = this.offArr[1][1];
        //寻路路径
        posarr= [[arr[0],arr[1]],[arr[0],arr[1]]];
        this.sold1.init(posarr);
        this.sold2.init(posarr);
	}
	
    public onEnterFrame(advancedTime: number) {
        super.onEnterFrame(advancedTime);
        
        //筛选数组(进入塔的范围)
        var i: number;
        this.atargets = [];
        if(GuankaBase.instance.enemyArr.length > 0) {
            for(i = 0;i < GuankaBase.instance.enemyArr.length;i++) {
                var obj = GuankaBase.instance.enemyArr[i];
                var isin: boolean = Utils.containsXY2(obj.x,obj.y);
                var index = this.atargets.indexOf(obj);
                if(isin && obj.hp > 0) {
                    if(index == -1)
                        this.atargets.push(obj);
                } else {
                    if(index != -1)
                        this.atargets.splice(index,1);
                }
            }
        }
        
        if(this.atargets.length > 0) {
            var i: number;
            for(i = 0;i < this.soldiers.length;i++) {
                var sold = this.soldiers[i];
                if(sold.hp <= 0) {
                    this.soldiers.splice(i,1);
                    i--;
                } else {
                    //刷新敌人 数组
                    sold.targets = this.atargets;
                }
            }
        }
    }
    
}
