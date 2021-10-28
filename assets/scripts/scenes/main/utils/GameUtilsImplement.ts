import * as config from '../../../a/config';
import ActivityController from '../../../common/managers/controller/ActivityController';
import AdventureController from '../../../common/managers/controller/AdventureController';
import ArenaController from '../../../common/managers/controller/ArenaController';
import ArenaHonorController from '../../../common/managers/controller/ArenaHonorController';
import BagController from '../../../common/managers/controller/BagController';
import BaseController from '../../../common/core/BaseController';
import BYController from '../../../common/managers/controller/BYController';
import ChampionController from '../../../common/managers/controller/ChampionController';
import ChatController from '../../../common/managers/controller/ChatController';
import CombineController from '../../../common/managers/controller/CombineController';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyController from '../../../common/managers/controller/CopyController';
import CostumeController from '../../../common/managers/controller/CostumeController';
import EnergyController from '../../../common/managers/controller/EnergyController';
import EnterMainImplement from './impl/EnterMainImplement';
import EquipController from '../../../common/managers/controller/EquipController';
import FootHoldController from '../../../common/managers/controller/FootHoldController';
import FriendController from '../../../common/managers/controller/FriendController';
import GeneralController from '../../../common/managers/controller/GeneralController';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuardianController from '../../../common/managers/controller/GuardianController';
import GuideController from '../../../common/managers/controller/GuideController';
import GuideGM from '../../../guide/GuideGM';
import GuideUtil from '../../../common/utils/GuideUtil';
import GuildController from '../../../common/managers/controller/GuildController';
import HeroController from '../../../common/managers/controller/HeroController';
import InitServerRequestImplement from './impl/InitServerRequestImplement';
import InstanceController from '../../../common/managers/controller/InstanceController';
import LoadGameResourceImplement from './impl/LoadGameResourceImplement';
import LoginController from '../../../common/managers/controller/LoginController';
import LotteryController from '../../../common/managers/controller/LotteryController';
import MailController from '../../../common/managers/controller/MailController';
import MercenaryControll from '../../../common/managers/controller/MercenaryControll';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureController from '../../../common/managers/controller/NewAdventureController';
import OnlineGrowController from '../../../common/managers/controller/OnlineGrowController';
import PiecesController from '../../../common/managers/controller/PiecesController';
import PreloadGameResourceImplement from './impl/PreloadGameResourceImplement';
import ReconnectImplement from './impl/ReconnectImplement';
import RelicController from '../../../common/managers/controller/RelicController';
import ResonatingControll from '../../../common/managers/controller/ResonatingControll';
import RoleController from '../../../common/managers/controller/RoleController';
import RoleModel from '../../../common/models/RoleModel';
import RuneController from '../../../common/managers/controller/RuneController';
import SdkTool from '../../../sdk/SdkTool';
import ServerController from '../../../common/managers/controller/ServerController';
import SignController from '../../../common/managers/controller/SignController';
import SoldierController from '../../../common/managers/controller/SoldierController';
import StoreController from '../../../common/managers/controller/StoreController';
import TaskController from '../../../common/managers/controller/TaskController';
/**
 * 游戏场景生命管理工具实现类
 * @Author: sthoo.huang
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-20 01:58:06
 * @Last Modified time: 2021-08-25 17:24:51
 */
