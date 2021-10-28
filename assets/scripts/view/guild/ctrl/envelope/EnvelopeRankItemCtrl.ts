import FriendModel from '../../../friend/model/FriendModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../common/widgets/VipFlagCtrl';
import { BtnMenuType } from '../../../../common/widgets/BtnMenuCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-08 10:06:09 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/envelop/EnvelopeRankItemCtrl")
export default class EnvelopeRankItemCtrl extends UiListItem {
    @property(cc.Node)
    rankSprite: cc.Node = null;

    @property(cc.Node)
    rankLabelNode: cc.Node = null;

    @property(cc.Node)
    noRank: cc.Node = null;

    @property(cc.Node)
    headIcon: cc.Node = null;

    @property(cc.Node)
    headFrame: cc.Node = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    vipNode: cc.Node = null;

    @property(cc.Label)
    valueLab: cc.Label = null;

    @property(cc.Label)
    numLab: cc.Label = null;

    @property(cc.Node)
    soloNode: cc.Node = null;

    @property(cc.Node)
    guildNode: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    emptyContent: cc.Node = null;

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];
    info: icmsg.WorldEnvelopeRank;
    updateView() {
        this._updateView(this.data);
    }

    _updateView(d: icmsg.WorldEnvelopeRank) {
        this.info = d;
        if (!d) {
            //虚位以待
            this.content.active = false;
            this.emptyContent.active = true;
            return;
        }
        this.content.active = true;
        this.emptyContent.active = false;
        if (!d.role) {
            //公会排行榜
            this.guildNode.active = true;
            this.soloNode.active = false;
            let state1 = cc.find('state1', this.guildNode);
            let state2 = cc.find('state2', this.guildNode);
            state1.active = !!d.guild;
            state2.active = !state1.active;
            if (state1.active) {
                GlobalUtil.setSpriteIcon(this.node, cc.find('iconNode/icon', state1), GuildUtils.getIcon(d.guild.icon))
                GlobalUtil.setSpriteIcon(this.node, cc.find('iconNode/frame', state1), GuildUtils.getIcon(d.guild.frame))
                GlobalUtil.setSpriteIcon(this.node, cc.find('iconNode/bottom', state1), GuildUtils.getIcon(d.guild.bottom))
                cc.find('guildName', state1).getComponent(cc.Label).string = d.guild.name;
                cc.find('presidentName', state1).getComponent(cc.Label).string = d.name;
            }
        }
        else {
            //个人榜
            this.guildNode.active = false;
            this.soloNode.active = true;
            this.nameLab.string = d.role.name;
            this.lvLab.string = '.' + d.role.level;
            GlobalUtil.setSpriteIcon(this.node, this.headIcon, GlobalUtil.getHeadIconById(d.role.head));
            GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(d.role.headFrame));
            let vipCtrl = this.vipNode.getComponent(VipFlagCtrl);
            vipCtrl.updateVipLv(GlobalUtil.getVipLv(d.role.vipExp));
            cc.find('guildName', this.soloNode).getComponent(cc.Label).string = d.name;
        }
        if (this.curIndex < 3) {
            this.noRank.active = false;
            this.rankLabelNode.active = false;
            this.rankSprite.active = true;
            let path = this.rankSpriteName[this.curIndex];
            GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
        }
        else {
            this.noRank.active = this.curIndex >= 999;
            this.rankLabelNode.active = this.curIndex < 999;
            this.rankSprite.active = false;
            this.rankLabelNode.getChildByName('rank').getComponent(cc.Label).string = `${this.curIndex + 1}`;
        }
        this.valueLab.string = `发放总价值：${d.value}`;
        this.numLab.string = `发放红包数：${d.num}`;
    }

    onClick() {
        if (this.info) {
            if (this.info.role) {
                let brief = this.info.role;
                let friendModel = ModelManager.get(FriendModel);
                if (brief.id == this.roleModel.id) {
                    return;
                }
                let friendIdList = friendModel.friendIdList
                let idList = friendModel.backIdList

                // 非好友的情况下增加添加好友按钮
                let btns: BtnMenuType[] = [1, 0]
                let id = brief.id;
                if (!friendIdList[id.toLocaleString()]) {
                    btns.splice(1, 0, 2)

                    // 判断添加屏蔽/取消屏蔽按钮
                    if (idList[id.toLocaleString()]) {
                        btns.splice(1, 0, 5)
                    } else {
                        btns.splice(1, 0, 4)
                    }
                } else {
                    btns.splice(1, 0, 3)
                }

                // //非普通成员可 发出 公会邀请
                if (this.roleModel.guildTitle != 0 && brief.guildId == 0) {
                    btns.push(10)
                }

                GlobalUtil.openBtnMenu(this.node, btns, {
                    id: id,
                    name: brief.name,
                    headId: brief.head,
                    level: brief.level,
                    headBgId: brief.headFrame,
                })
            }
            else if (this.info.guild) {
                gdk.panel.setArgs(PanelId.GuildJoin, this.info.guild.id, false)
                gdk.panel.open(PanelId.GuildJoin)
            }
        }
    }
}
