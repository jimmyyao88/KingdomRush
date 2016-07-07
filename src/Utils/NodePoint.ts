/**
 *
 * 节点类
 * @author 
 *
 */
class NodePoint {
    public x:number;
    public y:number;
    public walkable:boolean = true;
    public constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }
}
