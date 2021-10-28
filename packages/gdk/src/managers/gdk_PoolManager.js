/**
 * 对象池管理器, 
 * 会定时自动清理不活跃的对象。
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-08-29 13:56:41
 */

const Pool = require("../core/gdk_Pool");
const Cache = require("../core/gdk_Cache");
const EventTrigger = require("../core/gdk_EventTrigger");
const Log = require("../Tools/gdk_Log");

var PoolManager = {
    /**
     * 当对象池加入一个对象时触发
     * @event 参数：key,obj
     */
    onPut: new EventTrigger(),
    /**
     *   当从对象池中取出一个对象时触发，如果池中没对象，参数obj为空 
     * @event 参数：key,obj
     */
    onGet: new EventTrigger(),
    /**
     * 当对象池中一个对象被清理时触发。
     * @event 参数：key,obj
     */
    onClear: new EventTrigger(),

    /**
     * 设置创建对象函数， 当调用PoolManager.get(key)获取对象时，如果池中对象为空，则调用该函数来创建。
     * @method setCreateFun
     * @param {function} fun  函数内需要return 创建的对象
     */
    setCreateFun (key, fun) {
        var pool = _getPool(key, true);
        pool.createFun = fun;
    },

    /**
     * @method getCreateFun
     */
    getCreateFun (key) {
        var pool = _getPool(key, false);
        if (pool) {
            return pool.createFun;
        }
        return null;
    },

    /**
     * 把一个对象放进对象池
     * @method put
     * @param {string} key 
     * @param {any} obj 
     */
    put (key, obj) {
        var pool = _getPool(key, true);
        pool.put(obj);
    },

    /**
     * 从对象池取出一个对象， 若池中没对象，则调用PoolManager.setCreateFun(key,fun)中设置fun函数来创建，否则返回空
     * @method get
     * @param {string} key 
     */
    get(key) {
        var pool = _getPool(key, false);
        var obj = null;
        if (pool) {
            obj = pool.get(obj);
        }
        return obj;
    },

    /**
     * 清理指定对池池
     * @method clear
     * @param {string} key 
     */
    clear (key) {
        var pool = _getPool(key, false);
        if (pool) {
            _putPool(key);
        }
    },

    /**
     * 清理所有对象池
     * @method clearAll
     */
    clearAll () {
        for (var key in _poolDic) {
            _putPool(key);
        }
    },

    /**
     * 清理指定对象池中不活跃的对象
     * @method clearInactivity
     * @param {string} key 
     */
    clearInactivity (key) {
        var pool = _getPool(key, false);
        if (pool) {
            pool.clearInactivity();
        }
    },

    /**
     * 清理对象池中所有不活跃的对象
     * @method clearAllInactivity
     */
    clearAllInactivity () {
        for (var key in _poolDic) {
            var pool = _poolDic[key];
            pool.clearInactivity();
        }
    },

    /**
     * 对象池大小
     * @method getSize
     * @param {string} key 
     */
    getSize (key) {
        var pool = _getPool(key, false);
        if (pool) {
            return pool.size;
        }
        return 0;
    },

    /**
     * 设置对象池大小
     * @method setSize
     * @param {string} key 
     * @param {number} size 大小,默认10
     */
    setSize (key, size) {
        var pool = _getPool(key, true);
        pool.size = size;
        return pool;
    },

    /**
     * 获取指定对象池中对象数量
     * @method getCount
     * @param {string} key 
     */
    getCount (key) {
        var pool = _getPool(key, false);
        if (pool) {
            return pool.count;
        }
        return 0;
    },

    /**
     * 获取指定对象池的清理不活跃对象的时间，单位：秒， 默为2分钟
     * @method getClearTime
     * @param {string} key 
     */
    getClearTime (key) {
        var pool = _getPool(key, false);
        if (pool) {
            return pool.clearTime;
        }
        return 0;
    },

    /**
     * 设置指定对象池的清理不活跃对象的时间，单位：秒， 默为2分钟
     * @method setClearTime
     * @param {string} key 
     */
    setClearTime (key, time) {
        var pool = _getPool(key, true);
        pool.clearTime = time;
        return pool;
    },

    /**
     * 只能缓存一个对象， 如果对象定义有unuse方法，则调用。
     * 不活跃时间到后自动清理，如果对象定义有destroy方法，则调用， 如果参数clearFun不为空，则调用.
     * 如果指定key的对象已缓被存， 则不会覆盖原有缓存，直接返回
     * @method cache
     * @param {string} key 键值
     * @param {any} obj 
     * @param {*} clearTime 缓存时间 ,单位:秒,默认2分钟
     * @param {*} clearFun  清理时回调
     */
    cache (key, obj, clearTime = 120, clearFun = null) {
        if (Cache.has(key)) {
            Log.errorEnable && Log.error(`PoolManager.cache Error: ${key} has exist!! destroy this one`);
            var node = null;
            if (obj instanceof cc.Node) {
                node = obj;
            } else if (obj instanceof cc.Component) {
                node = obj.node;
            }
            if (node) {
                return node.destroy();
            }
            return;
        }
        if (obj != null) {
            _unuseNodeOrComponent(obj);
        }
        if (obj instanceof cc.Component) {
            var clearFunTemp = clearFun;
            clearFun = function () {
                if (clearFunTemp)
                    clearFunTemp();
                obj.node.destroy();
            }
        }
        Cache.put(key, obj, clearTime, clearFun);
    },

    /**
     * 从缓存中获取一个对象，如果缓存已被清理返回null
     * @method getCache
     * @param {string} key 
     */
    getCache (key) {
        var obj = Cache.get(key);
        if (obj != null) {
            if (_isValid(obj)) {
                _reuseNodeOrComponent(obj);
            } else {
                obj = null;
            }
        }
        return obj;
    },

    /**
     * 不再缓存指定对象，并清理它
     * @method unCache
     * @param {string} key 
     */
    unCache (key) {
        Cache.clear(key);
    },

    /**
     * 清理所有缓存对象
     * @method unCacheAll
     */
    unCacheAll () {
        Cache.clearAll();
    },

    /**
     * 当前缓存对象数
     * @param {string} key 
     */
    getCacheCount (key) {
        return Cache.count;
    },

    /**
     * 从缓存中获取一个对象，如果缓存已被清理返回null
     * @method getCache
     * @param {string} key 
     */
    getCacheOrPool (key) {
        return PoolManager.getCache(key) || PoolManager.get(key);
    },

    isInCacheOrPool (obj) {
        return obj.__gdk_inPool__ == true;
    },

    /**
     * 非公开接口，获取所有pool对象
     */
    __getPoolDic () {
        return _poolDic;
    }
};

