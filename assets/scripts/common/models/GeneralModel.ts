/** 
  * @Description: 指挥官数据/外观数据
  * @Author: weiliang.huang  
  * @Date: 2019-05-14 11:31:07 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-02-26 13:37:13
*/
export default class GeneralModel {
  generalInfo: icmsg.GeneralInfo = null; // 指挥官数据
  weaponList: number[] = []; //已拥有神器列表  排序: 战力 小-->大

  curUseWeapon: number; // 当前使用的神器id   <数值监听使用>
  preUseWeapon: number; // 上一次使用的神器id <动画需要>
  newWeapon: number; // 新获得神器id <动画需要>

  oldWaponLvCfgId: number;
  waponLvCfgId: number; //神器lv配置id  
  weaponLv: number;//神器lv

  oldWeaponRefineLv: number; //神器精炼lv
  weaponRefineLv: number; //神器精炼lv
}