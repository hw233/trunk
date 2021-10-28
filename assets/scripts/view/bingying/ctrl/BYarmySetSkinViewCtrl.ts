import BYarmySetSkinHeroItemCtrl from './BYarmySetSkinHeroItemCtrl';
import BYModel from '../model/BYModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import ResonatingModel from '../../resonating/model/ResonatingModel';
import SoldierModel from '../../../common/models/SoldierModel';
import { BYEventId } from '../enum/BYEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Soldier_army_skinCfg } from '../../../a/config';


/** 
 * @Description: 兵营-兵团精甲穿戴界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-12 14:28:18
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmySetSkinViewCtrl")
export default class BYarmySetSkinViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    heroItem: cc.Prefab = null;
    @property(sp.Skeleton)
    startSpine: sp.Skeleton = null;
    @property(cc.Node)
    bgNode: cc.Node = null;

    list: ListView;
    get byModel() { return ModelManager.get(BYModel); }
    get heroModel() { return ModelManager.get(HeroModel); }
    get resModel() { return ModelManager.get(ResonatingModel) }
    cfg: Soldier_army_skinCfg;
    setHeroIds: number[] = []
    onEnable() {
        this.bgNode.active = true;
        let arg = gdk.panel.getArgs(PanelId.BYarmySetSkinView)
        if (arg) {
            this.cfg = arg[0];
        }
        this._initListView()
        let heroIds = this.heroModel.PveUpHeroList.concat();
        this.resModel.Lower.forEach(data => {
            if (heroIds.indexOf(data.heroId) < 0) {
                heroIds.push(data.heroId)
            }
        })
        this.startSpine.node.active = false;
        let listDat = []
        heroIds.forEach(heroId => {
            let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
            if (heroInfo) {

                let temType = Math.floor(heroInfo.soldierId / 100)

                if (temType == this.cfg.type) {
                    let temState = 0; //0 未选择 1已选择 2选择其他
                    if (heroInfo.soldierSkin == this.cfg.skin_id) {
                        temState = 1;
                        if (this.setHeroIds.indexOf(heroInfo.heroId) < 0) {
                            this.setHeroIds.push(heroInfo.heroId);
                        }
                    } else if (heroInfo.soldierSkin > 0) {
                        temState = 2;
                    }
                    let tem = { heroInfo: heroInfo, state: temState }
                    listDat.push(tem);
                }
            }
        })

        this.list.set_data(listDat);

    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.heroItem,
                cb_host: this,
                column: 4,
                gap_x: 10,
                gap_y: 10,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
        this.list.onClick.on(this._selectItem, this);
    }

    _selectItem(data: any, index) {
        // if (this.curType == 2) {
        //     this.selectHero = data;
        //     let tem = this.list.items[index];
        //     let ctrl = tem.node.getComponent(PeakSelectHeroItemCtrl);
        //     ctrl.ifSelect = true;
        //     ctrl._itemSelect()
        // }
        if (data.state == 2) {
            //提示脱下
            GlobalUtil.openAskPanel({
                descText: gdk.i18n.t("i18n:BYARMY_TIP4"),
                sureCb: () => {
                    if (this.setHeroIds.indexOf(data.heroInfo.heroId) < 0) {
                        this.setHeroIds.push(data.heroInfo.heroId);
                    }
                    let tem = this.list.items[index];
                    let ctrl = tem.node.getComponent(BYarmySetSkinHeroItemCtrl);
                    ctrl.data.state = 1;
                    ctrl.updateView();
                }
            });

        } else {
            let tem = this.list.items[index];
            let ctrl = tem.node.getComponent(BYarmySetSkinHeroItemCtrl);
            if (data.state == 0) {
                ctrl.data.state = 1;
                if (this.setHeroIds.indexOf(data.heroInfo.heroId) < 0) {
                    this.setHeroIds.push(data.heroInfo.heroId);
                }
            } else {
                ctrl.data.state = 0;
                let index = this.setHeroIds.indexOf(data.heroInfo.heroId);
                if (index >= 0) {
                    this.setHeroIds.splice(index, 1);
                }
            }
            ctrl.updateView();
        }

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        };
        NetManager.targetOff(this)
        gdk.e.targetOff(this);
    }

    //穿戴按钮点击事件
    btnClick() {
        let heroData = []
        this.list.datas.forEach(data => {
            let tem = new icmsg.SoldierSkin();
            tem.heroId = data.heroInfo.heroId;
            if (this.setHeroIds.indexOf(data.heroInfo.heroId) >= 0) {
                tem.skinId = this.cfg.skin_id;
                heroData.push(tem);
            } else if (data.heroInfo.soldierSkin == this.cfg.skin_id) {
                tem.skinId = 0;
                heroData.push(tem);
            }
        })

        let msg = new icmsg.SoldierSkinOnReq()
        msg.heroes = heroData;

        NetManager.send(msg, (rsp: icmsg.SoldierSkinOnRsp) => {
            let have = false;
            rsp.heroes.some(data => {
                if (data.skinId > 0) {
                    have = true;
                    return true;
                }
            })
            //清空本地战斗数据缓存
            let model = ModelManager.get(HeroModel)
            //model.fightHeroIdxTower = {};
            //model.fightHeroIdx = {};
            //model.heroAttrs = {};
            let sModel = ModelManager.get(SoldierModel)
            let heroSoldiers = sModel.heroSoldiers
            rsp.heroes.forEach(heroData => {
                let heroAttr = HeroUtils.getHeroAttrById(heroData.heroId)
                if (heroAttr) {
                    delete model.heroAttrs[heroData.heroId]
                }
                let fightTData = model.fightHeroIdxTower[heroData.heroId];
                if (fightTData) {
                    delete model.fightHeroIdxTower[heroData.heroId]
                }
                let fightData = model.fightHeroIdx[heroData.heroId];
                if (fightData) {
                    delete model.fightHeroIdx[heroData.heroId]
                }

                let soldierData = heroSoldiers[heroData.heroId];
                if (soldierData) {
                    delete heroSoldiers[heroData.heroId]
                }
            })

            if (have) {
                //穿戴成功
                this.bgNode.active = false;
                this.startSpine.node.active = true;
                this.startSpine.loop = false;
                this.startSpine.setCompleteListener(() => {
                    this.startSpine.setCompleteListener(null);
                    this.startSpine.node.active = false;
                    if (!cc.isValid(this.node)) return;
                    this.close();
                });
                this.startSpine.setAnimation(0, "stand8", false);
            } else {
                this.close();
            }
            gdk.e.emit(BYEventId.BYARMY_SKIN_SETON)
        }, this)

    }
}
