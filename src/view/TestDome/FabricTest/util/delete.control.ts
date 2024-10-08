import { fabric } from "fabric";
// 定义配置函数，控制是否启用删除控件

export function configureDeleteControl(enableDelete: boolean) {
  // 添加自定义删除控件
  const deleteIcon =
    "M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z"; // SVG path for delete icon

  const deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: 16,
    cursorStyle: "pointer",
    mouseUpHandler: function (_, transform, x: number, y: number) {
      const target = transform.target;
      const canvas = target.canvas;
      canvas?.remove(target);
      canvas?.fire("object:delete", { target });
      canvas?.requestRenderAll();
      return true;
    },
    render: function (ctx, left, top, _, fabricObject) {
      if (enableDelete && (fabricObject as any).active) {
        // Draw a circle
        ctx.save();
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(left, top, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        // Draw the delete icon (X)
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px FontAwesome";
        ctx.fillText("x", left - 5, top + 5);
        ctx.restore();
      }
    },

    visible: false,
  });

  // 遍历所有对象类型并添加删除控件
  fabric.Object.prototype.controls.deleteControl = deleteControl;

  // // 监听对象的选中与取消选中事件来显示/隐藏删除控件
  // fabric.Canvas.prototype.on("before:selection:cleared", function (e) {
  //   (e.target?.controls.deleteControl as any)?.set({ visible: false });
  // });

  // fabric.Canvas.prototype.on("object:selected", function (e) {
  //   (e.target?.controls.deleteControl as any)?.set({ visible: true });
  // });
}
