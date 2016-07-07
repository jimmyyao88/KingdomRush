/**
 *
 * @author 
 *
 */
class ToolEvent extends egret.Event {
    public static BUILD_START: string = "build_start";
    public static BUILD_COMP: string = "build_comp";

    private _className: string = "";
    private _price: number = 0;
    public constructor(type: string,className: string = "",price:number=0,bubbles: boolean = false,cancelable: boolean = false) {
        super(type,bubbles,cancelable);
        this._className = className;
        this._price = price;
    }

    public get className(): string {
        return this._className;
    }
    public get price(): number {
        return this._price;
    }
}
