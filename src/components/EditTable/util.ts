
// 获取路径
export const getPaths = (obj:Record<string,any>, arr:any[]=[], res:any[] = []) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value) getPaths(value, [...arr, key], res)
    else res.push([...arr, key])
  });
  return res;
}


/**
 * 前缀+  随机数
 * @param {string} prex
 * @returns
 */
export const randomId = (prex = '', num = 8) => {
  return `${prex}${Math.random()}`.substring(1, num);
};
