import { Champion_divisionCfg, VaultCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import { MainsetHonorData } from './MainSetCtrl';


/**
 * @Description: 个人名片-荣耀展示子项
 * @Author: yaozu.hu
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-27 15:53:24
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainSethonorItemCtrl")
export default class MainSethonorItemCtrl extends cc.Component {

    @property(cc.Label)
    nameLb: cc.Label = null;

    @property(cc.Label)
    valueLb: cc.Label = null;

    @property(cc.Node)
    starNode: cc.Node = null;

    @property(cc.Node)
    guildNode: cc.Node = null;

    updateView(honorData: MainsetHonorData) {
        this.starNode.active = false;
        this.guildNode.active = false;
        this.nameLb.string = honorData.cfg.name + ':'
        let addValue: string = '名';
        let temValue: string = honorData.value > 0 ? honorData.value + '' : '未上榜';
        let headStr: string = honorData.value > 0 ? '第' : '';
        switch (honorData.cfg.id) {
            case 1:
                this.guildNode.active = honorData.isGuildMaster;
                temValue = honorData.value == '' ? '暂无工会' : honorData.value
                addValue = ''
                headStr = ''
                break;
            case 3:
                temValue = honorData.value > 0 ? honorData.value % 1000 + '' : '未上榜';
                addValue = '层'
                break;
            case 4:
                this.starNode.active = true;
                addValue = '';
                headStr = ''
                temValue = honorData.value > 0 ? honorData.value + '' : '0';
                break;
            case 6:
                //殿堂指挥官
                //设置颜色
                let temCfg = ConfigManager.getItemByField(VaultCfg, 'id', honorData.value);
                temValue = temCfg ? temCfg.name : '未上榜';
                addValue = '';
                headStr = ''
                break;
            case 7:
                //锦标赛
                let lv = Math.floor(honorData.value / 10)
                let rank = honorData.value % 10;
                if (rank > 0) {
                    let temName = ['传奇皇者', '传奇王者', '传奇之星']
                    temValue = temName[rank - 1];
                } else {
                    let temCfg = ConfigManager.getItemByField(Champion_divisionCfg, 'lv', lv);
                    temValue = temCfg ? temCfg.name : '未上榜';
                }
                addValue = ''
                headStr = ''
                break;
            default:
        }
        this.valueLb.string = headStr + temValue + (honorData.value > 0 ? addValue : '');

    }

}
