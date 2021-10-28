import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import { Copy_stageCfg, HeroCfg } from '../../../../a/config';


/** 
 * 英雄觉醒提示窗口
 * @Author: yaozu.hu
 * @Date: 2021-04-26 10:43:06
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-29 11:46:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveHeroAwakeningViewCtrl")
export default class PveHeroAwakeningViewCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property([cc.Node])
    limits: cc.Node[] = [];

    @property(cc.Label)
    nameLb: cc.Label = null;
    @property(cc.Label)
    sureLb: cc.Label = null;


    stageCfg: Copy_stageCfg;
    sceneModel: PveSceneModel;
    starSpStrs: string[] = ['view/instance/texture/endRuins/xsl_xingxing', 'view/instance/texture/endRuins/fb_xingxing01'];

    timeNum: number = 5;
    get copyModel() { return ModelManager.get(CopyModel); }
    get heroModel() { return ModelManager.get(HeroModel); }
    onEnable() {
        let args = gdk.panel.getArgs(PanelId.PveHeroAwakeningView);
        if (args) {
            this.stageCfg = args[0]
        }

        this.nameLb.string = this.stageCfg.name;
        //设置英雄Spine
        let heroCfg = ConfigManager.getItemByField(HeroCfg, 'id', this.copyModel.heroAwakeHeroBaseId);
        let path = `spine/hero/${heroCfg.skin}/1/${heroCfg.skin}`
        GlobalUtil.setSpineData(this.node, this.heroSpine, path, true, 'stand', true);

        //设置条件
        let view = gdk.gui.getCurrentView();
        this.sceneModel = view.getComponent(PveSceneCtrl).model;
        if (this.sceneModel.gateconditionUtil) {
            let dataList = this.sceneModel.gateconditionUtil.DataList;
            this.limits.forEach((n, idx) => {
                let data = dataList[idx];
                n.active = !!data;
                if (n.active) {
                    let starIcon = n.getChildByName('star');
                    let lab = n.getChildByName('lab').getComponent(cc.RichText);
                    let state = data.start && data.state
                    GlobalUtil.setSpriteIcon(this.node, starIcon, this.starSpStrs[0]);// this.starSpStrs[state ? 0 : 1]
                    lab.string = `<color=#FFDAC6><outline color=#300A05 width=2>${data.cfg.des}</outline></c>`;
                }
            });
        }
        this.timeNum = 5;
        this.sureLb.string = `确定(${Math.ceil(this.timeNum)}s)`
        gdk.Timer.loop(1000, this, () => {
            this.sureLb.string = `确定(${Math.ceil(this.timeNum)}s)`
        })
        //判断觉醒英雄是否上阵
        this.copyModel.haveAwakeHero = false;
        let upHeroList = this.heroModel.PveUpHeroList
        upHeroList.forEach(id => {
            if (id > 0) {
                let info = HeroUtils.getHeroInfoByHeroId(id);
                if (info.typeId == this.copyModel.heroAwakeHeroBaseId) {
                    this.copyModel.haveAwakeHero = true;
                }
            }
        });

    }

    update(dt: number) {
        if (this.timeNum > 0) {
            this.timeNum -= dt;
            if (this.timeNum <= 0) {
                this.sureBtnClick();
            }
        }
    }

    onDisable() {
        gdk.Timer.clearAll(this);
    }
    sureBtnClick() {
        this.close()
        //打开英雄上阵列表
        gdk.panel.setArgs(PanelId.PveHeroAwakeningSetUpHeroSelector, this.stageCfg);
        gdk.panel.open(PanelId.PveHeroAwakeningSetUpHeroSelector);
    }

}
