var gulp = require("gulp");
var GDKI18nUtils = require("./utils/gdkI18nUtils")

gulp.task("init", function() {
    return GDKI18nUtils.initMap();
});

gulp.task("replace", function() {
    return GDKI18nUtils.deepSerachPrefab();
});

gulp.task("pubNewTips", function() {
    return GDKI18nUtils.publishNewTips();
});

gulp.task('clear', function() {
    return GDKI18nUtils.clearTempJson();
})

gulp.task('start', gulp.series('init', 'replace', 'pubNewTips', 'clear', function(cb) {
    cb();
}));
