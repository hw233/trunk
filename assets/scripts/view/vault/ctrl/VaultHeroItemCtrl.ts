import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import { Monster2Cfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class VaultHeroItem extends UiListItem {

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    starLab: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Sprite)
    colorBg: cc.Sprite = null

    info: number[] = []
    updateView() {
        this.info = this.data;
        let heroCfg = ConfigManager.getItemById(Monster2Cfg, this.info[0]);
        let soldierCfg = ConfigManager.getItemById(Monster2Cfg, this.info[1]);
        let icon = `icon/hero/${heroCfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        this.lvLab.string = `${heroCfg.level}`;
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${heroCfg.group}`);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${soldierCfg.type}`);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${heroCfg.color}`);
        this._updateStar(heroCfg.star);
    }

    /**更新星星数量 */
    _updateStar(num: number) {
        let starNum = num;
        if (starNum >= 12 && this.maxStarNode) {
            this.starLab.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        } else {
            this.starLab.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            let starTxt = "";
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            this.starLab.string = starTxt;
        }
    }
}
