import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyEventId } from '../../../../common/models/CopyModel';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RewardItem from '../../../../common/widgets/RewardItem';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TaskModel from '../../../task/model/TaskModel';
import {
    Copy_gateConditionCfg,
    Copy_ruin_rewardCfg,
    Copy_stageCfg,
    General_weaponCfg
    } from '../../../../a/config';

/** 
 * @Description: 殿堂指挥官View
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-18 16:08:34
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class SubInstanceEndRuinsViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    chapterTitle: cc.Label = null;
    @property(cc.Node)
    leftBtn: cc.Node = null;
    @property(cc.Node)
    rightBtn: cc.Node = null;
    // @property([cc.Node])
    // stageNodes: cc.Node[] = [];
    // @property([cc.Node])
    // lineNodes: cc.Node[] = []

    @property([cc.TiledMapAsset])
    tiledMaps: cc.TiledMapAsset[] = [];
    @property(cc.Node)
    stageContent: cc.Node = null;
    @property(cc.Node)
    lineContent: cc.Node = null;
    @property(cc.Prefab)
    cityPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    linePrefab: cc.Prefab = null;

    @property(cc.Node)
    selectGuanBiao: cc.Node = null;

    //----------------z占领玩家信息----------------
    @property(cc.Node)
    playerNode: cc.Node = null;
    @property(cc.Sprite)
    playerheadIcon: cc.Sprite = null;
    @property(cc.Sprite)
    playerHeadFrame: cc.Sprite = null;
    @property(cc.Node)
    playerAttack: cc.Node = null;

    //-------------------挑战关卡信息------------
    @property(cc.Node)
    stageInfoNode: cc.Node = null;
    @property(cc.Label)
    powerLb: cc.Label = null;
    @property(cc.Node)
    rewardLayout: cc.Node = null;
    @property(cc.Prefab)
    rewardPre: cc.Prefab = null;
    @property([cc.Label])
    conditionLbs: cc.Label[] = []
    @property(cc.Label)
    curNum: cc.Label = null;
    @property(cc.Label)
    stageOver: cc.Label = null;

    //-----------------章节星星奖励----------------
    @property([cc.Node])
    bagNodes: cc.Node[] = []
    @property([cc.Label])
    rewardStarNums: cc.Label[] = []
    @property(cc.Label)
    curStarNum: cc.Label = null;
    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    redNode1: cc.Node = null;
    @property(cc.Node)
    redNode2: cc.Node = null;
    @property([cc.Node])
    firstNodes: cc.Node[] = []
    @property([cc.Node])
    rewardNodes: cc.Node[] = []
    @property([cc.Node])
    star1Nodes: cc.Node[] = []
    @property([cc.Node])
    star2Nodes: cc.Node[] = []

    cityObjects: any[] = [];
    cityPointsArr: cc.Vec2[] = [];
    stageNodes: cc.Node[] = []; //citys
    lineNodes: cc.Node[] = [];  //lines
    starSpStrs: string[] = ['view/instance/texture/endRuins/xsl_xingxing', 'view/instance/texture/endRuins/fb_xingxing01']
    lineSpStrs: string[] = ['view/instance/texture/endRuins/fb_luxian01', 'view/instance/texture/endRuins/fb_luxian02']
    stageSpStrs1: string[] = ['view/instance/texture/endRuins/fb_jianzhu01', 'view/instance/texture/endRuins/fb_jianzhu02']
    stageSpStrs2: string[] = ['view/instance/texture/endRuins/fb_jianzhu03', 'view/instance/texture/endRuins/fb_jianzhu04']
    stageSpStrs3: string[] = ['view/instance/texture/endRuins/fb_jianzhu05', 'view/instance/texture/endRuins/fb_jianzhu06']
    bgSpStrs: string[] = [`view/instance/texture/bg/fb_morifeixuditu`, `view/instance/texture/bg/fb_morifeixuditu02`, `view/instance/texture/bg/fb_morifeixuditu03`]
    prizeList: number[] = []
    curChapter: number = 0;

    selectIndex: number = 0;


    get copyModel() { return ModelManager.get(CopyModel); }

    curCfg: Copy_stageCfg;
    selectCfg: Copy_stageCfg;
    //maxCfg: Copy_stageCfg = null;
    curChapterStages: Copy_stageCfg[];
    canPlayerAttack: boolean = false;
    onEnable() {
        gdk.e.on(CopyEventId.UPDATE_COPY_ENDRUIN_PLAYER, this.setPlayerInfo, this);
        gdk.e.on(CopyEventId.CHANGE_COPY_ENDRUIN_CHAPTER, this.changeChapter, this);
        gdk.e.on(CopyEventId.UPDATE_COPY_ENDRUIN_STAR_REWARD, this.refreshStarRewardInfo, this);
        gdk.e.on(CopyEventId.UPDATE_COPY_ENDRUIN_EVERYDAY_REWARD, this.everyDayRed, this);

        NetManager.send(new icmsg.RuinStateReq, (msg: icmsg.RuinStateRsp) => {
            this.copyModel.endRuinStateData = msg;
            msg.stages.forEach(data => {
                this.copyModel.endRuinStageData['' + data.stageId] = data.star;
            })
            let stages = this.copyModel.endRuinCfgs;
            stages.forEach(cfg => {
                if (this.prizeList.indexOf(cfg.prize) == -1) {
                    this.prizeList.push(cfg.prize)
                }
                if (cfg.pre_condition == this.copyModel.endRuinStateData.maxStageId) {
                    // this.curCfg = cfg;
                    let preCfg = ConfigManager.getItemById(Copy_stageCfg, cfg.pre_condition);
                    let state = CopyUtil.getEndRuinStageState(cfg.pre_condition);
                    if (preCfg && preCfg.type_stage != 3 && state[1] < 3) {
                        this.curCfg = preCfg;
                    }
                    else {
                        this.curCfg = cfg;
                    }
                }
            })
            if (!this.curCfg) {
                this.curCfg = stages[0];
            }
            //this.maxCfg = this.curCfg;

            this.selectChapter(this.curCfg.prize);

            //红点刷新
            this.everyDayRed()
            this.chapterInfoRed()
        })
    }
    onDisable() {
        gdk.e.targetOff(this)
    }

    parseMap(tmxAsset: cc.TiledMapAsset) {
        let file = tmxAsset;
        let texValues = file.textures;
        let texKeys = file.textureNames;
        let textures = {};
        for (let i = 0; i < texValues.length; ++i) {
            textures[texKeys[i]] = true; // texValues[i];
        }

        let tsxFileNames = file['tsxFileNames'];
        let tsxFiles = file['tsxFiles'];
        let tsxMap = {};
        for (let i = 0; i < tsxFileNames.length; ++i) {
            if (tsxFileNames[i].length > 0) {
                tsxMap[tsxFileNames[i]] = tsxFiles[i].text;
            }
        }

        let TMXMapInfo: any = cc['TMXMapInfo'];
        let tmxXmlStr = file['tmxXmlStr'].replace(/<imagelayer(([\s\S])*?)<\/imagelayer>/g, '');
        let mapInfo = new TMXMapInfo(tmxXmlStr, tsxMap, textures, {});
        let getObjectGroup = function (name: string): any[] {
            for (let i = 0; i < mapInfo._objectGroups.length; i++) {
                let item = mapInfo._objectGroups[i];
                if (item.name == name) {
                    return item._objects;
                }
            }
            return [];
        }
        return getObjectGroup('city');
    }

    _preCreateCitys() {
        if (!this.cityObjects || this.cityObjects.length < 3) {
            this.cityObjects = [];
            this.tiledMaps.forEach(t => {
                let o = this.parseMap(t);
                o.sort((a, b) => {
                    if (parseInt(a.name) == parseInt(b.name)) {
                        return parseInt(a.id) - parseInt(b.id);
                    }
                    else {
                        return parseInt(a.name) - parseInt(b.name);
                    }
                })
                this.cityObjects.push(o);
            });
        }
    }

    _createCitys(chapter: number) {
        this._preCreateCitys();
        let idx = chapter % 3 || 3;
        this.stageNodes = [];
        this.lineNodes = [];
        this.cityPointsArr = [];
        this.lineContent.removeAllChildren();
        this.stageContent.removeAllChildren();
        let objs = this.cityObjects[idx - 1];
        for (let i = 0; i < objs.length; i++) {
            let obj = objs[i];
            let city = cc.instantiate(this.cityPrefab);
            city.parent = this.stageContent;
            city.position = cc.v2(obj.x + city.width / 2, -obj.y + city.height / 2);
            let id = `${i}`;
            city.getChildByName('bg').on(cc.Node.EventType.TOUCH_START, () => {
                this.stageBtnClick(null, id);
            }, this);
            this.stageNodes.push(city);
            this.cityPointsArr.push(city.position);
        }
        this._createLines();
    }

    _createLines() {
        let normalVec = new cc.Vec2(1, 0);
        for (let i = 0; i < this.cityPointsArr.length - 1; i++) {
            let line = cc.instantiate(this.linePrefab);
            let vec = this.cityPointsArr[i + 1].sub(this.cityPointsArr[i]);
            line.parent = this.lineContent;
            // line.angle = -normalVec.signAngle(vec);
            line.angle = normalVec.signAngle(vec) * 180 / Math.PI;
            line.width = vec.mag();
            line.setPosition(this.cityPointsArr[i].x, this.cityPointsArr[i].y);
            this.lineNodes.push(line);
        }
    }

    chapterChangeBtnClick(event: cc.Event, index: string) {
        if (index == '0') {
            //左按钮
            let num = Math.max(1, this.curChapter - 1);
            if (num == this.curChapter) return;
            this.selectChapter(num);
        } else {
            //右按钮
            let num = Math.min(this.prizeList.length, this.curChapter + 1);
            if (num == this.curChapter) return;
            this.selectChapter(num);
        }
    }

    refreshStarRewardInfo(event?: any) {
        //刷新宝箱状态
        this.refreshCurChapterRewardData()
        //刷新章节所有红点
        this.chapterInfoRed()
    }

    //每日任务红点
    everyDayRed() {
        let temCfg = this.copyModel.endRuinCfgs[0];
        let firstNums = CopyUtil.getEndRuinStageState(temCfg.id);
        let firstState = firstNums[0] == 1 && firstNums[1] == 3
        this.copyModel.endRuinCfgs.forEach(cfg => {
            let temNums = CopyUtil.getEndRuinStageState(cfg.id);
            if (temNums[0] == 1 && temNums[1] == 3) {
                temCfg = cfg;
                firstState = true;
            }
        })
        let stateNum = firstState ? 1 : 3;
        if (firstState && this.copyModel.endRuinStateData.raidsStage == temCfg.id) {
            stateNum = 2;
        }
        this.redNode1.active = stateNum == 1 && this.copyModel.endRuinStateData.raids > 0;
    }

    //章节索引红点  
    chapterInfoRed() {
        //判断章节是否有可领取的星级奖励
        let cfgs = ConfigManager.getItems(Copy_ruin_rewardCfg);
        let res = false;
        let chapterIds = [];
        let starNums: number[] = []
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i]
            if (chapterIds.indexOf(cfg.chapter) < 0) {
                chapterIds.push(cfg.chapter);
                starNums = CopyUtil.getEndRuinChapterAllStarNum(cfg.chapter);
            }
            if (cfg.star <= starNums[0]) {
                if (!CopyUtil.getEndRuinChapterStarRewardState(cfg.chapter, cfg.star)) {
                    res = true;
                    break;
                }

            }
        }
        this.redNode2.active = res;
    }

    updateArrowRedpoint() {
        [this.leftBtn, this.rightBtn].forEach((n, idx) => {
            if (n.active) {
                let redPoint = n.getChildByName('RedPoint');
                redPoint.active = false;
                let c = this.curChapter;
                let di = idx == 0 ? -1 : 1;
                c += di;
                let b = c <= 0 || CopyUtil.getEndRuinChapterAllStarNum(c)[0] == 0 ? false : true;
                while (b) {
                    let cfgs = ConfigManager.getItemsByField(Copy_ruin_rewardCfg, 'chapter', c);
                    let stars = CopyUtil.getEndRuinChapterAllStarNum(c);
                    for (let i = 0; i < cfgs.length; i++) {
                        if (stars[0] >= cfgs[i].star && !CopyUtil.getEndRuinChapterStarRewardState(c, cfgs[i].star)) {
                            redPoint.active = true;
                            b = false;
                            break;
                        }
                    }
                    c += di;
                    b = c <= 0 || CopyUtil.getEndRuinChapterAllStarNum(c)[0] == 0 ? false : true;
                }
            }
        });
    }

    changeChapter(event: any) {
        this.selectChapter(event.data);
    }

    selectChapter(chapter: number) {
        if (this.curChapter == chapter) return;
        if (chapter > this.curCfg.prize) return;
        this._createCitys(chapter);
        //判断左右按钮显示情况
        this.leftBtn.active = chapter != 1;
        this.rightBtn.active = (chapter != this.prizeList.length && chapter < this.curCfg.prize);
        this.curChapter = chapter;
        this.curChapterStages = CopyUtil.getEndRuinCopyChapterStages(chapter);
        let num = this.curChapterStages.length;
        let showCfg: Copy_stageCfg;
        let names: string[] = this.curChapterStages[0].des.split('-');
        this.chapterTitle.string = StringUtils.format(gdk.i18n.t("i18n:ENDRUIN_TIP10"), chapter, names[names.length - 2])//names[names.length - 2];
        let idx = chapter % 3 || 3;
        GlobalUtil.setSpriteIcon(this.node, this.node.getChildByName('bg'), this.bgSpStrs[idx - 1]);
        this.stageNodes.forEach((node, i) => {
            if (i < num) {
                let bg = node.getChildByName('bg')
                let star1 = node.getChildByName('star1')
                let star2 = node.getChildByName('star2')
                let star3 = node.getChildByName('star3')
                let stageLabel = node.getChildByName('stageLabel').getComponent(cc.Label)
                let boss = node.getChildByName('boss')
                let bgAnim = bg.getComponent(cc.Animation);
                bgAnim.stop();
                let cfg = this.curChapterStages[i];
                node.active = true;
                let lineNode = i > 0 ? this.lineNodes[i - 1] : null;
                let state = CopyUtil.getEndRuinStageState(cfg.id);
                if (state[0] > 0) {
                    if (((state[0] == 1 && state[1] < 3) || state[0] > 1) && !showCfg) {
                        showCfg = cfg;
                    }
                }
                let star1Path = (state[0] == 1 && state[1] >= 1) ? this.starSpStrs[0] : this.starSpStrs[1];
                let star2Path = (state[0] == 1 && state[1] >= 2) ? this.starSpStrs[0] : this.starSpStrs[1];
                let star3Path = (state[0] == 1 && state[1] >= 3) ? this.starSpStrs[0] : this.starSpStrs[1];
                GlobalUtil.setSpriteIcon(this.node, star1, star1Path);
                GlobalUtil.setSpriteIcon(this.node, star2, star2Path);
                GlobalUtil.setSpriteIcon(this.node, star3, star3Path);
                stageLabel.string = chapter + '-' + (i + 1);
                boss.active = false;
                let bgPath = state[0] > 0 ? this[`stageSpStrs${idx}`][0] : this[`stageSpStrs${idx}`][1];
                GlobalUtil.setSpriteIcon(this.node, bg, bgPath);
                //刷新线路状态
                if (lineNode) {
                    // for (let j = 1; j <= 4; j++) {
                    // let tem = lineNode.getChildByName('linesp' + j);
                    let linePath = state[0] > 0 ? this.lineSpStrs[0] : this.lineSpStrs[1];
                    GlobalUtil.setSpriteIcon(this.node, lineNode, linePath);
                    // }
                }

                if (i == num - 1) {
                    //当前章节最后一个关卡
                    boss.active = true;
                    //判断最后一关是否被占领
                    this.canPlayerAttack = state[0] == 1 && state[1] == 3
                    this.setPlayerInfo()
                    let temPos = node.position
                    this.playerNode.setPosition(cc.v2(temPos.x, temPos.y + 210));
                }
            } else {
                node.active = false;
                this.lineNodes[i - 1].active = false;
            }
        })

        //刷新当前章节关卡的状态
        if (this.curChapter == this.curCfg.prize) {
            showCfg = this.curCfg;
            this.stageInfoNode.active = true;
            this.stageOver.node.active = false;
            this.refreshStageInfo(showCfg);
        } else {
            if (!showCfg) {
                this.stageInfoNode.active = false;
                this.stageOver.node.active = true;
                if (this.curChapter > this.curCfg.prize) {
                    this.stageOver.string = gdk.i18n.t("i18n:ENDRUIN_TIP11")//'当前章节未开启'
                } else {
                    this.stageOver.string = gdk.i18n.t("i18n:ENDRUIN_TIP12")//'当前章节已全部满星通关'
                }
                this.selectGuanBiao.active = false;
            } else {
                this.stageInfoNode.active = true;
                this.stageOver.node.active = false;
                this.refreshStageInfo(showCfg);
            }
        }

        //刷新当前章节的星星奖励数据
        this.refreshCurChapterRewardData()

        this.chapterInfoRed()

        this.updateArrowRedpoint();
    }

    setPlayerInfo() {
        let playerData = CopyUtil.getEndRuinChapterPlayerInfo(this.curChapter);
        this.playerNode.active = false//playerData != null;
        if (playerData) {
            GlobalUtil.setSpriteIcon(this.node, this.playerHeadFrame, GlobalUtil.getHeadFrameById(playerData.player.headFrame))
            GlobalUtil.setSpriteIcon(this.node, this.playerheadIcon, GlobalUtil.getHeadIconById(playerData.player.head));
            //设置挑战按钮状态
            let state: 0 | 1 = this.canPlayerAttack ? 0 : 1;
            GlobalUtil.setAllNodeGray(this.playerAttack, state)
        }
    }

    refreshCurChapterRewardData() {
        let temstarNum = CopyUtil.getEndRuinChapterAllStarNum(this.curChapter);
        let temCurStar = temstarNum[0]
        let cfgs = ConfigManager.getItems(Copy_ruin_rewardCfg, { chapter: this.curChapter });
        let maxStarNum = temstarNum[1]//cfgs[cfgs.length - 1].star;
        this.curStarNum.string = temCurStar + '/' + maxStarNum;
        this.rewardStarNums.forEach((lb, i) => {
            let boxNode = this.bagNodes[i];
            boxNode.angle = 0;
            let open = boxNode.getChildByName('open')
            let lock = boxNode.getChildByName('lock')
            let redPoint = boxNode.getChildByName('RedPoint')
            let anim = boxNode.getComponent(cc.Animation)
            let btn = lock.getComponent(cc.Button);
            anim.stop();
            redPoint.active = false;

            if (i < cfgs.length) {
                let starNum = cfgs[i].star
                lb.string = starNum + '';
                if (temCurStar < starNum) {
                    open.active = false;
                    lock.active = true;
                    btn.interactable = true;
                } else if (!CopyUtil.getEndRuinChapterStarRewardState(this.curChapter, starNum)) {
                    open.active = false;
                    lock.active = true;
                    btn.interactable = true;
                    //宝箱抖动效果
                    anim.play()
                    redPoint.active = true;
                } else {
                    open.active = true;
                    lock.active = false;
                }
            } else {
                lb.string = ''
            }

        })
        this.maskNode.width = Math.floor((temCurStar / maxStarNum) * 390)

        //


    }

    refreshStageInfo(cfg: Copy_stageCfg) {

        if (this.selectCfg) {
            let temIndex = this.curChapterStages.indexOf(this.selectCfg);
            if (temIndex >= 0) {
                let node = this.stageNodes[temIndex];
                let bg = node.getChildByName('bg')
                let bgAnim = bg.getComponent(cc.Animation);
                bgAnim.stop();
            }
        }
        this.selectCfg = cfg
        this.powerLb.string = cfg.power;
        this.rewardLayout.removeAllChildren()
        this.firstNodes.forEach(node => {
            node.active = false;
        })
        this.rewardNodes.forEach(node => {
            node.active = false;
        })
        cfg.first_reward.forEach((data, i) => {
            let node = cc.instantiate(this.rewardPre);
            let ctrl = node.getComponent(RewardItem);
            ctrl.data = { index: i, typeId: data[0], num: data[1], delayShow: false, effect: false }
            ctrl.updateView()
            node.setParent(this.rewardLayout);
            if (i < this.firstNodes.length) {
                this.firstNodes[i].active = true;
            }
            if (this.selectCfg.id <= this.copyModel.endRuinStateData.maxStageId) {
                this.rewardNodes[i].active = true;
            }
        });


        //通关条件
        cfg.gateconditionList.forEach((data, i) => {
            let gcfg = ConfigManager.getItemById(Copy_gateConditionCfg, data);
            this.conditionLbs[i].string = gcfg.des;
        });

        //通过条件达成情况
        if (this.copyModel.endRuinStageData['' + cfg.id]) {
            let tem = this.copyModel.endRuinStageData['' + cfg.id];
            for (let i = 0; i <= 2; i++) {
                let state = (tem & 1 << i) >= 1
                this.star1Nodes[i].active = state;
                this.star2Nodes[i].active = !state;
            }
        } else {
            for (let i = 0; i <= 2; i++) {
                this.star1Nodes[i].active = false;
                this.star2Nodes[i].active = true;
            }
        }

        this.curNum.string = this.copyModel.endRuinStateData.times + ''//'15';

        let cfgIndex = this.curChapterStages.indexOf(cfg);
        let node = this.stageNodes[cfgIndex];
        let bg = node.getChildByName('bg')
        let bgAnim = bg.getComponent(cc.Animation);
        bgAnim.play();
        this.selectGuanBiao.active = true;
        let temPos = node.position
        this.selectGuanBiao.setPosition(cc.v2(temPos.x, temPos.y + 170));

    }


    //玩家挑战按钮
    playerAttackBtnClick() {
        //获取当前章节玩家占领信息
        let data = CopyUtil.getEndRuinChapterPlayerInfo(this.curChapter);
        let roleModel = ModelManager.get(RoleModel)
        if (data && data.player.id == roleModel.id) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ENDRUIN_TIP8"))
            return;
        }
        if (data && (!data.challenger || data.challenger.id == 0)) {
            this.copyModel.endRuinPvpChapterInfo = data;
            //openPveArenaScene
            gdk.panel.setArgs(PanelId.EndRuinSetUpHeroSelector, this.curChapter);
            gdk.panel.open(PanelId.EndRuinSetUpHeroSelector)
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ENDRUIN_TIP7"))
        }
    }

    //关卡挑战按钮
    AttackBtnClick() {
        if (this.copyModel.endRuinStateData.times > 0) {
            gdk.panel.setArgs(PanelId.EndRuinSetUpHeroSelector, this.curChapter, this.selectCfg);
            gdk.panel.open(PanelId.EndRuinSetUpHeroSelector)
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ENDRUIN_TIP9"))
        }
        // gdk.panel.setArgs(PanelId.EndRuinSetUpHeroSelector, this.curChapter, this.selectCfg);
        // gdk.panel.open(PanelId.EndRuinSetUpHeroSelector)
    }

    //打开每日礼包界面
    openDaysRewardView() {
        gdk.panel.open(PanelId.EndRuinEveryDayTaskView)
    }

    //打开章节索引界面
    openChapterRewardView() {
        gdk.panel.open(PanelId.EndRuinChapterRewardView)
    }

    isRewardClick = false
    //章节宝箱点击事件
    chapterRewardBoxBtnClick(event: cc.Event, index: string) {
        let cfgs = ConfigManager.getItems(Copy_ruin_rewardCfg, { chapter: this.curChapter });
        let cfg = cfgs[parseInt(index)]
        //cc.log('----------------------------' + cfg.chapter + '---------' + cfg.star)
        //this.curStarNum.string = temCurStar + '/' + maxStarNum;
        let curNStarNum = parseInt(this.curStarNum.string.split('/')[0])
        if (curNStarNum >= cfg.star) {
            if (!this.isRewardClick) {
                this.isRewardClick = true;
                let msg = new icmsg.RuinChapterRewardReq()
                msg.chapter = this.curChapter;
                msg.star = cfg.star;
                NetManager.send(msg, (resp: icmsg.RuinChapterRewardRsp) => {
                    //更新数据
                    this.isRewardClick = false;
                    this.copyModel.endRuinStateData.chapterReward = resp.chapterReward;
                    this.refreshCurChapterRewardData();
                    this.chapterInfoRed();
                    GlobalUtil.openRewadrView(resp.rewards);
                }, this)
            }
        } else {
            let data = []
            cfg.reward.forEach(info => {
                let tem = new icmsg.GoodsInfo()
                tem.typeId = info[0];
                tem.num = info[1];
                data.push(tem);
            })
            GlobalUtil.openRewardPreview(data)
        }

    }

    stageBtnClick(event: cc.Event, index: string) {
        let i = parseInt(index)
        let tem = this.curChapterStages[i];
        let states = CopyUtil.getEndRuinStageState(tem.id);
        if ((states[0] == 1 && states[1] < 3) || states[0] == 2) {
            if (tem.id == this.selectCfg.id) {
                this.AttackBtnClick()
            } else {
                this.refreshStageInfo(tem);
            }
        } else if (states[1] == 3) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ENDRUIN_TIP14"))
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ENDRUIN_TIP13"))
        }
    }

    //打开神器界面
    opneWeaponView() {
        let weaponCfg = ConfigManager.getItemByField(General_weaponCfg, 'chapter', ModelManager.get(TaskModel).weaponChapter);
        if (!weaponCfg) {
            JumpUtils.openPanel({
                panelId: PanelId.GeneralWeaponUpgradePanel,
                // panelArgs: {
                //     args: [2]
                // },
                currId: gdk.gui.getCurrentView(),
            })
        }
        else {
            JumpUtils.openPanel({
                panelId: PanelId.GeneralWeaponTask,
                currId: gdk.gui.getCurrentView(),
            })
        }
    }

    //打开排行界面
    openRankView() {
        JumpUtils.openPanel({
            panelId: PanelId.Rank,
            currId: gdk.gui.getCurrentView(),
        })
    }


}
