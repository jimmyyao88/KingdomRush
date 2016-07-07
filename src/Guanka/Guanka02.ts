/**
 *
 * 关卡2
 * @author 
 *
 */
class Guanka02 extends GuankaBase{
    /**怪物行走路径点*/
    private roadArr1: number[][];
    private roadArr2: number[][];
    private roadArr3: number[][];
    private roadArr4: number[][];
    
    
    /**构造函数*/
	public constructor() {
        super();
        this.mtime = 250;
        
        //背景地图+网格信息
        this.bm.texture = RES.getRes("map1");
        this.makeGrid("map1json");
        
        //地基位置数组、士兵集结点数组  
        this.basePoseArr = [[233,146],[316,113],[413,206],[501,190],[198,314],[357,254],[247,374],[384,314],[519,322],[609,328],[397,424]];
        this.soldPointArr = [[286,175],[332,149],[393,147],[473,128],[283,296],[282,226],[233,421],[316,331],[507,363],[594,371],[382,359]];
        
        //怪物行走路径点数组
        this.roadArr1 = [[-26,410],[274,410],[314,364],[257,259],[287,165],[473,115],[453,-7]];
        this.roadArr2 = [[640,512],[670,432],[615,385],[314,364],[257,259],[287,165],[473,115],[453,-7]];
        this.roadArr3 = [[-26,432],[274,432],[344,342],[287,262],[307,188],[502,115],[482,-7]];
        this.roadArr4 = [[680,512],[696,432],[640,366],[344,342],[287,262],[307,188],[502,115],[482,-7]];
        this.roadArr.push(this.roadArr1);
        this.roadArr.push(this.roadArr2);
        this.roadArr.push(this.roadArr3);
        this.roadArr.push(this.roadArr4);
        //所有波敌人数据 （类型、数量、生命、速度、攻击力、价值）
        this.enemyData = [
            {"type":"Monster01","count":10,"life":10,"maxSpeed":0.4,"damage":2,"value":10},
            {"type":"Monster03","count":10,"life":10,"maxSpeed":0.4,"damage":2,"value":10},
            {"type":"Monster07","count":15,"life":15,"maxSpeed":0.4,"damage":4,"value":15},
            {"type":"Monster08","count":15,"life":20,"maxSpeed":0.4,"damage":4,"value":15},
            {"type":"Monster02","count":15,"life":20,"maxSpeed":0.8,"damage":4,"value":20},
            {"type":"Boss01","count":2,"life":300,"maxSpeed":0.4,"damage":16,"value":600},
            {"type":"Monster09","count":15,"life":25,"maxSpeed":0.4,"damage":6,"value":25},
            {"type":"Monster10","count":20,"life":25,"maxSpeed":0.7,"damage":6,"value":25},
            {"type":"Monster11","count":20,"life":30,"maxSpeed":0.4,"damage":8,"value":30},
            {"type":"Monster12","count":20,"life":35,"maxSpeed":0.4,"damage":8,"value":30},
            {"type":"Boss02","count":2,"life":500,"maxSpeed":0.4,"damage":20,"value":1200}
        ];
        
        //创造UI
        this.createUI();
        
        //创建地基
        this.createBase(Base01);
        
        //初始化
        this.init();
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
        this.gold = 400;
        this.guankaUI.setGold(this.gold);
        this.life = 20;
        this.guankaUI.setLife(this.life);
        this.allBo = this.enemyData.length;
        //区分故事模式还是无尽模式
        if(Main.wujin)
            this.guankaUI.setBos(0,0);
        else
            this.guankaUI.setBos(0,this.allBo);
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
        this.roadArr3 = null;
        this.roadArr4 = null;
        
        //取消心跳控制器
        //egret.Ticker.getInstance().unregister(this.onEnterFrame,this);
        console.log("destory guanka02");
	}
}
