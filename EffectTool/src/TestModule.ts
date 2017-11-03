class TestModule extends eui.Component{
	public testModule:eui.Group;
	public roleMc:egret.MovieClip;
	public effectMc:egret.MovieClip;
	private weaponMc:egret.MovieClip;
	private editMc:egret.MovieClip;
	public editText:eui.EditableText;
	public start:eui.Label;
	public endAndSave:eui.Label;
	public end:eui.Label;
	public output:eui.Label;
	public returnBtn:eui.Label;
	public fileList:eui.Label;
	public clear:eui.Label;
	public dataObj:any = {};
	private curRoleModuleName:string;
	private curRoleEffectName:string;
	private curRoleWeaponName:string;
	private curEditMcName:string;
	private delayTime:number = 0;
	private frameRate:number = 0;
	public scroller:eui.Scroller;
	public list:eui.List;
	public btnGroup:eui.Group;
	private NORMAL:string = "normal";
	private FILELIST:string = "fileList";
	private EDIT:string = "edit";
	private collect:eui.ArrayCollection;
	private skinState:string;
	public edit:eui.Label;
	public defaultFrame:eui.Label;
	private editJsonData:any;
	public constructor() {
		super();
		this.skinName = "TestSkin";
	}
	protected childrenCreated():void{
		this.skin.currentState = this.NORMAL;
		this.roleMc = new egret.MovieClip();
		this.effectMc = new egret.MovieClip();
		this.weaponMc = new egret.MovieClip();
		this.editMc = new egret.MovieClip();
		this.testModule.addChild(this.roleMc);
		this.testModule.addChild(this.weaponMc);
		this.testModule.addChild(this.effectMc);
		this.testModule.addChild(this.editMc);
		this.collect = new eui.ArrayCollection();
		this.list.itemRenderer = Item;
		this.list.dataProvider = this.collect;
		this.scroller.viewport = this.list;
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onItemTap,this,false,2);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this,false,1);
	}
	private curItem:Item;
	private curItemIndex:number;
	private onItemTap(evt:eui.ItemTapEvent):void{
		this.curItemIndex = evt.itemIndex;
		this.curItem = this.list.getChildAt(evt.itemIndex) as Item;
	}
	protected getCurrentState():string{
		return this.skinState;
	}
	private interval;
	public onTouchTap(evt:egret.TouchEvent):void{
		if(this.skinState != this.EDIT && evt.target.parent === this.btnGroup){
			if(!this.curRoleEffectName){
				alert("请加载技能资源");
				return;
			}
			if(!this.curRoleModuleName){
				alert("请加载人物模型资源");
				return;
			}
			if(!this.curRoleWeaponName){
				alert("请加载武器资源");
				return;
			}
		}
		switch(evt.target){
			case this.start:
				egret.clearInterval(this.interval);
				var timeNum:string = this.editText.text;
				if(this.skinState === this.EDIT){
					if(!this.curEditMcName){
						alert("请加载特效资源");
						return;
					}
					this.interval = egret.setInterval(()=>{
						this.frameRate = timeNum?parseInt(timeNum):this.frameRate;
						this.editMc.gotoAndPlay(1);
						this.editMc.frameRate = this.frameRate;
					},this,1000);
					return;
				}
				this.interval = egret.setInterval(() => {
					this.delayTime = timeNum?parseInt(timeNum):0;
					this.roleMc.gotoAndPlay(1);
					this.weaponMc.gotoAndPlay(1);
					var timeout = egret.setTimeout(()=>{
						this.effectMc.gotoAndPlay(1);
						egret.clearTimeout(timeout);
					},this,this.delayTime);
					var timeout2 = egret.setTimeout(()=>{
						this.roleMc.gotoAndStop(1);
						this.weaponMc.gotoAndStop(1);
						this.effectMc.gotoAndStop(1);
					},this,this.playTime(this.roleMc));
				},this,1000);
				break;
			case this.endAndSave:
				egret.clearInterval(this.interval);
				this.roleMc.gotoAndStop(1);
				this.effectMc.gotoAndStop(1);
				this.weaponMc.gotoAndStop(1);
				this.dataObj[this.curRoleModuleName] = {"skillId":this.curRoleEffectName,"delayTime":this.delayTime,"weaponId":this.curRoleWeaponName,"clothId":this.curRoleModuleName};
				alert("保存成功");
				break;
			case this.end:
				egret.clearInterval(this.interval);
				if(this.skinState === this.EDIT){
					if(!this.curEditMcName){
						alert("请加载特效资源")
						return;
					}
					this.editMc.gotoAndStop(1);
					return;
				}
				this.roleMc.gotoAndStop(1);
				this.effectMc.gotoAndStop(1);
				this.weaponMc.gotoAndStop(1);
				break;
			case this.output:
				if(this.skinState === this.EDIT){
					if(!this.curEditMcName){
						alert("请加载特效资源");
						return;
					}
					var name:string = this.curEditMcName.split(".").shift();
					this.editJsonData.mc[name].frameRate = this.frameRate;
					saveFile(JSON.stringify(this.editJsonData),name+".json");
					return;
				}
				saveFile(JSON.stringify(this.dataObj),"config.txt");
				break;
			case this.returnBtn:
				FileModule.showFile();
				FileModule.hideEffectEdit();
				this.curEditMcName = "";
				this.testModule.removeChild(this.editMc);
				this.testModule.addChild(this.roleMc);
				this.testModule.addChild(this.weaponMc);
				this.testModule.addChild(this.effectMc);
				this.skinState = this.NORMAL;
				this.invalidateState();
				break;
			case this.fileList:
				var dataArr:any[] = [];
				for(var key in this.dataObj){
					var obj:any = {
						txt:key+":=>"+JSON.stringify(this.dataObj[key])
					}
					dataArr.push(obj);
				}
				this.collect.source = dataArr;
				this.skinState = this.FILELIST;
				this.invalidateState();
				FileModule.hideFile();
				FileModule.hideEffectEdit();
				break;
			case (this.curItem?this.curItem.removeBtn:0):
				this.collect.removeItemAt(this.curItemIndex);
				this.collect.refresh();
				var count:number = -1;
				for(var key in this.dataObj){
					count+=1;
					if(count === this.curItemIndex){
						count = -1;
						delete this.dataObj[key];
						break;
					}
				}
				break;
			case this.clear:
				this.collect.replaceAll([]);
				this.collect.refresh();
				this.dataObj = [];
				break;
			case this.editText:
				this.editText.text = "";
				break;
			case this.edit:
				//编辑动作
				this.skinState = this.EDIT;
				this.testModule.removeChild(this.roleMc);
				this.testModule.removeChild(this.weaponMc);
				this.testModule.removeChild(this.effectMc);
				this.testModule.addChild(this.editMc);
				this.invalidateState();
				FileModule.showEffetEdit();
				FileModule.hideFile();
				break;
		}
	}
	public initSkillModule(mc:egret.MovieClip,type:string,fileName:string,jsonData?:any):void{
		if(type === MODULETYPE.ROLE){
			this.roleMc.movieClipData = mc.movieClipData;
			this.curRoleModuleName = fileName;
			this.roleMc.x = (this.testModule.width>>1) - (this.roleMc.width>>1);
			this.roleMc.y = (this.testModule.height>>1) - (this.roleMc.height);
		}else if(type === MODULETYPE.WEAPON){
			this.weaponMc.movieClipData = mc.movieClipData;
			this.curRoleWeaponName = fileName;
		}
		else if(type === MODULETYPE.EFFECT){
			this.effectMc.movieClipData = mc.movieClipData;
			this.curRoleEffectName = fileName;
		}else{
			this.skinState = this.EDIT;
			this.invalidateState();
			this.editMc.movieClipData = mc.movieClipData;
			this.curEditMcName = fileName;
			this.frameRate = mc.frameRate;
			this.defaultFrame.text = mc.frameRate + "";
			this.editJsonData = jsonData;
		}
		this.weaponMc.x = this.effectMc.x = this.roleMc.x;
		this.weaponMc.y = this.effectMc.y = this.roleMc.y;
		
	}
	private playTime(mc:egret.MovieClip):number {
		return mc.movieClipData ? 1 / mc.frameRate * mc.totalFrames * 1e3 : 0;
	}
}