const GameUtils = iclib.GameUtils;
cc.js.mixin(GameUtils, {

    // 初始化游戏配置
    initGameConfig(thiz: gdk.fsm.FsmStateAction, cb: Function): void {

        // 完成处理函数
        let onComplete = (json?: any) => {

            // 初始化配置
            ConfigManager.init(config, json);

            // 引导外部参数
            if (CC_DEBUG) {
                GuideUtil.isHideGuide = GlobalUtil.getUrlValue('guide') == '0';
                GuideUtil.isLog = GlobalUtil.getUrlValue('guideLog') == '1';
                let igds = GlobalUtil.getUrlValue('ignoreGuideDoneIds');
                if (!!igds) {
                    igds.split(",").forEach(v => {
                        GuideUtil.ignoreDoneIds[v] = true;
                    });
                }
            }

            // 测试接口
            CC_DEBUG && (() => {
                window['msg'] = icmsg;
                window['net'] = NetManager;
                GuideGM.init();
            })();

            // 回调
            cb && cb();
        };

        // 是否已经初始化完成
        if (ConfigManager.initlized > 1) {
            onComplete();
        } else if (cc.sys.isNative) {
            // 原生模式
            let jurl = `assets/data.txt`;
            let text = jsb.fileUtils.getStringFromFile(jurl);
            if (text) {
                onComplete(JSON.parse(text));
            }
        } else if (CC_DEBUG && GlobalUtil.getUrlValue('config')) {
            // 使用外部配置
            onComplete();
        } else {
            // 其它版本
            let remote = '';
            if (CC_DEV && !CC_BUILD) {
                // 本地开发版，使用8001上的配置
                remote = 'http://192.168.3.182:8001/web-mobile/';
            }
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                // 微信小游戏
                remote = `${cc.assetManager.downloader['_remoteServerAddress']}`;
                remote = `${remote}remote/`;
            }
            if (remote == '') {
                remote = GlobalUtil.getUrlRelativePath();
            }
            let url = remote + `data.${iclib.verjson.vers.data}.txt`;
            let param = '';
            let loadConfig = () => {
                if (!thiz.active) return;
                GlobalUtil.httpGet(url + param, (err: any, content: string) => {
                    if (thiz.active) {
                        // 是否已经初始化完成
                        if (ConfigManager.initlized > 1) {
                            onComplete();
                            return;
                        }
                        // 是否存在异常
                        if (err || !content) {
                            cc.error('加载配置文件异常：', url, err);
                            param = '?t=' + Date.now();
                            gdk.Timer.callLater(this, loadConfig);
                            return;
                        }
                        onComplete(JSON.parse(content));
                    }
                }, null, 'none');
            };
            loadConfig();
        }
    },

    // 初始化游戏数据
    initGameModel(thiz: gdk.fsm.FsmStateAction): void {
        // SDK
        SdkTool.tool['_roleModel'] = ModelManager.get(RoleModel);
    },

    // 初始化控制器
    initGameController(thiz: gdk.fsm.FsmStateAction, isAdd: boolean): void {
        let ctrls: Array<new () => BaseController> = [
            ServerController,
            LoginController,
            RoleController,
            ChatController,
            BagController,
            EquipController,
            HeroController,
            MailController,
            CopyController,
            InstanceController,
            SoldierController,
            BYController,
            GeneralController,
            FriendController,
            StoreController,
            TaskController,
            LotteryController,
            ArenaController,
            GuideController,
            SignController,
            // RankController,
            OnlineGrowController,
            ActivityController,
            GuildController,
            MercenaryControll,
            FootHoldController,
            RuneController,
            AdventureController,
            ChampionController,
            ResonatingControll,
            RelicController,
            CostumeController,
            EnergyController,
            GuardianController,
            CombineController,
            PiecesController,
            NewAdventureController,
            ArenaHonorController,
        ];
        ctrls.forEach(c => {
            if (isAdd) {
                // 添加全局控制器
                NetManager.addController(c);
            } else {
                // 移除全局控制器
                NetManager.removeController(c);
            }
        });
    },

    // 预加载游戏资源
    preloadGameResource(thiz: gdk.fsm.FsmStateAction): void {
        let instance = gdk.Tool.getSingleton(PreloadGameResourceImplement);
        instance.fsm = thiz;
        instance.preload();
    },

    // 加载游戏资源
    loadGameResource(thiz: gdk.fsm.FsmStateAction, loadingErrorText: string, setProgress: (v: number) => void): void {
        let instance = gdk.Tool.getSingleton(LoadGameResourceImplement);
        instance.fsm = thiz;
        instance.loadingErrorText = loadingErrorText;
        instance.setProgress = setProgress.bind(thiz);
        instance.load();
    },

    // 初始化请求
    initServerRequest(thiz: gdk.fsm.FsmStateAction): void {
        let instance = gdk.Tool.getSingleton(InitServerRequestImplement);
        instance.fsm = thiz;
        instance.onEnter();
    },
    initServerRequestOnExit(thiz: any): void {
        let instance = gdk.Tool.getSingleton(InitServerRequestImplement);
        instance.onExit();
    },

    // 断线重连
    reconnectServer(thiz: gdk.fsm.FsmStateAction): void {
        let instance = gdk.Tool.getSingleton(ReconnectImplement);
        instance.retry = 0;
        instance.fsm = thiz;
        gdk.Timer.once(1, instance, instance.connect);
    },
    reconnectServerOnExit(thiz: gdk.fsm.FsmStateAction): void {
        let instance = gdk.Tool.getSingleton(ReconnectImplement);
        instance.onExit();
    },

    // 进入主场景
    enterMain(thiz: gdk.fsm.FsmStateAction): void {
        let instance = gdk.Tool.getSingleton(EnterMainImplement);
        instance.fsm = thiz;
        instance.onEnter();
    },
    enterMainOnExit(thiz: gdk.fsm.FsmStateAction): void {
        let instance = gdk.Tool.getSingleton(EnterMainImplement);
        instance.onExit();
    },

});

export default GameUtils;