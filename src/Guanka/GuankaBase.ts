/**
 *
 * 关卡场景基类
 * @author 
 *
 */
class GuankaBase extends egret.Sprite{
    public static instance: GuankaBase;
    /**地图位图*/
    public bm: egret.Bitmap;
    /**节点变长*/
    protected _cellSize: number;
    /**节点网格*/
    protected _grid: Grid;
    /**建造工具*/
    protected tool: BuildTool;
    
    /**地基*/
    protected base: Base;
    /**地基数组*/
    protected baseArr: Base[];
    /**地基坐标数组*/
    protected basePoseArr: number[][];
    /**防御塔集结点数组,对应地基的baseIdx*/
    protected soldPointArr: number[][];
    /**塔数组*/
    protected towerArr: any[];
    /**建造队列*/
    protected buildQuene: any[];
    /**显示对象层级排序数组*/
    public objArr: any[];
    /**敌人数组*/
    public enemyArr: any[];
    
    /**地基层*/
    protected baseLayer: egret.Sprite;
    /**范围层*/
    protected areaLayer: egret.Sprite;
    /**怪物层、士兵层、英雄层、塔层(层级排序)*/
    public objLayer: egret.Sprite;
    /**弓箭、炮弹层*/
    public weaponLayer: egret.Sprite;
    /**工具层*/
    protected toolLayer: egret.Sprite;
    /**UI特效 提示层*/
    protected uiLayer: egret.Sprite;
    /**关卡UI对象*/
    protected guankaUI: GuanKaUI;
    
    
    /**被选中地基x坐标*/
    protected curX: number;
    /**被选中地基y坐标*/
    protected curY: number;
    /**被选中地基相对于集合点数组的索引*/
    protected baseIdx: number;
    /**上一个选择的塔或则地基*/
    protected oldSelect:any;
    
    /**Gold*/
    protected gold: number;
    /**Life*/
    protected life: number;
    
    /**无尽模式累计波数*/
    protected boSum: number;
    
    
    /**无尽模式难度累加系数*/
    protected perxs: number = 1;
    protected perxs2: number = 0.1;
    /**难度系数*/
    public hardxs: number = 1;
    public hardxs2: number = 1;
    
    /**总波数*/
    protected allBo: number = 2;
    /**当前波->指针*/
    protected curBo: number = -1;
    /**敌人类别*/
    protected boType: string;
    /**当前波剩余数量*/
    protected boLeft: number = -1;
    /**当前波敌人生命*/
    protected boLife: number;
    /**当前波敌人速度*/
    protected boSpeed: number;
    /**当前波敌人攻击力*/
    protected boDamage: number;
    /**当前波敌人价值*/
    protected value: number;
    /**波进行中*/
    protected boing: boolean = false;
    /**到下一波的间隔时间*/
    protected delayToNext: number = 1000;
    /**到下一波的时间累计*/
    protected delayToNextSum: number = 0;
    /**怪物产生时间差*/
    protected otime: number = 0;
    /**怪物产生间隔*/
    protected mtime: number = 500;
    
    
    /**怪物行走路径点数组*/
    protected roadArr: number[][][]=[];
    protected curRoadArr: number[][];
    
