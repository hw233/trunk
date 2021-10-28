"use strict";

let first_scene = require("./first-screen.js");
first_scene.init();
first_scene.loadImage("images/logo.png", function () {
    // 渲染首屏
    let callback = function () {
        if (!first_scene.render()) return;
        requestAnimationFrame(callback);
    };
    requestAnimationFrame(callback);
    first_scene.render();
    wx.showLoading({
        title: '加载中...'
    });
    /**
     * 异步执行返回Promise支持链式异步
     * @param {*} fn 
     */
    let execSync = function (fn) {
        return new Promise((resolve, reject) => {
            if (!fn) {
                reject('ERROR');
                return;
            }
            setTimeout(function () {
                fn();
                resolve('OK');
            }, 0);
        });
    };

    execSync(function () {
            // 加载适配器
            require('adapter-min.js');
            __globalAdapter.init();
        })
        .then(function () {
            // 加载引擎
            requirePlugin('cocos');
            __globalAdapter.adaptEngine();
        })
        .then(function () {
            // 加载游戏配置
            require('./ccRequire');
            require('./src/settings');
            require('./main');
            // 测试环境和体验版
            switch (__wxConfig.envVersion) {
                case "trial": // 测试环境，体验版
                case "develop": // 工具或者真机，开发环境
                    let s = _CCSettings.server;
                    if (s.endsWith('/')) {
                        s = s.substr(0, s.length - 1);
                    }
                    _CCSettings.server = s + '_trial3/';
                    break;
            }
            if (__wxConfig.platform == "devtools") {
                _CCSettings.server = "http://192.168.3.182:5000/wechatgame/";
            }
            // Adjust devicePixelRatio
            cc.view._maxPixelRatio = 4;
            if (cc.dynamicAtlasManager) {
                cc.macro.CLEANUP_IMAGE_CACHE = false;
                cc.dynamicAtlasManager.enabled = true;
            } else if (cc.sys.platform !== cc.sys.WECHAT_GAME_SUB) {
                // Release Image objects after uploaded gl texture
                cc.macro.CLEANUP_IMAGE_CACHE = true;
            }
        })
        .then(function () {
            // 启动
            window.boot();
            first_scene.destroy();
        });
});