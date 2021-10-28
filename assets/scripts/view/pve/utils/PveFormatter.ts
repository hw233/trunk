/** 
 * 战斗属性格式化
 * @Author: sthoo.huang  
 * @Date: 2021-08-26 17:13:32 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-26 17:15:03
 */

class PveFormatter {

    /**
     * 百分比数值格式化
     * @param v 
     * @returns 
     */
    format(v: number) {
        let t = Math.round(v * 10000);
        let r = t / 100;
        if (t % 100 == 0) {
            return r.toFixed(0);
        }
        return r.toFixed(2);
    }
}

export default gdk.Tool.getSingleton(PveFormatter);