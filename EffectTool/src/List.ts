/**
 * List
 */
class List<T> {
	private  operArr:Array<T>; 
	public constructor(arr?:Array<T>) {
		this.operArr = new Array<T>();
		if (!!arr)
			this.operArr = this.operArr.concat(arr);
	}
	/**
	 * 添加元素
	 * @param {element} 元素
	 */
	public add(element:T):Array<T>{
		this.operArr.push(element);
		return this.operArr;
	}
	/**
	 * 添加元素集合
	 * @param {gather} 元素集合
	 */
	public addRange(gather:Array<T>):Array<T>{
		this.operArr = this.operArr.concat(gather);
		return this.operArr;
	}
	/**
	 * 添加元素集合
	 * @param {gather} 元素集合
	 */
	public addListRange(gather:List<T>):List<T>{
		if (!!gather && gather.count > 0)
			this.operArr = this.operArr.concat(gather.operArr);
		return this;
	}	
	/**
	 * 清除元素
	 */
	public clear():void{
		this.operArr = [];
	}
	/**
	 * 查询List中是否包含元素
	 */
	public contains(element:T):boolean{
		if(!!this.count){
			var index:number = this.operArr.indexOf(element);
			if(index === -1){
				return false;
			}else{
				return true;
			}
		}
		return false;
	}
	

	/**
	 * 匹配满足查询条件的第一个元素
	 */
	public find(match:(arg:T)=>boolean,thisArg?:any):T{
		if(!!this.count){
			for(var i:number = 0;i<this.operArr.length;i++){
				if(match.call(thisArg,this.operArr[i])) {
					return this.operArr[i];
				}
			}
		}
		return null;
	}
	/**
	 * 匹配所有满足条件元素
	 * @param: {match} 匹配方法
	 */
	public findAll(match:(arg:T)=>boolean,thisArg?:any):Array<T>{
		var arr:Array<T> = new Array<T>();
		if(!!this.count){
			this.operArr.forEach(elem => {
				if(match.call(thisArg,elem)) 
					arr.push(elem);
			});
		}
		return arr;
	}
	/**
	 * 查询元素index
	 * @param: {match} 匹配方法
	 */
	public findIndex(match:(arg:T)=>boolean,thisArg?:any):number{
		if(!!this.count){
			this.operArr.forEach((elem,index) => {
				if(match.call(thisArg,elem)) 
					return index;
			});
		}
		return -1;
	}
	/**
	 * 查询元素index
	 */
	public indexOf(element:T):number{
		if(!!this.count){
			this.operArr.forEach((elem,index) => {
				if(element === elem) 
					return index;
			});
		}
		return -1;
	}
	/**
	 * 插入元素
	 */
	public insert(index:number,element:T):void{
		this.operArr.splice(index,0,element);
	}
	/**
	 * 插入元素集合
	 */
	public insertRange(index:number,elements:Array<T>):Array<T>{
		var firstArr:Array<T> = this.operArr.slice(0,index+1);
		var secondArr:Array<T> = this.operArr.slice(index+1);
		this.operArr = firstArr.concat(elements).concat(secondArr);
		return this.operArr;
	}
	/**
	 * 清除匹配元素
	 */
	public removeAll(match:(arg:T)=>boolean,thisArg?:any):Array<T>{
		var deArr:Array<T> = new Array<T>();
		if(!!this.count){
			for(var i:number = this.count-1;i>=0;i--){
				if(match.call(thisArg,this.operArr[i])){
					this.operArr.splice(i,1);
					deArr.push(this.operArr[i]);
				}
			}
		}
		return deArr;
	}
	/**
	 * 清除某个item
	 */
	public removeItem(item:T):void{
		var index:number = this.indexOf(item);
		if(index != -1){
			this.operArr.splice(index,1);
		}
	}
	/**
	 * 根据index移除item
	 */
	public removeAt(index:number):void{
		var item:T = this.getItem(index);
		if(!!item){
			this.operArr.splice(index,1);
		}
	}	
	/**
	 * 根据index获取元素
	 */
	public getItem(index:number):T{
		if(this.count && index >=0 && this.count > index){
			return this.operArr[index];
		}
		return null;
	}
		/**
	 * 根据index获取元素
	 */
	public setItem(index:number, value:T):void{
		if(this.count && index >=0 && this.count > index){
			this.operArr[index] = value;
		}
	}

	//获取区域
	public getRange(start:number, end?:number):List<T>
	{
		return new List<T>(this.operArr.slice(start, end));
	}
	/**
	 * List排序
	 */
	public sort(compareFn?: (a: T, b: T) => number):Array<T>{
		return this.operArr.sort(compareFn);
	};
	/**
	 * List遍历
	 */
	public forEach(callBackFunc:(value: T, index?: number)=>void,thisArg?:any):void{
		if(!!this.count){
			this.operArr.forEach((value:T,index:number)=>{
				callBackFunc.call(thisArg,value,index);
			})
		}
	}
	/**
	 * 返回数组
	*/
	public toArray():Array<T>
	{
		return this.operArr;
	}
	/**
	 * 复制并返回新的列表
	*/
	public toNewList():List<T>
	{
		return new List<T>(this.operArr.slice(0));
	}
	/**
	 * 获取List长度
	 */
	public get count():number{
		return this.operArr.length;
	}
}