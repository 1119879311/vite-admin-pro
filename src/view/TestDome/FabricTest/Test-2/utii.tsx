import ClipperLib from "clipper-lib";
type IpointType = { X: number; Y: Number; [key: string]: any };
type IpolyItem = Array<IpointType>;
type IpolyList = Array<IpolyItem>;

type ICheckPolyType = "Polypoint" | "Polyline" | "Polygon"; // 点| 线| 面

type IvalidOuterRegions = Array<{ outer: IpolyItem; inners: IpolyList }>;

/*******通用的***** */

/**
 *  检查点是否在多边形内或边界上
 * ClipperLib.Clipper.PointInPolygon 是 Clipper 库提供的一个函数，用于判断一个点是否在某个多边形内部、边界上或者外部。
 * @param point {X:number,Y:number}  点的位置
 * @param polygon Array<{X:number,Y:number}> 多边形的坐标(需要一个闭合区域)
 * @returns { -1| 0 | 1 }
 *           1: 点在多边形内部。
 *          -1: 点在多边形边界上
 *           0: 点在多边形外部。
 */
function isPointInOrOnPolygon(point: IpointType, polygon: IpolyItem) {
  const result = ClipperLib.Clipper.PointInPolygon(point, polygon);
  // console.log("isPointInOrOnPolygon", result, point, polygon);
  return result !== 0; // 如果点在多边形内部或边界上，返回 true
}

/*********检测点的 start **************** */

// 检查点是否在有效区域内，并且不在任何无效内环内
export function isPointValid(
  point: IpointType,
  validOuterRegions: IvalidOuterRegions
) {
  for (const region of validOuterRegions) {
    if (isPointInOrOnPolygon(point, region.outer)) {
      // 点在有效区域外环内部或边界上，检查是否在无效内环内
      const insideInvalidInner = region.inners.some((invalidInner) =>
        isPointInOrOnPolygon(point, invalidInner)
      );
      if (!insideInvalidInner) {
        return true;
      }
    }
  }
  return false;
}

/*********检测点的 end **************** */

/*********检测折线(不闭合的线) start **************** */

/**
 * 检测条件： 每一条折线都须在有效区域内，且不能与无效内环相交
 * 检测流程：
 *    1. 所有的点都需要在有效区域，不能再落在内环(内环可能存在有效区域)，不能作为判断失败或者成立条件
 *    2. 判断两点之间的直线是否横跨无效区域，横跨就不通过
 */

// 检测折线的每一段是否与多边形相交的函数
function checkLineCutPolygon(polyline: IpolyItem, polygon: IpolyItem) {
  const clipper = new ClipperLib.Clipper();

  for (let i = 0; i < polyline.length - 1; i++) {
    const segment = [polyline[i], polyline[i + 1]];

    // 创建路径裁剪方式检测
    const clipperSegment = new ClipperLib.Path();
    clipperSegment.push(segment[0]);
    clipperSegment.push(segment[1]);

    const clipperPolygon = new ClipperLib.Path();
    polygon.forEach((pt) => clipperPolygon.push(pt));

    const solutionPolyTree = new ClipperLib.PolyTree();
    clipper.AddPath(clipperSegment, ClipperLib.PolyType.ptSubject, false);
    clipper.AddPath(clipperPolygon, ClipperLib.PolyType.ptClip, true);

    // 取交集
    clipper.Execute(
      ClipperLib.ClipType.ctIntersection,
      solutionPolyTree,
      ClipperLib.PolyFillType.pftEvenOdd,
      ClipperLib.PolyFillType.pftEvenOdd
    );

    clipper.Clear();

    // 是否有相交
    if (solutionPolyTree.Total() > 0) {
      return true;
    }
  }

  return false;
}

/**
 *
 * @param polyline
 * @param validOuterRegions
 * @returns
 */
export function isLineSegmentValid(
  polyline: IpolyItem,
  validOuterRegions: IvalidOuterRegions
) {
  // 检查线段的所有端点是否有效
  for (let i = 0; i < polyline.length; i++) {
    if (!isPointValid(polyline[i], validOuterRegions)) {
      return false;
    }
  }

  // 检查线段是否与任何无效内环相交
  for (const region of validOuterRegions) {
    if (isPolygonCompletelyInsideAnother(polyline, region.outer)) {
      const intersectsInvalidInner = region.inners.some((invalidInner) =>
        checkLineCutPolygon(polyline, invalidInner)
      );
      if (intersectsInvalidInner) {
        return false; // 线段与无效内环相交
      }
    }
  }
  return true;
}

/*********检测折线 end **************** */

/************检测多边形的(闭合的线) start************************** */

/**
 * 成立条件： 所有点必须落在有效区域，形成面不能与无效内环(存在有效区内)有交集
 * 检测流程：
 *  1. 先检测所有点形成的面是否在有效区域
 *  2. 是否存在无效内环区域
 *     2.1 有： 是否与之相交，相交 不通过，无相交通过
 *     2.2 没有，则通过
 *
 */

/**
 *   检查一个多边形是否完全在另一个多边形内(所有点都在一个多边形内)
 * @param  polygon  Array<{X:number,Y:number}>
 * @param containerPolygon   Array<{X:number,Y:number}>
 * @returns
 */
function isPolygonCompletelyInsideAnother(
  polygon: IpolyItem,
  containerPolygon: IpolyItem
) {
  let result = polygon.every((point) =>
    isPointInOrOnPolygon(point, containerPolygon)
  );

  return result;
}

/**
 * 检测原数据中多边形(闭合的)是否已经包含了无效的内环
 */
