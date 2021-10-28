import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import UiListItem from '../../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../../common/widgets/VipFlagCtrl';
import { Comments_globalCfg, Hero_starCfg, HeroCfg } from '../../../../../a/config';
import { CommentType } from './HeroCommentPanelCtrl';
/** 
 * @Description: 
 * @Author: luoyong  
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-19 17:05:29
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/comment/HeroCommentListItemCtrl")
export default class HeroCommentListItemCtrl extends UiListItem {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Node)
    iconFrame: cc.Node = null

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Node)
    hotNode: cc.Node = null

    @property(cc.Node)
    newNode: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.RichText)
    commentLab: cc.RichText = null;

    @property(cc.Node)
    btnZhuan: cc.Node = null

    @property(cc.Node)
    btnZan: cc.Node = null

    @property(cc.Label)
    zhuanLab: cc.Label = null;

    @property(cc.Label)
    zanLab: cc.Label = null;

    @property(sp.Skeleton)
    spineEffect: sp.Skeleton = null

    _commentInfo: icmsg.Comment

    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

    updateView() {
        this._commentInfo = this.data

        this.nameLab.string = `${this._commentInfo.playerName}`
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(this._commentInfo.headId));
        GlobalUtil.setSpriteIcon(this.node, this.iconFrame, GlobalUtil.getHeadFrameById(this._commentInfo.frameId));
        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(this._commentInfo.vIPExp))

        this.zhuanLab.string = `${this._commentInfo.repostNum}`
        this.zanLab.string = `${this._commentInfo.likeNum}`
        this.commentLab.string = ``
        this.commentLab.string = `${this._commentInfo.content}`

        this.hotNode.active = false
        this.newNode.active = this._commentInfo.isNew
        let cumulative_give_a_like = ConfigManager.getItemById(Comments_globalCfg, "cumulative_give_a_like").value[0]
        let cumulative_forwarding = ConfigManager.getItemById(Comments_globalCfg, "cumulative_forwarding").value[0]
        if (this._commentInfo.likeNum >= cumulative_give_a_like || this._commentInfo.repostNum >= cumulative_forwarding || this._commentInfo.isHot) {
            this.hotNode.active = true
        }
        GlobalUtil.setSpriteIcon(this.node, this.btnZan, "view/role/texture/comment/yxpl_dianzan")
        if (this._commentInfo.isLike) {
            GlobalUtil.setSpriteIcon(this.node, this.btnZan, "view/role/texture/comment/yxpl_yizan")
        }

        this.spineEffect.node.active = false
        if (this.heroModel.commentEffectId != 0 && this.heroModel.commentEffectId == this._commentInfo.id) {
            this.spineEffect.node.active = true
        }
    }

    onZhuanClick() {
        let heroCfg = ConfigManager.getItemById(HeroCfg, this._commentInfo.heroId)
        let starCfg = ConfigManager.getItemById(Hero_starCfg, heroCfg.defaultColor)
        let content = `${gdk.i18n.t("i18n:HERO_TIP16")}<color=${GlobalUtil.getHeroNameColor(starCfg.color)}><outline color=${GlobalUtil.getHeroNameColor(starCfg.color, true)} width=${2}><on click='shareHeroCommentClick' param='${heroCfg.id}@${starCfg.star}@${this._commentInfo.id}'>【${heroCfg.name}】</on></outline></color>${gdk.i18n.t("i18n:HERO_TIP17")}`
        let btns = [12, 13]
        GlobalUtil.openBtnMenu(this.btnZhuan, btns, {
            id: this._commentInfo.id,
            level: 0,//0是转发评论 1是分享英雄
            chatContent: content,
        })
    }

    onZanClick() {
        if (this._commentInfo.isLike) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP18"))
            return
        }
        let msg = new icmsg.UpdateCommentReq()
        msg.id = this._commentInfo.id
        msg.updateType = CommentType.Zan
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP19"))
            GlobalUtil.setSpriteIcon(this.node, this.btnZan, "view/role/texture/comment/yxpl_yizan")
            this.zanLab.string = `${this._commentInfo.likeNum + 1}`
            this._commentInfo.isLike = true
        })
    }
}