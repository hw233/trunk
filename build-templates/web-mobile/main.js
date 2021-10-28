window.boot = function () {
    var settings = window._CCSettings;
    window._CCSettings = undefined;

    let {
        RESOURCES,
        INTERNAL,
        MAIN,
        START_SCENE
    } = cc.AssetManager.BuiltinBundleName;
    var onStart = function () {

        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);

        if (cc.sys.isMobile) {
            if (settings.orientation === 'landscape') {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            } else if (settings.orientation === 'portrait') {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }
            cc.view.enableAutoFullScreen([
                cc.sys.BROWSER_TYPE_BAIDU,
                cc.sys.BROWSER_TYPE_BAIDU_APP,
                cc.sys.BROWSER_TYPE_WECHAT,
                cc.sys.BROWSER_TYPE_MOBILE_QQ,
                cc.sys.BROWSER_TYPE_MIUI,
            ].indexOf(cc.sys.browserType) < 0);
        }

        // Limit downloading max concurrent task to 2,
        // more tasks simultaneously may cause performance draw back on some android system / browsers.
        // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
        if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.assetManager.downloader.maxConcurrency = 2;
            cc.assetManager.downloader.maxRequestsPerFrame = 2;
        }

        var launchScene = settings.launchScene;
        var bundle = cc.assetManager.bundles.find(function (b) {
            return b.getSceneInfo(launchScene);
        });

        bundle.loadScene(launchScene, null, null,
            function (err, scene) {
                if (!err) {
                    cc.director.runSceneImmediate(scene);
                    if (cc.sys.isBrowser) {
                        // show canvas
                        var canvas = document.getElementById('GameCanvas');
                        canvas.style.visibility = '';
                        var div = document.getElementById('GameDiv');
                        if (div) {
                            div.style.backgroundImage = '';
                        }
                        // hide splash
                        var splash = document.getElementById('splash');
                        if (splash) {
                            splash.style.display = 'none';
                            splash.remove();
                        }
                        console.log('Success to load scene: ' + launchScene);
                    }
                }
            }
        );
    };

    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    };

    cc.assetManager.init({
        bundleVers: settings.bundleVers,
        remoteBundles: settings.remoteBundles,
        server: settings.server
    });

    // load plugins
    cc.assetManager.loadScript(settings.jsList.map(x => 'src/' + x), function () {
        let bundleRoot = [INTERNAL, MAIN];
        settings.hasStartSceneBundle && bundleRoot.push(START_SCENE);
        settings.hasResourcesBundle && bundleRoot.push(RESOURCES);

        // load bundle callback
        let count = 0;
        let callback = function (err) {
            if (err) return console.error(err.message, err.stack);
            if (++count >= bundleRoot.length) {
                // all bundles loaded
                cc.game.run(option, onStart);
            }
        };
        // load bundle
        for (let i = 0; i < bundleRoot.length; i++) {
            cc.assetManager.loadBundle(bundleRoot[i], callback);
        }
    });
};