/**
 *
 * 关卡2
 * @author 
 *
 */
class Guanka06 extends GuankaBase{
    /**怪物行走路径点*/
    private roadArr1: number[][];
    private roadArr2: number[][];
    private roadArr3: number[][];
    private roadArr4: number[][];
    private roadArr5: number[][];
    private roadArr6: number[][];
    
    
    /**构造函数*/
	public constructor() {
        super();
        this.mtime = 250;
        
        //背景地图+网格信息
        this.bm.texture = RES.getRes("map5");
        this.makeGrid("map5json");
        
        //地基位置数组、士兵集结点数组  
        this.basePoseArr = [[163,172],[328,94],[197,291],[321,207],[448,188],[366,283],[368,402],[488,325],[618,281],[566,369]];
        this.soldPointArr = [[185,208],[356,130],[235,217],[255,162],[493,236],[330,313],[385,329],[425,304],[601,212],[502,387]];
        
        //怪物行走路径点数组
        this.roadArr1 = [[-23,263],[87,263],[227,199],[315,299],[400,328],[486,386],[600,410],[644,519]];
        this.roadArr2 = [[326,-9],[339,30],[402,61],[384,119],[263,148],[227,199],[315,299],[400,328],[486,386],[600,410],[644,519]];
        this.roadArr3 = [[824,206],[664,212],[548,203],[466,245],[400,328],[486,386],[600,410],[644,519]];
        this.roadArr4 = [[-23,288],[87,288],[227,224],[315,324],[400,353],[486,411],[600,435],[614,519]];
        this.roadArr5 = [[356,-9],[369,30],[432,61],[414,119],[293,148],[227,224],[315,324],[400,353],[486,411],[600,435],[614,519]];
        this.roadArr6 = [[824,231],[664,237],[548,228],[466,270],[400,353],[486,411],[600,435],[614,519]];
        this.roadArr.push(this.roadArr1);
        this.roadArr.push(this.roadArr2);
        this.roadArr.push(this.roadArr3);
        this.roadArr.push(this.roadArr4);
        this.roadArr.push(this.roadArr5);
        this.roadArr.push(this.roadArr6);
        //所有波敌人数据 （类型、数量、生命、速度、攻击力、价值）
        this.enemyData = [
            {"type":"Monster01","count":10,"life":10,"maxSpeed":0.4,"damage":2,"value":10},
            {"type":"Monster03","count":10,"life":10,"maxSpeed":0.4,"damage":2,"value":15},
            {"type":"Monster12","count":15,"life":15,"maxSpeed":0.4,"damage":4,"value":20},
            {"type":"Monster13","count":15,"life":20,"maxSpeed":0.4,"damage":4,"value":20},
            {"type":"Monster14","count":15,"life":20,"maxSpeed":0.4,"damage":6,"value":25},
            {"type":"Boss01","count":2,"life":300,"maxSpeed":0.4,"damage":16,"value":1000},
            {"type":"Monster08","count":20,"life":25,"maxSpeed":0.4,"damage":6,"value":25},
            {"type":"Monster02","count":20,"life":30,"maxSpeed":0.8,"damage":8,"value":30},
            {"type":"Monster11","count":20,"life":35,"maxSpeed":0.4,"damage":8,"value":30},
            {"type":"Monster12","count":20,"life":40,"maxSpeed":0.4,"damage":10,"value":35},
            {"type":"Boss02","count":2,"life":500,"maxSpeed":0.4,"damage":20,"value":2000}
        ];
        
        //创造UI
        this.createUI();
        
        //创建地基
        this.createBase(Base02);
        
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
        this.gold = 900;
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
        this.roadArr5 = null;
        this.roadArr6 = null;
        
        //取消心跳控制器
        //egret.Ticker.getInstance().unregister(this.onEnterFrame,this);
        console.log("destory guanka02");
	}
}
