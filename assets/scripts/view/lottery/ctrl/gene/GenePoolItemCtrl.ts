import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import { GeneCfg } from '../../../../a/config';
import { LotteryEventId } from '../../enum/LotteryEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-12 14:51:27 
  */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GenePoolItemCtrl')
export default class GenePoolItemCtrl extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(sp.Skeleton)
    select: sp.Skeleton = null;

    cfg: GeneCfg;
    spUrls: string[] = [
        'UI_jiyinzhaohuanxuanzhongjinzi', //group0
        'UI_jiyinzhaohuanxuanzhongjin', //group1
        'UI_jiyinzhaohuanxuanzhongzi',  //group2
        'UI_jiyinzhaohuanxuanzhonghong', //group3
        'UI_jiyinzhaohuanxuanzhonglan', //group4
        'UI_jiyinzhaohuanxuanzhonglv'   //group5
    ]
    updateView(cfg: GeneCfg) {
        this.cfg = cfg;
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/lottery/texture/bg/gene_group${this.cfg.camp}`);
        this.icon.setPosition(0, 21);
        // this.setSkewX(3, this.icon);
    }

    setSkewX(skewX: number, node: cc.Node) {
        if (!cc.isValid(node)) return;
        let k = Math.abs(Math.tan(skewX * Math.PI / 180));
        let angle = Math.acos((Math.sqrt(4 + k * k) - k) / 2) * 180 / Math.PI;
        let scale = 2 / (Math.sqrt(4 + k * k) - k);
        node.is3DNode = true;
        node.eulerAngles = cc.v3(angle, skewX < 0 ? -angle : angle, 0);
        node.scale = scale;
    }

    onPoolClick() {
        gdk.e.emit(LotteryEventId.GENE_POOL_SELECT, this.cfg.id);
    }

    onWeightClick() {
        gdk.panel.setArgs(PanelId.GeneWeightView, this.cfg.pool);
        gdk.panel.open(PanelId.GeneWeightView);
    }

    onSelect(withAni = true) {
        // let idx = this.node.getSiblingIndex();
        // let total = this.node.parent.childrenCount;
        // let skewX = idx >= total / 2 ? -5 : 5;
        // if ((total / 2).toString().indexOf('.') !== -1) {
        //     if (idx == Math.floor(total / 2)) {
        //         skewX = 0;
        //     }
        // }
        // this.setSkewX(5, this.icon);
        this.select.node.active = true;
        this.select.setCompleteListener(() => {
            this.select.setCompleteListener(null);
            this.select.setAnimation(0, 'stand2', true);
        });
        GlobalUtil.setSpineData(this.node, this.select, `spine/ui/UI_gene_group${this.cfg.camp}/${this.spUrls[this.cfg.camp]}`, true, 'stand', true);
        this.icon.stopAllActions();
        if (withAni) {
            this.icon.runAction(cc.spawn(
                cc.scaleTo(.15, 1.2, 1.2),
                cc.moveTo(.15, cc.v2(0, 65))
            ));
        }
        else {
            this.icon.setScale(1.2);
            this.icon.setPosition(0, 65);
        }
    }

    unSelect() {
        // this.setSkewX(3, this.icon);
        this.select.setCompleteListener(null);
        GlobalUtil.setSpineData(this.node, this.select, null);
        this.select.node.active = false;
        this.icon.stopAllActions();
        this.icon.runAction(cc.spawn(
            cc.scaleTo(.1, 1, 1),
            cc.moveTo(.1, cc.v2(0, 21))
        ));
    }
}
