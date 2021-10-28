/** 
  * @Description:多货币类面板
  * @Author: weiliang.huang  
  * @Date: 2019-06-21 15:45:09 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-11 18:18:20
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/StoreMoneyCtrl")
export default class StoreMoneyCtrl extends cc.Component {

    @property(gdk.List)
    list: gdk.List = null

    start() {

    }

    /**更新金钱类型列表 */
    updateMoneys(typeList: number[] = []) {
        this.list.datas = typeList
    }
}
