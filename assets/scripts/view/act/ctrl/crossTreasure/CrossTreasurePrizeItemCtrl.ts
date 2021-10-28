import ActivityModel from '../../model/ActivityModel';
import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Operation_treasure_poolCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-24 13:40:46 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/crossTreasure/CrossTreasurePrizeItemCtrl")
export default class CrossTreasurePrizeItemCtrl extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    slot: cc.Node = null;

    @property(cc.Label)
    leftLab: cc.Label = null;

    @property(cc.Node)
    selectNode: cc.Node = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    tagNode: cc.Node = null;

    @property(cc.Node)
    playersNode: cc.Node = null;

    get model(): ActivityModel { return ModelManager.get(ActivityModel); }

    bgUrl: string[] = ['view/act/texture/crossTreasure/kfxb_lankuang', 'view/act/texture/crossTreasure/kfxb_zikuang'];
    cfg: Operation_treasure_poolCfg;
    info: number;
    isSelect: boolean = false;
    updateView(cfg: Operation_treasure_poolCfg, info: number) {
        [this.cfg, this.info] = [cfg, info];
        GlobalUtil.setSpriteIcon(this.node, this.bg, this.bgUrl[Math.floor(this.cfg.order % 2)]);
        let scale = cfg.order == 5 ? 1 : 0.8;
        this.slot.setScale(scale, scale);
        let ctrl = this.slot.getComponent(UiSlotItem);
        ctrl.updateItemInfo(cfg.show[0], cfg.show[1]);
        ctrl.itemInfo = {
            series: null,
            itemId: cfg.show[0],
            itemNum: cfg.show[1],
            type: BagUtils.getItemTypeById(cfg.show[0]),
            extInfo: null
        };
        this.leftLab.string = `${gdk.i18n.t('i18n:CROSS_TREASURE_TIP4')}${cfg.amount - info}/${cfg.amount}`
        this.mask.active = info == cfg.amount;
        this.selectNode.active = this.isSelect;
        this.tagNode.active = this.cfg.tag >= 1;
        if (this.tagNode.active) {
            let url = [`view/act/texture/crossTreasure/kfxb_xiyoubiaoqian`, `view/act/texture/crossTreasure/kfxb_zhongjibiaoqian`];
            GlobalUtil.setSpriteIcon(this.node, this.tagNode, url[this.cfg.tag - 1]);
        }
        let names = this.model.cTreasureOrderName[this.cfg.order];
        if (this.cfg.showname == 1 && names && names.length > 0) {
            this.playersNode.active = true;
            this.playersNode.children.forEach((n, idx) => {
                let name = names[idx];
                n.active = !!name;
                if (n.active) {
                    n.getComponent(cc.Label).string = name + '获得';
                }
            });
        }
        else {
            this.playersNode.active = false;
        }
    }

    updateSelect(b: boolean) {
        this.isSelect = !this.isSelect;
        this.selectNode.active = this.isSelect;
    }
}
