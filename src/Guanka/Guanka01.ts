/**
 *
 * 关卡一
 * @author 
 *
 */
class Guanka01 extends GuankaBase{
    /**怪物行走路径点*/
    private roadArr1: number[][];
    private roadArr2: number[][];
    
    
    /**构造函数*/
	public constructor() {
        super();
        this.mtime = 500;
        
        //背景地图+网格信息
        this.bm.texture = RES.getRes("map0");
        this.makeGrid("map0json");
        
        //地基位置数组、士兵集结点数组  
        this.basePoseArr = [[484,266],[436,316],[354,316],[314,266],[354,206],[436,206],[634,316],[394,436],[228,141]];
        this.soldPointArr = [[570,256],[484,361],[304,361],[214,263],[304,141],[484,141],[634,256],[394,371],[284,166]];
        
        //怪物行走路径点数组
        this.roadArr1 = [[812,241],[584,241],[484,141],[304,141],[214,241],[24,241]];
        this.roadArr2 = [[812,263],[584,263],[484,363],[304,363],[214,263],[24,263]];
        this.roadArr.push(this.roadArr1);
        this.roadArr.push(this.roadArr2);
        //所有波敌人数据 （类型、数量、生命、速度、攻击力、价值）
        this.enemyData = [
            {"type":"Monster01","count":10,"life":10,"maxSpeed":0.4,"damage":2,"value":10},
            {"type":"Monster02","count":10,"life":10,"maxSpeed":0.8,"damage":2,"value":10},
            {"type":"Monster03","count":15,"life":15,"maxSpeed":0.4,"damage":4,"value":15},
            {"type":"Monster04","count":15,"life":20,"maxSpeed":0.7,"damage":4,"value":15},
            {"type":"Monster05","count":20,"life":25,"maxSpeed":0.4,"damage":8,"value":20},
            {"type":"Monster06","count":20,"life":30,"maxSpeed":0.4,"damage":8,"value":20},
            {"type":"Boss01","count":2,"life":300,"maxSpeed":0.4,"damage":16,"value":500}
        ];
        
        //创造UI
        this.createUI();
        
        //创建地基
        this.createBase(Base01);
        
        //初始化
        this.init();
        
        //门
        var bm: egret.Bitmap = Utils.createBitmapByName("men");
        bm.x = -33;
        bm.y = 106;
        this.weaponLayer.addChild(bm);
	}
	
    /**初始化各种数据*/
    public init(){
        //初始化各种计算变量
        this.boSum = 0;
        this.hardxs = 1;
        this.hardxs2 = 1;
        this.curBo = -1;
        this.boLeft = -1;
        this.delayToNextSum = 0;
        this.otime = 0;
        this.boing = false;
        //开局金币、剩余生命、波数
        this.gold = 250;
        this.guankaUI.setGold(this.gold);
        this.life = 20;
        this.guankaUI.setLife(this.life);
        this.allBo = this.enemyData.length;
        //区分故事模式还是无尽模式
        if(Main.wujin)
            this.guankaUI.setBos(0,0);
        else
            this.guankaUI.setBos(0,this.allBo);
        //锤子
        var bm: egret.Bitmap = Utils.createBitmapByName("cuizi");
        bm.anchorY = 1;
        bm.x = 360;
        bm.y = 264;
        this.objLayer.addChild(bm);
        this.objArr.push(bm);
        //背景音乐
        SoundManager.playBgSound("map0bg");
        //心跳控制器启动
        egret.Ticker.getInstance().register(this.onEnterFrame,this);
    }
    
    /**实时刷新*/
    protected onEnterFrame(advancedTime: number) {
        super.onEnterFrame(advancedTime);
        //路径
        if(this.boing && this.boLeft>0 && this.otime >= this.mtime-50) {
            //console.log(this.boLeft % 2);
            this.curRoadArr = this.roadArr[this.boLeft % this.roadArr.length];
        }
    }
    
    /**再次尝试*/
    protected tryAgainHandle(e: MainEvent) {
        var i: number;
        //清除所有对象
        while(this.objLayer.numChildren>0){
            this.objLayer.removeChildAt(0);
        }
        //清除工具
        while(this.toolLayer.numChildren>0){
            this.toolLayer.removeChildAt(0);
        }
        //恢复地基侦听
        for(i = 0;i < this.baseArr.length;i++) {
            this.base = this.baseArr[i];
            this.base.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.baseOrTowerTouch,this);
        }
        //数组清零
        this.towerArr = [];
        this.objArr = [];
        this.enemyArr = [];
        this.buildQuene = [];
        //初始化各种数据
        this.init();
    }
    
	/**销毁关卡*/
	public destroy(){
        super.destroy();
        RES.destroyRes(GuanKaConfig.guankaData[Main.curIdx]);
        
        this.roadArr1 = null;
        this.roadArr2 = null;
        
        //取消心跳控制器
        //egret.Ticker.getInstance().unregister(this.onEnterFrame,this);
        console.log("destory guanka01");
	}
}
