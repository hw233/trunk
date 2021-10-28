import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PvePool from '../../utils/PvePool';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneState from '../../enum/PveSceneState';
import PveSkillModel from '../../model/PveSkillModel';
import { SkillCfg } from '../../../../a/config';

/**
 * 手动技能控制组件
 * @Author: sthoo.huang
 * @Date: 2019-04-23 16:27:43
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-18 15:28:29
 */

const { ccclass, property, menu } = cc._decorator;

// 技能图标处理
const IconUtil = {
    101: {
        // 预选目标技能
        icon: 'UI_zhihuiguanzhiyin_red',//'skill_range',
        preinit: function (self: PveManualSkillCtrl) {
            // self.icon.node.angle = 0;
            // self.icon.node.setScale(1);
            // self.icon.node.setPosition(0, 0);
            // self.icon.type = cc.Sprite.Type.SIMPLE;
            // self.sceneModel.ctrl.effect.addChild(self.node, 9999);
            self.spine.node.angle = 0;
            self.spine.node.setScale(1);
            self.spine.node.setPosition(0, 0);
            //self.icon.type = cc.Sprite.Type.SIMPLE;
            self.sceneModel.ctrl.effect.addChild(self.node, 9999);
        },
        init: function (self: PveManualSkillCtrl) {
            //let sz = self.icon.spriteFrame.getRect();
            let cr: number = 100//sz.width / 2;
            let sc: number = parseFloat((self.model.dmgRange / cr).toFixed(2));
            //self.icon.node.height = sz.height;
            //self.icon.node.width = sz.width;
            self.spine.node.setScale(sc);
        },
    },
    102: {
        // 范围技能
        icon: 'UI_zhihuiguanzhiyin_red',
        preinit: function (self: PveManualSkillCtrl) {
            self.spine.node.angle = 0;
            self.spine.node.setScale(1);
            self.spine.node.setPosition(0, 0);
            //self.icon.type = cc.Sprite.Type.SIMPLE;
            self.sceneModel.ctrl.effect.addChild(self.node, 9999);
        },
        init: function (self: PveManualSkillCtrl) {
            //let sz = self.icon.spriteFrame.getRect();
            let cr: number = 100//sz.width / 2;
            let sc: number = parseFloat((self.model.dmgRange / cr).toFixed(2));
            //self.icon.node.height = sz.height;
            //self.icon.node.width = sz.width;
            self.spine.node.setScale(sc);
        },
    },
    103: {
        // 指向性技能
        icon: 'skill_arrow',
        preinit: function (self: PveManualSkillCtrl) {
            self.icon.node.angle = 0;
            self.node.setPosition(0, 0);
            self.icon.node.setScale(1);
            self.icon.type = cc.Sprite.Type.TILED;
            self.sceneModel.ctrl.thing.addChild(self.node, 0);
        },
        init: function (self: PveManualSkillCtrl) {
            let sz = self.icon.spriteFrame.getRect();
            self.icon.node.height = sz.height;
            self.icon.node.width = self.model.dmgRange * 2;
        },
    },
    104: {
        // 预选友方目标技能
        icon: 'UI_zhihuiguanzhiyin_red1',//'skill_range1',UI_zhihuiguanzhiyin_red
        preinit: function (self: PveManualSkillCtrl) {
            self.spine.node.angle = 0;
            self.spine.node.setScale(1);
            self.spine.node.setPosition(0, 0);
            //self.icon.type = cc.Sprite.Type.SIMPLE;
            self.sceneModel.ctrl.effect.addChild(self.node, 9999);
        },
        init: function (self: PveManualSkillCtrl) {
            //let sz = self.icon.spriteFrame.getRect();
            let cr: number = 100//sz.width / 2;
            let sc: number = parseFloat((self.model.dmgRange / cr).toFixed(2));
            //self.icon.node.height = sz.height;
            //self.icon.node.width = sz.width;
            self.spine.node.setScale(sc);
        },
    },
    // 获得图标后缀
    get: function (c: SkillCfg) {
        if (this[c.type]) {
            return this[c.type].icon;
        }
        return this[102].icon;
    },
};

@ccclass
@menu("qszc/scene/pve/PveManualSkillCtrl")
export default class PveManualSkillCtrl extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    model: PveSkillModel;
    sceneModel: PveSceneModel;

    onEnable() {
        // let resId: string = gdk.Tool.getResIdByNode(this.sceneModel.ctrl.node);
        // let config: SkillCfg = this.model.config;
        // let icon: string = IconUtil.get(config);
        // let url: string = 'view/pve/texture/ui/common/' + icon;
        // gdk.rm.loadRes(resId, url, cc.SpriteFrame, (res: cc.SpriteFrame) => {
        //     if (!cc.isValid(this.node)) return;
        //     if (!this.model) return;
        //     if (this.model.config !== config) return;
        //     this.icon.spriteFrame = res;
        //     // 定时更新函数
        //     let m = IconUtil[this.model.config.type];
        //     m.init && m.init(this);
        // });
        let icon: string = IconUtil.get(this.model.config);
        let path = `spine/ui/${icon}/${icon}`
        GlobalUtil.setSpineData(this.node, this.spine, path, true, 'stand', true, false, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.model) return;
            // 定时更新函数
            let m = IconUtil[this.model.config.type];
            m.init && m.init(this);
        });
    }

    onDisable() {
        this.icon.spriteFrame = null;
        this.model = null;
        this.sceneModel = null;
    }

    // 更新当前坐标（手势或鼠标）
    update(dt: number) {
        if (this.sceneModel.state != PveSceneState.Fight) return;
        let model = this.model;
        let pos = model.targetPos;
        if (pos) {
            let ceil = Math.ceil;
            switch (model.config.type) {
                case 103:   // 指向性
                    // 起点位置
                    let node = this.icon.node;
                    let bpos = cc.v2(360, 98)//model.attacker.getPos();
                    // 计算方向角度
                    let angle: number = Math.atan2(pos.y - bpos.y, pos.x - bpos.x);
                    let degree: number = angle * 180 / Math.PI;
                    node.angle = -(degree <= 0 ? -degree : 360 - degree);
                    // 设置起点坐标
                    node.setPosition(bpos)
                    // node.setPosition(
                    //     ceil(bpos.x + 80 * Math.cos(angle)),
                    //     ceil(bpos.y + 80 * Math.sin(angle)),
                    // );
                    break;

                case 101:   // 预选目标
                case 102:   // 范围
                case 104:   // 预先友方目标
                default:
                    this.node.setPosition(
                        ceil(pos.x),
                        ceil(pos.y),
                    );
                    break;
            }
        }
    }

    hide(effect: boolean = true) {
        gdk.NodeTool.hide(this.node, effect, () => {
            PvePool.put(this.node);
        });
    }

    static init(self: PveManualSkillCtrl) {
        let m = IconUtil[self.model.config.type];
        if (!m) {
            m = IconUtil[101];
        }
        return m && m.preinit && m.preinit(self);
    }
}