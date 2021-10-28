import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakHeroDetailViewCtrl from './PeakHeroDetailViewCtrl';
import PeakModel from '../../model/PeakModel';
import RoleModel from '../../../../common/models/RoleModel';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { HeroCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


/** 
 * @Description: 角色英雄面板-选择面板
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-03 17:27:49
 */


const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("qszc/view/peak/PeakHeroListViewCtrl")
export default class PeakHeroListViewCtrl extends gdk.BasePanel {


    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false
    tempList: icmsg.PeakHero[] = []; //所有英雄的临时数据(区分后的)
    datas: icmsg.PeakHero[] = []; //所有英雄的临时数据

    get peakModel(): PeakModel { return ModelManager.get(PeakModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    onEnable() {
        this.datas = this.peakModel.peakStateInfo.heroes.concat();

        this.selectGroupFunc(null, 0);
        this.selectCareerFunc(null, 0);
        this.updateContentState();
        gdk.e.on(ActivityEventId.ACTIVITY_PEAK_CHANGE_CAREER_UPDATE, this._updateDataLater, this)
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
        gdk.e.off(ActivityEventId.ACTIVITY_PEAK_CHANGE_CAREER_UPDATE, this._updateDataLater, this)
    }

    showCareerContent() {
        this.isShowCareer = true
        this.updateContentState()
    }

    hideCareerContent() {
        this.isShowCareer = false
        this.updateContentState()
    }

    updateContentState() {
        if (this.isShowCareer) {
            this.contentCareer.active = true
            this.btnUp.active = false
        } else {
            this.contentCareer.active = false
            this.btnUp.active = true
        }
    }
    /**选择页签, 筛选职业*/
    selectCareerFunc(e, utype) {
        this.selectCareer = parseInt(utype)
        for (let idx = 0; idx < this.careerBtns.length; idx++) {
            const element = this.careerBtns[idx];
            element.interactable = idx != this.selectCareer
            let select = element.node.getChildByName("select")
            select.active = idx == this.selectCareer
        }
        this._updateScroll()
    }

    /**选择页签, 筛选阵营*/
    selectGroupFunc(e, utype) {
        this.selectGroup = parseInt(utype)
        for (let idx = 0; idx < this.groupBtns.length; idx++) {
            const element = this.groupBtns[idx];
            let nodeName = element.name
            let group = parseInt(nodeName.substring('group'.length));
            element.interactable = group != this.selectGroup
            let select = element.node.getChildByName("select")
            select.active = group == this.selectGroup
        }
        this._updateScroll()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItem,
            cb_host: this,
            column: 4,
            gap_x: 35,
            gap_y: 25,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this);
    }

    _selectItem(data: any, index) {

        let info: icmsg.PeakHero = data.heroData;
        //打开英雄详情
        gdk.panel.setArgs(PanelId.PeakHeroDetailView, 1, this.roleModel.id);
        gdk.panel.open(PanelId.PeakHeroDetailView, (node: cc.Node) => {
            let comp = node.getComponent(PeakHeroDetailViewCtrl)
            comp.initHeroInfo(info.typeId, info.careerType, info.careerId)
        })

    }
    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        this._initListView()

        this.tempList = [];
        if (this.selectGroup != 0) {
            //英雄阵营数据
            for (let i = 0; i < this.datas.length; i++) {
                let heroCfg = ConfigManager.getItemById(HeroCfg, this.datas[i].typeId);
                if (heroCfg.group.indexOf(this.selectGroup) != -1) {
                    this.tempList.push(this.datas[i])
                }
            }
        }
        else {
            this.tempList = this.datas
        }

        //全职业
        if (this.selectCareer != 0) {
            //英雄职业数据
            let groupDatas = []
            for (let i = 0; i < this.tempList.length; i++) {
                //let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", (<HeroInfo>this.tempList[i].extInfo).careerId)
                let type = this.tempList[i].careerType//Math.floor(this.tempList[i].soldierId / 100);
                if (type == this.selectCareer) {
                    groupDatas.push(this.tempList[i])
                }
            }
            this.tempList = groupDatas
        }

        this.list.clear_items();
        let scollData = []
        this.tempList.forEach(info => {
            scollData.push({ heroData: info, isSelect: false, isHero: false })
        })
        this.list.set_data(scollData);

    }
}
