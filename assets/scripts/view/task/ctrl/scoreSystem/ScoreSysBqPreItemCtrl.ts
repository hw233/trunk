import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import TaskModel from '../../model/TaskModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { MissionType } from '../TaskViewCtrl';
import { ScoreCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 12:52:37
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysBqPreItemCtrl")
export default class ScoreSysBqPreItemCtrl extends UiListItem {

    @property(cc.Node)
    bqIcon: cc.Node = null

    @property(cc.Label)
    titleLab: cc.Label = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    getBtn: cc.Node = null

    @property(cc.Node)
    hasGet: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    _scoreCfg: ScoreCfg

    rewardList: ListView = null;

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    updateView() {
        this._scoreCfg = this.data
        let nextCfg = ConfigManager.getItemById(ScoreCfg, this._scoreCfg.id + 1)
        if (nextCfg) {
            this.titleLab.string = nextCfg.name
            if (nextCfg.resources) {
                GlobalUtil.setSpriteIcon(this.node, this.bqIcon, `view/task/texture/scoreSystem/${nextCfg.resources}`)
            }
        } else {
            this.titleLab.string = this._scoreCfg.name
            if (this._scoreCfg.resources) {
                GlobalUtil.setSpriteIcon(this.node, this.bqIcon, `view/task/texture/scoreSystem/${this._scoreCfg.resources}`)
            }
        }
        this.getBtn.active = false
        this.hasGet.active = false
        let curNode = this.taskModel.grading.boxOpened
        if (this.roleModel.badgeExp >= this._scoreCfg.exp[1]) {
            if (curNode > this._scoreCfg.id) {
                this.hasGet.active = true
            } else if (curNode == this._scoreCfg.id) {
                this.getBtn.active = true
            }
        }

        this._initListView()
        this.scrollView.enabled = false
        let datas = []
        for (let i = 0; i < this._scoreCfg.rewards.length; i++) {
            datas.push({ typeId: this._scoreCfg.rewards[i][0], num: this._scoreCfg.rewards[i][1] })
        }
        this.rewardList.set_data(datas)
    }


    _initListView() {
        if (this.rewardList) {
            return
        }
        this.rewardList = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            gap_x: 10,
            direction: ListViewDir.Horizontal,
        })
    }

    getRewardFunc() {
        let msg = new icmsg.MissionRewardReq();
        msg.kind = 2
        msg.type = MissionType.grading
        msg.id = this._scoreCfg.id
        NetManager.send(msg);
    }
}