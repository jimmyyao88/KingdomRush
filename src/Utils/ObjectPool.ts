/**
*
* 对象池
* @author
*
*/
class ObjectPool {
    constructor() {
        egret.Ticker.getInstance().register(this.onEnterFrame, this);
    }
    /**事实刷新对象池中对象*/
    private onEnterFrame(advancedTime:number):void {
        //if (Main.isPause)return;
        var list = this._list.concat();
        for (var i = 0 , length = list.length; i < length; i++) {
            var obj = list[i];
            obj.onEnterFrame(advancedTime);
        }
    }
    
    private _isPause:boolean = false;
    public pauseEnterFrame():void {
        this._isPause = true;
    }
    public resumeEnterFrame():void {
        this._isPause = false;
    }
    
    /**对象池*/
    public _pool = {};
    /**所有显示在舞台上的显示对象数组*/
    public _list:Array<any> = [];
    /**取出*/
    public createObject(classFactory:any):any {
        var result;
        var key = egret.getQualifiedClassName(classFactory);
        //console.log(key);
        var arr = this._pool[key];
        if (arr != null && arr.length) {
            result = arr.shift();
        }else{
            result = new classFactory();
        }
        result.onCreate();//创建
        this._list.push(result);
        return result;
    }
    /**放回*/
    public destroyObject(obj:any) {
        var key = egret.getQualifiedClassName(obj);
        //console.log(key);
        if (this._pool[key] == null) {
            this._pool[key] = [];
        }
        if (this._pool[key].indexOf(obj) == -1) {
            this._pool[key].push(obj);
        }
        obj.onDestroy();//销毁
        var index = this._list.indexOf(obj);
        if (index != -1) {
            this._list.splice(index, 1);
        }
    }
    /***/
    public destroyObjectByKey(key:string) {
        for (var i = 0; i < this._list.length; i++) {
            if (this._list[i].key == key) {
                this._list[i].onDestroy();
                i--;
            }
        }
    }
    /**放回所有舞台上的对象*/
    public destroyAllObject() {
        while (this._list.length) {
            this.destroyObject(this._list[0]);
        }
    }
    
    private static instance:ObjectPool;
    public static getInstance():ObjectPool {
        if (ObjectPool.instance == null) {
            ObjectPool.instance = new ObjectPool();
        }
        return ObjectPool.instance;
    }
}

