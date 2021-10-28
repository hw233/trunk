import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import PanelId from '../../../../configs/ids/PanelId';
import PvePool from '../../utils/PvePool';
import PveRoadMoveEffectCtrl from '../base/PveRoadMoveEffectCtrl';
import PveSceneCtrl from '../PveSceneCtrl';
import UiListItem from '../../../../common/widgets/UiListItem';
import { MonsterCfg } from '../../../../a/config';

/**
 * 新手模式怪物信息列表item
 * @Author: yaozu.hu
 * @Date: 2020-10-13 10:28:57
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-09 15:24:50
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveCupMonsterItem")
export default class PveCupMonsterItem extends UiListItem {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    // @property(cc.Label)
    // info1: cc.Label = null;
    // @property(cc.Label)
    // info2: cc.Label = null;

    @property(cc.Node)
    selectNode: cc.Node = null;
    @property(cc.Node)
    bossTips: cc.Node = null;


    info: MonsterCfg;

    moveNode: cc.Node[] = []

    updateView() {
        this.info = this.data.cfg;
        let path = 'icon/monster/' + this.info.icon + '_s';
        GlobalUtil.setSpriteIcon(this.node, this.icon, path);
        //let temStrs = String(this.info.feature).split('|');
        // this.info1.string = temStrs[0]
        // this.info2.string = temStrs[1]
        this.bossTips.active = (this.info.color == 11 || this.info.color == 12)
        this.moveNode = []

        //添加引导
        if (this.data.addGuide) {
            if (this.data.index == 0) {
                GuideUtil.bindGuideNode(7007, this.node);
            } else {
                GuideUtil.bindGuideNode(7008, this.node);
            }
        }

    }

    onDisable() {
        if (this.moveNode.length > 0) {
            this.moveNode.forEach(node => {
                PvePool.put(node);
            })
            this.moveNode.length = 0;
        }
    }

    _itemClick() {
        //打开怪物预警窗口
        gdk.panel.open(
            this.info.color == 12 ? PanelId.PveBossComming : PanelId.PveMonsterComming,
            null, null,
            {
                args: [this.info, 1]
            }
        );
        let view = gdk.gui.getCurrentView();
        //if (view === gdk.panel.get(PanelId.PveScene)) 
        let model = view.getComponent(PveSceneCtrl).model;
        let roads = model.tiled.roads;
        let gates = model.tiled.gates;
        let id = '';
        model.enemyCfg.forEach(cfg => {
            if (cfg.enemy_id == this.info.id) {
                id = cfg.spawn[0] + ''
            }
        })
        let road: cc.Vec2[] = roads[id].concat();
        for (let j = 0; j < 3; j++) {
            let temRoad = road.concat()
            let node: cc.Node = PvePool.get(model.ctrl.roadMovePrefab);
            let ctrl: PveRoadMoveEffectCtrl = node.getComponent(PveRoadMoveEffectCtrl);
            node.setParent(model.ctrl.hurt)
            let gateList: cc.Vec2[] = [];

            for (let gkey in gates) {
                //let pt: cc.Vec2 = gates[key];
                let args: any[] = gkey.split('_');
                if (args[0] == id && roads[args[4]]) {
                    gateList = roads[args[4]].concat();
                }
            }
            ctrl.initData(id, temRoad, j * 0.2, gateList, this.roadMoveFinish, this);
            this.moveNode.push(node);
        }
    }

    _itemSelect() {
        if (this.selectNode) {
            this.selectNode.active = this.ifSelect;
        }
    }

    roadMoveFinish(roadNode: cc.Node, roadName: string) {
        //cc.log('---------------roadMoveFinish-------------' + roadName)
        PvePool.put(roadNode);
        let index = this.moveNode.indexOf(roadNode);
        if (index > -1) {
            this.moveNode.splice(index, 1);
        }
    }
}
