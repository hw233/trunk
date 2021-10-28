import BYModel from '../model/BYModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import {
    AttrCfg,
    BarracksCfg,
    HeroCfg,
    TechCfg
    } from '../../../a/config';
import { AttrType } from '../../../common/utils/EquipUtils';


export const KeyAttr = ["hp_g", "atk_g", "def_g", "hit_g", "dodge_g", "dmg_add", "dmg_res"]

/** 
  * @Description: 兵营工具类
  * @Author: weiliang.huang  
  * @Date: 2019-05-06 17:19:13 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-19 16:51:30
*/

export default class BYUtils {

    static get model(): BYModel {
        return ModelManager.get(BYModel)
    }

    // 士兵适用的英雄表
    static adaptHeros = null;


    static attrMap = null
    /**
     * 获取某个科技的开启状态
     * @param sId 科技id
     */
    // static getLockState(sId) {
    //     let byInfos = this.model.byInfos
    //     let byTechInfos = this.model.byTechInfos
    //     let cfg = ConfigManager.getItemById(Barracks_scienceCfg, sId)
    //     let ifOpen = true
    //     for (let index = 0; index < 4; index++) {
    //         let _key = `require_${index + 1}`
    //         if (!cfg) {
    //             ifOpen = false
    //             break
    //         }
    //         let openInfo = cfg[_key]
    //         if (openInfo && openInfo.length > 0) {
    //             let openType = openInfo[0]
    //             let openId = openInfo[1]
    //             let openLv = openInfo[2]
    //             if (openType == 2) {
    //                 let info: BarrackInfo = byInfos[openId]
    //                 if (!info || info.level < openLv) {
    //                     ifOpen = false
    //                     break
    //                 }
    //             } else {
    //                 let info: BarrackTech = byTechInfos[openId]
    //                 if (!info || info.level < openLv) {
    //                     ifOpen = false
    //                     break
    //                 }
    //             }
    //         }
    //     }
    //     return ifOpen
    // }

    // /**获取科技的解锁条件描述*/
    // static getScienceRequire(sId) {
    //     let byInfos = this.model.byInfos
    //     let byTechInfos = this.model.byTechInfos
    //     let cfg = ConfigManager.getItemById(Barracks_scienceCfg, sId)

    //     let list = []
    //     for (let index = 0; index < 4; index++) {
    //         let _key = `require_${index + 1}`
    //         let openInfo = cfg[_key]
    //         if (openInfo && openInfo.length > 0) {
    //             let openType = openInfo[0]
    //             let openId = openInfo[1]
    //             let openLv = openInfo[2]
    //             let ifOpen = true
    //             let name = ""
    //             if (openType == 2) {
    //                 let bCfg = ConfigManager.getItemByField(BarracksCfg, "type", openId, null)
    //                 name = bCfg.name
    //                 let info: BarrackInfo = byInfos[openId]
    //                 if (!info || info.level < openLv) {
    //                     ifOpen = false
    //                 }
    //             } else {
    //                 let sCfg = ConfigManager.getItemById(Barracks_scienceCfg, openId)
    //                 name = sCfg.name
    //                 let info: BarrackTech = byTechInfos[openId]
    //                 if (!info || info.level < openLv) {
    //                     ifOpen = false
    //                 }
    //             }
    //             // 这里用自己拼接的方法拼描述
    //             let openDesc: string = gdk.i18n.t("i18n:TECH_OPEN_DESC")
    //             openDesc = openDesc.replace("@name", name)
    //             openDesc = openDesc.replace("@level", openLv)
    //             list.push({ desc: openDesc, state: ifOpen })
    //         }
    //     }

    //     return list
    // }

