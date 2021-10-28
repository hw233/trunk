import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildUtils from '../utils/GuildUtils';
import NetManager from '../../../common/managers/NetManager';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-15 18:00:13 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildInviteItemCtrl")
export default class GuildInviteItemCtrl extends UiListItem {
    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Sprite)
    frameIcon: cc.Sprite = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    guildNode: cc.Node = null;

    @property(cc.Node)
    posIcon: cc.Node = null;

    info: icmsg.GuildInvitation
    updateView() {
        this.info = this.data;
        GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(this.info.playerHead));
        GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(this.info.playerFrame));
        this.lvLabel.string = '.' + this.info.playerLv;
        this.nameLab.string = this.info.playerName;
        this.vipFlag.getComponent(VipFlagCtrl).updateVipLv(GlobalUtil.getVipLv(this.info.playerVipExp));
        this.guildNode.getChildByName('name').getComponent(cc.Label).string = this.info.guildName;
        GlobalUtil.setSpriteIcon(this.node, this.guildNode.getChildByName('bot'), GuildUtils.getIcon(this.info.guildBottom));
        GlobalUtil.setSpriteIcon(this.node, cc.find('bot/frame', this.guildNode), GuildUtils.getIcon(this.info.guildFrame));
        GlobalUtil.setSpriteIcon(this.node, cc.find('bot/icon', this.guildNode), GuildUtils.getIcon(this.info.guildIcon));
        let path = this.info.postion == 4 ? "view/guild/texture/common/gh_huizhang" : "view/guild/texture/common/gh_fuhuizhang";
        GlobalUtil.setSpriteIcon(this.node, this.posIcon, path);
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    onCancelBtnClick() {
        this._req(false);
    }

    onConfirmBtnClick() {
        this._req(true);
    }

    _req(b: boolean) {
        let req = new icmsg.GuildAcceptInviteReq();
        req.isAccept = b;
        req.guildId = this.info.guildId;
        req.inviterId = this.info.playerId;
        NetManager.send(req, null, this);
    }
}
