import ButtonSoundId from '../../../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StoreModel from '../../../../store/model/StoreModel';
import StoreUtils from '../../../../../common/utils/StoreUtils';
import { AskInfoType } from '../../../../../common/widgets/AskPanel';
import {
    Global_powerCfg,
    GlobalCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    SkillCfg,
    Store_awakeCfg,
    Store_pushCfg
    } from '../../../../../a/config';

/**
 * @Description: 英雄升星属性详情界面
 * @Author: chengyou.lin
 * @Date: 2020-03-12 15:18:06
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-26 10:50:52
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/star/StarUpdateSuccess2")
export default class StarUpdateSuccess2 extends gdk.BasePanel {
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
    // @property(sp.Skeleton)
    // starSpine: sp.Skeleton = null;

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
    @property(cc.RichText)
    pvpLabel: cc.RichText = null;

    @property(cc.Label)
    startLabel: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;
    // @property(cc.Node)
    // starLayout: cc.Node = null;
    // @property(cc.SpriteFrame)
    // starIcon1: cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    // starIcon2: cc.SpriteFrame = null;

    // @property(cc.Node)
    // starNodes: cc.Node[] = [];

    step: number;
    isShowGift: boolean = true;

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
        let limit_heroid = ConfigManager.getItemById(GlobalCfg, "limit_heroid").value[0]
        let limit_star = ConfigManager.getItemById(GlobalCfg, "limit_star").value[0]
        if (limit_heroid == this.heroInfo.typeId && this.heroInfo.star == limit_star) {
            let msg = new icmsg.StorePushListReq()
            NetManager.send(msg, (data: icmsg.StorePushListRsp) => {
                ModelManager.get(StoreModel).starGiftDatas = data.list
                gdk.panel.open(PanelId.MainLineGiftView)
            })
        } else {
            this._showPushGift()
        }
        NetManager.targetOff(this);
    }


    _showPushGift() {
        let cfg = ConfigManager.getItemByField(Store_pushCfg, "event_type", 1, { open_conds: this.heroInfo.star })
        if (cfg) {
            if (this.heroInfo.star >= 5) {
                let star = this.heroInfo.star
                let info: AskInfoType = {
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    sureCb: () => {
                        PanelId.AskPanel.isTouchMaskClose = true
                        gdk.panel.setArgs(PanelId.StarPushGiftView, star)
                        gdk.panel.open(PanelId.StarPushGiftView)
                    },
                    oneBtn: true,
                    sureText: gdk.i18n.t("i18n:HERO_TIP50"),
                    descText: `${this.heroInfo.star}${gdk.i18n.t("i18n:HERO_TIP51")}`,
                    thisArg: this,
                    closeBtnCb: () => {
                        PanelId.AskPanel.isTouchMaskClose = true
                        let msg = new icmsg.StorePushListReq()
                        NetManager.send(msg)
                        HeroUtils.showHeroCommment()
                    },
                }
                PanelId.AskPanel.isTouchMaskClose = false
                GlobalUtil.openAskPanel(info)
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
            if (!cc.isValid(this.node)) return;
            this.showHeroEffect();
        });
        this.startSpine.setAnimation(0, "stand2", false);

        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.risingStar);
    }

    updateHeroData() {
        let heroInfo = this.heroInfo;
        let starNum = heroInfo.star;
        this.setStar(starNum);
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
        let url = HeroUtils.getHeroSkin(heroInfo.typeId, heroInfo.star)
        HeroUtils.setSpineData(this.node, this.herorSpine, url, true, false);

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
        let nGiftLv = heroCfg.group[0] == 6 ? 1 : nstarcfg.gift_lv;
        let nskillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id, { level: nGiftLv }) || skillCfg;
        this.skillName.string = nskillCfg.name;
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(nskillCfg.skill_id));
        this.pveLabel.string = "";
        this.pveLabel.string = nskillCfg.des
        this.isShowGift = skillCfg.level !== nskillCfg.level;
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
        animation.play('starUpdatePro');
        animation.on('finished', this.showInfoFinish, this);
    }

    showInfoFinish() {
        this.step = 0;
        this.bgNode.getComponent(cc.Button).enabled = true;
    }

    showHeroAttrs() {
        this.proNode.active = true;
        let heroInfo = this.heroInfo;
        //let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroInfo.careerId, null)
        let careerCfg = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == this.heroInfo.careerLv) return true;
        });
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);

        let starNum = heroInfo.star - 1;
        let starcfg1 = ConfigManager.getItemByField(Hero_starCfg, "star", starNum);
        let starcfg2 = ConfigManager.getItemByField(Hero_starCfg, "star", starNum + 1);
        if (!starcfg1 || !starcfg2) {
            cc.error("heron no Hero_starCfg data typeId=", heroInfo.typeId);
            return;
        }
        let grow1 = heroCfg.group[0] == 6 ? starcfg1.add_grow_mystery : starcfg1.add_grow;
        let grow2 = heroCfg.group[0] == 6 ? starcfg2.add_grow_mystery : starcfg2.add_grow;


        // 更新英雄属性等级
        let keys = ["grow_atk", "grow_def", "grow_hp"];
        let attNames = ["atk_w", "def_w", "hp_w"];
        //let changes = [];
        let oldAttr = []
        let newAttr = []
        for (let i = 0; i < this.attrNodes.length; i++) {
            const attrNode = this.attrNodes[i];
            // let val = careerCfg[keys[i]];
            // let growCfg = ConfigManager.getItemById(Hero_growCfg, val);
            let num = heroCfg[attNames[i]];
            //this.heroCfg[attrNames[i]] * starCfg.add + careerCfg[growStrs[i]] * starCfg.add_grow * (this.heroInfo.level - 1) + careerCfg[attrNames[i]] * starCfg.add_grow;
            let tem1 = num * starcfg1.add + careerCfg[keys[i]] * grow1 * (heroInfo.level - 1) + careerCfg[attNames[i]] * grow1;
            let tem2 = num * starcfg2.add + careerCfg[keys[i]] * grow2 * (heroInfo.level - 1) + careerCfg[attNames[i]] * grow2;

            let currLab = attrNode.getChildByName("currLab").getComponent(cc.Label);
            let nextLab = attrNode.getChildByName("nextLab").getComponent(cc.Label);
            let attrIcon = attrNode.getChildByName("attrIcon").getComponent(cc.Sprite);
            let addLab = attrNode.getChildByName("addLab").getComponent(cc.Label);
            currLab.string = `${Math.floor(tem1)}`;
            nextLab.string = `${Math.floor(tem2)}`;
            addLab.string = `(+${Math.floor(tem2) - Math.floor(tem1)})`
            let icon = `view/role/texture/starupdatesuccess2/yx_tctubiao0${i}`;
            GlobalUtil.setSpriteIcon(this.node, attrIcon, icon);
            //changes.push(Math.floor(tem2) - Math.floor(tem1));
            oldAttr.push(Math.floor(tem1))
            newAttr.push(Math.floor(tem2))
        }

        let temAttrs = ['hit_w', 'dodge_w']
        let temGrows = ['grow_hit', 'grow_dodge']
        for (let i = 0; i < 2; i++) {
            let num = heroCfg[temAttrs[i]];
            let oldValue = num * starcfg1.add + careerCfg[temGrows[i]] * grow1 * (heroInfo.level - 1) + careerCfg[temAttrs[i]] * grow1;
            let nextValue = num * starcfg2.add + careerCfg[temGrows[i]] * grow2 * (heroInfo.level - 1) + careerCfg[temAttrs[i]] * grow2;
            oldAttr.push(Math.floor(oldValue))
            newAttr.push(Math.floor(nextValue))
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
        let oldPower = oldAttr[0] * atkRatio + oldAttr[2] * hpRatio + oldAttr[1] * defRatio + oldAttr[3] * hitRatio + oldAttr[4] * dodgeRatio;
        let newPower = newAttr[0] * atkRatio + newAttr[2] * hpRatio + newAttr[1] * defRatio + newAttr[3] * hitRatio + newAttr[4] * dodgeRatio;
        nodes[0].getChildByName('currLab').getComponent(cc.Label).string = Math.floor(oldPower) + ''//this.heroInfo.power - Math.floor(changePower) + '';
        nodes[0].getChildByName('nextLab').getComponent(cc.Label).string = Math.floor(newPower) + ''//this.heroInfo.power + '';
        nodes[0].getChildByName('addLab').getComponent(cc.Label).string = `(+${Math.floor(newPower) - Math.floor(oldPower)})`;
        //star
        let oldStar = this.heroInfo.star - 1 > 5 ? '1'.repeat(this.heroInfo.star - 1 - 5) : '0'.repeat(this.heroInfo.star - 1);
        let newStar = this.heroInfo.star > 5 ? '1'.repeat(this.heroInfo.star - 5) : '0'.repeat(this.heroInfo.star);
        let currLab = nodes[1].getChildByName('currLab').getComponent(cc.Label)
        let nextLab = nodes[1].getChildByName('nextLab').getComponent(cc.Label)
        let curMaxStarNode = nodes[1].getChildByName('maxstar1');
        let curMaxStarLb = cc.find('maxstar1/maxStarLb', nodes[1]).getComponent(cc.Label);
        let nextMaxStarNode = nodes[1].getChildByName('maxstar2');
        let nextMaxStarLb = cc.find('maxstar2/maxStarLb', nodes[1]).getComponent(cc.Label);
        nodes[1].getChildByName('addLab').getComponent(cc.Label).string = `(+1)`;
        if (this.heroInfo.star - 1 >= 12) {
            currLab.node.active = false;
            curMaxStarNode.active = true;
            curMaxStarLb.string = (this.heroInfo.star - 1 - 11) + ''
        } else {
            currLab.node.active = true;
            curMaxStarNode.active = false;
            currLab.string = oldStar;

        }
        if (this.heroInfo.star >= 12) {
            nextLab.node.active = false;
            nextMaxStarNode.active = true;
            nextMaxStarLb.string = (this.heroInfo.star - 11) + ''
        } else {
            nextLab.node.active = true;
            nextMaxStarNode.active = false;
            nextLab.string = newStar;

        }

        //lv
        let starCfg = ConfigManager.getItemById(Hero_starCfg, this.heroInfo.star - 1);
        let nextStarCfg = ConfigManager.getItemById(Hero_starCfg, this.heroInfo.star);
        let oldLv = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == starCfg.career_lv) return true;
        }).hero_lv;
        let newLv = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == nextStarCfg.career_lv) return true;
        }).hero_lv;
        nodes[2].getChildByName('currLab').getComponent(cc.Label).string = oldLv + '';
        nodes[2].getChildByName('nextLab').getComponent(cc.Label).string = newLv + '';
        nodes[2].getChildByName('addLab').getComponent(cc.Label).string = `(+${newLv - oldLv})`;
    }

    showSkillInfo() {
        this.proNode.active = false;
        this.skillNode.active = true;
        let animation = this.skillNode.getComponent(cc.Animation);
        animation.play();

        this.richTextEffect(this.pveLabel, 0);
        this.richTextEffect(this.pvpLabel, 0.2);
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
        if (this.step == 0) {
            if (!this.isShowGift) {
                if (this.heroInfo.star == 11) {
                    this._checkAwakeGift();
                    return;
                }
                else {
                    this.close();
                    return;
                }
            }
            this.step = 1;
            this.bgNode.getComponent(cc.Button).enabled = false;
            let animation = this.proNode.getComponent(cc.Animation);
            animation.play('starUpdatePro1');
            animation.on('finished', this.showSkillInfo, this);
        } else if (this.step == 2) {
            if (this.heroInfo.star == 11) {
                this._checkAwakeGift();
            }
            else {
                this.close();
            }
        }
    }

    _checkAwakeGift() {
        if (this.heroInfo.star == 11) {
            let cfg = ConfigManager.getItemByField(Store_awakeCfg, 'hero', this.heroInfo.typeId, { awake_lv: 1 });
            if (cfg) {
                let req = new icmsg.HeroAwakeGiftReq();
                NetManager.send(req, (resp: icmsg.HeroAwakeGiftRsp) => {
                    if (StoreUtils.getHeroAwakeGiftState(cfg.hero) == 1) {
                        GlobalUtil.openAskPanel({
                            descText: `恭喜达到觉醒(0/7)并激活英雄觉醒礼包,购买礼包助您快速觉醒<br/>(礼包内含觉醒需要的材料以及大量英雄经验)`,
                            oneBtn: true,
                            sureText: '前往',
                            sureCb: () => {
                                gdk.gui.removeAllPopup();
                                gdk.panel.setArgs(PanelId.HeroAwakeGiftView, [cfg.hero, 1]);
                                gdk.panel.open(PanelId.HeroAwakeGiftView);
                            },
                        });
                    }
                    this.close();
                }, this);
            }
            else {
                this.close();
            }
        }
    }
}
