/**
 * 数据模型管理器
 * @Author: sthoo.huang
 * @Date: 2019-03-28 14:18:48
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-07 16:27:06
 */

class ModelManagerClass {

    models: any[] = [];

    /**
     * 获得指定数据模型类的实例
     * @param clz 数据模型类
     */
    get<T>(clz: { new(): T }): T {
        var model: any = gdk.Tool.getSingleton(clz);
        if (this.models.indexOf(model) === -1) {
            this.models.push(model);
        }
        return model;
    }

    /**
     * 销毁指定数据模型
     * @param clz 数据模型类或实例
     */
    put(clz: any) {
        clz = (typeof clz === 'object') ? clz.constructor : clz;
        var model: any = clz.__gdk_instance;
        if (model) {
            var index: number = this.models.indexOf(model);
            if (index != -1) {
                this.models.splice(index, 1);
            }
            gdk.Tool.destroySingleton(clz);
        }
    }

    /**
     * 清除所有数据
     */
    clearAll(excludes?: any[]) {
        let a: any[] = [];
        this.models.forEach((model: any) => {
            if (excludes) {
                let clz: any = model.constructor;
                if (excludes.indexOf(clz) >= 0) {
                    return;
                }
            }
            a.push(model);
        });
        a.forEach(m => this.put(m));
        CC_DEBUG && cc.log("剩余model实例:", this.models.length);
    }
}

const BModelManager = gdk.Tool.getSingleton(ModelManagerClass);
iclib.addProp('ModelManager', BModelManager);
export default BModelManager;