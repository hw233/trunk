import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import PanelId from '../../../configs/ids/PanelId';
import UiListItem from '../../../common/widgets/UiListItem';


/** 
 * 回放列表项
 * @Author: sthoo.huang  
 * @Date: 2020-05-13 21:38:43 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:33:45
 */const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/replay/ReplayItem')
export default class ReplayItem extends UiListItem {

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Label)
    powerLb: cc.Label = null;

    @property(gdk.List)
    heroIconList: gdk.List = null;

    @property(cc.Prefab)
    heroIconPre: cc.Prefab = null;

    info: icmsg.FightBrief = null;

    updateView() {
        this.info = this.data;
        this.playerName.string = this.info.playerName;
        this.powerLb.string = this.info.playerPower.toString();
        // 英雄列表
        let arr: icmsg.FightBriefHero[] = [...this.info.heroes];
        // 英雄先按自己是否拥有，再按等级排序（高至低）
        GlobalUtil.sortArray(arr, (a, b) => {
            if (!!HeroUtils.getHeroItemById(a.typeId)) {
                return -1;
            }
            if (!!HeroUtils.getHeroItemById(b.typeId)) {
                return 1;
            }
            return b.level - a.level;
        });
        this.heroIconList.datas = arr;
    }

    playRecord() {
        JumpUtils.replayFight(this.info.fightId, null, this.info);
        gdk.panel.hide(gdk.Tool.getResIdByNode(this.node));
        //隐藏关卡地图
        gdk.panel.isOpenOrOpening(PanelId.CityMapView) && gdk.panel.hide(PanelId.CityMapView);
        gdk.panel.isOpenOrOpening(PanelId.EnterStageView) && gdk.panel.hide(PanelId.EnterStageView);
    }
}