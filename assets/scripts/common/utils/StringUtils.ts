/** 
 * 字符串工具类（来自：https://raw.githubusercontent.com/tejzpr/stringutils/master/src/StringUtils.ts）
 * @Author: sthoo.huang  
 * @Date: 2019-04-09 15:15:04 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-07-06 16:50:28
 */

export default class StringUtils {
    /**
    * Represents a failed index search.
    */
    public static INDEX_NOT_FOUND = -1;

    /**
    * The empty String <code>""</code>.
    */
    public static EMPTY = "";

    /**
    * <p>The maximum size to which the padding constant(s) can expand.</p>
    */
    private static PAD_LIMIT = 8192;

    /**
    * <p>Checks if a String is empty ("") or null.</p>
    *
    * <pre>
    * StringUtils.isEmpty(null)      = true
    * StringUtils.isEmpty("")        = true
    * StringUtils.isEmpty(" ")       = false
    * StringUtils.isEmpty("bob")     = false
    * StringUtils.isEmpty("  bob  ") = false
    * </pre>
    *
    * It no longer trims the String.
    * That functionality is available in isBlank().</p>
    *
    * @param str  the String to check, may be null
    * @return <code>true</code> if the String is empty or null
    */
    public static isEmpty(str: string) {
        return str === null || str.length === 0;
    }

    /**
    * <p>Checks if a String is not empty ("") and not null.</p>
    *
    * <pre>
    * StringUtils.isNotEmpty(null)      = false
    * StringUtils.isNotEmpty("")        = false
    * StringUtils.isNotEmpty(" ")       = true
    * StringUtils.isNotEmpty("bob")     = true
    * StringUtils.isNotEmpty("  bob  ") = true
    * </pre>
    *
    * @param str  the String to check, may be null
    * @return <code>true</code> if the String is not empty and not null
    */
    public static isNotEmpty(str: string) {
        return !StringUtils.isEmpty(str);
    }

    /**
    * <p>Checks if a String is whitespace, empty ("") or null.</p>
    *
    * <pre>
    * StringUtils.isBlank(null)      = true
    * StringUtils.isBlank("")        = true
    * StringUtils.isBlank(" ")       = true
    * StringUtils.isBlank("bob")     = false
    * StringUtils.isBlank("  bob  ") = false
    * </pre>
    *
    * @param str  the String to check, may be null
    * @return <code>true</code> if the String is null, empty or whitespace
    * @since 2.0
    */
    public static isBlank(str: string) {
        let strLen;
        if (str == null || (strLen = str.length) === 0) {
            return true;
        }
        for (let i = 0; i < strLen; i++) {
            if (str[i] !== '' && str[i] !== ' ' && str[i] !== '\n' && str[i] !== '\t') {
                return false;
            }
        }
        return true;
    }

	/**
     * <p>Checks if a String is not empty (""), not null and not whitespace only.</p>
     *
     * <pre>
     * StringUtils.isNotBlank(null)      = false
     * StringUtils.isNotBlank("")        = false
     * StringUtils.isNotBlank(" ")       = false
     * StringUtils.isNotBlank("bob")     = true
     * StringUtils.isNotBlank("  bob  ") = true
     * </pre>
     *
     * @param str  the String to check, may be null
     * @return <code>true</code> if the String is
     *  not empty and not null and not whitespace
     * @since 2.0
     */
    public static isNotBlank(str: string) {
        return !StringUtils.isBlank(str);
    }

    /**
    * <p>Removes control characters (char &lt;= 32) from both
    * ends of this String, handling <code>null</code> by returning
    * an empty String ("").</p>
    *
    * <pre>
    * StringUtils.clean(null)          = ""
    * StringUtils.clean("")            = ""
    * StringUtils.clean("abc")         = "abc"
    * StringUtils.clean("    abc    ") = "abc"
    * StringUtils.clean("     ")       = ""
    * </pre>
    *
    * @param str  the String to clean, may be null
    * @return the trimmed text, never <code>null</code>
    * @deprecated Use the clearer named {@link #trimToEmpty(String)}.
    *             Method will be removed in Commons Lang 3.0.
    */
    public static clean(str: string) {
        return str == null ? StringUtils.EMPTY : str.trim();
    }

	/**
     * <p>Removes control characters from both
     * ends of this String, handling <code>null</code> by returning
     * <code>null</code>.</p>
     *
     * Trim removes start and end characters &lt;= 32.
     *
     * <pre>
     * StringUtils.trim(null)          = null
     * StringUtils.trim("")            = ""
     * StringUtils.trim("     ")       = ""
     * StringUtils.trim("abc")         = "abc"
     * StringUtils.trim("    abc    ") = "abc"
     * </pre>
     *
     * @param str  the String to be trimmed, may be null
     * @return the trimmed string, <code>null</code> if null String input
     */
    public static trim(str: string) {
        return str == null ? null : str.trim();
    }

    /**
    * <p>Removes control characters (char &lt;= 32) from both
    * ends of this String returning <code>null</code> if the String is
    * empty ("") after the trim or if it is <code>null</code>.
    *
    *
    * <pre>
    * StringUtils.trimToNull(null)          = null
    * StringUtils.trimToNull("")            = null
    * StringUtils.trimToNull("     ")       = null
    * StringUtils.trimToNull("abc")         = "abc"
    * StringUtils.trimToNull("    abc    ") = "abc"
    * </pre>
    *
    * @param str  the String to be trimmed, may be null
    * @return the trimmed String,
    *  <code>null</code> if only chars &lt;= 32, empty or null String input
    */
    public static trimToNull(str: string) {
        let ts = StringUtils.trim(str);
        return StringUtils.isEmpty(ts) ? null : ts;
    }

