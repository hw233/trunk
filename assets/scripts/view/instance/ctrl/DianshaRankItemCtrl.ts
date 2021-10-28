import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';
import { RankInfo } from '../../rank/ctrl/RankViewCtrl';

/**
 * @Description: 点杀副本排行榜Item
 * @Author: yaozu.hu
 * @Date: 2020-07-07 10:07:33
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:34:25
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/DianshaRankItemCtrl")
export default class DianshaRankItemCtrl extends UiListItem {

    @property(cc.Node)
    rankBg: cc.Node = null;

    @property(cc.Node)
    rank: cc.Node = null

    @property(cc.Node)
    rankImg: cc.Node = null

    @property(cc.Node)
    headFrame: cc.Node = null
    @property(cc.Node)
    headImg: cc.Node = null

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Label)
    playerName: cc.Label = null

    @property(cc.Label)
    power: cc.Label = null

    @property(cc.Node)
    powerNode: cc.Node = null

    @property(cc.Node)
    contentNode: cc.Node = null

    @property(cc.Node)
    vipFlag: cc.Node = null
    @property(cc.Node)
    selectImg: cc.Node = null

    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    updateView() {

        let data: RankInfo = this.data as RankInfo;
        // this.bg.active = data.index % 2 == 0;
        let brief: icmsg.RoleBrief = data.data
        this.contentNode.active = brief && true;
        if (!brief) {
            return;
        }

        let isTopThree = data.index <= 3 && data.index > 0;
        this.rankImg.active = isTopThree;
        this.rank.active = !isTopThree;
        this.rankBg.active = !isTopThree;
        if (isTopThree) {
            let resId: string = gdk.Tool.getResIdByNode(this.node);
            let bgPath = `common/texture/main/gh_gxbhuizhang0${data.index}`;
            gdk.rm.loadRes(resId, bgPath, cc.SpriteFrame, (sp) => {
                if (cc.isValid(this.node)) {
                    this.rankImg.getComponent(cc.Sprite).spriteFrame = sp;
                }
            })
        } else {
            this.rank.getComponent(cc.Label).string = data.index + "";
        }
        this.lv.string = "." + brief.level;
        this.playerName.string = brief.name;

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(brief.vipExp))

        //头像
        let headId = brief.head
        let headFrame = brief.headFrame
        if (this.data.playerId == this.roleModel.id) {
            headId = this.roleModel.head
            headFrame = this.roleModel.frame
            vipCtrl.updateVipLv(this.roleModel.vipLv)
        }
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.headImg, GlobalUtil.getHeadIconById(headId));
        this.power.string = data.value + "";
    }

    _itemSelect() {
        if (!this.data.data) {
            return;
        }
        if (this.selectImg) {
            this.selectImg.active = this.ifSelect
        }
    }

    /**展开菜单栏 */
    onHeadClick() {
        let brief: icmsg.RoleBrief = this.data.data;
        if (!brief) {
            return;
        }
        if (this.data.data.id == this.roleModel.id) {
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
