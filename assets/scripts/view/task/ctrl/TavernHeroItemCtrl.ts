import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import { GroupCfg, HeroCfg } from '../../../a/config';
import { TaskEventId } from '../enum/TaskEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-05 14:49:36 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/TavernHeroItemCtrl")
export default class TavernHeroItemCtrl extends UiListItem {
  @property(cc.Sprite)
  icon: cc.Sprite = null;

  @property(cc.Sprite)
  qualityBg: cc.Sprite = null;

  @property(cc.Sprite)
  group: cc.Sprite = null;

  @property(cc.Node)
  upFlag: cc.Node = null;

  @property(cc.Label)
  star: cc.Label = null;
  @property(cc.Node)
  maxStarNode: cc.Node = null;
  @property(cc.Label)
  maxStarLb: cc.Label = null;

  isUp: boolean = false;
  onEnable() {
    gdk.e.on(TaskEventId.TAVERN_HERO_SELECTED, this._onHeroSelected, this); // 英雄上阵
    gdk.e.on(TaskEventId.TAVERN_HERO_UN_SELECTED, this._onHeroUnSelected, this); // 英雄下阵
  }

  onDisable() {
    this.isUp = false;
    GlobalUtil.setAllNodeGray(this.node.getChildByName('frame'), 0);
    this.upFlag.active = false;
    gdk.e.targetOff(this);
  }

  updateView() {
    let data = this.data;
    let heroInfo: icmsg.HeroInfo = data.info;
    let group = data.group;
    let cfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId)
    GlobalUtil.setSpriteIcon(this.node, this.icon, cfg.iconPath + '_s');
    GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `common/texture/sub_itembg0${heroInfo.color}`);

    if (heroInfo.star >= 12 && this.maxStarNode) {
      this.star.node.active = false;
      this.maxStarNode.active = true;
      this.maxStarLb.string = (heroInfo.star - 11) + ''
    } else {
      this.star.node.active = true;
      this.maxStarNode ? this.maxStarNode.active = false : 0;
      this.star.string = heroInfo.star > 5 ? '1'.repeat(heroInfo.star - 5) : '0'.repeat(heroInfo.star);
    }
    //this.star.string = heroInfo.star > 5 ? '1'.repeat(heroInfo.star - 5) : '0'.repeat(heroInfo.star);


    let path = 'view/role/texture/up/' + ConfigManager.getItemById(GroupCfg, group).icon + '_icon';
    GlobalUtil.setSpriteIcon(this.node, this.group, path);
    if (!this.list['tempUpHeroList']) {
      this.isUp = false;
    }
    else {
      this.isUp = this.list['tempUpHeroList'].indexOf(heroInfo.heroId) != -1;
    }
    GlobalUtil.setAllNodeGray(this.node.getChildByName('frame'), this.isUp ? 1 : 0);
    this.upFlag.active = this.isUp;
  }

  _itemClick() {
    gdk.e.emit(TaskEventId.TAVERN_HERO_CHOOSE_PANEL_CLICK, [this.data]);
    gdk.sound.isOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.click)
  }

  _onHeroSelected(e) {
    let id = e.data[0];
    if (id == this.data.info.heroId) {
      this.isUp = true;
      GlobalUtil.setAllNodeGray(this.node.getChildByName('frame'), this.isUp ? 1 : 0);
      this.upFlag.active = this.isUp;
    }
  }

  _onHeroUnSelected(e) {
    let id = e.data[0];
    if (id == this.data.info.heroId) {
      this.isUp = false;
      GlobalUtil.setAllNodeGray(this.node.getChildByName('frame'), this.isUp ? 1 : 0);
      this.upFlag.active = this.isUp;
    }
  }
}
