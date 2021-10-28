import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { Hero_careerCfg } from '../../../../../a/config';

/** 
 * @Description: 职业精通子项
 * @Author:luoyong
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-14 18:25:10
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/CareerMasterItemCtrl2")
export default class CareerMasterItemCtrl2 extends UiListItem {

    @property(cc.Node)
    masterNode: cc.Node = null

    @property(cc.Node)
    careerIcon: cc.Node = null

    @property(cc.Label)
    careerName: cc.Label = null

    @property(cc.Node)
    attrNode: cc.Node[] = []

    @property(sp.Skeleton)
    careerEffect: sp.Skeleton = null;

    _careerCfg: Hero_careerCfg
    _heroId: number = 0

    get model() { return ModelManager.get(HeroModel); }

    onEnable() {
        this.attrNode.forEach(node => {
            let icon = node.getChildByName("icon");
            let attrName = node.getChildByName("attrName").getComponent(cc.Label);
            let attrValue = node.getChildByName("attrValue").getComponent(cc.Label);
            attrName.string = '';
            attrValue.string = '';
            GlobalUtil.setSpriteIcon(node, icon, null);
            node.active = false;
        });
    }

    onDisable() {
        gdk.Timer.clearAll(this)
    }

    updateView() {
        this._careerCfg = this.data.careerCfg
        this._heroId = this.data.heroId
        this.careerName.string = this._careerCfg.name
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, GlobalUtil.getCareerIcon(this._careerCfg.career_id))

        //初始全部设为未激活状态
        let isGray = true
        this.masterNode.active = false
        this.careerName.node.color = cc.color("#8c643f")
        let outline = this.careerName.getComponent(cc.LabelOutline)
        outline.enabled = false
        GlobalUtil.setGrayState(this.careerIcon, 1)
        let maxLv = HeroUtils.getJobMaxLv(this._careerCfg.career_id)
        let lv = HeroUtils.getHeroJobLv(this._heroId, this._careerCfg.career_id)

        let masterCareerIds = this.model.masterHeroCareerIds[this._heroId] as number[];
        //可以展示激活效果的
        if (masterCareerIds && masterCareerIds.indexOf(this._careerCfg.career_id) != -1) {
            HeroUtils.deleteHeroMasterCareer(this._heroId, this._careerCfg.career_id)
            let ani = this.careerIcon.getComponent(cc.Animation)
            //图标晃动
            ani.play("masterCareerIconShake")
            gdk.Timer.once(500, this, () => {
                ani.stop("masterCareerIconShake")
                this.careerEffect.setAnimation(0, "stand6", false)
                this.careerEffect.setCompleteListener(() => {
                    this.careerEffect.node.active = false;
                    this.careerIcon.x = -144.5
                    this.careerIcon.y = 2
                    if (lv >= maxLv) {
                        this.masterNode.active = true
                        GlobalUtil.setGrayState(this.careerIcon, 0)
                        this.careerName.node.color = cc.color("#FFF7BC")
                        outline.enabled = true
                        isGray = false
                    }
                    this._updateAttrState(isGray)
                });
            })
        } else {
            if (lv >= maxLv) {
                this.masterNode.active = true
                GlobalUtil.setGrayState(this.careerIcon, 0)
                this.careerName.node.color = cc.color("#FFF7BC")
                outline.enabled = true
                isGray = false
            }
        }
        this._updateAttrState(isGray)
    }

    _updateAttrState(isGray) {
        let keys = ["ul_hp_r", "ul_atk_r", "ul_def_r", "ul_hp_w", "ul_crit_w", "ul_atk_w", "ul_def_w", "ul_hit_w", "ul_dodge_w"]
        let names = [
            gdk.i18n.t("i18n:ROLE_TIP32"),
            gdk.i18n.t("i18n:ROLE_TIP31"),
            gdk.i18n.t("i18n:ROLE_TIP33"),
            gdk.i18n.t("i18n:ROLE_TIP34"),
            gdk.i18n.t("i18n:ROLE_TIP35"),
            gdk.i18n.t("i18n:ROLE_TIP36"),
            gdk.i18n.t("i18n:ROLE_TIP37"),
            gdk.i18n.t("i18n:ROLE_TIP38"),
            gdk.i18n.t("i18n:ROLE_TIP39"),
        ]
        let res = ['7', '9', '8', '2', '4', '4', '3', '6', '5',]

        let showKeys = []
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            let value = this._careerCfg[key]
            if (value != 0) {
                showKeys.push(key)
            }
        }
        for (let i = 0; i < this.attrNode.length; i++) {
            let node = this.attrNode[i]
            if (showKeys[i]) {
                node.active = true
                let index = keys.indexOf(showKeys[i])
                let icon = node.getChildByName("icon")
                GlobalUtil.setSpriteIcon(node, icon, `view/role/texture/career2/yx_tctubiao0${res[index]}`)
                let attrName = node.getChildByName("attrName").getComponent(cc.Label)
                attrName.string = names[index]
                let attrValue = node.getChildByName("attrValue").getComponent(cc.Label)
                if (showKeys[i].indexOf("_r") != -1) {
                    attrValue.string = "+" + `${(this._careerCfg[showKeys[i]] / 100)}%`
                } else {
                    attrValue.string = "+" + this._careerCfg[showKeys[i]]
                }

                if (isGray) {
                    GlobalUtil.setGrayState(icon, 1)
                    attrName.node.color = cc.color("#8c643f")
                    attrValue.node.color = cc.color("#8c643f")
                } else {
                    GlobalUtil.setGrayState(icon, 0)
                    attrName.node.color = cc.color("#F1B77F")
                    attrValue.node.color = cc.color("#39FF7F")
                }
            } else {
                node.active = false
            }
        }
    }
}
