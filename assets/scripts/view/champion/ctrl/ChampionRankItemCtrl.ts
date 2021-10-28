import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';
import { Champion_divisionCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-23 14:26:59 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionRankItemCtrl")
export default class ChampionRankItemCtrl extends UiListItem {
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

    @property(cc.Sprite)
    titleIcon: cc.Sprite = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Node)
    grade: cc.Node = null;

    @property(cc.Label)
    gradeTitle: cc.Label = null;

    @property(cc.Node)
    selectImg: cc.Node = null;

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

    updateItem(d: icmsg.ChampionPlayer) {
        this.nameLabel.string = d.brief.name;
        this.lvLabel.string = '.' + d.brief.level;
        this.powerLab.string = d.brief.power + '';
        // this.scoreLabel.string = '通关波数:' + d.value;
        GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(d.brief.head));
        GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(d.brief.headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(d.brief.title));

        if (this.curIndex < 3) {
            this.rankLab.node.active = false;
            this.noRank.active = false;
            this.rankSprite.active = true;
            let path = this.rankSpriteName[this.curIndex];
            GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
        }
        else {
            this.rankLab.node.active = true;
            this.noRank.active = false;
            this.rankSprite.active = false;
            this.rankLab.string = this.curIndex + 1 + '';
        }
        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl);
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(d.brief.vipExp));

        let cfgs = ConfigManager.getItems(Champion_divisionCfg);
        cfgs = cfgs.reverse();
        for (let i = 0; i < cfgs.length; i++) {
            if (d.points >= cfgs[i].point && (!cfgs[i].limit || (this.curIndex + 1) <= cfgs[i].limit)) {
                GlobalUtil.setSpriteIcon(this.node, this.grade, `view/champion/texture/guess/jbs_duanwei0${cfgs[i].division}`);
                this.gradeTitle.string = `${cfgs[i].name}`;
                return;
            }
        }
    }

    _itemSelect() {
        if (!this.data.brief) {
            return;
        }
        if (this.selectImg) {
            this.selectImg.active = this.ifSelect
        }
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
