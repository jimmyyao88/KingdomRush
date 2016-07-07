/**
 *
 * 加载类事件
 * @author 
 *
 */
class LoadEvent extends RES.ResourceEvent{
    //public static LOADING: string = "loading";
    //public static LOADCOMP: string = "loadcomp";
    
    //private _resName: string = "";
    
    //public constructor(type:string, resName:string="", bubbles:boolean=false, cancelable:boolean=false) {
	public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false) {
        super(type,bubbles,cancelable);
        //this._resName = resName;
	}
	
	//public get resName():string{
        //return this._resName;
	//}
}
