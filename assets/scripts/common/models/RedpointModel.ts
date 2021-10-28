export interface StoreValue {
    [key: string]: boolean,
}

export default class RedpointModel {
    //临时状态存储区，主要用于保存打开一次后不再显示红点的操作
    tempState: StoreValue = {}
}