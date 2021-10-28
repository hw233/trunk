import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import HeroModel from '../../../common/models/HeroModel';
import RoyalModel from '../../../common/models/RoyalModel';
import PanelId from '../../../configs/ids/PanelId';
import PveSceneCtrl from './PveSceneCtrl';

/**
 * Pvp防守阵营位置设置界面
 * @Author: yaozu.hu
 * @Date: 2020-04-16 20:46:22
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-10 11:41:28
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PvpDefenderCtrl")
export default class PvpDefenderCtrl extends PveSceneCtrl {


    onEnable() {
        //this.model.isDefender = true;
        super.onEnable();
    }


    changeMapBtnClick() {
        //gdk.gui.showMessage(gdk.i18n.t("i18n:PVPDEFENDER_TIP1"))
        gdk.panel.open(PanelId.PveDefenderMapSelect);
    }

    saveBtnClick() {
        let n = this.model.towers.length;
        // 初始数据
        let a = [];
        let heroModel = ModelManager.get(HeroModel)
        // 上阵数据
        if (this.model.arenaSyncData.fightType == 'ROYAL') {
            let rModel = ModelManager.get(RoyalModel)
            a = heroModel.curUpHeroList(heroModel.curDefendType);
            let index = rModel.scenneIndex;
            for (let i = 0; i < n; i++) {
                let t = this.model.towers[i];
                if (t.hero) {
                    let e = <icmsg.HeroInfo>t.hero.model.item.extInfo;
                    if (e && e.heroId > 0) {
                        a[index * 3 + (t.id - 1)] = e.heroId;
                    }
                }
            }

        } else {
            for (let i = 0; i < n; i++) {
                a[i] = 0;
            }
            for (let i = 0; i < n; i++) {
                let t = this.model.towers[i];
                if (t.hero) {
                    let e = <icmsg.HeroInfo>t.hero.model.item.extInfo;
                    if (e && e.heroId > 0) {
                        a[t.id - 1] = e.heroId;
                    }
                }
            }
        }

        let msg = new icmsg.BattleArraySetReq();

        msg.type = heroModel.curDefendType + 1;
        msg.heroIds = a;
        NetManager.send(msg, (rsp: icmsg.BattleArraySetRsp) => {
            if (!cc.isValid(this.node)) return;
            let heroModel = ModelManager.get(HeroModel)
            heroModel.refreshCurHeroList(heroModel.curDefendType, rsp.heroIds);
            gdk.gui.showMessage(gdk.i18n.t("i18n:PVPDEFENDER_TIP2"))
            this.close();
        }, this);
    }

}
