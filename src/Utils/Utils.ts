/**
 *
 * 工具箱
 * @author 
 *
 */
class Utils {
	
	
    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    */
    public static createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    
    /**
    * 检测是否进入椭圆范围
    * @param px             被检测点x坐标
    * @param py             被检测点y坐标
    * @param cx             椭圆圆心x坐标
    * @param cy             椭圆圆心y坐标
    * @param r              椭圆最大半径
    * @param sy             将圆沿y轴压扁变为椭圆时候的比例
    * @return               是否包含在椭圆中
    */
    public static containsXY(px:number, py:number, cx:number, cy:number, r:number, sy:number = 0.5):boolean{
        var dx:number = px-cx;
        var dy:number = py-cy;
        dy/=sy;
        if(Math.sqrt(dx * dx + dy * dy)<r){
            return true;
        }
        return false;
    }
    public static containsXY2(px:number, py:number):boolean{
        if(px>40 && px<GameSetting.swid-80 && py>40 && py<GameSetting.shei-80){
            return true;
        }else{
            return false;
        }
    }
    
    /**
     * 画椭圆
     */
    public static drawEllipse(wid:number,hei:number,color:number,fill:boolean=false):egret.Shape{
        var sp: egret.Shape = new egret.Shape();
        sp.graphics.lineStyle(1,color);
        /*
        if(fill){
            //sp.graphics.beginFill(color,0.05);
            //绘制放射状渐变填充
            var fillType:string = egret.GradientType.RADIAL;
            var colors:number[] = [color,color];
            var alphas:number[] = [0,0.5];
            var ratios:number[] = [200,255];
            var matr:egret.Matrix = new egret.Matrix();
            matr.createGradientBox(wid, hei, 0, 0, 0);
            sp.graphics.beginGradientFill(fillType, colors, alphas, ratios, matr);
        }
        */
        sp.graphics.drawEllipse(0,0,wid,hei);
        sp.graphics.endFill();
        return sp;
    }
    
    /*
    * 对象冒泡排序
    */ 
    public static sortarr(arr:any[]):any[]{
        var tmp:any;
        for (var i:number = 0; i < arr.length; i++){
            for (var j:number = arr.length - 1; j > i; j--){
                if (arr[j].y < arr[j - 1].y){
                    tmp = arr[j];
                    arr[j] = arr[j - 1];
                    arr[j - 1] = tmp;
                }
            }
        }
        return arr;
    }
    
}
