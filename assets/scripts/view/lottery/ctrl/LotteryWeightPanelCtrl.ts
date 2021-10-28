import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import StringUtils from '../../../common/utils/StringUtils';
import { Hero_starCfg, LuckydrawCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-18 17:10:10 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/ctrl/LotteryWeightPanelCtrl')
export default class LotteryWeightPanelCtrl extends gdk.BasePanel {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.RichText)
    limitDecLabel: cc.RichText = null;

    @property([cc.Node])
    qualityNodes: cc.Node[] = [];

    cfg: LuckydrawCfg = null;
    onEnable() {
        this.cfg = this.args[0][0];
        this.updateView();
    }

    onDisable() {
        this.cfg = null;
    }

    updateView() {
        if (!this.cfg) {
            this.close();
            return;
        };
        this.nameLabel.string = this.cfg.name;
        let weights = this.cfg.des3;
        let colorStr = [
            StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP36"), 5),
            StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP36"), 4),
            StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP36"), 3),
            StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP36"), 2),
            StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP36"), 1),
        ];
        weights.forEach((weight, idx) => {
            if (weight <= 0) {
                this.qualityNodes[idx].active = false;
            }
            else {
                this.qualityNodes[idx].active = true;
                let starCfg = ConfigManager.getItemById(Hero_starCfg, 5 - idx);
                let color: number = starCfg ? starCfg.color : 1;
                let url = `view/lottery/texture/common/ck_quality${5 - color}`
                GlobalUtil.setSpriteIcon(this.node, this.qualityNodes[idx].getChildByName('qualityIcon').getComponent(cc.Sprite), url);
                this.qualityNodes[idx].getChildByName('nameLabel').getComponent(cc.Label).string = colorStr[idx % 5] + (idx < 5 ? `${gdk.i18n.t("i18n:LOTTERY_TIP37")}` : `${gdk.i18n.t("i18n:LOTTERY_TIP38")}`);
                this.qualityNodes[idx].getChildByName('weightLabel').getComponent(cc.Label).string = weight + '%';
            }

            if (this.cfg.des4 && this.cfg.des4.length >= 5) {
                this.limitDecLabel.node.active = true;
                this.limitDecLabel.node.parent.getChildByName('yx_tcbg05').active = true;
                this.limitDecLabel.string = this.cfg.des4;
            }
            else {
                this.limitDecLabel.node.active = false;
                this.limitDecLabel.node.parent.getChildByName('yx_tcbg05').active = false;
            }
        });
    }
}