    /**初始化适用英雄表 */
    static _initAdaptHeros() {
        if (this.adaptHeros) {
            return
        }
        this.adaptHeros = {}
        let list = ConfigManager.getItems(HeroCfg)
        for (let index = 0; index < list.length; index++) {
            let hero = list[index];
            let ids = hero.soldier_id
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                if (!this.adaptHeros[id]) {
                    this.adaptHeros[id] = []
                }
                this.adaptHeros[id].push(hero.id)
            }
        }
    }

    /**获取某个士兵的适用英雄 */
    static getAdaptHeros(soldierId: number): number[] {
        this._initAdaptHeros()

        return this.adaptHeros[soldierId] || []
    }

    /**是否拥有某种士兵 */
    static hasSoldier(soldierId): boolean {
        let soldiers = this.model.soldiers
        return !!soldiers[soldierId]
    }

    // /**获取科技增加的士兵属性汇总
    //  * @param utype 兵营类型
    // */
    // static getBarrackTeachAddAttrSum(utype: number) {
    //     let byTechInfos = this.model.byTechInfos
    //     let keys = ["atk_g", "hp_g", "def_g", "atk_r", "hp_r", "def_r"]
    //     let attInfos = {
    //         "atk_g": 0,
    //         "hp_g": 0,
    //         "def_g": 0,
    //         "atk_r": 0,
    //         "hp_r": 0,
    //         "def_r": 0,
    //     }
    //     // 遍历当前已开启的科技
    //     for (const key in byTechInfos) {
    //         let info: BarrackTech = byTechInfos[key]    // 科技等级信息
    //         let id = parseInt(key)  // 科技id
    //         let techCfg = ConfigManager.getItemById(Barracks_scienceCfg, id)    // 科技描述信息

    //         let byCfg = ConfigManager.getItemById(Barracks_practiceCfg, techCfg.practice_lv)// 所属兵营信息
    //         if (utype == byCfg.barracks_id) {
    //             let attCfg = ConfigManager.getItemByField(Barracks_science_lvCfg, "science_id", id, { science_lv: info.level }) // 属性信息
    //             if (attCfg) {
    //                 for (let index = 0; index < keys.length; index++) {
    //                     const _key = keys[index];
    //                     attInfos[_key] += attCfg[_key]
    //                 }
    //             }
    //         }
    //     }
    //     return attInfos
    // }

    /**获取某个士兵的面板属性 
     * 获取白字属性:士兵等级属性
     * 获取绿字属性:士兵额外属性
    */
    // static getSoldierAttr(id: number, level: number = 1) {
    //     // 士兵基础信息
    //     let cfg = ConfigManager.getItemById(SoldierCfg, id)
    //     // 兵营信息
    //     let bCfg = ConfigManager.getItemByField(BarracksCfg, "type", (100 + cfg.type))
    //     //科技增加的士兵属性
    //     let attInfos = this.getBarrackTeachAddAttrSum(bCfg.type)
    //     // 属性值,按顺序为攻击/生命/防御
    //     let res = []
    //     let keys = [["atk_g", "atk_r"], ["hp_g", "hp_r"], ["def_g", "def_r"]]
    //     for (let index = 0; index < keys.length; index++) {
    //         const temp = keys[index];
    //         let key1 = temp[0]
    //         let key2 = temp[1]
    //         let wAtt = attInfos[key1]  // 白字属性
    //         let extPer = attInfos[key2] / 10000
    //         res.push([wAtt, extPer])
    //     }
    //     return res
    // }

    // /**获取士兵技能加成描述 
    //  * @param cfg 科技等级配置
    //  * @param id:士兵id
    //  * @param level:士兵等级
    // */
    // static getSoldierDesc(cfg: Barracks_science_lvCfg, id, level: number = 1) {
    //     if (level == 0) {
    //         level = 1
    //     }
    //     let lvCfg = ConfigManager.getItemByField(Barracks_science_lvCfg, "soldier_id", id, { science_lv: level })
    //     let desc = cfg.science_desc
    //     let resStr = desc
    //     let mat = desc.match(/{\w+}/g)
    //     if (!mat) {
    //         return resStr;
    //     }
    //     for (let index = 0; index < mat.length; index++) {
    //         const str = mat[index];
    //         let key = str.replace(/[^a-z_A-Z]/g, "")
    //         let val = lvCfg[key]
    //         let text = `${val / 100}%`
    //         if (key.indexOf("_r") <= 0) {
    //             text = `${val}`
    //         }
    //         resStr = resStr.replace(str, text)
    //     }

    //     return resStr
    // }

    // /**
    //  * 根据科技id获取图标路径
    //  * @param sId 
    //  */
    // static getTechIcon(sId: number): string {
    //     let cfg = ConfigManager.getItemById(Barracks_scienceCfg, sId)
    //     if (!cfg) {
    //         return ""
    //     }
    //     let path = `icon/skill/${cfg.science_skin}`
    //     return path
    // }


    // static getScienceMaxLv(science_id) {
    //     let list = ConfigManager.getItemsByField(Barracks_science_lvCfg, "science_id", science_id)
    //     return list.length;
    // }

    //适用英雄排序
    static sortHeroId(heroList: number[]): number[] {
        let temHeroList = heroList.concat();
        let list = [];
        let tem = [];
        temHeroList.sort((h1, h2) => {
            let cfg1 = ConfigManager.getItemById(HeroCfg, h1);
            let cfg2 = ConfigManager.getItemById(HeroCfg, h2);
            return cfg2.defaultColor - cfg1.defaultColor
        })

        for (let i = temHeroList.length - 1; i >= 0; i--) {
            if (HeroUtils.getHeroInfoById(temHeroList[i])) {
                tem.push(temHeroList[i]);
                temHeroList.splice(i, 1);
            }
        }

        tem.sort((h1, h2) => {
            let cfg1 = ConfigManager.getItemById(HeroCfg, h1);
            let cfg2 = ConfigManager.getItemById(HeroCfg, h2);
            if (cfg1.defaultColor == cfg2.defaultColor) {
                let power1 = HeroUtils.getHeroInfoById(h1).power
                let power2 = HeroUtils.getHeroInfoById(h2).power
                return power2 - power1
            }
            return cfg2.defaultColor - cfg1.defaultColor
        })

        list = tem.concat(temHeroList);
        return list;
    }


    /**获取兵营技能描述 
     * @param type 兵营类型
     * @param level:技能等级
    */
    static getBarracksDesc(type, level) {
        if (level == 0) {
            level = 1
        }
        let cfg = ConfigManager.getItemByField(BarracksCfg, "type", type, { barracks_lv: level })
        let desc = cfg.desc
        let resStr = desc
        let mat = desc.match(/{\w+}/g)
        if (!mat) {
            return resStr;
        }
        for (let index = 0; index < mat.length; index++) {
            const str = mat[index];
            let key = str.replace(/[^a-z_A-Z]/g, "")
            let val = cfg[key]
            let attr = ConfigManager.getItemById(AttrCfg, key)
            let text = `${val}`
            if (attr.type == "r") {
                text = `${val / 100}%`
            }
            resStr = resStr.replace(str, text)
        }
        return resStr
    }



    /**获取兵营技能描述 
    * @param type 兵营类型
    * @param curLv:累计的等级
    */
    static getTotalAttr(type, curLv) {
        let cfgs = ConfigManager.getItemsByField(BarracksCfg, "type", type)
        //初始化
        this.attrMap = {}
        for (let index = 0; index < KeyAttr.length; index++) {
            let key = KeyAttr[index]
            let attr = ConfigManager.getItemById(AttrCfg, key)
            let newInfo: AttrType = {
                name: attr.barracks_type,
                value: 0,
                type: attr.type,
            }
            this.attrMap[key] = newInfo
        }
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].barracks_lv <= curLv) {
                for (let index = 0; index < KeyAttr.length; index++) {
                    let key = KeyAttr[index]
                    if (cfgs[i][key]) {
                        if (this.attrMap[key]) {
                            let info: AttrType = this.attrMap[key]
                            info.value += cfgs[i][key]
                            this.attrMap[key] = info
                        } else {
                            let attr = ConfigManager.getItemById(AttrCfg, key)
                            let newInfo: AttrType = {
                                name: attr.barracks_type,
                                value: cfgs[i][key],
                                type: attr.type,
                            }
                            this.attrMap[key] = newInfo
                        }
                        //break
                    }
                }
            }
        }
        return this.attrMap
    }

    static getKeyName(cfg) {
        for (let index = 0; index < KeyAttr.length; index++) {
            if (cfg[KeyAttr[index]] && cfg[KeyAttr[index]] > 0) {
                return KeyAttr[index]
            }
        }
        return ""
    }

    /**获取士兵科技总属性 */
    static getTechTotalVBylv(type: number, lv: number, key: string) {
        let cfgs = ConfigManager.getItems(TechCfg, (cfg: TechCfg) => { if (cfg.type == type && cfg.lv <= lv) return true; });
        let v = 0;
        cfgs.forEach(c => {
            v += c[key];
        });
        return v;
    }

}