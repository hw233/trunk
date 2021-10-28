import ModelManager from "../../../common/managers/ModelManager";
import WorldHonorModel from "../../../common/models/WorldHonorModel";
import GlobalUtil from "../../../common/utils/GlobalUtil";
import UiListItem from "../../../common/widgets/UiListItem";
import PanelId from "../../../configs/ids/PanelId";


/**
 * enemy世界巅峰榜Item
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-21 11:06:46
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/worldhonor/WorldHonorRankItem2Ctrl")
export default class WorldHonorRankItem2Ctrl extends UiListItem {

    @property(cc.Node)
    bgSp: cc.Node = null;
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

    @property(cc.Node)
    rankIcon: cc.Node = null;
    @property(cc.Node)
    rankBg: cc.Node = null;
    @property(cc.Label)
    rankLb: cc.Label = null;
    @property(cc.Label)
    powerLb: cc.Label = null;
    @property(cc.Node)
    titleIcon: cc.Node = null;


    bgStr: string[] = ['gh_judianxiangqingdi', 'gh_chengyuandi'];
    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];

    info: { playerInfo: icmsg.RoleBrief, rank: number, index: number, guildName: string };
    get model(): WorldHonorModel { return ModelManager.get(WorldHonorModel); }
    updateView() {
        this.info = this.data;
        let bgPath = 'view/worldhonor/texture/' + (this.info.index > 63 ? this.bgStr[1] : this.bgStr[0]);
        GlobalUtil.setSpriteIcon(this.node, this.bgSp, bgPath);

        this.playerLv.string = this.info.playerInfo.level + ''
        this.playerName.string = this.info.playerInfo.name;
        if (this.info.guildName != '') {
            this.playerGuildName.string = `[S${GlobalUtil.getSeverIdByPlayerId(this.info.playerInfo.id)}]` + this.info.guildName;
        } else {
            this.playerGuildName.string = '无工会'
        }
        let roleTitle = this.info.playerInfo.title
        GlobalUtil.setSpriteIcon(this.node, this.playerIcon, GlobalUtil.getHeadIconById(this.info.playerInfo.head));
        GlobalUtil.setSpriteIcon(this.node, this.playerFrame, GlobalUtil.getHeadFrameById(this.info.playerInfo.headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.playerFrameType, GlobalUtil.getHeadTitleById(this.info.playerInfo.title));
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(roleTitle));
        this.powerLb.string = this.info.playerInfo.power + '';

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

    }


    headBtnClick() {
        if (this.info) {
            gdk.panel.setArgs(PanelId.MainSet, this.info.playerInfo.id, 7)
            gdk.panel.open(PanelId.MainSet)
        }
    }

}
