/**
 *
 * 所有具有转向行为对象的基类
 * @author 
 *
 */
class VectorElements extends Elements {
    
    /**路径点*/
    protected posArr: Vector2D[]=[];
    /**最大移动速度*/
    protected _maxSpeed:number = 0.3;
    /**移动角度*/
    protected _angle:number=0;
    /**位置向量 x y*/
    protected _position:Vector2D;
    /**速度向量 vx vy*/
    protected _velocity:Vector2D;
    /**作为每个行为叠加后的转向合力*/
    protected _steeringForce:Vector2D;
    /**路径点索引*/
    protected _pathIndex:number;
    
    
    /**到达阈值*/
    protected _arrivalThreshold:number =2;
    /**路径阈值(pathThreshold)相当于航点间距 别和_arrivalThreshold值一样 容易造成到达冲突*/
    protected _pathThreshold:number = 5;
    
    
    /**当前状态*/
    protected curState: stateType;
    /**FSM*/
    protected fsm: StateMachine;
        
        
        
    public constructor() {
        super();
        this._position = new Vector2D();
        this._velocity = new Vector2D();
        this._steeringForce = new Vector2D();
    }
    	
    /**实时刷新*/
    public onEnterFrame(advancedTime:number){
        if(this.curState != stateType.moveState)
            return;
        //路径寻路点
        this.followPath(this.posArr);
        this._velocity = this._velocity.add(this._steeringForce);
        this._steeringForce = new Vector2D();
        
        // 截断速度保证不超过最大速度
        this._velocity.truncate(this._maxSpeed);
        // 位置向量+速度向量
        this._position = this._position.add(this._velocity);
        // 更新位置
        this.x = this.position.x;
        this.y = this.position.y;
        // 设置自身角度
        this._angle =(this._velocity.angle * 180 / Math.PI +360)%360;
    }
    	
    /**
    * 读写位置向量
    */
    public set position(value:Vector2D){
        this._position = value;
        this.x = this._position.x;
        this.y = this._position.y;
    }
    public get position():Vector2D{
        return this._position;
    }
    
    /**
    * 读写加速度向量
    */
    public set velocity(value:Vector2D){
        this._velocity = value;
    }
    public get velocity():Vector2D{
        return this._velocity;
    }
    
    
    //-------------------------------------------------------------------------------------------------------------------
    /**寻找行为*/
    public seek(target:Vector2D):void{
        var desiredVelocity:Vector2D = target.subtract(this._position);//目标向量减去当前向量
        desiredVelocity.normalize();//将当前向量转化成单位向量
        desiredVelocity = desiredVelocity.multiply(this._maxSpeed);//数与向量的乘积
        var force:Vector2D = desiredVelocity.subtract(this._velocity);
        this._steeringForce = this._steeringForce.add(force);
    }
        
    /**到达行为*/
    public arrive(target:Vector2D):void{
        var desiredVelocity:Vector2D = target.subtract(this._position);//向量差
        desiredVelocity.normalize();
        var dist:number = this._position.dist(target);
        if(dist > this._arrivalThreshold){
            desiredVelocity = desiredVelocity.multiply(this._maxSpeed);
        }else{
            desiredVelocity = desiredVelocity.zero();
            this._velocity= this._velocity.zero();//速度向量设置为0
            //敌人路径点走完表示逃脱，本方走完则状态切换到移动完成
            this.fsm.changeState(stateType.moveEndState);
        }
        var force:Vector2D = desiredVelocity.subtract(this._velocity);//力向量=向量差-速度向量
        this._steeringForce = this._steeringForce.add(force);
    }
        
    /**跟随路径点*/
    public followPath(path: Vector2D[],loop: boolean = false): void {
        var wayPoint: Vector2D = path[this._pathIndex];
        if(wayPoint == null) return;
        //this._isarrival = false;
        if(this._position.dist(wayPoint) < this._pathThreshold) {
            if(this._pathIndex >= path.length - 1) {
                if(loop) {
                    this._pathIndex = 0;
                }
            } else {
                this._pathIndex++;
            }
        }
        
        if(this._pathIndex >= path.length - 1 && !loop) {
            this.arrive(wayPoint);
        } else {
            this.seek(wayPoint);
        }
    }
    
}
