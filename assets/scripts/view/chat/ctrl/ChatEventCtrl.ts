import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import FootHoldModel from '../../guild/ctrl/footHold/FootHoldModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from '../../lottery/ctrl/HeroDetailViewCtrl';
import HeroModel from '../../../common/models/HeroModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import LookHeroViewCtrl from '../../role/ctrl2/lookHero/LookHeroViewCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import Reader from '../../../../boot/common/core/reader';
import RelicModel from '../../relic/model/RelicModel';
import RoleModel from '../../../common/models/RoleModel';
import { AskInfoType } from '../../../common/widgets/AskPanel';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { HeroCfg, SystemCfg, UniqueCfg } from '../../../a/config';

/** 
 * @Description: 富文本点击控制器
 * @Author: weiliang.huang  
 * @Date: 2019-03-22 13:32:05 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-13 16:43:36
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class ChatEventCtrl extends cc.Component {

    testFunc(event, param) {
        // console.log("testFunc", param)
    }

    equipClick(event, param) {
        let info: icmsg.EquipInfo = JSON.parse(param);
        let item: BagItem = {
            series: info.equipId,
            itemId: info.equipId,
            type: BagType.EQUIP,
            itemNum: 1,
            extInfo: info
        };
        gdk.panel.setArgs(PanelId.EquipTips, { itemInfo: item, noBtn: true, isOther: true });
        gdk.panel.open(PanelId.EquipTips);
    }

    itemClick(event, param) {
        // 找出param参数中的道具id
        let id = param.replace(/{(.*)}/, "$1")
        id = parseInt(id)
        let type = BagUtils.getItemTypeById(id)
        let item: BagItem = {
            series: id,
            itemId: id,
            type: type,
            itemNum: 1,
            extInfo: null
        }
        GlobalUtil.openItemTips(item, true)
    }

    heroClick(event, param) {
        let id = param.replace(/{(.*)}/, "$1")
        id = parseInt(id)
        let heroCfg = ConfigManager.getItemById(HeroCfg, id);
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(heroCfg)
        })
    }

    heroImageClick(event, param) {
        let data: icmsg.RoleHeroImageRsp = new icmsg.RoleHeroImageRsp()
        data.hero = JSON.parse(param)
        data.type = 1
        gdk.panel.setArgs(PanelId.MainSetHeroInfoTip, data)
        gdk.panel.open(PanelId.MainSetHeroInfoTip);

    }

    playerClick(event, param) {
        // let str: String = param.replace(/{(.*)}/, "$1");
        // let arr = str.split(",");
        // let newArr: number[] = []
        // arr.forEach(e => {
        //     newArr.push(parseInt(e));
        // })
        // let id: Uint8Array = new Uint8Array(newArr);
        // let msg = new RoleImageReq()
        // msg.playerId = parseInt(param);
        // NetManager.send(msg)

        gdk.panel.setArgs(PanelId.MainSet, parseInt(param))
        gdk.panel.open(PanelId.MainSet)

    }

    joinGuildClick(event, param) {
        let roleModel = ModelManager.get(RoleModel)
        let joinLv = ConfigManager.getItemById(SystemCfg, 2400).openLv
        if (roleModel.level < joinLv) {
            gdk.gui.showMessage(`指挥官${joinLv}级才可加入`)
            return
        }
        let guildId = parseInt(param)
        let msg = new icmsg.GuildJoinReq()
        msg.guildId = guildId
        NetManager.send(msg, (data: icmsg.GuildJoinRsp) => {
            // //正常加入
            // if (data.error == -1) {
            //     gdk.gui.showMessage("申请成功，等待会长审核")
            // } else if (data.error == 0) {
            //     if (data.guildId && data.camp) {
            //         gdk.panel.hide(PanelId.Friend)
            //         gdk.panel.hide(PanelId.Chat)
            //         gdk.gui.showMessage(`成功加入${data.camp.guild.name}公会`)
            //         roleModel.guildId = data.guildId
            //         roleModel.guildName = data.camp.guild.name
            //         gdk.panel.open(PanelId.GuildMain)
            //     }
            // } else {
            //     gdk.gui.showMessage(ErrorManager.get(data.error, [data.minLv]))
            // }
        }, this)
    }

    /**打开赏金板 */
    bountyClick(event, param) {
        gdk.panel.hide(PanelId.Chat)
        gdk.panel.open(PanelId.BountyList)
    }


    /**月卡点击 */
    monthCardClick(event, param) {
        gdk.panel.hide(PanelId.Chat)
        let index = parseInt(param)
        gdk.panel.setArgs(PanelId.MonthCard, index)
        gdk.panel.open(PanelId.MonthCard)
    }

    vipClick(event, param) {
        gdk.panel.hide(PanelId.Chat)
        JumpUtils.openRechargeView([2])
    }

    tqClick(event, param) {
        gdk.panel.hide(PanelId.Chat)
        JumpUtils.openRechargeView([0])
    }

    //打开爬塔副本
    towerClick() {
        if (!JumpUtils.ifSysOpen(705)) {
            return;
        }
        gdk.panel.hide(PanelId.Chat)
        gdk.panel.open(PanelId.TowerPanel)
    }

    dailyRechargeClick() {
        if (!JumpUtils.ifSysOpen(2834)) {
            return;
        }
        gdk.panel.hide(PanelId.Chat);
        gdk.panel.open(PanelId.DailyFirstRecharge);
    }

    goToTQStore() {
        gdk.panel.hide(PanelId.HelpTipsPanel);
        JumpUtils.openRechargeView([0])
    }

    scoreSysClick() {
        gdk.panel.open(PanelId.ScoreSytemView);
    }


    adventureClick() {
        JumpUtils.openActivityMain([9])
    }


    shareHeroClick(event, param) {
        let msg = new icmsg.ShareInfoReq()
        msg.shareId = param
        NetManager.send(msg, (data: icmsg.ShareInfoRsp) => {
            gdk.panel.open(PanelId.LookHeroView, (node: cc.Node) => {
                let model = ModelManager.get(HeroModel)
                model.heroImage = data.info
                let comp = node.getComponent(LookHeroViewCtrl)
                comp.updateHeroInfo()
            })
        })
    }

    shareHeroCommentClick(event, param) {
        let ids = (param as string).split("@")
        gdk.panel.setArgs(PanelId.SubHeroCommentPanel, ids[0], ids[1], ids[2])
        gdk.panel.open(PanelId.SubHeroCommentPanel)
    }

    relicCallGuildATK(event, param) {
        if (!JumpUtils.ifSysOpen(2861, true)) {
            return;
        }
        gdk.panel.hide(PanelId.Chat);
        let m = ModelManager.get(RelicModel);
        m.jumpArgs = param;
        gdk.panel.open(PanelId.RelicMainView);
    }


    relicGoToATK(event, param) {
        if (!JumpUtils.ifSysOpen(2861, true)) {
            return;
        }
        gdk.panel.hide(PanelId.Chat);
        gdk.panel.hide(PanelId.RelicUnderAtkNoticeView);
        let m = ModelManager.get(RelicModel);
        m.jumpArgs = param;
        gdk.panel.open(PanelId.RelicMainView);
    }

    joinCooperation(event, param) {
        let guildId = parseInt(param)
        let footHoldModel = ModelManager.get(FootHoldModel)
        let roleModel = ModelManager.get(RoleModel)
        if (roleModel.guildId == 0) {
            let info: AskInfoType = {
                sureCb: () => {
                    gdk.panel.hide(PanelId.FHCooperationMain)
                    gdk.panel.setArgs(PanelId.GuildJoin, guildId, false)
                    gdk.panel.open(PanelId.GuildJoin)
                },
                closeCb: () => {
                    gdk.panel.hide(PanelId.FHCooperationMain)
                    gdk.panel.open(PanelId.GuildList)
                },
                sureText: "加入该公会",
                closeText: "公会列表",
                descText: `加入公会后才可参与据点争夺战，推荐先加入公会`,
                thisArg: this,
            }
            GlobalUtil.openAskPanel(info)
            return
        }

        let msg = new icmsg.FootholdCoopApplyAskReq()
        msg.guildId = guildId
        NetManager.send(msg, (data: icmsg.FootholdCoopApplyAskRsp) => {
            if (data.autoJoin) {
                footHoldModel.coopGuildId = data.guildId
                gdk.gui.showMessage("成功加入协战，请前往据点争夺战战场")
            } else {
                gdk.gui.showMessage("申请成功，请敬候佳音")
            }
        }, this)
    }

    replayBounty(event, param) {
        let msg1 = new icmsg.BountyQueryReq()
        msg1.missionId = parseInt(param)
        NetManager.send(msg1, (data1: icmsg.BountyQueryRsp) => {
            let msg2 = new icmsg.BountyFightReplyReq()
            msg2.missionId = parseInt(param)
            NetManager.send(msg2, (data2: icmsg.BountyFightReplyRsp) => {
                gdk.panel.setArgs(PanelId.BountyItemReplay, data1.mission, data2)
                gdk.panel.open(PanelId.BountyItemReplay)
            })
        })
    }

    goToguildPower(event) {
        JumpUtils.openGuildPowerView()
    }

    goToCustumeCustom(event) {
        if (JumpUtils.ifSysOpen(2938, true)) {
            gdk.panel.open(PanelId.CostumeCustomMain);
        }
    }

    custumeCustomClick(event, param) {
        if (!param) return;
        let info = this.parseProtoParam(param);
        if (info && info instanceof icmsg.CostumeCustomRsp) {
            let item: BagItem = {
                series: null,
                itemId: info.costume.typeId,
                itemNum: 1,
                type: BagType.COSTUME,
                extInfo: info.costume
            }
            GlobalUtil.openItemTips(item);
        }
    }

    parseProtoParam(str: string): icmsg.Message {
        //str2ab
        // let temp = str.split(',');
        // let arryBuff = new ArrayBuffer(temp.length); // 2 bytes for each char
        // var bufView = new Uint8Array(arryBuff);
        // for (var i = 0; i < temp.length; i++) {
        //     // bufView[i] = temp[i].charCodeAt(i);
        //     bufView[i] = parseInt(temp[i]);
        // }
        let arryBuff = gdk.Buffer.from(str, 'binary');
        //parse Message
        let reader: Reader = new Reader();
        let msgType: number;
        let msg: icmsg.Message;
        // 网络数据
        reader.WriteBuff(arryBuff);
        while (reader.HasMessage) {
            msgType = reader.BeginMessage();
            let clazz = icmsg.MessageClass[msgType];
            if (clazz) {
                try {
                    msg = new clazz();
                    msg.decode(reader);
                } catch (err) {
                    cc.error("网络错误：", err);
                }
            } else {
                cc.error(`找不到${msgType}对应的Message类定义，请检查协议代码，或重新生成协议代码`);
            }
            reader.FinishMessage();
        }
        reader.Clear();
        return msg;
    }

    uniqueEquipClick(event, param) {
        let id = param.replace(/{(.*)}/, "$1")
        id = parseInt(id)
        let c = ConfigManager.getItemById(UniqueCfg, id);
        let extInfo = new icmsg.UniqueEquip();
        extInfo.id = -1
        extInfo.itemId = c.id
        extInfo.star = c.star_max
        let item: BagItem = {
            series: null,
            itemId: c.id,
            itemNum: 1,
            type: BagUtils.getItemTypeById(c.id),
            extInfo: extInfo
        }
        GlobalUtil.openItemTips(item);
    }
}