import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GeneLotteryEffectViewCtrl from './GeneLotteryEffectViewCtrl';
import GenePoolItemCtrl from './GenePoolItemCtrl';
import GeneRecordItemCtrl from './GeneRecordItemCtrl';
import GeneView, { pageType } from './GeneViewCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HelpTipsBtnCtrl from '../../../tips/ctrl/HelpTipsBtnCtrl';
import HeroGetCtrl from '../HeroGetCtrl';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import LotteryModel, { LotteryType } from '../../model/LotteryModel';
import MathUtil from '../../../../common/utils/MathUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { BagType } from '../../../../common/models/BagModel';
import { GeneCfg, Hero_starCfg, HeroCfg } from '../../../../a/config';
import { ListView } from '../../../../common/widgets/UiListview';
import { LotteryEventId } from '../../enum/LotteryEventId';
import { StoreMenuType } from '../../../store/ctrl/StoreViewCtrl';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-12 14:52:03 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneLotteryViewCtrl')
export default class GeneLotteryViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    titleNode: cc.Node = null;

    // @property(cc.Node)
    // poolIcon: cc.Node = null;

    @property(cc.Label)
    tipsLab: cc.Label = null;

    @property(cc.Node)
    poolContent: cc.Node = null;

    @property(cc.Prefab)
    poolItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Node)
    heroNode: cc.Node = null;

    @property(sp.Skeleton)
    idleSp: sp.Skeleton = null;

    @property(sp.Skeleton)
    summonSp: sp.Skeleton = null;

    @property(sp.Skeleton)
    switchSp: sp.Skeleton = null;

    @property(cc.ScrollView)
    recordScrollView: cc.ScrollView = null;

    @property(cc.Node)
    recordContent: cc.Node = null;

    @property(cc.Prefab)
    recordPrefab: cc.Prefab = null;

    @property([cc.Node])
    arrowNodes: cc.Node[] = [];

    @property(cc.Node)
    progress: cc.Node = null;

    @property(cc.Node)
    proTopView: cc.Node = null;

    get model(): LotteryModel { return ModelManager.get(LotteryModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    list: ListView;
    panelTtype: pageType;
    cfgs: GeneCfg[] = [];
    curCfg: GeneCfg;
    proTween: cc.Tween;
    maxTime: number = 45;
    idleSpUrl: string[] = ['spine/ui/UI_jiyinzhaohuandaijihong/UI_jiyinzhaohuandaijihong'];
    summonSpUrl: string[] = ['spine/ui/UI_jiyinzhaohuanhong/UI_jiyinzhaohuanhong'];
    onEnable() {
        this.heroNode.active = false;
        this.updateView(this.args[0]);
        gdk.e.on(LotteryEventId.GENE_POOL_SELECT, this._onPoolSelect, this);
        gdk.e.on(LotteryEventId.GENE_LOTTERY_REQ, this._onGeneLotteryReq, this);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateProgress, this);
        NetManager.on(icmsg.SystemErrorRsp.MsgType, () => {
            //返回错误码去除操作限制
            let node = this.node.parent.parent;
            if (node) {
                let ctrl = node.getComponent(GeneView);
                ctrl && (ctrl.mask.active = false);
            }
        }, this);
        let id = GlobalUtil.getLocal('geneSelectId', true) || 1;
        id = Math.min(4, id);
        this._onPoolSelect({ data: id }, false);
        // this.model.geneDrawNum = 0;
        // gdk.Timer.loop(3000, this, () => {
        //     this.model.geneDrawNum += 1;
        //     console.log('add geneDrawNum' + this.model.geneDrawNum)
        // });
    }

    onDisable() {
        if (this.proTween) {
            this.proTween.stop();
            this.proTween = null;
        }
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        let nodes = [this.arrowNodes[0], this.arrowNodes[1], this.arrowNodes[3]];
        nodes.forEach((n, idx) => {
            let lab = cc.find(`n/lab`, n);
            lab.stopAllActions();
            lab.setScale(1);
        });
        this.cfgs = [];
        this.panelTtype = null;
        this.curCfg = null;
        gdk.Timer.clearAll(this);
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    onStoreClick() {
        gdk.panel.open(PanelId.GeneStoreView);
    }

    waitForCreate: boolean = false;
    recordCreating: boolean = false;
    @gdk.binding('model.geneDrawRecord')
    async updateList() {
        //正在创建 abort&wait
        if (this.recordCreating) {
            this.waitForCreate = true;
            return;
        }
        this.recordCreating = true;
        let record = this.model.geneDrawRecord;
        this.recordContent.removeAllChildren();
        let eachCreatN = 2;
        for (let i = 0; i < record.length; i += eachCreatN) {
            await this.createByFrame(record.slice(i, i + eachCreatN));
        }
        //全部创建完成
        this.recordCreating = false;
        //有新未创建的记录
        if (this.waitForCreate) {
            this.waitForCreate = false;
            this.updateList();
        }
    }

    async createByFrame(records: icmsg.GeneDrawHistory[], frame: number = 1) {
        return new Promise((resolve, rejct) => {
            gdk.Timer.frameOnce(frame, this, () => {
                if (cc.isValid(this.node) && this.node.activeInHierarchy) {
                    records.forEach(d => {
                        let item = cc.instantiate(this.recordPrefab);
                        item.parent = this.recordContent;
                        let ctrl = item.getComponent(GeneRecordItemCtrl);
                        ctrl.updateView(d);
                    })
                }
                resolve(true);
            })
        });
    }

    lotteryWithoutAni() {
        if (this.panelTtype == pageType.superGene) {
            if (!JumpUtils.ifSysOpen(2820, true)) {
                return;
            }
        }
        if (!this.curCfg) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP3"));
            return
        }
        let costNum = BagUtils.getItemNumById(this.curCfg.item[0]) || 0;
        if (costNum < this.curCfg.item[1]) {
            let name = BagUtils.getConfigById(this.curCfg.item[0]).name;
            if (this.curCfg.type == 1) {
                GlobalUtil.openAskPanel({
                    descText: `${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP1"), name)}`,
                    sureCb: () => {
                        gdk.panel.setArgs(PanelId.Store, [StoreMenuType.Gold]);
                        gdk.panel.open(PanelId.Store);
                    }
                })
            }
            else {
                gdk.gui.showMessage(`${name}${gdk.i18n.t("i18n:LOTTERY_TIP2")}`);
            }
            return;
        }
        gdk.gui.lockScreen();
        this._sendReq();
    }

    onLotteryClick() {
        if (this.panelTtype == pageType.superGene) {
            if (!JumpUtils.ifSysOpen(2820, true)) {
                return;
            }
        }
        if (!this.curCfg) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP3"));
            return
        }

        let costNum = BagUtils.getItemNumById(this.curCfg.item[0]) || 0;
        if (costNum < this.curCfg.item[1]) {
            let name = BagUtils.getConfigById(this.curCfg.item[0]).name;
            if (this.curCfg.type == 1) {
                GlobalUtil.openAskPanel({
                    descText: `${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP1"), name)}`,
                    sureCb: () => {
                        gdk.panel.setArgs(PanelId.Store, [StoreMenuType.Gold]);
                        gdk.panel.open(PanelId.Store);
                    }
                })
            }
            else {
                gdk.gui.showMessage(`${name}${gdk.i18n.t("i18n:LOTTERY_TIP2")}`);
            }
            return;
        }
        gdk.gui.lockScreen();
        GlobalUtil.setSpineData(this.node, this.idleSp, null);
        this.idleSp.node.active = false;
        this.summonSp.node.active = true;
        this.summonSp.setCompleteListener(() => {
            this._updateSpine();
            this._sendReq();
        });
        GlobalUtil.setSpineData(this.node, this.summonSp, this.summonSpUrl[0], true, 'stand', true);
    }

    private _sendReq() {
        gdk.gui.unLockScreen();
        let req = new icmsg.GeneDrawReq();
        req.geneId = this.curCfg.id;
        NetManager.send(req, (resp: icmsg.GeneDrawRsp) => {
            gdk.gui.unLockScreen();
            let id = resp.list[0].typeId;
            if (BagUtils.getItemTypeById(id) == BagType.HERO) {
                // 抽中了英雄
                let typeId = id.toString().length > 6 ? parseInt(id.toString().slice(0, 6)) : id;
                this.heroNode.active = true;
                this._updateShowHero(typeId, 10 * 1000);
                gdk.Timer.once(300, this, () => {
                    if (!cc.isValid(this.node)) return;
                    gdk.panel.open(PanelId.HeroReward, (node: cc.Node) => {
                        let isNew = HeroUtils.getHeroListByTypeId(typeId).length <= 1;
                        let comp = node.getComponent(HeroGetCtrl)
                        comp.showLotteryEffectHero(id, isNew);
                        node.onHide.once(() => {
                            if (!cc.isValid(this.node)) return;
                            this._showReward(resp);
                        });
                    });
                });
            } else {
                // 抽中的是碎片
                this.heroNode.active = false;
                gdk.Timer.once(300, this, () => {
                    if (!cc.isValid(this.node)) return;
                    this._showReward(resp);
                });
            }
        }, this);
        this.heroNode.active = false;
        gdk.Timer.clearAll(this);
        let node = this.node.parent.parent;
        if (node) {
            let ctrl = node.getComponent(GeneView);
            ctrl && (ctrl.mask.active = true);
        }
    }

    private _showReward(resp: icmsg.GeneDrawRsp) {
        let model = ModelManager.get(LotteryModel);
        model.geneResultGoods = resp.list;
        model.lotteryType = LotteryType.gene;
        // let panel = gdk.panel.get(PanelId.LotteryEffect)
        let panel = gdk.panel.get(PanelId.GeneLotteryEffect);
        let cfg = ConfigManager.getItemById(GeneCfg, model.curGenePoolId);
        if (panel) {
            let ctrl = panel.getComponent(GeneLotteryEffectViewCtrl);
            ctrl.reSetEffect();
            ctrl.showReward(resp.list, false, cfg);
        }
        else {
            gdk.panel.open(PanelId.GeneLotteryEffect, (node: cc.Node) => {
                let ctrl = node.getComponent(GeneLotteryEffectViewCtrl);
                ctrl.showReward(resp.list, false, cfg);
            });
        }
    }

    updateView(panelType: pageType) {
        this.panelTtype = panelType;
        this.curCfg = null;
        if (this.panelTtype == pageType.superGene) {
            this.switchSp.node.active = true;
            this.switchSp.setCompleteListener(() => {
                if (cc.isValid(this.node)) {
                    this.switchSp.setCompleteListener(null);
                    this.switchSp.node.active = false;
                }
            });
            GlobalUtil.setSpineData(this.node, this.switchSp, 'spine/ui/UI_gene_refresh/UI_jiyinzhaohuanshuaxin', true, 'stand', true);
        }
        else {
            GlobalUtil.setSpineData(this.node, this.switchSp, null);
            this.switchSp.setCompleteListener(null);
            this.switchSp.node.active = false;
        }
        this.costNode.active = false;
        this.cfgs = ConfigManager.getItemsByField(GeneCfg, 'type', this.panelTtype);
        // GlobalUtil.setSpriteIcon(this.node, this.poolIcon, `view/lottery/texture/gene/${panelType == pageType.normalGene ? 'jyzh_languan' : 'jyzh_huangguan'}`);
        this.tipsLab.string = panelType == pageType.normalGene ? gdk.i18n.t("i18n:LOTTERY_TIP4") : gdk.i18n.t("i18n:LOTTERY_TIP5");
        this.titleNode.getChildByName('tipsBtn').getComponent(HelpTipsBtnCtrl).tipsId = 31 + panelType;
        // GlobalUtil.setSpriteIcon(this.node, this.titleNode.getChildByName('title'), `view/lottery/texture/gene/jyzh_biaoti0${panelType}`, () => {
        //     if (cc.isValid(this.node)) {
        //         this.titleNode.getChildByName('tipsBtn').getComponent(HelpTipsBtnCtrl).tipsId = 31 + panelType;
        //         this.titleNode.getComponent(cc.Layout).spacingX = panelType == pageType.normalGene ? -160 : -110;
        //         this.titleNode.getComponent(cc.Layout).updateLayout();
        //         this.titleNode.setPosition(panelType == pageType.normalGene ? cc.v2(23.209, 530.827) : cc.v2(25, 533));
        //     }
        // });
        // this.poolContent.getComponent(cc.Layout).spacingX = panelType == pageType.normalGene ? -10 : -16;
        // this.poolContent.removeAllChildren();
        let scale = panelType == pageType.normalGene ? .8 : .7;
        this.cfgs.forEach(cfg => {
            let item = cc.instantiate(this.poolItemPrefab);
            item.setScale(scale);
            item.parent = this.poolContent;
            item.name = `pool${cfg.id}`;
            let ctrl = item.getComponent(GenePoolItemCtrl);
            ctrl.updateView(cfg);
        });
        this.poolContent.getComponent(cc.Layout).updateLayout();
        this._updateShowHero();
        this._updateSpine();
    }

    _onGeneLotteryReq(e) {
        let skipAni = e.data || false;
        if (skipAni) {
            this.lotteryWithoutAni();
        }
        else {
            this.onLotteryClick();
        }
    }

    _onPoolSelect(e, withAni = true) {
        let id = e.data;
        if (this.curCfg) {
            if (id == this.curCfg.id) return;
            let preNode = this.poolContent.getChildByName(`pool${this.curCfg.id}`);
            if (preNode) {
                let ctrl = preNode.getComponent(GenePoolItemCtrl);
                ctrl.unSelect();
            }
        }
        this.curCfg = ConfigManager.getItemById(GeneCfg, id);
        ModelManager.get(LotteryModel).curGenePoolId = id;
        GlobalUtil.setLocal('geneSelectId', id, true);
        let node = this.poolContent.getChildByName(`pool${id}`);
        let ctrl = node.getComponent(GenePoolItemCtrl);
        ctrl.onSelect(withAni);

        //cost
        this.costNode.active = true;
        GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(this.curCfg.item[0]));
        this.costNode.getChildByName('num').getComponent(cc.Label).string = this.curCfg.item[1] + '';

        //showHero
        this._updateShowHero();
    }

    _updateShowHero(id?: number, showTime?: number) {
        gdk.Timer.clearAll(this);
        if (!cc.isValid(this.node) || !this.node.activeInHierarchy) {
            // 节点无效
            this.heroNode.active = false;
        } else if ((!this.curCfg || !this.curCfg.show || !this.curCfg.show.length) && !id) {
            // 数据无效且无自传id
            this.heroNode.active = false;
        } else {
            let typeId = id ? id : this.curCfg.show[MathUtil.rnd(0, this.curCfg.show.length - 1)];
            let heroCfg1 = ConfigManager.getItemById(HeroCfg, typeId);
            if (!heroCfg1) {
                CC_DEBUG && cc.error(`HeroCfg 缺少配置, id: ${typeId}`);
                this.heroNode.active = false;
                return;
            }
            this.heroNode.active = true;
            let heroSpine = this.heroNode.getChildByName('spine').getComponent(sp.Skeleton);
            let heroName = cc.find('layout/name', this.heroNode).getComponent(cc.Label);
            let groupIcon = cc.find('layout/group', this.heroNode);
            HeroUtils.setSpineData(this.node, heroSpine, heroCfg1.skin, true, false);
            heroName.getComponent(cc.Label).string = heroCfg1.name;
            let quality = ConfigManager.getItemById(Hero_starCfg, heroCfg1.star_min).color;
            heroName.node.color = BagUtils.getColor(quality);
            GlobalUtil.setSpriteIcon(this.node, groupIcon, GlobalUtil.getGroupIcon(heroCfg1.group[0]));
            gdk.Timer.once(showTime ? showTime : 5000, this, this._updateShowHero);
        }
    }

    _updateSpine() {
        this.summonSp.node.active = false;
        this.summonSp.setCompleteListener(null);
        GlobalUtil.setSpineData(this.node, this.summonSp, null);
        this.idleSp.node.active = true;
        GlobalUtil.setSpineData(this.node, this.idleSp, this.idleSpUrl[0], true, 'stand', true);
    }

    _firstIn: boolean = true;
    @gdk.binding("roleModel.vipLv")
    _updateProgress() {
        let vipLv = this.roleModel.vipLv;
        this.arrowNodes.forEach(n => { n.active = true; });
        // let maxH = 319;
        // full arrow3 y:20, two y:-4 one y:0      topView  y:+13
        this.maxTime = 70;
        this.arrowNodes[1].getChildByName('n').y = 3;//fix y
        this.arrowNodes[3].getChildByName('n').y = 5;//fix y
        if (vipLv < 5) {
            this.maxTime = 55;
            this.arrowNodes[0].active = false;
            this.arrowNodes[1].getChildByName('n').y = 5;//fix y
            this.arrowNodes[3].getChildByName('n').y = -15;//fix y
        }
        if (vipLv < 3) {
            this.maxTime = 30;
            this.arrowNodes[1].active = false;
            this.arrowNodes[2].active = false;
            this.arrowNodes[3].getChildByName('n').y = 0;//fix y
        }
        let chipNum = BagUtils.getItemNumById(140016);
        let nodes = [this.arrowNodes[0], this.arrowNodes[1], this.arrowNodes[3]];
        let tN = [70, 55, 30];
        nodes.forEach((n, idx) => {
            let btn = cc.find(`n`, n).getComponent(cc.Button);
            btn.interactable = chipNum >= tN[idx];
            GlobalUtil.setAllNodeGray(n, chipNum >= tN[idx] ? 0 : 1);
            let lab = cc.find(`n/lab`, n);
            lab.stopAllActions();
            lab.setScale(1);
            if (chipNum >= tN[idx]) {
                lab.runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.scaleTo(.5, 1.3, 1.3),
                            cc.scaleTo(.5, 1, 1)
                        )
                    )
                );
            }
        });
        if (this.CurChipNum !== chipNum) {
            if (this._firstIn) {
                this.CurChipNum = chipNum;
                this._firstIn = false;
                return;
            }
            if (this.proTween) {
                this.proTween.stop();
                this.proTween = null;
            }
            this.proTween = cc.tween().target(this)
                .to(.5, { CurChipNum: chipNum })
                .call(() => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    this.proTween = null;
                })
                .start()
        }
        else {
            this.CurChipNum = chipNum;
        }
    }

    _curChipNum: number = 0;
    get CurChipNum(): number { return this._curChipNum; }
    set CurChipNum(v: number) {
        this._curChipNum = v;
        let maxH = 319;
        this.progress.height = Math.min(maxH, Math.floor(maxH / this.maxTime * v));
        this.proTopView.y = this.progress.height + 13;
        this.proTopView.active = v >= 0 && this.progress.height >= 45;
    }
}
