import ButtonSoundId from '../../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { GroupCfg, HeroCfg } from '../../../../a/config';

/** 
  * @Description: 矿洞大作战探索英雄Item
  * @Author: yaozu.hu 
  * @Date: 2019-05-23 18:03:11 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-08-06 10:21:13
*/


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineTansuoHeroItemCtrl")
export default class MineTansuoHeroItemCtrl extends UiListItem {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Sprite)
    qualityBg: cc.Sprite = null;

    @property(cc.Sprite)
    group: cc.Sprite = null;

    @property(cc.Node)
    upFlag: cc.Node = null;

    isUp: boolean = false;
    onEnable() {
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_HERO_SELECTED, this._onHeroSelected, this); // 英雄上阵
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_HERO_UN_SELECTED, this._onHeroUnSelected, this); // 英雄下阵
    }

    onDisable() {
        this.isUp = false;
        GlobalUtil.setAllNodeGray(this.node.getChildByName('frame'), 0);
        this.upFlag.active = false;
        gdk.e.targetOff(this);
    }

    updateView() {
        let data = this.data;
        let heroInfo = data.info;
        let group = data.group;
        let cfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId)
        GlobalUtil.setSpriteIcon(this.node, this.icon, cfg.iconPath + '_s');
        GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `common/texture/sub_itembg0${heroInfo.color}`);
        let path = 'view/role/texture/up/' + ConfigManager.getItemById(GroupCfg, group).icon + '_icon';
        GlobalUtil.setSpriteIcon(this.node, this.group, path);
        if (!this.list['tempUpHeroList']) {
            this.isUp = false;
        }
        else {
            this.isUp = this.list['tempUpHeroList'].indexOf(this.data.info.typeId) != -1;
        }
        GlobalUtil.setAllNodeGray(this.node.getChildByName('frame'), this.isUp ? 1 : 0);
        this.upFlag.active = this.isUp;
    }

    _itemClick() {
        gdk.e.emit(ActivityEventId.ACTIVITY_MINE_HERO_CHOOSE_PANEL_CLICK, [this.data]);
        gdk.sound.isOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.click)
    }

    _onHeroSelected(e) {
        let id = e.data[0];
        if (id == this.data.info.typeId) {
            this.isUp = true;
            GlobalUtil.setAllNodeGray(this.node.getChildByName('frame'), this.isUp ? 1 : 0);
            this.upFlag.active = this.isUp;
        }
    }

    _onHeroUnSelected(e) {
        let id = e.data[0];
        if (id == this.data.info.typeId) {
            this.isUp = false;
            GlobalUtil.setAllNodeGray(this.node.getChildByName('frame'), this.isUp ? 1 : 0);
            this.upFlag.active = this.isUp;
        }
    }
}
