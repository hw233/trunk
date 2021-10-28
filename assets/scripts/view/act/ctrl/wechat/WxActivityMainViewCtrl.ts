import ActivityUtils from '../../../../common/utils/ActivityUtils';
import PanelId from '../../../../configs/ids/PanelId';
import UIScrollSelect from '../../../lottery/ctrl/UIScrollSelect';
import WxActivityPageItemCtrl from './WxActivityPageItemCtrl';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;

/**sysId-panelId */
const activityPanelInfo: {
    url: string,
    type: number,
    level?: number,
    panelId: gdk.PanelValue,
}[] = [
        { // 1、邀请有礼（默认打开）
            url: 'gzyl_yaoqingyouli',
            type: 2,
            panelId: PanelId.WxShareGiftPanel,
        },
        { // 2、迎新有礼
            url: 'yqhd_yingxinyouli',
            type: 7,
            panelId: PanelId.WxNewShareGiftPanel,
        },
        { // 3、分享红包翻牌
            url: 'yqhd_fenxianghongbao',
            type: 8,
            panelId: PanelId.WxRedPacketPanel,
        },
        { // 4、成长大礼 30
            url: 'yqhd_chengzhangdali',
            type: 9,
            level: 35,
            panelId: PanelId.WxGrowGiftPanel,
        },
        { // 4、成长豪礼 60
            url: 'yqhd_chengzhanghaoli',
            type: 9,
            level: 60,
            panelId: PanelId.WxAdvGrowGiftPanel,
        },
        { // 5、邀请返利
            url: 'yqhd__chongzhifanli',
            type: 10,
            panelId: PanelId.WxRebatePanel,
        },
        { // 6、好友助力
            url: 'gzyl_haoyouzhuli',
            type: 102,
            panelId: PanelId.WxFriendGiftPanel,
        },
    ];

