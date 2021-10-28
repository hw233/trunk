import ChampionModel from '../../../view/champion/model/ChampionModel';
import CommanderSkillItemCtrl from './CommanderSkillItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import LoginModel from '../../../common/models/LoginModel';
import MainSetGuardianItemCtrl from './MainSetGuardianItemCtrl';
import MainSetHeroItemCtrl from './MainSetHeroItemCtrl';
import MainSethonorItemCtrl from './MainSetHonorItemCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import ServerModel from '../../../common/models/ServerModel';
import StringUtils from '../../../common/utils/StringUtils';
import {
    Copy_stageCfg,
    Copy_towerhaloCfg,
    General_commanderCfg,
    GeneralCfg,
    HeroCfg,
    HonourCfg,
    Little_game_channelCfg,
    SystemCfg
    } from '../../../a/config';
import { RoleSettingValue } from './../../../common/models/RoleModel';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainSetCtrl")
export default class MainSetCtrl extends gdk.BasePanel {

    @property(cc.Sprite)
    frame: cc.Sprite = null

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Node)
    titleIcon: cc.Node = null

    @property(cc.Label)
    sNameLab: cc.Label = null

    @property(cc.Label)
    nameLab: cc.Label = null
    @property(cc.Node)
    vipNode: cc.Node = null;
    @property(cc.Label)
    vipLab: cc.Label = null;

    @property(cc.Label)
    idLab: cc.Label = null

    @property(cc.ProgressBar)
    expPro: cc.ProgressBar = null

    @property(cc.Label)
    roleLvLab: cc.Label = null

    @property(cc.Label)
    expLab: cc.Label = null

    @property(cc.Label)
    fightLab: cc.Label = null

    @property(cc.Node)
    downNode: cc.Node = null

    @property(cc.EditBox)
    inputBox: cc.EditBox = null;

    @property(cc.Node)
    btnChangeName: cc.Node = null

    @property(cc.Node)
    btnFrame: cc.Node = null

    @property(cc.Label)
    value1: cc.Label = null
    @property(cc.Node)
    tip1Node: cc.Node = null;

    @property(cc.Label)
    value2: cc.Label = null

    @property(cc.Label)
    value3: cc.Label = null

    @property(cc.Button)
    downBtns: cc.Button[] = []

    @property(cc.Node)
    midNodes: cc.Node[] = []

    @property(MainSetHeroItemCtrl)
    heroItems: MainSetHeroItemCtrl[] = [];
    @property(MainSetGuardianItemCtrl)
    guardianItems: MainSetGuardianItemCtrl[] = [];
    @property(MainSethonorItemCtrl)
    honorItems: MainSethonorItemCtrl[] = [];

    @property(cc.Button)
    setButtons: cc.Button[] = [];

    @property(CommanderSkillItemCtrl)
    skillItems: CommanderSkillItemCtrl[] = [];

    @property(cc.Label)
    attrLabs: cc.Label[] = []


    @property(cc.Sprite)
    groupSp1: cc.Sprite = null;
    @property(cc.Sprite)
    groupSp2: cc.Sprite = null;
    @property(cc.Label)
    lockNode: cc.Label = null;
    @property(cc.Node)
    addItemsNode: cc.Node = null;
    @property([cc.Node])
    addBuffList: cc.Node[] = []
    @property(cc.Node)
    littleGameBtn: cc.Node = null;

    honorDatas: MainsetHonorData[] = []
    groupBgData: number[][] = []
    groupBgNames: string[] = ['yx_zhengyingsekuai', 'yx_zhengyingsekuai2', 'yx_zhengyingsekuai3', 'yx_zhengyingsekuai4', 'yx_zhengyingsekuai5', 'yx_zhengyingsekuai6']
    selectHeroItemIds: number[] = []

    signContent: string = ""
    downSelect: number = 0

    get model() {
        return ModelManager.get(RoleModel);
    }

    get serModel() {
        return ModelManager.get(ServerModel);
    }

    get loginModel() {
        return ModelManager.get(LoginModel);
    }

    _playerId: number = 0
    type: number = 0; // 0-查询当前信息 1-查询锦标赛信息
    _rspImageData = null

    onLoad() {
        let args = this.args
        if (args && args.length > 0) {
            this._playerId = args[0]
            if (args[1]) {
                this.type = args[1];
            }
        } else {
            this._playerId = this.model.id
            this.type = 0;
        }
    }

    onEnable() {
        let msg = new icmsg.RoleImageReq()
        msg.playerId = this._playerId
        msg.type = this.type
        if (this.type == 1) {
            msg.index = ModelManager.get(ChampionModel).guessIndex;
        }
        if (this.type == 7) {
            msg.type = 0;
            msg.arrayType = 7;
        }
        NetManager.send(msg, (data: icmsg.RoleImageRsp) => {
            if (data.brief.id == this.model.id) {
                //是自己
                let serverData = this.serModel.current
                this.sNameLab.string = `[${serverData.serverId}] ${serverData.name}`
                this.nameLab.string = `${this.model.name}`
                this.idLab.string = `${this.model.id}`
                this.fightLab.string = `${this.model.power}`
                this.updateHead()
                this.updateHeadFrame()
                this.updateHeadTitle()
                this.updateRoleLv()
                this.updateRoleExp()
                this._updateCommanderSkill()
                this.downBtnSelect(null, 1)
                this._rspImageData = data
            } else {
                //其他人
                let serverList = this.serModel.list
                for (let i = 0; i < serverList.length; i++) {
                    let item = serverList[i]
                    let serverId = Math.floor((data.brief.id / 100000) % 10000)
                    if (serverId == item.serverId) {
                        this.sNameLab.string = `[${serverId}] ${item.name}`
                        break
                    }
                }
                this.nameLab.string = `${data.brief.name}`
                this.idLab.string = `${data.brief.id}`
                this.fightLab.string = `${data.brief.power}`
                this.roleLvLab.string = `${data.brief.level}`

                let path = GlobalUtil.getHeadFrameById(data.brief.headFrame)
                GlobalUtil.setSpriteIcon(this.node, this.frame, path)

                GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(data.brief.head));
                GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(data.brief.title));

                // if (data.brief.head == 0) {
                //     GlobalUtil.setSpriteIcon(this.node, this.icon, `icon/hero/300000_s`);
                // } else {
                //     let heroCfg = ConfigManager.getItemById(HeroCfg, data.brief.head)
                //     if (heroCfg) {
                //         GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getIconById(heroCfg.id, BagType.HERO))
                //     }
                // }
                this.expPro.node.active = false
                this.expLab.node.active = false
                this.downNode.active = false
                this.btnChangeName.active = false
                this.btnFrame.active = false
                this.inputBox.enabled = false
                this.downBtnSelect(null, 1)
            }
            this.vipNode.active = data.brief.vipExp > 0;
            this.vipLab.string = GlobalUtil.getVipLv(data.brief.vipExp) + ''

            this._updateValue(data)
            this._updateHeros(data)
            this.inputBox.string = `${data.signContent}`
            this.signContent = `${data.signContent}`
        }, this)
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    /*更新荣耀数值*/
    _updateValue(data: icmsg.RoleImageRsp) {
        //let cfg = ConfigManager.getItemById(Copy_stageCfg, data.mainline)
        // this.value1.string = data.guildName ? data.guildName : '';//`${cfg ? cfg.name.split(" ")[0] : "无"}`
        // this.value2.string = data.honorList.dungeonTrial + ''//`${data.arenaScore}`
        // this.value3.string = data.honorList.dungeonRuin + ''//`${data.guildName}`
        // this.tip1Node.active = data.honorList.isGuildMaster;

        this.honorDatas = []
        if (data.guildName != '') {
            let cfg = ConfigManager.getItemByField(HonourCfg, 'id', 1);
            let temData = { cfg: cfg, value: data.guildName, isGuildMaster: data.isGuildMaster };
            this.honorDatas.push(temData);
        }
        if (data.honor) {
            // data.honor.forEach(honor => {
            //     let cfg = ConfigManager.getItemByField(HonourCfg, 'id', honor.key);
            //     let temData = { cfg: cfg, value: honor.value };
            //     this.honorDatas.push(temData);
            // })
            let ids = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            let values = [
                data.honor.foothold,
                data.honor.trial,
                data.honor.ruin,
                data.honor.arenaRank,
                data.honor.vault,
                data.honor.champion,
                data.honor.adventure,
                data.honor.ordeal,
                data.honor.teamArena,
                data.honor.peak]
            ids.forEach((id, index) => {
                let value = values[index]
                let cfg = ConfigManager.getItemByField(HonourCfg, 'id', id);
                let temData = { cfg: cfg, value: value };
                this.honorDatas.push(temData);
            })
        }

        this.honorDatas.sort((a: MainsetHonorData, b: MainsetHonorData) => {
            return a.cfg.sorting - b.cfg.sorting;
        })

        let length = this.honorDatas.length;
        this.honorItems.forEach((honorItem, index) => {
            if (length - 1 < index) {
                honorItem.node.active = false;
            } else {
                honorItem.node.active = true;
                honorItem.updateView(this.honorDatas[index])
            }
        })

    }

    /**更新最强英雄 */
    _updateHeros(resp: icmsg.RoleImageRsp) {
        let heros = resp.heroes
        this.selectHeroItemIds = []
        for (let index = 0; index < 6; index++) {
            let data = heros[index];
            let comp = this.heroItems[index]
            let guardian = this.guardianItems[index]
            comp.node.active = true
            guardian.node.active = true
            if (data && data.heroBrief.typeId > 0) {
                comp.node.active = true
                comp.updateView(data, index, this._playerId, resp.type);
                this.selectHeroItemIds.push(data.heroBrief.typeId)
                if (data.guardian && data.guardian.type > 0) {
                    guardian.updateView(data.guardian, index, this._playerId, resp.type);
                } else {
                    guardian.updateNullHero()
                }
            } else {
                comp.updateNullHero()
                guardian.updateNullHero()
                this.selectHeroItemIds.push(0)
            }
        }
        // for (let index = 0; index < 6; index++) {
        //     let comp = this.guardianItems[index]
        //     comp.updateNullHero()
        // }
        //刷新阵营加成属性
        this.refreshGroupBuffInfo();
    }

    refreshGroupBuffInfo() {

        if (!JumpUtils.ifSysOpen(2853)) {
            let path1 = 'common/texture/role/select/yx_zhenying_1';
            GlobalUtil.setSpriteIcon(this.node, this.groupSp1, path1);
            this.groupSp2.node.active = false;
            let systemCfg = ConfigManager.getItemById(SystemCfg, 2853);
            if (systemCfg) {
                let stageCfg = ConfigManager.getItemById(Copy_stageCfg, systemCfg.fbId)
                this.lockNode.string = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP1"), stageCfg.name.split(' ')[0])//'通关主线' + stageCfg.name.split(' ')[0] + '解锁';
            }
            this.lockNode.node.active = true;
            this.addItemsNode.active = false;
            return;
        }
        this.addItemsNode.active = true;
        this.lockNode.node.active = false;

        let a = {};
        this.groupBgData = []
        this.selectHeroItemIds.forEach(id => {
            if (id > 0) {
                let cfg = ConfigManager.getItemById(HeroCfg, id);
                if (cfg) {
                    if (!a[cfg.group[0]]) {
                        a[cfg.group[0]] = 1;
                    } else {
                        a[cfg.group[0]] += 1;
                    }
                }
            }
        })

        let addNum = 0;
        let maxType = 0;
        let maxNum = 0;
        let big4Type: number[] = [];
        let addCfgs: Copy_towerhaloCfg[] = [];
        let temMaxNum = 0;
        for (let i = 1; i <= 6; i++) {
            if (a[i] == null && i < 6) continue;
            if (i == 1 || i == 2) {
                addNum += a[i];
            } else {
                if (a[i] > maxNum) {
                    maxNum = a[i];
                }
            }
            if (a[i] > temMaxNum) {
                temMaxNum = a[i]
                maxType = i;
            }
            if (a[i] >= 4) {
                big4Type.push(i);
            }
            if (i == 6 && (maxNum + addNum >= 2)) {
                let temNum = Math.min(6, maxNum + addNum);
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.only == 1 && cfg.num == temNum) {
                        return true;
                    }
                    return false;
                })
                if (cfg) {
                    addCfgs.push(cfg);
                }
            }
        }
        if (big4Type.length > 0) {
            big4Type.forEach(type => {
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.group.indexOf(type) >= 0 && a[type] == cfg.num) {
                        return true
                    }
                    return false;
                })
                if (cfg) {
                    addCfgs.push(cfg);
                }
            })
        }

        //设置图片
        let tem1 = 1;
        if (addNum + maxNum >= 2) {
            tem1 = Math.min(6, addNum + maxNum)
        }

        let path1 = 'common/texture/role/select/yx_zhenying_' + tem1;
        GlobalUtil.setSpriteIcon(this.node, this.groupSp1, path1);

        let temMax = 0;
        if (big4Type.length > 0) {
            big4Type.forEach(type => {
                if (a[type] > temMax) {
                    temMax = a[type]
                }
            })
            this.groupSp2.node.active = true;
            let tem2 = Math.min(3, temMax - 3);
            let path2 = 'common/texture/role/select/yx_zhenyingji_' + tem2;
            GlobalUtil.setSpriteIcon(this.node, this.groupSp2, path2);
        } else {
            this.groupSp2.node.active = false;
        }

        let name = []
        let num = [];
        addCfgs.forEach(cfg => {
            let addStrs = cfg.des.split(';')
            addStrs.forEach(str => {
                let tem = str.split('-');
                if (tem[0] != '') {
                    let index = name.indexOf(tem[0])
                    if (index < 0) {
                        name.push(tem[0])
                        num.push(parseInt(tem[1]))
                    } else {
                        num[index] += parseInt(tem[1])
                    }
                }
            })
        })
        let index = 0;
        let colorList2: cc.Color[] = [cc.color('#BF9973'), cc.color('#5DFF05')]
        this.addBuffList.forEach(item => {
            item.active = index < name.length;
            let nameLb = item.getChildByName('name').getComponent(cc.Label);
            let numLb = item.getChildByName('num').getComponent(cc.Label);
            nameLb.string = name[index] + ':'
            numLb.string = '+' + num[index] + '%';
            numLb.node.color = colorList2[1]
            if (index == 2 && !item.active && name.length > 0) {
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.group.indexOf(maxType) >= 0 && cfg.num == 4) {
                        return true
                    }
                    return false;
                })
                if (cfg) {
                    item.active = true;
                    let addStrs = cfg.des.split(';')
                    let strs = addStrs[0].split('-');
                    nameLb.string = strs[0] + ':'
                    numLb.string = '+' + strs[1] + '%';
                    numLb.node.color = colorList2[0]
                }
            }
            index++;
        })

    }

    openHaloView() {
        if (!JumpUtils.ifSysOpen(2853)) {
            let systemCfg = ConfigManager.getItemById(SystemCfg, 2853);
            if (systemCfg) {
                let stageCfg = ConfigManager.getItemById(Copy_stageCfg, systemCfg.fbId)
                let str = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP1"), stageCfg.name.split(' ')[0])//'通关主线' + stageCfg.name.split(' ')[0] + '解锁';
                gdk.gui.showMessage(str)
            }
            return;
        }
        gdk.panel.setArgs(PanelId.RoleUpHeroHaloView, this.selectHeroItemIds)
        gdk.panel.open(PanelId.RoleUpHeroHaloView);
    }

    //荣耀记录
    openRongyaoListView() {
        if (this.honorDatas.length > 0) {
            gdk.panel.setArgs(PanelId.MainSetHonorTips, this.honorDatas)
            gdk.panel.open(PanelId.MainSetHonorTips);
        }
    }

    /**个人名片按钮 */
    imageBtnFunc() {
        let msg = new icmsg.RoleImageReq()
        msg.playerId = this.model.id
        NetManager.send(msg)
    }

    /**兑换码按钮 */
    exchangeBtnFunc() {
        gdk.panel.open(PanelId.ExchangeCode)
    }


    /**签到 */
    qdFunc() {
        if (!JumpUtils.ifSysOpen(1200, true)) {
            return;
        }
        gdk.panel.open(PanelId.Sign)
    }

    /**换头像 */
    headChangeFunc() {
        gdk.panel.open(PanelId.HeadChangeView)
    }

    /**改名 */
    changeNameFunc() {
        gdk.panel.open(PanelId.ChangeName)
    }

    /**改名 */
    noticeViewFunc() {
        gdk.panel.open(PanelId.NoticeView)
    }

    @gdk.binding("model.head")
    updateHead() {
        let m = this.model;
        if (m.head == 0) {
            GlobalUtil.setSpriteIcon(this.node, this.icon, `icon/hero/300000${m.gender == 1 ? 'nv' : ''}_s`);
            return;
        }
        // let heroCfg = ConfigManager.getItemById(HeroCfg, m.head)
        // if (heroCfg) {
        //     GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getIconById(heroCfg.icon, BagType.HERO))
        // }
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(m.head));
    }

    @gdk.binding("model.frame")
    updateHeadFrame() {
        let path = GlobalUtil.getHeadFrameById(this.model.frame)
        GlobalUtil.setSpriteIcon(this.node, this.frame, path)
    }

    @gdk.binding("model.title")
    updateHeadTitle() {
        let path = GlobalUtil.getHeadTitleById(this.model.title)
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, path)
    }


    @gdk.binding("model.level")
    updateRoleLv() {
        this.roleLvLab.string = `${this.model.level}`
    }

    @gdk.binding("model.exp")
    updateRoleExp() {
        let list = ConfigManager.getItems(GeneralCfg)
        let lv = this.model.level
        let cfg = ConfigManager.getItemById(GeneralCfg, lv)
        if (lv >= list.length) {
            this.expLab.string = `Max`
            this.expPro.progress = 1
        } else {
            this.expLab.string = `${this.model.exp}/${cfg.exp}`
            let per = this.model.exp / cfg.exp
            per = Math.min(per, 1)
            this.expPro.progress = per
        }

    }

    @gdk.binding("model.name")
    updateRoleName() {
        this.nameLab.string = this.model.name
    }

    onCopyId() {
        let input = this.model.id.toString();
        if (CC_JSB) {
            // 原生版

        } else {
            // H5版
            const el = document.createElement('textarea');
            el.value = input;
            el.setAttribute('readonly', '');
            el.style['contain'] = 'strict';
            el.style['position'] = 'absolute';
            el.style['left'] = '-9999px';
            el.style['fontSize'] = '12pt'; // Prevent zooming on iOS
            // 选中
            const selection = getSelection();
            var originalRange: Range;
            if (selection.rangeCount > 0) {
                originalRange = selection.getRangeAt(0);
            }
            document.body.appendChild(el);
            el.select();
            el.selectionStart = 0;
            el.selectionEnd = input.length;
            // 复制
            try {
                document.execCommand('copy');
            } catch (err) { }
            document.body.removeChild(el);
            // 清理
            if (originalRange) {
                selection.removeAllRanges();
                selection.addRange(originalRange);
            }
        }
    }

    onChangeAccountBtn() {
        SdkTool.tool.changeAccount();
    }

    openSettingFunc() {
        gdk.panel.open(PanelId.SettingView)
    }

    //打开小游戏
    openLittleGame() {

        JumpUtils.openLittleGameScene()
        this.close()
    }

    saveSignFunc() {
        if (this.inputBox.string != "" && this.inputBox.string != this.signContent) {
            SdkTool.tool.hasMaskWord(this.inputBox.string, ret => {
                if (ret) {
                    this.inputBox.string = this.signContent
                    gdk.GUIManager.showMessage("不能含有屏蔽字");
                    return;
                }
                this.signContent = this.inputBox.string
                let msg = new icmsg.RoleSignContentReq()
                msg.content = this.signContent
                NetManager.send(msg)
            });
        } else {
            this.inputBox.string = this.signContent
        }
    }


    downBtnSelect(e, utype) {
        utype = parseInt(utype)
        this.downSelect = utype
        for (let idx = 0; idx < this.downBtns.length; idx++) {
            const element = this.downBtns[idx];
            element.interactable = idx != utype
            let select = element.node.getChildByName("select");
            select.active = idx == utype;
        }

        for (let index = 0; index < this.midNodes.length; index++) {
            this.midNodes[index].active = index == utype
        }

        if (utype == 1) {
            if (this._rspImageData) {
                this._updateHeros(this._rspImageData)
            }
        }
        else if (utype == 2) {
            // 强制设置所有按钮可见
            let node = cc.find('wjxx_yingxiongdi/layout', this.midNodes[utype]);
            if (node && node.active) {
                let def = true;
                if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
                    def = iclib.hotupdateEnabled;
                }
                node.children.forEach(e => {
                    e.active = def || e.name != 'btnExchange';
                });
            }
            //设置小游戏按钮显示
            // let sdk = iclib.SdkTool.tool;
            // let pid = sdk.config.platform_id;
            // let cid = sdk.userData['channelId'] || sdk.channelId;
            //let cfg = ConfigManager.getItemById(Little_game_channelCfg, 1)
            let show = false;
            // if (pid == cfg.platform_id && cfg.channel_id.indexOf(cid) >= 0) {
            //     show = true;
            // }
            let cfg = ConfigManager.getItemById(Little_game_channelCfg, iclib.SdkTool.tool.config.id);
            if (cfg && cfg.value) {
                show = true;
            }
            this.littleGameBtn.active = show;
        }
    }

    @gdk.binding("model.setting")
    updateRoleSetting() {
        let setting = this.model.setting;
        for (let i = 0, l = this.setButtons.length; i < l; i++) {
            let active = (setting & 1 << i) > 0;
            if (i < 2) active = !active;
            let children = this.setButtons[i].node.children;
            children[0].active = !active;
            children[1].active = active;
        }
    }

    onMusicToggle() {
        let setting = this.model.setting;
        setting = (setting & 1) > 0 ? (setting - 1) : (setting + 1);
        NetManager.send(new icmsg.RoleSetReq({ setting: setting }), function (rsp: icmsg.RoleSetRsp) {
            this.model.setting = setting;
            gdk.music.isOn = (setting & (1 << RoleSettingValue.Music)) == 0;
        }, this);
    }

    onEffectToggle() {
        let setting = this.model.setting;
        setting = (setting & 2) > 0 ? (setting - 2) : (setting + 2);
        NetManager.send(new icmsg.RoleSetReq({ setting: setting }), function (rsp: icmsg.RoleSetRsp) {
            this.model.setting = setting;
            gdk.sound.isOn = (setting & (1 << RoleSettingValue.Effect)) == 0;
        }, this);
    }

    onSavePowerToggle() {
        let model = this.model;
        let setting = model.setting;
        setting = (setting & 4) > 0 ? (setting - 4) : (setting + 4);
        NetManager.send(new icmsg.RoleSetReq({ setting: setting }), function (rsp: icmsg.RoleSetRsp) {
            model.setting = setting;
            GlobalUtil.setFrameRate((setting & (1 << RoleSettingValue.SavePower)) == 0 ? 60 : 30);
        }, this);
    }

    _updateCommanderSkill() {
        let ids = [99030, 99050, 99060]
        for (let i = 0; i < this.skillItems.length; i++) {
            let ctrl = this.skillItems[i]
            ctrl.updateInfo(ids[i])
        }

        let ids2 = [101, 102, 103]
        let des = ["攻击", "攻速", "伤害"]
        for (let i = 0; i < this.attrLabs.length; i++) {
            let lab = this.attrLabs[i].getComponent(cc.Label)
            let lv = GlobalUtil.getGeneralSkillLv(ids2[i])
            let cfg = ConfigManager.getItemByField(General_commanderCfg, "skill_id", ids2[i], { skill_level: lv })
            lab.string = `${des[i]}加成:${cfg ? cfg.show : 0}`
        }
    }

}

export interface MainsetHonorData {
    cfg: HonourCfg;
    value: any;
    isGuildMaster?: boolean;   // 是否是会长
}
