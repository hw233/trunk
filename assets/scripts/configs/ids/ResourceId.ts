/**
 * Id的定义与配置整合到在一起
 * {
 *      XXXX: {
 *          type: 资源类型,
 *          resArray: [资源url],
 *      },
 * }
 * @Author: sthoo.huang
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-25 17:28:40
 */

const ResourceId = {
    Common: {
        Prefab: {
            type: cc.Prefab,
            resArray: [

            ],
        }
    },
    Pve: {
        AnimationClip: {
            type: cc.AnimationClip,
            resArray: [
                "view/pve/ani/towerFlag",
            ],
        },
    },
    chapterProgress: {
        spriteFrame: {
            type: cc.SpriteFrame,
            resArray: [
                "view/pve/texture/ui/zb_putongguanka02",
                "view/pve/texture/ui/zb_jingyingguanka02",
                "view/pve/texture/ui/zb_bossguanka02"
            ]
        }
    }
};

//混合进GDK
gdk.ResourceId.mixins(ResourceId);

export default ResourceId;