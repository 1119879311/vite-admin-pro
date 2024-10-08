import { Button, message } from "antd";
import { Canvas, ICanvasOptions } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { CustomEvent } from "../package/events/";
import { EMouseCursor, IcurrentMarkData, actionMode } from "../package/types";
import { ClipMark, RectMark } from "./marks/";
import {
  setGlobalConttrolsPointStyle,
  getElementSize,
  getImageSize,
  loadImage,
  isNotEmptyObject,
  isString,
  configureDeleteControl,
  CustomEventSystem,
  HistoryManager,
  createCustomObjectText,
  isNotEmty,
} from "./util";
import { BehaviorsManager } from "./behaviors/behaviorManager";
import { MarkPluginsManager } from "./marks/marksManager";
import { ZoomInBehavior } from "./behaviors/zoomBehavior";
import { DragBehavior } from "./behaviors/dragBehavior";
import { DrawBehavior } from "./behaviors/drawBehavior";
setGlobalConttrolsPointStyle();
createCustomObjectText();

export class Mark {
  static resigerMarkPlugin = (name, plugin) =>
    MarkPluginsManager.add(name, plugin);

  static resigerBehaviors = (name, plugin) =>
    BehaviorsManager.add(name, plugin);

  canvasIns!: Canvas; // 画布实例
  canvasRef: HTMLCanvasElement; // 画布节点
  canvasWarpRef: Element; // 画布节点外层节点
  imageEle: HTMLImageElement | undefined; // 图片实例
  imageWidth!: number;
  imageHeight!: number;
  imageStatus: "ERROR" | "LOADING" | "SUCCESS" = "LOADING";
  initZoom: number = 1;
  padleft: number = 50;
  padTop: number = 50;
  actionMode: actionMode = actionMode.DISABLE;
  defaultROIStrokeWidth = 5;
  defaultROIStrokeColor = "rgba(0, 255, 0, 1)"; // 默认描边颜色: 绿色
  defaultROIShadowColor = "rgba(0,0,0,0.8)"; // ROI 外区背景颜色: 阴影透明度
  defaultROIFillColor = "rgba(0,0,0,0)"; // 填充颜色: 透明
  drawOption: Record<string, any> = {
    fill: this.defaultROIFillColor,
    strokeWidth: 5,
    strokeColor: this.defaultROIStrokeColor,
  };
  currentMarkData: IcurrentMarkData | null = null;
  markPluginsManager: MarkPluginsManager;
  behaviorsManager: BehaviorsManager;
  historyManager: HistoryManager<any>;
  cursorStackManager: HistoryManager<{
    hoverCursor: EMouseCursor | string;
    moveCursor: EMouseCursor | string;
  }>;
  eventManager: CustomEventSystem;
  constructor(
    canvasRef: HTMLCanvasElement,
    canvasWarpRef: Element,
    options: ICanvasOptions,
    config: Record<string, any> = {
      behaviors: [
        "ZoomInBehavior",
        "DragBehavior",
        {
          name: "DrawBehavior",
          option: {
            isMouseRightSave: true,
            beforeRenderHooK: (option) => {
              console.log("this", this, option);
            },
          },
        },
      ],
      marks: [
        ClipMark.shapeType,
        { name: RectMark.shapeType, option: { markType: "Rect" } },
      ],
    }
  ) {
    this.canvasWarpRef = canvasWarpRef;
    this.canvasRef = canvasRef;
    this.canvasIns = new fabric.Canvas(canvasRef, {
      ...getElementSize(this.canvasWarpRef),
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      isDrawingMode: false,
      ...options,
    });

    this.behaviorsManager = new BehaviorsManager(config.behaviors, this); // 行为管理
    this.markPluginsManager = new MarkPluginsManager(config.marks, this); // 标注管理
    this.historyManager = new HistoryManager(); // 操作历史管理
    this.cursorStackManager = new HistoryManager(); // 鼠标栈历史管理
    this.eventManager = new CustomEventSystem();
    this.loadingPlugins(config.plugins);
    new CustomEvent(this); //注册事件
  }

  loadingPlugins(pluginsIns = []) {
    pluginsIns.forEach((pluginIns: any) => {
      if (typeof pluginIns.init == "function") {
        pluginIns.init(this);
      }
    });
  }

