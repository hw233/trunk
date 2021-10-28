import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RewardItem from '../../../common/widgets/RewardItem';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
import { Adventure2_rankingCfg } from '../../../a/config';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';

/** 
 * @Description: 英雄试炼排行榜Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-02 11:16:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/NewAdventureAccessViewRankItemCtrl")
export default class NewAdventureAccessViewRankItemCtrl extends UiListItem {
    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Label)
    scoreLb: cc.Label = null;

    @property(cc.Label)
    rankLabel: cc.Label = null;
    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Sprite)
    frameIcon: cc.Sprite = null;

    @property(cc.Sprite)
    titleIcon: cc.Sprite = null;

    @property(cc.Sprite)
    rankSprite: cc.Sprite = null;


    @property(cc.Label)
    serverName: cc.Label = null;

    @property(cc.Node)
    rewardLayout: cc.Node = null;
    @property(cc.Prefab)
    rewardPre: cc.Prefab = null;

    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];

    rankCfg: Adventure2_rankingCfg;

    updateView() {
        this.updateItemView(this.data);
    }

    updateItemView(data) {
        let rank = data.rank;
        let value = data.value;
        this.rankCfg = data.rankCfg;
        this.scoreLabel.string = value
        if (data.brief) {
            let d: icmsg.RoleBrief = data.brief;
            this.nameLabel.string = d.name;
            this.lvLabel.string = '.' + d.level;
            this.iconNode.active = true;
            this.frameIcon.node.active = true;
            GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(d.head));
            GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(d.headFrame));
            GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(d.title));
            this.serverName.string = '[S' + Math.floor((d.id % (10000 * 100000)) / 100000) + ']'
            this.serverName.node.active = true;
            this.scoreLb.node.active = true;
            this.scoreLabel.node.active = true;
        } else {
            this.iconNode.active = false;
            this.frameIcon.node.active = false;
            this.titleIcon.node.active = false
            this.serverName.string = ''
            this.serverName.node.active = false;
            this.nameLabel.string = '虚位以待';
            this.lvLabel.string = '';
            this.scoreLb.node.active = false;
            this.scoreLabel.node.active = false;
        }


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

        // let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        // vipCtrl.updateVipLv(GlobalUtil.getVipLv(d.vipExp))
        this.rewardLayout.removeAllChildren();
        for (let i = 0; i < this.rankCfg.rank_rewards.length; i++) {
            let node = cc.instantiate(this.rewardPre);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.rankCfg.rank_rewards[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.rewardLayout)
        }
    }

    _itemSelect() {

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
        // 非好友的情况下增加添加好友按钮
        let btns: BtnMenuType[] = [1]
        let id = brief.id;
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
