export interface ActType {
    /**活动配置id */
    id: number,
    /**活动名称 */
    name: string,
    /**活动实时id */
    actvityId?: number,
    /**活动名称 */
    icon: string,
    /**格式 2019-3-29 10:00:00 */
    startTime?: string,
    endTime?: string,
    /**活动状态 0:未开始 1:准备开始 2:已开始 3:已结束 */
    state: number,
    /**从上往下 第几排 从0开始*/
    row: number,
    /**位置顺序, 从左往右 升序排序 */
    col: number,
    /**等级限制 */
    level: number,
}

let ActivityConfig = {
    _config: null,

    // config: [
    //     { id: 101, icon: "hd_jinbibaozang", name: "金币宝藏", startTime: "", endTime: "", state: 2, row: 0, col: 0, level: 10 },
    //     { id: 102, icon: "hd_shouchonghaoli", name: "首冲豪礼", startTime: "", endTime: "", state: 2, row: 1, col: 0, level: 10 },
    //     { id: 107, icon: "hd_vipfuli", name: "vip福利", startTime: "", endTime: "", state: 2, row: 2, col: 0, level: 20 },
    // ],
    config: [],

    getConfigById(id: number = -1) {
        if (id < 0) {
            return
        }
        if (!this._config) {
            this._config = {}
            for (let index = 0; index < this.config.length; index++) {
                const element = this.config[index];
                this._config[element.id] = element
            }
        }
        return this._config[id]
    }
}
export default ActivityConfig