  setActionMode = (value: actionMode) => {
    this.actionMode = value;
    switch (value) {
      case actionMode.DISABLE:
        this.setMouseCursor(EMouseCursor.DISABLED);
        break;
      case actionMode.DRAG:
        this.setMouseCursor(EMouseCursor.MOVE);
        this.behaviorsManager.setBehaviorPriorityBefore(DragBehavior.name);
        break;
      case actionMode.DRAW:
        this.setMouseCursor(EMouseCursor.CROSSHAIR);
        this.behaviorsManager.setBehaviorPriorityBefore(DrawBehavior.name);
        break;
      default:
        break;
    }
  };

  // 设置绘制的配置
  setDrawOption = (
    value: Record<string, any> = {},
    noMerge: boolean = false
  ) => {
    if (noMerge) {
      this.drawOption = value;
    } else {
      this.drawOption = { ...this.drawOption, ...value };
    }
  };

  /**
   * 设置光标类型
   * @param value
   */
  setMouseCursor = (value: EMouseCursor) => {
    this.canvasIns.hoverCursor = value;
    this.cursorStackManager.clear();
    this.cursorStackManager.add({ hoverCursor: value, moveCursor: value });
  };

  /**
   * 记录上一次或者恢复光标类型
   * @param value
   * @returns
   */
  toggelMouseCursor(
    value?: Record<"hoverCursor" | "moveCursor", string | EMouseCursor>
  ) {
    // 入栈
    if (value) {
      let { moveCursor, hoverCursor } = this.canvasIns;
      this.cursorStackManager.add({
        moveCursor: moveCursor as string,
        hoverCursor: hoverCursor as string,
      }); // 记录上一次的鼠标类型
      this.canvasIns.moveCursor = value.moveCursor;
      this.canvasIns.hoverCursor = value.hoverCursor;

      this.canvasIns.requestRenderAll();
      return;
    }
    // 出栈
    let result = this.cursorStackManager.pop();
    if (!result) {
      return;
    }
    this.canvasIns.moveCursor = result.moveCursor;
    this.canvasIns.hoverCursor = result.hoverCursor;
  }

  /**
   * 加载图片实例
   */
  initImage = async (src: string) => {
    this.imageStatus = "LOADING";
    let result: HTMLImageElement | undefined = await loadImage(src).catch(
      () => undefined
    );
    this.imageEle = result;
    if (!result) {
      message.error(`图片加载失败: [ ${src} ]`);
      this.imageStatus = "ERROR";
      return;
    }
    this.imageStatus = "SUCCESS";
    const { width, height } = result;
    this.imageHeight = height;
    this.imageWidth = width;
    const imgInstance = new fabric.Image(result, {
      selectable: false,
      crossOrigin: "anonymous",
      left: 0,
      top: 0,
      width,
      height,
      originX: "left",
      originY: "top",
      /** @ts-ignore  */
      _static_: true,
      data: { isImageShape: true },
      //   scaleX:baseScale,
      //   scaleY:baseScale
    });

    // 如果比例小于1, 说明图片大于canvans的大小，要以最小的比例进行缩小
    const { baseScale } = this.getCanvasWithImageScale({
      padLeft: this.padleft,
      padTop: this.padTop,
    });
    this.initZoom = baseScale;
    this.canvasIns?.setZoom(baseScale);

    this.canvasIns?.add(imgInstance);
    this.canvasIns?.sendToBack(imgInstance); // 基于最低层
    this.setPostionCenter();
    return true;
  };

  /** */
  renderTextLable = (option) => {
    let { text, left, top, paths = [], visible } = option;

    // 矩形

    if (isNotEmty(left) && isNotEmty(top)) {
    } else if (Array.isArray(paths) && paths.length) {
    }
  };

  /**
   * 获取当前图像与画布大小的比例
   * @param padding
   * @returns
   */
  getCanvasWithImageScale(padding = { padLeft: 0, padTop: 0 }): {
    scaleX: number;
    scaleY: number;
    baseScale: number;
  } {
    const canvasSize = getElementSize(this.canvasWarpRef as HTMLElement);
    const imageSize = getImageSize(this.imageEle as HTMLImageElement);
    const scaleX = (canvasSize.width - padding.padLeft * 2) / imageSize.width;
    const scaleY = (canvasSize.height - padding.padTop * 2) / imageSize.height;
    // 如果比例小于1, 说明图片大于canvans的大小，要以最小的比例进行缩小
    let baseScale = 1; //基准缩放比例
    if (scaleX < 1 || scaleY < 1) {
      baseScale = scaleX > scaleY ? scaleY : scaleX;
    }

    return { scaleX, scaleY, baseScale };
  }