    /**
    * <p>Removes control characters (char &lt;= 32) from both
    * ends of this String returning an empty String ("") if the String
    * is empty ("") after the trim or if it is <code>null</code>.
    *
    * <p>The String is trimmed using {@link String#trim()}.
    * Trim removes start and end characters &lt;= 32.
    * To strip whitespace use {@link #stripToEmpty(String)}.</p>
    *
    * <pre>
    * StringUtils.trimToEmpty(null)          = ""
    * StringUtils.trimToEmpty("")            = ""
    * StringUtils.trimToEmpty("     ")       = ""
    * StringUtils.trimToEmpty("abc")         = "abc"
    * StringUtils.trimToEmpty("    abc    ") = "abc"
    * </pre>
    *
    * @param str  the String to be trimmed, may be null
    * @return the trimmed String, or an empty String if <code>null</code> input
    */
    public static trimToEmpty(str: string) {
        return str == null ? StringUtils.EMPTY : str.trim();
    }

    /**
    * <p>Replaces a String with another String inside a larger String,
    * for the first <code>max</code> values of the search String.</p>
    *
    * <p>A <code>null</code> reference passed to this method is a no-op.</p>
    *
    * <pre>
    * StringUtils.replace("abaa", "a", null, -1) = "abaa"
    * StringUtils.replace("abaa", "a", "", -1)   = "b"
    * StringUtils.replace("abaa", "a", "z", 0)   = "abaa"
    * StringUtils.replace("abaa", "a", "z", 1)   = "zbaa"
    * StringUtils.replace("abaa", "a", "z", 2)   = "zbza"
    * StringUtils.replace("abaa", "a", "z", -1)  = "zbzz"
    * </pre>
    *
    * @param text  text to search and replace in, may be null
    * @param searchString  the String to search for, may be null
    * @param replacement  the String to replace it with, may be null
    * @param max  maximum number of values to replace, or <code>-1</code> if no maximum
    * @return the text with any replacements processed,
    *  <code>null</code> if null String input
    */
    public static replace(text: string, searchString: string, replacement: string, max?: number) {
        if (max == null || typeof max === 'undefined') {
            max = -1;
        }
        if (StringUtils.isEmpty(text) || StringUtils.isEmpty(searchString) || replacement === null || max === 0) {
            return text;
        }
        let start = 0;
        let end = text.indexOf(searchString, start);
        if (end === StringUtils.INDEX_NOT_FOUND) {
            return text;
        }
        let replLength = searchString.length;
        let increase = replacement.length - replLength;
        increase = (increase < 0 ? 0 : increase);
        increase *= (max < 0 ? 16 : (max > 64 ? 64 : max));
        let buf = new Array();
        while (end !== StringUtils.INDEX_NOT_FOUND) {
            buf.push(text.substring(start, end));
            buf.push(replacement);
            start = end + replLength;
            if (--max === 0) {
                break;
            }
            end = text.indexOf(searchString, start);
        }
        buf.push(text.substring(start));
        return buf.join("");
    }

    /**
     * Checks whether `subject` ends with `end`.
     *
     * @function endsWith
     * @static
     * @since 1.0.0
     * @memberOf Query
     * @param {string} [subject=''] The string to verify.
     * @param {string} end The ending string.
     * @param {number} [position=subject.length] Search within `subject` as if the string were only `position` long.
     * @return {boolean} Returns `true` if `subject` ends with `end` or `false` otherwise.
     * @example
     * v.endsWith('red alert', 'alert');
     * // => true
     *
     * v.endsWith('metro south', 'metro');
     * // => false
     *
     * v.endsWith('Murphy', 'ph', 5);
     * // => true
     */
    public static endsWith(subject: string, end: string, position?: number): boolean {
        if (!cc.js.isString(subject) || !cc.js.isString(end)) {
            return false;
        }
        if (end === '') {
            return true;
        }
        (position === void 0) && (position = subject.length);
        position -= end.length;
        const lastIndex = subject.indexOf(end, position);
        return lastIndex !== -1 && lastIndex === position;
    }

    /**
     * Checks whether `subject` starts with `start`.
     *
     * @function startsWith
     * @static
     * @since 1.0.0
     * @memberOf Query
     * @param {string} [subject=''] The string to verify.
     * @param {string} start The starting string.
     * @param {number} [position=0] The position to start searching.
     * @return {boolean} Returns `true` if `subject` starts with `start` or `false` otherwise.
     * @example
     * v.startsWith('say hello to my little friend', 'say hello');
     * // => true
     *
     * v.startsWith('tony', 'on', 1);
     * // => true
     *
     * v.startsWith('the world is yours', 'world');
     * // => false
     */
    public static startsWith(subject: string, start: string, position?: number): boolean {
        if (!cc.js.isString(subject) || !cc.js.isString(start)) {
            return false;
        }
        if (start === '') {
            return true;
        }
        (position === void 0) && (position = 0);
        return subject.substr(position, start.length) === start;
    }

    /**
     * 消息格式化
     * @param {String} message
     * @param {Array} args
     */
    public static format(message: string, ...args: any[]) {
        return message.replace(/{(\d+)}/g, function (matchStr, group1) {
            return args[group1];
        });
    }


    public static setRichtOutLine(str, color, width) {
        return `<outline color=${color} width=${width}>${str}</outline>`
    }

    /**
     * 为num左边填充至指定长度
     * @param num 
     * @param length 
     * @param fill 
     */
    public static padding(num: number, length: number, fill: string = '0') {
        let ret = num + '';
        for (var i = ret.length; i < length; i++) {
            ret = fill + ret;
        }
        return ret;
    }
}