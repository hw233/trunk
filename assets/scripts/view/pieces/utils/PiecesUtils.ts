import ConfigManager from '../../../common/managers/ConfigManager';
import MathUtil from '../../../common/utils/MathUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PiecesModel, { PiecesPvPCardArea, PiecesTalentType } from '../../../common/models/PiecesModel';
import PveBuildTowerCtrl from '../../pve/ctrl/fight/PveBuildTowerCtrl';
import {
    Common_nameCfg,
    Hero_careerCfg,
    Pieces_discCfg,
    Pieces_fetterCfg,
    Pieces_heroCfg,
    Pieces_talentCfg
    } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-18 16:34:56 
  */
export default class PiecesUtils {

    //卡牌抽取概率  quality-chessLv-number
    static qualityWeightMap: { [quality: number]: { [chessLv: number]: number } } = {};
    //同质量英雄数量  quality-number
    static qualityHeroNum: { [quality: number]: number } = {};

    /**
     * 获取某天赋是否满足解锁条件
     * @param id 
     * @returns 
     */
    static getTalentUnlockState(id: number) {
        let model = ModelManager.get(PiecesModel);
        let cfg = ConfigManager.getItemById(Pieces_talentCfg, id);
        if (cfg.unlock && cfg.unlock.length > 0) {
            for (let i = 0; i < cfg.unlock.length; i++) {
                if (model.talentMap[cfg.unlock[i]] !== 1) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 获取上阵or备战列表
     * @param t 类型 0-上阵 1-备战
     * @returns 
     */
    static getHeroListByType(t: PiecesPvPCardArea) {
        let model = ModelManager.get(PiecesModel);
        let list: icmsg.PiecesHero[] = [];
        for (let key in model.heroMap) {
            let info = model.heroMap[key];
            if (Math.floor(info.pos / 100) == t) {
                list.push(info);
            }
        }
        return list;
    }

    /**
     * 返回指定羁绊类型 已满足的上阵英雄列表
     * @param type 
     */
    static getSatisfyFetterHero(type: number) {
        let list: icmsg.PiecesHero[] = [];
        let fightList: icmsg.PiecesHero[] = this.getHeroListByType(0);
        fightList.forEach(l => {
            let cfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', l.typeId);
            if (cfg.fetter.indexOf(type) !== -1) {
                list.push(l);
            }
        });
        return list;
    }

    /**
     * 获取指定羁绊类型的进度信息  [has,nextNum]
     * @param type 
     */
    static getFetterNumState(type: number) {
        let hasNum = this.getSatisfyFetterHero(type).length;
        let nextNum;
        let fetterCfgs = ConfigManager.getItemsByField(Pieces_fetterCfg, 'fetter_type', type);
        fetterCfgs = [...fetterCfgs].reverse();
        for (let i = 0; i < fetterCfgs.length; i++) {
            if (hasNum >= fetterCfgs[i].required) {
                if (fetterCfgs[i - 1]) {
                    nextNum = fetterCfgs[i - 1].required;
                }
                else {
                    nextNum = fetterCfgs[i].required;
                }
                return [hasNum, nextNum];
            }
        }
        if (!nextNum) {
            return [hasNum, fetterCfgs[fetterCfgs.length - 1].required];
        }
    }

    /**
     * 获取当前激活的羁绊id
     * @param type 
     * @returns 
     */
    static getCurActiveFetterId(type: number) {
        let hasNum = this.getSatisfyFetterHero(type).length;
        let fetterCfgs = ConfigManager.getItemsByField(Pieces_fetterCfg, 'fetter_type', type);
        fetterCfgs = [...fetterCfgs].reverse();
        for (let i = 0; i < fetterCfgs.length; i++) {
            if (hasNum >= fetterCfgs[i].required) {
                return fetterCfgs[i].id;
            }
        }
        return -1;
    }

    /**
     * 获取当前上阵英雄激活的所有羁绊
     */
    static getALLActiveFetterIds() {
        let list = this.getHeroListByType(0);
        let fetterType = [];
        list.forEach(l => {
            let cfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', l.typeId);
            cfg.fetter.forEach(f => {
                if (fetterType.indexOf(f) == -1) {
                    fetterType.push(f);
                }
            })
        });
        let ids = [];
        fetterType.forEach(t => {
            let id = this.getCurActiveFetterId(t);
            if (id !== -1 && ids.indexOf(id) == -1) {
                ids.push(id);
            }
        });
        return ids;
    }

    /**
     * 获取敌方所有生效的羁绊id
     * @param towers 
     * @returns 
     */
    static getEnemyAllActiveFetterIds(towers: PveBuildTowerCtrl[]) {
        let fetterType = [];
        towers.forEach(t => {
            if (t.hero && t.hero.model.info) {
                let cfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', t.hero.model.info.heroType);
                cfg.fetter.forEach(f => {
                    if (fetterType.indexOf(f) == -1) {
                        fetterType.push(f);
                    }
                })
            }
        });
        let ids = [];
        fetterType.forEach(t => {
            let id = this.getCurActiveFetterId(t);
            if (id !== -1 && ids.indexOf(id) == -1) {
                ids.push(id);
            }
        });
        return ids;
    }

    /**
     * 获取抽牌概率  仅权重 非百分比
     * @param quality 
     * @param chessLv 
     * @returns 
     */
    static getRefreshWeight(quality: number, chessLv: number) {
        if (this.qualityWeightMap[quality] && this.qualityWeightMap[quality][chessLv]) {
            return this.qualityWeightMap[quality][chessLv];
        }

        let heroNum = this.qualityHeroNum[quality];
        if (!heroNum && heroNum !== 0) {
            this.qualityHeroNum[quality] = 0;
            let cfgs = ConfigManager.getItemsByField(Pieces_heroCfg, 'color', quality);
            cfgs.forEach(c => {
                if (cc.js.isNumber(c.number) && c.number > 0) {
                    this.qualityHeroNum[quality] += c.number;
                }
            });
            heroNum = this.qualityHeroNum[quality];
        }
        // let c = ConfigManager.getItemByField(Pieces_refreshCfg, 'round', wave);
        let c = ConfigManager.getItemById(Pieces_discCfg, chessLv);
        if (!this.qualityWeightMap[quality]) this.qualityWeightMap[quality] = {};
        this.qualityWeightMap[quality][chessLv] = heroNum * c.weight[quality - 1][1];
        return this.qualityWeightMap[quality][chessLv];
    }

    /**
     * 获取指定位置的英雄数据
     * @param pos 
     * @returns 
     */
    static getHeroInfoByPos(pos: number) {
        let m = ModelManager.get(PiecesModel);
        for (let key in m.heroMap) {
            let info = m.heroMap[key];
            if (info.pos == pos) {
                return info;
            }
        }
        return null;
    }

    /**
     * 上阵操作是否有效
     * @param newHeroId 上阵id
     * @param oldHeroId 原来上阵位置的id
     * @returns 
     */
    static isValidOnBattle(newHeroId: number, oldHeroId: number, showTips: boolean = true) {
        if (!newHeroId) return true;
        let m = ModelManager.get(PiecesModel);
        let list = this.getHeroListByType(0);
        let l = m.heroMap[newHeroId];
        for (let i = 0; i < list.length; i++) {
            if (list[i].heroId !== oldHeroId && list[i].typeId == l.typeId) {
                if (showTips) {
                    gdk.gui.showMessage(gdk.i18n.t("i18n:PVE_TOWER_HAS_SAME_HERO"));
                }
                return false;
            }
        }
        return true;
    }

    /**
     * 英雄购买界面 升星标志
     */
    static upStarState(typeId: number) {
        let m = ModelManager.get(PiecesModel);
        let upList = this.getHeroListByType(0);
        let handCard = this.getHeroListByType(1);
        let refreshList = m.refreshHeroList;
        let hasNum = 0;
        [...upList, ...handCard].forEach(l => {
            if (l.typeId == typeId && l.star == 1) {
                hasNum += 1;
            }
        });
        let refreshNum = 0;
        refreshList.forEach(l => { if (l == typeId) refreshNum += 1; });
        if (refreshNum > 0 && refreshNum + hasNum >= 3) {
            return true;
        }
        else {
            return false;
        }
    }

    // 随机名字
    static randomHandle(gender: number = 0) {
        let val: string = '';
        let i = gender * 3 + 1;
        let n = i + 3;
        for (; i < n; i++) {
            let c = ConfigManager.getItemById(Common_nameCfg, i);
            if (Math.random() <= c.rate) {
                let a = c.val.split(',');
                val += a[MathUtil.rnd(0, a.length - 1)];
            }
        }
        return val
    }

    /**
     * 返回天赋 生效参数
     * @param type 
     * @returns 
     */
    static getTalentInfoByType(type: PiecesTalentType) {
        let m = ModelManager.get(PiecesModel);
        let args = [];
        for (let key in m.talentMap) {
            if (m.talentMap[key] >= 1) {
                let cfg = ConfigManager.getItemById(Pieces_talentCfg, parseInt(key));
                if (cfg[`type${type}`]) {
                    args.push(cfg[`type${type}`][0]);
                }
            }
        }
        return args;
    }

    /**返回职业id */
    static getCareerIdByHeroType(id: number) {
        let m = ModelManager.get(PiecesModel);
        for (let key in m.heroMap) {
            if (m.heroMap[key].typeId == id) {
                return m.heroMap[key].line;
            }
        }
        let cfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', id);
        return ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', cfg.hero_id, { line: cfg.line }).career_id;
    }
}
