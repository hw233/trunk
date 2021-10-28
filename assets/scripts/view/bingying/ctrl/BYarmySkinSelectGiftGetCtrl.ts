import BagUtils from '../../../common/utils/BagUtils';
import BYModel from '../model/BYModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../common/models/BagModel';
import { ItemCfg, Soldier_army_skinCfg, Soldier_army_trammelCfg } from '../../../a/config';
import { SelectGiftInfo } from '../../bag/ctrl/SelectGiftViewCtrl';

/** 
  * @Description: 可选物品礼包确认框
  * @Author: luoyong
  * @Date: 2019-09-12 13:50:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-08 18:24:26
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmySkinSelectGiftGetCtrl")
export default class BYarmySkinSelectGiftGetCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    getItem: UiSlotItem = null

    @property(cc.Label)
    curNum: cc.Label = null

    @property(cc.RichText)
    desc: cc.RichText = null

    @property(cc.Label)
    itemName: cc.Label = null

    @property(cc.EditBox)
    numEditBox: cc.EditBox = null

    @property(cc.Sprite)
    typeSp: cc.Sprite = null;
    @property(cc.Label)
    typeLb: cc.Label = null;
    @property(cc.Node)
    itemLayout: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    _getData: SelectGiftInfo = null

    maxNum: number = 0;
    getNum: number = 0;

    itemCfg: ItemCfg;

    cfg: Soldier_army_skinCfg;
    get byModel() { return ModelManager.get(BYModel); }

    start() {

    }

    initRewardInfo(data: SelectGiftInfo) {
        this._getData = data
        this.itemCfg = <ItemCfg>BagUtils.getConfigById(data.itemId)
        this.itemName.string = this.itemCfg.name
        this.itemName.node.color = BagUtils.getColor(this.itemCfg.color)
        this.itemName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(this.itemCfg.color);
        this.getItem.updateItemInfo(data.itemId, data.num)

        let skin_id = this.itemCfg.func_args[0];
        let cfgs = ConfigManager.getItems(Soldier_army_trammelCfg, (tem: Soldier_army_trammelCfg) => {
            if (tem.skin_id.indexOf(skin_id) >= 0) {
                return true
            }
            return false;
        })
        let byarmyState = this.byModel.byarmyState
        this.itemLayout.removeAllChildren()
        cfgs.forEach((cfg, index) => {
            let node = cc.instantiate(this.itemPre)
            let name = node.getChildByName('name').getComponent(cc.Label)
            let num = node.getChildByName('num').getComponent(cc.Label)
            let btnGet = node.getChildByName('btnGet').getComponent(cc.Button)
            let state = node.getChildByName('state')
            name.string = cfg.trammel_name;
            let haveNum = 0;
            let haveSkin = byarmyState.skins.indexOf(skin_id) >= 0;
            cfg.skin_id.forEach(skinId => {
                if (byarmyState.skins.indexOf(skinId) >= 0) {
                    haveNum += 1;
                }
            })
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "BYarmySkinSelectGiftGetCtrl";
            eventHandler.handler = "itemClick";
            eventHandler.customEventData = cfg.trammel_id + ''
            btnGet.clickEvents[0] = eventHandler;
            state.active = !haveSkin && haveNum == cfg.skin_id.length - 1;
            num.string = haveNum + '/' + cfg.skin_id.length
            node.setParent(this.itemLayout)
        })

        this.curNum.string = `${BagUtils.getItemNumById(data.itemId)}`
        this.desc.string = GlobalUtil.makeItemDes(data.itemId);

        let bagItem = BagUtils.getItemById(data.mainId) as BagItem;
        this.maxNum = bagItem.itemNum;
        if (bagItem.itemId == 130090) {
            this.maxNum = 1;
        }
        this.getNum = 1;

        this.updateGetNum();
    }

    itemClick(event: any, id: string) {
        let trammel_id = parseInt(id)
        gdk.panel.setArgs(PanelId.BYarmyView, 1, trammel_id)
        gdk.panel.open(PanelId.BYarmyView);

    }

    updateGetNum() {
        let getNum = this.getNum;
        if (getNum > this.maxNum) {
            getNum = this.maxNum;
            this.getNum = getNum;
        } else if (getNum < 1) {
            getNum = 1;
            this.getNum = getNum;
        }
        this.numEditBox.string = getNum.toString();


    }

    //减数量
    onMinusBtn() {
        this.getNum--;
        this.updateGetNum();
    }

    //加数量
    onPlusBtn() {
        this.getNum++;
        this.updateGetNum();
    }

    //最大数量
    onMaxBtn() {
        this.getNum = this.maxNum;
        this.updateGetNum();
    }

    //最小数量
    onMinBtn() {
        this.getNum = 1;
        this.updateGetNum();
    }

    onEditorDidEnded() {
        this.getNum = parseInt(this.numEditBox.string) || 1;
        this.updateGetNum();
    }

    getFunc() {
        //礼包
        if (this._getData.giftType == -1) {
            let goodInfo: icmsg.GoodsInfo = new icmsg.GoodsInfo()
            goodInfo.num = this.getNum
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
        good.num = this.getNum;
        let msg = new icmsg.ItemDisintReq()
        msg.items = [good]
        msg.index = this._getData.index
        NetManager.send(msg, () => {
            this.close()
            gdk.panel.hide(PanelId.SelectGift)
        }, this)
    }
}
