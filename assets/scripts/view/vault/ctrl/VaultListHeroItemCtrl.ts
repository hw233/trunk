import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Hero_starCfg, HeroCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class VaultListHeroItem extends UiListItem {

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

    info: icmsg.HeroBrief = null;
    playerId: number = 0;

    updateView() {
        this.info = this.data.heroData;
        this.playerId = this.data.playerId;
        let heroCfg = ConfigManager.getItemById(HeroCfg, this.info.typeId)

        let icon = HeroUtils.getHeroHeadIcon(this.info.typeId, this.info.star, false)//`icon/hero/${heroCfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        this.lvLab.string = `${this.info.level}`;
        let soldierType = Math.floor(this.info.soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${heroCfg.group}`);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${soldierType}`);
        let color = ConfigManager.getItemById(Hero_starCfg, this.info.star).color
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${color}`);
        this._updateStar(this.info.star);
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

    // _itemClick() {
    //     let msg = new icmsg.RoleHeroImageReq()
    //     msg.playerId = this.playerId
    //     msg.heroId = this.info.typeId
    //     msg.type = 0;
    //     NetManager.send(msg, (data: icmsg.RoleHeroImageRsp) => {
    //         gdk.panel.open(PanelId.LookHeroView, (node: cc.Node) => {
    //             // let model = ModelManager.get(HeroModel)
    //             // model.heroImage = data.hero
    //             let comp = node.getComponent(LookHeroViewCtrl)
    //             comp.updateHeroInfo()
    //         })
    //     })
    // }
}
