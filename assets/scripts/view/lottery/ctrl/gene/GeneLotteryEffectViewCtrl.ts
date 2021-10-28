import BagModel from '../../../../common/models/BagModel';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideModel from '../../../../guide/model/GuideModel';
import LotteryModel, { LotteryType } from '../../model/LotteryModel';
import ModelManager from '../../../../common/managers/ModelManager';
import MusicId from '../../../../configs/ids/MusicId';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { GeneCfg, LuckydrawCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { LotteryEventId } from '../../enum/LotteryEventId';
import { StoreMenuType } from '../../../store/ctrl/StoreViewCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-24 12:03:49 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneLotteryEffectViewCtrl')
export default class GeneLotteryEffectViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    titleBg: cc.Node = null

    @property(sp.Skeleton)
    titleSpine: sp.Skeleton = null

    @property(cc.Button)
    btnAgain: cc.Button = null

    @property(cc.Button)
    btnClose: cc.Button = null

    @property(cc.Node)
    costIcon: cc.Node = null

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Node)
    costLayout: cc.Node = null

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    closeTips: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    goodList: icmsg.GoodsInfo[] = []
    list: ListView = null
    column: number = 5;

    /**
    * 随机范围(random1~random2之间)
    */
    random1: number = -200
    random2: number = 200
    createTime: number = 0.1
    speed: number = 1000
    luckydrawCfg: LuckydrawCfg | GeneCfg;
    timeCount = 0
    canClose: boolean = false;

    _isClickAgain = false

    get roleModel(): RoleModel {
        return ModelManager.get(RoleModel);
    }
    get lotteryModel(): LotteryModel {
        return ModelManager.get(LotteryModel)
    }
    get guideModel(): GuideModel {
        return ModelManager.get(GuideModel);
    }

    get bagModel(): BagModel {
        return ModelManager.get(BagModel);
    }

    start() {

    }

    onDestroy() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
        gdk.Timer.clearAll(this)

        //碎片合成提示窗口
        if (!this._isClickAgain) {
            if (this.bagModel.heroChips.length > 0) {
                gdk.panel.open(PanelId.MainComposeTip)
            }
        }
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
            gap_x: -40,
            gap_y: -100,
            direction: ListViewDir.Vertical,
        })
    }

    showReward(list, immediately: boolean = false, cfg?: any) {
        this.btnAgain.node.active = false
        this.btnClose.node.active = false

        this.goodList = list
        if (this.goodList.length < 5) {
            this.column = this.goodList.length
        }
        let row = Math.ceil(this.goodList.length / this.column)

        // 计算scrollview的宽高
        let svWidth = this.column * 140
        let svHeight = row * 180
        svHeight = Math.min(svHeight, 600)

        let bgHeihgt = svHeight + 110
        this.bg.height = bgHeihgt
        this.titleBg.y = bgHeihgt / 2 - 65
        this.closeTips.y = -bgHeihgt / 2 - 60
        this.titleSpine.setAnimation(0, "UI_gxhd", false)

        this.scrollView.node.setContentSize(cc.size(svWidth, svHeight))
        this.scrollView.node.x = -svWidth / 2
        this.scrollView.node.y = svHeight / 2

        //单抽 带一个 额外奖励(时空精粹)
        if (this.goodList.length <= 2) {
            this.scrollView.node.x -= 20
        }
        if (cfg && cfg instanceof GeneCfg) {
            this.luckydrawCfg = cfg;
            this.costLab.string = `${this.luckydrawCfg.item[1]}`
            GlobalUtil.setSpriteIcon(this.node, this.costLayout.getChildByName('ck_anniuzi02'), `view/lottery/texture/common/ck_anniuzi01`)
            GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getIconById(this.luckydrawCfg.item[0]));
        }
        else {
            let id = this.lotteryModel.lastLuckydrawCfgId
            this.luckydrawCfg = ConfigManager.getItemById(LuckydrawCfg, id)
            this.costLab.string = `${this.luckydrawCfg.item_num}`
            GlobalUtil.setSpriteIcon(this.node, this.costLayout.getChildByName('ck_anniuzi02'), `view/lottery/texture/common/ck_anniuzi0${this.luckydrawCfg.item_num == 1 ? 1 : 2}`)
            GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getIconById(this.luckydrawCfg.item_id));
        }
        gdk.e.on(LotteryEventId.SHOW_ITEM_END, this._onShowItemEnd, this);
        this._initListView()
        this.list.set_data(this._getEffectItemList(this.goodList, immediately))
    }

    _getEffectItemList(list: Array<icmsg.GoodsInfo>, immediately) {
        let newList = []
        let isShowHero = false

        list.forEach((element, index) => {
            let typeId: number = element.typeId;
            typeId = element.typeId.toString().length >= 8 ? parseInt(element.typeId.toString().slice(0, 6)) : element.typeId;
            let cfg = BagUtils.getConfigById(typeId)
            if (cfg && cfg.defaultColor >= 3 && (this.lotteryModel.lotteryType == LotteryType.gene || (this.lotteryModel.lotteryType == LotteryType.normal && !this.lotteryModel.isSkipAni))) {
                isShowHero = true
            } else {
                isShowHero = false
            }
            //伪造一个数据，排版好看
            if (list.length >= 10 && index == 8) {
                newList.push({ index: index, typeId: 0, num: 0, isShowHero: false, immediately: immediately });
            }

            index = index >= 8 ? index + 1 : index;
            newList.push({
                index: index,
                typeId: element.typeId,
                num: element.num,
                isShowHero: false,
                immediately: immediately
            });
        });
        return newList
    }

    btnAgainFunc() {
        if (this.luckydrawCfg) {
            //关闭音乐
            if (GlobalUtil.isMusicOn) {
                let music = this.node.getComponent(gdk.Music);
                music && music.setMusic("");
            }
            this.timeCount = 0
            if (this.luckydrawCfg instanceof GeneCfg) {
                let costNum = BagUtils.getItemNumById(this.luckydrawCfg.item[0]) || 0;
                if (costNum < this.luckydrawCfg.item[1]) {
                    let name = BagUtils.getConfigById(this.luckydrawCfg.item[0]).name;
                    if (this.luckydrawCfg.type == 1) {
                        GlobalUtil.openAskPanel({
                            descText: `${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP1"), name)}`,
                            sureCb: () => {
                                gdk.panel.setArgs(PanelId.Store, [StoreMenuType.Gold]);
                                gdk.panel.open(PanelId.Store);
                                this.close();
                            }
                        })
                    }
                    else {
                        gdk.gui.showMessage(`${name}${gdk.i18n.t("i18n:LOTTERY_TIP2")}`);
                    }
                    return;
                }

                // let req = new GeneDrawReq();
                // req.geneId = this.luckydrawCfg.id;
                // NetManager.send(req);
                // this.canClose = false;
                gdk.e.emit(LotteryEventId.GENE_LOTTERY_REQ, true);
                this._isClickAgain = true
                this.bagModel.heroChips = []

                this.close();
            }
        }
    }

    btnCloseFunc() {
        this.close()
    }

    reSetEffect() {
        gdk.Timer.clearAll(this)
        this.list.set_data([])
        this.btnAgain.node.active = false
        this.btnClose.node.active = false
        this.canClose = false;
    }

    _onShowItemEnd() {
        gdk.e.off(LotteryEventId.SHOW_ITEM_END, this._onShowItemEnd);
        if (!cc.isValid(this.node)) {
            return;
        }
        this.btnAgain.node.active = true
        this.btnClose.node.active = true
        // this.costLayout.active = true
        this.canClose = true;
        //播放背景音乐
        gdk.Timer.once(1000, this, () => {
            if (GlobalUtil.isMusicOn) {
                let music = this.node.getComponent(gdk.Music);
                music && music.setMusic(MusicId.CARD_BG);
            }
        })
    }

    close() {
        if (this.canClose) {
            super.close();
        }
    }
}