  /**
   * 计算图片的缩放数据和偏移
   * 设置居中位置
   */

  setPostionCenter = () => {
    const zoom = this.canvasIns?.getZoom() as number;
    const canvasSize = getElementSize(this.canvasWarpRef as HTMLElement);
    const imageSize = getImageSize(this.imageEle as HTMLImageElement);
    const padleft = (canvasSize.width - imageSize.width * zoom) / 2;
    const padlTop = (canvasSize.height - imageSize.height * zoom) / 2;
    const centerPoint = new fabric.Point(-padleft, -padlTop);
    this.canvasIns?.absolutePan(centerPoint);
  };

  setZoom(zoom, isCenter = true) {
    if (zoom < 0.1) {
      zoom = 0.1;
    } else if (zoom > 5) {
      zoom = 5;
    }
    this.canvasIns?.setZoom(zoom);
    isCenter && this.setPostionCenter();
  }

  upZoom = () => {
    let zoom = this.canvasIns?.getZoom() as number;
    this.setZoom(zoom + 0.05);
  };
  downZoom = () => {
    let zoom = this.canvasIns?.getZoom() as number;
    this.setZoom(zoom - 0.05);
  };

  /**
   * 设置当前正在修改的对象
   * @param data
   */
  setCurrentMarkData(data: IcurrentMarkData | null) {
    this.currentMarkData = data;
  }

  data(data: any[] = []) {
    data.forEach((item) => this.add(item, { forceRender: false }));
    this.canvasIns?.requestRenderAll();
    console.log("all", this.canvasIns?.getObjects());
  }
  executeHandle = (
    eventName: string,
    data: { [key: string]: any },
    ...option: any[]
  ) => {
    const { markPlugins } = this.markPluginsManager;
    let { markType } = data;
    if (markType && markPlugins.has(markType)) {
      let pluginIns = markPlugins.get(markType);
      if (typeof pluginIns[eventName] == "function") {
        pluginIns && pluginIns[eventName](data, option);
        return true;
      }
    }
  };

  add(
    data: { [key: string]: any },
    option: Record<string, any> = { forceRender: true }
  ) {
    let result = this.executeHandle("add", data, option);
    if (!result) {
      this.executeHandle("render", data, option);
      option.forceRender && this.canvasIns?.requestRenderAll();
    }
  }

  delete = (option: {
    id?: string;
    target?: fabric.Object;
    [key: string]: any;
  }) => {
    if (!option.id && !option.target) {
      return false;
    }
    let result = this.executeHandle("delete", option);
    if (result) {
      return;
    }
    let { id, target } = option;
    let deleteObj: any;
    if (id) deleteObj = this.getObjectByAttr(id);
    else if (target) deleteObj = target;
    if (!deleteObj) return;
    this.canvasIns.remove(deleteObj);
    this.canvasIns.requestRenderAll();
  };

