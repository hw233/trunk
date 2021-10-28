import ModelManager from '../../../common/managers/ModelManager';
import VaultModel from '../model/VaultModel';

/** 
 * @Description: 殿堂指挥官挑战界面
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-09 11:10:01
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class VaultSelectViewCtrl extends gdk.BasePanel {


    @property([cc.Node])
    selectNode: cc.Node[] = []

    @property([cc.Label])
    numList: cc.Label[] = []

    get model(): VaultModel { return ModelManager.get(VaultModel); }
    onEnable() {
        this.selectNode.forEach((node, index) => {
            node.active = index == this.model.curNum;
            this.numList[index].string = this.model.addNum[index] + ''
        })
    }

    btnClick(event: cc.Event, indexS: string) {
        let index = parseInt(indexS)
        this.model.curNum = index;
        this.selectNode.forEach((node, index) => {
            node.active = index == this.model.curNum
        })
        this.close();
    }

}
