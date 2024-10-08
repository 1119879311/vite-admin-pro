import React, { DetailedHTMLProps, PropsWithChildren } from "react";
type IDivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
interface IRowBoxProps extends React.CSSProperties {
  className?: string;
  id?: string;
  option?: Omit<IDivProps, "style" | "id" | "className"> & {
    [key: string]: any;
  };
}
const RowBox = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<IRowBoxProps>
>(({ className, id, option = {}, children, ...style }, ref) => {
  return (
    <div
      ref={ref}
      {...option}
      id={id}
      className={className}
      style={{ ...style }}
    >
      {children}
    </div>
  );
});

export default RowBox;
