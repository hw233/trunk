import ConfigManager from '../../../../common/managers/ConfigManager';
import MineModel from '../../model/MineModel';
import ModelManager from '../../../../common/managers/ModelManager';
import { Activitycave_exchangeCfg, Activitycave_stageCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
 * @Description: 矿洞大作战兑换界面
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-08-13 14:32:16
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineExchangeViewCtrl")
export default class MineExchangeViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;
    @property([cc.Node])
    prizeBtns: cc.Node[] = [];

    list: ListView;
    btnNameColor: string[] = ['#FFEBBA', '#BB9168'];
    btnNameLineColor: string[] = ['#7B4615', '#34190C'];
    curSelectNum: number = -1;
    onEnable() {

        //初始化按钮状态
        let model = ModelManager.get(MineModel);
        model.exChangeOpen = true;
        gdk.e.emit(ActivityEventId.ACTIVITY_MINE_EXCHANGE_REFRESH);
        let curStageId = model.curCaveSstate.stageId
        let MaxPage = 1
        if (curStageId != 0) {
            let cfg = ConfigManager.getItemById(Activitycave_stageCfg, curStageId)
            MaxPage = cfg.page;
        }
        let index = 1;
        this.prizeBtns.forEach(btnNode => {
            let select = btnNode.getChildByName('select');
            let name = btnNode.getChildByName('name').getComponent(cc.Label);
            let lock = btnNode.getChildByName('lock');
            let exCfg = ConfigManager.getItemByField(Activitycave_exchangeCfg, 'page', index);
            let btn = btnNode.getComponent(cc.Button);
            name.string = exCfg.name;
            select.active = false;
            lock.active = !(index <= MaxPage)
            name.node.active = index <= MaxPage
            btn.interactable = index <= MaxPage
            index++;
        })
        this.selectPrizeExchange(0);
    }

    selectPrizeExchange(index: number) {
        //更新按钮状态
        if (this.curSelectNum < 0) {
            this.curSelectNum = index
            let newNode = this.prizeBtns[index];
            let newSelect = newNode.getChildByName('select');
            newSelect.active = true;
            let newName = newNode.getChildByName('name');
            let newOutline = newName.getComponent(cc.LabelOutline);
            newName.color = cc.color(this.btnNameColor[0])
            newOutline.color = cc.color(this.btnNameLineColor[0])
        } else {
            let oldNode = this.prizeBtns[this.curSelectNum];
            let oldSelect = oldNode.getChildByName('select');
            oldSelect.active = false;
            let oldName = oldNode.getChildByName('name');
            let oldOutline = oldName.getComponent(cc.LabelOutline);
            oldName.color = cc.color(this.btnNameColor[1])
            oldOutline.color = cc.color(this.btnNameLineColor[1])
            this.curSelectNum = index;
            let newNode = this.prizeBtns[index];
            let newSelect = newNode.getChildByName('select');
            newSelect.active = true;
            let newName = newNode.getChildByName('name');
            let newOutline = newName.getComponent(cc.LabelOutline);
            newName.color = cc.color(this.btnNameColor[0])
            newOutline.color = cc.color(this.btnNameLineColor[0])
        }

        //更新兑换物品
        let cfgs = ConfigManager.getItemsByField(Activitycave_exchangeCfg, 'page', index + 1);
        this._initListView();
        let itemData = []
        let i = 0;
        cfgs.forEach(cfg => {
            itemData.push({ index: i, cfg: cfg })
            i++;
        })
        this.list.set_data(itemData);
    }

    _initListView() {
        if (this.list == null) {
            let opt = {
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPre,
                column: 1,
                width: 720,
                gap_x: 0,
                gap_y: 0,
                async: false,
                direction: ListViewDir.Vertical,
            };
            this.list = new ListView(opt);
        }
    }

    pageBtnClick(e, index) {
        this.selectPrizeExchange(parseInt(index))
    }

}
