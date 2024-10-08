// const ClipperLib = require('clipper-lib');
import ClipperLib from "clipper-lib";


// 定义一个有效的外环和无效的内环
const outerPolygon = [
    { X: 0, Y: 0 },
    { X: 1000, Y: 0 },
    { X: 1000, Y: 1000 },
    { X: 0, Y: 1000 },
    { X: 0, Y: 0 } // 闭合外环
];

const invalidInnerPolygon = [ // 无效的内环
    { X: 400, Y: 400 },
    { X: 600, Y: 400 },
    { X: 600, Y: 600 },
    { X: 400, Y: 600 },
    { X: 400, Y: 400 } // 闭合内环
];

// 定义一个折线
const polyline = [
    { X: 100, Y: 100 },
    { X: 800, Y: 100 },
    { X: 800, Y: 800 },
    // ... 添加更多折线点
];

// 检测折线的每一段是否与多边形相交的函数
function doesSegmentIntersectPolygon(polyline, polygon) {
    const clipper = new ClipperLib.Clipper();

    for (let i = 0; i < polyline.length - 1; i++) {
        const segment = [polyline[i], polyline[i + 1]];

        const clipperSegment = new ClipperLib.Path();
        clipperSegment.push(segment[0]);
        clipperSegment.push(segment[1]);

        const clipperPolygon = new ClipperLib.Path();
        polygon.forEach(pt => clipperPolygon.push(pt));

        const solutionPolyTree = new ClipperLib.PolyTree();
        clipper.AddPath(clipperSegment, ClipperLib.PolyType.ptSubject, false);
        clipper.AddPath(clipperPolygon, ClipperLib.PolyType.ptClip, true);

        // 取交集
        clipper.Execute(ClipperLib.ClipType.ctIntersection, solutionPolyTree, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftEvenOdd);

        clipper.Clear();

        // 是否有相交
        if (solutionPolyTree.Total() > 0) {
            return true;
        }
    }

    return false;
}

// 检测折线是否完全在有效区域内，不横跨无效内环
function isPolylineValid(polyline, outerPolygon, invalidInnerPolygon) {
    // 检查所有点是否在外环内且不在内环内
    const insideOuter = polyline.every(point => ClipperLib.Clipper.PointInPolygon(point, outerPolygon) === 1);
    const outsideInner = polyline.every(point => ClipperLib.Clipper.PointInPolygon(point, invalidInnerPolygon) !== 1);

    // 检查折线是否与无效内环相交
    const intersectsInvalidInner = doesSegmentIntersectPolygon(polyline, invalidInnerPolygon);

    // 折线有效当它完全在外环内，不在任何内环内，且没有与内环相交
    return insideOuter && outsideInner && !intersectsInvalidInner;
}

// 执行检测
const isValid = isPolylineValid(polyline, outerPolygon, invalidInnerPolygon);

console.log(`折线在有效区域内且未横跨无效内环：${isValid}`);