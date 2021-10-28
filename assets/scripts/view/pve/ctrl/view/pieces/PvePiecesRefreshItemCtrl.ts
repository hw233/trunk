import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PiecesModel, { PiecesTalentType } from '../../../../../common/models/PiecesModel';
import PiecesUtils from '../../../../pieces/utils/PiecesUtils';
import StringUtils from '../../../../../common/utils/StringUtils';
import { Hero_careerCfg, Pieces_fetterCfg, Pieces_heroCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-21 14:19:03 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesRefreshItemCtrl")
export default class PvePiecesRefreshItemCtrl extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    upTips: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    fetterContent: cc.Node = null;

    @property(cc.Node)
    fetterIcon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    costLab: cc.Label = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(sp.Skeleton)
    tipsSpine: sp.Skeleton = null;

    spineUrl: string[] = ['spine/ui/UI_morizizouqi_shengxingyingxiong/UI_morizizouqi_shengxingyingxiong', 'spine/ui/UI_morizizouqi_xiangtongyingxiong/UI_morizizouqi_xiangtongyingxiong'];
    bgUrl: string[] = [
        'view/pieces/texture/static/mrzzq_yingxiongkuang',
        'view/pve/texture/ui/pieces/mrzzq_yingxiongkuanglv',
        'view/pve/texture/ui/pieces/mrzzq_yingxiongkuanglan',
        'view/pve/texture/ui/pieces/mrzzq_yingxiongkuangzi',
        'view/pve/texture/ui/pieces/mrzzq_yingxiongkuanghuang',]
    pos: number;
    typeId: number
    updateView(typeId, pos) {
        [this.typeId, this.pos] = [typeId, pos];
        this.content.active = typeId !== 0;
        GlobalUtil.setSpriteIcon(this.node, this.node.getChildByName('bg'), this.bgUrl[0]);
        if (this.content.active) {
            let url = StringUtils.format("spine/hero/{0}/0.5/{0}", HeroUtils.getHeroSkin(typeId));
            GlobalUtil.setSpineData(this.node, this.spine, url, false, "stand", true, false);
            let cfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', typeId);
            GlobalUtil.setSpriteIcon(this.node, this.node.getChildByName('bg'), this.bgUrl[cfg.color]);
            this.nameLab.string = cfg.hero_name;
            this.nameLab.node.color = cc.color().fromHEX(BagUtils.getColorInfo(cfg.color).color);
            this.costLab.string = this._getRealCost() + '';
            let careerId = PiecesUtils.getCareerIdByHeroType(cfg.hero_id);
            GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${cfg.group[0]}`)
            GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', cfg.hero_id, { career_id: careerId }).career_type}`)

            this.fetterContent.removeAllChildren();

            cfg.fetter.forEach(f => {
                let icon = cc.instantiate(this.fetterIcon);
                icon.parent = this.fetterContent;
                let c = ConfigManager.getItemByField(Pieces_fetterCfg, 'fetter_type', f);
                GlobalUtil.setSpriteIcon(this.node, icon, `view/pve/texture/ui/pieces/${c.icon}`);
            });

            this.upTips.active = PiecesUtils.upStarState(typeId);
            this.tipsSpine.node.active = false;
            if (this.upTips.active) {
                this.tipsSpine.node.active = true;
                GlobalUtil.setSpineData(this.node, this.tipsSpine, this.spineUrl[0], false, 'stand', true);
            }
            else {
                let list = PiecesUtils.getHeroListByType(0);
                for (let i = 0; i < list.length; i++) {
                    if (list[i].typeId == this.typeId) {
                        this.tipsSpine.node.active = true;
                        GlobalUtil.setSpineData(this.node, this.tipsSpine, this.spineUrl[1], false, 'stand', true);
                        break;
                    }
                }
            }
        }
    }

    onClick() {
        if (this.typeId !== 0) {
            let m = ModelManager.get(PiecesModel);
            if (m.silver < this._getRealCost()) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:PIECES_TIPS11'));
            }
            else {
                let req = new icmsg.PiecesBuyHeroReq();
                req.pos = this.pos;
                NetManager.send(req, (resp: icmsg.PiecesBuyHeroRsp) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.active) return;
                    this.content.active = false;
                }, this);
            }
        }
    }

    /**
     * 获取真实价格
     * @returns 
     */
    _getRealCost() {
        //talent11
        let cost = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', this.typeId).silver[1];
        let d = 0;
        let t11 = PiecesUtils.getTalentInfoByType(PiecesTalentType.type11);
        t11.forEach(t => { d += cost * t / 100; });
        return Math.ceil(cost - d);
    }
}