  /**
   * 根据id 或者对象进行选中
   */
  selectActive = (option: {
    id?: string;
    target?: fabric.Object;
    [key: string]: any;
  }) => {
    // console.log("selectActive", option);
    if (!option.id && !option.target) {
      return false;
    }

    let result = this.executeHandle("select", option);
    if (result) {
      return;
    }
    let { id, target } = option;
    let newTarget: any = target || this.getObjectByAttr(id);
    if (!newTarget) {
      return;
    }

    let markType = newTarget.get("markType");
    const { markPlugins } = this.markPluginsManager;
    if (!markType || !markPlugins.has(markType)) {
      return;
    }

    let newId = newTarget.get("id");
    let pluginIns = markPlugins.get(markType);
    // 选中，删除原来的
    let pluginData: any[] = [];
    let crrentItem: any;
    pluginIns.data.forEach((item) => {
      if (item.option.id == newId) {
        crrentItem = item;
      } else {
        pluginData.push(item);
      }
    });
    if (!crrentItem) {
      return;
    }
    this.setDrawOption({ markType });
    this.canvasIns.remove(...crrentItem.shapes); // 删除旧对象
    pluginIns.setData(pluginData); // 重新设置数据
    this.canvasIns.add(newTarget);
    this.setCurrentMarkData({
      drawType: "edit",
      markData: crrentItem.option,
      shapeData: [newTarget],
    });
    this.setActive(newTarget);
  };
  /**
   * 选中图形
   * 1. 组内的对象
   * 2. 单独的对象
   */
  setActive(target: fabric.Object) {
    // 激活最上层的对象
    if (!target) {
      return;
    }
    target.set({
      selectable: true,
      hoverCursor: EMouseCursor.POINTER,
      moveCursor: EMouseCursor.MOVE,
    }); // 将对象的selectable属性设置为true
    this.canvasIns.setActiveObject(target); // 设置对象为活动对象
    this.canvasIns.requestRenderAll();
  }

  /**
   * 保存正在编辑的对象
   */
  save = (data: Record<string, any> = {}) => {
    //判断是临时绘制
    let { currentMarkData } = this;
    if (!currentMarkData) {
      return;
    }

    let { markData, shapeData = [], isDraw } = currentMarkData;

    if (!markData.markType) {
      return;
    }
    let newData = { ...markData, ...data };

    // 调用具体的保存逻辑
    let result = this.executeHandle("save", newData);
    if (result) {
      return;
    }
    // 默认保存:判断是新增，还是修改的
    // 判断当前是否右正在绘制的数据
    // 调用对应插件的完成绘制
    this.canvasIns.remove(...shapeData); // 删除缓存的
    this.add(newData, { forceRender: false }); // 重新生成
    this.setCurrentMarkData(null);
    this.canvasIns.discardActiveObject();
    this.canvasIns.requestRenderAll();
  };
  /**
   * 根据属性查找对象
   * @param attr
   */
  getObjectByAttr = <T = any>(value: T, attr: string = "id") => {
    let taregt: fabric.Object | null = null;
    this.canvasIns.forEachObject(function (obj) {
      if (obj[attr] && obj[attr] === value) {
        taregt = obj;
        return false; // 当找到对象时，退出循环
      }
    });
    return taregt;
  };
  /**
   * 根据当前点击的事件，找出对应的对象
   * 组内的对象
   * 单独的对象
   *
   *
   * @param options
   * @returns {groupId,id,target}
   */
  getPointerTarget(options: fabric.IEvent) {
    let canvas = this.canvasIns;

    let clickedObject = canvas.findTarget(options.e, true) as any; // 获取点击位置的对象
    console.log("option", options, clickedObject);
    if (!clickedObject) {
      return null;
    }

    // 不可选中
    if (clickedObject.get("_static_")) {
      return null;
    }

    // 找到最上层的重叠对象（如果有）
    let groupId = null;
    let topObject = clickedObject;
    if (clickedObject && clickedObject.type === "group") {
      groupId = clickedObject.get("id");

      const pointer = canvas.getPointer(options.e);
      // const relativeX = pointer.x - clickedObject.left;
      // const relativeY = pointer.y - clickedObject.top;

      // 从最上层的对象（即最后一个渲染的对象）开始检查
      console.log("clickedObject._objects", clickedObject._objects);
      for (let i = clickedObject._objects.length - 1; i >= 0; i--) {
        const obj = clickedObject._objects[i];

        const localPoint = fabric.util.transformPoint(
          pointer as any,
          fabric.util.invertTransform(obj.calcTransformMatrix())
        );
        if (obj.containsPoint(localPoint)) {
          topObject = obj;
          break; // 退出循环，因为我们已经找到最上层对象
        }
      }
    }

    return {
      groupId,
      id: topObject.get("id"),
      target: topObject,
    };
  }
}

Mark.resigerMarkPlugin(ClipMark.shapeType, ClipMark);
Mark.resigerMarkPlugin(RectMark.shapeType, RectMark);

Mark.resigerBehaviors("ZoomInBehavior", ZoomInBehavior);
Mark.resigerBehaviors("DragBehavior", DragBehavior);
Mark.resigerBehaviors("DrawBehavior", DrawBehavior);
