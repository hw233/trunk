import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PveHeroModel from '../../model/PveHeroModel';
import ShaderHelper, { ShaderProperty } from '../../../../common/shader/ShaderHelper';
/**
 * Pve英雄塔英雄详情界面
 * @Author: sthoo.huang
 * @Date: 2019-04-11 16:03:00
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-09-25 10:27:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveHeroDetailCtrl")
export default class PveHeroDetailCtrl extends gdk.BasePanel {

    @property(cc.Node)
    atkDisImg: cc.Node = null;

    @property(cc.Sprite)
    group: cc.Sprite = null;

    onDisable() {
        this.atkDisImg.removeComponent(ShaderHelper);
    }

    set model(v: PveHeroModel) {
        this.title = v.getProp('name');
        // 设置攻击范围图片
        this.atkDisImg.setContentSize(v.range * 2, v.range * 2);
        // 绘制攻击范围圈
        let c = this.atkDisImg.getComponent(ShaderHelper);
        if (!c) {
            c = this.atkDisImg.addComponent(ShaderHelper);
        }
        if (c) {
            c.enabled = true;
            c.program = 'attack_area';

            let w = new ShaderProperty();
            w.key = 'minRadius';
            w.value = 0.35;

            let m = new ShaderProperty();
            m.key = 'maxRadius';
            m.value = 0.5;

            let t = new ShaderProperty();
            t.key = 'areaColor';
            t.value = cc.color(0, 255, 0, 255);

            c.props = [w, m, t];
        }

        // 设置阵营图标
        GlobalUtil.setSpriteIcon(this.node, this.group, `common/texture/role/select/group_${v.config.group[0]}`);
    }
}