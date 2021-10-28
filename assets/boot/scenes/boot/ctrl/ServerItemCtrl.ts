import BConfigManager from '../../../common/managers/BConfigManager';
import BGlobalUtil from '../../../common/utils/BGlobalUtil';
import BUiListItem from '../../../common/widgets/BUiListItem';
import { HeroCfg } from '../../../configs/bconfig';
import { ServerItemModel, ServerPlayerItemModel, ServerStatus } from '../../../common/models/BServerModel';

/** 
 * @Description: 
 * @Author: weiliang.huang  
 * @Date: 2019-04-04 17:52:36 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-07 16:24:54
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/login/ServerItemCtrl")
export default class ServerItemCtrl extends BUiListItem {

    @property(cc.Prefab)
    playerItemPre: cc.Prefab = null;

    @property(cc.Node)
    serverItem: cc.Node = null;
    playerItem: cc.Node = null;

    @property(cc.Node)
    bg: cc.Node = null;
    // @property(cc.Node)
    // selectBg: cc.Node = null;
    @property(cc.Label)
    nameLab: cc.Label = null;
    @property(cc.Label)
    idLab: cc.Label = null;
    @property(cc.Node)
    status1: cc.Node = null;
    @property(cc.Node)
    status2: cc.Node = null;
    @property(cc.Node)
    status3: cc.Node = null;

    @property(cc.Node)
    recom: cc.Node = null;
    @property(cc.Node)
    myself: cc.Node = null;
    data: ServerItemModel;

    playerNameLab: cc.Label;
    playerLvLab: cc.Label;
    playerIcon: cc.Sprite;

    updateView() {
        let data = this.data;
        if (data instanceof ServerPlayerItemModel) {
            this.serverItem.active = false;
            this.updatePlayerView(data);
            return;
        }
        if (this.playerItem) {
            this.playerItem.active = false;
        }
        this.serverItem.active = true;
        this.nameLab.string = data.name;
        // this.selectBg.active = false;
        this.bg.active = true;
        this.idLab.string = data.idName;
        this.recom.active = !!data.recom;
        this.myself.active = !!data.players;

        let status = data.status;
        this.status1.active = status == ServerStatus.FLOW;
        this.status2.active = status == ServerStatus.FULL;
        this.status3.active = status == ServerStatus.MAINTAIN
            || status == ServerStatus.MAINTAIN_FULL || status == ServerStatus.MAINTAIN_FLOW;
    }

    updatePlayerView(data: ServerPlayerItemModel) {
        let playerItem = this.playerItem;
        if (!playerItem) {
            let playerItem = cc.instantiate(this.playerItemPre);
            this.node.addChild(playerItem);
            this.playerItem = playerItem;
            this.playerNameLab = cc.find('layout/nameLab', playerItem).getComponent(cc.Label);
            this.playerLvLab = cc.find('layout/lvLab', playerItem).getComponent(cc.Label);
            this.playerIcon = cc.find('layout/heroSlot/mask/icon', playerItem).getComponent(cc.Sprite);
        } else {
            playerItem.active = true;
        }
        this.playerNameLab.string = data.name;
        this.playerLvLab.string = `Lv.${data.level}`;

        if (data.headId > 0) {
            let cfg = BConfigManager.getItemById(HeroCfg, data.headId);
            if (cfg) {
                BGlobalUtil.setSpriteIcon(this.node, this.playerIcon, `icon/hero/${cfg.icon}_s`);
                return;
            }
        }
        BGlobalUtil.setSpriteIcon(this.node, this.playerIcon, `icon/hero/300000_s`);
    }
}
