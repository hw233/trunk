import ActivityModel from '../../model/ActivityModel';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from '../../../lottery/ctrl/HeroDetailViewCtrl';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activity_land_giftsCfg, HeroCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-02-02 16:55:17 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/kfLogin/KfLoginViewCtrl")
export default class KfLoginViewCtrl extends gdk.BasePanel {
    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null

    @property(cc.Node)
    titleImg: cc.Node = null;

    @property(cc.Label)
    heroTips: cc.Label = null;

    @property(cc.Button)
    heroLook: cc.Button = null;

    @property(cc.Node)
    daysNode: cc.Node = null;

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }
    titleUrl: string[] = ['view/act/texture/kfLogin/8tdl_ziti01', 'view/act/texture/kfLogin/8tdl_ziti02']
    onEnable() {
        NetManager.on(icmsg.ActivityLandGiftInfoReq.MsgType, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateView();
        }, this);
        NetManager.send(new icmsg.ActivityLandGiftInfoReq());
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    _updateView() {
        let day = this.actModel.kfLoginDays;
        let isPassSecond = day >= 2 && (this.actModel.kfLoginDaysReward & 1 << 1) >= 1;
        let heroId = isPassSecond ? 300031 : 300066;
        let idx = isPassSecond ? 8 : 2;
        let url = isPassSecond ? this.titleUrl[1] : this.titleUrl[0];
        let desc = ConfigManager.getItemByField(Activity_land_giftsCfg, 'cycle', idx).desc;
        GlobalUtil.setSpriteIcon(this.node, this.titleImg, url);
        this.heroTips.string = desc;
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroId);
        HeroUtils.setSpineData(this.node, this.heroSpine, heroCfg.skin, true, false);
        this.heroLook.node.targetOff(this);
        this.heroLook.node.on(cc.Node.EventType.TOUCH_END, () => {
            gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
                let comp = node.getComponent(HeroDetailViewCtrl)
                comp.initHeroInfo(heroCfg)
            })
        }, this);
        this._updateReward();
    }

    _updateReward() {
        this.daysNode.children.forEach((n, idx) => {
            let bg = n.getChildByName('bg');
            let daysLab = n.getChildByName('dayLab');
            let nameLab = n.getChildByName('nameLab');
            let slot = n.getChildByName('UiSlotItem').getComponent(UiSlotItem);
            let mask = n.getChildByName('mask');
            let cfg = ConfigManager.getItemByField(Activity_land_giftsCfg, 'cycle', idx + 1);
            let isCurDay = this.actModel.kfLoginDays == idx + 1;
            let isGet = (this.actModel.kfLoginDaysReward & 1 << idx) >= 1;
            GlobalUtil.setSpriteIcon(this.node, bg, `view/act/texture/kfLogin/${isCurDay && !isGet ? '8tdl_kelingqu' : '8tdl_weilingqu'}`);
            daysLab.color = cc.color().fromHEX(['#FFFED3', '#FFD3D3'][isCurDay && !isGet ? 0 : 1])
            nameLab.color = cc.color().fromHEX(['#FFFB93', '#FF9393'][isCurDay && !isGet ? 0 : 1]);
            nameLab.getComponent(cc.Label).string = BagUtils.getConfigById(cfg.rewards[0]).name;
            mask.active = isGet;
            slot.updateItemInfo(cfg.rewards[0], cfg.rewards[1]);
            let btn = slot.node.getChildByName('btn');
            btn.targetOff(this);
            btn.on(cc.Node.EventType.TOUCH_START, () => {
                if (!isGet && isCurDay) {
                    let req = new icmsg.ActivityLandGiftAwardReq();
                    NetManager.send(req, (resp: icmsg.ActivityLandGiftAwardRsp) => {
                        if (!cc.isValid(this.node)) return;
                        if (!this.node.activeInHierarchy) return;
                        this._updateView();
                        GlobalUtil.openRewadrView(resp.list);
                    }, this);
                }
                else {
                    GlobalUtil.openItemTips({
                        series: null,
                        itemId: cfg.rewards[0],
                        itemNum: cfg.rewards[1],
                        type: BagUtils.getItemTypeById(cfg.rewards[0]),
                        extInfo: null
                    }, false, false);
                }
            }, this);
        });
    }
}
