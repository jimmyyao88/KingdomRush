var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.views = [];
        this.senceName = { "welcomeload": "Index", "maps": "World", "guanka01load": "Guanka01", "guanka02load": "Guanka02", "guanka03load": "Guanka03", "guanka04load": "Guanka04", "guanka05load": "Guanka05", "guanka06load": "Guanka06", "guanka07load": "Guanka07", "guanka08load": "Guanka08", "guanka09load": "Guanka09", "guanka10load": "Guanka10", "guanka11load": "Guanka11", "guanka12load": "Guanka12" };
        this.loadIndexis1st = true;
        this.isRotation = false;
        Main.instance = this;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    Main.prototype.onAddToStage = function (event) {
        this.loadingView = new LoadingUI();
        this.addChild(this.loadingView);
        Loader.getInstance();
        Loader.instance.addEventListener(LoadEvent.GROUP_COMPLETE, this.loadComp, this);
        Loader.instance.addEventListener(LoadEvent.GROUP_PROGRESS, this.loadprogress, this);
        Loader.instance.init();
        this.addEventListener(MainEvent.REMOVE, this.removeLast, this);
        this.addEventListener(MainEvent.OPENLOADBAR, this.createLoadBar, this);
        this.addEventListener(MainEvent.LOADCOMP, this.addSence, this);
    };
    Main.prototype.loadprogress = function (e) {
        var str = e.groupName;
        switch (str) {
            case "preload":
                this.loadingView.setProgress(e.itemsLoaded, e.itemsTotal);
                break;
            case "welcomeload":
                if (this.loadIndexis1st) {
                    this.preload.setProgress(e.itemsLoaded, e.itemsTotal);
                    break;
                }
            default:
                this.loadBar.setProgress(e.itemsLoaded, e.itemsTotal);
        }
    };
    Main.prototype.loadComp = function (e) {
        var str = e.groupName;
        switch (str) {
            case "preload":
                this.removeChild(this.loadingView);
                this.loadingView = null;
                this.createScene();
                StorageSetting.loadConfig();
                break;
            case "welcomeload":
                if (this.loadIndexis1st) {
                    this.preload.loadComp();
                    this.loadIndexis1st = false;
                    break;
                }
            default:
                if (e.groupName == "uiLoad") {
                    console.log("加载怪物资源");
                    Loader.instance.load("monsterLoad");
                }
                else if (e.groupName == "monsterLoad") {
                    console.log("加载塔类资源");
                    Loader.instance.load("towerLoad");
                }
                else if (e.groupName == "towerLoad") {
                    console.log("加载音效资源");
                    Loader.instance.load("soundLoad");
                }
                else if (e.groupName == "soundLoad") {
                    console.log("加载关卡资源");
                    Loader.instance.load(GuanKaConfig.guankaData[Main.curIdx]);
                }
                else {
                    this.dispatchEvent(new MainEvent(MainEvent.LOADCOMP, e.groupName));
                    this.loadBar.hideLoadBar();
                }
        }
    };
    Main.prototype.createLoadBar = function (e) {
        this.resName = e.resName;
        this.loadBar = new LoadBar();
        this.addChild(this.loadBar);
    };
    Main.prototype.removeLast = function (e) {
        Loader.instance.load(this.resName);
        this.gameLayer.removeChildAt(0);
        var view = this.views.shift();
        view.destroy();
    };
    Main.prototype.addSence = function (e) {
        var objClass = egret.getDefinitionByName(this.senceName[e.resName]);
        var obj = new objClass();
        this.gameLayer.addChild(obj);
        this.views.push(obj);
    };
    Main.prototype.createScene = function () {
        if (egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE) {
            this.isRotation = true;
            this.rotation = 90;
            this.x = 480;
        }
        this.gameLayer = new egret.DisplayObjectContainer();
        this.addChild(this.gameLayer);
        this.preload = new PreLoad();
        this.gameLayer.addChild(this.preload);
    };
    Main.prototype.init = function () {
        this.gameLayer.removeChildAt(0);
        this.preload = null;
        this.welcome = new Index();
        this.gameLayer.addChild(this.welcome);
        this.views.push(this.welcome);
    };
    Main.prototype.onRotation = function (rotation) {
        if (this.isRotation && (rotation == 90 || rotation == -90)) {
            this.rotation = 0;
            this.x = 0;
            this.isRotation = false;
            egret.StageDelegate.getInstance().setDesignSize(800, 480);
        }
        else if (!this.isRotation && (rotation == 0)) {
            this.rotation = 90;
            this.x = 480;
            this.isRotation = true;
            egret.StageDelegate.getInstance().setDesignSize(480, 800);
        }
    };
    Main.wujin = false;
    Main.loadCommis1st = true;
    return Main;
}(egret.DisplayObjectContainer));
