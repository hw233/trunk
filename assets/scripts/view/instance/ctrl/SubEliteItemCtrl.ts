import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import SubEliteGroupViewCtrl from './SubEliteGroupViewCtrl';
import UiListItem from '../../../common/widgets/UiListItem';
import { Copy_stageCfg, Copycup_prizeCfg } from '../../../a/config';
import { InstanceID } from '../enum/InstanceEnumDef';
import { ParseMainLineId } from '../utils/InstanceUtil';

/** 
 * @Description: 英雄图鉴子项
 * @Author: weiliang.huang  
 * @Date: 2019-05-28 11:32:24 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-09-21 14:02:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubEliteItemCtrl")
export default class SubEliteItemCtrl extends UiListItem {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    prizeLab: cc.Label = null;

    @property(cc.Node)
    proBarNode: cc.Node = null;

    @property(cc.Node)
    proBar: cc.Node = null;

    // @property(cc.Node)
    // boxOpen: cc.Node = null;

    @property(cc.Node)
    boxClose: cc.Node = null;

    // @property(cc.Node)
    // bgMask: cc.Node = null;

    @property(cc.Node)
    down: cc.Node = null;

    @property(cc.Label)
    proLab: cc.Label = null;

    @property(cc.Node)
    redPoint: cc.Node = null;
    // @property(cc.Node)
    // rewardBox: cc.Node = null;

    // @property(sp.Skeleton)
    // spine: sp.Skeleton = null;

    _prize: number

    typeId: number
    get copyModel() { return ModelManager.get(CopyModel); }

    updateView() {
        this._prize = this.data.prize
        this.typeId = this.data.curIndex;
        let iconPath = `view/instance/texture/elite_icon/jb_guankajianzu${this._prize}`
        GlobalUtil.setSpriteIcon(this.node, this.icon, iconPath)
        this.prizeLab.string = `${this._prize}`

        if (this._prize == 1) {
            GuideUtil.bindGuideNode(7003, this.node)
        }
        let nums = CopyUtil.getEliteStageCurChaterData(this._prize, this.typeId)
        this.proLab.string = `${nums[0]}/${nums[1]}`
        this.proBar.width = (nums[0] / nums[1]) * this.proBarNode.width
        this.redPoint.active = false;
        if (CopyUtil.isOpenEliteStageChapter(this._prize, this.typeId)) {
            GlobalUtil.setAllNodeGray(this.bg, 0)
            GlobalUtil.setAllNodeGray(this.down, 0)
            this.down.active = true;
            this.refreshRedPoint();
        } else {
            GlobalUtil.setAllNodeGray(this.bg, 1)
            this.down.active = false
        }

        //this._updateState()
    }

    refreshRedPoint() {
        let nums = CopyUtil.getEliteStageCurChaterData(this._prize, 0)
        let cfgs = ConfigManager.getItems(Copycup_prizeCfg, { 'copy_id': 12, 'chapter': this._prize })
        let bit: number[] = this.copyModel.eliteNoviceBits
        let res = false;
        for (let j = 0; j < cfgs.length; j++) {
            let cfg = cfgs[j];
            let lock = (j + 1) * 3 > nums[0];
            let over = false;
            let old = bit[Math.floor((cfg.id - 1) / 8)];
            if ((old & 1 << (cfg.id - 1) % 8) >= 1) over = true;
            if (!lock && !over) {
                res = true;
                break;
            }
        }
        if (this.redPoint) {
            this.redPoint.active = res;
        }

    }

    _itemClick() {
        if (CopyUtil.isOpenEliteStageChapter(this._prize, this.typeId)) {
            gdk.panel.setArgs(PanelId.SubEliteGroupView, this._prize, this.typeId)
            gdk.panel.open(PanelId.SubEliteGroupView, (node) => {
                let ctrl = node.getComponent(SubEliteGroupViewCtrl);
                ctrl.node.onHide.on(() => {
                    this.refreshRedPoint();
                }, this);
            })
        } else {
            let type = this.typeId == 0 ? InstanceID.CUP_ROOKIE_INST : InstanceID.CUP_CHALLENGE_INST;
            let cfg = ConfigManager.getItemByField(Copy_stageCfg, "copy_id", type, { prize: this._prize })
            let desc = gdk.i18n.t("i18n:PVE_ELITE_OPEN_TIP1");
            let mainPass = CopyUtil.isStagePassed(cfg.main_condition)
            let stageStr = '';
            if (!mainPass) {
                stageStr = ParseMainLineId(cfg.main_condition, 1) + "-" + ParseMainLineId(cfg.main_condition, 2)
            } else {
                stageStr = ParseMainLineId(cfg.pre_condition, 1) + "-" + ParseMainLineId(cfg.pre_condition, 2)
                desc = this.typeId == 0 ? gdk.i18n.t("i18n:PVE_ELITE_OPEN_TIP2") : gdk.i18n.t("i18n:PVE_ELITE_OPEN_TIP3");;
            }

            let text = StringUtils.replace(desc, "@number", stageStr);
            gdk.gui.showMessage(text);
        }

    }

}