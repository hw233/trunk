import ConfigManager from '../../../../../common/managers/ConfigManager';
import CopyUtil from '../../../../../common/utils/CopyUtil';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import PveTool from '../../../utils/PveTool';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { Copysurvival_equipCfg } from './../../../../../a/config';

/** 
 * Pve生存副本装备图标
 * @Author: sthoo.huang  
 * @Date: 2020-07-16 12:05:10
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:27:46
 */
const { ccclass, property, menu } = cc._decorator;
const DEFINED: {
    [color: number]: {
        type: string,
        nameC: cc.Color,
        nameO: cc.Color,
        descC: cc.Color,
    }
} = {
    2: {
        type: "fb_xiyou",
        nameC: cc.color("#34e0ff"),
        nameO: cc.color("#144c76"),
        descC: cc.color("#ffffff"),
    },
    3: {
        type: "fb_shishi",
        nameC: cc.color("#f9c5ff"),
        nameO: cc.color("#380b3c"),
        descC: cc.color("#ffffff"),
    },
    4: {
        type: "fb_chuanshuo",
        nameC: cc.color("#f8ffbd"),
        nameO: cc.color("#7b1a00"),
        descC: cc.color("#ffffff"),
    },
};

@ccclass
@menu("qszc/scene/pve/view/equip/PveEquipItemCtrl")
export default class PveEquipItemCtrl extends UiListItem {
    @property(cc.Sprite)
    flag: cc.Sprite = null;

    @property(cc.Node)
    qualityIcon: cc.Node = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Sprite)
    title: cc.Sprite = null;
    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Sprite)
    nameBg: cc.Sprite = null;

    @property(cc.Label)
    nameLb: cc.Label = null;
    @property(cc.RichText)
    descLb: cc.RichText = null;

    @property(cc.Node)
    selected: cc.Node = null;

    onLoad() {
        let groupNode = cc.find('content/effect/group', this.node);
        groupNode.active = false;
        let careerNode = cc.find('content/effect/type', this.node);
        careerNode.active = false;
    }

    updateView() {
        let equipId: number;
        let equipLv: number;

        if (this.data instanceof icmsg.SurvivalEquipInfo) {
            // 已购的装备列表
            equipId = this.data.equipId;
            equipLv = this.data.equipLv;
            this.flag.node.active = false;
            this.lv.node.active = true;
            this.lv.string = '.' + this.data.equipLv;
        } else if (this.data instanceof Array) {
            // 购买项
            equipId = this.data[0];
            equipLv = CopyUtil.getSurvivalHeroEquipLv(equipId) + 1;
            this.lv.node.active = false;
            this.flag.node.active = equipLv > 1;
        }

        let config = ConfigManager.getItemById(Copysurvival_equipCfg, equipId);
        let define = DEFINED[config.color];

        GlobalUtil.setSpriteIcon(this.node, this.title, 'view/pve/texture/equip2/type/' + define.type);
        GlobalUtil.setSpriteIcon(this.node, this.bg, 'view/pve/texture/equip2/bg/' + define.type + 'di');
        GlobalUtil.setSpriteIcon(this.node, this.nameBg, 'view/pve/texture/equip2/zibg/' + define.type + 'mingzidi');

        let s = PveTool.getSkillCfg(config.skill, equipLv);
        this.nameLb.string = s.name;
        this.nameLb.node.color = define.nameC;
        this.nameLb.node.getComponent(cc.LabelOutline).color = define.nameO;
        this.descLb.string = s.des || gdk.i18n.t("i18n:PVE_EQUIPITEM_TIP");
        this.descLb.node.color = define.descC;

        let url = 'icon/equip/' + config.icon;
        let bgUrl = 'common/texture/sub_itembg0' + config.color;
        GlobalUtil.setSpriteIcon(this.node, this.qualityIcon, bgUrl);
        GlobalUtil.setSpriteIcon(this.node, this.icon, url);

        // 英雄阵营
        let groupNode = cc.find('content/effect/group', this.node);
        let groups: { [group: number]: boolean } = {};
        let g = config.heroGroup as any;
        if (g instanceof Array) {
            g.forEach(i => groups[i] = true);
        } else {
            groups[g] = true;
        }
        groupNode.children.forEach(n => {
            let i = n.name;
            n.active = groups[i] && (i != '0' || config.career == 0);
        });
        groupNode.active = true;
        // 英雄职业
        let careerNode = cc.find('content/effect/type', this.node);
        if (config.career == 0) {
            // 对所有职业都有效时，则不显示职业图标
            careerNode.active = false;
        } else {
            let careers: { [career: number]: boolean } = {};
            let c = config.career as any;
            if (c instanceof Array) {
                c.forEach(i => careers[i] = true);
            } else {
                careers[c] = true;
            }
            careerNode.children.forEach(n => {
                n.active = careers[n.name];
            });
            careerNode.active = true;
        }
    }

    onDisable() {
        GlobalUtil.setSpriteIcon(this.node, this.title, null);
        GlobalUtil.setSpriteIcon(this.node, this.bg, null);
        GlobalUtil.setSpriteIcon(this.node, this.nameBg, null);
        GlobalUtil.setSpriteIcon(this.node, this.qualityIcon, null);
        GlobalUtil.setSpriteIcon(this.node, this.icon, null);
        super.onDisable && super.onDisable();
    }

    /** 子项选中 */
    _itemSelect() {
        this.selected.active = this.ifSelect && (this.data instanceof Array);
    }
}