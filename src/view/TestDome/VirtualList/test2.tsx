import { Button, Checkbox, Result } from "antd";
import VirtualList, { IVirtualListForward } from "./components/index";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import testJsom from "./guaziche.json";
import ImageCompent from "./Image";
import { dataList, groupDataList, getGroupIdMapIdx } from "./data";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

const RenderSingeItme = ({ isShowDelete, ...props }) => {
  return (
    <div
      className={`list-item ${
        props.ativeIndex === props.index ? "is-active" : ""
      }`}
    >
      <div className="list-item-content">
        <div
          onClick={() => props.onSelect(props.index, props)}
          className="list-item-images"
        >
          <ImageCompent {...props} src={props.carImg} id={props.key} />
        </div>
        <div className="item-index">{props.index}</div>
        {isShowDelete && (
          <Checkbox
            className="list-item-checkbox"
            key={props.id}
            value={props.id}
            onChange={(e: CheckboxChangeEvent) => {
              e.preventDefault();
            }}
          ></Checkbox>
        )}
      </div>
    </div>
  );
};

const RenderGroupItem = ({
  id,
  dataList = [],
  groupIdMapIdx,
  ativeIndex,
  index,
  successCallback,
  getChacheImage,
  onSelect,
  isGroup,
  isShowDelete,
  ...props
}) => {
  const innerIndex = groupIdMapIdx[id] || 0;
  const itemProps: Record<string, any> = dataList[innerIndex];
  //   console.log("id", props, id, dataList, itemProps);
  if (!itemProps) {
    return;
  }

  return (
    <div
      className={`list-item list-itme-group ${
        ativeIndex === index ? "is-active" : ""
      }`}
    >
      <div className="list-item-content">
        <div
          className="list-item-images"
          onClick={() => onSelect(index, props)}
        >
          <ImageCompent
            {...itemProps}
            successCallback={successCallback}
            getChacheImage={getChacheImage}
            src={itemProps.carImg}
            id={itemProps.key}
          />
        </div>

        <div className="item-index">
          {index}-{innerIndex}
        </div>
        {isShowDelete && (
          <Checkbox
            className="list-item-checkbox"
            key={id}
            value={id}
            onChange={(e: CheckboxChangeEvent) => {
              e.preventDefault();
            }}
          ></Checkbox>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [isGroup, toggleGroup] = useState(true);
  const listRef = useRef<IVirtualListForward>(null);
  const page = useRef(0);
  const [index, setIndex] = useState<number>(0);

  const [isShowDelete, setIsShowDelete] = useState<boolean>(false);
  const chacheImageMap = useRef(new Map());
  const [data, setData] = useState(isGroup ? groupDataList : dataList);

  const [groupIdMapIdx, setGroupIdMapIdx] = useState(
    isGroup ? getGroupIdMapIdx(groupDataList) : {}
  );

  const onClickPage = (type: string) => {
    if (listRef.current) {
      let oldIndex = page.current;
      console.log("page.current", oldIndex);
      if (type === "+") {
        if (oldIndex >= data.length - 1) {
          return;
        }
        page.current = oldIndex + 1;
      } else if (type === "-") {
        if (oldIndex <= 0) {
          return;
        }
        page.current = oldIndex - 1;
      }

      listRef.current.goPage(page.current);
    }
  };
  const onClickIndex = (type: string) => {
    if (listRef.current) {
      let newIndex = index;

      if (type === "+") {
        if (index >= data.length - 1) {
          return;
        }
        newIndex = index + 1;
      } else if (type === "-") {
        if (index <= 0) {
          return;
        }
        newIndex = index - 1;
      }
      console.log("index.current", newIndex);
      setIndex(newIndex);
      listRef.current.goIndex(newIndex);
    }
  };

  const onSelect = (selectIndex: number, item?: any) => {
    if (selectIndex === index) {
      return;
    }
    setIndex(selectIndex);
    listRef.current?.goIndex(selectIndex);
  };

  const onGetChacheImage = useCallback(() => {
    console.log("chache:", chacheImageMap.current);

    console.log("data:", data.length);
  }, []);

  const onClearChacheImage = useCallback(() => {
    chacheImageMap.current?.clear();
  }, []);

  const successCallback = useCallback(({ id, image }) => {
    const chache = chacheImageMap.current;
    if (chache && image && id) {
      chache.set(id, image);
    }
  }, []);
  const getChacheImage = useCallback(
    (id) => {
      const chache = chacheImageMap.current;
      return chache && chache.get(id);
    },
    [chacheImageMap]
  );

  return (
    <div className="test2-warp">
      <Button
        onClick={() => {
          const resIsGroup = !isGroup;
          setData(resIsGroup ? groupDataList : dataList);
          setGroupIdMapIdx(resIsGroup ? getGroupIdMapIdx(groupDataList) : {});
          toggleGroup(!isGroup);
        }}
      >
        切换{isGroup ? "单图" : "分组"}模式
      </Button>

      <Button onClick={() => onClickPage("-")}>上一页</Button>
      <Button onClick={() => onClickPage("+")}>下一页</Button>
      <Button onClick={() => onClickIndex("-")}>
        {isGroup ? "上一组" : "上一张"}
      </Button>
      <Button onClick={() => onClickIndex("+")}>
        {isGroup ? "下一组" : "下一张"}
      </Button>

      {isGroup && (
        <Button
          onClick={() => {
            const { id, dataList = [] } = data[index];
            let groupInnerIndex = groupIdMapIdx[id];
            if (groupInnerIndex > dataList.length - 2) return;
            groupIdMapIdx[id] = groupInnerIndex + 1;
            setGroupIdMapIdx({ ...groupIdMapIdx });
          }}
        >
          组内下一张
        </Button>
      )}
      {isGroup && (
        <Button
          onClick={() => {
            const { id } = data[index];
            let groupInnerIndex = groupIdMapIdx[id];
            if (groupInnerIndex < 1) return;
            groupIdMapIdx[id] = groupInnerIndex - 1;
            setGroupIdMapIdx({ ...groupIdMapIdx });
          }}
        >
          组内上一张
        </Button>
      )}
      <Button onClick={onGetChacheImage}>获取缓存图片</Button>
      <Button onClick={onClearChacheImage}>清除缓存图片</Button>
      {isShowDelete ? (
        <>
          <Button>确定</Button>
          <Button onClick={() => setIsShowDelete(false)}>取消</Button>
        </>
      ) : (
        <Button onClick={() => setIsShowDelete(true)}>删除</Button>
      )}

      <div>当前第几张：{index}</div>

      <Checkbox.Group className="virtural-list-horizontal-box">
        <VirtualList
          ref={listRef}
          data={data}
          rowKey="key"
          itemSize={150}
          renderItem={(itemProps) => {
            return isGroup
              ? RenderGroupItem({
                  ...itemProps,
                  isShowDelete,
                  groupIdMapIdx,
                  ativeIndex: index,
                  onSelect: onSelect,
                  successCallback,
                  getChacheImage,
                })
              : RenderSingeItme({
                  ...itemProps,
                  isShowDelete,
                  ativeIndex: index,
                  onSelect: onSelect,
                  successCallback,
                  getChacheImage,
                });
          }}
          layout={"horizontal"}
          totals={data.length}
        />
      </Checkbox.Group>
    </div>
  );
};

export default App;
