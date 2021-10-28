import RuneSkillBookItemCtrl from './RuneSkillBookItemCtrl';
import { RuneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-26 10:30:36 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-27 10:20:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneSkillBookHItemCtrl")
export default class RuneSkillBookHItemCtrl extends cc.Component {
    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    updateView(gener: number, runeCfgs: RuneCfg[]) {
        this.titleLab.string = [
            gdk.i18n.t('i18n:RUNE_TIP48'),
            gdk.i18n.t('i18n:RUNE_TIP49'),
            gdk.i18n.t('i18n:RUNE_TIP50'),
            gdk.i18n.t('i18n:RUNE_TIP51')
        ][gener - 1];
        this.updateList(runeCfgs);
    }

    async updateList(runeCfgs: RuneCfg[]) {
        this.content.removeAllChildren();
        let eachCreatN = 2;
        for (let i = 0; i < runeCfgs.length; i += eachCreatN) {
            if (!cc.isValid(this.node) || !this.node.activeInHierarchy) return;
            await this.createByFrame(runeCfgs.slice(i, i + eachCreatN));
        }
    }

    async createByFrame(runeCfgs: RuneCfg[], frame: number = 1) {
        return new Promise((resolve, rejct) => {
            gdk.Timer.frameOnce(frame, this, () => {
                if (cc.isValid(this.node) && this.node.activeInHierarchy) {
                    runeCfgs.forEach(c => {
                        let node = cc.instantiate(this.itemPrefab);
                        node.parent = this.content;
                        let ctrl = node.getComponent(RuneSkillBookItemCtrl);
                        ctrl.updateView(c);
                    })
                }
                resolve(true);
            })
        });
    }
}
