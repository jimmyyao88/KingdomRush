/**
 *
 * 主类
 * @author
 *
 */
class Main extends egret.DisplayObjectContainer {
    /** 加载进度界面*/
    public loadingView:LoadingUI;
    /** 实例*/
    public static instance: Main;
    /**游戏场景容器*/
    private gameLayer:egret.DisplayObjectContainer;
    /**介绍界面*/
    private preload: PreLoad;
    /**主界面*/
    private welcome: Index;
    /**资源组名*/
    private resName: string;
    /**加载界面*/
    private loadBar: LoadBar;
    /**场景堆栈*/
    private views: any[]=[];
    /**键：资源组名  值：场景名*/
    private senceName: any = {"welcomeload":"Index","maps":"World","guanka01load":"Guanka01","guanka02load":"Guanka02","guanka03load":"Guanka03","guanka04load":"Guanka04","guanka05load":"Guanka05","guanka06load":"Guanka06","guanka07load":"Guanka07","guanka08load":"Guanka08","guanka09load":"Guanka09","guanka10load":"Guanka10","guanka11load":"Guanka11","guanka12load":"Guanka12"};
    /**是否第一次加载Index*/
    private loadIndexis1st: boolean = true;
    /**当前挑战关卡索引*/
    public static curIdx: number;
    /**当前挑战关卡模式*/
    public static wujin: boolean = false;
    /**是否第一次加载通用资源*/
    public static loadCommis1st: boolean = true;


    public constructor() {
        super();
        Main.instance = this;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private onAddToStage(event:egret.Event) {
        //获取浏览器宽度
        //console.log(document.body.clientWidth);
        ////设置加载进度界面
        this.loadingView = new LoadingUI();
        this.addChild(this.loadingView);
        ////RES加载类
        Loader.getInstance();
        Loader.instance.addEventListener(LoadEvent.GROUP_COMPLETE,this.loadComp,this);
        Loader.instance.addEventListener(LoadEvent.GROUP_PROGRESS,this.loadprogress,this);
        Loader.instance.init();
        ////移除上一场景
        this.addEventListener(MainEvent.REMOVE,this.removeLast,this);
        ////侦听加载界面调用事件
        this.addEventListener(MainEvent.OPENLOADBAR,this.createLoadBar,this);
        ////侦听加载完成加载场景事件
        this.addEventListener(MainEvent.LOADCOMP,this.addSence,this);
    }

    /*
     * 分组资源加载进度
     */
    private loadprogress(e:LoadEvent){
        var str: string = e.groupName;
        switch(str){
            case "preload":
                this.loadingView.setProgress(e.itemsLoaded, e.itemsTotal);
                break;
            case "welcomeload":
                if(this.loadIndexis1st) {
                    this.preload.setProgress(e.itemsLoaded,e.itemsTotal);
                    break;
                }
            default:
                this.loadBar.setProgress(e.itemsLoaded, e.itemsTotal);
        }
    }

    /*
     * 分组资源加载完成
     */
    private loadComp(e:LoadEvent){
        var str: string = e.groupName;
        switch(str){
            case "preload":
                this.removeChild(this.loadingView);
                this.loadingView = null;
                this.createScene();
                //读取本地游戏配置和储存的数据
                StorageSetting.loadConfig();
                break;
            case "welcomeload":
                if(this.loadIndexis1st) {
                    this.preload.loadComp();
                    this.loadIndexis1st = false;
                    break;
                }
            default:
                if(e.groupName == "uiLoad"){
                    console.log("加载怪物资源");
                    Loader.instance.load("monsterLoad");
                }else if(e.groupName == "monsterLoad"){
                    console.log("加载塔类资源");
                    Loader.instance.load("towerLoad");
                }else if(e.groupName == "towerLoad"){
                    console.log("加载音效资源");
                    Loader.instance.load("soundLoad");
                }else if(e.groupName == "soundLoad"){
                    console.log("加载关卡资源");
                    Loader.instance.load(GuanKaConfig.guankaData[Main.curIdx]);
                } else {
                    this.dispatchEvent(new MainEvent(MainEvent.LOADCOMP,e.groupName));
                    //展开LoadBar
                    this.loadBar.hideLoadBar();
                }
        }
    }

    /*
     * 加载进度条 传递加载资源组名
     */
    private createLoadBar(e:MainEvent){
        this.resName = e.resName;
        this.loadBar = new LoadBar();
        this.addChild(this.loadBar);
    }

    /*
    * 移除上一场景
    */
    private removeLast(e:MainEvent){
        //加载新资源组
        Loader.instance.load(this.resName);
        //移除上一场景
        this.gameLayer.removeChildAt(0);
        var view = this.views.shift();
        view.destroy();
    }

    /*
     * 根据分组资源创建相应关卡
     */
    private addSence(e:MainEvent){
        //反射
        var objClass = egret.getDefinitionByName(this.senceName[e.resName]);
        var obj = new objClass();
        this.gameLayer.addChild(obj);
        this.views.push(obj);
    }

    /**
     * 创建场景界面
     */
    private createScene():void {
        //旋转
        if(egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE){
            this.isRotation = true;
            this.rotation = 90;
            this.x = 480;
        }
        //FPS
        //egret.Profiler.getInstance().run();
        //游戏场景层，游戏场景相关内容可以放在这里面。
        this.gameLayer = new egret.DisplayObjectContainer();
        this.addChild(this.gameLayer);
        //加载加载界面
        this.preload = new PreLoad();
        this.gameLayer.addChild(this.preload);
    }

    /*
     * 移除加载页面 加载主界面
     */
    public init(){
        //console.log("点击开始按钮后移除preload 加载主界面");
        this.gameLayer.removeChildAt(0);
        this.preload = null;
        this.welcome = new Index();
        this.gameLayer.addChild(this.welcome);
        this.views.push(this.welcome);
    }

    /*
    * 判断是否旋转
    */
    private isRotation:boolean = false;
    private onRotation(rotation:number){
        if(this.isRotation&&(rotation == 90 || rotation == -90)){
            this.rotation = 0;
            this.x = 0;
            this.isRotation = false;
            egret.StageDelegate.getInstance().setDesignSize(800, 480);
        }else if(!this.isRotation && (rotation == 0)){
            this.rotation = 90;
            this.x = 480;
            this.isRotation = true;
            egret.StageDelegate.getInstance().setDesignSize(480, 800);
        }
    }
}
