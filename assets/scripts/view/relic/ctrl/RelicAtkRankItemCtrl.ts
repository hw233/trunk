import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import ServerModel from '../../../common/models/ServerModel';
import UiListItem from '../../../common/widgets/UiListItem';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-20 15:16:09 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicAtkRankItemCtrl")
export default class RelicAtkRankItemCtrl extends UiListItem {
    @property(cc.Node)
    iconBg: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null;

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
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];
    updateView() {
        this._refreshView(this.data);
    }

    _refreshView(d: icmsg.RelicRankPlayer) {
        this.serverLab.string = `[S${GlobalUtil.getSeverIdByPlayerId(d.brief.id)}]${ModelManager.get(ServerModel).serverNameMap[Math.floor(d.brief.id / 100000)]}`;
        this.nameLabel.string = d.brief.name;
        GlobalUtil.setSpriteIcon(this.node, this.iconBg, GlobalUtil.getHeadFrameById(d.brief.headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(d.brief.head));
        this.lvLab.string = `.${d.brief.level}`;
        this.powerLab.string = d.brief.power + '';
        this.scoreLabel.string = d.score + '';
        if (this.curIndex >= 0 && this.curIndex < 3) {
            this.rankLab.node.active = false;
            this.noRank.active = false;
            this.rankSprite.active = true;
            let path = this.rankSpriteName[this.curIndex];
            GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
        }
        else {
            this.rankSprite.active = false;
            this.rankLab.node.active = this.curIndex > 0;
            this.noRank.active = this.curIndex < 0;
            this.rankLab.string = this.curIndex + 1 + '';
        }
    }

    clickFunc() {
        gdk.panel.setArgs(PanelId.MainSet, this.data.brief.id);
        gdk.panel.open(PanelId.MainSet);
    }
}
