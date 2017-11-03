var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * List
 */
var List = (function () {
    function List(arr) {
        this.operArr = new Array();
        if (!!arr)
            this.operArr = this.operArr.concat(arr);
    }
    /**
     * 添加元素
     * @param {element} 元素
     */
    List.prototype.add = function (element) {
        this.operArr.push(element);
        return this.operArr;
    };
    /**
     * 添加元素集合
     * @param {gather} 元素集合
     */
    List.prototype.addRange = function (gather) {
        this.operArr = this.operArr.concat(gather);
        return this.operArr;
    };
    /**
     * 添加元素集合
     * @param {gather} 元素集合
     */
    List.prototype.addListRange = function (gather) {
        if (!!gather && gather.count > 0)
            this.operArr = this.operArr.concat(gather.operArr);
        return this;
    };
    /**
     * 清除元素
     */
    List.prototype.clear = function () {
        this.operArr = [];
    };
    /**
     * 查询List中是否包含元素
     */
    List.prototype.contains = function (element) {
        if (!!this.count) {
            var index = this.operArr.indexOf(element);
            if (index === -1) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    };
    /**
     * 匹配满足查询条件的第一个元素
     */
    List.prototype.find = function (match, thisArg) {
        if (!!this.count) {
            for (var i = 0; i < this.operArr.length; i++) {
                if (match.call(thisArg, this.operArr[i])) {
                    return this.operArr[i];
                }
            }
        }
        return null;
    };
    /**
     * 匹配所有满足条件元素
     * @param: {match} 匹配方法
     */
    List.prototype.findAll = function (match, thisArg) {
        var arr = new Array();
        if (!!this.count) {
            this.operArr.forEach(function (elem) {
                if (match.call(thisArg, elem))
                    arr.push(elem);
            });
        }
        return arr;
    };
    /**
     * 查询元素index
     * @param: {match} 匹配方法
     */
    List.prototype.findIndex = function (match, thisArg) {
        if (!!this.count) {
            this.operArr.forEach(function (elem, index) {
                if (match.call(thisArg, elem))
                    return index;
            });
        }
        return -1;
    };
    /**
     * 查询元素index
     */
    List.prototype.indexOf = function (element) {
        if (!!this.count) {
            this.operArr.forEach(function (elem, index) {
                if (element === elem)
                    return index;
            });
        }
        return -1;
    };
    /**
     * 插入元素
     */
    List.prototype.insert = function (index, element) {
        this.operArr.splice(index, 0, element);
    };
    /**
     * 插入元素集合
     */
    List.prototype.insertRange = function (index, elements) {
        var firstArr = this.operArr.slice(0, index + 1);
        var secondArr = this.operArr.slice(index + 1);
        this.operArr = firstArr.concat(elements).concat(secondArr);
        return this.operArr;
    };
    /**
     * 清除匹配元素
     */
    List.prototype.removeAll = function (match, thisArg) {
        var deArr = new Array();
        if (!!this.count) {
            for (var i = this.count - 1; i >= 0; i--) {
                if (match.call(thisArg, this.operArr[i])) {
                    this.operArr.splice(i, 1);
                    deArr.push(this.operArr[i]);
                }
            }
        }
        return deArr;
    };
    /**
     * 清除某个item
     */
    List.prototype.removeItem = function (item) {
        var index = this.indexOf(item);
        if (index != -1) {
            this.operArr.splice(index, 1);
        }
    };
    /**
     * 根据index移除item
     */
    List.prototype.removeAt = function (index) {
        var item = this.getItem(index);
        if (!!item) {
            this.operArr.splice(index, 1);
        }
    };
    /**
     * 根据index获取元素
     */
    List.prototype.getItem = function (index) {
        if (this.count && index >= 0 && this.count > index) {
            return this.operArr[index];
        }
        return null;
    };
    /**
 * 根据index获取元素
 */
    List.prototype.setItem = function (index, value) {
        if (this.count && index >= 0 && this.count > index) {
            this.operArr[index] = value;
        }
    };
    //获取区域
    List.prototype.getRange = function (start, end) {
        return new List(this.operArr.slice(start, end));
    };
    /**
     * List排序
     */
    List.prototype.sort = function (compareFn) {
        return this.operArr.sort(compareFn);
    };
    ;
    /**
     * List遍历
     */
    List.prototype.forEach = function (callBackFunc, thisArg) {
        if (!!this.count) {
            this.operArr.forEach(function (value, index) {
                callBackFunc.call(thisArg, value, index);
            });
        }
    };
    /**
     * 返回数组
    */
    List.prototype.toArray = function () {
        return this.operArr;
    };
    /**
     * 复制并返回新的列表
    */
    List.prototype.toNewList = function () {
        return new List(this.operArr.slice(0));
    };
    Object.defineProperty(List.prototype, "count", {
        /**
         * 获取List长度
         */
        get: function () {
            return this.operArr.length;
        },
        enumerable: true,
        configurable: true
    });
    return List;
}());
__reflect(List.prototype, "List");
//# sourceMappingURL=List.js.map