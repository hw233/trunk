import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideModel from '../../../guide/model/GuideModel';
import ModelManager from '../../../common/managers/ModelManager';
import { InstanceEventId } from '../enum/InstanceEnumDef';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RewardInfoType } from '../../../common/widgets/RewardCtrl';

/** 
  * @Description: 挂机奖励界面
  * @Author: yaozu.hu
  * @Date: 2019-12-18 17:12:24 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:36:30
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/InstanceHangRewardViewCtrl")
export default class InstanceHangRewardViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    titleBg: cc.Node = null

    @property(sp.Skeleton)
    titleSpine: sp.Skeleton = null

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.ScrollView)
    showScrollView: cc.ScrollView = null

    @property(cc.Node)
    showContent: cc.Node = null

    @property(cc.Node)
    closeTips: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.Prefab)
    showItem: cc.Prefab = null

    goodList: icmsg.GoodsInfo[] = []

    list: ListView = null

    showList: ListView = null;

    canClose: boolean = false;
    click: boolean = false;
    column: number = 5;
    showColumn: number = 5;
    showRow: number = 1;
    get guideModel(): GuideModel {
        return ModelManager.get(GuideModel);
    }

    onEnable() {
        gdk.e.on(InstanceEventId.HANGREWARD_OPEN_BOX, this.openBox, this);
    }
    onDisable() {
        gdk.e.targetOff(this);
    }

    onDestroy() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
        if (this.showList) {
            this.showList.destroy()
            this.showList = null;
        }
        gdk.Timer.clearAll(this)
    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }

        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            column: this.column,
            gap_x: 0,
            gap_y: 0,
            direction: ListViewDir.Vertical,
        })

        this.showList = new ListView({
            scrollview: this.showScrollView,
            mask: this.showScrollView.node,
            content: this.showContent,
            item_tpl: this.showItem,
            cb_host: this,
            async: true,
            column: this.showColumn,
            gap_x: 0,
            gap_y: 0,
            direction: ListViewDir.Vertical,
        })
    }

    initRewardInfo(info: RewardInfoType, boxNum: number = 1) {
        this.canClose = false;
        this.goodList = info.goodList
        if (this.goodList.length < 5) {
            this.column = this.goodList.length
        } else {
            this.column = 5;
        }
        this.showColumn = boxNum < 5 ? boxNum : 5;
        let row = Math.ceil(this.goodList.length / this.column)
        let showRow = Math.ceil(boxNum / this.showColumn)


        let showWidth = Math.min(5, boxNum) * 110
        let showHeight = showRow * 105 + 10
        showHeight = Math.min(showHeight, 210)

        //音效
        if (GlobalUtil.isSoundOn) {
            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.success)
        }

        // 计算scrollview的宽高
        let svWidth = this.column * 110
        let svHeight = row * 105 + 10
        svHeight = Math.min(svHeight, 210)


        let bgHeihgt = svHeight + showHeight + 220
        this.bg.height = bgHeihgt
        this.titleBg.y = bgHeihgt / 2 - 65
        this.closeTips.y = -bgHeihgt / 2 - 60
        this.titleSpine.setAnimation(0, "UI_gxhd", false)

        this.scrollView.node.setContentSize(cc.size(svWidth, svHeight))
        this.scrollView.node.x = -svWidth / 2 + 5
        this.scrollView.node.y = bgHeihgt / 2 - 100//svHeight//- 20

        this.showScrollView.node.setContentSize(cc.size(showWidth, showHeight))
        this.showScrollView.node.x = -showWidth / 2 + 5
        this.showScrollView.node.y = -40

        this._initListView()
        let newList = []
        for (let i = 0; i < boxNum; i++) {
            newList.push({
                index: i,
                maxNum: boxNum,
                state: 1,
            });
        }

        gdk.Timer.once(200, this, () => {
            this.showList.set_data(newList)
        })

        if (boxNum > 10) {
            for (let i = 0; i < showRow - 2; i++) {
                gdk.Timer.once(1000 * i + 1500, this, () => {
                    this.showScrollView.stopAutoScroll()
                    this.showScrollView.scrollToOffset(cc.v2(0, 110 * (i + 1)), 0.5);
                })
            }
        }
        this.showRow = showRow;
    }

    close() {
        if (this.canClose) {
            super.close()
        } else if (!this.click) {
            this.click = true;
            if (this.showRow > 2) {
                gdk.Timer.clearAll(this)
                this.showScrollView.stopAutoScroll()
                this.showScrollView.scrollToOffset(cc.v2(0, 110 * (this.showRow - 2)), 0.5);
                //设置点击关闭参数
                gdk.Timer.once(1200, this, () => {
                    this.canClose = true;
                })
            }
        }
    }

    //接收宝箱打开消息
    openBox(e: gdk.Event) {

        //设置所有的宝箱为打开状态
        gdk.Timer.once(100, this, () => {
            this.showList.datas.forEach(data => {
                data.state = 2;
            })
        })
        //展示奖励物品
        gdk.Timer.once(200, this, () => {
            this.list.set_data(GlobalUtil.getEffectItemList(this.goodList, false, true, true, true))
        })
        //设置点击关闭参数
        gdk.Timer.once(1200, this, () => {
            this.canClose = true;
        })
    }
}
