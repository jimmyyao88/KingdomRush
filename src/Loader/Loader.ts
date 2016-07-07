/**
 *
 * 资源加载类
 * @author
 *
 */
class Loader extends egret.EventDispatcher {
    public static instance: Loader;
    /** 一个自定义加载侦听事件*/
    private loadevent: LoadEvent;


	public constructor() {
        super();
	}
	/*
	 * 获取对象实例
	 */
	public static getInstance():Loader{
	    if(Loader.instance==null){
            var loader: Loader = new Loader();
            Loader.instance = loader;
	    }
        return Loader.instance;
	}
	/*
	 * 加载配置文件
	 */
    public init() {
        //初始化Resource资源加载库
        RES.loadConfig("resource/resource.json", "resource/");
    }
    /**
    * 配置文件加载完成,开始预加载preload资源组。
    */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }

    /**
    * 资源组加载出错
    */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    }

    /**
    * preload资源组加载进度
    */
    private onResourceProgress(event:RES.ResourceEvent):void {
        this.loadevent = new LoadEvent(LoadEvent.GROUP_PROGRESS);
        this.loadevent.groupName = event.groupName;
        this.loadevent.itemsLoaded = event.itemsLoaded;
        this.loadevent.itemsTotal = event.itemsTotal;
        this.dispatchEvent(this.loadevent);
        this.loadevent = null;
    }
    /**
    * preload资源组加载完成
    */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        //派发完成事件
        //Main.instance.dispatchEvent(new LoadEvent(LoadEvent.LOADCOMP,event.groupName));
        //this.dispatchEvent(new LoadEvent(LoadEvent.GROUP_COMPLETE,event.groupName));
        this.loadevent = new LoadEvent(LoadEvent.GROUP_COMPLETE);
        this.loadevent.groupName = event.groupName;
        this.dispatchEvent(this.loadevent);
        this.loadevent = null;
    }
    /**
    * 加载preload资源组。
    */
    public load(group:string):void {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup(group);
    }
}
