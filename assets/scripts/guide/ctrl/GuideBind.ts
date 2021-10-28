import GuideUtil from '../../common/utils/GuideUtil';

/** 
 * @Description: 新手引导节点绑定控制器
 * @Author: weiliang.huang  
 * @Date: 2019-06-04 18:11:08 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-10-09 19:42:06
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/guide/GuideBind")
export default class GuideBind extends cc.Component {

    @property({
        tooltip: "绑定的新手引导列表",
        type: cc.Integer,
    })
    guideIds = [];


    @property({
        tooltip: "是否延迟展示(毫秒)",
        type: cc.Integer,
    })
    delayTime: number = 0;

    onEnable() {
        if (this.delayTime > 0) {
            this.scheduleOnce(() => {
                this.bindBtn();
            }, this.delayTime / 1000);
        } else {
            this.bindBtn();
        }
    }

    bindBtn() {
        let n = this.guideIds.length;
        if (n <= 0) return;
        for (let index = 0; index < n; index++) {
            let id = this.guideIds[index];
            GuideUtil.bindGuideNode(id, this.node);
        }
    }

    onDisable() {
        let n = this.guideIds.length;
        if (n <= 0) return;
        for (let index = 0; index < n; index++) {
            let id = this.guideIds[index];
            GuideUtil.bindGuideNode(id);
        }
    }
}
