import ConfigManager from '../../../../common/managers/ConfigManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { MonsterCfg } from '../../../../a/config';


/**
 * 新手模式怪物信息列表控制组件类
 * @Author: yaozu.hu
 * @Date: 2020-10-13 10:28:57
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-09 15:23:09
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveCupMonsterListCtrl")
export default class PveCupMonsterListCtrl extends cc.Component {

    @property(PveSceneCtrl)
    sceneCtrl: PveSceneCtrl = null;
    // @property(cc.Node)
    // btn: cc.Node = null

    // @property(cc.Node)
    // scrollNode: cc.Node = null;

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    monsterItem: cc.Prefab = null;

    sceneModel: PveSceneModel;
    list: ListView;
    listData: { index: number, cfg: MonsterCfg, addGuide: boolean }[] = []//MonsterCfg[] = []
    onEnable() {

        this.sceneModel = this.sceneCtrl.model;
        let temMonsterIdList = []
        this.listData = []
        let state = this.sceneCtrl.model.stageConfig.id == 630101
        let i = 0;
        this.sceneModel.enemyCfg.forEach(born => {
            if (temMonsterIdList.indexOf(born.enemy_id) < 0) {
                temMonsterIdList.push(born.enemy_id);
                let monsterCfg = ConfigManager.getItemById(MonsterCfg, born.enemy_id);
                if (cc.js.isString(monsterCfg.feature) && monsterCfg.feature != '') {
                    let temData = { index: i, cfg: monsterCfg, addGuide: state }
                    this.listData.push(temData);
                    i++;
                }
            }
        })
        this.updataListData()

        //打开关卡目标界面
        if (!state) {
            gdk.panel.setArgs(PanelId.PveGateConditionView, true)
            gdk.panel.open(PanelId.PveGateConditionView)
        }
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }

    updataListData() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scroll,
                mask: this.scroll.node,
                content: this.content,
                item_tpl: this.monsterItem,
                cb_host: this,
                column: 1,
                gap_x: 0,
                gap_y: 0,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
        this.list.set_data(this.listData);
    }

}
