/**
 * 资源管理器
 */
class AssetsMgr {
	public static readonly instance:AssetsMgr = new AssetsMgr();
	private  readonly assetDic:Dictionary<string,any> = new Dictionary<string,any>();
	private skillGrouList:List<string> = new List<string>();
	public constructor() {
		
	}
	public init():void{
		var group:RES.ResourceItem[] = RES.getGroupByName("skill");
		group.forEach((elem:RES.ResourceItem)=>{
			this.skillGrouList.add(elem.name);
		},this)
	}
	//===================加载资源组数据=================================
	/**等待资源组加载队列*/
    private  g_map: Array<any> = [];
    /**是否可加载*/
    private  g_isLoad:boolean = true;
    private  g_groupName: string= "";
    private  g_name: string = "";
    private  g_thisArg: any;
	/** 加载资源成功后的回调方法*/
    private  g_callback: Function; 
	/**
	 * 加载资源组
	 * groupName: string 要加载的资源组名称
	 * callBackFunc:Function 回调函数
	 * data:any 回调作用域
	 */
	public loadGroup(groupName:string,callBackFunc?:()=>void,thisArg?:any):void{
		if(!this.g_isLoad){
			var data:Object = {};
			data["_groupName"] = groupName;
			data["_callBack"] = callBackFunc;
			data["_this"] = thisArg;
			this.g_map.push(data);
			return;
		}
		this.g_isLoad = false;
		this.g_callback = callBackFunc;
		this.g_thisArg = data;
		var groupLoadRes:boolean = false;
		if(!RES.isGroupLoaded(groupName)){
			groupLoadRes = true;
		}
		if(groupLoadRes){
			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
			RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
			RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
			this.g_name = groupName;
			RES.loadGroup(groupName);
		}else{
			this.g_callback.call(this.g_thisArg);
			this.g_isLoad = true;
			if(this.g_map.length){
				var temp:any = this.g_map.shift();
				this.loadGroup(temp["_groupName"],temp["_callBack"],temp["_this"]);
			}
		}
	}
	/**
	 * 资源组加载完成
	 */
	private  onResourceLoadComplete(event:RES.ResourceEvent):void{
		 //if (event.groupName == this.assetsSourceArr[this.index]) {
        egret.log("LoadComplete:" + event.groupName + " ");
		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
		this.g_callback(this.g_thisArg);
		this.g_isLoad = true;
		if(this.g_map.length) {
			var temp: Object = this.g_map.shift();
			this.loadGroup(temp["_groupName"],temp["_callback"],temp["_this"]);
		}
        //}
	}
	/**
	 * 资源组加载失败
	 */
	private  onResourceLoadError(event:RES.ResourceEvent):void{
        egret.warn("LoadError:" + event.groupName + " has failed to load");
	}
	/**
	 *资源组加载进度 
	 */
	private  onResourceProgress(event:RES.ResourceEvent):void{
		if(event.groupName == this.g_name) {
            var p: Number = event.itemsLoaded / event.itemsTotal;
            egret.log(this.g_name + "  current====" + p.toFixed(0));
        }
	}

