import StringUtils from '../utils/StringUtils';

const { ccclass, property, executeInEditMode, menu } = cc._decorator;

@ccclass('ShaderProperty')
export class ShaderProperty {
    @property({ readonly: true })
    key = '';

    @property({ type: cc.Float })
    value: number | cc.Color = 0.0;
};

@ccclass
@executeInEditMode
@menu('Shader/ShaderHelper')
export default class ShaderHelper extends cc.Component {

    @property(cc.String)
    _program: string = '';
    @property({ type: cc.String })
    get program() {
        return this._program;
    }
    set program(value: string) {
        if (this._program === value) {
            return;
        }
        this._program = value;
        this._applyShader();
    }

    // shader参数
    @property({ type: [ShaderProperty] })
    _props: ShaderProperty[] = [];
    @property({ type: [ShaderProperty] })
    get props(): ShaderProperty[] {
        return this._props;
    }
    set props(value: ShaderProperty[]) {
        this._props = value;
        this._applyShader();
    }

    material: cc.Material;  // 材质对象
    effect: cc.EffectAsset; // 效果资源
    originalMaterial: cc.Material;  // 源材质

    get texture() {
        let rc = this.getComponent(cc.RenderComponent);
        let texture: cc.Texture2D = null;
        if (rc instanceof cc.Sprite) {
            // Sprite 渲染组件
            texture = rc.spriteFrame && rc.spriteFrame.getTexture();
        } else if (rc instanceof sp.Skeleton) {
            // Spine 动画
            texture = rc.skeletonData && rc.skeletonData.textures[0];
        } else if (rc instanceof dragonBones.ArmatureDisplay) {
            // 龙骨动画
            texture = rc.dragonAtlasAsset && rc.dragonAtlasAsset.texture;
        } else {
            // 不支持的渲染类型，不做任何操作
            texture = null;
        }
        return texture;
    }

    get isLoaded() {
        let rc = this.getComponent(cc.RenderComponent);
        if (rc instanceof cc.Sprite) {
            // Sprite 渲染组件
            return rc.spriteFrame && rc.spriteFrame.textureLoaded();
        } else if (rc instanceof sp.Skeleton) {
            // Spine 动画
            return rc.skeletonData && rc.skeletonData.loaded;
        } else if (rc instanceof dragonBones.ArmatureDisplay) {
            // 龙骨动画
            return rc.dragonAtlasAsset && rc.dragonAtlasAsset.loaded;
        }
        return true;
    }

    _applyShader() {
        if (!this.enabled) return;
        if (!cc.isValid(this.node, true)) {
            return;
        }
        if (!this.isLoaded) {
            // 纹理不存在，有可能还没加载完，延时应用shader
            gdk.DelayCall.addCall(this._applyShader, this);
            return;
        }
        // 针对自动纹理合并功能，需延时应用shader才有效果
        gdk.DelayCall.addCall(this._applyShaderLater, this);
    }

    _applyShaderLater() {
        if (!this.enabled) return;
        if (!cc.isValid(this.node, true)) return;
        if (!this._program) return;
        let resId = gdk.Tool.getResIdByNode(this.node);
        let url = 'effects/' + this._program;
        gdk.rm.loadRes(resId, url, cc.EffectAsset, (effect: cc.EffectAsset) => {
            if (!this.enabled) return;
            if (!cc.isValid(this.node)) return;
            if (!StringUtils.endsWith(url, this._program)) return;

            // 获取精灵组件
            let rc = this.getComponent(cc.RenderComponent);
            if (!rc) {
                return;
            }

            // 保存源材质
            if (!this.originalMaterial) {
                this.originalMaterial = rc.getMaterial(0);
            }

            // 实例化一个材质对象
            this.material = new cc.Material();

            // 为材质设置effect，也是就绑定Shader了
            this.material.effectAsset = this.effect = effect;
            this.material.name = this.effect.name;

            // 将材质绑定到精灵组件上，精灵可以绑定多个材质
            // 这里我们替换0号默认材质
            rc.setMaterial(0, this.material);

            // 设置属性
            this._props.forEach(item => {
                if (!item.key) return;
                this.material.setProperty(item.key, item.value || 0);
            });
        });
    }

    _disableShader() {
        gdk.DelayCall.cancel(this._applyShader, this);
        gdk.DelayCall.cancel(this._applyShaderLater, this);
        if (!this.material) return;
        if (!this.originalMaterial) return;
        let rc = this.getComponent(cc.RenderComponent);
        if (rc) {
            rc.setMaterial(0, this.originalMaterial);
        }
        this.originalMaterial = null;
    }

    onEnable() {
        this._applyShader();
    }

    onDisable() {
        this._disableShader();
    }
}