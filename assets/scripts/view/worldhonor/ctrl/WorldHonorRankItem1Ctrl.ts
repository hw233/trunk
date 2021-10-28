import ModelManager from '../../../common/managers/ModelManager';
import WorldHonorModel from '../../../common/models/WorldHonorModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import PanelId from '../../../configs/ids/PanelId';

/**
 * enemy世界巅峰赛比赛结果界面
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-06-29 11:49:19
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/worldhonor/WorldHonorRankItem1Ctrl")
export default class WorldHonorRankItem1Ctrl extends UiListItem {

    @property(cc.Node)
    state1: cc.Node = null;
    @property(cc.Node)
    state2: cc.Node = null;

    @property(cc.Node)
    playerIcon: cc.Node = null;
    @property(cc.Node)
    playerFrame: cc.Node = null;
    @property(cc.Node)
    playerFrameType: cc.Node = null;
    @property(cc.Label)
    playerLv: cc.Label = null;
    @property(cc.Label)
    playerName: cc.Label = null;
    @property(cc.Label)
    playerGuildName: cc.Label = null;
    @property(cc.Label)
    timeLb: cc.Label = null;
    @property(cc.Label)
    numLb: cc.Label = null;

    @property(cc.Node)
    rankIcon: cc.Node = null;
    @property(cc.Node)
    rankBg: cc.Node = null;
    @property(cc.Label)
    rankLb: cc.Label = null;
    @property(cc.Node)
    titleIcon: cc.Node = null;



    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];

    info: { rankInfo: icmsg.ArenaHonorRanking, rank: number, index: number };
    get model(): WorldHonorModel { return ModelManager.get(WorldHonorModel); }
    updateView() {
        this.info = this.data;
        let rank = this.info.rank;
        if (rank <= 3 && rank > 0) {
            this.rankBg.active = false;
            this.rankIcon.active = true;
            let path = this.rankSpriteName[rank - 1];
            GlobalUtil.setSpriteIcon(this.node, this.rankIcon, path);
        } else {
            this.rankBg.active = true;
            this.rankIcon.active = false;
            this.rankLb.string = rank <= 0 ? gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP2") : rank + '';
        }

        if (!this.info.rankInfo) {
            this.state1.active = false;
            this.state2.active = true;
            return
        }
        this.state1.active = true;
        this.state2.active = false;
        this.playerLv.string = this.info.rankInfo.brief.level + ''
        this.playerName.string = this.info.rankInfo.brief.name;
        if (this.info.rankInfo.guildName != '') {
            this.playerGuildName.string = `[S${GlobalUtil.getSeverIdByPlayerId(this.info.rankInfo.brief.id)}]` + this.info.rankInfo.guildName;
        } else {
            this.playerGuildName.string = '无工会'
        }
        let roleTitle = this.info.rankInfo.brief.title
        GlobalUtil.setSpriteIcon(this.node, this.playerIcon, GlobalUtil.getHeadIconById(this.info.rankInfo.brief.head));
        GlobalUtil.setSpriteIcon(this.node, this.playerFrame, GlobalUtil.getHeadFrameById(this.info.rankInfo.brief.headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.playerFrameType, GlobalUtil.getHeadTitleById(this.info.rankInfo.brief.title));
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(roleTitle));


        this.numLb.string = StringUtils.format('荣耀之巅: {0}次', this.info.rankInfo.count);
        let time = new Date(this.info.rankInfo.firstTime * 1000);
        let temStr = `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`;
        this.timeLb.string = StringUtils.format('首次达成: {0}', temStr)

    }

    headBtnClick() {
        if (this.info) {
            gdk.panel.setArgs(PanelId.MainSet, this.info.rankInfo.brief.id, 7)
            gdk.panel.open(PanelId.MainSet)
        }
    }
}