	//======================================加载MovieClip===========================================
	/**
	 * 加载单个movieClip
	 * @param:{filePath} MovipClip资源文件
	 * @param:{callBack} 加载完成后的回调
	 * @param:{thisArg}  回调作用域
	 */
	public loadSingleMovieFile(filePath:string,callBack?:(data:egret.MovieClip,name?:string,index?:number,jsonData?:any)=>void,thisArg?:any,index?:number):void{
		var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory();
		var textureBoo:boolean = false,jsonBoo:boolean = false;
		var fileName:string = filePath.split("/").pop();
		var mc:egret.MovieClip;
		var jsonData:any = {};
		RES.getResByUrl (filePath + ".json", function(t) {
			mcFactory.mcDataSet = t;
			jsonBoo = true;
			jsonData = t;
			if(textureBoo){
				mc = new egret.MovieClip(mcFactory.generateMovieClipData(fileName));
				callBack.call(thisArg,mc,fileName,index,jsonData);
			}
        }, this,RES.ResourceItem.TYPE_JSON);
        RES.getResByUrl(filePath + ".png", function(t) {
			mcFactory.texture = t;
			textureBoo = true;
			if(jsonBoo){
				mc = new egret.MovieClip(mcFactory.generateMovieClipData(fileName));
				callBack.call(thisArg,mc,fileName,index,jsonData);
			}
        }, this,RES.ResourceItem.TYPE_IMAGE);
	}
	/**
	 * 加载movieClip集合
	 * @param:{filePath} 资源路径
	 * @param:{id} 资源id
	 * @param:{condition} 条件 el: role/{0}_a_{1}
	 */
	public loadMovieGroup(filePath:string,id:number,condition:string,callBack?:(dict:Dictionary<number,egret.MovieClip>)=>void,thisArg?:any):void{
		var dict:Dictionary<number,egret.MovieClip> = new Dictionary<number,egret.MovieClip>();
		var conditionStr:any = condition;
		var count:number = 1;
		var len:number = 9;
		var errorNum:number = 0;
		for(var i:number = 1;i<len;i++){
			conditionStr = conditionStr.format(condition,[id,i]);
			var path:string = filePath + conditionStr;
			if(!this.hasMovieGroupRes("30300_a_"+i+"_png")){
				errorNum += 1;
				count+=1;
				continue;
			}
			this.loadSingleMovieFile(path,(mc:egret.MovieClip,name:string,index:number)=>{
				dict.add(index,mc);
				count+=1;
				this.assetDic.add(name,mc);
				if(count >= len-errorNum){
					errorNum = 0;
					count = 0;
					callBack.call(thisArg,dict);
				}
			},this,i);
		}
	}
	/**获取组资源 */
	private hasMovieGroupRes(key:string):string{
		var str:string = this.skillGrouList.find((elem)=>{return key===elem});
		return str
	}
	//=============================加载文本文件==============================
	/**
	 * 加载文本配置文件
	 * @param:{filePath} 地图文件路径
	 * @param:{callBack} 加载完成后的回调
	 * @param:{thisArg}  回调作用域
	 */
	public loadSingleText<T>(filePath:string,callBack?:(dataObj:T,url:string)=>void,thisArg?:any):void{
		RES.getResByUrl(filePath,(dataObj:T)=>{
			if(!!callBack){
				callBack.call(thisArg,dataObj,filePath);
			}
		},this,RES.ResourceItem.TYPE_JSON);
	}
	/**
	 * 加载文本配置文件组
	 * @param:{fileGroup} 地图文件组
	 * @param:{callBack}  加载完成后的回调
	 * @param:{thisArg}   回调作用域
	 */
	public loadTextGroup<T>(fileGroup:string[],callBack?:(dict:Dictionary<string,T>)=>void,thisArg?:any,singleCallBack?:(data:Object)=>void,singleThis?:any):void{
		var dict:Dictionary<string,T> = new Dictionary<string,T>();
		var count:number = 0;
		var len:number = fileGroup.length;
		var ifLoad:boolean = true;
		fileGroup.forEach((elem)=>{
			this.loadSingleText<T>(elem,(dataObj:T,filePath:string)=>{
				var name:string = filePath.split("/").pop().split(".").shift();
				count++;
				dict.add(name,dataObj);
				if(singleCallBack && singleThis){
					singleCallBack.call(singleThis,dataObj);
				}
				ifLoad = true;
				if(count >= len){
					count = 0;
					callBack.call(thisArg,dict);
					return;
				}
			},this);
		},this)
	}

	//===============================加载图片资源===================================
	/**
	 * 加载单个图片资源
	 * @param:{filePath} 图片资源路径
	 * @param:{callBack} 加载完成后的回调
	 * @param:{thisArg}  回调作用域
	 */
	public loadSinglePicture(filePath:string,callBack?:(bmp:egret.Bitmap,name?:string)=>void,thisArg?:any):void{
		var texture:egret.Texture;
		RES.getResByUrl(filePath, (texture: egret.Texture) => {
			texture = texture;
			var name:string = filePath.split("/").pop().split(".").shift();
			var bmp:egret.Bitmap = new egret.Bitmap(texture);
			this.assetDic.add(name,bmp);
			callBack.call(thisArg,bmp,name);
		}, this, RES.ResourceItem.TYPE_IMAGE);
	}
	/**
	 * 加载多个图片资源组=>
	 * @param:{picGroup} 图片资源路径组
	 * @param:{callBack} 加载完成后的回调
	 * @param:{thisArg}  回调作用域
	 */
	public loadPictureGroup(picGroup:string[],callBack?:(dict:Dictionary<string,egret.Bitmap>)=>void,thisArg?:any):void{
		var picDict:Dictionary<string,egret.Bitmap> = new Dictionary<string,egret.Bitmap>();
		var count:number = 0,len:number = picGroup.length;
		picGroup.forEach((elem)=>{
			this.loadSinglePicture(elem,(bmp:egret.Bitmap,name:string)=>{
				picDict.add(name,bmp);
				count+=1;
				this.assetDic.add(name,bmp);
				if(count >= len){
					count = 0;
					callBack.call(thisArg,picDict);
				}
			},this);
		},this)
	}
	/**
	 * 获取资源
	 * T--type：{Bitmap，MovieClip}
	 * @param:{fileName}文件名称
	 */
	public getAssets<T>(fileName:string):T{
		var item:T = this.assetDic.getValue(fileName);
		return item;
	}
	/**
	 * 销毁资源
	 * @param:{fileName} 文件名称
	 */
	public destoryAsset(fileName:string):void{
		this.assetDic.remove(fileName);
	}
}

