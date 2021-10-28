/** 
 * 公共接口定义
 * @Author: sthoo.huang  
 * @Date: 2019-12-04 14:27:12 
 * @Last Modified by: undefined 
 * @Last Modified time: 2019-12-04 14:27:12 
 */

/** 对象池类接口定义 */
export interface IPool {
    get(c: any): any;
    put(...args: any[]): void;
    clearAll(): void;
}