import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import { HeroCfg } from '../../../a/config';

/**
 * @Description: 个人名片-英雄子项
 * @Author: weiliang.huang
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:54:26
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/general/BriefItemCtrl")
export default class BriefItemCtrl extends cc.Component {

    @property(cc.Sprite)
    colorBg: cc.Sprite = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;

    @property(cc.Sprite)
    soldierIcon: cc.Sprite = null;

    // @property(cc.Node)
    // starsNode: cc.Node = null;

    @property(cc.Label)
    starLabel: cc.Label = null;

    _info: icmsg.HeroBrief

    updateView(hero: icmsg.HeroBrief) {
        this._info = hero
        let cfg = ConfigManager.getItemById(HeroCfg, hero.typeId)
        if (!cfg) {
            this.colorBg.node.active = false
        } else {
            this.colorBg.node.active = true
            let path = `common/texture/juese_txbg03_0${hero.color}`
            GlobalUtil.setSpriteIcon(this.node, this.colorBg, path)
        }
        let icon = HeroUtils.getHeroHeadIcon(this._info.typeId, this._info.star, false)
        GlobalUtil.setSpriteIcon(this.node, this.heroIcon, icon)

        icon = GlobalUtil.getSoldierTypeIcon(hero.soldierId)
        GlobalUtil.setSpriteIcon(this.node, this.soldierIcon, icon)

        this.lvLabel.string = hero.level + "";

        // for (let i = 0, l = this.starsNode.children.length; i < l; i++) {
        //     this.starsNode.children[i].active = i < hero.star;
        // }
        let starTxt = "";
        for (let i = 0; i < hero.star; i++) {
            starTxt += "1";
        }
        this.starLabel.string = starTxt;
    }

    heroInfoHandle(e, index) {
        let model = ModelManager.get(RoleModel);
        let msg = new icmsg.RoleHeroImageReq()
        msg.playerId = model.lookPlayerId
        msg.heroId = this._info.typeId
        NetManager.send(msg)
    }

}
