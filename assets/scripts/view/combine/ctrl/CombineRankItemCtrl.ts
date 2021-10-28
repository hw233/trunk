import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import ServerModel from '../../../common/models/ServerModel';
import UiListItem from '../../../common/widgets/UiListItem';

/**
 * @Description: 合服狂欢 合服排行
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-09 20:19:28
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/CombineRankItemCtrl")
export default class CombineRankItemCtrl extends UiListItem {

    @property(cc.Node)
    rankSprite: cc.Node = null;

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.Node)
    noRank: cc.Node = null;

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    headFrame: cc.Node = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

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

    async updateItem(d: icmsg.RankBrief) {
        //await ModelManager.get(ServerModel).reqServerNameByIds([d.brief.id]);
        this.serverLab.string = `[s${GlobalUtil.getSeverIdByPlayerId(d.brief.id)}]${ModelManager.get(ServerModel).serverNameMap[Math.floor(d.brief.id / 100000)]} `
        this.nameLabel.string = d.brief.name
        this.scoreLabel.string = `${d.value}`
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(d.brief.head));
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(d.brief.headFrame));
        this.lvLabel.string = `${d.brief.level}`

        if (d.value == 0) {
            this.noRank.active = true;
            this.rankLab.node.active = false;
            this.rankSprite.active = false;
            this.rankLab.string = ``;
            return
        }

        if (this.curIndex < 3) {
            if (this.curIndex < 0) {
                this.noRank.active = true
                this.rankLab.node.active = false
                this.rankSprite.active = false
                return
            }
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
}
