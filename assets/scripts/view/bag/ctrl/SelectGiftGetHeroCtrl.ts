import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, HeroCfg } from '../../../a/config';
import { SelectGiftInfo } from './SelectGiftViewCtrl';

/** 
  * @Description: 可选物品礼包确认框
  * @Author: luoyong
  * @Date: 2019-09-12 13:50:11
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:53:14
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/SelectGiftGetHeroCtrl")
export default class SelectGiftGetHeroCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    getItem: UiSlotItem = null

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.RichText)
    desc: cc.RichText = null

    @property(cc.Label)
    itemName: cc.Label = null

    _getData: SelectGiftInfo = null

    start() {

    }

    initRewardInfo(data: SelectGiftInfo) {
        let cfg = BagUtils.getConfigById(data.itemId)
        this._getData = data
        this.itemName.string = cfg.name
        this.itemName.node.color = BagUtils.getColor(cfg.defaultColor)
        this.itemName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(cfg.defaultColor);
        if (cfg instanceof HeroCfg) {
            this.getItem.group = cfg.group[0];
            this.getItem.starNum = cfg.star_min;
            this.careerIcon.active = true;
            let type = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', cfg.career_id).career_type;
            GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        }
        else {
            this.getItem.group = 0;
            this.getItem.starNum = 0;
            this.careerIcon.active = false;;
        }
        this.getItem.updateItemInfo(data.itemId, data.num)
        this.desc.string = cfg['desc'] || '';
    }

    getFunc() {
        //礼包
        if (this._getData.giftType == -1) {
            let goodInfo: icmsg.GoodsInfo = new icmsg.GoodsInfo()
            goodInfo.num = 1
            goodInfo.typeId = this._getData.mainId
            let msg = new icmsg.ItemDisintReq()
            msg.items = [goodInfo];
            NetManager.send(msg, () => {
                this.close()
            })
            return;
        }

        let good: icmsg.GoodsInfo = new icmsg.GoodsInfo()
        good.typeId = this._getData.mainId
        good.num = 1
        let msg = new icmsg.ItemDisintReq()
        msg.items = [good]
        msg.index = this._getData.index
        NetManager.send(msg, () => {
            this.close()
            gdk.panel.hide(PanelId.SelectGift)
        }, this)
    }
}
