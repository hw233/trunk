/**
 * 按钮音效定义
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-08-15 13:59:12
 */
enum ButtonSoundId {
  page = 'sound_page',
  click = 'sound_click',
  fightStart = 'sound_start',
  success = "sound_success",//操作完成  角色界面
  levelup = 'sound_levelup',
  common = "sound_common",//普通物品
  rare = "sound_rare",//稀有物品
  system = "sound_system",//新功能激活
  animation = "sound_animation",//抽卡特效音乐
  animation_2 = "sound_animation_2",//抽卡跳过特效
  result = "sound_result",//高级英雄
  fightFail = "sound_fightFail",//战斗失败
  fightWin = "sound_fightWin",//战斗胜利
  pool = "sound_pool", //卡池切换
  income = "sound_income",//获得收益
  invalid = "sound_invalid",//操作无效
  risingStar = "sound_rising star",//升星，转职
  advance = "sound_advance",//进阶
  popup = "sound_popup",//信息弹窗
  event = "sound_event",//打开活动页面
  equip = "sound_equip",//穿戴装备
  equipStrengthen = "sound_equip_strengthen",//装备强化
  building = "sound_building",//点击建筑
  levelupHero = "sound_levelup_hero",//英雄升级成功
  attribute = "sound_attribute",//附魔
  group_buff = "group_buff",//阵营效果音效
};

gdk.ButtonSoundId.mixins(ButtonSoundId);

export default ButtonSoundId;