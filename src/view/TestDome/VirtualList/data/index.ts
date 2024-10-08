import data from "../guaziche.json";

function addUid() {
  return `${Math.random() * 10}`.replace(".", "");
}

function repleceItemData(item, index: number) {
  const findIndex = item.carImg.indexOf("@");
  const carImg = item.carImg.substring(0, findIndex);

  return { ...item, key: addUid(), carImg, uri: carImg, index };
}

/**
 *  多少组
 * @param groupTotal  10
 * @param groupSize 每组多少个  20
 * @returns
 */
function getGroupList(groupTotal = 100, groupSize = 5) {
  let result = Array.from({ length: groupTotal }, (_, index) => {
    const startIndex = index * groupSize;
    const endIndex = startIndex + groupSize;
    let dataList = data
      .slice(startIndex, endIndex)
      .map((item, idx) => repleceItemData(item, idx));
    const key = addUid();
    return {
      index: index,
      id: key,
      key,
      name: "组" + index,
      dataList,
    };
  });

  return result;
}

/**
 *
 */
function getSigeList(size = 100) {
  return Array.from({ length: size }, (_, index) => {
    const item = data[index];
    const key = addUid();
    return {
      key,
      id: key,
      index,
      name: "单个" + index,
      ...repleceItemData(item, index),
    };
  });
}

export const groupDataList = getGroupList();

// 初始化 分组内对应的索引
export const getGroupIdMapIdx = (groupDataList) => {
  let result = {};
  groupDataList.forEach((item) => {
    result[item.id] = 0;
  });

  return result;
};

export const dataList = getSigeList();
