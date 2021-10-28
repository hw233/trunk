import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Global_powerCfg, Hero_careerCfg, RuneCfg } from '../../../../a/config';
import { RoleEventId } from '../../enum/RoleEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-09 14:08:40 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneSelectItemCtrl")
export default class RuneSelectItemCtrl extends UiListItem {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    runeName: cc.Label = null;

    @property(cc.Label)
    power: cc.Label = null;

    @property(cc.RichText)
    desc: cc.RichText = null;

    @property(cc.Node)
    useBtn: cc.Node = null;

    @property(cc.Node)
    unLoadBtn: cc.Node = null;

    @property(cc.Node)
    recommend: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Label)
    lv: cc.Label = null;

    runeItem: BagItem;
    runeInfo: icmsg.RuneInfo;
    curPos: number;
    updateView() {
        this._update(this.data);
    }

    _update(data) {
        this.curPos = data.pos;
        this.runeItem = data.item;
        this.runeInfo = <icmsg.RuneInfo>this.runeItem.extInfo;
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this.runeInfo.id.toString().slice(0, 6)));
        this.slot.updateItemInfo(cfg.rune_id, this.runeInfo.num);
        this.lv.string = '.' + cfg.level;
        this.runeName.string = cfg.name;
        let colorInfo = BagUtils.getColorInfo(cfg.color);
        this.runeName.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.runeName.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
        let attStr = ['atk', 'hp', 'def', 'hit', 'dodge'];
        let extraPower = 0;
        attStr.forEach(str => {
            let ratio = ConfigManager.getItemByField(Global_powerCfg, 'key', str).value;
            extraPower += Math.floor(ratio * cfg[`hero_${str}`]);
        });
        this.power.string = `${gdk.i18n.t('i18n:RUNE_TIP17')}:${cfg.power + extraPower}`;
        let skillCfg = GlobalUtil.getSkillLvCfg(cfg.skill, cfg.skill_level);
        this.desc.string = skillCfg.des;
        this.useBtn.active = !data.isCurUse;
        this.unLoadBtn.active = data.isCurUse;

        let heroInfo = ModelManager.get(HeroModel).curHeroInfo;
        let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', heroInfo.careerId).career_type;
        let curRuneCfg;
        if (heroInfo.runes[this.curPos]) {
            curRuneCfg = ConfigManager.getItemById(RuneCfg, parseInt(heroInfo.runes[this.curPos].toString().slice(0, 6)));
        }
        this.recommend.active = cfg.recommended.indexOf(careerType) !== -1 && (!curRuneCfg || cfg.color >= curRuneCfg.color);

        this._updateRedPoint();
    }

    onUnloadBtnClick() {
        let heroInfo = ModelManager.get(HeroModel).curHeroInfo;
        let req = new icmsg.RuneOnReq();
        req.heroId = heroInfo.heroId;
        req.index = this.curPos;
        req.runeId = 0;
        NetManager.send(req, (resp: icmsg.RuneOnRsp) => {
            if (cc.isValid(this.node)) {
                if (gdk.panel.isOpenOrOpening(PanelId.RuneSelect)) {
                    gdk.panel.hide(PanelId.RuneSelect);
                }
            }
            heroInfo.runes = resp.runes;
            gdk.e.emit(RoleEventId.RUNE_OFF, heroInfo.heroId);
        });
    }

    onUseBtnClick() {
        let curHeroInfo = ModelManager.get(HeroModel).curHeroInfo;
        let antherCfg = curHeroInfo.runes[this.curPos == 0 ? 1 : 0] ? ConfigManager.getItemById(RuneCfg, parseInt(curHeroInfo.runes[this.curPos == 0 ? 1 : 0].toString().slice(0, 6))) : null;
        let curCfg = curHeroInfo.runes[this.curPos] ? ConfigManager.getItemById(RuneCfg, parseInt(curHeroInfo.runes[this.curPos].toString().slice(0, 6))) : null;
        let newCfg = ConfigManager.getItemById(RuneCfg, parseInt(this.runeInfo.id.toString().slice(0, 6)));
        let curType = [];
        let antherType = [];
        if (curCfg) {
            curType.push(curCfg.type);
            if (curCfg.mix_type) curType.push(curCfg.mix_type);
        }
        if (antherCfg) {
            antherType.push(antherCfg.type);
            if (antherCfg.mix_type) antherType.push(antherCfg.mix_type);
        }
        if (!curCfg || curType.indexOf(newCfg.type) == -1 || (newCfg.mix_type && curType.indexOf(newCfg.mix_type) == -1)) {
            if (antherType.indexOf(newCfg.type) !== -1 || (newCfg.mix_type && antherType.indexOf(newCfg.mix_type) !== -1)) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP18'));
                return;
            }
        }
        let req = new icmsg.RuneOnReq();
        req.heroId = curHeroInfo.heroId;
        req.index = this.curPos;
        req.runeId = this.runeInfo.id;
        NetManager.send(req, (resp: icmsg.RuneOnRsp) => {
            if (cc.isValid(this.node)) {
                if (gdk.panel.isOpenOrOpening(PanelId.RuneSelect)) {
                    gdk.panel.hide(PanelId.RuneSelect);
                }
            }
            HeroUtils.getHeroInfoByHeroId(curHeroInfo.heroId).runes = resp.runes;
            gdk.e.emit(RoleEventId.RUNE_ON, curHeroInfo.heroId);
        });
    }

    _updateRedPoint() {
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this.runeInfo.id.toString().slice(0, 6)));
        let curHeroInfo = ModelManager.get(HeroModel).curHeroInfo;
        let oldId = curHeroInfo.runes[this.curPos];
        let oldCfg = oldId ? ConfigManager.getItemById(RuneCfg, parseInt(oldId.toString().slice(0, 6))) : null;
        let oldType = [];
        if (oldCfg) {
            oldType.push(oldCfg.type);
            if (oldCfg.mix_type) oldType.push(oldCfg.mix_type);
        }
        if (oldCfg
            && (oldCfg.type == cfg.type && (oldCfg.mix_type == cfg.mix_type))
            && (cfg.color > oldCfg.color || cfg.level > oldCfg.level)) {
            this.redPoint.active = true;
        }
        else {
            this.redPoint.active = false;
        }
    }
}
