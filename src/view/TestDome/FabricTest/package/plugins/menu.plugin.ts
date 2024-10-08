import { Mark } from "..";
export class MenuPlugin {
  instance!: Mark;
  option: Record<string, any>;
  rootEle!: HTMLDivElement;

  selectTarget!: any;
  constructor(option: Record<string, any>) {
    this.option = option;
  }
  init(instance) {
    this.instance = instance;
    this.createRootEle();
    this.instance.canvasIns.on("mouse:down", this.rightMouseDown);
    this.rootEle.addEventListener("click", this.menuClick);
  }
  rightMouseDown = async (opt: fabric.IEvent) => {
    if (opt.button !== 3) {
      return;
    }

    let activeObj = this.instance.canvasIns.getActiveObject();
    if (activeObj || this.instance.currentMarkData) {
      return;
    }
    if (!opt.target) {
      return;
    }
    let { beforeMouseDown } = this.option;
    if (typeof beforeMouseDown == "function") {
      let result = await beforeMouseDown(opt.target, opt);
      if (result === false) {
        return;
      }
    }
    this.selectTarget = this.instance.getPointerTarget(opt);

    opt.e.preventDefault();
    opt.e.stopPropagation();
    let { diffX = 0, diffY = 10, context } = this.option;
    // 或者鼠标的坐标
    let { x, y } = opt.pointer || { x: 0, y: 0 };
    // let menuW= this.rootEle.offsetWidth;
    // let menuH = this.rootEle.offsetHeight;
    this.setStyles({
      display: "block",
      left: `${x - diffX}px`,
      top: `${y + diffY}px`,
    });

    this.rootEle.innerHTML = context?.(opt);
    return false;
  };

  setStyles = (data: Partial<CSSStyleDeclaration>) => {
    for (const key in data) {
      this.rootEle.style[key] = data[key] as any;
    }
  };

  onClose = () => {
    // this.setStyles({display:"none"})
    this.rootEle.innerHTML = ""; // 关闭回调
  };

  menuClick = (e: any) => {
    let target = e.target as any;
    let { id } = target?.dataset || {};
    const { actions = {} } = this.option;
    // console.log("item", id, e, this.selectTarget); // 获取点击位置的对象);
    let actionCallback = actions[id];

    switch (id) {
      case "close":
        this.onClose();
        break;
    }
    if (typeof actionCallback !== "function") {
      return;
    }
    actionCallback({
      instance: this.instance,
      e,
      selectTarget: this.selectTarget,
      onClose: this.onClose,
    });
  };

  createRootEle = () => {
    if (!this.rootEle) {
      this.rootEle = document.createElement("div");
      this.rootEle.style.position = "absolute";
      this.rootEle.style.display = "none";
    }
    this.instance.canvasWarpRef.appendChild(this.rootEle);
  };
}
