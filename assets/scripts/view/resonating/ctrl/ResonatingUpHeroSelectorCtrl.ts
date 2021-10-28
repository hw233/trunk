import { HeroCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { BagItem } from '../../../common/models/BagModel';
import HeroModel from '../../../common/models/HeroModel';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import PanelId from '../../../configs/ids/PanelId';
import HeroLockTipsCtrl from '../../role/ctrl2/main/common/HeroLockTipsCtrl';
import { ResonatingEventId } from '../enum/ResonatingEventId';
import ResonatingModel from '../model/ResonatingModel';
import ResonatingUtils from '../utils/ResonatingUtils';

/** 
 * @Description: 永恒水晶选择英雄界面
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-24 10:10:44
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class ResonatingUpHeroSelectorViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    heroItemPre: cc.Prefab = null;


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

    selectData: any = null;
    curIndex: number = 0;
    inSendMsg: boolean = false;
    get model() { return ModelManager.get(ResonatingModel); }
    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

    onEnable() {
        let arg = gdk.panel.getArgs(PanelId.ResonatingSelectView)
        this.curIndex = arg[0]
        this.inSendMsg = false;
        this.selectGroupFunc(null, 0);
        this.selectCareerFunc(null, 0);
        this.updateContentState();
    }

    onDisable() {
        gdk.Timer.clearAll(this);
        gdk.e.targetOff(this);
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        NetManager.targetOff(this)
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

    _updateScroll() {
        this._initListView()

        let datas = this.heroModel.heroInfos.concat();
        let tempList: BagItem[] = [];
        if (this.selectGroup != 0) {
            //英雄阵营数据
            for (let i = 0; i < datas.length; i++) {
                let heroCfg = ConfigManager.getItemById(HeroCfg, datas[i].itemId);
                if (heroCfg.group.indexOf(this.selectGroup) != -1) {
                    tempList.push(datas[i])
                }
            }
        }
        else {
            tempList = datas
        }

        //全职业
        if (this.selectCareer != 0) {
            //英雄职业数据
            let groupDatas = []
            for (let i = 0; i < tempList.length; i++) {
                //let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", (<HeroInfo>tempList[i].extInfo).careerId)
                let type = Math.floor((<icmsg.HeroInfo>tempList[i].extInfo).soldierId / 100);
                if (type == this.selectCareer) {
                    groupDatas.push(tempList[i])
                }
            }
            tempList = groupDatas
        }
        tempList.sort(this.sortFunc1)

        //排除共鸣水晶中的英雄
        let upHeroId = [];
        this.model.Upper.forEach(heroId => {
            if (upHeroId.indexOf(heroId) < 0) {
                upHeroId.push(heroId);
            }
        })
        this.model.Lower.forEach(data => {
            if (upHeroId.indexOf(data.heroId) < 0 && data.heroId > 0) {
                upHeroId.push(data.heroId);
            }
        })

        let scorllData = [];
        tempList.forEach(info => {
            let temHeroInfo = <icmsg.HeroInfo>info.extInfo
            let cfg = ConfigManager.getItemById(HeroCfg, temHeroInfo.typeId);
            if (upHeroId.indexOf(temHeroInfo.heroId) < 0 && cfg.group[0] !== 6) {
                scorllData.push(temHeroInfo)
            }
        })
        this.list.clear_items();
        this.list.set_data(scorllData)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItemPre,
            cb_host: this,
            column: 4,
            gap_x: 30,
            gap_y: 30,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this);
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _selectItem(data: any, index) {
        if (ResonatingUtils.isHeroInAssistAllianceList(data.heroId)) {
            gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
                let ctrl = node.getComponent(HeroLockTipsCtrl);
                ctrl.initArgs(data.heroId, [0, 9, 10, 11, 12]);
            });
            this.selectData = null;
        } else {
            this.selectData = data;
        }
    }

    upHeroBtnClick() {
        if (this.selectData && !this.inSendMsg) {
            this.inSendMsg = true
            let msg = new icmsg.ResonatingPutOnReq()
            msg.gridId = this.curIndex
            msg.heroId = this.selectData.heroId;
            this.heroModel.curHeroInfo = this.selectData;
            NetManager.send(msg, (resp: icmsg.ResonatingPutOnRsp) => {
                this.model.Lower[resp.gridId] = resp.grid;
                gdk.e.emit(ResonatingEventId.RESONATING_DATA_UPDATA);

                //更新英雄数据
                let msg = new icmsg.HeroInfoReq()
                msg.heroIds = [this.selectData.heroId];
                NetManager.send(msg, () => {
                    gdk.panel.setArgs(PanelId.ResonatingUpHeroTip, resp.grid)
                    gdk.panel.open(PanelId.ResonatingUpHeroTip)
                    this.close()
                }, this)

                // let temMsg = new icmsg.HeroListReq()
                // NetManager.send(temMsg, () => {
                //     gdk.panel.setArgs(PanelId.ResonatingUpHeroTip, resp.grid)
                //     gdk.panel.open(PanelId.ResonatingUpHeroTip)
                //     this.close()
                // }, this)

            }, this)
        }

    }

    sortFunc1(a: any, b: any) {
        let heroInfoA = <icmsg.HeroInfo>a.extInfo;
        let heroInfoB = <icmsg.HeroInfo>b.extInfo;
        if (heroInfoA.level == heroInfoB.level) {
            if (heroInfoA.color == heroInfoB.color) {
                if (heroInfoA.star == heroInfoB.star) {
                    if (heroInfoA.power == heroInfoB.power) {
                        return heroInfoB.level - heroInfoA.level;
                    }
                    else {
                        return heroInfoB.power - heroInfoA.power;
                    }
                } else {
                    return heroInfoB.star - heroInfoA.star;
                }
            } else {
                return heroInfoB.color - heroInfoA.color;
            }
        } else {
            return heroInfoB.level - heroInfoA.level;
        }

    }

}
