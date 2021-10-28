import BagModel, { BagItem } from '../../../common/models/BagModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RewardCtrl, { RewardInfoType } from '../../../common/widgets/RewardCtrl';
import { Item_composeCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RewardType } from '../../../common/widgets/TaskRewardCtrl';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainComposeTipCtrl")
export default class MainComposeTipCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null

    @property(cc.Prefab)
    composePreItem: cc.Prefab = null

    list: ListView = null
    _totalTime = 5
    _count = 0
    _isComposeClisk: boolean = false

    get bagModel(): BagModel {
        return ModelManager.get(BagModel);
    }

    onEnable() {
        this._updateViewInfo()
    }

    // onDisable() {
    //     this.bagModel.heroChips = []
    // }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.composePreItem,
            cb_host: this,
            column: 3,
            gap_x: 10,
            async: true,
            direction: ListViewDir.Horizontal,
        })
    }

    _updateViewInfo() {
        this._initListView()
        let chips: BagItem[] = this.bagModel.heroChips
        let datas = []
        for (let i = 0; i < chips.length; i++) {
            datas.push({ typeId: chips[i].itemId, num: chips[i].itemNum })
        }
        this.list.set_data(datas)

        let width = 100
        let maxNum = Math.min(datas.length, 3)
        this.scrollView.node.x = -width * maxNum / 2

        this._count = 0
        gdk.Timer.loop(1000, this, this._updateTime)
        this._updateTime()
    }

    _updateTime() {
        if (this._count >= this._totalTime) {
            gdk.Timer.clear(this, this._updateTime)
            this.composeFunc()
            return
        }
        this.timeLab.string = `${this._totalTime - this._count}秒后自动合成`
        this._count++
    }

    // closeFunc() {
    //     this.node.active = false
    // }

    closeNoComposeFunc() {
        gdk.Timer.clear(this, this._updateTime)
        this.bagModel.heroChips = []
        this._isComposeClisk = false
        this.close()
    }

    composeFunc() {
        gdk.Timer.clear(this, this._updateTime)
        let chips: BagItem[] = this.bagModel.heroChips
        let goodList = []
        chips.forEach((item, index) => {
            gdk.Timer.once(100 * index, this, () => {
                let composeCfg = ConfigManager.getItemById(Item_composeCfg, item.itemId)
                let msg = new icmsg.ItemComposeReq()
                msg.stuffId = composeCfg.id
                msg.num = Math.floor(item.itemNum / composeCfg.amount)
                NetManager.send(msg, (data: icmsg.ItemComposeRsp) => {
                    goodList = goodList.concat(data.list)
                })
            })
        });

        if (!this._isComposeClisk) {
            this._isComposeClisk = true
            gdk.Timer.once(500, this, () => {
                let info: RewardInfoType = {
                    goodList: goodList,
                    showType: RewardType.NORMAL
                }
                if (goodList.length == 0) {
                    this.closeNoComposeFunc()
                    return
                }
                gdk.panel.open(PanelId.Reward, (node: cc.Node) => {
                    let comp = node.getComponent(RewardCtrl)
                    comp.initRewardInfo(info)
                    this.closeNoComposeFunc()
                })
            })
        }


    }
}