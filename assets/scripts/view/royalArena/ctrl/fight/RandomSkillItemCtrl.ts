import { Royal_groupCfg } from '../../../../a/config';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-27 09:59:52 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/fight/RandomSkillItemCtrl")
export default class RandomSkillItemCtrl extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    nameLb: cc.Label = null;
    @property(cc.LabelOutline)
    nameline: cc.LabelOutline = null;
    @property(cc.Label)
    desLb: cc.Label = null;
    @property(cc.LabelOutline)
    desline: cc.LabelOutline = null;

    bgSpNames: string[] = ['hjjjc_dibanlv', 'hjjjc_dibanlan', 'hjjjc_dibanzi', 'hjjjc_dibancheng', 'hjjjc_dibanhong']

    nameColors: string[] = ['#ccfde0', '#beebfb', '#eaccfd', '#fff7c5', '#ffded8']
    nameLineColors: string[] = ['#124827', '#1e2472', '#470684', '#653519', '#54171b']

    desColors: string[] = ['#dfdfdf', '#d7d5d5', '#dfdfdf', '#dfdfdf', '#dfdfdf']
    desLineColors: string[] = ['#063804', '#052362', '#410c77', '#673a0f', '#5b1b0a']


    updateView(cfg: Royal_groupCfg) {
        //let config = ConfigManager.getItemById(MonsterCfg, cfg.id);
        // let url = 'icon/monster/' + cfg.icon + '_s';
        // GlobalUtil.setSpriteIcon(this.node, this.icon, url);

        let num = cfg.color - 1;
        let bgPath = 'view/royalArena/texture/skill/' + this.bgSpNames[num];
        GlobalUtil.setSpriteIcon(this.node, this.bg, bgPath);

        let iconPath = 'view/royalArena/texture/skill/' + cfg.icon;
        GlobalUtil.setSpriteIcon(this.node, this.icon, iconPath);

        this.nameLb.string = cfg.title
        this.nameLb.node.color = cc.color(this.nameColors[num])
        this.nameline.color = cc.color(this.nameLineColors[num])

        this.desLb.string = cfg.describe
        this.desLb.node.color = cc.color(this.desColors[num])
        this.desline.color = cc.color(this.desLineColors[num])

    }

    onDisable() {
        GlobalUtil.setSpriteIcon(this.node, this.bg, null);
        GlobalUtil.setSpriteIcon(this.node, this.icon, null);
        super.onDisable && super.onDisable();
    }




}
