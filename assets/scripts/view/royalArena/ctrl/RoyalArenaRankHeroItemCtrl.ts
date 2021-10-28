import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiListItem from '../../../common/widgets/UiListItem';
import { Hero_careerCfg, Hero_starCfg, HeroCfg } from '../../../a/config';

/** 
 * @Description: 角色英雄面板-选择面板子项
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-10 10:32:14
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaRankHeroItemCtrl")
export default class RoyalArenaRankHeroItemCtrl extends cc.Component {

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

    @property(cc.Node)
    heroNode: cc.Node = null;

    @property(cc.Node)
    nullHeroNode: cc.Node = null;

    heroInfo: icmsg.HeroBrief = null
    heroCfg: HeroCfg = null
    quality: number = 0
    showInfo: boolean = false;
    _playerId: number = 0
    //info:{heroData:icmsg.PeakHero,isSelect:boolean,isHero:boolean,ordealHero:boolean}
    updateView(data: icmsg.HeroBrief, playerId) {
        this._playerId = playerId
        this.heroNode.active = true
        this.nullHeroNode.active = false
        this.heroInfo = data
        let cfg = BagUtils.getConfigById(this.heroInfo.typeId);
        let icon = `icon/hero/${cfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);

        let level = this.heroInfo.level || 1;
        this.lvLab.string = `${level}`;
        //设置等级颜色
        //let resonatingModel = ModelManager.get(ResonatingModel)
        //let temState = resonatingModel.getHeroInUpList(this.heroInfo.heroId)
        this.lvLab.node.color = cc.color('#FFFFFF')
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type;
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${careerType}`);
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, 'star', this.heroInfo.star);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${starCfg.color}`);
        this._updateStar();
    }

    updateNullHero() {
        this.heroInfo = null
        this.heroNode.active = false
        this.nullHeroNode.active = false
    }

    /**更新星星数量 */
    _updateStar() {
        let starNum = this.heroInfo.star;
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

    showInfoClick() {
        if (!this.heroInfo) {
            return
        }
        let msg = new icmsg.RoleHeroImageReq()
        msg.playerId = this._playerId
        msg.heroId = this.heroInfo.heroId
        msg.type = 0
        NetManager.send(msg, (data: icmsg.RoleHeroImageRsp) => {
            gdk.panel.setArgs(PanelId.MainSetHeroInfoTip, data)
            gdk.panel.open(PanelId.MainSetHeroInfoTip);
        })
    }
}
