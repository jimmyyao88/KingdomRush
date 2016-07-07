/**
 *
 * 防御塔01
 * @author 
 *
 */
class ShieldTower01 extends ShieldTowerBase {
    //三位soldiers
    protected soldiers: ShieldSoldier01[] = [];
    protected sold: ShieldSoldier01;
    
    public constructor() {
        super();
        this.minRadius = 100;
        this.maxRadius = 140;
        this.ratioY = this.minRadius / this.maxRadius;
        this.anchorX = 0.5;
        this.anchorY = 1;
        this.bm = Utils.createBitmapByName("ShieldTower01");
        this.addChild(this.bm);
    }
    
    /**初始化 3个士兵*/
    public init(){
        this.timer = new egret.Timer(1000,3);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.createSold,this);
        this.timer.start();
    }
    
    /**timer对象池产生士兵*/
    private createSold(e:egret.TimerEvent){
        var posarr: number[][];
        this.sold = <ShieldSoldier01>ObjectPool.getInstance().createObject(ShieldSoldier01);
        this.sold.life = 15;
        this.sold.damage = 2;
        //加入到引用对象
        this.contentLayer.addChild(this.sold);
        this.objArr.push(this.sold);
        this.soldiers.push(this.sold);
        this.addIdx();
        //坐标偏移
        this.sold.xoffset = this.offArr[this.offIdx][0];
        this.sold.yoffset = this.offArr[this.offIdx][1];
        //寻路路径
        posarr= [[this.sx,this.sy],[this.soldPoint.x,this.soldPoint.y]];
        this.sold.init(posarr);
        //集合操作自定义事件
        this.sold.addEventListener(SoldEvent.SELECT,this.allSelect,this);
        this.sold.addEventListener(SoldEvent.DESELECT,this.allDeSelect,this);
        this.sold.addEventListener(SoldEvent.MOVE,this.allMove,this);
    }
    
    /**集结点偏移量数组索引*/
    private addIdx(){
        this.offIdx++;
        if(this.offIdx > 2)
            this.offIdx = 0;
    }
    
    /**选中所有*/
    private allSelect(e:SoldEvent){
        //画绘制区域
        /*
        var sp: egret.Shape = Utils.drawEllipse(this.maxRadius * 2,this.minRadius * 2,0x009900,true);
        sp.x = this.x - this.maxRadius;
        sp.y = this.y - this.minRadius-22;
        this.areaLayer.addChild(sp);
        */
        //console.log(this.areaLayer.numChildren);
        
        var i = 0;
        var len = this.soldiers.length;
        var sold: ShieldSoldier01;
        for(i;i < len;i++) {
            sold = this.soldiers[i];
            sold.createYQ();
        }
    }
    /**取消选中所有*/
    private allDeSelect(e:SoldEvent){
        //清除区域绘制
        while(this.areaLayer.numChildren>0){
            this.areaLayer.removeChildAt(0);
        }
        
        var i = 0;
        var len = this.soldiers.length;
        var sold: ShieldSoldier01;
        for(i;i < len;i++) {
            sold = this.soldiers[i];
            sold.clearYQ();
        }
    }
    /**移动所有*/
    private allMove(e:SoldEvent){
        //清除区域绘制
        while(this.areaLayer.numChildren>0){
            this.areaLayer.removeChildAt(0);
        }
        
        var arr:number[] = e.arr;
        //超出移动范围
        var isin: boolean = Utils.containsXY(arr[0],arr[1],this.sx,this.sy-22,this.maxRadius,this.ratioY);
        if(!isin){
            return;
        }
        //新的集结点
        this.soldPoint = new egret.Point(arr[0],arr[1]+8);
        //移动所有士兵
        var i = 0;
        var len = this.soldiers.length;
        var sold: ShieldSoldier01;
        for(i;i < len;i++) {
            sold = this.soldiers[i];
            this.soldiers[i].setPath([this.soldPoint.x,this.soldPoint.y]);
        }
    }
    
    
    /*
     * 销毁自身 销毁对应士兵 停止创建timer
     */ 
    public destory(){
        //清除区域绘制
        while(this.areaLayer.numChildren>0){
            this.areaLayer.removeChildAt(0);
        }
        
        if(this.timer != null){
            this.timer.removeEventListener(egret.TimerEvent.TIMER,this.createSold,this);
            this.timer.stop();
            this.timer = null;
        }
        var sold: ShieldSoldier01;
        for(var i = 0;i < this.soldiers.length;i++) {
            sold = this.soldiers[i];
            sold.removeEventListener(SoldEvent.SELECT,this.allSelect,this);
            sold.removeEventListener(SoldEvent.DESELECT,this.allDeSelect,this);
            sold.removeEventListener(SoldEvent.MOVE,this.allMove,this);
            sold.canClear = true;
        }
        this.soldiers = [];
        this.atargets = [];
    }
    
    /**实时刷新*/
    public onEnterFrame(advancedTime:number){
        //筛选数组(进入塔的范围)
        var i: number;
        this.atargets = [];
        if(this.targets.length > 0) {
            for(i = 0;i < this.targets.length;i++) {
                var obj = this.targets[i];
                var isin: boolean = Utils.containsXY(obj.x,obj.y,this.sx,this.sy-22,this.maxRadius,this.ratioY);
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
        
        //士兵数量<3则生产士兵
        if(this.soldiers.length<3){
            this.timesum += advancedTime;
            if(this.timesum>=this.createTime){
                this.timesum = 0;
                this.createSold(null);
            }
        }else{
            this.timesum = 0;
        }
        
        //实时刷新士兵敌人数组
        var sold: ShieldSoldier01;
        for(i = 0;i < this.soldiers.length;i++) {
            sold = this.soldiers[i];
            if(sold.hp <= 0) {
                sold.removeEventListener(SoldEvent.SELECT,this.allSelect,this);
                sold.removeEventListener(SoldEvent.DESELECT,this.allDeSelect,this);
                sold.removeEventListener(SoldEvent.MOVE,this.allMove,this);
                this.soldiers.splice(i,1);
                i--;
            } else {
                //刷新敌人 数组
                sold.targets = this.atargets;
            }
        }
    }

}