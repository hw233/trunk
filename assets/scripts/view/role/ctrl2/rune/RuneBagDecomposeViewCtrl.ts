import BagUtils from '../../../../common/utils/BagUtils';
import BagViewCtrl from '../../../bag/ctrl/BagViewCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { RuneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-14 17:30:35 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/RuneBagDecomposeViewCtrl")
export default class RuneBagDecomposeViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.EditBox)
    numEditBox: cc.EditBox = null;

    minNum: number = 1;
    maxNum: number;
    itemId: number;
    selectNum: number;
    heroId: number;
    onEnable() {
        [this.itemId, this.maxNum, this.heroId] = this.args[0];
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this.itemId.toString().slice(0, 6)));
        this.slot.updateItemInfo(cfg.rune_id, this.maxNum);
        this.nameLab.string = cfg.name;
        let colorInfo = BagUtils.getColorInfo(cfg.color);
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);

        this.numEditBox.string = this.maxNum + '';
        this.selectNum = this.maxNum;
    }

    onDisable() {
        this.maxNum = null;
        this.itemId = null;
        this.selectNum = null;
        this.minNum = 1;
        NetManager.targetOff(this);
    }

    onDecomposeBtnClick() {
        let info = new icmsg.RuneInfo();
        info.id = this.itemId;
        info.num = this.selectNum;

        let rewardStr: string = '';
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this.itemId.toString().slice(0, 6)));
        cfg.disint_item.forEach(item => {
            let cfg = BagUtils.getConfigById(item[0]);
            let str = gdk.i18n.t("i18n:ROLE_TIP49");
            rewardStr += `${item[1] * this.selectNum}${str}${cfg.name}、`;
        });
        rewardStr = rewardStr.slice(0, rewardStr.length - 1);
        GlobalUtil.openAskPanel({
            descText: StringUtils.format(gdk.i18n.t("i18n:ROLE_TIP50"), this.selectNum, cfg.name, rewardStr),
            sureCb: () => {
                let req = new icmsg.RuneDisintReq()
                req.heroId = this.heroId ? this.heroId : 0;
                req.runes = [info];
                NetManager.send(req, (resp: icmsg.RuneDisintRsp) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    this.close();
                    let panel = gdk.panel.get(PanelId.Bag);
                    if (panel) {
                        let ctrl = panel.getComponent(BagViewCtrl);
                        let node = ctrl.runeScoreNode;
                        let worldPos = node.parent.convertToWorldSpaceAR(node.getPosition());
                        GlobalUtil.openRewadrView(resp.goodsList, null, {
                            110010: worldPos
                        });
                    }
                    else {
                        GlobalUtil.openRewadrView(resp.goodsList);
                    }
                }, this);
            }
        })
    }

    updateGetNum() {
        let getNum = this.selectNum;
        if (getNum > this.maxNum) {
            getNum = this.maxNum;
            this.selectNum = getNum;
        } else if (getNum < 1) {
            getNum = 1;
            this.selectNum = getNum;
        }
        this.numEditBox.string = getNum.toString();
    }

    //减数量
    onMinusBtn() {
        this.selectNum--;
        this.updateGetNum();
    }

    //加数量
    onPlusBtn() {
        this.selectNum++;
        this.updateGetNum();
    }

    //最大数量
    onMaxBtn() {
        this.selectNum = this.maxNum;
        this.updateGetNum();
    }

    //最小数量
    onMinBtn() {
        this.selectNum = 1;
        this.updateGetNum();
    }

    onEditorDidEnded() {
        this.selectNum = parseInt(this.numEditBox.string) || 1;
        this.updateGetNum();
    }
}
