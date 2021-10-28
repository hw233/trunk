import { HeroCfg, Hero_careerCfg, Hero_displaceCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import HeroModel from '../../../../common/models/HeroModel';
import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import PanelId from '../../../../configs/ids/PanelId';
import HeroLockTipsCtrl from '../../../role/ctrl2/main/common/HeroLockTipsCtrl';
import { RoleEventId } from '../../../role/enum/RoleEventId';
import { LotteryEventId } from '../../enum/LotteryEventId';
import HeroTransItemCtrl from './HeroTransItemCtrl';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-22 11:15:26 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/transform/HeroTransFormViewCtrl')
export default class HeroTransFormViewCtrl extends gdk.BasePanel {
    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    @property(sp.Skeleton)
    spineA: sp.Skeleton = null;

    @property(sp.Skeleton)
    spineB: sp.Skeleton = null;

    @property(cc.Node)
    materialNode: cc.Node = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    guildSpine: cc.Node = null;

    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

    curHeroInfo: icmsg.HeroInfo;
    targetHeroType: number;
    materialIds: number[] = [];
    list: ListView = null
    isShowCareer: boolean = false
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    onEnable() {
        this.guildSpine.active = false;
        this.selectGroupFunc(null, 0);
        this.selectCareerFunc(null, 0);
        this.updateContentState();
        gdk.e.on(LotteryEventId.HERO_TRANS_MATERIAL_SELECT, this._onMaterialSelect, this);
        gdk.e.on(RoleEventId.REMOVE_ONE_HERO, this._updateScroll, this);
    }

    onDisable() {
        this.guildSpine.active = false;
        gdk.Timer.clearAll(this);
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

    onAddMaterialBtnClick() {
        if (!this.curHeroInfo) {
            gdk.gui.showMessage("请先选择您的置换英雄");
            return;
        }
        gdk.panel.setArgs(PanelId.HeroTransMaterialsView, [this.curHeroInfo, [...this.materialIds]]);
        gdk.panel.open(PanelId.HeroTransMaterialsView);
    }

    onTransBtnClick() {
        this.guildSpine.active = false;
        gdk.Timer.clearAll(this);
        if (!this.curHeroInfo) {
            gdk.gui.showMessage("请先选择您的置换英雄");
            return;
        }

        if (!this.materialIds || this.materialIds.length <= 0) {
            gdk.gui.showMessage('请放入您的材料英雄');
            this.guildSpine.active = true;
            gdk.Timer.once(2000, this, () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this.guildSpine.active = false;
            })
            return;
        }

        let g = (<HeroCfg>BagUtils.getConfigById(this.curHeroInfo.typeId)).group[0];
        let cfg = ConfigManager.getItem(Hero_displaceCfg, (cfg: Hero_displaceCfg) => {
            if (cfg.star == this.curHeroInfo.star && cfg.group.indexOf(g) !== -1) return true;
        });

        if (this.materialIds.length < cfg.num) {
            gdk.gui.showMessage('材料不足');
            return;
        }

        if (BagUtils.getItemNumById(cfg.cost[0]) < cfg.cost[1]) {
            GlobalUtil.openAskPanel({
                descText: `你的${BagUtils.getConfigById(cfg.cost[0]).name}不足,是否跳转至商店?`,
                sureCb: () => {
                    PanelId.Recharge.onHide = {
                        func: () => {
                            gdk.panel.setArgs(PanelId.HeroResetView, 4);
                            gdk.panel.open(PanelId.HeroResetView);
                        }
                    }
                    JumpUtils.openRechargetLBPanel([3, 11009]);
                }
            })
            return;
        }

        GlobalUtil.openAskPanel({
            descText: `是否消耗${BagUtils.getConfigById(cfg.cost[0]).name}X${cfg.cost[1]}对英雄进行置换？操作无法撤回，请谨慎选择`,
            sureCb: () => {
                let req = new icmsg.HeroDisplaceReq();
                req.heroId = this.curHeroInfo.heroId;
                req.targetHeroIds = this.materialIds;
                NetManager.send(req, (resp: icmsg.HeroDisplaceRsp) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    GlobalUtil.openRewadrView(resp.list);
                    this.curHeroInfo = null;
                    this.materialIds = [];
                    this.targetHeroType = null;
                    this._updateScroll();
                }, this);
            }
        })
    }

    _onMaterialSelect(e) {
        this.materialIds = e.data || [];
        this._updateMaterialNode();
        if (this.materialIds.length <= 0) {
            this.targetHeroType = null;
        }
        else {
            this.targetHeroType = HeroUtils.getHeroInfoByHeroId(this.materialIds[0]).typeId;
        }
        if (this.targetHeroType) {
            //转换目标
            this.spineB.node.active = true;
            let cfg = <HeroCfg>BagUtils.getConfigById(this.targetHeroType);
            let url = StringUtils.format("spine/hero/{0}/1/{0}", cfg.skin);
            GlobalUtil.setSpineData(this.node, this.spineB, url, false, "stand", true, false);
        }
        else {
            this.spineB.node.active = false;
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
                column: 5,
                gap_x: 15,
                gap_y: 25,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
        }
    }

    _updateScroll() {
        this._initListView();
        let datas = [];
        let heros = this.heroModel.heroInfos;
        heros.forEach(h => {
            let info = <icmsg.HeroInfo>h.extInfo;
            if (info.star >= 7) {
                let cfg = <HeroCfg>BagUtils.getConfigById(h.itemId);
                if (cfg.group[0] != 6 && (!this.selectGroup || cfg.group.indexOf(this.selectGroup) !== -1)) {
                    if (!this.selectCareer || ConfigManager.getItemByField(Hero_careerCfg, 'career_id', info.careerId).career_type == this.selectCareer) {
                        datas.push({
                            info: info,
                            select: false
                        })
                    }
                }
            }
        });

        datas.sort((a, b) => {
            if (a.info.star == b.info.star) return a.info.typeId - b.info.typeId;
            else return b.info.star - a.info.star;
        })

        this.list.clear_items();
        this.list.set_data(datas);
        this.curHeroInfo = null;
        this.materialIds = [];
        this.targetHeroType = null;
        this._updateView();
    }

    _selectItem(data: { info: icmsg.HeroInfo, select: boolean }, idx: number, preData, preIdx) {
        if (this.curHeroInfo && this.curHeroInfo.heroId == data.info.heroId) return;
        let b = HeroUtils.heroLockCheck(data.info, false);
        if (!b) {
            let preItem = this.list.items[preIdx];
            if (preItem && preItem.node) {
                let preCtrl = preItem.node.getComponent(HeroTransItemCtrl);
                preCtrl.check();
            }
            else {
                if (preData) {
                    this.list.datas[preIdx].select = false;
                }
            }

            let item = this.list.items[idx].node;
            let ctrl = item.getComponent(HeroTransItemCtrl);
            ctrl.check();
            this.curHeroInfo = data.info;
            this.materialIds = [];
            this.targetHeroType = null;
            this._updateView();
        } else {
            gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
                let ctrl = node.getComponent(HeroLockTipsCtrl);
                ctrl.initArgs(data.info.heroId, [], () => { this.list.select_item(idx) });
            });
            return
        }
        this.list.refresh_items();
    }

    _updateView() {
        this.spineA.node.active = this.spineB.node.active = false;
        this._updateCostNode();
        this._updateMaterialNode();
        if (this.curHeroInfo) {
            this.spineA.node.active = true;
            let cfg = <HeroCfg>BagUtils.getConfigById(this.curHeroInfo.typeId);
            let url = StringUtils.format("spine/hero/{0}/1/{0}", HeroUtils.getHeroSkin(this.curHeroInfo.typeId, this.curHeroInfo.star));
            GlobalUtil.setSpineData(this.node, this.spineA, url, false, "stand", true, false);
        }
        if (this.targetHeroType) {
            //转换目标
            this.spineB.node.active = true;
            let cfg = <HeroCfg>BagUtils.getConfigById(this.targetHeroType);
            let url = StringUtils.format("spine/hero/{0}/1/{0}", cfg.skin);
            GlobalUtil.setSpineData(this.node, this.spineB, url, false, "stand", true, false);
        }
    }

    _updateMaterialNode() {
        //材料
        let icon = this.materialNode.getChildByName('icon');
        let num = this.materialNode.getChildByName('num').getComponent(cc.Label);
        let totalNum;
        if (this.curHeroInfo) {
            let g = (<HeroCfg>BagUtils.getConfigById(this.curHeroInfo.typeId)).group[0];
            let cfg = ConfigManager.getItem(Hero_displaceCfg, (cfg: Hero_displaceCfg) => {
                if (cfg.star == this.curHeroInfo.star && cfg.group.indexOf(g) !== -1) return true;
            });
            totalNum = cfg.num;
        }
        if (!this.materialIds || this.materialIds.length <= 0) {
            icon.active = false;
            num.node.active = !!totalNum;
            if (num.node.active) num.string = `0/${totalNum}`;
        }
        else {
            let cfg = <HeroCfg>BagUtils.getConfigById(HeroUtils.getHeroInfoByHeroId(this.materialIds[0]).typeId);
            icon.active = true;
            num.node.active = true;
            GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(cfg.id));
            num.string = `${this.materialIds.length}/${totalNum}`;
        }
    }

    _updateCostNode() {
        this.costNode.parent.active = !!this.curHeroInfo;
        if (this.costNode.parent.active) {
            let icon = this.costNode.getChildByName('icon');
            let num = this.costNode.getChildByName('num').getComponent(cc.Label);
            let g = (<HeroCfg>BagUtils.getConfigById(this.curHeroInfo.typeId)).group[0];
            let cfg = ConfigManager.getItem(Hero_displaceCfg, (cfg: Hero_displaceCfg) => {
                if (cfg.star == this.curHeroInfo.star && cfg.group.indexOf(g) !== -1) return true;
            });
            GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(cfg.cost[0]));
            num.string = cfg.cost[1] + '置换';
        }
    }
}
