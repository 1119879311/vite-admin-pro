import { SpaceLayoutHorizontal } from "@/components/SpaceLayout";
import createStore from "@/utils/store";
import { Button } from "antd";
import React, { FC, useState } from "react";

const createStateModel = (initVlaue: any) => {
  const [state, setState] = useState(initVlaue);
  return {
    default: { state, setState },
    // user: { name: "admin" },
  };
};

const Store = createStore(
  () => createStateModel(10),
  {} as ReturnType<typeof createStateModel>
);
// const createState = (type?: any) => {
//   console.log("-----", type);
//   const useCreateState = () => {
//     const [state, setState] = useState(1);
//     return [state, setState];
//   };

//   return useCreateState;
// };

// const createStateModel = (initialState: any) => {
//   const [state, setState] = useState(initialState);
//   return { state, setState };
// };

// const outState = createStateModel(2);

const Child1 = React.memo(() => {
  const models = Store.useModel("default");
  console.log("child1", models.state);
  return (
    <div>
      {/* {outState.state} */}
      {models.state}
      {/* {state} */}
      <Button onClick={() => models.setState(models.state + 1)}>点击</Button>
    </div>
  );
});

const Child: FC<{ useCustom: typeof createStateModel }> = ({ useCustom }) => {
  const { state, setState } = Store.useModel("default");
  console.log("Child", state);
  return (
    <div>
      {/* {outState.state} */}
      {state}
      {/* {state} */}
      <Button onClick={() => setState(state + 1)}>点击</Button>
    </div>
  );
};

export const LayoutTest1 = () => {
  // const useCustom = createState(1);
  // const [state, setState] = useCustom();
  const models = Store.useModel("default");
  console.log("LayoutTest1", models);
  return (
    <Store.Provider>
      <div style={{ width: "100%", height: "500px" }}>
        {/* parent:{state} */}
        <hr />
        <Child />
        <Child1 />
        <SpaceLayoutHorizontal
          left={"left"}
          // right={"right"}
          // layout="between"
          // ellipsis
          isScroll={false}
        >
          cneter
        </SpaceLayoutHorizontal>
      </div>
    </Store.Provider>
  );
};
