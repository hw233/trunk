import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import { MonsterCfg } from './../../../../a/config';
import { WaveEnemyInfo } from '../../model/PveSceneModel';

/** 
 * Pve怪物头像小图标
 * @Author: sthoo.huang  
 * @Date: 2020-10-20 13:46:59
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-10-27 16:22:59
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/base/PveMonsterIconCtrl")
export default class PveMonsterIconCtrl extends gdk.ItemRenderer {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    updateView() {
        let data = this.data as WaveEnemyInfo;
        let config = ConfigManager.getItemById(MonsterCfg, data.enemyId);
        let url = 'icon/monster/' + config.icon + '_s';
        GlobalUtil.setSpriteIcon(this.node, this.icon, url);
        if (this.data['isNew']) {
            this.spine.setCompleteListener(() => {
                this.spine.clearTracks();
                this.spine.setCompleteListener(null);
                this.spine.node.active = false;
                this.data['isNew'] = false;
            })
            this.spine.node.active = true;
            this.spine.setAnimation(0, 'stand2', true);
        }
        else {
            this.spine.node.active = false;
        }
    }

    onDisable() {
        this.data['isNew'] = false;
        this.spine.clearTracks();
        this.spine.setCompleteListener(null);
        this.spine.node.active = false;
        GlobalUtil.setSpriteIcon(this.node, this.icon, null);
        super.onDisable && super.onDisable();
    }
}