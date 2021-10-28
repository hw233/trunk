import GlobalUtil from './GlobalUtil';

export default class TimerUtils {

    /**
     * 将时间长度格式化
     * hh:mm:ss
     */
    public static diffTimeFormat(fmt: string, time: number, type: number = 1) {
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minutent = Math.floor(time % 3600 / 60);
        var seconds = Math.floor(time % 60);
        if (!new RegExp("(d+)").test(fmt)) {
            hour += day * 24;
        }
        if (!new RegExp("(h+)").test(fmt)) {
            minutent += hour * 60;
        }
        var o = {
            "d+": day, //日
            "h+": hour, //小时
            "m+": minutent, //分
            "s+": seconds, //秒
        };
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) {
                //                    debug((("00" + o[k]).substr(("" + o[k]).length)));
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ("" + o[k]).length == 1 ? "0" + o[k] : o[k]);
            }

        return fmt;
    }

    /**
    * 返回中文格式化时间
    * xx天xx 时xx 分xx 秒
    */
    static format1(time) {
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minute = Math.floor(time % 3600 / 60);
        var second = Math.floor(time % 60);
        if (day > 0) {
            return `${day}天${hour}小时`
        }
        else if (hour > 0) {
            return `${hour}小时`
        }
        else if (minute > 0) {
            return `${minute}分${second}秒`
        } else {
            return `${second}秒`
        }
    }

    /**
    * 返回 12:00:00这种格式
    * @param time
    * @returns {string}
    */
    public static format2(time) {
        return TimerUtils.diffTimeFormat('hh:mm:ss', time);
    }

    /**
    * 返回中文格式化时间
    * xx天xx 时xx 分xx 秒
    */
    static format3(time) {
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minute = Math.floor(time % 3600 / 60);
        var second = Math.floor(time % 60);
        if (day > 0) {
            return `${day}天`
        }
        else if (hour > 0) {
            return `${hour}小时`
        }
        else if (minute > 0) {
            return `${minute}分${second}秒`
        } else {
            return `${second}秒`
        }
    }

    /**
    * 返回中文格式化时间
    * xx天xx 时xx 分xx 秒
    */
    static format4(time) {
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minute = Math.floor(time % 3600 / 60);
        var second = Math.floor(time % 60);
        var ret = (day > 0 ? `${day}天` : '');
        ret += (hour > 0 ? `${hour}时` : '');
        ret += (minute > 0 ? `${minute}分` : '');
        ret += (second > 0 ? `${second}秒` : '');
        return ret;
    }

    static format5(time) {
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minute = Math.floor(time % 3600 / 60);
        if (day > 0) {
            return `${day}天${hour}时`
        }
        else if (hour > 0) {
            return `${hour}小时`
        }
        else {
            return `${minute}分`
        }
    }

    static format6(time) {
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minute = Math.floor(time % 3600 / 60);
        var second = Math.floor(time % 60);
        if (day > 0) {
            return `${day}天`
        }
        else if (hour > 0) {
            return `${hour}小时`
        }
        else if (minute > 0) {
            return `${minute}分钟`
        } else {
            return `${second}秒`
        }
    }

    static format7(time) {
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minute = Math.floor(time % 3600 / 60);
        var second = Math.floor(time % 60);
        if (day > 0) {
            return `${day}天${hour}时${minute}分`
        }
        else if (hour > 0) {
            return `${hour}时${minute}分`
        }
        else if (minute > 0) {
            return `${minute}分${second}秒`
        } else {
            return `${second}秒`
        }
    }

    static format8(time) {
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minute = Math.floor(time % 3600 / 60);
        if (day > 0) {
            return `${day}天`
        }
        else if (hour > 0) {
            return `${hour}小时`
        }
        else if (minute > 0) {
            return `${minute}分钟`
        } else {
            return `1分钟`
        }
    }

    static format9(time) {
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minute = Math.floor(time % 3600 / 60);
        if (day > 0) {
            return `${day}天${hour}小时`
        }
        else if (hour > 0) {
            return `${hour}小时${minute}分`
        }
        else if (minute > 0) {
            return `${minute}分钟`
        } else {
            return `1分钟`
        }
    }

    /**
    * 传入任意时间(秒)，返回是否是当前同一天
    */
    public static isCurDay(time) {
        var zero = TimerUtils.getZerohour(GlobalUtil.getServerTime() / 1000);
        let nextZero = TimerUtils.getTomZerohour(GlobalUtil.getServerTime() / 1000);
        let time1 = Number(time);
        if (zero <= time1 && nextZero >= time1) {
            return true;
        }
        return false;
    }

    /**
     * 传入任意时间(秒)，获取当天零点的时间
     *  */
    public static getZerohour(time) {
        var date = new Date(time * 1000);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);
        return Math.floor(date.getTime() / 1000);
    }

    /**
     * 传入任意时间戳，获取第二天零点的时间戳
     *  */
    public static getTomZerohour(time) {
        var date = new Date(time * 1000);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(24);
        return Math.floor(date.getTime() / 1000);
    }

    /**本周周一的零点的时间戳 
     * time 秒
    */
    public static getWeekFirstDayZeroTime(time) {
        let nowTemp = new Date(time * 1000); // 当前时间
        let oneDayLong = 24 * 60 * 60 * 1000; // 一天的毫秒数
        let c_time = nowTemp.getTime(); // 当前时间的毫秒时间
        let c_day = nowTemp.getDay() || 7; // 当前时间的星期几
        let m_time = c_time - (c_day - 1) * oneDayLong; // 当前周一的毫秒时间
        let result = this.getZerohour(Math.floor(m_time / 1000)) // 当前周一0点时间戳
        return result
    }

    /**
     * 格式化日期，北京时间
     * @param s {String[] | Number[]}
     * @returns {Date}
     */
    static transformDate(s: any[]): number {
        let Y = parseInt(s[0]);
        let M = parseInt(s[1]);
        let D = parseInt(s[2]);
        let hou = parseInt(s[3] || 0);
        let min = parseInt(s[4] || 0);
        let sec = parseInt(s[5] || 0);
        if (hou >= 24) {
            hou = 23;
            min = 59;
            sec = 59;
        }
        min = Math.min(59, min);
        sec = Math.min(59, sec);
        return (new Date(`${Y}/${M}/${D} ${hou}:${min}:${sec} GMT+8`)).getTime();
    }
}