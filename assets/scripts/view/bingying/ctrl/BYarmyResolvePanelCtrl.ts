import BYModel from '../model/BYModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import SoldierModel from '../../../common/models/SoldierModel';
import { BagEvent } from '../../bag/enum/BagEvent';
import { BYEventId } from '../enum/BYEventId';
import { Soldier_army_skinCfg, Soldier_skin_resolveCfg } from '../../../a/config';

/** 
 * @Description: 兵营-兵团融甲界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-23 17:17:01
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmyResolvePanelCtrl")
export default class BYarmyResolvePanelCtrl extends gdk.BasePanel {

    @property([sp.Skeleton])
    soliderSpines: sp.Skeleton[] = [];

    @property(cc.Label)
    lvLb: cc.Label = null;

    @property(cc.Node)
    iconNode: cc.Node = null;
    @property(cc.Node)
    iconSp: cc.Node = null;
    @property(cc.Node)
    addSpNode: cc.Node = null;
    @property(cc.Label)
    atkLb: cc.Label = null;
    @property(cc.Label)
    hpLb: cc.Label = null;
    @property(cc.Label)
    defLb: cc.Label = null;
    @property(cc.Label)
    numLb: cc.Label = null;
    @property(cc.Node)
    red1Node: cc.Node = null;
    @property(cc.Node)
    red2Node: cc.Node = null;
    @property(cc.Node)
    resolveBtnNode: cc.Node = null;
    @property(cc.Node)
    tipsNode: cc.Node = null;
    @property(cc.Node)
    maxLvTip: cc.Node = null;
    @property(sp.Skeleton)
    animSpine: sp.Skeleton = null;

    canSend: boolean = false;
    goodInfos: icmsg.GoodsInfo[] = [];
    curNum: number = 0;
    limitNum: number = 1;
    get byModel() { return ModelManager.get(BYModel); }
    cfg: Soldier_skin_resolveCfg;
    onEnable() {

        //设置士兵Spine
        let soliderType = [1, 3, 4];
        soliderType.forEach((type, idx) => {
            let cfgs = ConfigManager.getItemsByField(Soldier_army_skinCfg, 'type', type);
            let tem = cfgs[0];
            cfgs.forEach(cfg => {
                if (this.byModel.byarmyState.skins.indexOf(cfg.skin_id) >= 0) {
                    tem = cfg;
                }
            })
            let path = `spine/monster/${tem.skin}/ui/${tem.skin}`
            GlobalUtil.setSpineData(this.node, this.soliderSpines[idx], path, true, 'stand_s', true);
        })


        this.showAddInfo()
        this.selectSkinInfo();
        this.animSpine.setAnimation(0, 'stand2', true);
        gdk.e.on(BYEventId.BYARMY_RESOLVE_SELECTSKIN, this.updateSelect, this);
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this.refreshRedPoint, this);
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this.refreshRedPoint, this);
        gdk.e.on(BagEvent.REMOVE_ITEM, this.refreshRedPoint, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this)
    }

    updateSelect(e) {
        this.goodInfos = e.data;
        this.selectSkinInfo()
    }

    selectSkinInfo() {
        this.cfg = ConfigManager.getItemByField(Soldier_skin_resolveCfg, 'resolve_lv', this.byModel.byarmyState.level + 1);
        this.iconNode.active = this.cfg != null;
        this.resolveBtnNode.active = this.cfg != null;
        this.tipsNode.active = this.cfg != null;
        this.maxLvTip.active = this.cfg == null;

        if (this.cfg) {
            this.limitNum = this.cfg.skin_consumption
        }
        this.curNum = 0;
        this.goodInfos.forEach(info => {
            this.curNum += info.num;
        })
        this.lvLb.string = '' + this.byModel.byarmyState.level
        this.iconSp.active = this.curNum > 0;
        this.addSpNode.active = this.curNum == 0;

        this.numLb.string = this.curNum + '/' + this.limitNum;
        this.canSend = this.curNum >= this.limitNum;
        this.refreshRedPoint();
    }

    //设置红点
    refreshRedPoint() {
        let red = RedPointUtils.is_BYarmy_skin_resolve_redPoint();
        this.red1Node.active = red && this.curNum < this.limitNum;
        this.red2Node.active = false;

    }
    //刷新增加的属性
    showAddInfo() {
        let atkNum = 0;
        let hpNum = 0;
        let defNum = 0;
        let cfgs = ConfigManager.getItems(Soldier_skin_resolveCfg, (cfg: Soldier_skin_resolveCfg) => {
            if (cfg.resolve_lv <= this.byModel.byarmyState.level) {
                atkNum += cfg.atk_all;
                hpNum += cfg.hp_all;
                defNum += cfg.def_all;
                return true
            }
            return false
        })
        this.atkLb.string = '+' + (atkNum / 100) + '%'
        this.hpLb.string = '+' + (hpNum / 100) + '%'
        this.defLb.string = '+' + (defNum / 100) + '%'
    }

    selectSkinView() {
        gdk.panel.setArgs(PanelId.BYarmyResolveMaterialsView, [this.limitNum, this.goodInfos]);
        gdk.panel.open(PanelId.BYarmyResolveMaterialsView);
    }

    resolveBtnClick() {

        if (!this.canSend) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:BYARMY_TIP19'))
        } else {
            let msg = new icmsg.SoldierSkinComposeReq()
            msg.items = this.goodInfos;
            NetManager.send(msg, (rsp: icmsg.SoldierSkinComposeRsp) => {
                this.byModel.byarmyState.level = rsp.level;
                this.lvLb.string = '' + this.byModel.byarmyState.level
                this.goodInfos = [];
                let t = this.animSpine.setAnimation(0, 'stand', false);
                if (t) {
                    this.animSpine.setCompleteListener((trackEntry, loopCount) => {
                        let name = trackEntry.animation ? trackEntry.animation.name : '';
                        if (name === "stand") {
                            this.showAddInfo()
                            this.selectSkinInfo();
                            this.animSpine.setAnimation(0, 'stand2', true);
                        }
                    })
                }
                //清空本地战斗数据缓存
                let model = ModelManager.get(HeroModel)
                model.fightHeroIdxTower = {};
                model.fightHeroIdx = {};
                model.heroAttrs = {};
                let sModel = ModelManager.get(SoldierModel)
                sModel.heroSoldiers = {}
            })
        }

    }


}
