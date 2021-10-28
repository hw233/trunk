import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PveHeroCtrl from '../fight/PveHeroCtrl';
import PveSceneCtrl from '../PveSceneCtrl';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BagType } from '../../../../common/models/BagModel';
import { CopyType } from '../../../../common/models/CopyModel';
import { damageShowData } from './DamageStatisticeCtrl';
import { HeroCfg, Newordeal_ordealCfg, OrdealCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/DamageStatisticeItemCtrl")
export default class DamageStatisticeItemCtrl extends UiListItem {

    @property(cc.Node)
    heroDamageNode: cc.Node = null;
    @property(cc.Node)
    soldierDamageNode: cc.Node = null;
    @property(cc.Node)
    timeNode: cc.Node = null;
    @property(cc.Node)
    recoverNode: cc.Node = null;
    @property(cc.Label)
    heroDamage: cc.Label = null;
    @property(cc.Label)
    soldierDamage: cc.Label = null;
    @property(cc.Label)
    time: cc.Label = null;
    @property(cc.Label)
    recover: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Sprite)
    iconBg: cc.Sprite = null;

    @property(cc.Node)
    upTips: cc.Node = null;

    widthNum: number = 100;
    //info: damageShowData;
    updateView() {
        let info: damageShowData = this.data;
        this.upTips.active = false;
        if (info.type == "PVE") {
            let p = gdk.gui.getCurrentView();
            let c = p.getComponent(PveSceneCtrl);
            let sceneMode = c.model//gdk.gui.getCurrentView()//ModelManager.get(PveSceneModel);
            if (info.isMirror) {
                sceneMode = c.model.arenaSyncData.mirrorModel
            }
            let heroCfg = ConfigManager.getItemById(HeroCfg, info.baseId)
            if (heroCfg) {
                GlobalUtil.setSpriteIcon(
                    this.node,
                    this.icon,
                    GlobalUtil.getIconById(info.baseId, BagType.HERO),
                )
                //设置背景
                let tem = sceneMode.getFightBy(info.fightId) as PveHeroCtrl
                let color = (tem.model.item.extInfo as icmsg.HeroInfo).color
                let path = `common/texture/sub_itembg0${color}`
                if (path) {
                    GlobalUtil.setSpriteIcon(
                        this.node,
                        this.iconBg,
                        path
                    )
                }
                if (sceneMode.stageConfig.copy_id == CopyType.HeroTrial || sceneMode.stageConfig.copy_id == CopyType.NewHeroTrial) {
                    let ordealCfg = ConfigManager.getItemByField(OrdealCfg, 'round', sceneMode.stageConfig.id)
                    if (sceneMode.stageConfig.copy_id == CopyType.NewHeroTrial) {
                        ordealCfg = ConfigManager.getItemByField(Newordeal_ordealCfg, 'round', sceneMode.stageConfig.id)
                    }
                    let have = false;
                    let strs = ordealCfg.theme_hero.split('|');
                    for (let i = 0; i < strs.length; i++) {
                        if (Number(strs[i].split(';')[0]) == heroCfg.id) {
                            have = true;
                            break;
                        }
                    }
                    this.upTips.active = have;
                }
            }
        }

        this.heroDamage.string = Math.floor(info.heroDamage) + '';
        this.heroDamageNode.width = Math.floor(info.heroDamage / info.allHeroDamage * this.widthNum)
        this.soldierDamage.string = Math.floor(info.soldierDamage) + '';
        this.soldierDamageNode.width = Math.floor(info.soldierDamage / info.allSoldierDamage * this.widthNum)
        this.time.string = Math.floor(info.time) + '';
        this.timeNode.width = Math.floor(info.time / info.allTime * this.widthNum)
        this.recover.string = Math.floor(info.recover) + '';
        this.recoverNode.width = Math.floor(info.recover / info.allRecover * this.widthNum)
    }
}
