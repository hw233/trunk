'use strict';

let message = {
    'update-default-language': function(event, language) {
        let i18n = gdk.LanguageData;
        i18n.init(language);
        i18n.updateSceneRenderers();
        if (!event.reply) {
            return;
        }
        if (language) {
            event.reply(null, 'successful');
        } else {
            event.reply(new Error('language not specified!'));
        }
    },
};

module.exports = message;