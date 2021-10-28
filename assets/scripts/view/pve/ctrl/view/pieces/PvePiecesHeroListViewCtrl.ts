import ConfigManager from '../../../../../common/managers/ConfigManager';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import PiecesModel from '../../../../../common/models/PiecesModel';
import PiecesUtils from '../../../../pieces/utils/PiecesUtils';
import PvePiecesHeoDetailViewCtrl from './PvePiecesHeoDetailViewCtrl';
import { Hero_careerCfg, Pieces_heroCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { PiecesEventId } from '../../../../pieces/enum/PiecesEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-01 10:31:06 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesHeroListViewCtrl")
export default class PvePiecesHeroListViewCtrl extends gdk.BasePanel {
    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    heroPrefab: cc.Prefab = null;

    get piecesModel(): PiecesModel { return ModelManager.get(PiecesModel); }

    selectGroup: number = -1;
    selectCareer: number = -1;
    isShowCareer: boolean = false;
    list: ListView;
    onEnable() {
        this.selectGroupFunc(null, this.selectGroup);
        this.selectCareerFunc(null, this.selectCareer);
        this.updateContentState();
        gdk.e.on(PiecesEventId.PIECES_PVP_CAREER_CHANGE, this._updateScroll, this);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.e.targetOff(this);
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
            item_tpl: this.heroPrefab,
            cb_host: this,
            column: 4,
            gap_x: 30,
            gap_y: 20,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this);
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        this._initListView()
        let heroMap = [...PiecesUtils.getHeroListByType(0), ...PiecesUtils.getHeroListByType(1)];
        let datas = [];
        let typeIds = [];
        for (let i = 0; i < heroMap.length; i++) {
            let info = heroMap[i];
            if (typeIds.indexOf(info.typeId) == -1) {
                let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', info.typeId, { career_id: info.line }).career_type;
                if (this.selectCareer <= 0 || this.selectCareer == careerType) {
                    let cfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', info.typeId);
                    if (this.selectGroup <= 0 || cfg.group.indexOf(this.selectGroup) !== -1) {
                        datas.push(info);
                        typeIds.push(info.typeId);
                    }
                }
            }
        }
        this.list.clear_items();
        this.list.set_data(datas);
    }

    _selectItem(data: any, index) {
        gdk.panel.open(PanelId.PvePiecesHeroDetailView, (node: cc.Node) => {
            let ctrl = node.getComponent(PvePiecesHeoDetailViewCtrl);
            ctrl.initHeroInfo(data);
        }, this);
    }
}
