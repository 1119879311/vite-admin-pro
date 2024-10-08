import React, { PropsWithChildren, useMemo } from "react";
import "./index.less";
export interface IFlexProps extends React.CSSProperties {
  id?: string;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  attrs?: Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "style" | "onClick" | "id"
  >;
}

const Flex: React.FC<PropsWithChildren<IFlexProps>> = ({
  children,
  onClick,
  className = "",
  flex,
  attrs = {},
  ...styles
}) => {
  const newFlex = useMemo(() => {
    if (typeof flex === "number") {
      return `${flex} ${flex} auto`;
    } else if (/^(\d+(\.\d+)?)(px|%)$/.test(flex as string)) {
      return `0 0 ${flex}`;
    }
    return flex;
  }, [flex]);
  return (
    <div
      {...attrs}
      className={`by_flex ${className}`}
      style={{ ...styles, flex: newFlex }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Flex;
