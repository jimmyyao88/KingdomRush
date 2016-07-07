/**
 *
 * @author 
 *
 */
class Base extends egret.Sprite implements IGroupItem{
    /**塔索引序号，用于对应防御塔集结点*/
    public baseIdx: number;
    
	public constructor() {
        super();
	}
	//
    public selectItem(){
        //console.log("地基选中");
        this.dispatchEvent(new TowerEvent(TowerEvent.SHOWTOOL,this));
    }
    public deselectItem(){
        //console.log("地基取消");
        this.dispatchEvent(new TowerEvent(TowerEvent.HIDETOOL,this));
    }
    public reselectItem(){
        //console.log("地基重选");
        this.dispatchEvent(new TowerEvent(TowerEvent.HIDETOOL,this));
        Group.dispose();
    }
}
