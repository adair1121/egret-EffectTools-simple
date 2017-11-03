var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FileModule;
(function (FileModule) {
    var _fileData;
    var m_stage;
    var testPanel;
    var FileOper = (function () {
        function FileOper() {
        }
        FileOper.prototype.sendFileData = function (fileData, type) {
            _fileData = fileData[0];
            if (!_fileData) {
                return;
            }
            if (!m_stage) {
                m_stage = egret.MainContext.instance.stage;
                testPanel = new TestModule();
                m_stage.addChild(testPanel);
            }
            DataCenter.curFileData = _fileData;
            var absPath = _fileData.path;
            var path = absPath.split(".").shift();
            var transPath = path.replace(/\\/g, "/");
            var relaPath = transPath.match(/resource\/(\S*)/)[1];
            AssetsMgr.instance.loadSingleMovieFile("resource/" + relaPath, function (mc, name, index, jsonData) {
                DataCenter.curTestMc = mc;
                testPanel.initSkillModule(mc, type, _fileData.name, jsonData);
                // testPanel.x = testPanel.y = 0;
            }, this);
        };
        return FileOper;
    }());
    FileModule.FileOper = FileOper;
    __reflect(FileOper.prototype, "FileModule.FileOper");
    function hideFile() {
        hideFileLoad();
    }
    FileModule.hideFile = hideFile;
    function showFile() {
        showFileLoad();
    }
    FileModule.showFile = showFile;
    /**
     * 显示特效编辑
     */
    function showEffetEdit() {
        showEdit();
    }
    FileModule.showEffetEdit = showEffetEdit;
    function hideEffectEdit() {
        hideEdit();
    }
    FileModule.hideEffectEdit = hideEffectEdit;
})(FileModule || (FileModule = {}));
var PNGFILE = (function () {
    function PNGFILE() {
    }
    return PNGFILE;
}());
__reflect(PNGFILE.prototype, "PNGFILE");
var MODULETYPE = (function () {
    function MODULETYPE() {
    }
    return MODULETYPE;
}());
MODULETYPE.ROLE = "role";
MODULETYPE.EFFECT = "effect";
MODULETYPE.WEAPON = "weapon";
MODULETYPE.EDIT = "edit";
__reflect(MODULETYPE.prototype, "MODULETYPE");
//# sourceMappingURL=FileOper.js.map