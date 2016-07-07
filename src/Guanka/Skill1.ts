/**
 *
 * 技能-火球
 * @author 
 *
 */
class Skill1 extends SkillBase{
    
    private xpos: number;
    private ypos: number;
    private timer: egret.Timer;
    
	public constructor() {
        super();
	}
	
    public init(off:string,on:string,cdtime:number,layer:egret.Sprite){
        this.off = off;
        this.on = on;
        this.cdtime = cdtime;
        this.contentLayer = layer;
        
        this.initbm();
        //技能图片
        this.skillbm.texture = RES.getRes(off);
    }
    
	/**技能释放*/
	public setPoint(arr:number[]){
        super.setPoint(arr);
        //利用对象池创建火球并进行碰撞检测  火球有damage属性
        this.xpos = arr[0];
        this.ypos = arr[1] + 20;
        this.timer = new egret.Timer(100,10);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.timerHandle,this);
        this.timer.start();
        
        //console.log("释放技能");
	}
	
	private timerHandle(e:egret.TimerEvent){
        var fb: FireBall = <FireBall>ObjectPool.getInstance().createObject(FireBall);
        fb.damage = Math.sqrt(GuankaBase.instance.hardxs) * 20;
        if(this.timer.currentCount <= 4) {
            var xnum = 25 - Math.random() * 50 + this.xpos;
            var ynum = 25 - Math.random() * 50 + this.ypos;
        } else {
            var xnum = 50 + Math.random() * (GameSetting.swid-100);
            var ynum = 50 + Math.random() * (GameSetting.shei-100);
        }
        fb.init(xnum,ynum);
        fb.targets = GuankaBase.instance.enemyArr;
        GuankaBase.instance.weaponLayer.addChild(fb);
	}
}