@ccclass
@menu("qszc/view/act/wechat/WxActivityMainViewCtrl")
export default class WxActivityMainViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    panelParent: cc.Node = null;
    @property(cc.Node)
    pageContent: cc.Node = null;
    @property(cc.Prefab)
    pagePrefab: cc.Prefab = null;

    curIdx: number;
    pageIndex: number[] = [];

    onEnable() {
        this._initPageItem();
        let idx = this.pageIndex[0];
        if (idx) {
            let toggle = this.pageContent.getChildByName(`toggle${idx}`).getComponent(cc.Toggle);
            toggle && toggle.check();
            if (this.pageContent.children.length >= 3) {
                let ctrl = this.pageContent.getComponent(UIScrollSelect);
                ctrl.scrollTo(idx, false);
            }
        }
    }

    onDisable() {
        // 关闭打开或打开中的子界面
        activityPanelInfo.forEach(e => gdk.panel.hide(e.panelId));
        this.curIdx = null;
        this.pageIndex = [];
    }

    onArrowClcik(e, data) {
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        if (ctrl.isTestX) return;
        if (this.pageContent.children.length <= 1) return;
        if (this.pageContent.children.length >= 5) {
            data == 'left' ? ctrl.scrollToLeft() : ctrl.scrollToRight();
        }
        let nextIdx;
        let len = this.pageContent.children.length;
        if (data == 'left') {
            nextIdx = this.curIdx - 1 < 0 ? len - 1 : this.curIdx - 1;
        }
        else {
            nextIdx = this.curIdx + 1 > len - 1 ? 0 : this.curIdx + 1;
        }
        let toggle = this.pageContent.getChildByName(`toggle${nextIdx}`)
        toggle && toggle.active && toggle.getComponent(cc.Toggle).check();
    }

    /**页签点击 活动数量<5时 有效 */
    onToggleClick(toggle: cc.Toggle) {
        let containerName = toggle['_toggleContainer'].node.name;
        if (!containerName) return;
        let toggleName = toggle.node.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        this._updatePanel(parseInt(idx));
    }

    /**页签滚动 活动数量>=5时 有效*/
    onUIScrollSelect(event: any) {
        let toggle = event.target;
        let index = event.index;
        if (!toggle.parent) return;
        let containerName = toggle.parent.name;
        if (containerName != 'pageContent') return;
        let toggleName = toggle.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        if (parseInt(idx) != index) {
            if (event.direction < 0) ctrl._toMoveX = -1;
            else ctrl._toMoveX = 1;
            ctrl.scrollTo(idx, true);
            toggle.getComponent(cc.Toggle).check();
        }
    }

    /**
     * 左右箭头红点
     */
    updateArrowRedPoint() {
        if (this.pageIndex.length < 5) return false;
        let idxs = [];
        let curIdx = this.curIdx;
        let nextIdx = this.curIdx + 1 > this.pageIndex.length - 1 ? 0 : this.curIdx + 1;
        let preIdx = this.curIdx - 1 < 0 ? this.pageIndex.length - 1 : this.curIdx - 1;
        idxs = [preIdx, curIdx, nextIdx];
        for (let i = 0; i < this.pageIndex.length; i++) {
            if (idxs.indexOf(this.pageIndex[i]) == -1) {
                let idx = this.pageIndex[i];
                let toggle = this.pageContent.getChildByName(`toggle${idx}`);
                if (toggle) {
                    return this.redPointCb(idx);
                }
            }
        }
        return false;
    }

    // 红点判断，只有存在可领取奖励时才显示红点
    redPointCb(idx: number) {
        let info = activityPanelInfo[idx];
        if (info.type == 102) {
            return false;
        }
        return this._pageIsOpen(idx, [2]);
    }

    // 判断页面状态
    _pageIsOpen(idx: number, status: number[]): boolean {
        let info = activityPanelInfo[idx];
        let cfgs = ActivityUtils.getPlatformConfigs(info.type);
        if (info.type == 9) {
            // 成长大礼，成长豪礼特殊处理
            for (let i = cfgs.length - 1; i >= 0; i--) {
                let c = cfgs[i];
                if (Math.floor(c.args / 100) != info.level) {
                    cfgs.splice(i, 1);
                }
            }
        }
        let isopen = false;
        if (cfgs && cfgs.length) {
            cfgs.sort((a, b) => { return b.type - a.type; });
            cfgs.some(c => {
                let s = ActivityUtils.getPlatformTaskStatue(c);
                if (status.indexOf(s) >= 0) {
                    isopen = true;
                    return true;
                }
                return false;
            });
        }
        return isopen;
    }

    /**更新活动页签类型 */
    _initPageItem() {
        this.pageIndex = [];
        activityPanelInfo.forEach((info, idx) => {
            if (this._pageIsOpen(idx, [0, 1, 2])) {
                let toggle = cc.instantiate(this.pagePrefab);
                toggle.parent = this.pageContent;
                let ctrl = toggle.getComponent(WxActivityPageItemCtrl);
                ctrl.updateView(idx, info.url, this.redPointCb.bind(this), idx);
                toggle.name = `toggle${idx}`;
                this.pageIndex.push(idx);
            }
        });
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        let layout = this.pageContent.getComponent(cc.Layout);
        ctrl.enabled = true;
        layout.enabled = false;
        this.pageContent.width = 599;
        if (this.pageContent.children.length < 5) {
            ctrl.enabled = false;
            layout.enabled = true;
            return;
        }
        ctrl.updateChilds();
    }

    /**更新活动界面 */
    _updatePanel(idx: number) {
        // 关闭当前活动界面
        if (this.curIdx != null) {
            let info = activityPanelInfo[this.curIdx];
            if (info && info.panelId) {
                gdk.panel.hide(info.panelId);
            }
            this.curIdx = null;
        }
        // 打开新的活动界面
        let info = activityPanelInfo[idx];
        let panelId = info ? info.panelId : null;
        if (panelId) {
            panelId.isMask = false;
            panelId.isTouchMaskClose = false;
            gdk.panel.open(panelId, null, null, {
                parent: this.panelParent
            });
        }
        this.curIdx = idx;
        this.node.getChildByName('sub_guanbi').active = true;
    }

    // 预加载界面列表
    get preloads() {
        if (CC_EDITOR) return [];
        let a: gdk.PanelValue[] = [];
        activityPanelInfo.forEach((info, idx) => {
            if (this._pageIsOpen(idx, [0, 2])) {
                a.push(info.panelId);
            }
        });
        if (a.length > 0) {
            gdk.panel.preload(a[0]);
            a.splice(0, 1);
        }
        return a;
    }

    // 打开帮助界面
    openTipFunc() {
        gdk.panel.setArgs(PanelId.HelpTipsPanel, 144);
        gdk.panel.open(PanelId.HelpTipsPanel);
    }
}
