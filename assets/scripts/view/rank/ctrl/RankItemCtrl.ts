import ConfigManager from '../../../common/managers/ConfigManager';
import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';
import { Copy_stageCfg } from '../../../a/config';
import { RankInfo } from './RankViewCtrl';
import { RankTypes } from '../enum/RankEvent';

/** 
 * @Description: 排行榜子项
 * @Author: luoyong  
 * @Date: 2019-07-09 21:10:52
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-31 20:30:05
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/rank/RankItemCtrl")
export default class RankItemCtrl extends UiListItem {

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

    @property(cc.Node)
    titleIcon: cc.Node = null

    @property(cc.Node)
    cupIcon: cc.Node = null;

    // @property(cc.Node)
    // headFrameImg: cc.Node = null

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Label)
    playerName: cc.Label = null

    @property(cc.Label)
    power: cc.Label = null

    @property(cc.Node)
    powerNode: cc.Node = null


    @property(cc.Node)
    selectImg: cc.Node = null

    @property(cc.Node)
    refine: cc.Node = null;
    @property(cc.Label)
    floor: cc.Label = null;

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Node)
    contentNode: cc.Node = null

    // get model(): RankModel { return ModelManager.get(RankModel); }
    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onDisable() {

    }

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
        let roleTitle = brief.title
        if (this.data.playerId == this.roleModel.id) {
            headId = this.roleModel.head
            headFrame = this.roleModel.frame
            roleTitle = this.roleModel.title
            vipCtrl.updateVipLv(this.roleModel.vipLv)
        }
        // let heroCfg = ConfigManager.getItemById(HeroCfg, headId)
        // if (heroCfg) {
        //     GlobalUtil.setSpriteIcon(this.node, this.headImg, GlobalUtil.getIconById(heroCfg.icon, BagType.HERO))
        // }
        GlobalUtil.setSpriteIcon(this.node, this.headImg, GlobalUtil.getHeadIconById(headId));
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(roleTitle));

        this.powerNode.active = data.type == RankTypes.Power || data.type == RankTypes.Cup;
        this.refine.active = data.type == RankTypes.Refine || data.type == RankTypes.Stage;
        this.cupIcon.active = false;
        switch (data.type) {
            case RankTypes.Stage:
                let cfg: Copy_stageCfg = ConfigManager.getItem(Copy_stageCfg, { id: data.value });
                if (cfg) {
                    this.floor.string = cfg.name.split(' ')[0];
                } else {
                    this.floor.string = gdk.i18n.t("i18n:RANK_TIP1");
                }
                break;
            case RankTypes.Refine: {
                let cfg: Copy_stageCfg = ConfigManager.getItem(Copy_stageCfg, { id: data.value });
                if (cfg) {
                    this.floor.string = cfg.des;
                } else {
                    this.floor.string = gdk.i18n.t("i18n:RANK_TIP1");
                }
                // this.floor.string = cfg.des;
            }
                break;
            case RankTypes.Power: {
                this.power.string = data.value + "";
            }
                break;
            case RankTypes.Cup:
                this.cupIcon.active = true;
                this.power.string = data.value + "";
                break;
        }
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
        if (this.data.data.playerId == this.roleModel.id) {
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
