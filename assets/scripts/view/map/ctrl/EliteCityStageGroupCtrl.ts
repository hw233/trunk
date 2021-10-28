import CopyModel from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import EliteCityStageItemCtrl from './EliteCityStageItemCtrl';
import EliteCityStageLineCtrl from './EliteCityStageLineCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import { StageData } from './CityStageItemCtrl';

/**
 * 精英副本小地图Group
 * @Author: yaozu.hu
 * @Date: 2020-04-22 11:00:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-08-20 22:12:20
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/EliteCityStageGroupCtrl")
export default class EliteCityStageGroupCtrl extends cc.Component {

    @property(cc.Node)
    itemNode: cc.Node = null;

    @property(cc.Node)
    lineNode: cc.Node = null;

    @property(cc.Node)
    completeNode: cc.Node = null;

    @property(cc.Node)
    nextChapterTipNode: cc.Node = null;




    items: EliteCityStageItemCtrl[];
    lines: EliteCityStageLineCtrl[];

    height: number;
    datas: StageData[];
    curNum: number = 0;
    curIndex: number = 1;
    onLoad() {
        this.items = [];
        this.lines = [];
        for (let i = 1; i < 99; i++) {
            let line = this.lineNode.getChildByName(`line${i}`);
            let item = this.itemNode.getChildByName(`item${i}`);
            if (!item) break;
            line.active = false;
            item.active = false;
            this.items.push(item.getComponent(EliteCityStageItemCtrl));
            this.lines.push(line.getComponent(EliteCityStageLineCtrl));
        }
    }

    updateDatas(datas: StageData[], num: number, curIndex: number) {
        this.curIndex = curIndex;
        this.curNum = num;
        this.datas = datas;
        this.height = 0;
        let isFull = true;
        for (let i = 0; i < this.items.length; i++) {
            const itemCtrl = this.items[i];
            const line = this.lines[i];
            let data = datas[i];
            // if (data && data.state != StageState.Lock) {
            if (data) {
                let sid = data.stageCfg.id % 100;
                if (sid == 1) line.node.active = false;
                else {
                    line.node.active = true;
                    line.updateData(datas[i], i);
                }
                itemCtrl.node.active = true;
                itemCtrl.updateData(data, i, curIndex);
                this.height = -itemCtrl.node.y + 90;
            }
            else {
                line.node.active = false;
                itemCtrl.node.active = false;
                isFull = false;
            }
        }
        if (isFull) {
            let num = this.curNum > 0 ? 64 : 0;
            this.height = this.node.height + num;
        }
        this.updateTips();
    }

    updateTips() {
        let model = ModelManager.get(CopyModel);
        let lastCompleteStageId = model.lastCompleteStageId;
        let curCityId = this.datas[0].cityId;
        this.nextChapterTipNode.active = false;
        let data = CopyUtil.getEliteStageCurChaterData(curCityId, this.curIndex - 1);
        this.completeNode.active = false;
        // if (data[0] == data[1]) {
        //     //this.completeNode.active = true;
        //     this.itemNode.opacity = 127.5;
        //     this.lineNode.opacity = 127.5;
        // }
        // else {
        //     //this.completeNode.active = false;
        //     this.itemNode.opacity = 255;
        //     //this.lineNode.opacity = 255;
        // }

        // if (data[0] == data[1]) {
        //     let cfgs = model.eliteStageCfgs;
        //     for (let i = 0; i < cfgs.length; i++) {
        //         if (CopyUtil.getChapterId(cfgs[i].id) == curCityId + 1 && CopyUtil.getSectionId(cfgs[i].id) == 1) {
        //             if (cfgs[i].pre_condition > lastCompleteStageId) {
        //                 let label = this.nextChapterTipNode.getChildByName('label').getComponent(cc.Label);
        //                 this.nextChapterTipNode.active = true;
        //                 label.string = `故事模式${CopyUtil.getChapterId(cfgs[i].pre_condition)}-${CopyUtil.getSectionId(cfgs[i].pre_condition)}开启`;
        //             }
        //             return;
        //         }
        //     }
        // }
    }

    getHeight() {
        return this.height;
    }
}
