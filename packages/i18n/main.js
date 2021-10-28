'use strict';

const Package = require('./utils/package');
const Fs = require('fire-fs');
const Path = require('path');

module.exports = {
    load() {
        Package.mount();
    },

    unload() {
        Package.unmount();
    },

    messages: {
        'open'() {
            Editor.Panel.open('i18n');
            Package.metrics();
        },
        'import-asset'(event, path) {
            Editor.assetdb.refresh(path, (err, results) => {
                if (err) {
                    Editor.assetdb.error('Failed to reimport asset %s, %s', path, err.stack);
                    return;
                }
                Editor.assetdb._handleRefreshResults(results);

                let metaPath = path + '.meta';
                if (Fs.existsSync(Editor.url(metaPath))) {
                    let meta = Fs.readJsonSync(Editor.url(metaPath));
                    meta.isPlugin = true;
                    Fs.outputJsonSync(Editor.url(metaPath), meta);
                } else {
                    Editor.log('Failed to set language data file to plugin script');
                    return;
                }
            });
        }
    },
};