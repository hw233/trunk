import FootHoldModel from '../FootHoldModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-13 10:57:54
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationPlayerListCtrl")
export default class FHCooperationPlayerListCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    playerItem: cc.Prefab = null

    @property(cc.Node)
    scoreArrow: cc.Node = null

    @property(cc.Node)
    fightNumArrow: cc.Node = null

    list: ListView = null

    _scoreDown: boolean = true
    _fightNumDown: boolean = true

    _playerDatas: icmsg.FootholdCoopPlayer[] = []

    onEnable() {
        let guildId = this.args[0]
        ModelManager.get(FootHoldModel).coopTempViewGuildId = guildId
        let msg = new icmsg.FootholdCoopGuildMembersReq()
        msg.guildId = guildId
        NetManager.send(msg, (data: icmsg.FootholdCoopGuildMembersRsp) => {
            this._updateViewInfo(data.members)
        })
    }

    onDisable() {

    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.playerItem,
            cb_host: this,
            async: true,
            gap_y: 4,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewInfo(list: icmsg.FootholdCoopPlayer[]) {
        this._initListView()
        this._playerDatas = list
        GlobalUtil.sortArray(this._playerDatas, (a, b) => {
            if (a.score == b.score) {
                return b.number - a.number
            }
            return b.score - a.score
        })
        this.list.set_data(this._playerDatas)
    }


    onFightNumClick() {
        this._fightNumDown = !this._fightNumDown
        this.fightNumArrow.scaleY = this._fightNumDown ? -1 : 1
        if (this._fightNumDown) {
            GlobalUtil.sortArray(this._playerDatas, (a, b) => {
                return b.number - a.number
            })
        } else {
            GlobalUtil.sortArray(this._playerDatas, (a, b) => {
                return a.number - b.number
            })
        }

        this.list.set_data(this._playerDatas)

    }

    onScoreClick() {
        this._scoreDown = !this._scoreDown
        this.scoreArrow.scaleY = this._scoreDown ? -1 : 1
        if (this._scoreDown) {
            GlobalUtil.sortArray(this._playerDatas, (a, b) => {
                return b.score - a.score
            })
        } else {
            GlobalUtil.sortArray(this._playerDatas, (a, b) => {
                return a.score - b.score
            })
        }

        this.list.set_data(this._playerDatas)
    }
}