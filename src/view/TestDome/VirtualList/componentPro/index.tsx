import React, { useMemo, useRef, useState } from "react";
import "./index.less";

export default function Vlist(props) {
  const { list = [] } = props;
  const viewport = useRef<HTMLDivElement>(null); // 可视区域
  const listArea = useRef(null); // 渲染区域
  const phantom = useRef(null); // 占位区域，列表总高度

  // 每项列表的高度
  const itemSize = 100;
  // 列表总高度
  const phantomHeight = list.length * itemSize;
  // 渲染数量
  const viewCount = 10;
  // 开始index
  const [startIndex, setstartIndex] = useState(0);
  // 结束index
  const endIndex = useMemo(() => startIndex + viewCount, [startIndex]);
  // 偏移量
  const [startOffset, setstartOffset] = useState(0);

  // 获取startIndex
  const getStartIndex = (scrollTop) => {
    return Math.floor(scrollTop / itemSize);
  };

  // 获取startOffset
  const getStartOffset = (startIndex) => {
    return startIndex * itemSize;
  };

  // 是否在显示范围之间
  const isBetweenViewRanges = (index) => {
    return index >= startIndex && index <= endIndex;
  };

  /**
   * 获取滚动距离 scrollTop
   * 根据 scrollTop 和 itemSize 计算出 startIndex 和 endIndex
   * 根据 scrollTop 和 itemSize 计算出 startOffset
   * 显示startIndex 和 endIndex之间的元素
   * 设置listArea的偏移量为startOffset
   */
  const onScroll = () => {
    const scrollTop = viewport.current?.scrollTop; // 滚动距离
    const startIndex = getStartIndex(scrollTop);
    setstartIndex(startIndex);

    const startOffset = getStartOffset(startIndex);
    setstartOffset(startOffset);
  };

  return (
    <div className="viewport" ref={viewport} onScroll={onScroll}>
      <div
        className="list-phantom"
        ref={phantom}
        style={{ height: `${phantomHeight}px` }}
      ></div>
      <div
        className="list-area"
        ref={listArea}
        style={{ transform: `translate3d(0,${startOffset}px,0)` }}
      >
        {list.map(
          (item, index) =>
            isBetweenViewRanges(index) && (
              <div
                key={item.id}
                className="list-item"
                style={{ height: itemSize + "px", lineHeight: itemSize + "px" }}
              >
                {item.id}
              </div>
            )
        )}
      </div>
    </div>
  );
}
