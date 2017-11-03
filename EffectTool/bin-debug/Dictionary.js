var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Dictionary = (function () {
    function Dictionary() {
        this.dict = [];
        //this.keyArr=[];
    }
    //public keyArr:Array<KEY>;
    /**
     * 向字典中添加一个对象
     * @param key 对象名
     * @param value 对象
     */
    Dictionary.prototype.add = function (key, value) {
        var findObj = this.getValue(key);
        if (!!findObj) {
            findObj["_value"] = value;
        }
        else {
            this.dict.push({ _key: key, _value: value });
        }
    };
    /**
     * 移除字典中的对象
     * @param key 对象名
     *
     */
    Dictionary.prototype.remove = function (key) {
        var index = this.getIndex(key);
        if (index >= 0) {
            this.dict.splice(index, 1);
            return true;
        }
        return false;
    };
    Dictionary.prototype.clear = function () {
        this.dict = [];
    };
    /**
     * 查找字典中是否存在对象
     * @param key 对象名
     */
    Dictionary.prototype.hasKey = function (key) {
        return this.getIndex(key) >= 0;
    };
    Dictionary.prototype.getIndex = function (key) {
        var len = this.dict.length;
        if (!len) {
            return -1;
        }
        for (var i = 0; i < len; i++) {
            if (this.dict[i]["_key"] == key) {
                return i;
            }
        }
        return -1;
    };
    /**
     * 获取字典中的对象
     * @param key 对象名
     *
     */
    Dictionary.prototype.getValue = function (key) {
        var len = this.dict.length;
        if (!len) {
            return undefined;
        }
        for (var i = 0; i < len; i++) {
            if (this.dict[i]["_key"] == key) {
                return this.dict[i]["_value"];
            }
        }
        return;
    };
    //遍历容器返回每个值
    Dictionary.prototype.foreach = function (callbackFunc, thisArg) {
        if (!this.dict || this.dict.length == 0)
            return;
        this.dict.forEach(function (elem) {
            callbackFunc.call(thisArg, elem["_value"], elem["_key"]);
        });
    };
    Object.defineProperty(Dictionary.prototype, "keys", {
        //获得所有Key值
        get: function () {
            var keyArr = new List();
            this.dict.forEach(function (elem) {
                keyArr.add(elem["_key"]);
            });
            return keyArr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "values", {
        //获得所有value值
        get: function () {
            var valueArr = new List();
            this.dict.forEach(function (elem) {
                valueArr.add(elem["_value"]);
            });
            return valueArr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "count", {
        get: function () { return this.dict.length; },
        enumerable: true,
        configurable: true
    });
    return Dictionary;
}());
__reflect(Dictionary.prototype, "Dictionary");
//# sourceMappingURL=Dictionary.js.map