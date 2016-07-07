/**
 *
 * 技能基类
 * @author 
 *
 */
class SkillBase extends egret.Sprite {
    
    /**蒙板*/
    protected mb: egret.Bitmap;
    /**时间差*/
    protected curtime: number = 0;
    /**技能图片*/
    protected skillbm: egret.Bitmap;
    protected off: string;
    protected on: string;
    /**边框图片*/
    protected bkbm: egret.Bitmap;
    /**CD*/
    protected cdtime: number = 0;
    /**是否cd中*/
    protected iscd: boolean = true;
    /**引用的层*/
    protected contentLayer: egret.Sprite;

    public constructor() {
        super();
    }
    
    public initbm(){
        //技能图片
        this.skillbm = new egret.Bitmap();
        this.skillbm.x = 12;
        this.skillbm.y = 8;
        this.addChild(this.skillbm);
        //蒙板
        this.mb = Utils.createBitmapByName("mb");
        this.mb.anchorY = 1;
        this.mb.x = 12;
        this.mb.y = 8+38;
        this.addChild(this.mb);
        //框
        this.bkbm = Utils.createBitmapByName("uiskilloff");
        this.addChild(this.bkbm);
                
        this.touchEnabled = true;
    }
    
    /**创建*/
    public onCreate(): void {
        this.iscd = true;
        this.curtime = 0;
    }
    
    /**销毁*/
    public onDestroy(): void {}
    
    /**帧事件*/
    public onEnterFrame(advancedTime: number) {
        if(this.iscd) {
            this.curtime += advancedTime;
            var per = this.curtime / this.cdtime;
            var left = 1 - per;
            this.setMbheight(left * 38);
            if(per >= 1) {
                this.iscd = false;
                this.skillbm.texture = RES.getRes(this.on);
                this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchHandle,this);
                //console.log("skill is ready");
            }
        }
    }
            	
    /**设置蒙板高度*/
    protected setMbheight(num:number){
        this.mb.height = num;
    }
    
    /**点击事件*/
    protected touchHandle(e:egret.TouchEvent){
        Group.selectItem(this);
    }
    /**对象管理事件  选中 重选 取消*/
    public selectItem(){
        this.bkbm.texture = RES.getRes("uiskillon");
        
        //console.log("取消");
        var i: number;
        var obj: any;
        var len: number = GuankaBase.instance.objArr.length;
        for(i = 0;i < len;i++){
            obj = GuankaBase.instance.objArr[i];
            var soldorhero = egret.getQualifiedSuperclassName(obj);
            if(soldorhero == "ShieldSoldierBase" || soldorhero == "HeroBase"){
                obj.view.touchEnabled = false;
            }
        }
    }
    public reselectItem(){
        
    }
    public deselectItem() {
        this.bkbm.texture = RES.getRes("uiskilloff");
        
        //console.log("恢复");
        var i: number;
        var obj: any;
        var len: number = GuankaBase.instance.objArr.length;
        for(i = 0;i < len;i++){
            obj = GuankaBase.instance.objArr[i];
            var soldorhero = egret.getQualifiedSuperclassName(obj);
            if(soldorhero == "ShieldSoldierBase" || soldorhero == "HeroBase"){
                obj.view.touchEnabled = true;
            }
        }
    }
    /**技能释放*/
    public setPoint(arr:number[]){
        //还原cd状态
        this.skillbm.texture = RES.getRes(this.off);
        this.setMbheight(38);
        this.curtime = 0;
        this.iscd = true;
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchHandle,this);
        //console.log("释放技能");
    }

}