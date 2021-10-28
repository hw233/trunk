'use strict';

let onBeforeBuildFinish = function (options, callback) {
    let builder = Editor.require("packages://gdk-builder/panel/builder.js");
    builder.before(options, callback);
};

let onBuildFinished = function (options, callback) {
    let builder = Editor.require("packages://gdk-builder/panel/builder.js");
    builder.finished(options, callback);
};

module.exports = {
    load () {
        Editor.Builder.on('before-change-files', onBeforeBuildFinish);
        Editor.Builder.on('build-finished', onBuildFinished);
    },

    unload () {
        Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
        Editor.Builder.removeListener('build-finished', onBuildFinished);
    },
    messages: {
        'open': function () {
            Editor.Panel.open('gdk-builder');
        },
    },
};