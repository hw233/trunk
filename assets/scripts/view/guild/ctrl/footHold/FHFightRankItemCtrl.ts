import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../common/widgets/VipFlagCtrl';
import { BtnMenuType } from '../../../../common/widgets/BtnMenuCtrl';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-31 15:15:37
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/footHold/FHFightRankItemCtrl")
export default class FHFightRankItemCtrl extends UiListItem {
    @property(cc.Node)
    rankSprite: cc.Node = null;

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.Node)
    noRank: cc.Node = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Sprite)
    frameIcon: cc.Sprite = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Label)
    fightNum: cc.Label = null;

    @property(cc.Node)
    guildBottom: cc.Node = null;

    @property(cc.Node)
    guildFrame: cc.Node = null;

    @property(cc.Node)
    guildIcon: cc.Node = null;

    @property(cc.Label)
    guildName: cc.Label = null;
    @property(cc.Label)
    serverName: cc.Label = null;

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];

    updateView() {
        let info = this.data;
        this.updateItem(info);
    }

    async updateItem(d: icmsg.FootholdRankPlayer) {
        this.nameLabel.string = d.brief.name;
        this.lvLabel.string = '.' + d.brief.level;
        this.powerLab.string = d.brief.power + '';
        this.fightNum.string = `${d.score}`
        GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(d.brief.head));
        GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(d.brief.headFrame));
        if (this.curIndex < 3) {
            if (this.curIndex >= 0) {
                this.rankLab.node.active = false;
                this.noRank.active = false;
                this.rankSprite.active = true;
                let path = this.rankSpriteName[this.curIndex];
                GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
            } else {
                this.rankLab.node.active = false;
                this.rankSprite.active = false;
                this.noRank.active = true;
            }
        }
        else {
            this.rankLab.node.active = true;
            this.noRank.active = false;
            this.rankSprite.active = false;
            this.rankLab.string = this.curIndex + 1 + '';
        }
        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl);
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(d.brief.vipExp));


        let info = FootHoldUtils.findGuild(d.brief.guildId)
        if (info) {
            GlobalUtil.setSpriteIcon(this.node, this.guildBottom, GuildUtils.getIcon(info.bottom))
            GlobalUtil.setSpriteIcon(this.node, this.guildFrame, GuildUtils.getIcon(info.frame))
            GlobalUtil.setSpriteIcon(this.node, this.guildIcon, GuildUtils.getIcon(info.icon))
            this.guildName.string = `${info.name}`

        }
        await ModelManager.get(ServerModel).reqServerNameByIds([d.brief.guildId], 2);
        this.serverName.string = `[S${GlobalUtil.getSeverIdByGuildId(d.brief.guildId)}] ${ModelManager.get(ServerModel).serverNameMap[Math.floor(d.brief.guildId / 10000)]}`;
    }

    /**展开菜单栏 */
    onHeadClick() {
        let brief: icmsg.RoleBrief = this.data.brief;
        if (!brief) {
            return;
        }
        if (this.data.brief.playerId == this.roleModel.id) {
            return;
        }

        // 非好友的情况下增加添加好友按钮
        let btns: BtnMenuType[] = [1]
        let id = brief.id;
        GlobalUtil.openBtnMenu(this.node, btns, {
            id: id,
            name: brief.name,
            headId: brief.head,
            level: brief.level,
            headBgId: brief.headFrame,
        })

        this._itemSelect()
    }
}