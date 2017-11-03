module FileModule {
	var _fileData:PNGFILE;
	var m_stage:egret.Stage;
	var testPanel:TestModule;
	export class FileOper {
		public sendFileData(fileData:PNGFILE,type:string):void{
			_fileData = fileData[0];
			if(!_fileData){
				return;
			}
			if(!m_stage){
				m_stage = egret.MainContext.instance.stage;
				testPanel = new TestModule();
				m_stage.addChild(testPanel);
			}
			DataCenter.curFileData = _fileData;
			let absPath:string = _fileData.path;
			let path:string = absPath.split(".").shift();
			let transPath:string = path.replace(/\\/g,"/");
			let relaPath:string = 	transPath.match(/resource\/(\S*)/)[1];		
			AssetsMgr.instance.loadSingleMovieFile("resource/"+relaPath,(mc:egret.MovieClip,name:string,index:number,jsonData:any)=>{
				DataCenter.curTestMc = mc;
				testPanel.initSkillModule(mc,type,_fileData.name,jsonData);
				// testPanel.x = testPanel.y = 0;
			},this)
		}
		
		public constructor() {

		}
	}
	export function hideFile():void{
		hideFileLoad();
	}
	export function  showFile():void{
		showFileLoad();
	}
	/**
	 * 显示特效编辑
	 */
	export function showEffetEdit():void{
		showEdit();
	}
	export function hideEffectEdit():void{
		hideEdit();
	}
}
class PNGFILE{
	public lastModified:1507880046196
	public name:string;
	public path:string;
	public size:number;
	public type:string;//"image/png"
	public webkitRelativePath:string;
}
class MODULETYPE{
	public static ROLE:string = "role";
	public static EFFECT:string = "effect";
	public static WEAPON:string = "weapon";
	public static EDIT:string = "edit";
}