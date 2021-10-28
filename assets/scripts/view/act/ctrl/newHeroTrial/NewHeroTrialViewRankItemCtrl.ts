import FriendModel from '../../../friend/model/FriendModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import RewardItem from '../../../../common/widgets/RewardItem';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BtnMenuType } from '../../../../common/widgets/BtnMenuCtrl';
import { Newordeal_rankingCfg } from '../../../../a/config';

/** 
 * @Description: 英雄试炼排行榜Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-26 15:02:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/newHeroTrial/NewHeroTrialViewRankItemCtrl")
export default class NewHeroTrialViewRankItemCtrl extends UiListItem {

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

    rankCfg: Newordeal_rankingCfg;

    updateView() {
        this.updateItemView(this.data);
    }

    updateItemView(data) {
        let d: icmsg.RoleBrief = data.brief;
        let value = data.value;
        let rank = data.rank;
        this.rankCfg = data.rankCfg;
        this.nameLabel.string = d.name;
        this.lvLabel.string = '.' + d.level;
        let allDamage = 0
        value.forEach(dmg => {
            allDamage += dmg;
        })
        this.scoreLabel.string = allDamage > 10000 ? (allDamage / 10000).toFixed(1) + gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP1") : allDamage + '';//GlobalUtil.numberToStr(value, false);
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
