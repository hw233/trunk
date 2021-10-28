import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import RuneModel from '../../../../common/models/RuneModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagType } from '../../../../common/models/BagModel';
import { RuneCfg } from '../../../../a/config';
import { RuneEventId } from '../../enum/RuneEventId';
import { RuneMixMaterialType } from './RuneMixMaterialsSelectViewCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-01 16:25:01 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneMixViewCtrl")
export default class RuneMixViewCtrl extends gdk.BasePanel {
    @property(sp.Skeleton)
    bgSpine: sp.Skeleton = null;

    @property(cc.Node)
    targetRuneNode: cc.Node = null;

    @property(cc.Label)
    mixRuneName: cc.Label = null;

    @property(cc.Node)
    mixRuneSlot: cc.Node = null;

    @property(cc.Node)
    mixRandomIcon: cc.Node = null;

    @property(cc.Label)
    mixRuneLv: cc.Label = null;

    @property(cc.Node)
    attrNodes: cc.Node = null;

    @property(cc.Node)
    mainSlot: cc.Node = null;

    @property(cc.Node)
    materialSlot1: cc.Node = null;

    @property(cc.Node)
    materialSlot2: cc.Node = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Node)
    aniLinesNode: cc.Node = null;

    @property(cc.Node)
    aniIconSpineNode: cc.Node = null;

    get runeModel(): RuneModel { return ModelManager.get(RuneModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    mixRuneId: number;//融合符文ID
    materialsSelectMap: { [type: number]: string } = {}; // 0-主符文 1-材料符文;
    timeStamp: number; //点击间隔
    onEnable() {
        this._init();
        gdk.e.on(RuneEventId.RUNE_MIX_MATERIALS_SELECT, this._onRuneSelect, this);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateScore, this);
    }

    onDisable() {
        this.materialsSelectMap = {};
        this.mixRuneId = null;
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
    }

    onMixBtnClick() {
        if (!this.materialsSelectMap[0] || this.materialsSelectMap[0].length <= 0) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP32'));
            return;
        }

        if (!this.materialsSelectMap[1] || this.materialsSelectMap[1].length <= 0) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP33'));
            return;
        }
        let itemInfo = [[100091, 1], [3, 2000000],];
        for (let i = 0; i < itemInfo.length; i++) {
            let info = itemInfo[i];
            if (BagUtils.getItemNumById(info[0]) < info[1]) {
                gdk.gui.showMessage(`${BagUtils.getConfigById(info[0]).name}${gdk.i18n.t('i18n:RELIC_TIP11')}`);
                return;
            }
        }

        //点击间隔
        if (GlobalUtil.getServerTime() - this.timeStamp < 1300) return
        this.timeStamp = GlobalUtil.getServerTime();

        let heroId = 0;
        let heroStr = this.materialsSelectMap[0].split('_')[1];
        if (heroStr && heroStr.length >= 6) {
            heroId = parseInt(heroStr.slice(6));
        }
        let req = new icmsg.RuneMixReq();
        req.heroId = heroId;
        req.mainRuneId = parseInt(this.materialsSelectMap[0].split('_')[0]);
        req.subRuneId = parseInt(this.materialsSelectMap[1].split('_')[0]);
        NetManager.send(req, (resp: icmsg.RuneMixRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.active) return;
            this.playAni(() => {
                this.targetRuneNode.active = true;
                let g = new icmsg.GoodsInfo();
                g.typeId = resp.runeId;
                g.num = 1;
                GlobalUtil.openRewadrView([g]);
                this.materialsSelectMap = {};
                this.mixRuneId = null;
                this._init();
            })
            // this.bgSpine.setCompleteListener(null);
            // this.bgSpine.setCompleteListener(() => {
            //     this.targetRuneNode.active = true;
            //     let g = new icmsg.GoodsInfo();
            //     g.typeId = resp.runeId;
            //     g.num = 1;
            //     GlobalUtil.openRewadrView([g]);
            //     this.materialsSelectMap = {};
            //     this.mixRuneId = null;
            //     this._init();
            // });
            // this.bgSpine.setAnimation(0, 'stand2', true);
        }, this);
    }

    onMaterials2GetBtnClick() {
        JumpUtils.openRechargetLBPanel([4, 100091])
    }

    _init() {
        this._updateTarget();
        this._updateMaterials();
        this._updateMoney();
        this._updateScore();
        this.bgSpine.setCompleteListener(null);
        this.bgSpine.setAnimation(0, 'stand', true);
    }

    _onRuneSelect(e) {
        this.materialsSelectMap = e.data[0];
        let str1 = this.materialsSelectMap[0];
        let str2 = this.materialsSelectMap[1];
        if (str1 && str2) {
            let mainId = parseInt(str1.split('_')[0].slice(0, 6));
            let materialId = parseInt(str2.split('_')[0].slice(0, 6));
            let materialCfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', materialId);
            let cfg = ConfigManager.getItem(RuneCfg, (c: RuneCfg) => {
                if (c.consumption_main
                    && c.consumption_main[0][0] == mainId
                    && c.mix_material
                    && c.mix_material[0][0] == materialCfg.type
                    && c.mix_material[0][1] == materialCfg.color) {
                    return true;
                }
            });
            if (cfg) {
                this.mixRuneId = cfg.rune_id;
            }
        }
        else {
            this.mixRuneId = null;
        }
        this._updateTarget();
        this._updateMaterials();
    }

    _updateTarget() {
        if (!this.mixRuneId) {
            this.mixRuneName.string = gdk.i18n.t('i18n:RUNE_TIP34');
            this.mixRandomIcon.active = true;
            this.mixRuneSlot.active = false;
        }
        else {
            let cfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', this.mixRuneId);
            this.mixRuneName.string = cfg.name;
            this.mixRandomIcon.active = false;
            this.mixRuneSlot.active = true;
            this.mixRuneLv.string = `.${cfg.level}`;
            let ctrl = this.mixRuneSlot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(cfg.rune_id);
            ctrl.onClick.on(() => {
                let type = BagUtils.getItemTypeById(cfg.rune_id);
                if (type == BagType.RUNE) {
                    gdk.panel.setArgs(PanelId.RuneInfo, [parseInt(`${this.mixRuneId}00`), null, null]);
                    gdk.panel.open(PanelId.RuneInfo);
                }
            }, this);
        }
        this._updateAttrNode();
    }

    _updateAttrNode() {
        if (!this.materialsSelectMap || !this.materialsSelectMap[0]) {
            this.attrNodes.active = false;
        }
        else {
            this.attrNodes.active = true;
            let keys = ['level', 'hero_atk', 'hero_hp', 'hero_def'];
            let oldLabs = cc.find('old', this.attrNodes).children;
            let newLabs = cc.find('new', this.attrNodes).children;
            let newCfgs = this.mixRuneId ? ConfigManager.getItemByField(RuneCfg, 'rune_id', this.mixRuneId) : null;
            let oldCfgs = ConfigManager.getItemByField(RuneCfg, 'rune_id', parseInt(this.materialsSelectMap[0].split('_')[0].slice(0, 6)));
            keys.forEach((key, idx) => {
                oldLabs[idx].getComponent(cc.Label).string = oldCfgs[key];
                newLabs[idx].getComponent(cc.Label).string = newCfgs ? newCfgs[key] : '???';
            });
        }
    }

    _updateMaterials() {
        let infos = [this.materialsSelectMap[0], this.materialsSelectMap[1]];
        [this.mainSlot, this.materialSlot1].forEach((node, idx) => {
            let info = infos[idx];
            let ctrl = node.getComponent(UiSlotItem);
            ctrl.updateItemInfo(!info ? null : parseInt(info.split('_')[0].slice(0, 6)));
            node.getChildByName('addBtn').active = !info;
            let commonNode = cc.find('common', node);
            if (commonNode) {
                commonNode.active = !info;
            }
            let proBar = cc.find('barBg/bar', node);
            let proNum = cc.find('barBg/numLab', node).getComponent(cc.Label);
            proBar.width = !info ? 0 : 105;
            proNum.string = `${!info ? 0 : 1}/${1}`;
            proNum.node.color = cc.color().fromHEX(!info ? '#FF0000' : '#FFFFFF');
            cc.find('RedPoint', node).active = false;
            let type: RuneMixMaterialType = {
                mixRuneId: this.mixRuneId,
                costTpye: idx
            }
            ctrl.onClick.on(() => {
                //todo 打开材料选择界面
                gdk.panel.setArgs(PanelId.RuneMixMaterialsSelectView, [type, JSON.parse(JSON.stringify(this.materialsSelectMap))]);
                gdk.panel.open(PanelId.RuneMixMaterialsSelectView);
            });
        });
        //符文积分
        this._updateScore();
        //金币
        this._updateMoney();
    }

    _updateScore() {
        // let info = this.curRuneCfg.consumption[0];
        let itemInfo = [100091, 1];
        let ctrl = this.materialSlot2.getComponent(UiSlotItem);
        ctrl.updateItemInfo(itemInfo[0]);
        let nameLab = cc.find('layout2/lab', this.materialSlot2).getComponent(cc.Label);
        let numLab = cc.find('barBg/numLab', this.materialSlot2).getComponent(cc.Label);
        nameLab.string = BagUtils.getConfigById(itemInfo[0]).name;
        let hasNum = BagUtils.getItemNumById(itemInfo[0]);
        numLab.string = `${GlobalUtil.numberToStr(hasNum, true)}/${GlobalUtil.numberToStr(itemInfo[1], true)}`;
        numLab.node.color = cc.color().fromHEX(hasNum >= itemInfo[1] ? '#FFFFFF' : '#FF0000');
        ctrl.itemInfo = {
            series: null,
            itemId: itemInfo[0],
            itemNum: itemInfo[1],
            type: BagUtils.getItemTypeById(itemInfo[0]),
            extInfo: null
        };
    }

    @gdk.binding("roleModel.gold")
    _updateMoney() {
        let itemInfo = [3, 2000000];
        GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(itemInfo[0]));
        this.costNode.getChildByName('num').getComponent(cc.Label).string = `${GlobalUtil.numberToStr(BagUtils.getItemNumById(itemInfo[0]), true)}/${GlobalUtil.numberToStr(itemInfo[1], true)}`;
        this.costNode.getChildByName('num').color = BagUtils.getItemNumById(itemInfo[0]) >= itemInfo[1] ? new cc.Color().fromHEX('#FFCE4B') : new cc.Color().fromHEX('#FF0000');
    }

    playAni(cb?: Function) {
        let idx = 0;
        this.aniIconSpineNode.active = true;
        this.aniIconSpineNode.children.forEach(n => {
            let spine = n.getComponent(sp.Skeleton);
            spine.setCompleteListener(async () => {
                spine.setCompleteListener(null);
                idx += 1;
                if (idx == this.aniIconSpineNode.children.length) {
                    this.aniIconSpineNode.active = false;
                    await this._waitForDrawLineAni();
                    this.targetRuneNode.active = false;
                    this.bgSpine.setCompleteListener(() => {
                        this.bgSpine.setCompleteListener(null);
                        this.bgSpine.setAnimation(0, 'stand', true);
                        gdk.Timer.clearAll(this);
                        this.aniLinesNode.getComponent(cc.Mask)['_graphics'].clear(true);
                        cb && cb();
                    })
                    this.bgSpine.setAnimation(0, 'stand2', true);
                }
            });
            spine.setAnimation(0, 'stand3', true);
        });
    }

    _waitForDrawLineAni(): Promise<any> {
        return new Promise((resolve, rejcect) => {
            this._drawLines(resolve, rejcect);
        });
    }

    _drawLines(resolve, reject) {
        let line1Pos, line2Pos, line3Pos, line4Pos: cc.Vec2[] = [];
        let graphics = this.aniLinesNode.getComponent(cc.Mask)['_graphics'];
        graphics.clear(true);
        line1Pos = [new cc.Vec2(-223, -61), new cc.Vec2(-223, 0), new cc.Vec2(0, 0)];
        line2Pos = [new cc.Vec2(222, -61), new cc.Vec2(222, 0), new cc.Vec2(0, 0)];
        line3Pos = [new cc.Vec2(0, -61), new cc.Vec2(0, -12)];
        line4Pos = [new cc.Vec2(0, -12), new cc.Vec2(0, 68)];
        this._drawSingleLine(graphics, 400, line1Pos);
        this._drawSingleLine(graphics, 400, line2Pos);
        this._drawSingleLine(graphics, 150, line3Pos);
        gdk.Timer.once(430, this, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._drawSingleLine(graphics, 150, line4Pos);
            gdk.Timer.once(150, this, () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                return resolve();
            });
        });
    }

    _drawSingleLine(graphics: cc.Graphics, duration: number, posArr: cc.Vec2[]) {
        graphics.lineWidth = 30;
        let n = posArr.length == 3 ? 2 : 1; // 线段方向有几个
        let length = 0; // 线段总长度
        let normalVec: cc.Vec2[] = []; // 方向向量
        let dlength = 10; //每次画线单位长度
        let dt: number = 0; // 总段数
        for (let i = 0; i < posArr.length - 1; i++) {
            let vector = posArr[i + 1].sub(posArr[i]);
            length += Math.floor(vector.mag());
            normalVec.push(vector.normalizeSelf());
        }
        dt = Math.floor(length / dlength) + (length % dlength == 0 ? 0 : 1); //n段
        let idx = 0;
        let startPoint = posArr.shift();
        let nextPoint;

        let cb = () => {
            if (n == 2 && nextPoint && nextPoint.y >= posArr[1].y) {
                nextPoint = normalVec[1].mul(dlength).add(startPoint);
            }
            else {
                nextPoint = normalVec[0].mul(dlength).add(startPoint);
            }
            graphics.moveTo(startPoint.x, startPoint.y);
            graphics.lineTo(nextPoint.x, nextPoint.y);
            graphics.stroke();
            startPoint = nextPoint;
            idx += 1;
            if (idx == dt) {
                //终点
                gdk.Timer.clear(this, cb);
                return
            }
        };
        gdk.Timer.loop(duration / dt, this, cb);
    }
}
