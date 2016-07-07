/**
 *
 * 士兵事件
 * @author 
 *
 */
class SoldEvent extends egret.Event {
    public static SELECT: string = "select";
    public static DESELECT: string = "deselect";
    public static MOVE: string = "move";
        
    private _obj: any;
    private _arr: number[];
    
    public constructor(type:string, obj:any=null, arr:number[]=null,  bubbles:boolean=false, cancelable:boolean=false) {
        super(type,bubbles,cancelable);
        this._obj = obj;
        this._arr = arr;
    }
    public get obj():any{
        return this._obj;
    }
    public get arr():number[]{
        return this._arr;
    }
}
