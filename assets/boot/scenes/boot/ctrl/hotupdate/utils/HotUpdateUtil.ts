import BPanelId from '../../../../../configs/ids/BPanelId';
/** 
 * 原生热更工具类
 * @Author: sthoo.huang  
 * @Date: 2020-02-26 16:40:07 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-06-09 13:38:26
 */
class HotUpdateUtilClass {

    private _am: jsb.AssetsManager;
    private _updating: boolean;
    private _cb: Function;
    private _thisArg: any;

    // 热更目录
    get storagePath() {
        return (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset';
    }

    // 本地热更文件路径
    get manifestRoot() {
        let info = cc.resources.getInfoWithPath('view/hotupdate/data/project');
        if (info) {
            let uuid = info.uuid as string;
            let url = `${cc.resources.base}import/${uuid.substr(0, 2)}/`;
            return url;
        }
        return '';
    }

    // AssetsManager实例
    get assetsManager() {
        if (!this._am && jsb) {
            this._am = jsb.AssetsManager.create('', this.storagePath);
            this._am.setVersionCompareHandle((versionA: string, versionB: string) => {
                CC_DEBUG && console.debug("[HotUpdate] JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
                // 版本号格式: 3.0.0408.49319b
                let ret = 0;
                var vbs = versionB.split('.');
                versionA.split('.').some((a, i) => {
                    ret = parseInt(a) - parseInt(vbs[i]);
                    if (isNaN(ret)) {
                        // 版本号格式存在异常，不是数字
                        ret = 0;
                    }
                    if (ret != 0) {
                        // 不相等则根据版本号大小确定具体使用哪个版本
                        return true;
                    }
                });
                return ret;
            });
            this._am.setVerifyCallback((path: string, asset: any) => {
                // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
                var compressed = asset.compressed;
                // Retrieve the correct md5 value.
                var expectedMD5 = asset.md5;
                // asset.path is relative path and path is absolute.
                var relativePath = asset.path;
                // The size of asset file, but this value could be absent.
                var size = asset.size;
                if (compressed) {
                    CC_DEBUG && console.debug("[HotUpdate] Verification passed : " + relativePath);
                    return true;
                } else {
                    CC_DEBUG && console.debug("[HotUpdate] Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                    return true;
                }
            });
            this._loadLocalManifest(this._am);
        }
        return this._am;
    }

    // 检查更新
    checkUpdate(cb?: Function, thisArg?: any) {
        if (this._updating) return;
        if (gdk.panel.isOpenOrOpening(BPanelId.HotUpdate)) return;
        // 设置状态
        this._updating = true;
        this._cb = cb;
        this._thisArg = thisArg;
        // 清除旧的AssetsManager实例
        if (this._am) {
            this._am.setEventCallback(null);
            this._am.setVerifyCallback(null);
            this._am = null;
        }
        // 状态检查
        let am = this.assetsManager;
        if (am.getState() === jsb.AssetsManager.State.UNINITED) {
            // 加载本地manifest文件
            this._loadLocalManifest(am, this._loadLocalManifestComplete, this);
        } else {
            // 已初始化
            this._loadLocalManifestComplete();
        }
    }

    // 加载本地Manifest文件
    private _loadLocalManifest(am: jsb.AssetsManager, cb?: Function, thisArg?: any) {
        let resId = 0;
        let url = 'view/hotupdate/data/project';
        gdk.rm.loadRes(resId, url, cc.TextAsset, (res: cc.TextAsset) => {
            let con = gdk.pako.ungzip(gdk.Buffer.from(res.text, 'base64'));
            let man = new jsb.Manifest(gdk.Buffer.from(con).toString('utf8'), this.manifestRoot);
            am.loadLocalManifest(man, this.storagePath);
            gdk.rm.releaseRes(resId, res);
            cb && cb.call(thisArg);
        });
    }

    // 本地manifest文件加载完成
    private _loadLocalManifestComplete() {
        let am = this.assetsManager;
        // 加载失败
        if (!am.getLocalManifest() || !am.getLocalManifest().isLoaded()) {
            console.error('[HotUpdate] Failed to load local manifest ...');
            this._updating = false;
            this._execCallBack();
            return;
        }
        // 设置回调
        am.setEventCallback((event: any) => {
            CC_DEBUG && console.debug('Code: ' + event.getEventCode());
            switch (event.getEventCode()) {
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                    CC_DEBUG && console.debug("[HotUpdate] No local manifest file found, hot update skipped.");
                    this._execCallBack();
                    break;

                case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                    CC_DEBUG && console.debug("[HotUpdate] Fail to download manifest file, hot update skipped.");
                    this._execCallBack();
                    break;

                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    CC_DEBUG && console.debug("[HotUpdate] Already up to date with the latest remote version.");
                    this._execCallBack();
                    break;

                case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                    CC_DEBUG && console.debug('[HotUpdate] New version found, please try to update.');
                    iclib.GuideUtil && iclib.GuideUtil.destroy();
                    gdk.panel.open(BPanelId.HotUpdate, null, null, { parent: gdk.gui.layers.systemPopLayer });
                    break;

                default:
                    return;
            }
            // 还原状态
            this._updating = false;
            this._cb = null;
            this._thisArg = null;
            am.setEventCallback(null);
        });
        // 设置状态并检查更新
        am.checkUpdate();
    }

    // 执行回调
    private _execCallBack() {
        let cb = this._cb;
        if (cb) {
            let thisArg = this._thisArg;
            this._cb = null;
            this._thisArg = null;
            cb.call(thisArg);
        }
    }
}

const HotUpdateUtil = gdk.Tool.getSingleton(HotUpdateUtilClass);
export default HotUpdateUtil;