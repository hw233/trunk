import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RelicModel from '../../relic/model/RelicModel';
import VaultModel from '../model/VaultModel';
import { Hero_awakeCfg, HeroCfg } from '../../../a/config';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';



/** 
 * @Description: 殿堂指挥官View
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-26 14:52:46
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
//@menu("qszc/scene/pve/PveSceneCtrl")
export default class VaultEnterViewCtrl extends gdk.BasePanel {

    @property([cc.Node])
    hideNodes: cc.Node[] = []
    @property([cc.Node])
    showNodes: cc.Node[] = []
    @property([cc.Label])
    playerNames: cc.Label[] = []
    @property([cc.Label])
    serverNames: cc.Label[] = []
    @property([sp.Skeleton])
    playerSpines: sp.Skeleton[] = []
    @property(cc.Node)
    CServerBtn: cc.Node = null;

    get model(): VaultModel { return ModelManager.get(VaultModel); }

    onEnable() {

        //判断跨服狂欢按钮显示按钮
        let showCsBtn = false
        if (ActUtil.ifActOpen(65) || ActUtil.ifActOpen(67)) {
            showCsBtn = true
        }
        this.CServerBtn.active = showCsBtn;
        let msg1 = new icmsg.ArenaInfoReq();
        NetManager.send(msg1);
        let msg = new icmsg.VaultPositionInfoReq()
        NetManager.send(msg, (rsp: icmsg.VaultPositionInfoRsp) => {
            this.model.infoData = rsp;
            this.refreshSpineData()
        }, this);


        this.model.enterView = true
        let relicModel = ModelManager.get(RelicModel)
        if (relicModel.RedPointEventIdMap[53001]) {
            let rMsg = new icmsg.SystemRedPointCancelReq()
            rMsg.eventId = 53001
            NetManager.send(rMsg)
        }
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    refreshSpineData() {
        this.model.infoData.info.forEach((data, index) => {
            if (data.playerId > 0) {
                this.hideNodes[index].active = false;
                this.showNodes[index].active = true;
                //
                this.playerNames[index].string = data.playerName;
                let serverNum = Math.floor((data.playerId % (10000 * 100000)) / 100000)
                this.serverNames[index].string = 'S' + serverNum + '  ' + data.guildName;

                let path = 'H_zhihuiguan'
                if (data.headId == 0) {
                    let str = 'H_zhihuiguan'
                    path = `spine/hero/${str}/1/${str}`//PveTool.getSkinUrl('H_zhihuiguan')
                } else {
                    let heroCfg = ConfigManager.getItemByField(HeroCfg, 'id', data.headId);
                    if (heroCfg) {
                        path = `spine/hero/${heroCfg.skin}/1/${heroCfg.skin}`
                    } else {
                        //属于觉醒的头像 找到对应的英雄模型
                        let cfgs = ConfigManager.getItems(Hero_awakeCfg, { icon: data.headId })
                        if (cfgs.length > 0) {
                            path = `spine/hero/${cfgs[cfgs.length - 1].ul_skin}/1/${cfgs[cfgs.length - 1].ul_skin}`
                        } else if ([310149, 310150, 310151].indexOf(data.headId) !== -1) {
                            let heroCfg = ConfigManager.getItem(HeroCfg, (cfg: HeroCfg) => {
                                if (cfg.icon == data.headId - 10000 && cfg.group[0] == 6) {
                                    return true;
                                }
                            });
                            path = `spine/hero/${heroCfg.skin}_jx/1/${heroCfg.skin}_jx`
                        }
                        else {
                            let str = 'H_zhihuiguan'
                            path = `spine/hero/${str}/1/${str}`
                        }
                    }
                }
                let animStr = data.headId == 0 ? 'stand_s' : 'stand';
                GlobalUtil.setSpineData(this.node, this.playerSpines[index], path, true, animStr, true);

            } else {
                this.hideNodes[index].active = true;
                this.showNodes[index].active = false;
            }
        })
    }

    onDisable() {
        NetManager.targetOff(this)
        // gdk.Timer.clearAll(this);
        // gdk.e.targetOff(this);
    }

    spineBtnClick(event: cc.Event, indexS: string) {
        if (!this.model.infoData) return;
        let index = parseInt(indexS)
        this.model.curNum = 0;
        this.model.curPos = index;
        this.model.curDifficulty = this.model.infoData.info[index].difficulty;
        gdk.panel.setArgs(PanelId.VaultAttackView, index, this.model.infoData.info[index])
        gdk.panel.open(PanelId.VaultAttackView);
    }


    bottomBtnClicl(event: cc.Event, indexS: string) {
        let index = parseInt(indexS)
        if (index == 2) {
            this.close()
            gdk.panel.open(PanelId.RelicMainView)
        } else if (index == 0) {
            this.close()
            gdk.panel.open(PanelId.CServerActivityMainView);
        }
    }

}
