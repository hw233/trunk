import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import PanelId from '../../../configs/ids/PanelId';
import RoyalArenaRankHeroItemCtrl from './RoyalArenaRankHeroItemCtrl';
import UiListItem from '../../../common/widgets/UiListItem';
import { Royal_divisionCfg, Royal_sceneCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaRankItemCtrl")
export default class RoyalArenaRankItemCtrl extends UiListItem {
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Sprite)
    frameIcon: cc.Sprite = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Sprite)
    rankIcon: cc.Sprite = null;

    @property(cc.Sprite)
    rankSprite: cc.Sprite = null;

    @property(cc.Label)
    rankLabel: cc.Label = null;

    @property(cc.Node)
    selectImg: cc.Node = null;

    @property(cc.Node)
    heroList: cc.Node = null;

    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    @property(cc.Node)
    mapIcon: cc.Node[] = [];

    @property(cc.Label)
    mapName: cc.Label[] = [];

    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];

    _info: icmsg.RoyalBrief
    heroListData: icmsg.HeroBrief[] = [];

    updateView() {
        this._info = this.data
        let value = this._info.score;
        let rank = this.curIndex + 1;
        let division = this._info.div;
        this.heroListData = this._info.heroes
        this.nameLabel.string = this._info.brief.name;
        this.lvLabel.string = '.' + this._info.brief.level;
        //this.powerLabel.string = d.power + '';
        this.scoreLabel.string = value + ''//value > 10000 ? (value / 10000).toFixed(1) + gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP1") : value + '';//GlobalUtil.numberToStr(value, false);
        GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(this._info.brief.head));
        GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(this._info.brief.headFrame));
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

        //设置段位图标
        let curCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', division);
        let path2 = 'view/act/texture/peak/' + curCfg.icon;
        GlobalUtil.setSpriteIcon(this.node, this.rankIcon, path2)

        this.heroList.removeAllChildren();
        for (let i = 0; i < 9; i++) {
            let heroInfo = this.heroListData[i]
            let node = cc.instantiate(this.heroItem);
            let ctrl = node.getComponent(RoyalArenaRankHeroItemCtrl)
            if (heroInfo && heroInfo.typeId > 0) {
                ctrl.updateView(heroInfo, this._info.brief.id)
            } else {
                ctrl.updateNullHero()
            }
            node.setParent(this.heroList);
        }

        let maps = this._info.maps
        for (let i = 0; i < maps.length; i++) {
            let s_cfg = ConfigManager.getItemById(Royal_sceneCfg, maps[i])
            let path = ""
            if (s_cfg) {
                path = `view/royalArena/texture/map/${s_cfg.thumbnail}`
            }
            GlobalUtil.setSpriteIcon(this.node, this.mapIcon[i], path)
            this.mapName[i].string = `${s_cfg.scene_name}`
        }
    }


    onHeadClick() {
        gdk.panel.setArgs(PanelId.MainSet, this._info.brief.id)
        gdk.panel.open(PanelId.MainSet)
    }

}