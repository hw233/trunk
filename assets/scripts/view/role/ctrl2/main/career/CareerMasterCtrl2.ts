import ConfigManager from '../../../../../common/managers/ConfigManager';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import { Hero_careerCfg, HeroCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';


/**
 * @Description: 职业转职-确认窗口
 * @Author: weiliang.huang
 * @Date: 2019-04-28 17:52:37
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 11:43:20
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/CareerMasterCtrl2")
export default class CareerMasterCtrl2 extends gdk.BasePanel {

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Prefab)
    masterItemPre: cc.Prefab = null

    list: ListView = null

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    start() {

    }

    onEnable() {
        this._initListView()
        let heroInfo = this.heroModel.curHeroInfo
        this._updateInfo(heroInfo)


    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.masterItemPre,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    _updateInfo(heroInfo: icmsg.HeroInfo) {
        let cfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId)
        //所有职业
        let ids = HeroUtils.getHeroAllCareersById(heroInfo.typeId)

        let dataList = []
        let index = 0
        for (let i = 0; i < ids.length; i++) {
            let maxLv = HeroUtils.getJobMaxLv(ids[i])
            let lv = HeroUtils.getHeroJobLv(heroInfo.heroId, ids[i])
            if (lv >= maxLv) {
                index = i
            }
            //最高级的配置 精通
            let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", ids[i], { career_lv: maxLv })
            dataList.push({ heroId: heroInfo.heroId, careerCfg: careerCfg })
        }
        this.list.set_data(dataList)
        this.list.scroll_to(index)
    }

}
