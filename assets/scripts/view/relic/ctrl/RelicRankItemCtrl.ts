import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildUtils from '../../guild/utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import ServerModel from '../../../common/models/ServerModel';
import UiListItem from '../../../common/widgets/UiListItem';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-05 10:43:09 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicRankItemCtrl")
export default class RelicRankItemCtrl extends UiListItem {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

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

    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];
    updateView() {
        let info = this.data;
        this.updateItem(info);
    }

    async updateItem(d: icmsg.RelicRankGuild) {
        this.serverLab.string = `[S${GlobalUtil.getSeverIdByGuildId(d.id)}]${ModelManager.get(ServerModel).serverNameMap[Math.floor(d.id / 10000)]}`;
        this.nameLabel.string = d.name;
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(d.icon))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(d.frame))
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(d.bottom))
        this.scoreLabel.string = d.score + '';
        if (this.curIndex < 3) {
            this.rankLab.node.active = false;
            this.noRank.active = false;
            this.rankSprite.active = true;
            let path = this.rankSpriteName[this.curIndex];
            GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
        }
        else {
            this.rankLab.node.active = true;
            this.noRank.active = false;
            this.rankSprite.active = false;
            this.rankLab.string = this.curIndex + 1 + '';
        }
    }

    clickFunc() {
        gdk.panel.setArgs(PanelId.GuildJoin, this.data.id, true)
        gdk.panel.open(PanelId.GuildJoin)
    }
}
