import { BaseBehavior } from "./baseBehaviors";
export class ZoomInBehavior extends BaseBehavior {
  name: string = "ZoomInBehavior";
  zoomDelta = 0.05;
  constructor(markInstance) {
    super(markInstance);
    this.eventHandlerMap = {
      "mouse:wheel": "onMouseWheel",
    };
  }
  onMouseWheel = (opt) => {
    const canvas = this.markInstance.canvasIns;
    if (!canvas) {
      return;
    }

    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= delta < 0 ? 1 + this.zoomDelta : 1 - this.zoomDelta; // 如果滚动向上，则放大，如果滚动向下，则缩小
    if (zoom > 5) zoom = 5; // 设置最大放大倍数
    if (zoom < 0.1) zoom = 0.1; // 设置最小缩小倍数
    canvas.zoomToPoint(
      {
        // 关键点
        x: opt.e.offsetX,
        y: opt.e.offsetY,
      },
      zoom
    );
    opt.e.preventDefault();
    opt.e.stopPropagation();
  };
}
