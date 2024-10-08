import { genUuid, isEmpty } from "@/utils/heper";

/**
 * 路径转化
 * @param index
 * @param parentIndex
 * @returns
 */
export const getPathIndex = (
  index: string,
  parentIndex?: string
): [Array<string>, string] => {
  let pathStr = isEmpty(parentIndex) ? `${index}` : `${parentIndex}-${index}`;
  let pathArr = pathStr.split("-");

  return [pathArr, pathStr];
};

// 根据路径删除当前操作项
const onDeleteItemToPathArr = (crrentData, pathArr) => {
  let lastIndex = pathArr.length - 1;
  let deleteIndex = pathArr[lastIndex];
  return crrentData.splice(deleteIndex, 1)[0];
};

// 根据路径添加数据

const onAddItemToPathArr = (crrentData, addData, pathArr) => {
  let lastIndex = pathArr.length - 1;
  let addIndex = pathArr[lastIndex];
  crrentData.splice(addIndex, 0, addData);
};

/**
 *  获取当前排序列表项
 *  [ {},{ [ 1,2,3 ] } ]  [1,1]
 *  [ {},{} ]  [1]
 * @param data
 * @param pathArr
 * @returns
 */
const getParentData = (data, pathArr, idx?: number) => {
  let len = pathArr.length - 1;
  let result = data;
  let index = 0;
  while (len > index) {
    let i = pathArr[index];
    result = result[i]?.children || [];
    index++;
  }
  return idx !== undefined ? result[idx] : result;
};

/**
 * 同级排序
 */
export const onSameLevelSort = (data, toIndexArr, formIndexArr) => {
  //  [ {},{ [ 1,2,3 ] } ]  [1,1]
  let newData = [...data];
  let currentData = getParentData(newData, toIndexArr);
  // let lastIndex = toIndexArr.length - 1;
  // let toIndex = toIndexArr[lastIndex];
  // let formIndex = formIndexArr[lastIndex];

  // 先删除
  // let deleteItem = currentData.splice(formIndex, 1)[0];
  let deleteItem = onDeleteItemToPathArr(currentData, formIndexArr);
  // 再新增
  onAddItemToPathArr(currentData, deleteItem, toIndexArr);
  // currentData.splice(toIndex, 0, deleteItem);
  // console.log("onSameLevelSort", newData, deleteItem);
  return newData;
};
/**
 * 跨级排序
 */

export const onCrossLevelSort = (data, toIndexArr, formIndexArr) => {
  let newData = [...data];

  // 删除从哪里来的
  let formData = getParentData(newData, formIndexArr);
  let toData = getParentData(newData, toIndexArr);

  let deleteItem = onDeleteItemToPathArr(formData, formIndexArr);
  onAddItemToPathArr(toData, deleteItem, toIndexArr);
  // let formLastIndex = formIndexArr.length - 1;
  // let formIndex = formIndexArr[formLastIndex];

  // 新增去到哪里的

  // let toLastIndex = toIndexArr.length - 1;
  // let toIndex = toIndexArr[toLastIndex];
  // let deleteItem = formData.splice(formIndex, 1)[0];
  // toData.splice(toIndex, 0, deleteItem);

  return newData;
};
/**
 * 排序的
 */
export const onHandleSort = (
  data,
  toIndexArr,
  formIndexArr,
  toParentIndex,
  formParentIndex
) => {
  // 跨级处理；// 删除原来的，然后新增
  if (toParentIndex !== formParentIndex) {
    console.log("跨级拖");
    return onCrossLevelSort(data, toIndexArr, formIndexArr);
  } else {
    console.log("同级拖");
    return onSameLevelSort(data, toIndexArr, formIndexArr);
  }
};

/**
 * 新增
 */

export const onHandleAdd = (data, addItem, toIndexArr) => {
  let newData = [...data];

  // 构造新增的数据
  let type = addItem.type;
  let newAddItem = {
    name: addItem.type,
    id: `${type}_${genUuid()}`,
    attr: addItem.defaultValue,
    children: type == "Container" ? [] : undefined,
  };
  let toData = getParentData(newData, toIndexArr);
  onAddItemToPathArr(toData, newAddItem, toIndexArr);
  // let toLastIndex = toIndexArr.length - 1;
  // let toIndex = toIndexArr[toLastIndex];
  // toData.splice(toIndex, 0, newAddItem);
  // console.log("toData", toData, newData);
  return newData;
};

// 根据路径删除
const onDeleteWidthPath = (data: any[], path: string) => {
  let newData = [...data];
  let [pathArr] = getPathIndex(path);
  let crrentData = getParentData(newData, pathArr);
  onDeleteItemToPathArr(crrentData, pathArr);
  // let lastIndex = pathArr.length - 1;
  // let deleteIndex = pathArr[lastIndex];
  // crrentData.splice(deleteIndex, 1);
  return newData;
};

/**
 * 删除的
 */
export const onHandleDelete = (
  data,
  opton: { path?: string; id?: string | number } = {}
) => {
  // 根据逻辑删除 path "3-1-0"
  if (!isEmpty(opton.path)) {
    return onDeleteWidthPath(data, opton.path as string);
  }
};

// 重置id
const resetItmeId = (item) => {
  let { attr = {}, name, children } = item;
  let result: any = {
    name,
    id: `${name}_${genUuid()}`,
    attr: JSON.parse(JSON.stringify(attr)),
  };
  if (Array.isArray(children)) {
    result.children = children.map((item) => resetItmeId(item));
  }
  console.log("result", result);
  return result;
};

/**
 * 复制的
 */

export const onHandleCopy = (data, item, path) => {
  let addItem = resetItmeId(item);
  let newData = [...data];
  let [pathArr] = getPathIndex(path);
  let crrentData = getParentData(newData, pathArr);
  let lastIndex = pathArr.length - 1;
  let insertIndex = pathArr[lastIndex];
  crrentData.splice(Number(insertIndex) + 1, 0, addItem);
  return newData;
};

export const getSelectItemData = (
  data,
  opton: {
    paths?: Array<string | number>;
    index?: number;
    id?: string | number;
  } = {}
) => {
  if (opton.paths) {
    return getParentData(data, opton.paths, opton.index);
  }
  return null;
};
