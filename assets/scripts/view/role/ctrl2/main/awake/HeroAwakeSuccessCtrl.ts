import ButtonSoundId from '../../../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StoreUtils from '../../../../../common/utils/StoreUtils';
import {
    Global_powerCfg,
    Hero_awakeCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    SkillCfg,
    Store_awakeCfg
    } from '../../../../../a/config';

/**
 * 英雄觉醒
 * @Author: luoyong
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-26 10:48:56
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/awake/HeroAwakeSuccessCtrl")
export default class HeroAwakeSuccessCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(sp.Skeleton)
    startSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    bgSpine: sp.Skeleton = null;
    @property(cc.Node)
    heroNode: cc.Node = null;
    @property(sp.Skeleton)
    herorSpine: sp.Skeleton = null;

    @property(cc.Node)
    proNode: cc.Node = null;
    @property(cc.Node)
    attrNodes: cc.Node[] = [];

    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Label)
    skillName: cc.Label = null;
    @property(cc.Sprite)
    skillIcon: cc.Sprite = null;
    @property(cc.RichText)
    pveLabel: cc.RichText = null;

    @property(cc.Label)
    startLabel: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    @property(cc.Node)
    lvNodes: cc.Node = null;

    @property(cc.Label)
    effectLv: cc.Label = null;

    step: number;
    isShowGift: boolean = false;

    get model() { return ModelManager.get(HeroModel); }

    heroInfo: icmsg.HeroInfo;
    onEnable() {
        let arg = this.args;
        this.heroInfo = arg[0];
        if (!this.heroInfo) this.heroInfo = this.model.curHeroInfo;

        //隐藏点击关闭按钮
        this.bgNode.getComponent(cc.Button).enabled = false;
        this.updateHeroData();
        this.startEffect();
    }

    onDisable() {
        let lv = this.model.heroAwakeStates[this.heroInfo.heroId].awakeLv;
        let cfg = ConfigManager.getItemByField(Store_awakeCfg, 'hero', this.heroInfo.typeId, { awake_lv: lv + 1 });
        let typeId = this.heroInfo.typeId;
        if (cfg) {
            if (StoreUtils.getHeroAwakeGiftState(typeId) == 1) {
                GlobalUtil.openAskPanel({
                    descText: `恭喜达到觉醒(${lv}/7)并激活英雄觉醒礼包,购买礼包助您快速觉醒<br/>(礼包内含觉醒需要的材料以及大量英雄经验)`,
                    oneBtn: true,
                    sureText: '前往',
                    sureCb: () => {
                        gdk.gui.removeAllPopup();
                        gdk.panel.setArgs(PanelId.HeroAwakeGiftView, [typeId, lv + 1]);
                        gdk.panel.open(PanelId.HeroAwakeGiftView);
                    }
                })
            }
        }
    }

    startEffect() {
        this.heroNode.active = false;
        this.startSpine.loop = false;
        this.proNode.active = false;
        this.skillNode.active = false;
        this.startSpine.setCompleteListener(() => {
            this.startSpine.setCompleteListener(null);
            this.startSpine.node.active = false;
            this.effectLv.node.active = false
            if (!cc.isValid(this.node)) return;
            this.showHeroEffect();
        });
        let awakeState = this.model.heroAwakeStates[this.heroInfo.heroId]
        this.startSpine.setAnimation(0, "stand9", false);
        gdk.Timer.once(500, this, () => {
            this.effectLv.string = `${awakeState.awakeLv}/7`
        })
        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.risingStar);
    }

    updateHeroData() {
        let heroInfo = this.heroInfo;
        let starNum = heroInfo.star;
        this.setStar(starNum);
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
        HeroUtils.setSpineData(this.node, this.herorSpine, HeroUtils.getHeroSkin(heroInfo.typeId, heroInfo.star), true, false);

        let oldStar = heroInfo.star - 1;
        let newStar = heroInfo.star;
        // let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
        let starcfg = ConfigManager.getItemByField(Hero_starCfg, "star", oldStar);
        let giftLv = heroCfg.group[0] == 6 ? 1 : starcfg.gift_lv;
        let skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id, { level: giftLv })
        if (!skillCfg) {
            skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id);
        }
        let nstarcfg = ConfigManager.getItemByField(Hero_starCfg, "star", newStar);
        let ngiftLv = heroCfg.group[0] == 6 ? 1 : nstarcfg.gift_lv;
        let nskillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id, { level: ngiftLv }) || skillCfg;
        this.skillName.string = nskillCfg.name;
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(nskillCfg.skill_id));
        this.pveLabel.string = "";
        this.pveLabel.string = nskillCfg.des

        // this.isShowGift = skillCfg.level !== nskillCfg.level;
    }

    setStar(starNum: number) {
        if (starNum >= 12) {
            this.startLabel.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        } else {
            this.startLabel.node.active = true;
            this.maxStarNode.active = false;
            this.startLabel.string = starNum > 5 ? '2'.repeat(starNum - 5) : '1'.repeat(starNum);
        }
    }

    showHeroEffect() {
        this.heroNode.active = true;
        this.bgSpine.loop = false;
        this.bgSpine.setCompleteListener(() => {
            this.bgSpine.setCompleteListener(null);
            if (!cc.isValid(this.node)) return;

        });
        this.bgSpine.setAnimation(0, "stand3", false);
        this.scheduleOnce(() => {
            this.showHeroInfo();
        }, 0.7);
    }

    showHeroInfo() {
        this.showHeroAttrs();
        this.bgSpine.setAnimation(0, "stand4", false);
        let animation = this.proNode.getComponent(cc.Animation);
        animation.play('awakeBgAni');
        animation.on('finished', this.showInfoFinish, this);
    }

    showInfoFinish() {
        this.step = 0;
        this.bgNode.getComponent(cc.Button).enabled = true;
    }

    showHeroAttrs() {
        this.proNode.active = true;
        let heroInfo = this.heroInfo;
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
        let awakeState = this.model.heroAwakeStates[heroInfo.heroId]


        let awakeMaxLv = ConfigManager.getItems(Hero_awakeCfg, { hero_id: heroCfg.id }).length - 1
        let awakeCfg = ConfigManager.getItemByField(Hero_awakeCfg, "hero_id", heroCfg.id, { "awake_lv": awakeState.awakeLv })
        let oldAwakeCfg = ConfigManager.getItemByField(Hero_awakeCfg, "hero_id", heroCfg.id, { "awake_lv": awakeState.awakeLv - 1 })

        for (let i = 0; i < this.lvNodes.childrenCount; i++) {
            if (i < awakeState.awakeLv) {
                this.lvNodes.children[i].active = true
                if (awakeState.awakeLv + 1 >= awakeMaxLv) {
                    GlobalUtil.setSpriteIcon(this.node, this.lvNodes.children[i], `view/role/texture/awake/yxjx_lvsekuang`)
                }
            }
        }

        // 更新英雄属性等级
        let heroAtt = HeroUtils.getHeroAttrById(this.heroInfo.heroId);
        let cfgAttrNames = ['atk_w', 'def_w', 'hp_w']
        let attrNames = ["atkW", "defW", "hpW"];
        let extNames = ["atkG", "defG", "hpG"];
        let changes = []

        //let attrNames1 = ['atk_w', 'hp_w', 'def_w'];
        let growStrs = ['grow_atk', 'grow_def', 'grow_hp'];
        //let nextStarCfg = ConfigManager.getItemById(Hero_starCfg, awakeCfg.star);
        let oldStarCfg = ConfigManager.getItemById(Hero_starCfg, awakeCfg.star);
        let grow = heroCfg.group[0] == 6 ? oldStarCfg.add_grow_mystery : oldStarCfg.add_grow;
        let careerCfg = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == this.heroInfo.careerLv) return true;
        });
        let oldAttr = []
        let newAttr = []
        for (let i = 0; i < this.attrNodes.length; i++) {
            const attrNode = this.attrNodes[i];
            let tem1 = heroCfg[cfgAttrNames[i]] * oldStarCfg.add + careerCfg[growStrs[i]] * grow * (this.heroInfo.level - 1) + (careerCfg[cfgAttrNames[i]] + oldAwakeCfg[cfgAttrNames[i]]) * grow;//heroAtt[attrNames[i]] + heroAtt[extNames[i]]
            let tem2 = heroAtt[attrNames[i]]//heroAtt[attrNames[i]] + heroAtt[extNames[i]] + awakeCfg[cfgAttrNames[i]]

            let currLab = attrNode.getChildByName("currLab").getComponent(cc.Label);
            let nextLab = attrNode.getChildByName("nextLab").getComponent(cc.Label);
            let attrIcon = attrNode.getChildByName("attrIcon").getComponent(cc.Sprite);
            let addLab = attrNode.getChildByName("addLab").getComponent(cc.Label);
            currLab.string = `${Math.floor(tem1)}`;
            nextLab.string = `${Math.floor(tem2)}`;
            addLab.string = `(+${Math.floor(tem2) - Math.floor(tem1)})`
            let icon = `view/role/texture/starupdatesuccess2/yx_tctubiao0${i}`;
            GlobalUtil.setSpriteIcon(this.node, attrIcon, icon);
            // changes.push(Math.floor(tem2) - Math.floor(tem1));

            // changes.push(awakeCfg[cfgAttrNames[i]])
            oldAttr.push(Math.floor(tem1))
            newAttr.push(Math.floor(tem2))
        }

        let temAttrs = ['hit_w', 'dodge_w']
        let temAttrs1 = ['hitW', 'dodgeW']
        let temGrows = ['grow_hit', 'grow_dodge']
        for (let i = 0; i < 2; i++) {
            //let oldValue = this.heroCfg[temAttrs[i]] * starCfg.add + careerCfg[temGrows[i]] * starCfg.add_grow * (this.heroInfo.level - 1) + careerCfg[temAttrs[i]] * starCfg.add_grow;
            let oldValue = heroCfg[temAttrs[i]] * oldStarCfg.add + careerCfg[temGrows[i]] * grow * (this.heroInfo.level - 1) + (careerCfg[temAttrs[i]] + oldAwakeCfg[temAttrs[i]]) * grow;
            oldAttr.push(Math.floor(oldValue))
            newAttr.push(Math.floor(heroAtt[temAttrs1[i]]))
        }

        //更新战力、星级、等级上限
        let nodes = [cc.find('attPanel/attNode1', this.proNode), cc.find('attPanel/attNode2', this.proNode), cc.find('attPanel/attNode3', this.proNode)];
        //power
        let atkRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'atk').value;
        let defRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'def').value;
        let hpRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'hp').value;
        let hitRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'hit').value;
        let dodgeRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'dodge').value;

        //let changePower = changes[0] * atkRatio + changes[1] * defRatio + changes[2] * hpRatio;
        let oldPower = oldAttr[0] * atkRatio + oldAttr[1] * hpRatio + oldAttr[2] * defRatio + oldAttr[3] * hitRatio + oldAttr[4] * dodgeRatio;
        let newPower = newAttr[0] * atkRatio + newAttr[1] * hpRatio + newAttr[2] * defRatio + newAttr[3] * hitRatio + newAttr[4] * dodgeRatio;
        nodes[0].getChildByName('currLab').getComponent(cc.Label).string = Math.floor(oldPower) + ''//this.heroInfo.power - Math.floor(changePower) + '';
        nodes[0].getChildByName('nextLab').getComponent(cc.Label).string = Math.floor(newPower) + ''//this.heroInfo.power + '';
        nodes[0].getChildByName('addLab').getComponent(cc.Label).string = '(+' + (Math.floor(newPower) - Math.floor(oldPower)) + ')'//`(+${Math.floor(changePower)})`;

        if (awakeState.awakeLv >= awakeMaxLv) {
            let heroStar = awakeState.heroStar
            //star
            let oldStar = heroStar - 1 > 5 ? '1'.repeat(heroStar - 1 - 5) : '0'.repeat(heroStar - 1);
            let newStar = heroStar > 5 ? '1'.repeat(heroStar - 5) : '0'.repeat(heroStar);
            let currLab = nodes[1].getChildByName('currLab').getComponent(cc.Label)
            let nextLab = nodes[1].getChildByName('nextLab').getComponent(cc.Label)
            let curMaxStarNode = nodes[1].getChildByName('maxstar1');
            let curMaxStarLb = cc.find('maxstar1/maxStarLb', nodes[1]).getComponent(cc.Label);
            let nextMaxStarNode = nodes[1].getChildByName('maxstar2');
            let nextMaxStarLb = cc.find('maxstar2/maxStarLb', nodes[1]).getComponent(cc.Label);
            nodes[1].getChildByName('addLab').getComponent(cc.Label).string = `(+1)`;
            if (heroStar - 1 >= 12) {
                currLab.node.active = false;
                curMaxStarNode.active = true;
                curMaxStarLb.string = (heroStar - 1 - 11) + ''
            } else {
                currLab.node.active = true;
                curMaxStarNode.active = false;
                currLab.string = oldStar;

            }
            if (heroStar >= 12) {
                nextLab.node.active = false;
                nextMaxStarNode.active = true;
                nextMaxStarLb.string = (heroStar - 11) + ''
            } else {
                nextLab.node.active = true;
                nextMaxStarNode.active = false;
                nextLab.string = newStar;
            }

            //lv
            let starCfg = ConfigManager.getItemById(Hero_starCfg, heroStar - 1);
            let nextStarCfg = ConfigManager.getItemById(Hero_starCfg, heroStar);
            let oldLv = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
                if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == starCfg.career_lv) return true;
            }).hero_lv;
            let newLv = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
                if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == nextStarCfg.career_lv) return true;
            }).hero_lv;
            nodes[2].getChildByName('currLab').getComponent(cc.Label).string = oldLv + '';
            nodes[2].getChildByName('nextLab').getComponent(cc.Label).string = newLv + '';
            nodes[2].getChildByName('addLab').getComponent(cc.Label).string = `(+${newLv - oldLv})`;
        } else {
            nodes[1].active = false
            nodes[2].active = false
        }

    }

    showSkillInfo() {
        this.proNode.active = false;
        this.skillNode.active = true;
        let animation = this.skillNode.getComponent(cc.Animation);
        animation.play();

        this.richTextEffect(this.pveLabel, 0);
        this.scheduleOnce(() => {
            this.allFinish();
        }, 1.0);
    }

    richTextEffect(richText: cc.RichText, time: number) {
        let defColor = richText.node.color;
        let childs = richText.node.children;
        for (let i = 0; i < childs.length; i++) {
            const child = childs[i];
            if (cc.isValid(child) && child.name == "RICHTEXT_CHILD") {
                //不是默认颜色，做动画处理
                if (!child.color.equals(defColor)) {
                    child.opacity = 0;
                }
            }
        }
        this.scheduleOnce(() => {
            if (cc.isValid(this.node) && cc.isValid(richText.node)) {
                this.runRichTextEffect(richText);
            }
        }, 0.2 + time);
    }

    runRichTextEffect(richText: cc.RichText) {
        let defColor = richText.node.color;
        let childs = richText.node.children;
        for (let i = 0; i < childs.length; i++) {
            const child = childs[i];
            if (cc.isValid(child) && child.name == "RICHTEXT_CHILD") {
                //不是默认颜色，做动画处理
                if (!child.color.equals(defColor)) {
                    child.y -= 30;
                    let action = cc.spawn(cc.fadeIn(0.5), cc.moveBy(0.5, cc.v2(0, 30)));
                    child.runAction(action);
                }
            }
        }
    }

    allFinish() {
        //打开点击关闭事件
        this.bgNode.getComponent(cc.Button).enabled = true;
        this.step = 2;
    }

    onCloseBtnClick() {
        // if (this.step == 0) {
        //     if (!this.isShowGift) {
        //         this.close();
        //         return;
        //     }
        //     this.step = 1;
        //     this.bgNode.getComponent(cc.Button).enabled = false;
        //     let animation = this.proNode.getComponent(cc.Animation);
        //     animation.play('starUpdatePro1');
        //     // animation.on('finished', this.showSkillInfo, this);
        // } else if (this.step == 2) {
        //     this.close();
        // }
        this.close();
    }
}