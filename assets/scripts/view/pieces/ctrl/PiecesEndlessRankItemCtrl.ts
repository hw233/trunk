import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PiecesModel from '../../../common/models/PiecesModel';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { Pieces_rankingCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-18 11:33:39 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pieces/PiecesEndlessRankItemCtrl")
export default class PiecesEndlessRankItemCtrl extends UiListItem {
    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.Node)
    blankNode: cc.Node = null;

    @property(cc.Node)
    rankSprite: cc.Node = null;

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Sprite)
    frameIcon: cc.Sprite = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    rankSpriteName: string[] = ['common/texture/main/gh_gxbhuizhang01', 'common/texture/main/gh_gxbhuizhang02', 'common/texture/main/gh_gxbhuizhang03']
    info: icmsg.PiecesRankBrief | Pieces_rankingCfg;
    rankLen: number;
    updateView() {
        this.rankLen = this.data.rankLen;
        this.info = this.data.info;
        if (this.info instanceof icmsg.PiecesRankBrief) {
            this.playerNode.active = true;
            this.blankNode.active = false;
            this.nameLabel.string = this.info.brief.name;
            this.lvLabel.string = '.' + this.info.brief.level;
            GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(this.info.brief.head));
            GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(this.info.brief.headFrame));
            let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl);
            vipCtrl.updateVipLv(GlobalUtil.getVipLv(this.info.brief.vipExp));
            this.scoreLabel.string = `${gdk.i18n.t('i18n:PIECES_TIPS5')}${this.info.totalRound}`;
            if (this.info.rank <= 3) {
                this.rankLab.node.active = false;
                this.rankSprite.active = true;
                let path = this.rankSpriteName[this.info.rank - 1];
                GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
            }
            else {
                this.rankLab.node.active = true;
                this.rankSprite.active = false;
                this.rankLab.string = `${this.info.rank}`;
            }
        }
        else {
            this.playerNode.active = false;
            this.blankNode.active = true;
            this.rankLab.node.active = false;
            let lab = cc.find('rankNum', this.blankNode).getComponent(cc.Label);
            lab.node.active = false;
            this.rankSprite.active = this.info.rank[0] == this.info.rank[1] && this.info.rank[0] == 1;
            if (this.rankSprite.active) {
                let path = this.rankSpriteName[0];
                GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
            }
            else {
                lab.node.active = true;
                lab.string = `${this.info.rank[0] < this.rankLen ? this.rankLen : this.info.rank[0]}~${this.info.rank[1]}`;
            }
        }

        this._updateReward();
    }

    _updateReward() {
        let cfg: Pieces_rankingCfg;
        if (this.info instanceof icmsg.PiecesRankBrief) {
            let rewardType = ActUtil.getActRewardType(106);
            let c = ConfigManager.getItems(Pieces_rankingCfg);
            rewardType = Math.min(rewardType, c[c.length - 1].type);
            let cServerNum = ModelManager.get(PiecesModel).croServerNum;
            cServerNum = Math.min(cServerNum, c[c.length - 1].server);
            cfg = ConfigManager.getItem(Pieces_rankingCfg, (cfg: Pieces_rankingCfg) => {
                if (cfg.type == rewardType && cfg.server == cServerNum) {
                    if (cfg.rank[0] <= this.info.rank && cfg.rank[1] >= this.info.rank) {
                        return true;
                    }
                }
            });
        }
        else {
            cfg = this.info;
        }

        if (cfg) {
            this.content.removeAllChildren();
            cfg.rank_rewards.forEach(r => {
                let slot = cc.instantiate(this.slotPrefab);
                slot.parent = this.content;
                slot.setScale(.6);
                let ctrl = slot.getComponent(UiSlotItem);
                ctrl.updateItemInfo(r[0], r[1]);
                ctrl.itemInfo = {
                    series: null,
                    itemId: r[0],
                    itemNum: r[1],
                    type: BagUtils.getItemTypeById(r[0]),
                    extInfo: null
                }
            });
            this.scrollView.scrollToLeft();
        }
    }

    onClick() {
        if (!this.info || this.info instanceof Pieces_rankingCfg || this.info.brief.id == ModelManager.get(RoleModel).id) {
            return
        }
        let friendModel = ModelManager.get(FriendModel)
        let btns = [1, 0, 11]
        let friendIdList = friendModel.friendIdList
        let idList = friendModel.backIdList
        // // 判断添加屏蔽/取消屏蔽按钮
        if (idList[this.info.brief.id.toLocaleString()]) {
            btns.splice(1, 0, 5)
        } else {
            btns.splice(1, 0, 4)
        }
        // 非好友的情况下增加添加好友按钮
        if (!friendIdList[this.info.brief.id.toLocaleString()]) {
            btns.splice(1, 0, 2)
        }

        //非普通成员可 发出 公会邀请
        if (ModelManager.get(RoleModel).guildTitle != 0 && this.info.brief.guildId == 0) {
            btns.push(10)
        }

        GlobalUtil.openBtnMenu(this.node, btns, {
            id: this.info.brief.id,
            name: this.info.brief.name,
            headId: this.info.brief.head,
            headBgId: this.info.brief.headFrame,
            level: this.info.brief.level,
        })
    }
}
