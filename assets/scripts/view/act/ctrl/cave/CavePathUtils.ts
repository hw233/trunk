import ActivityModel from '../../model/ActivityModel';
import ModelManager from '../../../../common/managers/ModelManager';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-07 15:03:29 
  */
export default class CavePathUtils {
    pointIds: number[] = [];
    startId: number;
    endId: number;
    openList: CavePathPoint[] = [];
    closeList: CavePathPoint[] = [];
    points: { [pos: string]: CavePathPoint } = {};
    endPoint: CavePathPoint;

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }
    constructor() {
    }

    init(s, pointIds, e) {
        [this.startId, this.pointIds, this.endId] = [s, pointIds, e];
        this.pointIds.forEach(id => {
            let info = this.actModel.cavePointMapByPlate[id];
            let obj: CavePathPoint = {
                id: id,
                pos: info.position,
                g: 0,
                h: 0,
                inCloseList: false,
                inOpenList: false,
                parent: null
            };
            if (id == this.startId) {
                obj.inOpenList = true;
                this.openList.push(obj);
            }
            if (id == this.endId) {
                this.endPoint = obj;
            }
            this.points[`${obj.pos.x}-${obj.pos.y}`] = obj;
        });
    }

    serachPath() {
        if (this.startId == this.endId) return [this.startId, this.endId];
        let b = true;
        let finalPoint: CavePathPoint;
        while (b) {
            if (this.openList.length <= 0) return [];
            let point = this.openList.shift(); //从openList中取出最小f值的点
            point.inOpenList = false;
            this.closeList.push(point); //放入closeList
            point.inCloseList = true;
            let nearPoints = this.getNearPoints(point); //获取当前处理点的 相邻点
            nearPoints.forEach((n, idx) => {
                if (!n || n.inCloseList) return;
                if (n.inOpenList) {
                    let g = this.getGValue(n, idx, point);
                    if (g < n.g) {  //已经在openlist 且g值更优
                        n.parent = point;
                        n.g = g;
                    }
                }
                else {
                    n.inOpenList = true;
                    n.parent = point;
                    n.g = this.getGValue(n, idx);
                    n.h = this.getHValue(n)
                    this.openList.push(n);
                    if (n.id == this.endId) {
                        b = false;
                        finalPoint = n;
                    }
                }
            });
            b && this.sortOpenList();
        }
        let path: number[] = [];
        if (finalPoint) {
            path.push(finalPoint.id);
            while (finalPoint.parent) {
                path.push(finalPoint.parent.id);
                finalPoint = finalPoint.parent;
            }
        }
        return path.reverse();
    }

    getNearPoints(p: CavePathPoint) {
        let [x, y] = [p.pos.x, p.pos.y];
        return [
            this.points[`${x - 1}-${y - 1}`], //0-左上
            this.points[`${x + 1}-${y - 1}`], //1-右上
            this.points[`${x - 2}-${y}`], //2-左
            this.points[`${x + 2}-${y}`], //3-右
            this.points[`${x - 1}-${y + 1}`], //4-左下
            this.points[`${x + 1}-${y + 1}`], //5-右下
        ]
    }

    sortOpenList() {
        this.openList.sort((a, b) => { return this.getFValue(a) - this.getFValue(b); })
    }

    getGValue(p: CavePathPoint, direction: number, preP?: CavePathPoint): number {
        let d = [2, 3].indexOf(direction) !== -1 ? 2 : 1;
        if (preP) {
            return preP.g + d;
        }
        else {
            return p.parent.g + d;
        }
    }

    getHValue(p: CavePathPoint): number {
        let dx = Math.abs(this.endPoint.pos.x - p.pos.x);
        let dy = Math.abs(this.endPoint.pos.y - p.pos.y);
        let D = 2;
        let D2 = 1;
        return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)
    }

    getFValue(p: CavePathPoint): number {
        return p.g + p.h;
    }
}

/**路径点结构 */
type CavePathPoint = {
    id: number,
    pos: cc.Vec2 | cc.Vec3,
    g: number,
    h: number,
    inCloseList: boolean,
    inOpenList: boolean,
    parent: CavePathPoint
}
