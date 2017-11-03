var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 资源管理器
 */
var AssetsMgr = (function () {
    function AssetsMgr() {
        this.assetDic = new Dictionary();
        this.skillGrouList = new List();
        //===================加载资源组数据=================================
        /**等待资源组加载队列*/
        this.g_map = [];
        /**是否可加载*/
        this.g_isLoad = true;
        this.g_groupName = "";
        this.g_name = "";
    }
    AssetsMgr.prototype.init = function () {
        var _this = this;
        var group = RES.getGroupByName("skill");
        group.forEach(function (elem) {
            _this.skillGrouList.add(elem.name);
        }, this);
    };
    /**
     * 加载资源组
     * groupName: string 要加载的资源组名称
     * callBackFunc:Function 回调函数
     * data:any 回调作用域
     */
    AssetsMgr.prototype.loadGroup = function (groupName, callBackFunc, thisArg) {
        if (!this.g_isLoad) {
            var data = {};
            data["_groupName"] = groupName;
            data["_callBack"] = callBackFunc;
            data["_this"] = thisArg;
            this.g_map.push(data);
            return;
        }
        this.g_isLoad = false;
        this.g_callback = callBackFunc;
        this.g_thisArg = data;
        var groupLoadRes = false;
        if (!RES.isGroupLoaded(groupName)) {
            groupLoadRes = true;
        }
        if (groupLoadRes) {
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.g_name = groupName;
            RES.loadGroup(groupName);
        }
        else {
            this.g_callback.call(this.g_thisArg);
            this.g_isLoad = true;
            if (this.g_map.length) {
                var temp = this.g_map.shift();
                this.loadGroup(temp["_groupName"], temp["_callBack"], temp["_this"]);
            }
        }
    };
    /**
     * 资源组加载完成
     */
    AssetsMgr.prototype.onResourceLoadComplete = function (event) {
        //if (event.groupName == this.assetsSourceArr[this.index]) {
        egret.log("LoadComplete:" + event.groupName + " ");
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        this.g_callback(this.g_thisArg);
        this.g_isLoad = true;
        if (this.g_map.length) {
            var temp = this.g_map.shift();
            this.loadGroup(temp["_groupName"], temp["_callback"], temp["_this"]);
        }
        //}
    };
    /**
     * 资源组加载失败
     */
    AssetsMgr.prototype.onResourceLoadError = function (event) {
        egret.warn("LoadError:" + event.groupName + " has failed to load");
    };
    /**
     *资源组加载进度
     */
    AssetsMgr.prototype.onResourceProgress = function (event) {
        if (event.groupName == this.g_name) {
            var p = event.itemsLoaded / event.itemsTotal;
            egret.log(this.g_name + "  current====" + p.toFixed(0));
        }
    };
    //======================================加载MovieClip===========================================
    /**
     * 加载单个movieClip
     * @param:{filePath} MovipClip资源文件
     * @param:{callBack} 加载完成后的回调
     * @param:{thisArg}  回调作用域
     */
    AssetsMgr.prototype.loadSingleMovieFile = function (filePath, callBack, thisArg, index) {
        var mcFactory = new egret.MovieClipDataFactory();
        var textureBoo = false, jsonBoo = false;
        var fileName = filePath.split("/").pop();
        var mc;
        var jsonData = {};
        RES.getResByUrl(filePath + ".json", function (t) {
            mcFactory.mcDataSet = t;
            jsonBoo = true;
            jsonData = t;
            if (textureBoo) {
                mc = new egret.MovieClip(mcFactory.generateMovieClipData(fileName));
                callBack.call(thisArg, mc, fileName, index, jsonData);
            }
        }, this, RES.ResourceItem.TYPE_JSON);
        RES.getResByUrl(filePath + ".png", function (t) {
            mcFactory.texture = t;
            textureBoo = true;
            if (jsonBoo) {
                mc = new egret.MovieClip(mcFactory.generateMovieClipData(fileName));
                callBack.call(thisArg, mc, fileName, index, jsonData);
            }
        }, this, RES.ResourceItem.TYPE_IMAGE);
    };
    /**
     * 加载movieClip集合
     * @param:{filePath} 资源路径
     * @param:{id} 资源id
     * @param:{condition} 条件 el: role/{0}_a_{1}
     */
    AssetsMgr.prototype.loadMovieGroup = function (filePath, id, condition, callBack, thisArg) {
        var _this = this;
        var dict = new Dictionary();
        var conditionStr = condition;
        var count = 1;
        var len = 9;
        var errorNum = 0;
        for (var i = 1; i < len; i++) {
            conditionStr = conditionStr.format(condition, [id, i]);
            var path = filePath + conditionStr;
            if (!this.hasMovieGroupRes("30300_a_" + i + "_png")) {
                errorNum += 1;
                count += 1;
                continue;
            }
            this.loadSingleMovieFile(path, function (mc, name, index) {
                dict.add(index, mc);
                count += 1;
                _this.assetDic.add(name, mc);
                if (count >= len - errorNum) {
                    errorNum = 0;
                    count = 0;
                    callBack.call(thisArg, dict);
                }
            }, this, i);
        }
    };
    /**获取组资源 */
    AssetsMgr.prototype.hasMovieGroupRes = function (key) {
        var str = this.skillGrouList.find(function (elem) { return key === elem; });
        return str;
    };
    //=============================加载文本文件==============================
    /**
     * 加载文本配置文件
     * @param:{filePath} 地图文件路径
     * @param:{callBack} 加载完成后的回调
     * @param:{thisArg}  回调作用域
     */
    AssetsMgr.prototype.loadSingleText = function (filePath, callBack, thisArg) {
        RES.getResByUrl(filePath, function (dataObj) {
            if (!!callBack) {
                callBack.call(thisArg, dataObj, filePath);
            }
        }, this, RES.ResourceItem.TYPE_JSON);
    };
    /**
     * 加载文本配置文件组
     * @param:{fileGroup} 地图文件组
     * @param:{callBack}  加载完成后的回调
     * @param:{thisArg}   回调作用域
     */
    AssetsMgr.prototype.loadTextGroup = function (fileGroup, callBack, thisArg, singleCallBack, singleThis) {
        var _this = this;
        var dict = new Dictionary();
        var count = 0;
        var len = fileGroup.length;
        var ifLoad = true;
        fileGroup.forEach(function (elem) {
            _this.loadSingleText(elem, function (dataObj, filePath) {
                var name = filePath.split("/").pop().split(".").shift();
                count++;
                dict.add(name, dataObj);
                if (singleCallBack && singleThis) {
                    singleCallBack.call(singleThis, dataObj);
                }
                ifLoad = true;
                if (count >= len) {
                    count = 0;
                    callBack.call(thisArg, dict);
                    return;
                }
            }, _this);
        }, this);
    };
    //===============================加载图片资源===================================
    /**
     * 加载单个图片资源
     * @param:{filePath} 图片资源路径
     * @param:{callBack} 加载完成后的回调
     * @param:{thisArg}  回调作用域
     */
    AssetsMgr.prototype.loadSinglePicture = function (filePath, callBack, thisArg) {
        var _this = this;
        var texture;
        RES.getResByUrl(filePath, function (texture) {
            texture = texture;
            var name = filePath.split("/").pop().split(".").shift();
            var bmp = new egret.Bitmap(texture);
            _this.assetDic.add(name, bmp);
            callBack.call(thisArg, bmp, name);
        }, this, RES.ResourceItem.TYPE_IMAGE);
    };
    /**
     * 加载多个图片资源组=>
     * @param:{picGroup} 图片资源路径组
     * @param:{callBack} 加载完成后的回调
     * @param:{thisArg}  回调作用域
     */
    AssetsMgr.prototype.loadPictureGroup = function (picGroup, callBack, thisArg) {
        var _this = this;
        var picDict = new Dictionary();
        var count = 0, len = picGroup.length;
        picGroup.forEach(function (elem) {
            _this.loadSinglePicture(elem, function (bmp, name) {
                picDict.add(name, bmp);
                count += 1;
                _this.assetDic.add(name, bmp);
                if (count >= len) {
                    count = 0;
                    callBack.call(thisArg, picDict);
                }
            }, _this);
        }, this);
    };
    /**
     * 获取资源
     * T--type：{Bitmap，MovieClip}
     * @param:{fileName}文件名称
     */
    AssetsMgr.prototype.getAssets = function (fileName) {
        var item = this.assetDic.getValue(fileName);
        return item;
    };
    /**
     * 销毁资源
     * @param:{fileName} 文件名称
     */
    AssetsMgr.prototype.destoryAsset = function (fileName) {
        this.assetDic.remove(fileName);
    };
    return AssetsMgr;
}());
AssetsMgr.instance = new AssetsMgr();
__reflect(AssetsMgr.prototype, "AssetsMgr");
//# sourceMappingURL=AssetsMgr.js.map