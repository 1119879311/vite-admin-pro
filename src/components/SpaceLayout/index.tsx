import React from "react";
import "./index.less";
import {
  IChildrenPorps,
  IHorizontalProps,
  IbaseProps,
  IverticalProps,
} from "./type";

const classPrex = "a_spaceLayout";

export const SpaceLayoutSrcoller: React.FC<IbaseProps> = ({
  className = "",
  children,
  ...baseProps
}) => {
  return (
    <div className={`${classPrex}-body ${className}`} {...baseProps}>
      <div className={`${classPrex}-body-srcoll`}>{children}</div>
    </div>
  );
};

export const SpaceLayotChild: React.FC<IChildrenPorps> = ({
  children,
  ellipsis,
  isScroll,
}) => {
  return (
    <>
      {ellipsis ? (
        <div className={`${classPrex}-body ellipsis`}>{children}</div>
      ) : isScroll ? (
        <SpaceLayoutSrcoller>{children}</SpaceLayoutSrcoller>
      ) : (
        children && (
          <div className={`${classPrex}-body-default`}>{children}</div>
        )
      )}
    </>
  );
};
// vertical 垂直
export const SpaceLayoutVertical: React.FC<IverticalProps> = ({
  children,
  header,
  footer,
  ellipsis,
  isScroll = true,
  className = "",
  layout = "no-layout",
  ...baseProps
}) => {
  return (
    <div
      className={`${classPrex}-container-vertical ${layout} ${className}`}
      {...baseProps}
    >
      {header && <div className={`${classPrex}-header`}>{header}</div>}
      <SpaceLayotChild isScroll={isScroll} ellipsis={ellipsis}>
        {children}
      </SpaceLayotChild>
      {footer && <div className={`${classPrex}-footer`}>{footer}</div>}
    </div>
  );
};

// 水平

export const SpaceLayoutHorizontal: React.FC<IHorizontalProps> = ({
  children,
  left,
  right,
  className = "",
  ellipsis,
  isScroll = true,
  layout = "no-layout",
  ...baseProps
}) => {
  return (
    <div
      className={`${classPrex}-container-horizontal ${layout} ${className}`}
      {...baseProps}
    >
      {left && <div className={`${classPrex}-left`}>{left} </div>}
      <SpaceLayotChild isScroll={isScroll} ellipsis={ellipsis}>
        {children}
      </SpaceLayotChild>
      {right && <div className={`${classPrex}-right`}>{right}</div>}
    </div>
  );
};
