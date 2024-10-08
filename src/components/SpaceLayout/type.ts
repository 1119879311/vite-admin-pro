export interface IbaseProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export interface IChildrenPorps extends IbaseProps {
  ellipsis?: boolean;
  isScroll?: boolean;
}

type Ilayout = "between" | "center" | "around" | "start" | "end" | "no-layout";

//水平
export interface IHorizontalProps extends IChildrenPorps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  layout?: Ilayout;
}

// vertical 垂直

export interface IverticalProps extends IChildrenPorps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  layout?: Ilayout;
}

/**
 * 上：左右中
 * 中：左右中
 * 下：上下
 */
export interface ILayoutSpacePorps {}
