import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-10 17:36:44 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdventureRankItem2Ctrl")
export default class AdventureRankItem2Ctrl extends UiListItem {
    @property(cc.Node)
    rankSprite: cc.Node = null;

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.Node)
    noRank: cc.Node = null;

    @property(cc.Label)
    serverLab: cc.Label = null;

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

    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    updateView() {
        let info = this.data;
        this.updateItem(info);
    }

    updateItem(d: icmsg.Adventure2RankBrief) {
        this.serverLab.string = `[s${GlobalUtil.getSeverIdByPlayerId(d.brief.id)}]`
        this.nameLabel.string = d.brief.name;
        this.lvLabel.string = '.' + d.brief.level;
        this.scoreLabel.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP13")}${d.layerId}-${d.plateIndex}`;
        this.scoreLabel.node.active = this.curIndex >= 0
        GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(d.brief.head));
        GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(d.brief.headFrame));
        if (0 <= this.curIndex && this.curIndex < 3) {
            this.rankLab.node.active = false;
            this.noRank.active = false;
            this.rankSprite.active = true;
            let path = this.rankSpriteName[this.curIndex];
            GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
        }
        else {
            this.rankLab.node.active = this.curIndex > 0;
            this.noRank.active = this.curIndex < 0;
            this.rankSprite.active = false;
            this.rankLab.string = this.curIndex > 0 ? this.curIndex + 1 + '' : '';
        }

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(d.brief.vipExp))
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
