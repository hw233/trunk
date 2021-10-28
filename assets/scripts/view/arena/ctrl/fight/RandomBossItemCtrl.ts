import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import { MonsterCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-27 09:59:52 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/fight/RandomBossItemCtrl")
export default class RandomBossItemCtrl extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    updateView(id: number) {
        let config = ConfigManager.getItemById(MonsterCfg, id);
        let url = 'icon/monster/' + config.icon + '_s';
        GlobalUtil.setSpriteIcon(this.node, this.icon, url);
    }

    onDisable() {
        GlobalUtil.setSpriteIcon(this.node, this.icon, null);
        super.onDisable && super.onDisable();
    }
}
