window.boot = function () {
    var settings = window._CCSettings;
    window._CCSettings = undefined;
    // remove android pkm support
    // [".pkm", ".pvr", ".webp", ".jpg", ".jpeg", ".bmp", ".png"]
    cc.macro.SUPPORT_TEXTURE_FORMATS = [".pvr", ".jpg", ".jpeg", ".bmp", ".png"];
    let {
        RESOURCES,
        INTERNAL,
        MAIN,
        START_SCENE
    } = cc.AssetManager.BuiltinBundleName;
    var onStart = function onStart () {
        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);
        var launchScene = settings.launchScene; // load scene

        cc.director.loadScene(launchScene, null, function () {
            console.log('Success to load scene: ' + launchScene);
        });
    };

    // Adjust frameRate by hardware
    var frameRate = 30;
    if (cc.sys.os == cc.sys.OS_IOS) {
        // IOS
        var info = wx.getSystemInfoSync();
        switch (info.model) {
            case 'iPhone 6':
            case 'iPhone 7':
            case 'iPhone 8':
            case 'iPhone 6/7/8':
            case 'iPhone 6 Plus':
            case 'iPhone 7 Plus':
            case 'iPhone 8 Plus':
            case 'iPhone 6/7/8 Plus':
                frameRate = 30;
                break;

            default:
                frameRate = 60;
                break;
        }
    } else if (cc.sys.os == cc.sys.ANDROID) {
        // Android
        var info = wx.getSystemInfoSync();
        frameRate = info.benchmarkLevel > 20 ? 60 : 30;
    } else {
        // Desktop
        frameRate = 60;
    }

    var isSubContext = cc.sys.platform === cc.sys.WECHAT_GAME_SUB;
    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: !isSubContext && settings.debug,
        frameRate: frameRate,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix
    };
    cc.assetManager.init({
        bundleVers: settings.bundleVers,
        subpackages: settings.subpackages,
        remoteBundles: settings.remoteBundles,
        server: settings.server,
        subContextRoot: settings.subContextRoot
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