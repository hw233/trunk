(function e (t, n, r) {
    function s (o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var b = o.split('/');
                b = b[b.length - 1];
                if (!t[b]) {
                    var a = ("function" == typeof __require) ? __require : void 0;
                    if (a) return a(b, u);
                    throw new Error("Cannot find module '" + o + "'");
                }
            }
            var f = n[o] = {
                exports: {}
            };
            t[o][0].call(f, function (e) {
                // var n = t[o][1][e];
                var n = (e == 'gdk') ? gdkEntry : t[o][1][e];
                return s(n || e);
            }, f, f.exports, e, t, n, r);
        }
        return n[o].exports;
    };
    var gdkEntry = r[0];
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})