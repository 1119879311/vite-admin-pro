import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Overlay,
  Tree,
  Divider,
  Balloon,
  Button,
  Box,
  Checkbox,
  Icon,
} from "@alifd/next";
import "./SettingColumns.less";
const TreeNode = Tree.Node;
const { Popup } = Overlay;
const getTreeKey = (tableColoumData) => {
  const resut: any = { allkeys: [], defaultSelectkeys: [] };

  for (const iterator of tableColoumData) {
    if (iterator?.dataIndex !== "") {
      let key = iterator?.dataIndex;
      if (key) {
        resut.allkeys.push(key);
        if (iterator.defaultSelect !== false) {
          resut.defaultSelectkeys.push(key);
        }
        if (iterator?.children?.length) {
          let itmeRes = getTreeKey(iterator?.children);
          resut.allkeys = resut.allkeys.concat(itmeRes.allkeys);
          resut.defaultSelectkeys = resut.defaultSelectkeys.concat(
            itmeRes.defaultSelectkeys
          );
        }
      }
    }
  }

  return resut;
};

const filterTree = (treeData: any[], mapKey: any) => {
  const arr: any = [];

  treeData.forEach((item) => {
    let isShow = mapKey[item.dataIndex];
    if (!isShow) {
      return;
    }
    if (Array.isArray(item.children) && item.children.length) {
      item.children = filterTree(item.children, mapKey);
    }
    arr.push(item);
  });

  return arr;
};

const SettingColumns: React.FC<any> = ({ list = [], title = "", onUpdate }) => {
  const [showSetting, setShowSetting] = useState(false);
  const [checkboxAllE, setCheckboxAllE] = useState(false); // 全选的
  const [checkKeyList, setCheckKeyList] = useState<any>([]); // tree选中的(不含父级key)
  const [checkeyWithParentList, setCheckeyWithParentList] = useState<any[]>([]); // 所有的父级的key,包括父级key
  const allCheckBoxKeys = useRef([]);
  const localTreeList = useRef(JSON.parse(JSON.stringify(list)));
  useEffect(() => {
    // 拷贝一份
    // localTreeList.current = JSON.parse(JSON.stringify(list));
    const result = getTreeKey(localTreeList.current);
    allCheckBoxKeys.current = result.allkeys;
    setCheckKeyList(result.defaultSelectkeys);
  }, []);

  // 获取所有keys
  const onVisibleChange = (val) => {
    if (val) {
    }
    setShowSetting(val);
  };
  const onCheckChange = (checkedKeys, oJson) => {
    setCheckKeyList(checkedKeys);
    let parentCheckKeys = oJson.indeterminateKeys as any[];
    setCheckeyWithParentList(parentCheckKeys);
    setCheckboxAllE(
      parentCheckKeys.length + checkedKeys.length ===
        allCheckBoxKeys.current.length
    );
  };

  const handleCheckboxAll = (checked: boolean) => {
    setCheckboxAllE(checked);
    const newCheckboxList = checked ? allCheckBoxKeys.current : [];
    setCheckKeyList(newCheckboxList);
  };
  const onsubmit = () => {
    // 先映射选择的列
    const selectedKeyMap = [...checkKeyList, ...checkeyWithParentList].reduce(
      (pre, cur) => {
        pre[cur] = true;
        return pre;
      },
      {}
    );

    const resColuns = filterTree(
      JSON.parse(JSON.stringify(localTreeList.current)),
      selectedKeyMap
    );
    console.log("resColuns", resColuns);
    if (typeof onUpdate === "function") {
      onUpdate(resColuns);
    }
    setShowSetting(false);
  };

  const renderClumn = (list: any = []) => {
    if (!list?.length) return;
    return list.map((item) => {
      return (
        <TreeNode key={item.dataIndex} label={item.title}>
          {renderClumn(item.children)}
        </TreeNode>
      );
    });
  };
  return (
    <Popup
      v2
      // trigger={<i className="iconfont iconshezhi" />}
      trigger={<Icon type="set" />}
      triggerType="click"
      placement="br"
      placementOffset={20}
      visible={showSetting}
      onVisibleChange={onVisibleChange}
    >
      <Box className="table-edit-clom">
        <Divider>{title}列配置</Divider>
        <Tree
          checkable
          defaultExpandAll
          isNodeBlock={true}
          isLabelBlock
          showLine={true}
          checkedKeys={checkKeyList}
          onCheck={onCheckChange}
          // useVirtual
          style={{ maxHeight: "300px", overflow: "auto" }}
        >
          {renderClumn(localTreeList.current)}
        </Tree>
        <div>
          <Divider />
          <Box direction="row" spacing={15} align="center" justify="flex-end">
            <Checkbox checked={checkboxAllE} onChange={handleCheckboxAll}>
              全选
            </Checkbox>
            <Button type="primary" size="small" onClick={onsubmit}>
              确定
            </Button>
          </Box>
        </div>
      </Box>
    </Popup>
  );
};

export default React.memo(SettingColumns);
