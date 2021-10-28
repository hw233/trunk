import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import PanelId from '../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import { SkillCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-04-20 14:03:50 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/GetHeroSkillItemCtrl')
export default class GetHeroSkillItemCtrl extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    speciclSkillBg: cc.Node = null;

    @property(cc.Label)
    uniqueLabel: cc.Label = null;

    @property(cc.Label)
    innateLabel: cc.Label = null;

    skillInfo: SkillCfg = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._itemClick, this)
    }

    onDestroy() {
        this.node.stopAllActions();
        this.node.off(cc.Node.EventType.TOUCH_END, this._itemClick, this)
    }

    /**
     * 更新技能
     * @param skillId 
     * @param type 1-天赋 2-超绝 3-普通 
     */
    updateSkillInfo(skillId: number, type: number, duration?: number) {
        if (!skillId) {
            return
        }

        let label;
        switch (type) {
            case 1:
            case 2:
                this.speciclSkillBg.active = true;
                this.spine.node.active = false;
                label = type == 1 ? this.uniqueLabel : this.innateLabel;
                label.node.active = true;
                break;
            case 3:
                this.speciclSkillBg.active = false;
                this.spine.node.active = true;
                this.spine.setAnimation(0, 'stand3', true);
                this.uniqueLabel.node.active = false;
                this.innateLabel.node.active = false;
                break;
        }

        this.skillInfo = null
        let skillInfo: SkillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, null)
        this.skillInfo = skillInfo
        // this.skillName.string = this.skillInfo.name
        GlobalUtil.setSpriteIcon(this.node, this.icon, 'icon/skill/' + this.skillInfo.icon)

        duration && this._showAnimation(duration);
    }

    _showAnimation(duration: number) {
        this.node.scale = 0.8;
        this.node.opacity = 0;
        let action = cc.spawn(
            cc.sequence(
                cc.scaleTo(duration / 2, 1.2, 1.2),
                cc.scaleTo(duration / 2, 1, 1),
            ),
            cc.fadeIn(duration)
        );
        this.node.runAction(action);
    }


    _itemClick() {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            node.setPosition(0, -280);
            let comp = node.getComponent(SkillInfoPanelCtrl)
            if (this.skillInfo) {
                comp.showSkillInfo(this.skillInfo.skill_id)
            }
        })
    }
}
