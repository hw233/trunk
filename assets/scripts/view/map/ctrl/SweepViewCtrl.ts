import BagUtils from '../../../common/utils/BagUtils';
import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel, { CopyEventId } from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import { Copy_stageCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-05-07 11:28:43 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/SweepViewCtrl")
export default class SweepViewCtrl extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    rewardItemPreb: cc.Prefab = null;

    @property(cc.Label)
    goldLab: cc.Label = null;

    @property(cc.Label)
    heroExpLab: cc.Label = null;

    @property(cc.Label)
    expLab: cc.Label = null;

    list: ListView = null;

    get model(): CopyModel { return ModelManager.get(CopyModel); }

    onLoad() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.rewardItemPreb,
                column: 4,
                gap_x: 15,
                gap_y: 10,
                async: false,
                direction: ListViewDir.Vertical,
            });
        }
    }

    start() {
    }

    onEnable() {
        gdk.e.on(CopyEventId.RSP_COPY_MAIN_RAIDS, this._updateItem, this)

        let newStageCfg = ConfigManager.getItemById(Copy_stageCfg, this.model.latelyStageId)
        let stageCfg = ConfigManager.getItemById(Copy_stageCfg, newStageCfg.pre_condition)
        if (stageCfg) {
            this.goldLab.string = `${stageCfg.drop_show2[0]}/${gdk.i18n.t("i18n:MAP_TIP3")}`
            this.expLab.string = `${stageCfg.drop_show2[1]}/${gdk.i18n.t("i18n:MAP_TIP3")}`
            this.heroExpLab.string = `${stageCfg.drop_show2[2]}/${gdk.i18n.t("i18n:MAP_TIP3")}`
        } else {
            this.goldLab.string = `0/${gdk.i18n.t("i18n:MAP_TIP3")}`
            this.heroExpLab.string = `0/${gdk.i18n.t("i18n:MAP_TIP3")}`
            this.expLab.string = `0/${gdk.i18n.t("i18n:MAP_TIP3")}`
        }

    }

    onDisable() {
        this.list && this.list.clear_items();
        gdk.e.targetOff(this);
    }

    _updateItem(e: gdk.Event) {
        let stageId = e.data.id;
        let rewards = e.data.rewards;
        this._initListView(e.data.rewards);
        let length = this.content.children.length;
        for (let i = 0; i < length; i++) {
            let item = this.content.children[i];
            let pos = item.position;
            item.scaleX = 0.9;
            item.scaleY = 0.9;
            item.opacity = 0;
            item.runAction(cc.sequence(
                cc.delayTime(0.1 * (i + 1)),
                cc.callFunc(() => {
                    item.opacity = 255
                    let itemConfig = <any>BagUtils.getConfigById(rewards[i].typeId)
                    if (itemConfig && GlobalUtil.isSoundOn) {
                        if (itemConfig.color == 3 || itemConfig.color == 4) {
                            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.result)
                        } else {
                            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.common)
                        }
                    }
                }),
                cc.spawn(cc.moveTo(0.1, pos), cc.scaleTo(0.1, 1, 1))
            ));
        }
    }

    _initListView(rewards: icmsg.GoodsInfo[]) {
        // 奖励列表
        let list: any[] = [];
        rewards = GlobalUtil.sortGoodsInfo(rewards);
        for (let i = 0, n = rewards.length; i < n; i++) {
            let e = rewards[i];
            let extInfo = { itemId: e.typeId, itemNum: e.num };
            let itemId = e.typeId;
            let type = BagUtils.getItemTypeById(itemId);
            let item = {
                series: itemId,
                itemId: itemId,
                itemNum: extInfo.itemNum,
                type: type,
                extInfo: extInfo,
            };
            list.push({ index: i, info: item });
        }
        this.content.children.forEach(item => {
            item.stopAllActions();
        });
        this.list.clear_items();
        this.list.set_data(list, true);
    }
}
