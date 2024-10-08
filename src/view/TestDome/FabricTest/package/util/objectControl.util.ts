import { fabric } from "fabric";
// 删除按钮图片 base64
const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
let deleteImg = document.createElement("img");
deleteImg.src = deleteIcon;
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
// 渲染元素的icon按钮
function renderIcon(icon) {
  return function (ctx, left, top, styleOverride, fabricObject) {
    /** @ts-ignore  */
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}
// 删除对象
function deleteObject(eventData, transform) {
  var target = transform.target;
  var canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
}
// fabric.Object.prototype.controls.deleteControl = new fabric.Control({
//   x: 0.5,
//   y: -0.5,
//   offsetY: -16,
//   offsetX: 16,
//   cursorStyle: "pointer",
//   /** @ts-ignore  */
//   // mouseUpHandler: deleteObject,
//   render: renderIcon(deleteImg),
//   /** @ts-ignore  */
//   cornerSize: 24,
// });

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

export function setGlobalConttrolsPointStyle(option?: Record<string, any>) {
  const {
    transparentCorners = false,
    cornerStyle = "circle",
    cornerColor = "#1efafb",
    cornerSize = 10,
    borderColor = "#1efafb",
    cornerStrokeColor = "#1efafb",
    borderDashArray = [3, 3],
  } = option || {};
  fabric.Object.prototype.transparentCorners = transparentCorners; // 控制点的颜色
  fabric.Object.prototype.cornerStyle = cornerStyle; // 控制点的形状
  fabric.Object.prototype.cornerColor = cornerColor;
  fabric.Object.prototype.cornerSize = cornerSize; // 控制点的大小
  fabric.Object.prototype.borderColor = borderColor; // 边框的颜色
  fabric.Object.prototype.cornerStrokeColor = cornerStrokeColor;
  fabric.Object.prototype.borderDashArray = borderDashArray;
}
