import { MainInterface_sort_1Cfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import StoreUtils from '../../../../common/utils/StoreUtils';
import RedPointCtrl from '../../../../common/widgets/RedPointCtrl';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import PanelId from '../../../../configs/ids/PanelId';
import SubActivityViewCtrl from '../../../act/ctrl/wonderfulActivity/SubActivityViewCtrl';
import HelpTipsBtnCtrl from '../../../tips/ctrl/HelpTipsBtnCtrl';
import StoreModel from '../../model/StoreModel';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-21 15:10:46 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;


/**systemId - {panelId,redpointCb} */
const viewList: any = [
    { panelId: PanelId.PassPort, sysId: 2806, rpIds: [20011], btnRes: "sd_tbtongxingzheng", sortId: 9, tipsId: 15 }, //通行证
    { panelId: PanelId.FundsView, sysId: 0, rpIds: [20215, 20015, 20044, 20045], btnRes: "sd_jijin", sortId: 10 }, //基金
    { panelId: PanelId.WeeklyPassPort, sysId: 2896, rpIds: [20124], btnRes: "sd_tehuizhouka", sortId: 11, tipsId: 115 }, //特惠周卡
    { panelId: PanelId.MonthCard, sysId: 2836, rpIds: [19000], btnRes: "sd_chaojiyueka", sortId: 12 }, //超值月卡
    { panelId: PanelId.OneDollarGift, sysId: 2807, rpIds: [20012], btnRes: "hd_ckfl", sortId: 13, showHandler: () => { return !StoreUtils.isAllRewardRecivedInOneDollarGiftView() } }, //抽卡福利
    // { panelId: PanelId.RechargeTQ, sysId: 0, rpIds: [], btnRes: "cz_tiquanshangcheng" }, //特权
    // { panelId: PanelId.RechargeLB, sysId: 0, rpIds: [20013], btnRes: "sd_chaozhilibao" }, //礼包
    // { panelId: PanelId.RechargeMF, sysId: 2845, rpIds: [], btnRes: "mfsd_mofangyeqian", sortId: 7 }, //魔方商店
    //原精彩活动 移植过来
    { panelId: PanelId.SubActivityView, sysId: 2821, rpIds: [20193], btnRes: "hd_lchl", sortId: 1 }, //累充豪礼
    { panelId: PanelId.SubActivityView, sysId: 2822, rpIds: [20194], btnRes: "hd_sjyl", sortId: 2 }, //升级有礼
    { panelId: PanelId.SubActivityView, sysId: 2823, rpIds: [20195], btnRes: "hd_djdr", sortId: 3 }, //点金达人
    { panelId: PanelId.SubActivityView, sysId: 2824, rpIds: [20196], btnRes: "hd_szdr", sortId: 4 }, //速战达人
    { panelId: PanelId.SubActivityView, sysId: 2825, rpIds: [20197], btnRes: "hd_jjdr", sortId: 5 }, //竞技达人
    { panelId: PanelId.SubActivityView, sysId: 2826, rpIds: [20198], btnRes: "hd_tbdr", sortId: 6 }, //探宝达人
    { panelId: PanelId.SubActivityView, sysId: 2828, rpIds: [20199], btnRes: "hd_yxjj", sortId: 7 }, //英雄集结
    { panelId: PanelId.WeekendGiftView, sysId: 2875, rpIds: [20105], btnRes: "hd_zmfl", sortId: 8 }, //周末福利
]

@ccclass
@menu("qszc/view/store/tradingPort/TradingPortViewCtrl")
export default class TradingPortViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(HelpTipsBtnCtrl)
    tipsBtn: HelpTipsBtnCtrl = null;

    @property(UiTabMenuCtrl)
    tabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property(cc.Node)
    extendBtn: cc.Node = null;

    curViewList: any[] = [];
    panelIndex: number = 0;    // 当前打开的界面索引
    onEnable() {
        viewList.sort((a, b) => {
            return ConfigManager.getItemById(MainInterface_sort_1Cfg, a.sortId).sorting - ConfigManager.getItemById(MainInterface_sort_1Cfg, b.sortId).sorting
        })
        this._preloadPanel()
        this._initMenu()
        this.tabMenu.node.children.forEach((btn, idx) => {
            if (viewList[idx]) {
                btn.active = JumpUtils.ifSysOpen(viewList[idx].sysId) && (!viewList[idx].showHandler || viewList[idx].showHandler());
            }
        });
        let arg = this.args;
        let idx, sortId;
        if (arg) {
            if (arg instanceof Array) sortId = arg[0];
            else sortId = arg;
        }
        if (sortId && sortId > 0) {
            idx = this._getIdxBySortId(sortId);
        }
        else {
            idx = 0;
        }
        while (!JumpUtils.ifSysOpen(viewList[idx].sysId) || (viewList[idx].showHandler && !viewList[idx].showHandler())) {
            idx += 1;
        }

        this._selectPanel(idx);
        this.scrollView.node.on('scroll-ended', this._onscrollEnd, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
        this.scrollView.node.targetOff(this);
        // this.panelParent.removeAllChildren();
        // 关闭打开或打开中的子界面
        for (let i = 0, n = viewList.length; i < n; i++) {
            let panelId = viewList[i].panelId
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
    }

    // 跳转隐藏参数
    get hideArgs() {
        let r: gdk.PanelHideArg = {
            id: this.resId,
            args: viewList[this.panelIndex].sortId,
        };
        return r;
    }

    _preloadPanel() {
        viewList.forEach(obj => {
            let panelId: gdk.PanelValue = obj.panelId;
            panelId && gdk.panel.preload(panelId);
        });
    }

    _initMenu() {
        this.curViewList = [];
        let l = 0;
        this.tabMenu.itemNames = viewList
        this.tabMenu.node.children.forEach((btn, idx) => {
            let obj = viewList[idx];
            if (obj) {
                let sysId = obj.sysId
                let rpIds = obj.rpIds
                if (JumpUtils.ifSysOpen(sysId) && (!obj.showHandler || obj.showHandler())) {
                    this.curViewList.push(obj);
                    l += 1;
                    let url = `view/act/texture/wonderfulActivitys/${obj.btnRes}`;
                    GlobalUtil.setSpriteIcon(this.node, cc.find('select/icon', btn), url);
                    GlobalUtil.setSpriteIcon(this.node, cc.find('normal/icon', btn), url + '01');
                    // let cb = activityPanelInfo[cfg.systemid]['redPointCb'];
                    // let args = activityPanelInfo[cfg.systemid]['args'];
                    // btn.getChildByName('RedPoint').active = cb ? args ? cb(args) : cb() : false;
                    let rpCtrl = btn.getComponent(RedPointCtrl)
                    rpCtrl.orIds = []
                    rpCtrl.enabled = false
                    if (rpIds.length > 0) {
                        rpCtrl.enabled = true
                        rpCtrl.orIds = rpIds
                    }
                } else {
                    btn.active = false
                }
            } else {
                btn && btn.removeFromParent();
            }
        });
        // this.scrollView.scrollToRight();
        this.scrollView.horizontal = l > 5;
        gdk.Timer.callLater(this, () => {
            this._onscrollEnd();
        })
    }

    _onscrollEnd() {
        let leftWidth = this.tabMenu.node.width - Math.abs(this.scrollView.getContentPosition().x) - this.scrollView.node.width;
        let btnWidth = 90 + 5;
        let leftBtnNum = Math.floor(leftWidth / btnWidth);
        this.extendBtn.active = leftBtnNum > 0;
        if (this.extendBtn.active) {
            this.extendBtn.getChildByName('label').getComponent(cc.Label).string = leftBtnNum + '';
            let redPoint = this.extendBtn.getChildByName('RedPoint');
            redPoint.active = false;
            let idx = this.curViewList.length - leftBtnNum;
            let list = this.curViewList.slice(idx);
            for (let i = 0; i < list.length; i++) {
                let rpIds = list[i].rpIds;
                if (rpIds && rpIds.length > 0) {
                    let b = RedPointUtils.eval_expr([], rpIds);
                    if (b) {
                        redPoint.active = true;
                        return;
                    }
                }
            }
        }
    }

    onExtendBtnClick() {
        this.scrollView.scrollToLeft();
        this.extendBtn.active = false;
    }

    selectPanel(sortId: number) {
        let idx = this._getIdxBySortId(sortId);
        if (!JumpUtils.ifSysOpen(viewList[idx].sysId) || (viewList[idx].showHandler && !viewList[idx].showHandler())) {
            idx = 0;
        }
        while (!JumpUtils.ifSysOpen(viewList[idx].sysId) || (viewList[idx].showHandler && !viewList[idx].showHandler())) {
            idx += 1;
        }
        this._selectPanel(idx);
    }

    _selectPanel(idx: number) {
        if (idx > this.tabMenu.itemNames.length - 1) idx = 0;
        idx = Math.max(0, idx);
        this.tabMenu.setSelectIdx(idx, true);
    }

    onTabMenuSelect(e, data) {
        if (!e) return;
        if (viewList[data].panelId == PanelId.FundsView) {
            ModelManager.get(StoreModel).isShowGrowFundsTips = false;
            ModelManager.get(StoreModel).isShowTowerFundsTips = false;
        }
        this.tipsBtn.node.active = viewList[data].tipsId;
        if (this.tipsBtn.node.active) {
            this.tipsBtn.tipsId = viewList[data].tipsId;
        }
        let panelId = viewList[this.panelIndex].panelId//gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
        if (panelId && panelId.__id__ !== viewList[data].panelId.__id__) gdk.panel.hide(panelId);
        this.panelIndex = data;
        if (this.panelIndex >= 5) this.scrollView.scrollToLeft();
        if (this.panelIndex == 0) this.scrollView.scrollToRight();
        //兼容精彩活动
        let node = gdk.panel.get(PanelId.SubActivityView);
        if (viewList[this.panelIndex].panelId.__id__ == PanelId.SubActivityView.__id__ && node) {
            let ctrl = node.getComponent(SubActivityViewCtrl);
            ctrl.selectView(ConfigManager.getItemByField(MainInterface_sort_1Cfg, 'systemid', viewList[this.panelIndex].sysId));
            return;
        }

        let arg = viewList[this.panelIndex].panelId.__id__ == PanelId.SubActivityView.__id__ ? ConfigManager.getItemByField(MainInterface_sort_1Cfg, 'systemid', viewList[this.panelIndex].sysId) : null;
        gdk.panel.open(viewList[this.panelIndex].panelId, null, null, {
            parent: this.panelParent,
            args: arg
        });
    }

    _getIdxBySortId(id: number) {
        for (let i = 0; i < viewList.length; i++) {
            if (viewList[i].sortId == id) {
                return i;
            }
        }
    }
}
