/**
 *
 * 
 * 节点二维数组 节点操作方法
 * @author 
 *
 */
class Grid {
    private _nodes:NodePoint[][];
    private _numCols:number;
    private _numRows:number;
    
    /**
    * 构造函数
    * @numCols 列
    * @numRows 行
    */
    public constructor(numCols:number, numRows:number) {
        this._numCols = numCols;
        this._numRows = numRows;
        this._nodes = new Array();
        
        ////以列数作为X坐标循环
        for(var i:number = 0; i < this._numCols; i++){
            this._nodes[i] = [];
            for(var j:number = 0; j < this._numRows; j++){
                this._nodes[i][j] = new NodePoint(i, j);
            }
        }
    }
    
    /**
    * 根据坐标获取节点
    * @param x 列
    * @param y 行
    */
    public getNode(x:number, y:number):NodePoint{
        return this._nodes[x][y];
    }
    
    /**
    * 设置节点是否可以通行
    * @param x 列
    * @param y 行
    */
    public setWalkable(x:number, y:number, value:boolean):void{
        this._nodes[x][y].walkable = value;
    }
    
}
