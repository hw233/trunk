import GlobalUtil from './GlobalUtil';

/**
 * 数学相关的工具函数
 * @Author: sthoo.huang
 * @Date: 2019-03-19 10:17:12
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-07-29 15:37:56
 */

class MathUtilClass {
    /**
     * 最新的随机种子
     */
    private _seed: number;
    get seed() {
        return this._seed;
    }

    random(seed?: number) {
        if (seed === void 0) {
            // 系统提供的随机函数
            return Math.random();
        }
        this._seed = (seed * 9301 + 49297) % 233280;
        return this._seed / 233280.0;
    }

    /**
     * 返回n~m之间的随机数
     * @param n 最小值
     * @param m 最大值
     * @param seed 随机种子
     */
    rnd(n: number, m: number, seed?: number): number {
        if (seed !== void 0) {
            // 伪随机
            m = m || 1;
            n = n || 0;
        }
        return Math.floor(this.random(seed) * (m - n + 1) + n);
    }

    /**
     * 测试是否满足概率
     * @param v 0~1
     * @param seed 随机种子
     */
    rate(v: number, seed?: number): boolean {
        v *= 100;
        if (v <= 0) {
            return false;
        } else if (v >= 100) {
            return true;
        }
        return this.rnd(0, 100, seed) <= v;
    }

    /**
     * 随机打乱数组排序（洗牌算法）
     * @param arr 
     * @param seed 随机种子
     */
    shuffle(arr: any[], seed?: number) {
        let i = arr.length;
        if (i <= 1) return arr;
        this._seed = seed;
        while (i) {
            let j = Math.floor(this.random(this._seed) * i--);
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        return arr;
    }

    /**
     * 计算a至b点的距离
     * @param a 
     * @param b 
     */
    distance(a: cc.Vec2, b: cc.Vec2) {
        let xx: number = a.x - b.x;
        let yy: number = a.y - b.y;
        return Math.sqrt(xx * xx + yy * yy);
    }

    minArrayNum(list: number[]): number {
        if (list.length == 0) {
            return 0;
        }
        GlobalUtil.sortArray(list, (a, b) => {
            return a - b;
        })
        return list[0];
    }

    maxArrayNum(list: number[]): number {
        if (list.length == 0) {
            return 0;
        }
        GlobalUtil.sortArray(list, (a, b) => {
            return b - a;
        })
        return list[0];
    }

    /**
     * 判断p1至p2的直线是否与圆心为c半径为cr的圆相交
     * @param p1
     * @param p2
     * @param c
     * @param cr
     */
    intersect(p1: cc.Vec2, p2: cc.Vec2, c: cc.Vec2, cr: number): boolean {
        let r = cr * cr;
        if ((p1.x - c.x) * (p1.x - c.x) + (p1.y - c.y) * (p1.y - c.y) <= r ||
            (p2.x - c.x) * (p2.x - c.x) + (p2.y - c.y) * (p2.y - c.y) <= r) {
            // 至少有一个点在圆内
            return true;
        } else {
            // 两个点都在圆外
            let A = p1.y - p2.y;
            let B = p2.x - p1.x;
            let C = p1.x * p2.y - p2.x * p1.y;
            let dist1 = A * c.x + B * c.y + C;
            let dist2 = (A * A + B * B) * r;
            if (dist1 * dist1 > dist2) {
                // 圆心到直线p1p2的距离大于半径
                return false;
            }
            if ((c.x - p1.x) * (p2.x - p1.x) + (c.y - p1.y) * (p2.y - p1.y) > 0 &&
                (c.x - p2.x) * (p1.x - p2.x) + (c.y - p2.y) * (p1.y - p2.y) > 0) {
                // 余弦为正，则是锐角，一定相交 
                return true;
            }
        }
        return false;
    }
};

export default gdk.Tool.getSingleton(MathUtilClass);