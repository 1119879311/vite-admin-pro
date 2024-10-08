// Your TypeScript file where you extend fabric.Object
import { fabric } from "fabric";
// import "./fabric"; // Make sure to import your fabric.d.ts file
function invertColor(color) {
  let invertedColor = "";
  if (color.indexOf("#") === 0) {
    // 十六进制颜色
    const hex = color.slice(1);
    if (hex.length === 3) {
      // 缩写形式，比如 "#333"
      invertedColor =
        "#" +
        (15 - parseInt(hex[0], 16)).toString(16) +
        (15 - parseInt(hex[1], 16)).toString(16) +
        (15 - parseInt(hex[2], 16)).toString(16);
    } else if (hex.length === 6) {
      // 完整形式，比如 "#333333"
      invertedColor =
        "#" +
        (255 - parseInt(hex.substring(0, 2), 16))
          .toString(16)
          .padStart(2, "0") +
        (255 - parseInt(hex.substring(2, 4), 16))
          .toString(16)
          .padStart(2, "0") +
        (255 - parseInt(hex.substring(4, 6), 16)).toString(16).padStart(2, "0");
    }
  } else if (color.indexOf("rgba") === 0) {
    // rgba 颜色
    const rgba = color.match(/rgba?\((\d+), (\d+), (\d+)(, [\d.]+)?\)/);
    invertedColor = `rgba(${255 - rgba[1]}, ${255 - rgba[2]}, ${
      255 - rgba[3]
    }, ${rgba[4] ? rgba[4] : "1"})`;
  }
  return invertedColor;
}
export function createCustomObjectText() {
  fabric.Object.prototype.customTextOptions = {
    text: "",
    visible: true,
    color: "#000",
    fontSize: 12,
    alignment: "right-top",
    offsetX: 0,
    offsetY: 0,
  };
  fabric.Object.prototype.drawObject = (function (originalDrawObject) {
    return function (ctx) {
      // 调用原始的 drawObject 方法
      /** @ts-ignore  */
      let instance = this as any;
      originalDrawObject.call(instance, ctx);

      // 如果有自定义文本选项，则绘制文本
      if (instance.customTextOptions && instance.customTextOptions.visible) {
        const textOptions = instance.customTextOptions;
        const position = instance.calculateTextPosition(ctx, textOptions);

        // 渲染文本
        ctx.save();

        // 设置背景颜色样式
        let textColor = textOptions.color || "#000";
        ctx.fillStyle = invertColor(textOptions.color);

        // 获取文本的宽度和高度（包括行间距）

        const textWidth = ctx.measureText(textOptions.text).width;
        const textHeight = textOptions.fontSize; // 简单近似文本高度

        // 绘制背景矩形
        ctx.fillRect(
          position.x,
          position.y - textHeight * 1.5,
          textWidth * 1.5,
          textHeight * 1.5
        );

        ctx.fillStyle = textColor;
        ctx.font = `${textOptions.fontSize}px ${
          textOptions.fontFamily || "Arial"
        }`;

        ctx.fillText(textOptions.text, position.x, position.y);
        ctx.restore();
      }
    };
  })(fabric.Object.prototype.drawObject);

  // Define calculateTextPosition somewhere in your code
  fabric.Object.prototype.calculateTextPosition = function (ctx, options) {
    // Your position calculation logic

    const objectCenter = this.getCenterPoint(); // 当前中心位置: 相对于 (0,0) -(left + (width/2))
    const boundingRect = this.getBoundingRect(true);
    // 获得对象的局部坐标
    let x = 0,
      y = 0;
    switch (this.type) {
      case "rect":
        x = -(boundingRect.width / 2);
        y = -(boundingRect.height / 2);
        console.log("posiont", x, y);
        console.log("objectCenter", objectCenter, boundingRect);
        break;

      default:
        break;
    }

    return { x, y };
  };

  fabric.Object.prototype.set = (function (set) {
    return function (property: string | { [key: string]: any }, value?: any) {
      /** @ts-ignore  */
      let instance = this as any;
      if (typeof property === "string") {
        if (property === "customTextOptions" && typeof value === "object") {
          instance.customTextOptions = {
            ...instance.customTextOptions,
            ...value,
          };
          instance.dirty = true; // Mark the object as needing a render
        } else {
          /** @ts-ignore  */
          set.call(instance, property, value);
        }
      } else if (typeof property === "object") {
        // If an object is passed, iterate over the properties
        for (const propName in property) {
          // Use set method for each property in the object
          instance.set(propName, property[propName]);
        }
      }
      return instance;
    };
  })(fabric.Object.prototype.set);
}
