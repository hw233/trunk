import HeroModel from '../../../../../common/models/HeroModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import RoleChangeCareerItemCtrl2 from './RoleChangeCareerItemCtrl2';

/*
   //英雄切换职业
 * @Author: luoyong 
 * @Date: 2020-02-27 10:33:07 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-08-26 10:06:39
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/RoleChangeCareerCtrl2")
export default class RoleChangeCareerCtrl2 extends gdk.BasePanel {

    @property(cc.Node)
    careerNodes: cc.Node[] = []

    get heroModel() { return ModelManager.get(HeroModel); }

    onEnable() {
        let curHeroInfo = this.heroModel.curHeroInfo
        let careers = this.heroModel.careerInfos[curHeroInfo.typeId]
        for (let i = 0; i < this.careerNodes.length; i++) {
            let node = this.careerNodes[i]
            let ctrl = node.getComponent(RoleChangeCareerItemCtrl2)
            ctrl.updateViewInfo(careers[i], i)
        }

    }


}