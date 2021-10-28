import { Royal_divisionCfg, Royal_sceneCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import ModelManager from "../../../common/managers/ModelManager";
import NetManager from "../../../common/managers/NetManager";
import RoyalModel from "../../../common/models/RoyalModel";
import GlobalUtil from "../../../common/utils/GlobalUtil";
import UiListItem from "../../../common/widgets/UiListItem";


/** 
 * @Description: 皇家竞技场场景选择界面Itme
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 17:36:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaMapSelectViewCtrl")
export default class RoyalArenaMapSelectViewItemCtrl extends UiListItem {

    @property(cc.Sprite)
    mapSp: cc.Sprite = null;

    @property(cc.Label)
    nameLb: cc.Label = null;

    @property(cc.Node)
    btn1: cc.Node = null;   //已选择

    @property(cc.Node)
    btn2: cc.Node = null;   //选择按钮
    @property(cc.Node)
    btn3: cc.Node = null;   //替换按钮

    @property(cc.Node)
    lockNode: cc.Node = null;
    @property(cc.Sprite)
    divIcon: cc.Sprite = null;
    @property(cc.Label)
    divName: cc.Label = null;
    @property(cc.Label)
    tipsLb: cc.Label = null;

    cfg: Royal_sceneCfg;

    get royalModel() { return ModelManager.get(RoyalModel); }
    state: number = 0; //0 可选择 1可替换 2已选择
    lockState: boolean = false;
    updateView() {
        this.cfg = this.data;
        this.state = 0;
        if (this.cfg.id == this.royalModel.curSceneId) {
            this.state = 2;
        } else if (this.royalModel.mapIds.indexOf(this.cfg.id) >= 0) {
            this.state = 1;
        }

        this.nameLb.string = this.cfg.scene_name;

        let divCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'stage_id', this.cfg.id)
        if (divCfg) {
            this.lockState = this.royalModel.division < divCfg.division
        } else {
            this.lockState = false;
        }

        let mapPath = 'map/' + this.cfg.background;
        GlobalUtil.setSpriteIcon(this.node, this.mapSp, mapPath)

        this.btn1.active = this.state == 2 && !this.lockState;
        this.btn2.active = this.state == 0 && !this.lockState;
        this.btn3.active = this.state == 1 && !this.lockState;

        this.lockNode.active = this.lockState;
        if (this.lockState && divCfg) {
            GlobalUtil.setSpriteIcon(this.node, this.divIcon, 'view/act/texture/peak/' + divCfg.icon)
            this.divName.string = divCfg.name;
            this.tipsLb.string = divCfg.name + '段位解锁'
        }

    }

    onDisable() {
        NetManager.targetOff(this);
    }
    //选择新地图
    btn2Click() {
        let temMaps = this.royalModel.mapIds.concat();
        let index = this.royalModel.curIndex
        temMaps[index] = this.cfg.id;

        let msg = new icmsg.RoyalSetMapReq()
        msg.mapIds = temMaps;
        NetManager.send(msg, (rsp: icmsg.RoyalSetMapRsp) => {
            this.royalModel.curSceneId = this.cfg.id
            this.royalModel.mapIds = rsp.maps;
        }, this)
    }

    //和已用的地图替换
    btn3Click() {
        let temMaps = this.royalModel.mapIds.concat();
        let index = this.royalModel.curIndex
        let temIndex = temMaps.indexOf(this.cfg.id);
        temMaps[index] = this.cfg.id;
        temMaps[temIndex] = this.royalModel.curSceneId;

        let msg = new icmsg.RoyalSetMapReq()
        msg.mapIds = temMaps;
        NetManager.send(msg, (rsp: icmsg.RoyalSetMapRsp) => {
            this.royalModel.curSceneId = this.cfg.id
            this.royalModel.mapIds = rsp.maps;
        }, this)
    }

}
