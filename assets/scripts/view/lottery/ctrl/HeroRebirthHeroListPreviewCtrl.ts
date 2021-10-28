

import { HeroCfg, Hero_rebirth_heroCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import { ListView, ListViewDir } from "../../../common/widgets/UiListview";
import ActUtil from "../../act/util/ActUtil";


/** 
 * @Description: 重生英雄预览界面
 * @Author: yaozu.hu
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-25 17:03:41
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroRebirthHeroListPreViewCtrl")
export default class HeroRebirthHeroListPreViewCtrl extends gdk.BasePanel {

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

    tempList: { cfg: HeroCfg, star: number }[] = []; //所有英雄的临时数据(区分后的)
    datas: { cfg: HeroCfg, star: number }[] = []; //所有英雄的临时数据
    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false
    actId: number = 121;
    onEnable() {

        let actType = ActUtil.getActRewardType(this.actId);
        let cfg: Hero_rebirth_heroCfg;
        if (!actType) {
            let tem = ConfigManager.getItems(Hero_rebirth_heroCfg)
            cfg = tem[tem.length - 1];
        } else {
            cfg = ConfigManager.getItemByField(Hero_rebirth_heroCfg, 'type', actType)
        }
        this.datas = []
        cfg.star.forEach(hero => {
            let temCfg = ConfigManager.getItemById(HeroCfg, hero[0]);
            if (temCfg) {
                let tem = { cfg: temCfg, star: hero[1] }
                this.datas.push(tem);
            }
        })

        this.selectGroupFunc(null, 0)
        this.selectCareerFunc(null, 0)
        this.updateContentState()
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
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

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        this._initListView()

        this.tempList = [];
        if (this.selectGroup != 0) {
            //英雄阵营数据
            for (let i = 0; i < this.datas.length; i++) {
                let tem = this.datas[i]
                if (tem.cfg.group.indexOf(this.selectGroup) != -1) {
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
                let tem = this.tempList[i]
                let type = Math.floor(tem.cfg.soldier_id[0] / 100);
                if (type == this.selectCareer) {
                    groupDatas.push(this.tempList[i])
                }
            }
            this.tempList = groupDatas
        }
        this.list.clear_items();
        this.list.set_data(this.tempList);

    }

    _selectItem(data: any, idx: number, preData, preIdx) {
        let heroInfo = data

    }

}
