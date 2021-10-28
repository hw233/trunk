import ChampionModel from '../model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import UiListItem from '../../../common/widgets/UiListItem';
import { Champion_divisionCfg, Champion_dropCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-23 14:26:29 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionGradeRewardItemCtrl")
export default class ChampionGradeRewardItemCtrl extends UiListItem {
    @property(cc.Sprite)
    gradeIcon: cc.Sprite = null;

    @property(cc.Label)
    gradeName: cc.Label = null

    // @property(cc.ScrollView)
    // scrollView: cc.ScrollView = null;

    // @property(cc.Node)
    // content: cc.Node = null;

    // @property(cc.Prefab)
    // slotPrefab: cc.Prefab = null;

    @property(gdk.List)
    rewardList: gdk.List = null;


    updateView() {

        let cfg: Champion_dropCfg = this.data;
        let curCfg = ConfigManager.getItemByField(Champion_divisionCfg, 'lv', cfg.lv);
        this.gradeName.string = curCfg.name;
        let path1 = 'view/champion/texture/champion/jbs_duanwei0' + curCfg.division;
        GlobalUtil.setSpriteIcon(this.node, this.gradeIcon, path1);
        let championModel = ModelManager.get(ChampionModel)
        let infoData = championModel.infoData;
        let data = []
        let temState = 0;
        if (cfg.lv <= infoData.lvRewarded) {
            temState = 1;
        }
        cfg.drop_division.forEach(item => {
            let temData = [item[0], item[1], temState]
            data.push(temData);
        })
        this.rewardList.datas = data
    }
}
