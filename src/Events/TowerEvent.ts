/**
*
* 塔类事件
* @author 
*
*/
class TowerEvent extends egret.Event {
    public static SHOWTOOL: string = "showtool";
    public static HIDETOOL: string = "hidetool";
    
    private _obj: any;
    public constructor(type:string, obj:any=null,  bubbles:boolean=false, cancelable:boolean=false) {
        super(type,bubbles,cancelable);
        this._obj = obj;
    }
    public get obj():any{
        return this._obj;
    }
}
