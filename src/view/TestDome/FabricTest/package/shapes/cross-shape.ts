import { fabric } from "fabric";

export interface ICrossOptions extends fabric.IGroupOptions {
  crossWidth?: number;
  crossHeight?: number;
  strokeWidth?: number;
  fill?: string;
}

export const CrossShape = fabric.util.createClass(fabric.Group, {
  type: "cross",

  initialize(options: ICrossOptions) {
    options || (options = {});

    const verticalRect = new fabric.Rect({
      width: options.strokeWidth,
      height: options.crossHeight,
      fill: options.fill,
      originX: "center",
      originY: "center",
    });

    const horizontalRect = new fabric.Rect({
      width: options.crossWidth,
      height: options.strokeWidth,
      fill: options.fill,
      originX: "center",
      originY: "center",
    });

    const groupItems = [verticalRect, horizontalRect];

    this.callSuper("initialize", groupItems, {
      left: options.left,
      top: options.top,
      originX: "center",
      originY: "center",
      selectable: options.selectable,
      hasBorders: options.hasBorders,
      hasControls: options.hasControls,
    });

    this.set({
      crossWidth: options.crossWidth,
      crossHeight: options.crossHeight,
      strokeWidth: options.strokeWidth,
      fill: options.fill,
    });
  },

  toObject() {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      crossWidth: this.crossWidth,
      crossHeight: this.crossHeight,
      strokeWidth: this.strokeWidth,
      fill: this.fill,
    });
  },
});
