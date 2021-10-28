'use strict';

const Fs = require('fire-fs');
const Path = require('path');

let PATH = Path.join(__dirname, '../../../assets/resources/i18n');
let packages = {
    mount() {
        // 创建目录，保证目录存在
        Fs.ensureDirSync(PATH);
    },

    unmount() {
        // 如果目录为空则删除目录
        if (!Fs.existsSync(PATH)) {
            return;
        }
        if (Fs.readdirSync(PATH).length === 0) {
            Fs.unlink(PATH);
        }
    },

    metrics() {
        Editor.Metrics.trackEvent({
            category: 'Packages',
            label: 'i18n',
            action: 'Panel Open'
        }, null);
    },
};

module.exports = packages;