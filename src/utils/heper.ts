export const isNotEmpty = (value:unknown)=>{
    return value !=='' && value !==undefined && value !==null
}

export const isEmpty = (value: unknown): boolean => {
    return value === "" || value === undefined || value === null;
  };
  
export const parseJson = (str: undefined | string, defaultValue?: any) => {
    try {
      return str === undefined ? defaultValue : JSON.parse(str) || defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };


/**
 *  从对象中排除指定项
 * @param data 
 * @param keys 
 * @returns 
 */
export function omit<T extends Record<string,any>>(data:T, keys:Array<keyof T>){
    let result = {} as T;
    let mapkeys = new Set(keys)
    for (const key in data) {
        if(!mapkeys.has(key)){
            result[key] = data[key]
        }
    }
    return result 
   
}


/**
 *  从data 数据中根据路径取值
 * @param data 
 * @param pathkey 
 */
export function get<T extends any>(data:T,pathkey:string,defaultValue?:any){
   if(!data) return defaultValue 
   let pathList = pathkey.split(".");
   if(!pathList.length) return data || defaultValue
   let currentValue:any = data;
   let len = pathList.length;
   let start = 0
   while (len>start) {
    try {
        currentValue = currentValue[ pathList[start]]
        start++
    } catch (error) {
        currentValue = defaultValue
        break
    }
   }
   return currentValue
}


/**
 * 简单生成UUID
 * @param {*} length
 * @param {*} option
 * @returns
 */
export const genUuid = (
    length = 8,
    option: { isNumber?: boolean; prefix?: string } = {}
  ) => {
    let { isNumber = false, prefix = "" } = option;
    let id = "";
    let numberValue = "0123456789";
    let letterValue = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz_-";
    // let numberValueLen = numberValue.length;
  
    let characters = isNumber ? numberValue : numberValue + letterValue;
  
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return isNumber ? Number(id) : prefix ? prefix + id : id;
  };