///   私有   //
var _poolDic = Object.create(null);

function _getPool (key, autoCreate) {
    var pool = _poolDic[key];
    if (pool == null && autoCreate) {
        _poolDic[key] = pool = new Pool();
        pool.onGet = _onGet(key);
        pool.onPut = _onPut(key);
        pool.onClear = _onClear(key);
    }
    return pool;
};

function _putPool (key) {
    var pool = _poolDic[key];
    if (pool) {
        pool.clearAll();
        delete pool.onGet;
        delete pool.onPut;
        delete pool.onClear;
        delete _poolDic[key];
    }
}

function _onGet (key) {
    return function (obj) {
        if (_isValid(obj)) {
            _reuseNodeOrComponent(obj);
            PoolManager.onGet.emit(key, obj);
        }
    };
};

function _onPut (key) {
    return function (obj) {
        _unuseNodeOrComponent(obj);
        PoolManager.onPut.emit(key, obj);
    };
};

function _onClear (key) {
    return function (obj) {
        _destroyNodeOrComponent(obj);
        PoolManager.onClear.emit(key, obj);
    };
};

function _isValid (obj) {
    var node = null;
    if (obj instanceof cc.Node) {
        node = obj;
    } else if (obj instanceof cc.Component) {
        node = obj.node;
    }
    if (node) {
        return cc.isValid(obj, true);
    }
    return true;
};

function _reuseNodeOrComponent (obj) {
    var node = null;
    if (obj instanceof cc.Node) {
        node = obj;
    } else if (obj instanceof cc.Component) {
        node = obj.node;
    }
    if (node) {
        for (let i = 0, n = node._components.length; i < n; ++i) {
            let comp = node._components[i];
            if (comp.reuse) {
                comp.reuse.call(comp);
            }
        }
    }
};

function _unuseNodeOrComponent (obj) {
    var node = null;
    if (obj instanceof cc.Node) {
        node = obj;
    } else if (obj instanceof cc.Component) {
        node = obj.node;
    }
    if (node && node.parent) {
        node.removeFromParent(false);
        for (let i = 0, n = node._components.length; i < n; ++i) {
            let comp = node._components[i];
            if (comp.unuse) {
                comp.unuse.call(comp);
            }
        }
    }
};

function _destroyNodeOrComponent (obj) {
    var node = null;
    if (obj instanceof cc.Node) {
        node = obj;
    } else if (obj instanceof cc.Component) {
        node = obj.node;
    }
    if (node) {
        node.destroy();
    }
};

module.exports = PoolManager;