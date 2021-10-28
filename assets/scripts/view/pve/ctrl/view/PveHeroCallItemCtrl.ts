import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PveCalledCtrl from '../fight/PveCalledCtrl';
import StringUtils from '../../../../common/utils/StringUtils';
import { CommonCfg } from '../../../../a/config';

/**
 * Hero战斗详情界面召唤物图标控制器
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-30 11:54:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveHeroCallItemCtrl")
export default class PveHeroCallItemCtrl extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Node)
    bloodNode: cc.Node = null;

    callCtrl: PveCalledCtrl = null;
    refreshTime: number = 0.4;
    allWidth: number = 60

    update(dt: number) {
        if (!this.callCtrl || !this.callCtrl.model) {
            return;
        }
        if (this.refreshTime <= 0) {
            this.bloodNode.width = this.callCtrl.model.hp / this.callCtrl.model.hpMax * this.allWidth
            this.refreshTime = 0.4;
        } else {
            this.refreshTime -= dt;
        }
    }

    setCallCtrl(data: PveCalledCtrl) {
        if (!data) return;
        this.callCtrl = data;
        let path = ''
        if (StringUtils.startsWith(data.model.skin, 'H_')) {
            path = 'icon/hero/' + this.callCtrl.model.config.hero_id;
        } else {
            path = ConfigManager.getItemById(CommonCfg, 'MONSTER_ICON').value + this.callCtrl.model.config.icon;
        }
        GlobalUtil.setSpriteIcon(this.node, this.icon, path)
        this.bloodNode.width = data.model.hp / data.model.hpMax * this.allWidth
    }

    onDisable() {
        GlobalUtil.setSpriteIcon(this.node, this.icon, null)
    }

}
