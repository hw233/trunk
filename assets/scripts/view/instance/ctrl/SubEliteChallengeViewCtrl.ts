import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import EnterStageViewCtrl from '../../map/ctrl/EnterStageViewCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import { Copycup_challengeCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { StageData } from '../../map/ctrl/CityStageItemCtrl';

/** 
 * 奖杯模式（挑战模式）英雄选择界面
 * @Author: yaozu.hu
 * @Date: 2019-06-19 13:43:54 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-08-20 14:40:15
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubEliteChallengeViewCtrl")
export default class SubEliteChallengeViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;


    list: ListView;
    copyModel: CopyModel
    stageId: number = 0;
    data: StageData = null;
    onEnable() {


        this.copyModel = ModelManager.get(CopyModel);
        let selectData = [];

        let arg = gdk.panel.getArgs(PanelId.SubEliteChallengeView);
        if (arg && arg.length > 0) {
            this.stageId = arg[0];
            this.data = arg[1];
        }
        if (this.copyModel.eliteChallengeSelectHero['' + this.stageId]) {
            selectData = this.copyModel.eliteChallengeSelectHero['' + this.stageId]
        }
        this._initListView();
        let cfg = ConfigManager.getItem(Copycup_challengeCfg, { 'copy_id': this.stageId })
        if (cfg) {
            let listData = []
            for (let i = 1; i <= 6; i++) {
                let select = -1;
                if (selectData.length >= i) {
                    select = selectData[i - 1];
                }
                let tem = cfg['group_' + i]
                if (!(cc.js.isString(tem) || tem.length == 0)) {
                    let data = { heros: tem, select: select };
                    listData.push(data)
                }
            }
            this.list.set_data(listData);
        }
    }

    onDisable() {

        if (this.list) {
            this.list.destroy()
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scroll,
            mask: this.scroll.node,
            content: this.content,
            item_tpl: this.itemPre,
            cb_host: this,
            column: 1,
            gap_x: 0,
            gap_y: 0,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    btnClick() {
        let can = true;
        let str = ''
        let tem = []
        this.list.datas.forEach(data => {
            if (data.select < 0) {
                can = false;
            }
            tem.push(data.select)
            str += '<' + data.select + '> '
        })
        if (!can) {
            gdk.gui.showMessage('有英雄未选择，请选择');
        } else {
            cc.log('--------------点击确认按钮--选择的英雄：' + str)
            this.copyModel.eliteChallengeSelectHero['' + this.stageId] = tem;
            gdk.panel.open(PanelId.EnterStageView, (node: cc.Node) => {
                let ctrl = node.getComponent(EnterStageViewCtrl);
                ctrl.updateData(this.data);
            });
        }

    }

}
