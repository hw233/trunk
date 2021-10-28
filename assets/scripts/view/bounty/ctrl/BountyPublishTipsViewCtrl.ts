import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import { Hero_careerCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-21 10:06:49 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bounty/BountyPublishViewCtrl")
export default class BountyPublishTipsViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    conditions: cc.Node = null;

    minPower: number;
    cb: Function;
    onEnable() {
        let data = this.args;
        [this.minPower, this.cb] = data[0];
        this.conditions.getChildByName('c1').getChildByName('label').getComponent(cc.Label).string = `战力≥${this.minPower}`;
        this._updateState();
    }

    onDisable() {
        this.minPower = null;
        this.cb = null;
    }

    onConfirmBtnClick() {
        this.cb && this.cb();
        this.close();
    }

    onCancelBtnClick() {
        this.close();
    }

    _updateState() {
        let urls = ['common/texture/sub_yes', 'view/friend/texture/friend/zd_cha001'];
        let upList = ModelManager.get(HeroModel).curUpHeroList(0);
        let careerTypes = [1, 3, 4];
        upList.forEach(id => {
            let info = HeroUtils.getHeroInfoByHeroId(id);
            if (info) {
                let type = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', info.careerId).career_type;
                let idx = careerTypes.indexOf(type);
                if (idx != -1) {
                    careerTypes.splice(idx, 1);
                }
            }
        });
        this.conditions.children.forEach((c, idx) => {
            let flag = c.getChildByName('flag');
            if (idx == 0) {
                let b = ModelManager.get(RoleModel).power >= this.minPower;
                GlobalUtil.setSpriteIcon(this.node, flag, urls[b ? 0 : 1]);
                c.getChildByName('label').color = cc.color().fromHEX(b ? '#00FF00' : '#FF0000');
            }
            else {
                let careers = [1, 3, 4];
                let progressLab = c.getChildByName('progress').getComponent(cc.Label);
                let b = careerTypes.indexOf(careers[idx - 1]) == -1;
                GlobalUtil.setSpriteIcon(this.node, flag, urls[b ? 0 : 1]);
                progressLab.string = `(${b ? 1 : 0}/1)`;
                progressLab.node.color = cc.color().fromHEX(b ? '#00FF00' : '#FF0000');
            }
        });
    }
}
