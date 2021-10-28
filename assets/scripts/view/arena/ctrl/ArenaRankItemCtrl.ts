import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';

/** 
 * @Description: 竞技场子项
 * @Author: jijing.liu  
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-19 16:57:06
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/ArenaRankItemCtrl")
export default class ArenaRankItemCtrl extends UiListItem {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    rankLabel: cc.Label = null;

    @property(cc.Node)
    noRank: cc.Node = null;

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Sprite)
    frameIcon: cc.Sprite = null;

    @property(cc.Sprite)
    rankSprite: cc.Sprite = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    _rankInfo: icmsg.RankBrief = null

    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];
    updateView(data) {
        let d: icmsg.RankBrief = data;
        this._rankInfo = data
        this.nameLabel.string = d.brief.name;
        this.lvLabel.string = '.' + d.brief.level;
        this.scoreLabel.string = d.value + '';
        GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(d.brief.head));
        GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(d.brief.headFrame));
        if (data['rank'] <= 3) {
            this.rankLabel.node.active = false;
            this.rankSprite.node.active = true;
            // let resId = gdk.Tool.getResIdByNode(this.node)
            let path = this.rankSpriteName[data['rank'] - 1];//GlobalUtil.getSkillIcon(skillId)
            GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
            // gdk.rm.loadRes(resId, path, cc.SpriteFrame, (sp: cc.SpriteFrame) => {
            //     if (cc.isValid(this.node)) {
            //         this.rankSprite.spriteFrame = sp
            //     }
            // })
        } else {
            this.rankLabel.node.active = true;
            this.rankSprite.node.active = false;
            this.rankLabel.string = data['rank'] + '';
        }

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(d.brief.vipExp))

        // if (data['rank'] % 2 == 0) {
        //     this.bg.active = true
        // } else {
        //     this.bg.active = false
        // }

    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._itemClick, this)
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._itemClick, this)
    }

    /** 子项点击 */
    _itemClick() {
        if (!this._rankInfo || (this._rankInfo && this._rankInfo.brief.id == ModelManager.get(RoleModel).id)) {
            return
        }
        let friendModel = ModelManager.get(FriendModel)
        let btns = [1, 0, 11]
        let friendIdList = friendModel.friendIdList
        let idList = friendModel.backIdList
        // // 判断添加屏蔽/取消屏蔽按钮
        if (idList[this._rankInfo.brief.id.toLocaleString()]) {
            btns.splice(1, 0, 5)
        } else {
            btns.splice(1, 0, 4)
        }
        // 非好友的情况下增加添加好友按钮
        if (!friendIdList[this._rankInfo.brief.id.toLocaleString()]) {
            btns.splice(1, 0, 2)
        }

        //非普通成员可 发出 公会邀请
        if (ModelManager.get(RoleModel).guildTitle != 0 && this._rankInfo.brief.guildId == 0) {
            btns.push(10)
        }

        GlobalUtil.openBtnMenu(this.node, btns, {
            id: this._rankInfo.brief.id,
            name: this._rankInfo.brief.name,
            headId: this._rankInfo.brief.head,
            headBgId: this._rankInfo.brief.headFrame,
            level: this._rankInfo.brief.level,
        })

    }

}
