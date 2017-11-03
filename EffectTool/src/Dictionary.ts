class Dictionary<KEY, VALUE> {
	public constructor( ) {
		this.dict=[];
		//this.keyArr=[];
		
	}
	public dict:Array<{}>;
	//public keyArr:Array<KEY>;
	/**
	 * 向字典中添加一个对象
	 * @param key 对象名
	 * @param value 对象
	 */
	public add(key:KEY,value:VALUE):void{
		var findObj = this.getValue(key);
		if(!!findObj){
			findObj["_value"] = value;
		}else{
			this.dict.push({_key: key, _value: value});
		}
	}
	/**
	 * 移除字典中的对象
	 * @param key 对象名
	 * 
	 */
	public remove(key:KEY):boolean{
		var index:number = this.getIndex(key);
		if(index >= 0){
			this.dict.splice(index, 1);
			return true;
		}

		return false;
	}

	public clear():void{
		this.dict = [];
	}
	/**
	 * 查找字典中是否存在对象
	 * @param key 对象名
	 */
	public hasKey(key:KEY):boolean{
		return this.getIndex(key) >= 0;
	}
	private getIndex(key:KEY):number{
		var len:number = this.dict.length;
		if(!len){
			return -1; 
		}
		for(var i:number = 0;i<len;i++){
			if (this.dict[i]["_key"] == key){
				return i;
			}
		}
		return -1;
	}
	/**
	 * 获取字典中的对象
	 * @param key 对象名
	 * 
	 */
	public getValue(key:KEY):VALUE{
		var len:number = this.dict.length;
		if(!len){
			return undefined; 
		}
		for(var i:number = 0;i<len;i++){
			if (this.dict[i]["_key"] == key){
				return this.dict[i]["_value"];
			}
		}
		return;
	}

	//遍历容器返回每个值
	public foreach(callbackFunc:(value: VALUE, key?:KEY)=>void, thisArg?:any):void
	{
		if (!this.dict || this.dict.length == 0) return;

		this.dict.forEach(elem => {
			callbackFunc.call(thisArg, elem["_value"], elem["_key"]);
		});
	}

	//获得所有Key值
	public get keys():List<KEY>
	{
		var keyArr:List<KEY> = new List<KEY>();
		this.dict.forEach(elem => {
			keyArr.add(elem["_key"]);
		});

		return keyArr;
	}

	//获得所有value值
	public get values():List<VALUE>
	{
		var valueArr:List<VALUE> = new List<VALUE>();
		this.dict.forEach(elem => {
			valueArr.add(elem["_value"]);
		});

		return valueArr;
	}
	
	public get count() : number {		return this.dict.length;	}
	
}