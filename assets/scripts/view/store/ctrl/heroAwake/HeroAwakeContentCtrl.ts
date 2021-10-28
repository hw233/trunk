import ActivityIconItemCtrl from '../../../act/ctrl/ActivityIconItemCtrl';
import HeroAwakeIconCtrl from './HeroAwakeIconCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-11 13:35:56 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/heroAwake/HeroAwakeContentCtrl")
export default class HeroAwakeContentCtrl extends cc.Component {
    @property(cc.Prefab)
    giftIcon: cc.Prefab = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    childrens: cc.Node[] = [];
    onEnable() {
        NetManager.on(icmsg.HeroAwakeGiftRsp.MsgType, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateIcon();
        }, this);

        NetManager.on(icmsg.HeroAwakeGiftUpdateRsp.MsgType, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateIcon();
        }, this);

        NetManager.send(new icmsg.HeroAwakeGiftReq());
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    _updateIcon() {
        this._clear();
        let actHeroIds = [];
        let keys = Object.keys(this.storeModel.heroAwakeGiftMap);
        keys.forEach(k => {
            if (StoreUtils.getHeroAwakeGiftState(parseInt(k)) == 1) {
                actHeroIds.push(parseInt(k));
            }
        });
        let actIconId = this.node.getComponent(ActivityIconItemCtrl).id;
        actHeroIds.forEach((id, idx) => {
            let item = cc.instantiate(this.giftIcon);
            item.parent = this.node.parent;
            item.setSiblingIndex(this.node.getSiblingIndex() + idx + 1);
            this.childrens.push(item);
            let ctrl = item.getComponent(HeroAwakeIconCtrl);
            ctrl.init(actIconId, id);
        });
    }

    _clear() {
        this.childrens.forEach(l => { l.removeFromParent(); });
        this.childrens = [];
    }
}
