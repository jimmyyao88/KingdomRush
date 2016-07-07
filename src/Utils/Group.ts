/**
 *
 * 对象管理类
 * @author 
 *
 */
class Group {
    public static selectedItem:any;
    
	public constructor() {
	}
	
    public static selectItem(item:any):void{
        
        //重选还是反选
        if (Group.selectedItem){
            if (Group.selectedItem == item){
                Group.selectedItem.reselectItem();
                return;
            }
            Group.selectedItem.deselectItem();
        }
        
        //选中
        Group.selectedItem = item;
        if (Group.selectedItem){
            Group.selectedItem.selectItem();
            //选中音效
            SoundManager.playEffect("select");
        }
    }
    
    public static dispose():void{
        Group.selectedItem = null;
    }
}

