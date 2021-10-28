import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import LookHeroViewCtrl from '../../role/ctrl2/lookHero/LookHeroViewCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiListItem from '../../../common/widgets/UiListItem';
import { HeroCfg } from '../../../a/config';

/**
 * @Description: 个人名片-英雄子项
 * @Author: yaozu.hu
 * @Date: 2021-02-01 16:39:37
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:53:26
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaTeam/ArenaTeamHeroItemCtrl")
export default class ArenaTeamHeroItemCtrl extends UiListItem {

    @property(cc.Sprite)
    colorBg: cc.Sprite = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;

    @property(cc.Sprite)
    soldierIcon: cc.Sprite = null;
    @property(cc.Sprite)
    groupIcon: cc.Sprite = null;


    @property(cc.Label)
    starLabel: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    _info: icmsg.HeroBrief
    _playerId: number

    updateView() {
        this._info = this.data.hero
        this._playerId = this.data.playerId
        let cfg = ConfigManager.getItemById(HeroCfg, this._info.typeId)
        if (!cfg) {
            this.colorBg.node.active = false
        } else {
            this.colorBg.node.active = true
            let path = `common/texture/role/select/quality_bg_0${this._info.color}`
            GlobalUtil.setSpriteIcon(this.node, this.colorBg, path)
        }

        let icon = HeroUtils.getHeroHeadIcon(this._info.typeId, this._info.star, false)
        GlobalUtil.setSpriteIcon(this.node, this.heroIcon, icon)
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${cfg.group[0]}`);
        icon = GlobalUtil.getSoldierTypeIcon(this._info.soldierId)
        GlobalUtil.setSpriteIcon(this.node, this.soldierIcon, icon)

        this.lvLabel.string = this._info.level + "";

        // for (let i = 0, l = this.starsNode.children.length; i < l; i++) {
        //     this.starsNode.children[i].active = i < hero.star;
        // }
        let starNum = this._info.star;
        if (starNum >= 12 && this.maxStarNode) {
            this.starLabel.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        } else {
            this.starLabel.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            let starTxt = "";
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            this.starLabel.string = starTxt;
        }


    }

    heroInfoHandle(e, index) {
        // let model = ModelManager.get(RoleModel);
        // let msg = new icmsg.RoleHeroImageReq()
        // msg.playerId = model.lookPlayerId
        // msg.heroId = this._info.typeId
        // NetManager.send(msg)

        let msg = new icmsg.RoleHeroImageReq()
        msg.playerId = this._playerId
        msg.heroId = this._info.heroId
        msg.type = 0;
        NetManager.send(msg, (data: icmsg.RoleHeroImageRsp) => {
            gdk.panel.open(PanelId.LookHeroView, (node: cc.Node) => {
                let model = ModelManager.get(HeroModel)
                model.heroImage = data.hero
                let comp = node.getComponent(LookHeroViewCtrl)
                comp.updateHeroInfo()
            })
        })

    }

}
