import { fabric } from "fabric";
// 通用控制点位置处理函数
function controlPositionHandler(pointIndex, fabricObject) {
  var x, y;
  if (fabricObject.type === "line") {
    x = pointIndex === "p0" ? fabricObject.x1 : fabricObject.x2;
    y = pointIndex === "p0" ? fabricObject.y1 : fabricObject.y2;
  } else {
    var points = fabricObject.points;
    x = points[pointIndex].x - fabricObject.pathOffset.x;
    y = points[pointIndex].y - fabricObject.pathOffset.y;
  }
  return fabric.util.transformPoint(
    { x: x, y: y } as fabric.Point,
    fabricObject.calcTransformMatrix()
  );
}

// 通用控制点行为处理函数
function controlActionHandler(_, transform, x, y) {
  var fabricObject = transform.target,
    currentControl = fabricObject.controls[transform.corner],
    mouseLocalPosition = fabricObject.toLocalPoint(
      new fabric.Point(x, y),
      "center",
      "center"
    ),
    pointIndex = currentControl.pointIndex;

  if (fabricObject.type === "line") {
    fabricObject.set({
      ["x" + (pointIndex + 1)]: mouseLocalPosition.x,
      ["y" + (pointIndex + 1)]: mouseLocalPosition.y,
    });
  } else {
    var points = fabricObject.points;
    points[pointIndex].x = mouseLocalPosition.x + fabricObject.pathOffset.x;
    points[pointIndex].y = mouseLocalPosition.y + fabricObject.pathOffset.y;
    fabricObject.set({ points: points });
  }
  fabricObject.setCoords(); // This is needed to update the controls' positions
  return true;
}

// 动态添加控制点
export function addControlsToShape(fabricObject) {
  var points = fabricObject.points || [
    { x: fabricObject.x1, y: fabricObject.y1 },
    { x: fabricObject.x2, y: fabricObject.y2 },
  ];
  var controls = (fabricObject.controls = {});

  points.forEach(function (point, index) {
    var pointIndex = index.toString();
    controls[pointIndex] = new fabric.Control({
      positionHandler: function (dim, finalMatrix) {
        return controlPositionHandler(pointIndex, fabricObject);
      },
      actionHandler: controlActionHandler,
      actionName: "modifyShape",
      // @ts-ignore
      pointIndex: index,
    });
  });
}
