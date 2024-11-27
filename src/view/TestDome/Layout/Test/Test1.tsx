import { SpaceLayoutHorizontal } from "@/components/SpaceLayout";
import createStore from "@/utils/store";
import { Button } from "antd";
import React, { FC, useState } from "react";

const useDefaultModel = (initVlaue=1111)=>{
  const [state, setState] = useState(initVlaue);
  return {
    state,setState
  }
}

const createStateModel = () => {
  const defaultModel = useDefaultModel()
  return {
    default:defaultModel,
    user: { name: "admin" },
  };
};

const Store = createStore(createStateModel);

const Child1 = React.memo(() => {
  const models = Store.useModel('default');
  const model = Store.useModel("user")
  const modelAll = Store.useModelAll()

  console.log("child1", models,model.name,modelAll.user.name);
  return (
    <div>
      {/* {outState.state} */}
      {models.state}
      {/* {state} */}
      <Button onClick={() => models.setState(models.state + 1)}>点击</Button>
    </div>
  );
});

const Child: FC<{ useCustom?: typeof createStateModel }> =React.memo( ({ useCustom }) => {
  // const { state, setState } = Store.useModel("default");
  // Store.useModel("user")
  console.log("Child");
  return (
    <div>Child  
      {/* {outState.state} */}
      {/* {state} */}
      {/* {state} */}
      {/* <Button onClick={() => setState(state + 1)}>点击</Button> */}
    </div>
  );
})

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
