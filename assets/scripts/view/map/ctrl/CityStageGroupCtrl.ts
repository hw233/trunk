import CityStageItemCtrl, { StageData } from './CityStageItemCtrl';
import CityStageLineCtrl from './CityStageLineCtrl';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/CityStageGroupCtrl")
export default class CityStageGroupCtrl extends cc.Component {

    @property(cc.Node)
    itemNode: cc.Node = null;

    @property(cc.Node)
    lineNode: cc.Node = null;

    items: CityStageItemCtrl[];
    lines: CityStageLineCtrl[];
    guideItems: CityStageItemCtrl[] = [];

    height: number;
    datas: StageData[];

    onLoad() {
        this.items = [];
        this.lines = [];
        for (let i = 1; i < 99; i++) {
            let line = this.lineNode.getChildByName(`line${i}`);
            let item = this.itemNode.getChildByName(`item${i}`);
            if (!item) break;
            line.active = false;
            item.active = false;
            this.items.push(item.getComponent(CityStageItemCtrl));
            this.lines.push(line.getComponent(CityStageLineCtrl));
        }
    }

    updateDatas(datas: StageData[]) {
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
                itemCtrl.updateData(data, i);
                this.height = -itemCtrl.node.y + 90;
            }
            else {
                line.node.active = false;
                itemCtrl.node.active = false;
                isFull = false;
            }
        }
        if (isFull) {
            this.height = this.node.height - 28;
        }
    }

    getHeight() {
        return this.height;
    }

    bindGuide() {
        this.items.forEach(item => {
            item.bindGuide();
            if (item.isBindGuide) this.guideItems.push(item);
        })
    }
}