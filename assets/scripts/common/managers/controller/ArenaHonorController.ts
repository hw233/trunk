import ArenaHonorModel from '../../models/ArenaHonorModel';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ModelManager from '../ModelManager';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-07 20:01:09 
  */
export default class ArenaHonorController extends BaseController {
    model: ArenaHonorModel = null

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.ArenaHonorGuildRsp.MsgType, this._onArenaHonorGuildRsp, this],
        ];
    }

    onStart() {
        this.model = ModelManager.get(ArenaHonorModel)
    }

    onEnd() {
        this.model = null
    }

    /**荣耀巅峰赛 4个公会信息 */
    _onArenaHonorGuildRsp(resp: icmsg.ArenaHonorGuildRsp) {
        this.model.playersInfoMap = {};
        this.model.guildNameMap = {};
        resp.guilds.forEach(g => {
            g.players.forEach(p => {
                this.model.playersInfoMap[p.id] = p;
            })
            this.model.guildNameMap[g.id] = g.name;
        })
    }
}
