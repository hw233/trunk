import BSdkTool from '../../../../../sdk/BSdkTool';
import HotUpdateUtil from '../utils/HotUpdateUtil';

/** 
 * 热更组件
 * @Author: sthoo.huang  
 * @Date: 2020-02-26 16:30:49 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-23 16:42:07
 */
const { ccclass, property, menu } = cc._decorator;

/**
 * 格式化bytes为单位的参数
 * @param value 
 * @returns 
 */
function formatSize(value: number) {
    if (null == value || value < 0 || isNaN(value)) {
        return "0 Bytes";
    }
    let unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
    let index = Math.floor(Math.log(value) / Math.log(1024));
    let size = value / Math.pow(1024, index);
    return size.toFixed(2) + unitArr[index];//保留的小数位数
};

@ccclass
@menu("qszc/view/hotupdate/HotUpdateView")
export default class HotUpdateView extends gdk.BasePanel {

    @property(cc.ProgressBar)
    byteProgress: cc.ProgressBar = null;
    @property(cc.Label)
    byteLabel: cc.Label = null;

    @property(cc.ProgressBar)
    fileProgress: cc.ProgressBar = null;
    @property(cc.Label)
    fileLabel: cc.Label = null;

    @property(cc.Label)
    infoLabel: cc.Label = null;

    private _am: jsb.AssetsManager;
    private _updating: boolean;
    private _canRetry: boolean;
    private _failCount: number;

    // 更新回调
    _updateCallBack(event: any) {
        let needRestart = false;
        let failed = false;
        let state = event ? event.getEventCode() : null;
        switch (state) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this._updateInfo('找不到本地版本文件.');
                failed = true;
                break;

            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                let percent = Math.min(1.0, event.getPercent());
                let totalBytes = event.getTotalBytes();
                this.byteProgress.progress = percent;
                this.fileProgress.progress = Math.min(1.0, event.getPercentByFile());
                this.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.byteLabel.string = formatSize(percent * totalBytes) + ' / ' + formatSize(totalBytes);
                this._updateInfo('正在更新...');
                break;

            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this._updateInfo('下载版本文件失败: ' + event.getMessage());
                failed = true;
                break;

            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this._updateInfo('已经是最新版.');
                failed = true;
                break;

            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this._updateInfo('更新完成. ');
                needRestart = true;
                break;

            case jsb.EventAssetsManager.UPDATE_FAILED:
                this._updateInfo('更新失败: ' + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                break;

            case jsb.EventAssetsManager.ERROR_UPDATING:
                this._updateInfo('文件错误: ' + event.getAssetId() + ' ' + event.getMessage());
                break;

            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this._updateInfo('解压错误: ' + event.getMessage());
                break;

            default:
                break;
        }

        if (event == null) {
            failed = true;
            needRestart = true;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            // Prepend the manifest's search path
            var searchPaths: string[] = jsb.fileUtils.getSearchPaths();
            var newPaths: string[] = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important otherwise new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            gdk.Timer.callLater(this, this._restartGameLater);
        }
    }

    // 重启游戏
    _restartGameLater() {
        BSdkTool.loaded && BSdkTool.tool.logout();
        gdk.DelayCall.addCall(() => {
            gdk.pool.clearAll();
            gdk.rm.releaseAll();
            cc.game.restart();
        }, null, 0.2);
    }

    // 信息更新
    _updateInfo(str: string) {
        this.infoLabel.string = str;
        CC_DEBUG && console.debug('[HotUpdate] ', str);
    }

    // 更新
    hotUpdate() {
        if (this._updating) return;
        if (this._canRetry) {
            // 重试下载失败项
            this._updateInfo(`重试...(${this._failCount})`);
            this._canRetry = false;
            this._am.downloadFailedAssets();
            return;
        }
        // 当前状态
        switch (this._am.getState()) {
            case jsb.AssetsManager.State.UPDATING:
            case jsb.AssetsManager.State.UNZIPPING:
            case jsb.AssetsManager.State.UP_TO_DATE:
                this._updateCallBack(null);
                return;
        }
        // 设置状态并更新
        this._am.setEventCallback(this._updateCallBack.bind(this));
        this._updating = true;
        this._failCount = 0;
        this._am.update();
    }

    onEnable() {
        this._updateInfo('检测到新版本.');
        this.fileProgress.progress = 0;
        this.byteProgress.progress = 0;
        this.fileLabel.string = '';
        this.byteLabel.string = '';
        this._am = HotUpdateUtil.assetsManager;
    }
}