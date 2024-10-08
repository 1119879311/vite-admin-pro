import { Button, Input } from "antd";
import React, { FC, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import DragContainer from "../Test2/components/DragContainer";

interface ItemType {
  id: number;
  name: string;
}

const BasicFunction: FC = (props) => {
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: "shrek-1" },
    { id: 2, name: "fiona-2" },
    { id: 3, name: "werwe-3" },
  ]);
  const onEnd = (option) => {
    const { newIndex, oldIndex } = option;
    const newData = [...state];
    newData.splice(newIndex, 0, newData.splice(oldIndex, 1)[0]);
    console.log("onEnd", option);
    setState(newData);
  };
  const onUpdate = (option) => {
    console.log("onUpdate", option);
  };
  const onChange = (option) => {
    console.log("onChange", option);
  };

  const onReset = () => {
    const newData = [...state];
    let newIndex = newData.findIndex((item) => item.id == 1);
    let listIndex = newData
      .map((_, index) => index)
      .filter((index) => index !== newIndex);
    let moveIndex = listIndex[Math.floor(Math.random() * (newData.length - 1))];
    newData.splice(moveIndex, 0, newData.splice(newIndex, 1)[0]);
    // setState(newData.splice(0));
    console.log("newData", newData, newIndex, listIndex, moveIndex);
    setState(newData);
  };
  console.log("render", state);
  return (
    <div>
      <Button onClick={onReset}>reset</Button>
      <DragContainer
        className="sort-warp"
        dragOption={{
          fallbackOnBody: true,
          onEnd,
          onUpdate,
          onChange,
        }}
        list={state}
        render={(item, index) => {
          console.log("--renderitem-", item, index);
          return (
            <div key={`${item.id}`} data-index={index}>
              {item.name}
              <Input />
            </div>
          );
        }}
      >
        {state.map((item, index) => {
          return (
            <div key={`${item.id}`} data-index={index}>
              {item.name}
              <Input />
            </div>
          );
        })}
      </DragContainer>
    </div>

    // <ReactSortable
    //   id="sdfdsf"
    //   className="sort-warp"
    //   fallbackOnBody
    //   swapThreshold={0.65}
    //   ghostClass="sortable-ghost2" // drop placeholder的css类名
    //   chosenClass="sortable-chosen2" // 被选中项的css 类名
    //   dragClass="sortable-drag" // 正在被拖拽中的css类名
    //   group={{ name: "sort" }}
    //   // sort={false}
    //   onAdd={onAdd}
    //   list={[]}
    //   setList={(data) => {
    //     // console.log("data", data);
    //   }}
    //   onEnd={onEnd}
    // >
    //   {state.map((item, index) => (
    //     <div key={item.id} data-index={index}>
    //       {item.name}
    //       <Input />
    //     </div>
    //   ))}
    // </ReactSortable>
  );
};

export default BasicFunction;
