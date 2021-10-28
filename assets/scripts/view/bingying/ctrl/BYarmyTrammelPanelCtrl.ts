import BYarmyTrammelPageItemCtrl from './BYarmyTrammelPageItemCtrl';
import BYModel from '../model/BYModel';
import BYUtils from '../utils/BYUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import SoldierModel from '../../../common/models/SoldierModel';
import StringUtils from '../../../common/utils/StringUtils';
import UIScrollSelect from '../../lottery/ctrl/UIScrollSelect';
import {
    BarracksCfg,
    Soldier_army_skinCfg,
    Soldier_army_trammelCfg,
    SoldierCfg
    } from '../../../a/config';

/** 
 * @Description: 兵营-兵团精甲穿戴界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-08 20:03:27
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmyTrammelPanelCtrl")
export default class BYarmyTrammelPanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    pageContent: cc.Node = null;

    @property(cc.Prefab)
    pagePrefab: cc.Prefab = null;

    @property(cc.Sprite)
    bgSp: cc.Sprite = null;
    @property([cc.Sprite])
    soldierSp: cc.Sprite[] = [];
    @property(cc.Node)
    btnNode: cc.Node = null;
    @property(cc.Node)
    state1: cc.Node = null;
    @property(cc.RichText)
    addText: cc.RichText = null;

    @property([cc.Label])
    type1Lbs: cc.Label[] = []
    @property([cc.Label])
    type3Lbs: cc.Label[] = []
    @property([cc.Label])
    type4Lbs: cc.Label[] = []
    @property(cc.Label)
    type1addLb: cc.Label = null;
    @property(cc.Label)
    type3addLb: cc.Label = null;
    @property(cc.Label)
    type4addLb: cc.Label = null;
    @property(sp.Skeleton)
    jihuoSpine: sp.Skeleton = null;

    @property(cc.Node)
    nameLayout: cc.Node = null;
    @property(cc.Prefab)
    nameItemPre: cc.Prefab = null;




    allCfgs: Soldier_army_trammelCfg[] = [];
    curCfg: Soldier_army_trammelCfg;
    curIdx: number;
    pageIndex: number[] = [];

    get byModel() { return ModelManager.get(BYModel); }


    onEnable() {

        this.initAddInfo()

        this._initCfgs();

        let arg = gdk.panel.getArgs(PanelId.BYarmyTrammelPanel)
        let temId = 0
        if (arg) {
            temId = arg[0];
        }
        this.jihuoSpine.node.active = false;
        //let arg = this.args;
        let idx = -1;
        //获得初始idx
        let temTrammels = this.byModel.byarmyState.trammels;
        let temSkins = this.byModel.byarmyState.skins;
        for (let i = 0; i < this.allCfgs.length; i++) {
            let cfg = this.allCfgs[i]
            if (temId == 0) {
                if (temTrammels.indexOf(cfg.trammel_id) < 0) {
                    let have = true;
                    cfg.skin_id.forEach(skin_id => {
                        if (temSkins.indexOf(skin_id) < 0) {
                            have = false;
                        }
                    })
                    if (have) {
                        idx = i;
                        break;
                    } else if (idx == -1) {
                        idx = i;
                    }
                }
            } else {
                if (cfg.trammel_id == temId) {
                    idx = i;
                    break;
                }
            }
        }
        if (idx == -1) {
            idx = 0;
        }
        this._initPageItem(idx);
        this.curIdx = idx;
        //if (!idx) idx = 0;
        let temNode = this.pageContent.getChildByName(`toggle${idx}`);
        let toggle = temNode.getComponent(cc.Toggle);
        toggle && toggle.check();
        gdk.Timer.once(100, this, () => {
            toggle && toggle.check();
        })
        this._updatePanel(this.allCfgs[idx]);
        if (this.pageContent.children.length >= 3) {
            let ctrl = this.pageContent.getComponent(UIScrollSelect);
            ctrl.scrollTo(idx, false);
        }
    }


    initAddInfo() {
        let type1Add = 0;
        let type3Add = 0;
        let type4Add = 0;
        this.byModel.byarmyState.trammels.forEach(id => {
            let cfg = ConfigManager.getItemById(Soldier_army_trammelCfg, id);
            type1Add += cfg.atk1_p;
            type3Add += cfg.atk2_p;
            type4Add += cfg.atk3_p;
        })

        this.type1addLb.string = StringUtils.format(gdk.i18n.t("i18n:BYARMY_TIP5"), type1Add / 100)
        this.setSoliderAddInfo(1, this.type1Lbs, type1Add)
        this.type3addLb.string = StringUtils.format(gdk.i18n.t("i18n:BYARMY_TIP6"), type3Add / 100)
        this.setSoliderAddInfo(3, this.type3Lbs, type3Add)
        this.type4addLb.string = StringUtils.format(gdk.i18n.t("i18n:BYARMY_TIP7"), type4Add / 100)
        this.setSoliderAddInfo(4, this.type4Lbs, type4Add)

    }

    setSoliderAddInfo(type: number, lbs: cc.Label[], addNum: number) {
        let b_lv = this.byModel.byLevelsData[type - 1];
        let cfgs = ConfigManager.getItems(BarracksCfg, (cfg: BarracksCfg) => {
            if (b_lv >= cfg.barracks_lv && cfg.soldier_id && cfg.soldier_id > 0 && cfg.type == type) {
                return true
            }
            return false;
        })
        let selectSoldierId = cfgs[cfgs.length - 1].soldier_id;
        let maxHeroLv = HeroUtils.getMaxLevelHero();
        let cfg = ConfigManager.getItemById(SoldierCfg, selectSoldierId)
        let obj = BYUtils.getTotalAttr(type, b_lv)
        lbs[0].string = Math.floor((cfg['atk_w'] + Math.floor((maxHeroLv - 1) * cfg['grow_atk'] / 100) + obj["atk_g"].value) * (addNum / 10000)) + '';
        lbs[1].string = Math.floor((cfg['hp_w'] + Math.floor((maxHeroLv - 1) * cfg['grow_hp'] / 100) + obj["hp_g"].value) * (addNum / 10000)) + '';
        lbs[2].string = Math.floor((cfg['def_w'] + Math.floor((maxHeroLv - 1) * cfg['grow_def'] / 100) + obj["def_g"].value) * (addNum / 10000)) + '';
    }



    _initCfgs() {
        this.allCfgs = ConfigManager.getItems(Soldier_army_trammelCfg);
        //this.actCfgs.sort((a, b) => { return a.sorting - b.sorting; });
    }

    /**更新活动页签类型 */
    _initPageItem(index: number) {
        this.pageIndex = [];
        this.allCfgs.forEach((cfg, idx) => {
            let toggle = cc.instantiate(this.pagePrefab);
            toggle.parent = this.pageContent;
            let ctrl = toggle.getComponent(BYarmyTrammelPageItemCtrl);
            ctrl.updateView(cfg);
            toggle.name = `toggle${idx}`;
            toggle['cfg'] = cfg;
            this.pageIndex.push(idx);
            let tem = toggle.getComponent(cc.Toggle);
            let temSelect = toggle.getChildByName('select')
            temSelect.active = index == idx;
            tem && tem.uncheck()
        });
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        let layout = this.pageContent.getComponent(cc.Layout);
        ctrl.enabled = true;
        layout.enabled = false;
        this.pageContent.width = 600;
        if (this.pageContent.children.length < 3) {
            ctrl.enabled = false;
            layout.enabled = true;
            return;
        }
        ctrl.updateChilds();
    }

    // selectPageById(id: number) {
    //     let idx;
    //     let toggleItems = this.pageContent.getComponent(cc.ToggleContainer).toggleItems;
    //     for (let i = 0; i < toggleItems.length; i++) {
    //         if (toggleItems[i].node['cfg'].trammel_id == id) {
    //             idx = parseInt(toggleItems[i].node.name.charAt(toggleItems[i].node.name.length - 1));
    //             break;
    //         }
    //     }
    //     if (!idx) idx = 0;
    //     let toggle = this.pageContent.getChildByName(`toggle${idx}`).getComponent(cc.Toggle);
    //     toggle && toggle.check();
    //     this._updatePanel(this.actCfgs[idx]);
    //     if (this.pageContent.children.length >= 3) {
    //         let ctrl = this.pageContent.getComponent(UIScrollSelect);
    //         ctrl.scrollTo(idx, false);
    //     }
    // }

    onArrowClcik(e, data) {
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        if (ctrl.isTestX) return;
        if (this.pageContent.children.length <= 1) return;
        if (this.pageContent.children.length >= 3) {
            data == 'left' ? ctrl.scrollToLeft() : ctrl.scrollToRight();
        }
        let nextIdx;
        let len = this.pageContent.children.length;
        if (data == 'left') {
            nextIdx = this.curIdx - 1 < 0 ? len - 1 : this.curIdx - 1;
        }
        else {
            nextIdx = this.curIdx + 1 > len - 1 ? 0 : this.curIdx + 1;
        }
        let toggle = this.pageContent.getChildByName(`toggle${nextIdx}`)
        toggle && toggle.active && toggle.getComponent(cc.Toggle).check();
    }

    /**
     * 左右箭头红点
     */
    updateArrowRedPoint() {
        if (this.pageIndex.length < 5) return false;
        let idxs = [];
        let curIdx = this.curIdx;
        let nextIdx = this.curIdx + 1 > this.pageIndex.length - 1 ? 0 : this.curIdx + 1;
        let preIdx = this.curIdx - 1 < 0 ? this.pageIndex.length - 1 : this.curIdx - 1;
        idxs = [preIdx, curIdx, nextIdx];
        for (let i = 0; i < this.pageIndex.length; i++) {
            if (idxs.indexOf(this.pageIndex[i]) == -1) {
                let toggle = this.pageContent.getChildByName(`toggle${this.pageIndex[i]}`);
                if (toggle) {
                    let cfg: Soldier_army_trammelCfg = toggle['cfg'];
                    if (!cfg) continue;
                    let ctrl = toggle.getComponent(BYarmyTrammelPageItemCtrl);
                    let b = ctrl.updateRedpoint();
                    if (b) return true;
                }
            }
        }
        return false;
    }

    /**页签点击 活动数量<3时 有效 */
    onToggleClick(toggle: cc.Toggle) {
        let containerName = toggle['_toggleContainer'].node.name;
        if (!containerName) return;
        let toggleName = toggle.node.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        this.curIdx = parseInt(idx);
        let cfg = toggle.node['cfg'];
        if (this.curCfg && this.curCfg.trammel_id == cfg.trammel_id) return;
        this._updatePanel(cfg);
    }

    /**页签滚动 活动数量>=3时 有效*/
    onUIScrollSelect(event: any) {
        let toggle = event.target;
        let index = event.index;
        if (!toggle.parent) return;
        let containerName = toggle.parent.name;
        if (containerName != 'pageContent') return;
        let toggleName = toggle.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        this.curIdx = idx;
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        if (parseInt(idx) != index) {
            if (event.direction < 0) ctrl._toMoveX = -1;
            else ctrl._toMoveX = 1;
            ctrl.scrollTo(idx, true);
            toggle.getComponent(cc.Toggle).check();
        }
    }

    /**更新活动界面 */
    _updatePanel(cfg: Soldier_army_trammelCfg) {
        this.curCfg = cfg;
        let temStr = ''
        //let strs = ["机枪兵属性<color=#18ff00>+{0}%</color>", "炮兵属性<color=#18ff00>+{0}%</color>", "守卫属性<color=#18ff00>+{0}%</color>"]
        if (this.curCfg.atk1_p > 0) {
            temStr += (temStr == "" ? '' : '  ') + StringUtils.format(gdk.i18n.t("i18n:BYARMY_TIP8"), this.curCfg.atk1_p / 100)
        }
        if (this.curCfg.atk2_p > 0) {
            temStr += (temStr == "" ? '' : '  ') + StringUtils.format(gdk.i18n.t("i18n:BYARMY_TIP9"), this.curCfg.atk2_p / 100)
        }
        if (this.curCfg.atk3_p > 0) {
            temStr += (temStr == "" ? '' : '  ') + StringUtils.format(gdk.i18n.t("i18n:BYARMY_TIP10"), this.curCfg.atk3_p / 100)
        }
        this.addText.string = temStr;

        this.state1.active = false;
        this.btnNode.active = false;
        if (this.byModel.byarmyState.trammels.indexOf(cfg.trammel_id) >= 0) {
            this.state1.active = true;
        } else {
            let have = true;
            cfg.skin_id.forEach(skin_id => {
                if (this.byModel.byarmyState.skins.indexOf(skin_id) < 0) {
                    have = false;
                }
            })
            this.btnNode.active = have;
        }

        //设置背景图片
        let bgPath = 'view/bingying/texture/army/bg_trammel' + this.curCfg.trammel_skin;
        GlobalUtil.setSpriteIcon(this.node, this.bgSp, bgPath);
        //修改图片
        this.nameLayout.removeAllChildren()
        this.soldierSp.forEach((sp, index) => {
            if (this.curCfg.trammel_model.length > index) {
                sp.node.active = true;
                let path = 'view/bingying/texture/army/' + this.curCfg.trammel_model[index];
                GlobalUtil.setSpriteIcon(this.node, sp, path);
                let skin_id = this.curCfg.skin_id[index];
                let state: 0 | 1 = 0
                if (this.byModel.byarmyState.skins.indexOf(skin_id) < 0) {
                    state = 1;
                }
                GlobalUtil.setGrayState(sp, state);
                let posStrs = this.curCfg.trammel_pos[index].split(';');
                let pos = cc.v2(parseFloat(posStrs[0]), parseFloat(posStrs[1]))
                sp.node.setPosition(pos);

                let node = cc.instantiate(this.nameItemPre);
                let stateNode = node.getChildByName('state');
                let stateNode1 = node.getChildByName('state1');
                let name = node.getChildByName('name').getComponent(cc.Label);
                stateNode.active = state == 0
                stateNode1.active = state == 1
                //GlobalUtil.setGrayState(stateNode, state);
                let skinCfg = ConfigManager.getItemByField(Soldier_army_skinCfg, 'skin_id', skin_id)
                name.string = skinCfg.name;
                node.setParent(this.nameLayout);

            } else {
                sp.node.active = false;
            }
        })



    }


    btnClick() {
        //激活羁绊
        let msg = new icmsg.SoldierSkinActiveTrammelReq()
        msg.trammelId = this.curCfg.trammel_id;
        NetManager.send(msg, (rsp: icmsg.SoldierSkinActiveTrammelRsp) => {
            this.byModel.byarmyState.trammels = rsp.trammels;
            this.initAddInfo();
            this.state1.active = true;
            this.btnNode.active = false;
            //清空本地战斗数据缓存
            let model = ModelManager.get(HeroModel)
            model.fightHeroIdxTower = {};
            model.fightHeroIdx = {};
            model.heroAttrs = {};
            let sModel = ModelManager.get(SoldierModel)
            sModel.heroSoldiers = {}

            this.jihuoSpine.node.active = true;
            this.jihuoSpine.loop = false;
            this.jihuoSpine.setCompleteListener(() => {
                this.jihuoSpine.setCompleteListener(null);
                this.jihuoSpine.node.active = false;
            });
            this.jihuoSpine.setAnimation(0, "stand", false);
        }, this)
    }
}
