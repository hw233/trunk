import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import GlobalUtil from '../../utils/GlobalUtil';
import GuideModel from '../../../guide/model/GuideModel';
import GuideUtil from '../../utils/GuideUtil';
import ModelManager from '../ModelManager';

/** 
 * @Description: 引导数据通信
 * @Author: weiliang.huang
 * @Date: 2019-05-05 14:16:41 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 10:38:10
*/


export default class GuideController extends BaseController {

    model: GuideModel = null;

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.GuideGroupListRsp.MsgType, this._onGuideIdsRsp],
            [icmsg.GuideGroupSaveRsp.MsgType, this._onGuideGroupSaveRsp],
        ];
    }

    onStart() {
        this.model = ModelManager.get(GuideModel);
    }

    onEnd() {
        this.model = null;
    }

    _onGuideIdsRsp(data: icmsg.GuideGroupListRsp) {
        this.model.doneIds = {};
        for (let index = 0; index < data.guideList.length; index++) {
            const id = data.guideList[index];
            if (CC_DEBUG && GuideUtil.ignoreDoneIds[id]) {
                continue;
            }
            this.model.doneIds[id] = true;
        }
        this.model.taskId = data.taskId;
    }

    _onGuideGroupSaveRsp(data: icmsg.GuideGroupSaveRsp) {
        if (CC_DEBUG) {
            let v = GlobalUtil.getUrlValue('ignoredgg');    // 全称：ignore_done_guide_group
            if (v && v.split(',').some(id => parseInt(id) == data.groupId)) {
                return;
            }
        }
        this.model.doneIds[data.groupId] = true;
        // 清除已完成组的激活条件引导
        let acfgs = this.model._activeCfgs;
        for (let con in acfgs) {
            let cfgs = acfgs[con];
            if (!cfgs || cfgs.length == 0) {
                delete acfgs[con];
            } else {
                // 遍历是否为相同组
                for (let i = cfgs.length - 1; i >= 0; i--) {
                    if (cfgs[i].group == data.groupId) {
                        cfgs.splice(i, 1);
                    }
                }
                if (cfgs.length == 0) {
                    delete acfgs[con];
                }
            }
        }
    }
} 