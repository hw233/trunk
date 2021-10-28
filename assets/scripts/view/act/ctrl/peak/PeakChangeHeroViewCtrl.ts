import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakChangeViewHeroItemCtrl from './PeakChangeViewHeroItemCtrl';
import PeakModel from '../../model/PeakModel';
import StringUtils from '../../../../common/utils/StringUtils';
import SubInsSweepViewCtrl from '../../../instance/ctrl/SubInsSweepViewCtrl';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { HeroCfg, Peak_conversionCfg, Peak_mainCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


/** 
 * @Description: 巅峰之战转换英雄View
 * @Author: yaozu.hu
 * @Date: 2021-02-27 14:47:56
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-13 15:34:02
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakChangeHeroViewCtrl")
export default class PeakChangeHeroViewCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;
    @property(cc.Sprite)
    heroGroup: cc.Sprite = null;
    @property(cc.Label)
    heroName: cc.Label = null;

    @property(cc.ScrollView)
    scrollView1: cc.ScrollView = null;
    @property(cc.Node)
    content1: cc.Node = null;
    @property(cc.Prefab)
    heroItem: cc.Prefab = null;


    @property(cc.Node)
    changeBtn: cc.Node = null;
    @property(cc.Node)
    resetBtn: cc.Node = null;
    @property(cc.Node)
    sureBtn: cc.Node = null;
    @property(cc.Node)
    cancelBtn: cc.Node = null;

    @property(cc.Label)
    changeNum: cc.Label = null;
    @property(cc.Node)
    changeIcon: cc.Node = null;
    @property(cc.Label)
    numLb: cc.Label = null;
    @property(cc.Label)
    tipsLb: cc.Label = null;

    //----------英雄列表--------------
    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.ScrollView)
    scrollView2: cc.ScrollView = null;
    @property(cc.Node)
    content2: cc.Node = null;
    @property(cc.Prefab)
    heroListItem: cc.Prefab = null;

    selectGroup: number = 0     // 筛选阵营
    list1: ListView = null
    list2: ListView = null

    heroList: number[] = [];//转换的历史记录
    selectHeroData: any = null;
    randomData: icmsg.PeakHeroDisplaceRsp;
    canChange: boolean = true;
    get peakModel() { return ModelManager.get(PeakModel); }

    groupData = [[[1, 2, 3, 4, 5], [0, 1]], [[1, 2], [1]], [[3, 4, 5], [1]], [[1, 2], [0]], [[3, 4, 5], [0]]]
    costNum: number = 0;

    //----------转换动画-----------------
    isPlayAnim: boolean = false;
    curPlayIdx: number = 0;
    playAnimTime: number = 2;
    changeTime: number = 0;

    onEnable() {
        this.isPlayAnim = false;
        this.selectGroupFunc(null, 0)
        gdk.e.on(ActivityEventId.ACTIVITY_PEAK_CHANGEHERO_SELECT_UPDATE, this.selectHeroEvent, this)

        this.refreshChangeNum();
    }



    onDisable() {

        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        if (this.list1) {
            this.list1.destroy()
            this.list1 = null;
        }
        if (this.list2) {
            this.list2.destroy()
            this.list2 = null;
        }
    }

    update(dt: number) {
        if (this.isPlayAnim && this.playAnimTime > 0) {
            //let index = -1;
            this.playAnimTime -= dt;
            this.changeTime -= dt;
            if (this.playAnimTime <= 0) {
                this.isPlayAnim = false;
                let index = -1;
                this.list1.items.forEach((itme, idx) => {
                    let ctrl = itme.node.getComponent(PeakChangeViewHeroItemCtrl);
                    if (ctrl.data.cfg.item_id == this.randomData.hero.typeId) {
                        index = idx;
                        //ctrl.selectNode.active = true;
                    }
                    ctrl.selectSp1Node.active = false;
                })

                this.changeBtn.active = false;
                this.resetBtn.active = false;
                this.cancelBtn.active = true;
                this.sureBtn.active = true;

                this._updateScroll1();
                this.list1.select_item(index);
                this.list1.scroll_to(index);
                return
            }
            if (this.changeTime <= 0) {
                let newItem = this.list1.items[this.curPlayIdx].node;
                let newCtrl = newItem.getComponent(PeakChangeViewHeroItemCtrl);
                if (!newCtrl.data.isGray) {
                    newCtrl.selectSp1Node.active = true;
                    this.changeTime = 0.05;
                }
                let oldItem: cc.Node = null;
                if (this.curPlayIdx == 0) {
                    oldItem = this.list1.items[this.list1.items.length - 1].node;
                } else {
                    oldItem = this.list1.items[this.curPlayIdx - 1].node;
                }
                let oldCtrl = oldItem.getComponent(PeakChangeViewHeroItemCtrl);
                oldCtrl.selectSp1Node.active = false;
                this.curPlayIdx += 1;
                if (this.curPlayIdx >= this.list1.items.length) {
                    this.curPlayIdx = 0;
                }
            }

        }
    }

    refreshChangeNum() {
        let temStateInfo = this.peakModel.peakStateInfo
        let num = this.peakModel.freeChangeNum + this.peakModel.maxChangeNum - temStateInfo.displaceTimes;
        this.changeNum.string = Math.max(0, num) + '';
        if (temStateInfo.displaceTimes < this.peakModel.freeChangeNum) {
            this.changeIcon.active = false;
            this.numLb.node.active = false;
            this.tipsLb.string = gdk.i18n.t('i18n:PEAK_TIP7');
            this.canChange = true;
        } else {

            this.tipsLb.string = gdk.i18n.t('i18n:PEAK_TIP8');
            let mainCfg = ConfigManager.getItemByField(Peak_mainCfg, 'reward_type', this.peakModel.reward_type);
            this.costNum = 0;
            let temNum = temStateInfo.displaceTimes - this.peakModel.freeChangeNum
            mainCfg.conversion_times.forEach(data => {
                if (data[0] == temNum + 1) {
                    this.costNum = data[1];
                }
            })
            this.changeIcon.active = this.costNum != 0;
            this.numLb.node.active = this.costNum != 0;
            this.numLb.string = this.costNum + ''
            this.canChange = this.costNum != 0;

        }
    }

    selectHeroEvent(e: gdk.Event) {
        if (this.isPlayAnim) {
            this.isPlayAnim = false;
            this.playAnimTime = 0;
        }
        this.changeBtn.active = true;
        this.cancelBtn.active = false;
        this.sureBtn.active = false;
        this.randomData = null;
        this.peakModel.randomData = null;

        //设置转换信息
        this.selectHeroData = e.data;
        //1 获取转换记录
        let msg = new icmsg.PeakHeroDisplaceRecordReq()
        msg.heroId = e.data.cfg.item_id;
        NetManager.send(msg, (rsp: icmsg.PeakHeroDisplaceRecordRsp) => {
            this.heroList = rsp.hero;
            this.resetBtn.active = this.heroList.length > 0;
            this.setChangeHeroInfo();
        }, this)
    }

    setChangeHeroInfo() {
        //设置英雄模型信息
        this.spine.node.active = true;
        this.heroGroup.node.active = true;
        //this.heroName.string = ''
        let heroCfg = ConfigManager.getItemById(HeroCfg, this.selectHeroData.cfg.item_id);
        HeroUtils.setSpineData(this.node, this.spine, heroCfg.skin, false, false);
        GlobalUtil.setSpriteIcon(this.node, this.heroGroup, GlobalUtil.getGroupIcon(heroCfg.group[0], false));
        this.heroName.string = heroCfg.name;

        //设置转换池
        this._updateScroll1()
    }

    /**选择页签, 筛选阵营*/
    selectGroupFunc(e, utype) {
        this.selectGroup = parseInt(utype)
        for (let idx = 0; idx < this.groupBtns.length; idx++) {
            const element = this.groupBtns[idx];
            let nodeName = element.name
            let group = parseInt(nodeName.substring('group'.length));
            element.interactable = group != this.selectGroup
            let select = element.node.getChildByName("select")
            select.active = group == this.selectGroup
        }
        this.selectHeroData = null;
        this.peakModel.changeHeroSelectId = -1;
        this._updateScroll2()
    }

    _initListView1() {
        if (this.list1) {
            return
        }
        this.list1 = new ListView({
            scrollview: this.scrollView1,
            mask: this.scrollView1.node,
            content: this.content1,
            item_tpl: this.heroItem,
            cb_host: this,
            column: 3,
            gap_x: 5,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
        //this.list.onClick.on(this._selectItem, this);
    }


    _updateScroll1() {
        this._initListView1();
        let listData = []
        let temCfg: Peak_conversionCfg = this.selectHeroData.cfg;
        let cfgs = ConfigManager.getItems(Peak_conversionCfg, (cfg: Peak_conversionCfg) => {
            if (cfg.career_id == temCfg.career_id && cfg.best == temCfg.best && temCfg.camp.indexOf(cfg.camp[0]) >= 0) {
                return true;
            }
            return false;
        })

        cfgs.forEach(cfg => {
            let isGray = false;
            //在置换记录列表时置灰
            if (this.heroList.indexOf(cfg.item_id) >= 0) {
                isGray = true;
            }
            //已经拥有该英雄时置灰
            let list = this.peakModel.peakStateInfo.heroes
            for (let i = 0; i < list.length; i++) {
                let hero = list[i];
                if (hero.typeId == cfg.item_id) {
                    isGray = true;
                    break;
                }
            }
            let temData = { cfg: cfg, isGray: isGray, isList: false }
            listData.push(temData);
        })

        this.list1.clear_items()
        this.list1.set_data(listData);

    }

    _initListView2() {
        if (this.list2) {
            return
        }
        this.list2 = new ListView({
            scrollview: this.scrollView2,
            mask: this.scrollView2.node,
            content: this.content2,
            item_tpl: this.heroListItem,
            cb_host: this,
            async: true,
            //resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        //this.list.onClick.on(this._selectItem, this);
    }

    _updateScroll2() {
        this._initListView2()
        let listData = []
        let types = [1, 3, 4];
        let type1: Peak_conversionCfg[] = []
        let type3: Peak_conversionCfg[] = []
        let type4: Peak_conversionCfg[] = [];
        let curGroup = this.groupData[this.selectGroup];
        this.peakModel.peakStateInfo.heroes.forEach(hero => {
            let careerType = hero.careerType//Math.floor(hero.soldierId / 100);
            let heroCfg = ConfigManager.getItemById(HeroCfg, hero.typeId);
            if (curGroup[0].indexOf(heroCfg.group[0]) >= 0 && curGroup[1].indexOf(heroCfg.best) >= 0) {
                let conversionCfg = ConfigManager.getItem(Peak_conversionCfg, (cfg: Peak_conversionCfg) => {
                    if (cfg.item_id == hero.typeId && cfg.career_id == careerType) {
                        return true
                    }
                    return false;
                })
                switch (careerType) {
                    case 1:
                        type1.push(conversionCfg)
                        break;
                    case 3:
                        type3.push(conversionCfg)
                        break;
                    case 4:
                        type4.push(conversionCfg)
                        break
                }
            }
        })

        types.forEach(type => {
            let temData = {}
            switch (type) {
                case 1:
                    temData = { type: type, heros: type1 }
                    break;
                case 3:
                    temData = { type: type, heros: type3 }
                    break;
                case 4:
                    temData = { type: type, heros: type4 }
                    break
            }

            listData.push(temData)
        })
        let tem = type1.concat(type3).concat(type4);
        if (this.peakModel.changeHeroSelectId <= 0 && tem.length > 0) {
            //let e = new gdk.Event();
            this.peakModel.changeHeroSelectId = tem[0].item_id
            // e.data = { cfg: tem[0], isGray: false, isList: true }
            // this.selectHeroEvent(e)
        }
        this.list2.clear_items()
        this.list2.set_data(listData);


        if (tem.length == 0) {
            this.spine.node.active = false;
            this.heroGroup.node.active = false;
            this.heroName.string = '';
            if (this.list1) {
                let temlistData = []
                this.list1.clear_items()
                this.list1.set_data(temlistData);
            }
            this.changeBtn.active = false;
        }

    }


    changeBtnClick() {

        if (!this.canChange) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:PEAK_TIP9'))
            return;
        }
        let curNum = BagUtils.getItemNumById(2);
        if (this.costNum > curNum) {
            if (!GlobalUtil.checkMoneyEnough(this.costNum, 2, null, [PanelId.PeakView])) {
                return
            }
        }
        if (this.isPlayAnim) {
            return;
        }

        let msg = new icmsg.PeakHeroDisplaceReq()
        msg.heroId = this.selectHeroData.cfg.item_id;
        NetManager.send(msg, (rsp: icmsg.PeakHeroDisplaceRsp) => {
            //this.heroList = rsp.hero;
            //设置随出的英雄
            //设置按钮的显示

            //播放随机动画




            this.peakModel.peakStateInfo.displaceTimes = rsp.displaceTimes;
            this.refreshChangeNum();
            this.randomData = rsp;
            this.peakModel.randomData = rsp;

            this.isPlayAnim = true;
            this.playAnimTime = 2;
            this.curPlayIdx = 0
            // this.changeBtn.active = false;
            // this.resetBtn.active = false;
            // this.cancelBtn.active = true;
            // this.sureBtn.active = true;


            // let index = -1;
            // this.list1.items.forEach((itme, idx) => {
            //     let ctrl = itme.node.getComponent(PeakChangeViewHeroItemCtrl);
            //     if (ctrl.data.cfg.item_id == rsp.hero.typeId) {
            //         index = idx;
            //         //ctrl.selectNode.active = true;
            //     }
            // })
            // this._updateScroll1();
            // this.list1.select_item(index);

        }, this)

    }


    sureBtnClick() {

        NetManager.send(new icmsg.PeakHeroDisplaceConfirmReq, (rsp: icmsg.PeakHeroDisplaceConfirmRsp) => {
            //this.heroList = rsp.hero;
            //设置随出的英雄
            //设置按钮的显示
            this.changeBtn.active = true;
            this.resetBtn.active = false;
            this.cancelBtn.active = false;
            this.sureBtn.active = false;

            let temStateInfo = this.peakModel.peakStateInfo
            let index1 = temStateInfo.heroIds.indexOf(this.peakModel.changeHeroSelectId)
            if (index1 >= 0) {
                temStateInfo.heroIds[index1] = rsp.hero.typeId//temStateInfo.heroIds.splice(index1, 1);
                //temStateInfo.heroIds.push(0);
            }

            let index2 = -1
            temStateInfo.heroes.forEach((hero, idx) => {
                if (hero.typeId == this.peakModel.changeHeroSelectId) {
                    index2 = idx;
                }
            })
            if (index2 >= 0) {
                temStateInfo.heroes.splice(index2, 1);
            }
            temStateInfo.heroes.push(rsp.hero);
            //
            this.peakModel.peakStateInfo = temStateInfo;

            this.selectHeroData = null;
            this.peakModel.changeHeroSelectId = rsp.hero.typeId;
            this.peakModel.randomData = null;
            this.randomData = null;
            //显示英雄
            let temData = []
            let tem = new icmsg.GoodsInfo()
            tem.typeId = rsp.hero.typeId;
            tem.num = 1;
            temData.push(tem);
            GlobalUtil.openRewadrView(temData);
            this.list1.select_item(-1);
            this._updateScroll2();
            let heroCfg = ConfigManager.getItemById(HeroCfg, rsp.hero.typeId);
            gdk.e.emit(ActivityEventId.ACTIVITY_PEAK_CHANGEHERO_OK_UPDATE);
            let str = StringUtils.format(gdk.i18n.t("i18n:PEAK_TIP14"), heroCfg.name)
            gdk.gui.showMessage(str)
        }, this)
    }

    cancelBtnClick() {

        this.changeBtn.active = true;
        this.resetBtn.active = true;
        this.cancelBtn.active = false;
        this.sureBtn.active = false;
        this.heroList.push(this.randomData.hero.typeId);
        this.randomData = null;
        this.peakModel.randomData = null;
        this._updateScroll1();

        this.list1.select_item(-1);
    }

    resetBtnClick() {
        if (this.heroList.length > 0) {
            let descStr = gdk.i18n.t('i18n:PEAK_TIP5')//`重置后该池子内已转换过的英雄可再重新获得,是否进行重置？`
            let sureCb = () => {
                //1 重置转换记录
                let msg = new icmsg.PeakHeroResetDisplaceRecordReq()
                msg.heroId = this.selectHeroData.cfg.item_id;
                NetManager.send(msg, (rsp: icmsg.PeakHeroResetDisplaceRecordRsp) => {
                    this.heroList = rsp.hero;
                    this.resetBtn.active = this.heroList.length > 0;
                    gdk.gui.showMessage(gdk.i18n.t('i18n:PEAK_TIP12'))
                    this.setChangeHeroInfo();
                }, this)
            };
            gdk.panel.open(PanelId.SubInsSweepView, (node: cc.Node) => {
                let ctrl = node.getComponent(SubInsSweepViewCtrl);
                ctrl.updateView(descStr, '', sureCb);
            });
        }

    }


}