    /**所有波敌人数据 （类型、数量、生命、速度、攻击力、价值）*/
    protected enemyData: any[];
    
    
	public constructor() {
        super();
        GuankaBase.instance = this;
        //初始化各种数据
        this.baseArr = [];
        this.towerArr = [];
        this.buildQuene = [];
        this.objArr = [];
        this.enemyArr = [];
        //背景地图
        this.bm = new egret.Bitmap();
        this.addChild(this.bm);
        this.bm.touchEnabled = true;
        this.bm.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.bgMapClick,this);
        //地基层
        this.baseLayer = new egret.Sprite();
        this.addChild(this.baseLayer);
        //范围层
        this.areaLayer = new egret.Sprite();
        this.addChild(this.areaLayer);
        //怪物层、士兵层、英雄层、塔层(层级排序)
        this.objLayer = new egret.Sprite();
        this.addChild(this.objLayer);
        //添加武器层
        this.weaponLayer = new egret.Sprite();
        this.addChild(this.weaponLayer);
        //添加工具层
        this.toolLayer = new egret.Sprite();
        this.addChild(this.toolLayer);
        //添加UI层
        this.uiLayer = new egret.Sprite();
        this.addChild(this.uiLayer);
	}
	
    //================================
    /**背景地图被点击*/
    protected bgMapClick(e: egret.TouchEvent) {
        var obj = Group.selectedItem;
        if(obj == null)
            return;
        var basename = egret.getQualifiedSuperclassName(obj);
        if(basename == "Base" || basename == "ArrowTowerBase" || basename == "ShieldTowerBase" || basename == "MagicTowerBase" || basename == "ExploTowerBase") {
            this.hideTool(null);
        } else if(basename == "ShieldSoldierBase" || basename == "SkillBase") {
            //判断点击的地方是否可移动 不可移动直接return 否则继续执行
            obj.deselectItem();//取消所有士兵的选中
            var px = Math.round(e.localX);
            var py = Math.round(e.localY);
            //判断点击坐标转换格子坐标是否可通行
            if(this.checkPoint(px,py))
                obj.setPoint([px,py]);//设置新的集结点并移动
        }
        Group.dispose();
    }
    //================================
    
    /**地图网格*/
    protected makeGrid(path:string): void {
        //解析地图json
        var str = RES.getRes(path);
        var i: number;
        var j: number;
        var col: number = str.MapData.length;//列数
        var row: number = str.MapData[0].length;//行数
        this._cellSize = str.TileWidth;//边长
        this._grid = new Grid(col,row);
        for(i = 0;i < col;i++){
            for(j = 0;j < row;j++){
                if(str.MapData[i][j].val == 1) {
                    this._grid.setWalkable(i,j,false);
                }
            }
        }
    }
    /**检查点击网格是否可通过*/
    protected checkPoint(xnum:number,ynum:number):boolean{
        var xpos: number = Math.floor(xnum / this._cellSize);
        var ypos: number = Math.floor(ynum / this._cellSize);
        var endNp: NodePoint = this._grid.getNode(xpos,ypos);
        if(endNp.walkable == false)
            return false;
        else
            return true;
    }
    
    /**创造UI*/
    protected createUI(){
        this.guankaUI = new GuanKaUI(this.weaponLayer,this.objLayer);
        this.uiLayer.addChild(this.guankaUI);
        //侦听再次尝试、退出
        this.uiLayer.addEventListener(MainEvent.TRYAGAIN,this.tryAgainHandle,this);
        this.uiLayer.addEventListener(MainEvent.QUITGUANKA,this.quitHandle,this);
        
        //延迟多少s显示UI
        var that = this;
        TweenMax.delayedCall(1.2,function() { 
                that.guankaUI.showUI();
            });
        
    }
    
	
    /**创建地基*/
    protected createBase(classFactory:any){
        for(var i = 0;i < this.basePoseArr.length;i++) {
            this.base = new classFactory();
            this.base.x = this.basePoseArr[i][0];
            this.base.y = this.basePoseArr[i][1];
            this.base.baseIdx = i;
            this.baseLayer.addChild(this.base);
            this.baseArr.push(this.base);
            this.base.touchEnabled = true;
            this.base.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.baseOrTowerTouch,this);
            this.base.addEventListener(TowerEvent.SHOWTOOL,this.showTool,this);
            this.base.addEventListener(TowerEvent.HIDETOOL,this.hideTool,this);
        }
    }
    
    /**地基、塔 被点击*/
    protected baseOrTowerTouch(e:egret.TouchEvent){
        //鼠标互斥管理
        Group.selectItem(e.currentTarget);
    }
    
    /**出现建造工具*/
    protected showTool(e: TowerEvent) {
        var obj = e.currentTarget;
        this.oldSelect = obj;
        //建立建造工具
        this.tool = new BuildTool(e.obj,this.gold);
        this.tool.x = obj.x;
        this.tool.y = obj.y - 17;
        this.toolLayer.addChild(this.tool);
        //侦听该工具选项被点击
        this.tool.addEventListener(ToolEvent.BUILD_START,this.buildStart,this);
        //画区域绘制
        var baseName = egret.getQualifiedSuperclassName(this.oldSelect);
        if(baseName != "Base" && baseName != "ShieldTowerBase") {
            /*
            var sp: egret.Shape = Utils.drawEllipse(this.oldSelect.maxRadius * 2,this.oldSelect.minRadius * 2,0x009900,true);
            sp.x = obj.x - this.oldSelect.maxRadius;
            sp.y = obj.y - this.oldSelect.minRadius - 22;
            this.areaLayer.addChild(sp);
            */
        }
    }
            
    /**隐藏建造工具*/
    protected hideTool(e: TowerEvent) {
        //清除区域绘制
        while(this.areaLayer.numChildren > 0) {
            this.areaLayer.removeChildAt(0);
        }
        //清除建造工具
        if(this.tool == null)
            return;
        this.tool.removeEventListener(ToolEvent.BUILD_START,this.buildStart,this);
        this.tool.hide();
        this.tool = null;
    }
	
    /**开始建筑(修建 升级 sell)*/
    protected buildStart(e: ToolEvent) {
        //记录坐标
        this.curX = this.oldSelect.x;
        this.curY = this.oldSelect.y;
        this.baseIdx = this.oldSelect.baseIdx;
                
        //显示建造等待动画 若等于第一级则新建
        var name = e.className;
        if(name == "ArrowTower01" || name == "ShieldTower01" || name == "MagicTower01" || name == "ExploTower01") {
            //修建动画
            var buildWait: BuildWait = new BuildWait(name);
            buildWait.x = this.curX;
            buildWait.y = this.curY;
            this.objLayer.addChild(buildWait);
            buildWait.addEventListener(ToolEvent.BUILD_COMP,this.buildComp,this);
            //减掉金钱e.price
            this.gold -= e.price;
            this.guankaUI.setGold(this.gold);
            //加入建造队列
            var obj: any = {};
            obj.className = e.className;
            obj.x = this.curX;
            obj.y = this.curY;
            obj.baseIdx = this.baseIdx;
            this.buildQuene.push(obj);
        } else if(name == "SellTower") {//sell
            var towerName:string = egret.getQualifiedClassName(this.oldSelect);
            //获得金钱(塔价格的三分之一)
            this.gold += Math.round(TowerLevel.dic[towerName].price / 3);
            this.guankaUI.setGold(this.gold);
            //console.log(this.gold);
            //加钱特效
            
            //恢复地基侦听
            this.baseArr[this.baseIdx].addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.baseOrTowerTouch,this);
            
            //卖掉音效
            SoundManager.playEffect("sell_tower");
        } else if(name == "LockTower") {//lock
            //锁定 do nothing
            //TIP 升级项目锁定了，攒到星星后前往升级面板解锁。
            
            return;
        } else {//upgrade
            //升级
            this.buildTower(this.oldSelect,name);
            //减掉金钱e.price
            this.gold -= e.price;
            this.guankaUI.setGold(this.gold);
        }
                    
        //移除工具
        Group.dispose();
        this.hideTool(null);
                    
        //移除上一个塔 移除侦听 并从数组中删除
        this.oldSelect.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.baseOrTowerTouch,this);
        if(egret.getQualifiedSuperclassName(this.oldSelect) != "Base") {//地基
            this.objLayer.removeChild(this.oldSelect);
            //从对象数组移除
            var index = this.objArr.indexOf(this.oldSelect);
            if(index != -1) {
                this.objArr.splice(index,1);
            }
            //从塔数组移除
            index = this.towerArr.indexOf(this.oldSelect);
            if(index != -1) {
                this.towerArr.splice(index,1);
            }
            //销毁塔以及内部对象
            this.oldSelect.destory();
        }
        this.oldSelect = null;
    }
        	
    /**修建建筑完成*/
    protected buildComp(e: ToolEvent) {
        //从舞台删除修建动画
        var ta = e.currentTarget;
        ta.removeEventListener(ToolEvent.BUILD_COMP,this.buildComp,this);
        this.objLayer.removeChild(ta);
        ta = null;
        //反射 className
        var obj = this.buildQuene.shift();
        this.buildTower(obj,obj.className);
    }
    
    /**创建塔*/
    protected buildTower(obj:any,towerName:string){
        //反射 建立新塔 加入数组 添加侦听
        var objClass = egret.getDefinitionByName(towerName);
        var newta = new objClass();
                            
        ////塔基于舞台的坐标 武器层或对象层 赋值敌人数组
        newta.sx = newta.x = obj.x;
        newta.sy = newta.y = obj.y;
        newta.targets = this.enemyArr;
        newta.baseIdx = obj.baseIdx;
        //根据塔的基类来分配其子对象层
        var parentName = egret.getQualifiedSuperclassName(newta);
        if(parentName == "ArrowTowerBase" || parentName == "ExploTowerBase" || parentName == "MagicTowerBase") {
            newta.contentLayer = this.weaponLayer;
        } else if(parentName == "ShieldTowerBase") {
            newta.objArr = this.objArr;
            newta.contentLayer = this.objLayer;
            newta.areaLayer = this.areaLayer;
            //获得相对索引的集结点
            newta.soldPoint = new egret.Point(this.soldPointArr[newta.baseIdx][0],this.soldPointArr[newta.baseIdx][1]);
        }
        
        this.objLayer.addChild(newta);//加入对象层
        this.objArr.push(newta);//加入对象数组
        this.towerArr.push(newta);//加入塔数组
        newta.touchEnabled = true;
        newta.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.baseOrTowerTouch,this);
        newta.addEventListener(TowerEvent.SHOWTOOL,this.showTool,this);
        newta.addEventListener(TowerEvent.HIDETOOL,this.hideTool,this);
        newta.init();
    }
    
    /**实时刷新*/
    protected onEnterFrame(advancedTime: number) {
        //判断敌人是否死亡或逃脱，更新敌人数组
        this.removeEnemies();
        this.createEnemies(advancedTime);
        //实时刷新本方塔
        this.enterFrameTowers(advancedTime);
        //
        if(this.guankaUI)
            this.guankaUI.onEnterFrame(advancedTime);
        //实时刷新排序数组(根据y轴改变对象层级)
        this.objArr = Utils.sortarr(this.objArr);
        for(var i = 0;i < this.objArr.length;i++) {
            var obj = this.objArr[i];
            if(this.objLayer.contains(obj))
            this.objLayer.setChildIndex(obj,i);
        }

    }
    
    /**回收敌人*/
    protected removeEnemies() {
        var i: number;
        for(i = 0;i < this.enemyArr.length;i++) {
            var tar = this.enemyArr[i];
            if(tar.canClear) {
                this.enemyArr.splice(i,1);
                //如果属于被杀死则增加金币、否则则减掉本方剩余生命
                if(tar.beKill) {
                    this.gold += tar.value;
                    this.guankaUI.setGold(this.gold);
                } else {
                    this.life -= 1;
                    this.guankaUI.setLife(this.life);
                    //如果life == 0 则游戏结束
                    if(this.life == 0)
                        this.lose();
                }                                           
                //波数量为0时表示当前波完成
                if(this.boing && this.enemyArr.length == 0) {
                    //console.log("clear");
                    //最后一波
                    if(this.curBo == this.allBo - 1) {
                        //判断无尽模式
                        if(Main.wujin){
                            this.curBo = -1;
                            this.boSum += this.allBo;
                            this.hardxs += this.perxs;
                            this.hardxs2 += this.perxs2;
                            this.boing = false;
                        }else{
                            //胜利
                            if(this.life > 0)
                                this.victory();
                        }
                    } else {
                        //每波难度
                        
                        this.boing = false;
                    }
                }
            }
        }
        for(i = 0;i < this.objArr.length;i++) {
            var tar = this.objArr[i];
            if(tar.canClear) {
                this.objArr.splice(i,1);
            }
        }
    }
    
    /**创建波*/
    protected createEnemies(advancedTime: number) {
        //等待或则创建敌人
        if(!this.boing) {//判断波数
            this.delayToNextSum += advancedTime;
            if(this.delayToNextSum >= this.delayToNext) {
                this.delayToNextSum = 0;
                this.otime = 0;
                //判断波数
                this.curBo++;
                if(this.curBo < this.allBo) {
                    this.boing = true;
                    //敌人类别
                    this.boType = this.enemyData[this.curBo]["type"];
                    //剩余敌人数量
                    this.boLeft = this.enemyData[this.curBo]["count"];
                    //敌人生命
                    this.boLife = this.enemyData[this.curBo]["life"] * this.hardxs;
                    //敌人速度
                    this.boSpeed = this.enemyData[this.curBo]["maxSpeed"];
                    //敌人攻击力
                    this.boDamage = this.enemyData[this.curBo]["damage"] * this.hardxs;
                    //敌人价值
                    this.value = this.enemyData[this.curBo]["value"];
                                        
                    //UI显示当前波数/总波数（区分故事模式还是无尽模式）
                    if(Main.wujin) {
                        this.guankaUI.setBos(this.curBo + 1 + this.boSum,this.curBo + 1 + this.boSum);
                        StorageSetting.setGuankaWujin(Main.curIdx,this.boSum + this.curBo);
                    } else {
                        this.guankaUI.setBos(this.curBo + 1,this.allBo);
                    }
                    //波开始音效
                    SoundManager.playEffect("bo_start");
                }
            }
        } else {//产生敌人
            if(this.boLeft == 0)
                return;
            //间隔产生敌人
            this.otime += advancedTime;
            if(this.otime < this.mtime)
                return;
            this.otime = 0;
            //行走路径
            //var arr = this.boLeft % 2 == 0 ? this.roadArr1 : this.roadArr2;
            //console.log(this.roadArr);
            this.addEnemys(advancedTime,this.boType,this.curRoadArr);
            this.boLeft -= 1;
        }
    }
            	
    /**产生敌人*/
    protected addEnemys(advancedTime: number,classFactory: string,roadArr: number[][] = null) {
        var sp = <Monster01>ObjectPool.getInstance().createObject(Monster01);
        sp.addTexture(classFactory);
        sp.init(roadArr,this.boLife,this.boSpeed,this.boDamage,this.value);
        this.objLayer.addChild(sp);
        this.objArr.push(sp);
        this.enemyArr.push(sp);
    }
    
    /**实时刷新本方塔*/
    protected enterFrameTowers(advancedTime: number) {
        var len = this.towerArr.length;
        var obj: any;
        for(var i = 0;i < len;i++) {
            obj = this.towerArr[i];
            obj.onEnterFrame(advancedTime);
        }
    }
    
    /**退出关卡*/
    protected quitHandle(e: MainEvent) {
        //打开loader界面加载地图界面
        Main.instance.dispatchEvent(new MainEvent(MainEvent.OPENLOADBAR,"maps"));
    }
    
    /**再次尝试*/
    protected tryAgainHandle(e: MainEvent) {}
    
    /**关卡胜利*/
    protected victory() {
        this.clear();
        this.guankaUI.showVictory();
        //更新关卡通关数据、塔升级数据
        StorageSetting.setGuankaPass(Main.curIdx);
        StorageSetting.setTowerUpgrade(Main.curIdx);
    }
            
    /**关卡失败*/
    protected lose() {
        this.clear();
        this.guankaUI.showLose();
        //更新关卡数据
        //if(Main.wujin){
            //StorageSetting.setGuankaWujin(Main.curIdx,this.boSum+this.curBo);
        //}
    }
                
    /**清除*/
    public clear() {
        //停止背景音乐
        SoundManager.stopBgSound();
        //暂停心跳控制器
        egret.Ticker.getInstance().unregister(this.onEnterFrame,this);
        //清空对象池
        ObjectPool.getInstance().destroyAllObject();
    }
    
    /**销毁关卡*/
    public destroy(){
        this.roadArr = null;
        this.curRoadArr = null;
        this.baseArr = null;
        this.basePoseArr = null;
        this.soldPointArr = null;
        this.enemyData = null;
        this.towerArr = null;
        this.objArr = null;
        this.enemyArr = null;
        //关闭心跳控制器
        //销毁对象池
        ObjectPool.getInstance()._pool = {};
        //删除UI
        
    }
}
