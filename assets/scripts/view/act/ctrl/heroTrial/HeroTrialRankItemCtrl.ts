import FriendModel from '../../../friend/model/FriendModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BtnMenuType } from '../../../../common/widgets/BtnMenuCtrl';

/** 
 * @Description: 英雄试炼排行榜Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-19 16:55:22
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/heroTrial/HeroTrialRankItemCtrl")
export default class HeroTrialRankItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    rankLabel: cc.Label = null;
    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Sprite)
    frameIcon: cc.Sprite = null;

    @property(cc.Sprite)
    rankSprite: cc.Sprite = null;

    @property(cc.Node)
    selectImg: cc.Node = null;

    @property(cc.Label)
    serverName: cc.Label = null;

    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];
    updateView() {
        this.updateItemView(this.data);
    }

    updateItemView(data) {
        let d: icmsg.RoleBrief = data.brief;
        let value = data.value;
        let rank = data.rank;
        this.nameLabel.string = d.name;
        this.lvLabel.string = '.' + d.level;
        this.scoreLabel.string = value > 10000 ? (value / 10000).toFixed(1) + gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP1") : value + '';//GlobalUtil.numberToStr(value, false);
        GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(d.head));
        GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(d.headFrame));
        if (rank <= 3 && rank > 0) {
            this.rankLabel.node.active = false;
            this.rankSprite.node.active = true;
            let path = this.rankSpriteName[rank - 1];
            GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
        } else {
            this.rankLabel.node.active = true;
            this.rankSprite.node.active = false;
            this.rankLabel.string = rank <= 0 ? gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP2") : rank + '';
        }
        this.serverName.string = '[S' + Math.floor((d.id % (10000 * 100000)) / 100000) + ']'
        // let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        // vipCtrl.updateVipLv(GlobalUtil.getVipLv(d.vipExp))
    }


    _itemSelect() {
        if (!this.data.brief) {
            return;
        }
        if (this.selectImg) {
            this.selectImg.active = this.ifSelect
        }
    }

    /**展开菜单栏 */
    onHeadClick() {
        let brief: icmsg.RoleBrief = this.data.brief;
        if (!brief) {
            return;
        }
        if (this.data.brief.playerId == this.roleModel.id) {
            return;
        }
        let friendIdList = this.friendModel.friendIdList
        let idList = this.friendModel.backIdList

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

        this._itemSelect()
    }

}
