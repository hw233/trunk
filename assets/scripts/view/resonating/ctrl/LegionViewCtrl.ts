import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import ResonatingModel from '../model/ResonatingModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Hero_legionCfg } from '../../../a/config';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-07 11:48:10 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/resonating/LegionViewCtrl")
export default class LegionViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    lvLab: cc.Label = null;

    @property([cc.Node])
    heros: cc.Node[] = [];

    @property(cc.Node)
    attrNode: cc.Node = null;

    @property(cc.Node)
    upgradeBtn: cc.Node = null;

    @property(cc.Node)
    maxLvTips: cc.Node = null;

    @property(cc.Node)
    limitTips: cc.Node = null;

    @property(sp.Skeleton)
    bgSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    btnSpine: sp.Skeleton = null;

    get model(): ResonatingModel { return ModelManager.get(ResonatingModel); }

    onEnable() {
        if (!this.model.assistViewOpened) {
            this.model.assistViewOpened = true;
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        }
        this.bgSpine.setCompleteListener(null);
        this.bgSpine.setAnimation(0, 'stand2', true);
        this.btnSpine.node.active = false;
        this._updateHeros();
        this._updateView();
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCost, this);
    }

    onDisable() {
        this.bgSpine.setCompleteListener(null);
        this.btnSpine.setCompleteListener(null);
        NetManager.targetOff(this);
    }

    onUpgradeBtnClick() {
        let nextCfg = ConfigManager.getItemById(Hero_legionCfg, this.model.legionLv + 1);
        if (GlobalUtil.checkMoneyEnough(nextCfg.legion_consumption[1], nextCfg.legion_consumption[0])) {
            let req = new icmsg.AssistAllianceLegionReq();
            NetManager.send(req, () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this.bgSpine.setCompleteListener(() => {
                    this.bgSpine.setCompleteListener(null);
                    this.bgSpine.setAnimation(0, 'stand2', true);
                });
                this.bgSpine.setAnimation(0, 'stand3', true);

                this.btnSpine.setCompleteListener(() => {
                    gdk.gui.showMessage(gdk.i18n.t('i18n:SUPPORT_TIPS1'));
                    this._updateView();
                    this.btnSpine.setCompleteListener(null);
                    this.btnSpine.node.active = false;
                })
                this.btnSpine.node.active = true;
                this.btnSpine.setAnimation(0, 'stand', true)
            }, this);
        }
    }

    _updateHeros() {
        let heroIds = ModelManager.get(HeroModel).curUpHeroList(0);
        this.heros.forEach((n, idx) => {
            let heroId = heroIds[idx];
            let info = HeroUtils.getHeroInfoByHeroId(heroId);
            let blank = cc.find('blank', n);
            let spine = cc.find('spine', n).getComponent(sp.Skeleton);
            spine.node.active = info && info.star >= 11;
            blank.active = !spine.node.active;
            if (spine.node.active) {
                // let cfg = <HeroCfg>BagUtils.getConfigById(info.typeId);
                let url = StringUtils.format("spine/hero/{0}/1/{0}", HeroUtils.getHeroSkin(info.typeId, info.star));
                GlobalUtil.setSpineData(this.node, spine, url, false, 'stand', true);
            }
        });
    }

    // @gdk.binding("model.legionLv")
    _updateView() {
        this.lvLab.string = `/${this.model.legionLv}`;
        let cfg = ConfigManager.getItemById(Hero_legionCfg, this.model.legionLv);
        if (!cfg) {
            this.attrNode.active = false;
        }
        else {
            this.attrNode.active = true;
            cc.find('layout/value', this.attrNode).getComponent(cc.Label).string = `+${Math.floor(cfg.legion_r / 100)}%`;
        }
        this._updateCost();
    }

    _updateCost() {
        let isOpen = false;
        let heroIds = ModelManager.get(HeroModel).curUpHeroList(0);
        for (let i = 0; i < heroIds.length; i++) {
            let info = HeroUtils.getHeroInfoByHeroId(heroIds[i]);
            if (info && info.star >= 11) {
                isOpen = true;
                break;
            }
        }
        if (!isOpen) {
            this.maxLvTips.active = false;
            this.upgradeBtn.active = false;
            this.limitTips.active = true;
        }
        else {
            this.limitTips.active = false;
            let nextCfg = ConfigManager.getItemById(Hero_legionCfg, this.model.legionLv + 1);
            if (!nextCfg) {
                this.maxLvTips.active = true;
                this.upgradeBtn.active = false;
            }
            else {
                this.maxLvTips.active = false;
                this.upgradeBtn.active = true;
                GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.upgradeBtn), GlobalUtil.getIconById(nextCfg.legion_consumption[0]));
                let num = cc.find('layout/num', this.upgradeBtn).getComponent(cc.Label);
                num.string = nextCfg.legion_consumption[1] + gdk.i18n.t('i18n:HERO_TIP39');
                let b = BagUtils.getItemNumById(nextCfg.legion_consumption[0]) >= nextCfg.legion_consumption[1];
                num.node.color = cc.color().fromHEX(b ? '#FEFFCB' : '#FF0000');
                this.upgradeBtn.getChildByName('RedPoint').active = b;
            }
        }
    }
}
