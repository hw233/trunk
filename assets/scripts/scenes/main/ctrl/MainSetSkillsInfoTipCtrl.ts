import { SkillCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
/**
 * @Description: 个人名片-荣耀展示tips
 * @Author: yaozu.hu
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-24 11:07:35
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainSetskillsInfoTipCtrl")
export default class MainSetskillsInfoTipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    awakeingSkillNode: cc.Node = null;
    @property(cc.Sprite)
    awakeingSkillIcon: cc.Sprite = null;
    @property(cc.Label)
    awakeingSkillName: cc.Label = null;
    @property(cc.Label)
    awakeingSkillLv: cc.Label = null;
    @property(cc.RichText)
    awakeingSkillDes: cc.RichText = null;

    @property([cc.Node])
    skillNodes: cc.Node[] = []

    @property(cc.Node)
    scrollNode: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;

    awakeSKillId: number = 0;
    skillCfg: SkillCfg[] = [];
    skillIds: number[] = [];
    heroStar: number = 0;
    onEnable() {
        let arg = this.args
        this.awakeSKillId = arg[0]
        this.skillCfg = arg[1]
        this.skillIds = arg[2]
        this.heroStar = arg[3]
        this.awakeingSkillNode.active = false;
        this.skillNodes.forEach(node => {
            node.active = false;
        })
        this._updateSkillInfo()
    }
    onDisable() {
        gdk.Timer.clearAll(this)
    }

    _updateSkillInfo() {
        if (this.awakeSKillId > 0) {
            this.awakeingSkillNode.active = true;
            let cfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', this.awakeSKillId)
            GlobalUtil.setSpriteIcon(this.node, this.awakeingSkillIcon, GlobalUtil.getSkillIcon(this.awakeSKillId))
            this.awakeingSkillName.string = cfg.name;
            this.awakeingSkillLv.string = 'Lv1';
            this.awakeingSkillDes.string = cfg.des;
            if (this.awakeingSkillDes.node.height > 70) {
                this.awakeingSkillNode.height = 50 + this.awakeingSkillDes.node.height + 20
            } else {
                this.awakeingSkillNode.height = 120
            }
            // this.awakeingSkillDes.node.on(cc.Node.EventType.SIZE_CHANGED, () => {
            //     if (this.awakeingSkillDes.node.height > 70) {
            //         this.awakeingSkillNode.height = 50 + this.awakeingSkillDes.node.height + 30
            //     } else {
            //         this.awakeingSkillNode.height = 120
            //     }
            //     this.awakeingSkillDes.node.targetOff(this)
            // }, this)
        }
        this.skillCfg.forEach((cfg, idx) => {
            let node = this.skillNodes[idx]
            node.active = true;
            let icon = cc.find('bgNode/skillIcon', node).getComponent(cc.Sprite);
            let tianfu = cc.find('bgNode/tianfu', node);
            let lockNode = cc.find('bgNode/lockNode', node);
            let nameLb = cc.find('bgNode/layout/skillName', node).getComponent(cc.Label);
            let lv = cc.find('bgNode/layout/skillLv', node).getComponent(cc.Label);
            let des = cc.find('bgNode/des', node).getComponent(cc.RichText);
            tianfu.active = cfg.dmg_type == 9;
            let islock = true;
            if (this.heroStar >= 12 || this.skillIds.indexOf(cfg.skill_id) >= 0) {
                islock = false;
            }
            lockNode.active = islock;
            let path = GlobalUtil.getSkillIcon(cfg.skill_id)
            GlobalUtil.setSpriteIcon(this.node, icon, path)
            nameLb.string = cfg.name;
            lv.string = 'Lv' + cfg.level;
            des.string = cfg.des;

            if (des.node.height > 70) {
                node.height = 50 + des.node.height + 20
            } else {
                node.height = 120
            }
        })

        gdk.Timer.once(80, this, () => {
            if (this.content.height > 805) {
                this.scrollNode.height = 805
            } else {
                this.scrollNode.height = this.content.height
            }
        })
    }

}
