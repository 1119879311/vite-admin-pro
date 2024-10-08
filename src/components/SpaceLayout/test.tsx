import { SpaceLayoutHorizontal } from ".";
import React from "react";
export const LayoutTest1 = () => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <SpaceLayoutHorizontal left={"left"} right={"right"} isScroll={false}>
        1212
      </SpaceLayoutHorizontal>
    </div>
  );
};

export default () => {
  return <LayoutTest1></LayoutTest1>;
};
