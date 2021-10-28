import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import { Justice_skillCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/MercenarySkillViewItemCtrl")
export default class MercenarySkillViewItemCtrl extends UiListItem {

    @property(cc.Sprite)
    skillIcon: cc.Sprite = null;
    @property(cc.Node)
    lock: cc.Node = null;
    @property(cc.Label)
    level: cc.Label = null;
    @property(cc.Label)
    skillName: cc.Label = null;
    @property(cc.Label)
    skillDes: cc.Label = null;

    info: { lock: boolean, skillId: number, lockLevel: number };
    updateView() {
        this.info = this.data;
        this.lock.active = this.info.lock;
        this.level.string = this.info.lockLevel + '';
        let skillCfg = ConfigManager.getItemById(Justice_skillCfg, this.info.skillId);
        //设置技能Icon
        let path = `icon/skill/${skillCfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, path);
        this.skillName.string = skillCfg.name;
        this.skillDes.string = skillCfg.des;
    }
}