export function isCheckInnerInWithRawPoly(rawData: IpolyList, innerPoly = []) {
  return rawData.some((rawItem) =>
    isPolygonCompletelyInValidArea(innerPoly, [{ outer: rawItem, inners: [] }])
  );
}

/**
 * 检查两个多边形是否有交集,主要用于检测对象是否与无效的内环有相交
 * @param poly1 Array<{X:number,Y:number}>
 * @param poly2 Array<{X:number,Y:number}>
 * @returns
 */
function polygonsIntersect(poly1: IpolyItem, poly2: IpolyItem) {
  const clipper = new ClipperLib.Clipper();
  const solution = new ClipperLib.PolyTree();
  clipper.AddPaths([poly1], ClipperLib.PolyType.ptSubject, true);
  clipper.AddPaths([poly2], ClipperLib.PolyType.ptClip, true);
  clipper.Execute(
    ClipperLib.ClipType.ctIntersection,
    solution,
    ClipperLib.PolyFillType.pftEvenOdd,
    ClipperLib.PolyFillType.pftEvenOdd
  );
  return solution.ChildCount() > 0;
}

/**
 * 判断给定的多边形是否完全落在多个有效区域内
 * @param testPolygon
 * @param validOuterRegions
 * @returns
 */
export function isPolygonCompletelyInValidArea(
  testPolygon: IpolyItem,
  validOuterRegions: IvalidOuterRegions
) {
  for (const region of validOuterRegions) {
    const result = isPolygonCompletelyInsideAnother(testPolygon, region.outer);
    if (result) {
      // 测试多边形在有效区域外环内，检查是否与无效内环有交集
      const intersectsInvalidInner = region.inners.some((invalidInner) =>
        polygonsIntersect(testPolygon, invalidInner)
      );

      if (!intersectsInvalidInner) {
        return true; // 不与任何无效内环有交集
      }
    }
  }
  return false; // 不在任何有效区域内或与无效内环有交集
}

/************检测多边形的(闭合的线) end ************************** */

/************ 特定数据业务处理 ************************** */

/**
 * 将多个多边形（有可能存在相交)进行合拼多个多边形(并集), 会保留产生的闭环
 */
export function getUnionPolyTree(rectangles: IpolyList) {
  const c1 = new ClipperLib.Clipper();
  rectangles.forEach((rect) => {
    c1.AddPath(rect, ClipperLib.PolyType.ptSubject, true);
  });

  const polyTree1 = new ClipperLib.PolyTree();
  c1.Execute(
    ClipperLib.ClipType.ctUnion,
    polyTree1,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero
  );

  return {
    polyTree: polyTree1,
    clipperIns: c1,
  };
}

/**
 * 获取有效的外环和闭环
 */
export function getValidOuterRegions(polyTree, rawData: IpolyList) {
  const validOuterRegions: IvalidOuterRegions = [];

  const childPaths = polyTree.m_AllPolys;

  const outerRegions: IpolyList = [];
  const innerRegions: IpolyList = [];

  childPaths.forEach((node) => {
    if (!node.IsHole()) {
      const inners: IpolyList = [];
      const outer = node.Contour();
      outerRegions.push(outer);

      node.Childs().forEach((holeNode) => {
        const innerItem = holeNode.Contour();
        if (!isCheckInnerInWithRawPoly(rawData, innerItem)) {
          inners.push(innerItem);
          innerRegions.push(innerItem);
        }
      });
      validOuterRegions.push({
        outer,
        inners,
      });
    }
  });

  return {
    validOuterRegions,
    innerRegions,
    outerRegions,
  };
}

/**
 * 统一入口检测 点，线，面是否在有效区域内
 * @param type
 * @param checkTarget
 * @param validOuterRegions
 * @returns
 */
export function isCheckInvalidArea(
  type: ICheckPolyType,
  checkTarget: IpolyItem | IpointType,
  validOuterRegions: IvalidOuterRegions
) {
  if (type == "Polypoint") {
    return isPointValid(checkTarget as IpointType, validOuterRegions);
  }
  if (type == "Polyline") {
    return isLineSegmentValid(checkTarget as IpolyItem, validOuterRegions);
  }
  if (type == "Polygon") {
    return isPolygonCompletelyInValidArea(
      checkTarget as IpolyItem,
      validOuterRegions
    );
  }
}

export function computeCompilePoly(rawData: IpolyList) {
  const { polyTree } = getUnionPolyTree(rawData);
  const { validOuterRegions, outerRegions, innerRegions } =
    getValidOuterRegions(polyTree, rawData);

  return {
    validOuterRegions,
    outerRegions,
    innerRegions,
    isCheckInvalidArea: (
      checkTarget: IpolyItem | IpointType,
      type: ICheckPolyType
    ) => isCheckInvalidArea(type, checkTarget, validOuterRegions),
  };
}

/**
 * 坐标点转为小写
 * @param polyPoint
 * @returns
 */
export function pointToLowerCase(polyPoint) {
  if (Array.isArray(polyPoint)) {
    /**
     *  1. [ [{x,y}] ]
     *  2. [{x,y}]
     *  3. [ "L|M",x,y ] 路径格式:
     */
    return polyPoint.map((item) => pointToLowerCase(item));
  } else if (Object.prototype.toString.call(polyPoint) == "[object Object]") {
    return { x: polyPoint.X, y: polyPoint.Y, ...polyPoint };
  }
  throw new Error("数据格式报错了");
}

/**
 * 提取坐标点转化为cilpper 识别的格式 {X:number,Y:number}
 * 分两种情况，坐标点和路径
 */
export function pointToUpperCase() {}
