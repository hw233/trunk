var EaseType = cc.Enum({
    easeLinear: -1,
    easeIn: -1,
    easeOut: -1,
    easeInOut: -1,
    easeExponentialIn: -1,
    easeExponentialOut: -1,
    easeExponentialInOut: -1,
    easeSineIn: -1,
    easeSineOut: -1,
    easeSineInOut: -1,
    easeElasticIn: -1,
    easeElasticOut: -1,
    easeElasticInOut: -1,
    easeBounceIn: -1,
    easeBounceOut: -1,
    easeBounceInOut: -1,
    easeBackIn: -1,
    easeBackOut: -1,
    easeBackInOut: -1,
    easeBezierAction: -1,
    easeQuadraticActionIn: -1,
    easeQuadraticActionOut: -1,
    easeQuadraticActionInOut: -1,
    easeQuarticActionIn: -1,
    easeQuarticActionOut: -1,
    easeQuarticActionInOut: -1,
    easeQuinticActionIn: -1,
    easeQuinticActionOut: -1,
    easeQuinticActionInOut: -1,
    easeCircleActionIn: -1,
    easeCircleActionOut: -1,
    easeCircleActionInOut: -1,
    easeCubicActionIn: -1,
    easeCubicActionOut: -1,
    easeCubicActionInOut: -1,
});

cc.easeLinear = function () {
    return {
        easing: function (dt) {
            return dt;
        },
        reverse: function () {
            return cc.easeLinear();
        }
    };
};

module.exports = EaseType;