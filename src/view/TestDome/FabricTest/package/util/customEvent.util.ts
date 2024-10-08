/**
 *  事件发布订阅
 */

export class CustomEventSystem {
  eventQueue: Record<string, Function[]>;

  constructor() {
    this.eventQueue = {};
  }

  /**
   * 发布/ 触发
   * @param eventName
   * @param args
   */
  emit(eventName, ...args) {
    const callbackList = this.eventQueue[eventName] || [];
    callbackList.forEach((fn) => fn.apply(this, args));
    return this;
  }

  /**
   * 订阅/监听
   * @param eventName
   * @param callback
   */
  on(eventName, callback) {
    const callbackList = this.eventQueue[eventName] || [];
    callback && callbackList.push(callback);
    this.eventQueue[eventName] = callbackList;
    return this;
  }
  /**
   * 清空单个监听
   * @param eventName
   * @param callback
   * @returns
   */
  remove(eventName, fn) {
    if (typeof fn === "function") {
      let callbackList = this.eventQueue[eventName] || [];
      this.eventQueue[eventName] = callbackList.filter((item) => item !== fn);
    } else {
      delete this.eventQueue[eventName];
    }

    return this;
  }
  /**
   * 清空所有事件监听
   * @returns
   */
  clear() {
    this.eventQueue = {};
    return this;
  }
}
