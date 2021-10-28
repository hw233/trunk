import { HeroCfg, Hero_careerCfg, SystemCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import HeroModel from '../../../common/models/HeroModel';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import PanelId from '../../../configs/ids/PanelId';
import HBHItemCtrl from './HBHItemCtrl';
import HeroDetailViewCtrl from './HeroDetailViewCtrl';

/**
 * @Description: 英雄图鉴界面
 * @Author: weiliang.huang
 * @Date: 2019-05-28 11:32:34
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-24 11:56:02
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HBViewCtrl")
export default class HBViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    hBookHItem: cc.Prefab = null

    @property([cc.Button])
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    btnUp: cc.Node = null

    @property(UiTabMenuCtrl)
    btnMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Node)
    state2: cc.Node = null;
    @property([cc.Button])
    groupBtns2: cc.Button[] = []
    @property([cc.Node])
    heroSprites: cc.Node[] = [];
    @property(cc.Node)
    state2Bg: cc.Node = null;
    @property(cc.Node)
    titleSp: cc.Node = null;


    selectGroup: number = 0     // 筛选阵营
    selectGroup2: number = 1     // 筛选阵营
    cfgLists: { [index: number]: HBItemType[] } = {}   // 英雄配置,按品质分类后的表,0为全部
    heroIds: { [itemId: number]: boolean } = {}    // 记录玩家已有的英雄
    isShowCareer: boolean = false

    btnMenuIndex: number = 0;
    get model() { return ModelManager.get(HeroModel); }

    sendMsg: boolean = false;

    titleSpStr: string[] = ['view/lottery/texture/book/tj_yingxiongtujian', 'view/lottery/texture/book/tj_juexingtujian'];

    state2BgStr: string[] = ['view/lottery/texture/bg/tj_bgY',
        'view/lottery/texture/bg/tj_bgP',
        'view/lottery/texture/bg/tj_bgR',
        'view/lottery/texture/bg/tj_bgB',
        'view/lottery/texture/bg/tj_bgG']

    heroSpStr: string[][] = [
        ['view/lottery/texture/awake/tj_Y_xianzhi',
            'view/lottery/texture/awake/tj_Y_shunwu',
            'view/lottery/texture/awake/tj_Y_aiyinsitanjiaqiangban',
            'view/lottery/texture/awake/tj_Y_caocao',
            'view/lottery/texture/awake/tj_Y_tesila',
            'view/lottery/texture/awake/tj_Y_jiekechuanzhang_',
            'view/lottery/texture/awake/tj_Y_sibadakesi',
            'view/lottery/texture/awake/tj_Y_lvbu',],
        ['view/lottery/texture/awake/tj_P_duotianshi',
            'view/lottery/texture/awake/tj_P_daerwen',
            'view/lottery/texture/awake/tj_P_siqi',
            'view/lottery/texture/awake/tj_P_xuanzang',
            'view/lottery/texture/awake/tj_P_juli',
            'view/lottery/texture/awake/tj_P_gebaini',
            'view/lottery/texture/awake/tj_P_libai',
            'view/lottery/texture/awake/tj_P_lameixisi'],
        ['view/lottery/texture/awake/tj_R_xueshouqishi',
            'view/lottery/texture/awake/tj_R_maladuona',
            'view/lottery/texture/awake/tj_R_liemoren',
            'view/lottery/texture/awake/tj_R_fuermosi',
            'view/lottery/texture/awake/tj_R_dawushilinzhengying',
            'view/lottery/texture/awake/tj_R_qiaodan',
            'view/lottery/texture/awake/tj_R_dawushi'],
        ['view/lottery/texture/awake/tj_B_meirenyu',
            'view/lottery/texture/awake/tj_B_bingdongboshi',
            'view/lottery/texture/awake/tj_B_haimingwei',
            'view/lottery/texture/awake/tj_B_menglu',
            'view/lottery/texture/awake/tj_B_luobinhan',
            'view/lottery/texture/awake/tj_B_banzang',
            'view/lottery/texture/awake/tj_B_lindan'],
        ['view/lottery/texture/awake/tj_G_gaiying',
            'view/lottery/texture/awake/tj_G_aximofu',
            'view/lottery/texture/awake/tj_G_sunshangxiang',
            'view/lottery/texture/awake/tj_G_aijiyanhou',
            'view/lottery/texture/awake/tj_G_napolun',
            'view/lottery/texture/awake/tj_G_nuobeier',
            'view/lottery/texture/awake/tj_G_liqi']
    ]

    awakeHeroIds: number[][] = [
        [300133, 300019, 300014, 300132, 300011, 300023, 300018, 300075],
        [300138, 300013, 300055, 300074, 300012, 300016, 300015, 300139],
        [300057, 300020, 300071, 300142, 300072, 300021, 300058],
        [300144, 300059, 300061, 300031, 300027, 300066, 300022],
        [300067, 300033, 300065, 300032, 300025, 300070, 300146]
    ]

    awakeHeroPos: cc.Vec2[][] = [
        [cc.v2(27.5, 357), cc.v2(-158, 202), cc.v2(121, 217), cc.v2(13, 107.5), cc.v2(-180, -10), cc.v2(99, 23.6), cc.v2(144.7, -142.5), cc.v2(-79, -163)],
        [cc.v2(23.3, 383.2), cc.v2(-103.8, 220), cc.v2(146, 235.8), cc.v2(19, 102.5), cc.v2(-177, 22.8), cc.v2(191, 23.7), cc.v2(93, -99), cc.v2(-104.5, -167.5)],
        [cc.v2(4.5, 277.5), cc.v2(-134, 184.5), cc.v2(153, 171), cc.v2(-54.5, 84), cc.v2(-101.5, -35.8), cc.v2(96, -80.5), cc.v2(-34.9, -165)],
        [cc.v2(-45, 336), cc.v2(-162, 210), cc.v2(177, 216), cc.v2(39.9, 124), cc.v2(-151, -25), cc.v2(122.5, -35), cc.v2(-38, -147.5)],
        [cc.v2(-29.5, 302.9), cc.v2(-132.5, 182.5), cc.v2(129, 203), cc.v2(0, 110), cc.v2(-165, -64.5), cc.v2(119, -32), cc.v2(26.3, -154)]
    ]

    awakeColor: cc.Color[] = [cc.color('#FFFFFF'), cc.color('#4F4C4C')]

    onLoad() {
        let heroItems = this.model.heroInfos
        for (let index = 0; index < heroItems.length; index++) {
            const hero = heroItems[index];
            this.heroIds[hero.itemId] = true
        }
        let lists = this.cfgLists
        lists[0] = []
        let items = ConfigManager.getItems(HeroCfg)
        for (let index = 0; index < items.length; index++) {
            const cfg = items[index]
            if (!cfg.show) {
                continue;
            }
            if (!lists[cfg.defaultColor]) {
                lists[cfg.defaultColor] = []
            }
            let data: HBItemType = {
                geted: !!this.heroIds[cfg.id],
                cfg: cfg,
                careerLineIdx: 0,
            }
            lists[0].push(data)
            lists[cfg.defaultColor].push(data)
        }
        // 按阵营排序
        for (let index in lists) {
            GlobalUtil.sortArray(lists[index], (a, b) => {
                if (a.cfg.defaultColor == b.cfg.defaultColor) {
                    return a.cfg.group[0] - b.cfg.group[0]
                }
                return b.cfg.defaultColor - a.cfg.defaultColor
            })
        }
    }

    onEnable() {
        // this.selectColorFunc(null, 0)
        //判断是否有觉醒图鉴页签
        let maxStar = ConfigManager.getItemByField(SystemCfg, 'id', 2928).heroStar[0]
        this.sendMsg = false;
        this.selectGroup2 = 1;
        let show = ModelManager.get(RoleModel).maxHeroStar >= maxStar;
        if (show) {
            this.btnMenu.itemNames = ['英雄图鉴', '觉醒图鉴']
        } else {
            this.btnMenu.itemNames = ['英雄图鉴']
        }
        this.btnMenuIndex = 0;
        this.btnMenu.selectIdx = this.btnMenuIndex;

        this.state1.active = true;
        this.state2.active = false;
        this.selectGroupFunc(null, 0)
        GlobalUtil.setSpriteIcon(this.node, this.titleSp, this.titleSpStr[this.btnMenuIndex]);
    }

    onDisable() {
        gdk.Timer.clearAll(this);
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        let datas = this.cfgLists[0]
        let tempList: HBItemType[] = [];
        if (this.selectGroup != 0) {
            //英雄阵营数据
            for (let i = 0; i < datas.length; i++) {
                if (datas[i].cfg.group.indexOf(this.selectGroup) != -1) {
                    tempList.push(datas[i])
                }
            }
        }
        else {
            tempList = datas;
        }
        // tempList.sort((a, b) => {
        //     let careerTypeA = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', a.cfg.career_id).career_type;
        //     let careerTypeB = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', b.cfg.career_id).career_type;
        //     return careerTypeA - careerTypeB;
        // })
        tempList.sort((a: HBItemType, b: HBItemType) => {
            return b.cfg.defaultColor - a.cfg.defaultColor;
        });
        let [career1, career3, career4] = [[], [], []];
        tempList.forEach(e => {
            let careerIds = HeroUtils.getHeroAllCareersById(e.cfg.id);
            let careerTypes = [];
            careerIds.forEach(id => {
                let type = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', id).career_type;
                if (careerTypes.indexOf(type) == -1) {
                    careerTypes.push(type);
                };
            });
            careerTypes.forEach((type, idx) => {
                let obj = JSON.parse(JSON.stringify(e));
                obj.careerLineIdx = idx;
                [career1, , career3, career4][type - 1].push(obj);
            })
        })
        let finalList = [career1, career3, career4];
        this.content.removeAllChildren();
        let nodes = [];
        finalList.forEach((l, idx) => {
            let node = cc.instantiate(this.hBookHItem);
            let ctrl = node.getComponent(HBHItemCtrl);
            ctrl.updateView(l, [1, 3, 4][idx]);
            let row = Math.floor(l.length / 5) + (l.length % 5 > 0 ? 1 : 0);
            node.height = 60 + 5 + row * 130 - 20;
            nodes.push(node);
        });
        gdk.Timer.callLater(this, () => {
            if (cc.isValid(this.node)) {
                nodes.forEach(n => { n.parent = this.content; });
                this.content.getComponent(cc.Layout).updateLayout();
            }
        })
        this.model.bookHeroList = [...career1, ...career3, ...career4];
    }

    _updateScroll2() {
        //设置背景图
        GlobalUtil.setSpriteIcon(this.node, this.state2Bg, this.state2BgStr[this.selectGroup2 - 1]);

        //设置英雄信息
        let heroSp: string[] = this.heroSpStr[this.selectGroup2 - 1];
        let heroid: number[] = this.awakeHeroIds[this.selectGroup2 - 1]
        let heroPos: cc.Vec2[] = this.awakeHeroPos[this.selectGroup2 - 1];
        let temLen = heroSp.length;
        this.heroSprites.forEach((node, i) => {
            if (i < temLen) {
                node.active = true
                let path = heroSp[i];
                GlobalUtil.setSpriteIcon(this.node, node, path);
                node.setPosition(heroPos[i]);
                let state = 1;
                if (this.model.HeroAwakeData.ids.indexOf(heroid[i]) >= 0) {
                    state = 0;
                }
                node.color = this.awakeColor[state];
            } else {
                node.active = false
            }
        })
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
        this._updateScroll()
    }


    /**选择页签, 筛选阵营*/
    selectGroup2Func(e, utype) {
        this.selectGroup2 = parseInt(utype)
        for (let idx = 0; idx < this.groupBtns2.length; idx++) {
            const element = this.groupBtns2[idx];
            let nodeName = element.name
            let group = parseInt(nodeName.substring('group'.length));
            element.interactable = group != this.selectGroup2
            let select = element.node.getChildByName("select")
            select.active = group == this.selectGroup2
        }
        this._updateScroll2()

    }

    pageSelect(event, index, refresh: boolean = false) {
        if (this.btnMenuIndex == index && !refresh) return;
        this.btnMenuIndex = index;
        if (index == 0) {
            this.state1.active = true;
            this.state2.active = false;
            this._updateScroll2();

        } else {
            if (!this.sendMsg) {
                NetManager.send(new icmsg.HeroAwakeBooksReq(), (rsp: icmsg.HeroAwakeBooksRsp) => {
                    this.sendMsg = true
                    this.model.HeroAwakeData = rsp;
                    this.state1.active = false;
                    this.state2.active = true;
                    this.selectGroup2Func(null, this.selectGroup2)
                }, this)
            } else {
                this.state1.active = false;
                this.state2.active = true;
                this.selectGroup2Func(null, this.selectGroup2)
            }
        }
        //设置标题图片
        GlobalUtil.setSpriteIcon(this.node, this.titleSp, this.titleSpStr[this.btnMenuIndex]);
    }


    showHeroDetail(e, utype) {
        let index = parseInt(utype);
        let heroid: number[] = this.awakeHeroIds[this.selectGroup2 - 1];
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroid[index])
        let info: HBItemType = {
            cfg: heroCfg,
            geted: !!this.heroIds[heroCfg.id],
            careerLineIdx: 0
        }
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(heroCfg, info)
        })
    }

}

export type HBItemType = {
    cfg: HeroCfg,   // 英雄配置信息
    geted: boolean,  // 是否拥有
    careerLineIdx: number, //职业路线idx
}