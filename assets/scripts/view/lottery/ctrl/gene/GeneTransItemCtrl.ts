import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import {
  Gene_groupCfg,
  Gene_transitionCfg,
  Hero_starCfg,
  HeroCfg
  } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-14 14:26:11 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneTransItemCtrl')
export default class GeneTransItemCtrl extends cc.Component {
  @property(cc.Label)
  heroName: cc.Label = null;

  @property(cc.Label)
  star: cc.Label = null;

  @property(cc.Node)
  group: cc.Node = null;

  @property(sp.Skeleton)
  heroSpine: sp.Skeleton = null;

  @property(cc.Node)
  unknowHero: cc.Node = null;

  @property(cc.Node)
  aniNode: cc.Node = null;

  @property(cc.Node)
  bgNode: cc.Node = null;

  //nameColor  color:#FFF9C3 outline:#C65827    unknow color:#FFF9C3 outline:#000000
  effectAni: cc.Animation = null

  changeHeroCfgs: HeroCfg[] = [];
  changeIndex: number = 0;
  updateView(infoOrTypeId: icmsg.HeroInfo | number, changeHero?: icmsg.HeroInfo) {
    gdk.Timer.clearAll(this);
    if (!infoOrTypeId) {
      this.heroName.string = '???????';
      this.heroName.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX('#000000');
      this.group.active = false;
      this.heroSpine.node.active = false;
      this.unknowHero.active = true;
      this.star.string = '';
      if (this.effectAni) {
        this.effectAni.targetOff(this);
        this.effectAni = null;
      }
      this.aniNode.active = false;
      this.unscheduleAllCallbacks();

      if (changeHero) {
        if (this.bgNode) {
          this.bgNode.active = true;
        }
        this.changeHeroCfgs = []
        this.changeIndex = 0;
        this.unknowHero.active = false;
        this.heroSpine.node.active = true;
        //this.heroSpine.node.opacity = 75;
        let changeHeroCfg = ConfigManager.getItemById(HeroCfg, changeHero.typeId);
        let tranCfg = ConfigManager.getItemByField(Gene_transitionCfg, 'camp', changeHeroCfg.group[0], { 'star': changeHero.star })
        if (tranCfg) {
          let groupCfgs = ConfigManager.getItemsByField(Gene_groupCfg, 'pool_id', tranCfg.pool);
          groupCfgs.forEach(cfg => {
            let typeId = parseInt(cfg.hero_id.toString().slice(0, 6));
            if (typeId != changeHero.typeId) {
              let heroCfg = ConfigManager.getItemById(HeroCfg, typeId);
              this.changeHeroCfgs.push(heroCfg);
            }
          })
          if (this.changeHeroCfgs.length > 0) {
            HeroUtils.setSpineData(this.node, this.heroSpine, this.changeHeroCfgs[this.changeIndex].skin, false, false);

            gdk.Timer.loop(1000, this, () => {
              if (changeHero) {
                this.changeIndex++;
                if (this.changeIndex >= this.changeHeroCfgs.length) {
                  this.changeIndex = 0;
                }
                HeroUtils.setSpineData(this.node, this.heroSpine, this.changeHeroCfgs[this.changeIndex].skin, false, false);
              }
            })
          }
        }
      }
    }
    else {
      if (this.bgNode) {
        this.bgNode.active = false;
      }
      this.changeHeroCfgs = []
      this.changeIndex = 0;
      let typeId: number;
      let star: number;
      if (infoOrTypeId instanceof icmsg.HeroInfo) {
        typeId = infoOrTypeId.typeId;
        star = infoOrTypeId.star;
      }
      else {
        typeId = infoOrTypeId;
        if (infoOrTypeId.toString().length > 6) {
          typeId = parseInt(infoOrTypeId.toString().slice(0, 6));
          star = parseInt(infoOrTypeId.toString().slice(6));
        }
      }
      let cfg = ConfigManager.getItemById(HeroCfg, typeId);
      if (!star) {
        star = cfg.star_min;
      }

      this.heroName.string = cfg.name;
      let quality = ConfigManager.getItemById(Hero_starCfg, star).color;
      this.heroName.node.color = BagUtils.getColor(quality);
      this.heroName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(quality);
      this.star.string = star > 5 ? '1'.repeat(star - 5) : '0'.repeat(star);
      this.unknowHero.active = false;
      this.heroSpine.node.active = true;
      //this.heroSpine.node.opacity = 255;
      HeroUtils.setSpineData(this.node, this.heroSpine, cfg.skin, false, false);
      this.group.active = true;
      GlobalUtil.setSpriteIcon(this.node, this.group, GlobalUtil.getGroupIcon(cfg.group[0], false));
    }

  }

  playEffect() {
    this.aniNode.active = true;
    this.unscheduleAllCallbacks();
    this.effectAni = this.aniNode.getComponent(cc.Animation)
    this.effectAni.on('finished', this.onFinished, this);
    this.effectAni.play("UI_hdyx")
  }

  onFinished() {
    this.effectAni.off('finished', this.onFinished, this);
    this.effectAni.play("UI_hdyx", 2.5)
    this.schedule(() => {
      this.effectAni.play("UI_hdyx", 2.5)
    }, 1)
  }

  playTargetAnim(newHeroId: number) {
    //this.heroSpine.node.opacity = 75;
    let state = GlobalUtil.getLocal('geneTransSkipAni', true)
    if (state != null && state) {
      if (this.bgNode) {
        this.bgNode.active = false;
      }
      this.playEffect();
      this.updateView(newHeroId);
    } else {

      this.temNum = 0;
      this.tem = 300
      gdk.Timer.once(this.tem, this, this.playAnim, [newHeroId])

    }
  }

  tem = 300
  temNum = 0;
  playAnim(newHeroId: number) {
    if (this.changeHeroCfgs.length > 0) {
      this.changeIndex++;
      if (this.changeIndex >= this.changeHeroCfgs.length) {
        this.changeIndex = 0;
      }
      if (this.temNum > 1500) {
        gdk.Timer.clearAll(this)
        if (this.bgNode) {
          this.bgNode.active = false;
        }
        this.playEffect();
        this.updateView(newHeroId);
        return;
      }
      this.temNum += this.tem;
      HeroUtils.setSpineData(this.node, this.heroSpine, this.changeHeroCfgs[this.changeIndex].skin, false, false);
      if (this.tem > 100) {
        this.tem -= 100
      } else if (this.tem > 70) {
        this.tem -= 10
      }
      gdk.Timer.once(this.tem, this, this.playAnim, [newHeroId])
    }
  }

  onDisable() {
    gdk.Timer.clearAll(this);
  }

}
