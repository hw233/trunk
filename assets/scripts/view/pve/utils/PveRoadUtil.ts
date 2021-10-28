import MathUtil from '../../../common/utils/MathUtil';

/** 
 * 路线相关的方法
 * @Author: sthoo.huang  
 * @Date: 2019-06-19 19:20:25 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-05-12 17:58:42
 */

class PveRoadUtil {

    /**
     * 得到路线的总长度
     * @param road 
     * @param p 
     */
    getDistance(road: cc.Vec2[], p?: cc.Vec2): number {
        if (road && road.length) {
            (p === void 0) && (p = road[0]);
            let d: number = 0;
            for (let i = 0, n = road.length; i < n; i++) {
                d += MathUtil.distance(p, road[i]);
                p = road[i];
            }
            return Math.ceil(d);
        }
        return 0;
    }

    /**
     * 获得距离起点指定距离剩余的路线
     * @param road 路线点
     * @param v 距离百分比
     * @param l 路线的总距离
     */
    getRoadBy(road: cc.Vec2[], v: number, l: number): cc.Vec2[] {
        if (v <= 0) {
            // 起点
            return road.concat();
        } else if (v >= 1) {
            // 终点
            return road.slice(-1);
        } else {
            let c: number = Math.ceil(v * l);
            let p: cc.Vec2 = road[0];
            let i: number = 1;
            for (; i < road.length; i++) {
                let r: number = MathUtil.distance(p, road[i]);
                if (r > c) {
                    // 已经找到符合要求的线段，计算线段中要求的坐标
                    p = cc.v2(
                        p.x + (road[i].x - p.x) / r * c / r,
                        p.y + (road[i].y - p.y) / r * c / r
                    );
                    p.x = Math.round(p.x);
                    p.y = Math.round(p.y);
                    // 生成路线坐标点数组
                    let ret = [p];
                    for (let j = i; j < road.length; j++) {
                        ret.push(road[j]);
                    }
                    return ret;
                }
                c -= r;
                p = road[i];
            }
        }
        return road.slice(-1);
    }

    /**
     * 获得离起点最近的坐标到终点的路线
     * @param p 
     * @param r 
     */
    getShortestRoadBy(p: cc.Vec2, r: cc.Vec2[]): cc.Vec2[] {
        let c = Number.MAX_VALUE;
        let b = 0;
        for (let i = 0, n = r.length; i < n; i++) {
            let d = MathUtil.distance(p, r[i]);
            if (d < c) {
                c = d;
                b = i;
            }
        }
        return r.slice(b);
    }
}

export default gdk.Tool.getSingleton(PveRoadUtil);