// 针对engine的修改
cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {
    require("./CCLabel");
    require("./CCRichText");
    require("./CCAssetManager");
    require("./CCNode");
    // 是否有开启动态图集
    const dynamicAtlasManager = cc.dynamicAtlasManager;
    if (dynamicAtlasManager && dynamicAtlasManager.enabled) {
        require("./CCSprite");
        require("./CCSpriteFrame");
        require("./CCTexture2D");
        require("./CCMaterial");
        require("./atlas");
        require("./manager");
        require("./assembler-2d");
    }
    require("./vec2");
    require("./Skeleton");
    require("./render-flow");
});
require("./downloader");