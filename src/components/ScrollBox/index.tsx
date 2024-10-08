import Flex, { IFlexProps } from "@/components/Flex";
import React, { PropsWithChildren, useMemo } from "react";
import "./index.less";
interface IScrollBox extends IFlexProps {
  innerClassName?: string;
  innerProps?: Omit<IFlexProps, "display" | "className">;
}

const ScrollBox: React.FC<PropsWithChildren<IScrollBox>> = ({
  children,
  className = "",
  innerClassName = "",
  innerProps = {},
  ...props
}) => {
  return (
    <Flex
      flex={"auto"}
      height={"100%"}
      {...props}
      className={`scroll_box_warp ${className}`}
    >
      <Flex
        {...innerProps}
        display="block"
        className={`scroll_box_inner ${innerClassName}`}
      >
        {children}
      </Flex>
    </Flex>
  );
};

export default ScrollBox;
