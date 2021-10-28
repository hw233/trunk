import BagUtils from '../../../common/utils/BagUtils';
import BYarmySkinPageItemCtrl from './BYarmySkinPageItemCtrl';
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
import UIScrollSelect from '../../lottery/ctrl/UIScrollSelect';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import {
    BarracksCfg,
    ItemCfg,
    SkillCfg,
    Soldier_army_skinCfg,
    SoldierCfg
    } from '../../../a/config';
import { BYEventId } from '../enum/BYEventId';

/** 
 * @Description: 兵营-兵团界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-25 09:50:43
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmySkinPanelCtrl")
export default class BYarmySkinPanelCtrl extends gdk.BasePanel {


    @property(cc.Label)
    btnLb: cc.Label = null;

    @property(cc.Label)
    atkLb: cc.Label = null;
    @property(cc.Label)
    atkAdd: cc.Label = null;
    @property(cc.Label)
    hpLb: cc.Label = null;
    @property(cc.Label)
    hpAdd: cc.Label = null;
    @property(cc.Label)
    defLb: cc.Label = null;
    @property(cc.Label)
    defAdd: cc.Label = null;

    @property(UiTabMenuCtrl)
    soliderMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    pageContent: cc.Node = null;

    @property(cc.Prefab)
    pagePrefab: cc.Prefab = null;

    @property(cc.Node)
    redNode: cc.Node = null;

    curCfg: Soldier_army_skinCfg;
    cfgs: Soldier_army_skinCfg[];
    skinStates: SoliderSkinData[] = [];
    curSkinState: SoliderSkinData = null;
    curIndex: number = 0;
    //curSkinState: number = 0;//当前精甲状态 0未拥有 1拥有未激活 2 拥有已激活
    soliderType = [0, -1, 1, 2];
    get byModel() { return ModelManager.get(BYModel); }
    get heroModel() { return ModelManager.get(HeroModel); }
    onEnable() {
        let args = gdk.panel.getArgs(PanelId.BYarmySkinPanel);

        if (args) {
            //cc.log('-------------------------------------' + args[0]);
            this.curCfg = ConfigManager.getItemByField(Soldier_army_skinCfg, 'skin_id', args[0])
        } else {
            this.curCfg = ConfigManager.getItem(Soldier_army_skinCfg, (tem: Soldier_army_skinCfg) => {
                if (tem.type == 1) {
                    return true;
                }
                return false;
            });
        }
        gdk.e.on(BYEventId.BYARMY_SKIN_SETON, this.refreshCurState, this)

        this.initSkinData(this.curCfg.type, this.curCfg);
        this.soliderMenu.selectIdx = this.soliderType[this.curCfg.type - 1];

        this.initSkinInfo()
        this.initSoliderAddInfo()
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this)

    }

    initSkinData(temType: number, cur?: Soldier_army_skinCfg) {
        this.cfgs = ConfigManager.getItems(Soldier_army_skinCfg, (cfg: Soldier_army_skinCfg) => {
            if (cfg.type == temType) {
                return true;
            }
            return false;
        })
        this.curCfg = cur ? cur : this.cfgs[0];
        this.skinStates = []
        this.cfgs.forEach((cfg, idx) => {
            let temState = 0;
            if (this.byModel.byarmyState.skins.indexOf(cfg.skin_id) >= 0) {
                temState = 2
            } else if (BagUtils.getItemNumById(cfg.consumption[0]) >= 1) {
                temState = 1;
            }
            let tem = { cfg: cfg, state: temState };
            this.skinStates.push(tem);
            if (cfg.skin_id == this.curCfg.skin_id) {
                this.curIndex = idx;
                this.curSkinState = tem;
            }
        })

        this.SkinAddData()

    }

    SkinAddData() {

        let addHp: number = 0;
        let addAtk: number = 0;
        let addDef: number = 0;

        this.skinStates.forEach(temState => {
            if (temState.state == 2) {
                addHp += temState.cfg.hp_p;
                addAtk += temState.cfg.atk_p;
                addDef += temState.cfg.def_p;
            }
        })

        let b_lv = this.byModel.byLevelsData[this.curCfg.type - 1];
        let cfgs = ConfigManager.getItems(BarracksCfg, (cfg: BarracksCfg) => {
            if (b_lv >= cfg.barracks_lv && cfg.soldier_id && cfg.soldier_id > 0 && cfg.type == this.curCfg.type) {
                return true
            }
            return false;
        })
        let selectSoldierId = cfgs[cfgs.length - 1].soldier_id;
        let maxHeroLv = HeroUtils.getMaxLevelHero();
        let cfg = ConfigManager.getItemById(SoldierCfg, selectSoldierId)

        let obj = BYUtils.getTotalAttr(this.curCfg.type, b_lv)

        this.atkLb.string = Math.floor((cfg['atk_w'] + Math.floor((maxHeroLv - 1) * cfg['grow_atk'] / 100) + obj["atk_g"].value) * (addAtk / 10000)) + '';
        this.atkAdd.string = '+(' + (addAtk / 100) + '%)'
        this.hpLb.string = Math.floor((cfg['hp_w'] + Math.floor((maxHeroLv - 1) * cfg['grow_hp'] / 100) + obj["hp_g"].value) * (addHp / 10000)) + '';
        this.hpAdd.string = '+(' + (addHp / 100) + '%)'
        this.defLb.string = Math.floor((cfg['def_w'] + Math.floor((maxHeroLv - 1) * cfg['grow_def'] / 100) + obj["def_g"].value) * (addDef / 10000)) + '';
        this.defAdd.string = '+(' + (addDef / 100) + '%)'
    }

    initSkinInfo() {
        //
        this._initPageItem(this.curIndex)

        switch (this.curSkinState.state) {
            case 0:
                this.btnLb.string = gdk.i18n.t("i18n:BYARMY_TIP1")
                break;
            case 1:
                this.btnLb.string = gdk.i18n.t("i18n:BYARMY_TIP2")
                break;
            case 2:
                this.btnLb.string = gdk.i18n.t("i18n:BYARMY_TIP3")
                break;
        }
        //this.redNode.active = this.curSkinState.state == 1;
        this.refreshRedShow();

    }

    setSkinNodeInfo(node: cc.Node, data: SoliderSkinData) {
        let name = node.getChildByName('name').getComponent(cc.Label);
        let skillDes = node.getChildByName('skillDes').getComponent(cc.RichText);
        let spine = node.getChildByName('spine').getComponent(sp.Skeleton);
        let yiyongyou = node.getChildByName('by_yiyongyou')
        let weiyongyou = node.getChildByName('by_weiyongyou')
        let path = `spine/monster/${data.cfg.skin}/ui/${data.cfg.skin}`
        GlobalUtil.setSpineData(this.node, spine, path, true, 'stand_s', true);
        let skillCfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', data.cfg.skills);
        skillDes.string = skillCfg ? skillCfg.des : '';
        name.string = data.cfg.name;
        weiyongyou.active = data.state == 0;
        yiyongyou.active = data.state != 0;
        let state: 0 | 1 = data.state != 2 ? 1 : 0;
        GlobalUtil.setAllNodeGray(node, state);
    }


    initSoliderAddInfo() {

    }

    refreshCurState() {
        let node = this.pageContent.children[this.curIndex];
        let ctrl = node.getComponent(BYarmySkinPageItemCtrl);
        ctrl.updateView(this.curSkinState, this.curIndex, this.curIndex);
        this.refreshRedShow();
    }

    //当前精甲状态改变按钮
    changeStageBtn() {
        switch (this.curSkinState.state) {
            case 0:
                //获得
                let itemCfg = ConfigManager.getItemById(ItemCfg, this.curSkinState.cfg.consumption[0])
                if (itemCfg.new_get == '') {
                    gdk.gui.showMessage(gdk.i18n.t("i18n:BYARMY_TIP12"))
                } else {

                }
                break;
            case 1:
                //激活
                let msg = new icmsg.SoldierSkinActiveReq()
                msg.skinId = this.curSkinState.cfg.skin_id;
                NetManager.send(msg, (rsp: icmsg.SoldierSkinActiveRsp) => {
                    this.byModel.byarmyState.skins = rsp.skins;
                    gdk.panel.setArgs(PanelId.BYarmyActivationPanel, this.curSkinState.cfg)
                    gdk.panel.open(PanelId.BYarmyActivationPanel);
                    this.curSkinState.state = 2;
                    this.refreshCurState()
                    this.btnLb.string = gdk.i18n.t("i18n:BYARMY_TIP3");
                    //this.redNode.active = false;
                    this.refreshRedShow();
                    this.SkinAddData();
                    //清空本地战斗数据缓存
                    let model = ModelManager.get(HeroModel)
                    model.fightHeroIdxTower = {};
                    model.fightHeroIdx = {};
                    model.heroAttrs = {};
                    let sModel = ModelManager.get(SoldierModel)
                    sModel.heroSoldiers = {}

                }, this)
                break;
            case 2:
                //穿戴
                gdk.panel.setArgs(PanelId.BYarmySetSkinView, this.curSkinState.cfg);
                gdk.panel.open(PanelId.BYarmySetSkinView)
                break;
        }
    }


    //切换精甲按钮点击事件
    changeSkinBtnClick(e: cc.Event, idx: string) {
        let index = parseInt(idx)
        if (index == 0) {
            if (this.curIndex == 0) return;
            this.curIndex -= 1;
        } else {
            if (this.curIndex == this.skinStates.length - 1) return;
            this.curIndex += 1;
        }
        this.initSkinInfo()
    }

    soliderTypeFunc(event, index) {

        //cc.log('------------soliderTypeFunc-----------' + index)
        let tem = this.soliderType[this.curCfg.type - 1];
        if (index == tem) return;
        let temType = this.soliderType.indexOf(index) + 1;
        this.initSkinData(temType);
        this.initSkinInfo()
        this.initSoliderAddInfo()
    }

    //切换精甲按钮点击事件
    soliderTypeRedCheck(idx: string, e: cc.Event) {
        let type = parseInt(idx);
        let cfgs = ConfigManager.getItems(Soldier_army_skinCfg, (cfg: Soldier_army_skinCfg) => {
            if (cfg.type == type) {
                return true;
            }
        });
        let haveSkin = false;
        cfgs.some(cfg => {
            let num = BagUtils.getItemNumById(cfg.consumption[0])
            if (this.byModel.byarmyState.skins.indexOf(cfg.skin_id) < 0 && num > 0) {
                haveSkin = true;
                return true;
            }
            if (this.byModel.byarmyState.skins.indexOf(cfg.skin_id) >= 0) {
                let heroIds = this.heroModel.PveUpHeroList.concat();
                heroIds.forEach(heroId => {
                    let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
                    if (heroInfo) {
                        let temType = Math.floor(heroInfo.soldierId / 100)
                        if (temType == type && heroInfo.soldierSkin <= 0) {
                            haveSkin = true;
                            return true;
                        }
                    }
                })
            }
        })
        if (haveSkin) {
            return true;
        }
        return false;
    }

    _initPageItem(index: number) {
        //this.pageIndex = [];
        this.pageContent.removeAllChildren();
        this.skinStates.forEach((data, idx) => {
            let toggle = cc.instantiate(this.pagePrefab);
            toggle.parent = this.pageContent;
            let ctrl = toggle.getComponent(BYarmySkinPageItemCtrl);
            ctrl.updateView(data, idx, index);
            toggle.name = `toggle${idx}`;
        });
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        //let layout = this.pageContent.getComponent(cc.Layout);
        ctrl.enabled = true;
        //layout.enabled = false;
        this.pageContent.width = 640;
        // if (this.pageContent.children.length < 3) {
        //     ctrl.enabled = false;
        //     layout.enabled = true;
        //     return;
        // }
        ctrl.updateChilds();
        ctrl.scrollTo(index, false);
    }

    /**页签滚动 活动数量>=3时 有效*/
    onUIScrollSelect(event: any) {
        let toggle = event.target;
        let index = event.index;
        if (!toggle.parent) return;
        let containerName = toggle.parent.name;
        if (containerName != 'pageNode') return;
        let toggleName = toggle.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        this.curSkinState = this.skinStates[idx]
        this.curIndex = idx;
        if (parseInt(idx) != index) {
            if (event.direction < 0) ctrl._toMoveX = -1;
            else ctrl._toMoveX = 1;
            ctrl.scrollTo(idx, true);
            //toggle.getComponent(cc.Toggle).check();

            this.pageContent.children.forEach((child, idx) => {
                let ctrl = child.getComponent(BYarmySkinPageItemCtrl);
                ctrl.updateView(this.skinStates[idx], idx, this.curIndex);
            })
        }
        switch (this.curSkinState.state) {
            case 0:
                this.btnLb.string = gdk.i18n.t("i18n:BYARMY_TIP1")
                break;
            case 1:
                this.btnLb.string = gdk.i18n.t("i18n:BYARMY_TIP2")
                break;
            case 2:
                this.btnLb.string = gdk.i18n.t("i18n:BYARMY_TIP3")
                break;
        }
        this.refreshRedShow();
    }

    refreshRedShow() {
        this.redNode.active = false;
        if (this.curSkinState.state == 1) {
            this.redNode.active = true;
        } else if (this.curSkinState.state == 2) {
            let curType = this.curSkinState.cfg.type
            let heroIds = this.heroModel.PveUpHeroList.concat();
            let res = false;
            heroIds.forEach(heroId => {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
                if (heroInfo) {
                    let temType = Math.floor(heroInfo.soldierId / 100)
                    if (temType == curType && heroInfo.soldierSkin <= 0) {
                        res = true;
                    }
                }
            })
            this.redNode.active = res;
        }
        //this.redNode.active = this.curSkinState.state == 1;
    }

}

export interface SoliderSkinData {
    cfg: Soldier_army_skinCfg,
    state: number //当前精甲状态 0未拥有 1拥有未激活 2 拥有已激活
}
