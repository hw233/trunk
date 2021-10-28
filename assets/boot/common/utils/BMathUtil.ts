
/**
 * 数学相关的工具函数
 * @Author: sthoo.huang
 * @Date: 2019-03-19 10:17:12
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-07 16:28:53
 */

class MathUtilClass {

    /**
     * 返回n~m之间的随机数
     * @param n 最小值
     * @param m 最大值
     */
    rnd(n: number, m: number): number {
        return Math.floor(Math.random() * (m - n + 1) + n);
    }

    /**
     * 随机打乱数组排序（洗牌算法）
     * @param arr 
     */
    shuffle(arr: any[]) {
        let i = arr.length;
        if (i <= 1) return arr;
        while (i) {
            let j = Math.floor(Math.random() * i--);
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        return arr;
    }
};

const BMathUtil = gdk.Tool.getSingleton(MathUtilClass);
export default BMathUtil;