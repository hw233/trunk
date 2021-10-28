import BYModel from '../model/BYModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import ResonatingModel from '../../resonating/model/ResonatingModel';
import { SkillCfg } from '../../../a/config';
import { SoliderSkinData } from './BYarmySkinPanelCtrl';



/** 
 * @Description: 兵营-兵团精甲穿戴界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-16 17:01:12
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmySkinPageItemCtrl")
export default class BYarmySkinPageItemCtrl extends cc.Component {

    @property(cc.Label)
    skinName: cc.Label = null;
    @property(cc.RichText)
    skillDes: cc.RichText = null;
    @property(sp.Skeleton)
    spine: sp.Skeleton = null;
    @property(cc.Node)
    yiyongyou: cc.Node = null;
    @property(cc.Node)
    weiyongyou: cc.Node = null;
    @property(cc.Node)
    heroList: cc.Node = null;
    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    @property(cc.Node)
    bg1: cc.Node = null;
    @property(cc.Node)
    bg2: cc.Node = null;
    @property(cc.Node)
    bgNode: cc.Node = null;
    @property(cc.Node)
    redNode: cc.Node = null;
    @property(sp.Skeleton)
    bgSpine: sp.Skeleton = null;

    get byModel() { return ModelManager.get(BYModel); }
    get heroModel() { return ModelManager.get(HeroModel); }
    get resModel() { return ModelManager.get(ResonatingModel) }


    updateView(data: SoliderSkinData, index: number, curIndex: number) {
        this.bg1.active = index != curIndex;
        this.bg2.active = index == curIndex;
        this.bgSpine.node.active = data.state == 2;
        this.heroList.removeAllChildren();
        if (index == curIndex) {
            //添加英雄头像
            let heroIds = this.heroModel.PveUpHeroList.concat();
            this.resModel.Lower.forEach(data => {
                if (heroIds.indexOf(data.heroId) < 0) {
                    heroIds.push(data.heroId)
                }
            })
            if (heroIds.length > 6) {
                heroIds.length = 6;
            }
            heroIds.forEach(heroId => {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
                if (heroInfo) {
                    let temType = Math.floor(heroInfo.soldierId / 100)
                    if (temType == data.cfg.type) {
                        if (heroInfo.soldierSkin == data.cfg.skin_id) {
                            let node = cc.instantiate(this.heroItem)
                            let head = cc.find('mask/head', node);
                            GlobalUtil.setSpriteIcon(this.node, head, GlobalUtil.getHeadIconById(heroInfo.typeId));
                            node.setParent(this.heroList);
                        }
                    }
                }
            })
        }
        let path = `spine/monster/${data.cfg.skin}/ui/${data.cfg.skin}`
        GlobalUtil.setSpineData(this.node, this.spine, path, true, 'stand_s', true);
        let skillCfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', data.cfg.skills);
        this.skillDes.string = skillCfg ? skillCfg.des : '';
        this.skinName.string = data.cfg.name;
        this.weiyongyou.active = data.state == 0;
        this.yiyongyou.active = data.state != 0;
        let state: 0 | 1 = data.state != 2 ? 1 : 0;
        GlobalUtil.setAllNodeGray(this.bgNode, state);
        //this.redNode.active = data.state == 1;
        this.refreshRedShow(data);
    }

    refreshRedShow(data: SoliderSkinData) {
        this.redNode.active = false;
        if (data.state == 1) {
            this.redNode.active = true;
        } else if (data.state == 2) {
            let curType = data.cfg.type
            let heroIds = this.heroModel.PveUpHeroList.concat();
            let res = false;
            heroIds.forEach(heroId => {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
                if (heroInfo) {
                    let temType = Math.floor(heroInfo.soldierId / 100)
                    if (temType == curType && heroInfo.soldierSkin <= 0) {
                        res = true;
                    }
                }
            })
            this.redNode.active = res;
        }
        //this.redNode.active = this.curSkinState.state == 1;
    }


}
