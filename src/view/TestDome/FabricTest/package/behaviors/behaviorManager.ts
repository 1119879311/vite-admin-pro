import { Mark } from "..";
import { isNotEmptyObject, isString } from "../util";

export class BehaviorsManager {
  static behaviorsMap = new Map();
  static add(name, markPlugin) {
    if (!this.behaviorsMap.has(name) && markPlugin) {
      this.behaviorsMap.set(name, markPlugin);
    }
  }

  behaviorPlugins = new Map();
  markInstance: Mark;
  private globalHandlers: Map<string, (e: fabric.IEvent) => void> = new Map();
  constructor(data = [], markInstance) {
    this.markInstance = markInstance;
    this.addbehaviors(data);
  }

  setBehaviorEnabled(behaviorName: string, enabled: boolean): void {
    const behavior = this.behaviorPlugins.get(behaviorName);
    if (behavior) {
      behavior.setEnable(enabled);
    } else {
      console.warn(`该行为不存在：【'${behaviorName}'】.`);
    }
  }
  /**
   * 单个注册插件实例
   * @param name
   * @param option
   * @returns
   */
  addbehavior = (name, option) => {
    let pluginObj = BehaviorsManager.behaviorsMap.get(name); // 看看注册了哪些行为可以用的
    if (!pluginObj) {
      return null;
    }

    let behaviorIns = new pluginObj(this.markInstance, option);
    this.behaviorPlugins.set(name, behaviorIns); // 取到行为实例化，然后进行事件绑定

    // 绑定事件
    this.resigerEvent(behaviorIns);

    return null;
  };
  /**
   * 多个注册插件
   * @param pluginList
   */
  addbehaviors(pluginList: any[] = []) {
    pluginList.forEach((item) => {
      let name, option;

      if (isNotEmptyObject(item)) {
        name = item.name;
        option = item.option;
      } else if (isString(item)) {
        name = item;
      }

      this.addbehavior(name, option);
    });
  }
  removeBehavior(name) {
    if (!name || !this.behaviorPlugins.has(name)) {
      let behaviorIns = this.behaviorPlugins.get(name);
      this.removeEvent(behaviorIns); // 解绑事件
      this.behaviorPlugins.delete(name);
    }
  }

  // 动态事件绑定，只全局绑定一个
  resigerEvent = (instance) => {
    let eventMap = instance.eventHandlerMap || {}; // 获取事件映射
    for (const eventKey in eventMap) {
      if (!this.globalHandlers.has(eventKey)) {
        const globalHandler = this.createGlobalHandler(eventKey);
        this.globalHandlers.set(eventKey, globalHandler);
        this.markInstance.canvasIns.on(eventKey, globalHandler);
      }
    }
  };
  removeEvent = (instance) => {
    const currentBehaviors = Array.from(this.behaviorPlugins.values());
    let eventMap = instance.eventHandlerMap || {}; // 获取事件映射
    for (const eventKey in eventMap) {
      if (
        this.globalHandlers.has(eventKey) &&
        !currentBehaviors.some((b) => b.eventHandlerMap[eventKey])
      ) {
        this.markInstance.canvasIns.off(
          eventKey,
          this.globalHandlers.get(eventKey)
        );
        this.globalHandlers.delete(eventKey);
      }
    }
  };

  /**
   * 创建事件执行
   * @param eventKey
   * @returns
   */
  private createGlobalHandler(eventKey: string): (e: fabric.IEvent) => void {
    return (e: fabric.IEvent) => {
      let allBehaviors = this.behaviorPlugins.values();
      for (const behavior of allBehaviors) {
        // 获取所有行为下对于的事件
        if (!behavior.enabled) {
          continue;
        }
        let methondName = behavior.eventHandlerMap[eventKey];
        let eventHandle = behavior[methondName];
        if (eventHandle) {
          const consumed = eventHandle.call(behavior, e, this);
          if (consumed === false) {
            // 返回false 中断其他行为
            break; //
          }
        }
      }
    };
  }

  /**
   * 动态修改行为的优先级
   * @param behaviorName
   * @param newPriority
   * @returns
   */
  changeBehaviorPriority(behaviorName: string, newPriority: number): void {
    const behavior = this.behaviorPlugins.get(behaviorName);
    if (!behavior) {
      console.warn(`该行为不存在：【'${behaviorName}'】.`);
      return;
    }
    behavior.setPriority(newPriority);

    // 重新排序行为列表
    this.sortBehaviors();
  }

  /**
   * 优先级排序
   * 值越小，优先级越低
   */
  private sortBehaviors(): void {
    // 将行为Map转换为数组，并根据优先级排序
    // const sortedBehaviors = Array.from(this.behaviorPlugins.entries())
    //   .sort((a, b) => b[1].priority - a[1].priority)
    //   .map((entry) => entry[1]);
    const sortedBehaviors = Array.from(this.behaviorPlugins.entries())
      .sort((a, b) => a[1].priority - b[1].priority)
      .map((entry) => entry[1]);
    // 清空当前的Map，并根据排序后的数组重新填充
    this.behaviorPlugins.clear();
    sortedBehaviors.forEach((behavior) => {
      this.behaviorPlugins.set(behavior.name, behavior);
    });

    // console.log("this.behaviorPlugins", sortedBehaviors, this.behaviorPlugins);
  }

  /**
   * 将某个行为的优先级调整到最高
   */
  setBehaviorPriorityBefore = (behaviorName: string) =>
    this.setBehaviorPriorityBeforeLast(behaviorName, "before");
  setBehaviorPriorityLast = (behaviorName: string) =>
    this.setBehaviorPriorityBeforeLast(behaviorName, "last");
  setBehaviorPriorityBeforeLast = (
    behaviorName: string,
    type: "last" | "before"
  ) => {
    const behavior = this.behaviorPlugins.get(behaviorName);
    // console.log("this.behaviorPlugins", this.behaviorPlugins, behavior);
    if (!behavior) {
      return;
    }

    let allBehaviors = Array.from(this.behaviorPlugins.values());
    let priority: number | null = null;
    if (type == "before") {
      // 找值最小的(优先级最高)
      const highestPriority = Math.min(...allBehaviors.map((b) => b.priority));
      priority = highestPriority - 1;
    } else if (type == "last") {
      const lowestPriority = Math.max(...allBehaviors.map((b) => b.priority));
      priority = lowestPriority + 1;
    }
    if (priority !== null) {
      behavior.setPriority(priority);
      this.sortBehaviors();
    }
  };
}
