import ChatUtils from '../../../../chat/utils/ChatUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroDetailSkillCtrl from '../../../../lottery/ctrl/HeroDetailSkillCtrl';
import HeroDetailViewCtrl from '../../../../lottery/ctrl/HeroDetailViewCtrl';
import HeroModel from '../../../../../common/models/HeroModel';
import MarkCommentItemCtrl from './MarkCommentItemCtrl';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleModel from '../../../../../common/models/RoleModel';
import ServerModel from '../../../../../common/models/ServerModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import {
    Comments_globalCfg,
    CommentsCfg,
    GuideCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg
    } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { RoleEventId } from '../../../enum/RoleEventId';



export enum CommentType {
    Like = 0,   //喜欢
    Zan = 1,   //点赞
    Zhuan = 2,//转发

}


/**
 * 英雄评论界面
 * @Author: luoyong
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 21:46:47
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/comment/HeroCommentPanelCtrl")
export default class HeroCommentPanelCtrl extends gdk.BasePanel {


    @property(UiSlotItem)
    heroSlotItem: UiSlotItem = null

    @property(cc.Label)
    heroNameLab: cc.Label = null

    @property(cc.Label)
    likeLab: cc.Label = null

    @property(cc.Node)
    addLabNode: cc.Node = null

    @property(cc.Label)
    commentNumLab: cc.Label = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    commentListItem: cc.Prefab = null

    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.Button)
    sendBtn: cc.Button = null

    @property(cc.Node)
    markLayout: cc.Node[] = []

    @property(cc.Prefab)
    markItem: cc.Prefab = null

    @property(cc.Node)
    btnLike: cc.Node = null

    @property(cc.Node)
    tipNode: cc.Node = null

    @property(cc.RichText)
    tipText: cc.RichText = null

    @property(cc.Node)
    leftNode: cc.Node = null

    @property(cc.Node)
    rightNode: cc.Node = null


    _heroId: number = 0//配置id
    _star: number = 0
    _commentId: number = 0

    list: ListView = null;

    get serverModel(): ServerModel { return ModelManager.get(ServerModel); }
    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        let args = this.args
        if (args && args.length > 0) {
            this._heroId = parseInt(args[0])
            this._star = parseInt(args[1])
            this._commentId = parseInt(args[2]) ? parseInt(args[2]) : 0
        } else {
            this._heroId = this.heroModel.curHeroInfo.typeId
            this._star = this.heroModel.curHeroInfo.star
            this._commentId = 0
        }
        gdk.e.on(RoleEventId.COMMENT_MARK_PUT_IN, this._quickPutIn, this)
        gdk.e.on(RoleEventId.COMMENT_REFRESH_DATA, this._updateListView, this)
        NetManager.on(icmsg.FindCommentRsp.MsgType, this._onFindCommentRsp, this)

        let heroCfg = ConfigManager.getItemById(HeroCfg, this._heroId)
        let starCfg = ConfigManager.getItemById(Hero_starCfg, this._star)
        if (this.heroModel.commentUpStarShow) {
            this.heroModel.commentUpStarShow = false
            this.tipNode.parent.active = true
            let trigger_guide1 = ConfigManager.getItemById(Comments_globalCfg, "trigger_guide1").value
            let trigger_guide2 = ConfigManager.getItemById(Comments_globalCfg, "trigger_guide2").value
            if (this._star == trigger_guide1[0]) {
                let cfg = ConfigManager.getItemById(GuideCfg, trigger_guide1[2])
                let nameStr = `<color=${GlobalUtil.getHeroNameColor(starCfg.color)}><outline color=${GlobalUtil.getHeroNameColor(starCfg.color, true)} width=${2}>${heroCfg.name}</outline></color>`
                let starStr = `<color=${GlobalUtil.getHeroNameColor(starCfg.color)}><outline color=${GlobalUtil.getHeroNameColor(starCfg.color, true)} width=${2}>${this._star}</outline></color>`
                this.tipText.string = cfg.text.replace("{%s}", nameStr).replace("{%s}", starStr)
            } else if (this._star == trigger_guide2[0]) {
                let cfg = ConfigManager.getItemById(GuideCfg, trigger_guide2[2])
                let nameStr = `<color=${GlobalUtil.getHeroNameColor(starCfg.color)}><outline color=${GlobalUtil.getHeroNameColor(starCfg.color, true)} width=${2}>${heroCfg.name}</outline></color>`
                let starStr = `<color=${GlobalUtil.getHeroNameColor(starCfg.color)}><outline color=${GlobalUtil.getHeroNameColor(starCfg.color, true)} width=${2}>${this._star}</outline></color>`
                this.tipText.string = cfg.text.replace("{%s}", nameStr).replace("{%s}", starStr)
            }
        }
        this._star = heroCfg.star_min
        this._updateCommentView()
    }

    _updateCommentView() {
        let heroCfg = ConfigManager.getItemById(HeroCfg, this._heroId)
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroCfg.career_id)
        this.heroSlotItem.group = heroCfg.group[0]
        this.heroSlotItem.career = careerCfg.career_type
        this.heroSlotItem.starNum = this._star
        this.heroSlotItem.updateItemInfo(this._heroId)
        this.heroSlotItem.updateStar(this._star)
        this.heroNameLab.string = `${heroCfg.name}`
        let starCfg = ConfigManager.getItemById(Hero_starCfg, this._star)
        this.heroNameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(starCfg.color))
        let outLine = this.heroNameLab.node.getComponent(cc.LabelOutline)
        outLine.color = cc.color(GlobalUtil.getHeroNameColor(starCfg.color, true))

        let msg = new icmsg.FindCommentReq()
        msg.heroId = this._heroId
        msg.pagination = this.heroModel.commentCurpage
        NetManager.send(msg)

        this.initMarkLayoutNode()
        this.updateSendBtn(0, true);
        GlobalUtil.setAllNodeGray(this.sendBtn.target, 0)
        let time = (this.serverModel.serverTime - this.heroModel.commentLastTimeStamp) / 1000;
        let checkTime = ConfigManager.getItemById(Comments_globalCfg, "comments_interval").value[0]
        if (Math.ceil(checkTime - time) > 0) {
            GlobalUtil.setAllNodeGray(this.sendBtn.target, 1)
        }
        let heroView = gdk.panel.get(PanelId.RoleView2)
        let heroDetail = gdk.panel.get(PanelId.HeroDetail)
        if (heroView || heroDetail) {
            this.leftNode.active = true
            this.rightNode.active = true
        }
    }

    onDisable() {
        gdk.e.targetOff(this)
        NetManager.targetOff(this)
        this.heroModel.commentCurpage = 1
        this.heroModel.commentNum = 0
        this.heroModel.commentListNum = 0
        this.heroModel.commentAllList = {}
        this.heroModel.commentEffectId = 0
    }

    _onFindCommentRsp(data: icmsg.FindCommentRsp) {
        this.heroModel.commentHeroIsLike = data.isFond
        this.heroModel.commentHeroLike = data.fondNum
        this.heroModel.commentNum = data.maxNum
        this.heroModel.commentAllList[this.heroModel.commentCurpage] = data.commentData
        this.commentNumLab.string = `${this.heroModel.commentNum}`
        this._updateListView()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.commentListItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
            scroll_to_end_cb: this._endCallFunc,
        })
    }

    sendFunc() {
        let text = ChatUtils.filter(this.InputBox.string)
        if (text == "") {
            gdk.GUIManager.showMessage(gdk.i18n.t("i18n:HERO_TIP20"))
            return
        }
        let star_requirements = ConfigManager.getItemById(Comments_globalCfg, "star_requirements").value[0]
        let list = this.heroModel.heroInfos
        let hasHero = false
        for (let i = 0; i < list.length; i++) {
            let info = list[i].extInfo as icmsg.HeroInfo
            if (info.typeId == this._heroId && info.star >= star_requirements) {
                hasHero = true
                break
            }
        }
        if (!hasHero) {
            gdk.GUIManager.showMessage(StringUtils.format(gdk.i18n.t("i18n:HERO_TIP21"), star_requirements))//`获得英雄且提升至${star_requirements}星后才能进行评论`
            return
        }
        let time = (this.serverModel.serverTime - this.heroModel.commentLastTimeStamp) / 1000;
        let checkTime = ConfigManager.getItemById(Comments_globalCfg, "comments_interval").value[0]
        if (Math.ceil(checkTime - time) > 0) {
            gdk.GUIManager.showMessage(StringUtils.format(gdk.i18n.t("i18n:HERO_TIP22"), Math.ceil(checkTime - time)))//`休息一下，${Math.ceil(checkTime - time)}秒后再尝试评论`
            return
        }

        let msg = new icmsg.InsertCommentReq()
        msg.heroId = this._heroId
        msg.playerId = this.roleModel.id
        msg.content = this.InputBox.string
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP23"))
            this.heroModel.commentLastTimeStamp = this.serverModel.serverTime;
            GlobalUtil.setAllNodeGray(this.sendBtn.target, 1)
            this.updateSendBtn(0, true);
            this.InputBox.string = ''
            //再次请求最新的评论
            this.heroModel.commentCurpage = 1
            let msg2 = new icmsg.FindCommentReq()
            msg2.heroId = this._heroId
            msg2.pagination = this.heroModel.commentCurpage
            NetManager.send(msg2)
        }, this)
    }

    initMarkLayoutNode() {
        let commentCfg = ConfigManager.getItemByField(CommentsCfg, "hero_id", this._heroId)
        if (!commentCfg) {
            commentCfg = ConfigManager.getItemByField(CommentsCfg, "hero_id", 300011)
        }
        for (let i = 0; i < this.markLayout.length; i++) {
            this.markLayout[i].removeAllChildren()
            let c_marks = commentCfg.label[i]
            for (let j = 0; j < c_marks.length; j++) {
                let m_item = cc.instantiate(this.markItem)
                let ctrl = m_item.getComponent(MarkCommentItemCtrl)
                ctrl.updateDes(c_marks[j])
                this.markLayout[i].addChild(m_item)
            }
        }
    }

    _quickPutIn(e: gdk.Event) {
        this.InputBox.string += " " + e.data
        this.InputBox.focus()
    }

    /**
     * 更新按钮标签
     * @param dt 
     * @param isAddSchedule 
     */
    updateSendBtn(dt: number, isAddSchedule?: boolean) {
        let text = this.sendBtn.getComponentInChildren(cc.Label);
        let time = (this.serverModel.serverTime - this.heroModel.commentLastTimeStamp) / 1000;
        let comments_interval = ConfigManager.getItemById(Comments_globalCfg, "comments_interval").value[0]
        let checkTime = comments_interval
        if (time >= checkTime) {
            this.unschedule(this.updateSendBtn);
            GlobalUtil.setAllNodeGray(this.sendBtn.target, 0)
            text.string = gdk.i18n.t("i18n:HERO_TIP24");
        } else {
            text.string = `${Math.ceil(checkTime - time)} ${gdk.i18n.t("i18n:HERO_TIP25")}`;
            if (isAddSchedule) {
                this.schedule(this.updateSendBtn, 1);
            }
        }
    }

    _updateListView() {
        this._initListView()
        let data = []
        for (let key in this.heroModel.commentAllList) {
            data = data.concat(this.heroModel.commentAllList[key])
        }
        if (this._commentId != 0) {
            this.heroModel.commentEffectId = this._commentId
            let msg = new icmsg.CommentInfoReq()
            msg.id = this._commentId
            NetManager.send(msg, (rsp: icmsg.CommentInfoRsp) => {
                let newData = []
                newData.push(rsp.info)
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id != this._commentId) {
                        newData.push(data[i])
                    }
                }
                this.list.set_data(newData, false)
            })
        } else {
            this.list.set_data(data, false)
        }
    }

    /**列表拖到最底分页 */
    _endCallFunc() {
        let comments_limit = ConfigManager.getItemById(Comments_globalCfg, "comments_limit").value[0]
        let maxPage = Math.ceil(this.heroModel.commentNum / comments_limit)
        if (this.heroModel.commentCurpage < maxPage) {
            this.heroModel.commentCurpage += 1
            let msg = new icmsg.FindCommentReq()
            msg.heroId = this._heroId
            msg.pagination = this.heroModel.commentCurpage
            NetManager.send(msg)
        }
    }

    onLikeClick() {
        let msg = new icmsg.UpdateCommentReq()
        msg.id = this._heroId
        msg.updateType = CommentType.Like
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP26"))
            this.heroModel.commentHeroIsLike = true
            this.heroModel.commentHeroLike += 1
            this.addLabNode.x = this.likeLab.node.x + this.likeLab.node.width / 2
            this.addLabNode.runAction(cc.sequence(cc.spawn(cc.moveTo(0.6, cc.v2(this.addLabNode.x, this.addLabNode.y + 70)), cc.fadeIn(0.6)), cc.fadeOut(0.2)))
        })
    }

    @gdk.binding("heroModel.commentHeroLike")
    updateCommentLikeNum() {
        this.likeLab.string = `${this.heroModel.commentHeroLike}`
        this.btnLike.active = !this.heroModel.commentHeroIsLike
    }

    clickNodeFunc() {
        this.tipNode.parent.active = false
    }



    /**上一个英雄 */
    leftFunc() {
        this._changHero(-1);
    }

    /**下一个英雄 */
    rightFunc() {
        this._changHero(1);
    }

    /**左右切换当前选择英雄 */
    _changHero(dir: number) {
        let heroView = gdk.panel.get(PanelId.RoleView2)
        let heroDetail = gdk.panel.get(PanelId.HeroDetail)
        if (heroView) {
            let items = this.heroModel.selectHeros;
            let len = items.length;
            if (len == 0) {
                return;
            }
            let heroIdx = -1;
            let curr = this.heroModel.curHeroInfo;
            curr && items.some((item, i) => {
                let info = <icmsg.HeroInfo>item.data.extInfo;
                if (info && info.heroId == curr.heroId) {
                    heroIdx = i;
                    return true;
                }
                return false;
            });
            let nextIdx = heroIdx + dir;
            if (nextIdx < 0) {
                nextIdx = len - 1;
            } else if (nextIdx >= len) {
                nextIdx = 0;
            }
            if (heroIdx == nextIdx) {
                return;
            }
            this.heroModel.curHeroInfo = items[nextIdx].data.extInfo as icmsg.HeroInfo;
            this._heroId = this.heroModel.curHeroInfo.typeId
            this._star = this.heroModel.curHeroInfo.star
        }

        if (heroDetail) {
            let items = this.heroModel.bookHeroList;
            let len = items.length;
            if (len == 0) {
                return;
            }
            let heroIdx = -1;
            let heroCfg = ConfigManager.getItemById(HeroCfg, this._heroId)
            let curr = heroCfg
            curr && items.some((item, i) => {
                let cfg = item.cfg
                if (cfg && cfg.id == curr.id) {
                    heroIdx = i;
                    return true;
                }
                return false;
            });
            let nextIdx = heroIdx + dir;
            if (nextIdx < 0) {
                nextIdx = len - 1;
            } else if (nextIdx >= len) {
                nextIdx = 0;
            }
            if (heroIdx == nextIdx) {
                return;
            }
            let ctrl = heroDetail.getComponent(HeroDetailViewCtrl)
            ctrl.initHeroInfo(items[nextIdx].cfg, items[nextIdx])
            let panel = gdk.panel.get(PanelId.HeroDetailSkill)
            if (panel) {
                let ctrl = panel.getComponent(HeroDetailSkillCtrl)
                ctrl.updateView(items[nextIdx].cfg, items[nextIdx])
            }
            let cfg = ConfigManager.getItemById(HeroCfg, items[nextIdx].cfg.id)
            let starCfg = ConfigManager.getItemByField(Hero_starCfg, "color", cfg.defaultColor)
            this._heroId = cfg.id
            this._star = starCfg.star
        }

        this._updateCommentView()
    }
}