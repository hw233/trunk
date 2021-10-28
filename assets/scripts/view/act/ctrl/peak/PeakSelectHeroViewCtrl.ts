import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../model/PeakModel';
import PeakSelectHeroItemCtrl from './PeakSelectHeroItemCtrl';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { ActivityEventId } from '../../enum/ActivityEventId';
import {
    Hero_careerCfg,
    Peak_gradeCfg,
    Peak_pool_groupCfg,
    Peak_poolCfg
    } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


/**
 * @Description: 巅峰之战搜索界面
 * @Author: yaozu.hu
 * @Date: 2021-02-23 14:16:01
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-24 16:53:51
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakSelectHeroViewCtrl")
export default class PeakSelectHeroViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.RichText)
    des: cc.RichText = null;

    @property(cc.Node)
    type1Node: cc.Node = null;
    @property(cc.Node)
    type2Node: cc.Node = null;

    @property(cc.Node)
    sure1Node: cc.Node = null;
    @property(cc.Node)
    sure2Node: cc.Node = null;

    @property(UiTabMenuCtrl)
    careerMenu: UiTabMenuCtrl = null;

    curType: number = 0;// 0随机 1自选职业 2自选英雄
    selectIndex = -1;

    carerrType: number = 1;

    list: ListView;
    gradeCfg: Peak_gradeCfg;
    poolCfg: Peak_poolCfg;
    get model(): PeakModel { return ModelManager.get(PeakModel); }

    selectHero: { cfg: Peak_pool_groupCfg, isGray: 0 | 1 }

    onEnable() {
        let args = gdk.panel.getArgs(PanelId.PeakSelectHeroView)
        let division = args ? args[0] : 2;
        this.gradeCfg = ConfigManager.getItemByField(Peak_gradeCfg, 'grade', division);
        this.poolCfg = ConfigManager.getItemByField(Peak_poolCfg, 'hero_reward_id', this.gradeCfg.hero);
        this.curType = this.poolCfg.optional;
        this.selectIndex = this.curType == 2 ? 0 : -1;
        this.des.string = this.gradeCfg.desc;

        if (this.curType == 1) {
            this.carerrType = 1;
            this.careerMenu.selectIdx = 0;
            this.type1Node.active = true;
            this.type2Node.active = false
        } else {
            this.type1Node.active = false;
            this.type2Node.active = true;
            this.sure1Node.active = this.curType == 0;
            this.sure2Node.active = this.curType == 2;
        }
        this._updateView()
    }
    onDisable() {
        gdk.Timer.clearAll(this);
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 3,
                gap_x: 10,
                gap_y: 10,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
        this.list.onClick.on(this._selectItem, this);
    }

    _updateView(resetPos: boolean = true) {
        this._initListView();
        let listData = [];
        this.poolCfg.pool.forEach(pool => {
            let poolGroupCfgs = ConfigManager.getItemsByField(Peak_pool_groupCfg, 'group_id', pool[pool.length - 1]);
            poolGroupCfgs.forEach(cfg => {
                let isGray: 0 | 1 = 0;
                let isType = true;
                if (this.curType == 1) {
                    if (cfg.career_id != 0) {
                        isGray = cfg.career_id == this.carerrType ? 0 : 1;
                        isType = cfg.career_id == this.carerrType;
                    } else {
                        let temCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', cfg.item_id, { 'line': 0 })
                        isGray = this.carerrType == temCareerCfg.career_type ? 0 : 1;//temCareerCfg.career_type
                        isType = this.carerrType == temCareerCfg.career_type;
                    }
                }
                //自己拥有的英雄置灰
                this.model.peakStateInfo.heroes.forEach(data => {
                    if (data.typeId == cfg.item_id) {
                        isGray = 1
                    }
                })
                let temData = { cfg: cfg, isGray: isGray, curType: this.curType };
                if (isType) {
                    listData.push(temData);
                }
            })
        })

        this.list.clear_items()
        this.list.set_data(listData, resetPos);
        if (this.curType == 2) {
            this.curIndex = 0;
            listData.some((data, idx) => {
                if (!data.isGray) {
                    this.curIndex = idx
                    return true
                }
            })
            gdk.Timer.once(30, this, () => {
                let tem = this.list.items[this.curIndex];
                this.list.select_item(this.curIndex);
                let ctrl = tem.node.getComponent(PeakSelectHeroItemCtrl);
                this._selectItem(ctrl.data, this.curIndex)
            })
        }


    }

    curIndex: number = 0;

    _selectItem(data: any, index) {
        if (this.curType == 2) {
            if (data.isGray) {
                // let tem = this.list.items[this.curIndex];
                // let ctrl = tem.node.getComponent(PeakSelectHeroItemCtrl);
                // ctrl.ifSelect = true;
                // ctrl._itemSelect()
                gdk.Timer.once(80, this, () => {
                    this.list.select_item(this.curIndex);
                })
                gdk.gui.showMessage(gdk.i18n.t("i18n:PEAK_TIP15"))
                return;
            }
            this.selectHero = data;
            this.curIndex = index;
            let tem = this.list.items[index];
            let ctrl = tem.node.getComponent(PeakSelectHeroItemCtrl);
            ctrl.ifSelect = true;
            ctrl._itemSelect()
        }

    }

    pageSelect(event, index, refresh: boolean = false) {

        let temType = 1;
        if (index == 0) {
            temType = 1;
        } else if (index == 1) {
            temType = 3;
        } else if (index == 2) {
            temType = 4;
        }
        if (this.carerrType == temType) return;
        this.carerrType = temType
        this._updateView()
    }


    sureBtnClick(event: cc.Event, idx: string) {
        let req = new icmsg.PeakRewardReq();
        let index = parseInt(idx);
        req.grade = this.gradeCfg.grade
        if (index == 0) {
            //自选职业
            req.career = this.carerrType;
        } else if (index == 1) {
            //随机
            //req.grade = this.gradeCfg.grade
        } else if (index == 2) {
            //自选英雄
            //req.grade = this.gradeCfg.grade
            req.heroId = this.selectHero.cfg.item_id
        }

        GlobalUtil.openAskPanel({
            descText: this.gradeCfg.desc1,
            sureCb: () => {
                NetManager.send(req, (rsp: icmsg.PeakRewardRsp) => {
                    this.model.peakStateInfo.gradeHero = rsp.gradeHero;
                    this.model.peakStateInfo.gradeReward = rsp.gradeReward;
                    let tem = this.model.peakStateInfo.heroes.concat(rsp.heroes);
                    this.model.peakStateInfo.heroes = tem
                    let temData = []
                    //temData = rsp.list;
                    rsp.heroes.forEach(data => {
                        let tem = new icmsg.GoodsInfo()
                        tem.typeId = data.typeId;
                        tem.num = 1;
                        temData.push(tem);
                    })
                    GlobalUtil.openRewadrView(temData);
                    gdk.e.emit(ActivityEventId.ACTIVITY_PEAK_RANK_REWARD_UPDATE);
                    this.close();
                }, this);
            }
        });

    }

}
